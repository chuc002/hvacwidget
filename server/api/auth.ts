import { Router } from 'express';
import { storage } from '../storage';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { z } from 'zod';

const router = Router();
const scryptAsync = promisify(scrypt);

// Extend session data type
declare module 'express-session' {
  interface SessionData {
    customerId?: number;
    customerEmail?: string;
    isAuthenticated?: boolean;
  }
}

// Password hashing utility
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

// Password verification utility
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [hashed, salt] = hashedPassword.split('.');
    const hashedBuf = Buffer.from(hashed, 'hex');
    const suppliedBuf = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    return false;
  }
}

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Register a new customer
 */
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // Check if customer already exists
    const existingCustomer = await storage.getCustomerByEmail(validatedData.email);
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create new customer with hashed password
    const customer = await storage.createCustomer({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      password: hashedPassword
    });

    // Set session data
    req.session.customerId = customer.id;
    req.session.customerEmail = customer.email;
    req.session.isAuthenticated = true;

    // Return customer data (without password)
    const { password, ...customerData } = customer;
    res.status(201).json({
      message: 'Registration successful',
      customer: customerData
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

/**
 * Login customer
 */
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    // Find customer by email
    const customer = await storage.getCustomerByEmail(validatedData.email);
    if (!customer || !customer.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, customer.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Set session data
    req.session.customerId = customer.id;
    req.session.customerEmail = customer.email;
    req.session.isAuthenticated = true;

    // Return customer data (without password)
    const { password, ...customerData } = customer;
    res.json({
      message: 'Login successful',
      customer: customerData
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

/**
 * Logout customer
 */
router.post('/logout', (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.status(400).json({ message: 'Not logged in' });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: 'Logout successful' });
  });
});

/**
 * Get current customer session
 */
router.get('/me', async (req, res) => {
  if (!req.session.isAuthenticated || !req.session.customerId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const customer = await storage.getCustomerById(req.session.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Return customer data (without password)
    const { password, ...customerData } = customer;
    res.json({ customer: customerData });

  } catch (error) {
    console.error('Get current customer error:', error);
    res.status(500).json({ message: 'Failed to get customer data' });
  }
});

/**
 * Middleware to check authentication
 */
export function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.isAuthenticated || !req.session?.customerId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

/**
 * Middleware to check if customer has an active subscription
 */
export async function requireActiveSubscription(req: any, res: any, next: any) {
  if (!req.session?.customerId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const customer = await storage.getCustomerById(req.session.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const subscriptions = await storage.getSubscriptionsByCustomerId(customer.id);
    const activeSubscription = subscriptions.find(sub => sub.status === 'active');

    if (!activeSubscription) {
      return res.status(403).json({ 
        message: 'Active subscription required',
        customerStatus: 'trial',
        upgradeMessage: 'Please upgrade to a paid plan to access this feature'
      });
    }

    // Add customer and subscription info to request for route handlers
    req.customer = customer;
    req.subscription = activeSubscription;
    next();
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Get current customer session with subscription status
 */
router.get('/session', async (req, res) => {
  try {
    if (!req.session?.isAuthenticated || !req.session?.customerId) {
      return res.json({ 
        isAuthenticated: false,
        customer: null,
        subscriptionStatus: 'none'
      });
    }

    const customer = await storage.getCustomerById(req.session.customerId);
    if (!customer) {
      req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
      });
      return res.json({ 
        isAuthenticated: false,
        customer: null,
        subscriptionStatus: 'none'
      });
    }

    // Get subscription status
    const subscriptions = await storage.getSubscriptionsByCustomerId(customer.id);
    const activeSubscription = subscriptions.find(sub => sub.status === 'active');
    
    const subscriptionStatus = activeSubscription ? 'active' : 'trial';

    // Remove sensitive data
    const { password, ...customerWithoutPassword } = customer;

    res.json({
      isAuthenticated: true,
      customer: customerWithoutPassword,
      subscriptionStatus,
      subscription: activeSubscription || null
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;