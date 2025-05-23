/**
 * ServicePlan Pro - Health Check Routes
 * 
 * This file contains health check endpoints for monitoring and deployment systems.
 * It provides basic health status and detailed system information.
 */

import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { version } from '../../package.json';

const router = Router();

/**
 * Basic health check endpoint
 * GET /api/health
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    const dbHealthy = await checkDatabaseHealth();
    
    // Generate health status
    const status = {
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: version,
      environment: process.env.NODE_ENV || 'development',
    };
    
    // Return appropriate status code based on health
    const statusCode = dbHealthy ? 200 : 503;
    res.status(statusCode).json(status);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
    });
  }
});

/**
 * Detailed health status (protected)
 * GET /api/health/details
 */
router.get('/details', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    const dbHealthy = await checkDatabaseHealth();
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    
    // Get system uptime
    const uptime = process.uptime();
    
    // Generate detailed status
    const detailedStatus = {
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: version,
      environment: process.env.NODE_ENV || 'development',
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime),
      },
      memory: {
        rss: formatBytes(memoryUsage.rss),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        heapUsed: formatBytes(memoryUsage.heapUsed),
        external: formatBytes(memoryUsage.external),
      },
      database: {
        healthy: dbHealthy,
      },
    };
    
    res.status(dbHealthy ? 200 : 503).json(detailedStatus);
  } catch (error) {
    console.error('Detailed health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Detailed health check failed',
    });
  }
});

/**
 * Check database health
 */
async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Simple query to check database connection
    const plans = await storage.getPlans();
    return Array.isArray(plans);
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format uptime in days, hours, minutes, seconds
 */
function formatUptime(uptime: number): string {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  
  return parts.join(' ');
}

export default router;