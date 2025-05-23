/**
 * ServicePlan Pro - Security Middleware
 * 
 * This file implements security best practices for the API server:
 * - Helmet for HTTP security headers
 * - Rate limiting to prevent abuse
 * - CSRF protection for non-GET requests
 * - Content security policy customization
 */

import { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';

/**
 * Configure security middleware for the Express application
 */
export function setupSecurity(app: Express): void {
  // Apply Helmet security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "js.stripe.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "*.stripe.com"],
          connectSrc: ["'self'", "api.stripe.com"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["js.stripe.com"],
          frameAncestors: getFrameAncestors(),
        },
      },
    })
  );

  // Apply rate limiting
  const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: getMaxRequestsPerWindow(), // Limit each IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again after 5 minutes',
  });

  // Apply rate limiting to API routes
  app.use('/api/', apiLimiter);

  // Apply CSRF protection for non-Stripe webhook routes
  const csrfProtection = csurf({ cookie: true });
  
  // Apply CSRF protection to all routes except webhooks
  app.use((req, res, next) => {
    // Skip CSRF for Stripe webhook
    if (req.path === '/api/stripe/webhook') {
      return next();
    }
    
    // Apply CSRF protection to all other routes
    return csrfProtection(req, res, next);
  });

  // Add CSRF token to all responses
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path !== '/api/stripe/webhook' && req.csrfToken) {
      res.locals.csrfToken = req.csrfToken();
    }
    next();
  });
  
  // Error handler for CSRF errors
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({
        error: 'Invalid CSRF token',
        message: 'Form submission failed due to invalid security token. Please refresh the page and try again.',
      });
    }
    next(err);
  });
}

/**
 * Get frame-ancestors directive based on environment configuration
 */
function getFrameAncestors(): string[] {
  const frameAncestors = process.env.ALLOWED_FRAME_ANCESTORS || 'self';
  return frameAncestors.split(',').map(domain => domain.trim());
}

/**
 * Get maximum requests per window based on environment
 */
function getMaxRequestsPerWindow(): number {
  const defaultLimit = process.env.NODE_ENV === 'production' ? 100 : 500;
  const configuredLimit = parseInt(process.env.RATE_LIMIT || '', 10);
  return isNaN(configuredLimit) ? defaultLimit : configuredLimit;
}