# HVAC Maintenance Plans Subscription System

## Overview

This is a full-stack web application for managing HVAC maintenance subscription plans. The system allows customers to view, select, and purchase subscription plans through an intuitive interface. It includes a customer-facing subscription widget, an admin dashboard for managing subscriptions, and integration with Stripe for payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern web architecture pattern:

1. **Frontend**: React-based SPA using Vite for build tooling
2. **Backend**: Express.js REST API server
3. **Database**: PostgreSQL database with Drizzle ORM
4. **State Management**: React Query for server state
5. **UI Components**: ShadCN UI components powered by Radix UI primitives
6. **Payment Processing**: Stripe integration for handling subscription payments

The application is structured with clear separation between client, server, and shared code. The shared directory contains schemas and types that are used by both the frontend and backend.

## Key Components

### Frontend Components

1. **SubscriptionWidget**: The core component allowing users to select and purchase plans
2. **Admin Dashboard**: Interface for administrators to manage subscriptions and customers
3. **Homepage**: Marketing landing page with subscription information
4. **Layout**: Shared page layout and navigation
5. **UI Components**: Comprehensive set of reusable UI components from ShadCN/Radix UI

### Backend Components

1. **Express Server**: Handles HTTP requests and API endpoints
2. **Database Interface**: Storage layer using Drizzle ORM with PostgreSQL
3. **Stripe Integration**: Payment processing and subscription management
4. **API Routes**: Endpoints for plans, subscriptions, and customer management

### Database Schema

The database schema includes the following main tables:

1. **customers**: Stores customer information (name, email, phone)
2. **plans**: Defines available subscription plans and pricing
3. **subscriptions**: Tracks customer subscriptions and their status
4. **subscriptionLinks**: Manages unique subscription invitation links

## Data Flow

### Subscription Flow

1. User visits the site and views available maintenance plans
2. User selects a plan and enters their information
3. System creates a checkout session with Stripe
4. User completes payment on Stripe's hosted checkout page
5. Stripe webhooks notify the system of successful payment
6. System creates subscription record and sends confirmation

### Admin Flow

1. Admin logs into the dashboard
2. Admin can view and manage customers, subscriptions, and plans
3. Admin can generate subscription links for specific customers/plans
4. Admin can view analytics and reports on subscription performance

## External Dependencies

### Frontend

1. **React**: UI library for building the interface
2. **Wouter**: Lightweight routing solution
3. **TanStack Query**: Data fetching and state management
4. **Radix UI**: Accessible UI primitives
5. **ShadCN UI**: Component library built on Radix
6. **Tailwind CSS**: Utility-first CSS framework
7. **Stripe.js**: Frontend Stripe integration

### Backend

1. **Express**: Web server framework
2. **Drizzle ORM**: TypeScript ORM for database operations
3. **Stripe API**: Payment processing
4. **Neon Serverless**: PostgreSQL database client
5. **Zod**: Schema validation

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**: Vite builds the frontend, and esbuild bundles the server
2. **Production Server**: Serves static assets and API from a single Node.js process
3. **Database**: Uses PostgreSQL (likely Neon.tech based on the dependencies)
4. **Environment Variables**: Required for database connection and Stripe API keys

For deployment, the system will:

1. Build the frontend assets
2. Bundle the server code
3. Serve the bundled application
4. Connect to the PostgreSQL database

## Getting Started

To run the application locally:

1. Ensure PostgreSQL is available (the application will use the `DATABASE_URL` environment variable)
2. Set up Stripe API keys through environment variables
3. Run `npm run dev` to start the development server
4. Access the application at http://localhost:5000

To add initial data to the database, you'll need to define and run migrations using Drizzle's migration tools.