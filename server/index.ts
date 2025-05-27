import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// Enable trust proxy for secure cookies behind reverse proxy
app.set('trust proxy', 1);

// ==== SECURITY MIDDLEWARE ====

// Helmet middleware for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.zippopotam.us"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for widget functionality
  frameguard: {
    action: 'sameorigin' // Changed from ALLOWALL to SAMEORIGIN for security
  }
}));

// Rate limiting: 100 requests per 5 minutes per IP (relaxed in development)
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: process.env.NODE_ENV === 'development' ? 500 : 100, // Higher limit in development
  message: {
    error: 'Too many requests from this IP, please try again in 5 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for webhook endpoints (they have their own verification)
  skip: (req) => req.path.startsWith('/api/webhook')
});

app.use(limiter);

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again in 15 minutes.'
  }
});

app.use('/api/auth', authLimiter);

// Direct health check endpoint (no rate limiting)
app.get('/api/healthz', async (req, res) => {
  try {
    // Simple health check response
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB'
      }
    };
    
    res.status(200).json(healthData);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Health check failed'
    });
  }
});

// Cookie parser middleware (required for CSRF)
app.use(cookieParser());

// Configure session management with memory store
// Configure session store - PostgreSQL for production, Memory for development
const sessionStore = (() => {
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    const PgSession = connectPgSimple(session);
    return new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session',
      createTableIfMissing: true,
    });
  } else {
    const MemoryStore = createMemoryStore(session);
    return new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }
})();

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict'
  },
  name: 'serviceplan.sid' // Custom session name for branding
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// CSRF Protection for forms (skip for webhooks and API endpoints that need raw body)
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Apply CSRF protection to all routes except webhooks and specific API endpoints
app.use((req, res, next) => {
  // Skip CSRF for Stripe webhooks (they use signature verification)
  if (req.path.startsWith('/api/webhook')) {
    return next();
  }
  
  // Skip CSRF for all Stripe API routes
  if (req.path.startsWith('/api/stripe')) {
    return next();
  }
  
  // Skip CSRF for GET requests to API endpoints (read-only operations)
  if (req.method === 'GET' && req.path.startsWith('/api/')) {
    return next();
  }
  
  // Apply CSRF protection to all other requests
  csrfProtection(req, res, next);
});

// Add security headers
app.use((req, res, next) => {
  // Prevent clickjacking attacks - only allow same origin framing
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Content Security Policy for frame ancestors
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// CSRF protection is already handled above - this duplicate block removed

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
