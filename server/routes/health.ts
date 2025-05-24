import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

/**
 * Health check endpoint for monitoring
 * Returns:
 * - status: overall system status (ok, degraded, error)
 * - database: database connection status
 * - uptime: server uptime in seconds
 * - memory: memory usage statistics
 */
router.get('/healthz', async (req, res) => {
  const startTime = process.hrtime();

  let dbStatus = 'error';
  let overallStatus = 'ok';
  let dbError = null;

  // Check database connection
  try {
    // Test query via storage layer - this tests the Neon connection
    await storage.getPlans();
    dbStatus = 'ok';
  } catch (error: any) {
    dbStatus = 'error';
    dbError = error.message;
    overallStatus = 'degraded';
  }

  // Get memory usage
  const memoryUsage = process.memoryUsage();
  
  // Calculate request processing time
  const endTime = process.hrtime(startTime);
  const processingTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
  
  // Construct response
  const healthData = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      error: dbError
    },
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB', // Resident Set Size
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
    },
    processingTimeMs
  };

  // Set appropriate status code
  const statusCode = overallStatus === 'ok' ? 200 : 
                     overallStatus === 'degraded' ? 200 : 500;
  
  res.status(statusCode).json(healthData);
});

export default router;