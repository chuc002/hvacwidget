import {
  customers, plans, subscriptions, subscriptionLinks, adminUsers,
  type Customer, type InsertCustomer,
  type Plan, type InsertPlan,
  type Subscription, type InsertSubscription,
  type SubscriptionLink, type InsertSubscriptionLink,
  type AdminUser, type InsertAdminUser
} from "@shared/schema";
import { eq, and, gt, lt, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { createClient } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

// Interface for CRUD operations
export interface IStorage {
  // Customer operations
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  getCustomerByStripeId(stripeCustomerId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomerStripeId(id: number, stripeCustomerId: string): Promise<Customer>;

  // Plan operations
  getPlans(): Promise<Plan[]>;
  getPlanById(id: number): Promise<Plan | undefined>;
  getPlanByName(name: string): Promise<Plan | undefined>;

  // Subscription operations
  getSubscriptions(): Promise<Subscription[]>;
  getSubscriptionById(id: number): Promise<Subscription | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  getSubscriptionsByCustomerId(customerId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscriptionStatus(id: number, status: string): Promise<Subscription>;
  updateSubscriptionPeriod(id: number, startDate: Date, endDate: Date): Promise<Subscription>;
  updateSubscriptionStripeId(id: number, stripeSubscriptionId: string): Promise<Subscription>;

  // Subscription link operations
  createSubscriptionLink(link: InsertSubscriptionLink): Promise<SubscriptionLink>;
  getSubscriptionLinkByToken(token: string): Promise<SubscriptionLink | undefined>;
  markSubscriptionLinkAsUsed(id: number): Promise<SubscriptionLink>;
  getActiveSubscriptionLinks(): Promise<SubscriptionLink[]>;

  // Admin user operations
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  verifyAdminCredentials(email: string, password: string): Promise<AdminUser | undefined>;
}

// In-memory storage implementation for development/testing
export class MemStorage implements IStorage {
  private customerMap: Map<number, Customer>;
  private planMap: Map<number, Plan>;
  private subscriptionMap: Map<number, Subscription>;
  private subscriptionLinkMap: Map<number, SubscriptionLink>;
  private adminUserMap: Map<number, AdminUser>;
  private currentIds: Record<string, number>;

  constructor() {
    this.customerMap = new Map();
    this.planMap = new Map();
    this.subscriptionMap = new Map();
    this.subscriptionLinkMap = new Map();
    this.adminUserMap = new Map();
    this.currentIds = {
      customer: 1,
      plan: 1,
      subscription: 1,
      subscriptionLink: 1,
      adminUser: 1,
    };

    // Initialize with default plans
    this.initializePlans();
    this.initializeAdminUser();
  }

  private initializePlans() {
    const plans: InsertPlan[] = [
      {
        name: "Basic",
        description: "Basic maintenance plan with per-visit pricing",
        price: "129",
        interval: "one-time",
        features: [
          "Comprehensive system check",
          "Filter replacement (standard)",
          "System cleaning"
        ],
        isPopular: false,
        order: 1,
        stripePriceId: "price_basic"
      },
      {
        name: "Standard",
        description: "Annual maintenance plan with two visits per year",
        price: "225",
        interval: "year",
        features: [
          "Two maintenance visits per year",
          "Priority scheduling",
          "15% discount on repairs",
          "Filter subscription (4 filters/year)"
        ],
        isPopular: true,
        order: 2,
        stripePriceId: "price_standard"
      },
      {
        name: "Premium",
        description: "Premium monthly maintenance plan with 24/7 support",
        price: "20",
        interval: "month",
        features: [
          "Two maintenance visits per year",
          "24/7 emergency service",
          "25% discount on repairs",
          "Premium filter subscription",
          "Extended parts warranty"
        ],
        isPopular: false,
        order: 3,
        stripePriceId: "price_premium"
      }
    ];

    plans.forEach(plan => {
      this.createPlan(plan);
    });
  }

  private initializeAdminUser() {
    // Create a default admin user
    this.createAdminUser({
      email: "admin@example.com",
      passwordHash: "password123", // In a real app, this would be properly hashed
      name: "Admin User",
      role: "admin"
    });
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customerMap.values());
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    return this.customerMap.get(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return Array.from(this.customerMap.values()).find(
      (customer) => customer.email === email
    );
  }

  async getCustomerByStripeId(stripeCustomerId: string): Promise<Customer | undefined> {
    return Array.from(this.customerMap.values()).find(
      (customer) => customer.stripeCustomerId === stripeCustomerId
    );
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.currentIds.customer++;
    const newCustomer: Customer = { ...customer, id, createdAt: new Date(), stripeCustomerId: null };
    this.customerMap.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomerStripeId(id: number, stripeCustomerId: string): Promise<Customer> {
    const customer = this.customerMap.get(id);
    if (!customer) throw new Error(`Customer with ID ${id} not found`);
    
    const updatedCustomer = { ...customer, stripeCustomerId };
    this.customerMap.set(id, updatedCustomer);
    return updatedCustomer;
  }

  // Plan operations
  async getPlans(): Promise<Plan[]> {
    return Array.from(this.planMap.values()).sort((a, b) => a.order - b.order);
  }

  async getPlanById(id: number): Promise<Plan | undefined> {
    return this.planMap.get(id);
  }

  async getPlanByName(name: string): Promise<Plan | undefined> {
    return Array.from(this.planMap.values()).find(
      (plan) => plan.name === name
    );
  }

  private async createPlan(plan: InsertPlan): Promise<Plan> {
    const id = this.currentIds.plan++;
    const newPlan: Plan = { ...plan, id };
    this.planMap.set(id, newPlan);
    return newPlan;
  }

  // Subscription operations
  async getSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptionMap.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    return this.subscriptionMap.get(id);
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptionMap.values()).find(
      (subscription) => subscription.stripeSubscriptionId === stripeSubscriptionId
    );
  }

  async getSubscriptionsByCustomerId(customerId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptionMap.values()).filter(
      (subscription) => subscription.customerId === customerId
    ).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentIds.subscription++;
    const newSubscription: Subscription = { 
      ...subscription, 
      id, 
      createdAt: new Date(),
      canceledAt: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
    };
    this.subscriptionMap.set(id, newSubscription);
    return newSubscription;
  }

  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription> {
    const subscription = this.subscriptionMap.get(id);
    if (!subscription) throw new Error(`Subscription with ID ${id} not found`);
    
    const updatedSubscription: Subscription = { 
      ...subscription, 
      status,
      canceledAt: status === 'cancelled' ? new Date() : subscription.canceledAt
    };
    this.subscriptionMap.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async updateSubscriptionPeriod(id: number, startDate: Date, endDate: Date): Promise<Subscription> {
    const subscription = this.subscriptionMap.get(id);
    if (!subscription) throw new Error(`Subscription with ID ${id} not found`);
    
    const updatedSubscription: Subscription = { 
      ...subscription, 
      currentPeriodStart: startDate,
      currentPeriodEnd: endDate
    };
    this.subscriptionMap.set(id, updatedSubscription);
    return updatedSubscription;
  }

  async updateSubscriptionStripeId(id: number, stripeSubscriptionId: string): Promise<Subscription> {
    const subscription = this.subscriptionMap.get(id);
    if (!subscription) throw new Error(`Subscription with ID ${id} not found`);
    
    const updatedSubscription: Subscription = { 
      ...subscription, 
      stripeSubscriptionId
    };
    this.subscriptionMap.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Subscription link operations
  async createSubscriptionLink(link: InsertSubscriptionLink): Promise<SubscriptionLink> {
    const id = this.currentIds.subscriptionLink++;
    const newLink: SubscriptionLink = { 
      ...link, 
      id, 
      createdAt: new Date(),
      isUsed: false
    };
    this.subscriptionLinkMap.set(id, newLink);
    return newLink;
  }

  async getSubscriptionLinkByToken(token: string): Promise<SubscriptionLink | undefined> {
    return Array.from(this.subscriptionLinkMap.values()).find(
      (link) => link.token === token
    );
  }

  async markSubscriptionLinkAsUsed(id: number): Promise<SubscriptionLink> {
    const link = this.subscriptionLinkMap.get(id);
    if (!link) throw new Error(`Subscription link with ID ${id} not found`);
    
    const updatedLink: SubscriptionLink = { ...link, isUsed: true };
    this.subscriptionLinkMap.set(id, updatedLink);
    return updatedLink;
  }

  async getActiveSubscriptionLinks(): Promise<SubscriptionLink[]> {
    const now = new Date();
    return Array.from(this.subscriptionLinkMap.values())
      .filter(link => !link.isUsed && link.expiresAt > now)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Admin user operations
  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUserMap.values()).find(
      (user) => user.email === email
    );
  }

  async verifyAdminCredentials(email: string, password: string): Promise<AdminUser | undefined> {
    const user = await this.getAdminUserByEmail(email);
    // In a real app, this would properly compare hashed passwords
    if (user && user.passwordHash === password) {
      return user;
    }
    return undefined;
  }

  private async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const id = this.currentIds.adminUser++;
    const newUser: AdminUser = { ...user, id, createdAt: new Date() };
    this.adminUserMap.set(id, newUser);
    return newUser;
  }
}

// Database storage implementation for production
export class DbStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const client = createClient({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(client);
  }

  // Customer operations
  async getCustomers(): Promise<Customer[]> {
    return this.db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const results = await this.db.select().from(customers).where(eq(customers.id, id));
    return results[0];
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const results = await this.db.select().from(customers).where(eq(customers.email, email));
    return results[0];
  }

  async getCustomerByStripeId(stripeCustomerId: string): Promise<Customer | undefined> {
    const results = await this.db.select().from(customers).where(eq(customers.stripeCustomerId, stripeCustomerId));
    return results[0];
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const results = await this.db.insert(customers).values(customer).returning();
    return results[0];
  }

  async updateCustomerStripeId(id: number, stripeCustomerId: string): Promise<Customer> {
    const results = await this.db
      .update(customers)
      .set({ stripeCustomerId })
      .where(eq(customers.id, id))
      .returning();
    return results[0];
  }

  // Plan operations
  async getPlans(): Promise<Plan[]> {
    return this.db.select().from(plans).orderBy(plans.order);
  }

  async getPlanById(id: number): Promise<Plan | undefined> {
    const results = await this.db.select().from(plans).where(eq(plans.id, id));
    return results[0];
  }

  async getPlanByName(name: string): Promise<Plan | undefined> {
    const results = await this.db.select().from(plans).where(eq(plans.name, name));
    return results[0];
  }

  // Subscription operations
  async getSubscriptions(): Promise<Subscription[]> {
    return this.db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    const results = await this.db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return results[0];
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    const results = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
    return results[0];
  }

  async getSubscriptionsByCustomerId(customerId: number): Promise<Subscription[]> {
    return this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.customerId, customerId))
      .orderBy(desc(subscriptions.createdAt));
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const results = await this.db.insert(subscriptions).values(subscription).returning();
    return results[0];
  }

  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription> {
    const updateData: Partial<Subscription> = { status };
    
    if (status === 'cancelled') {
      updateData.canceledAt = new Date();
    }
    
    const results = await this.db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning();
    return results[0];
  }

  async updateSubscriptionPeriod(id: number, startDate: Date, endDate: Date): Promise<Subscription> {
    const results = await this.db
      .update(subscriptions)
      .set({
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate
      })
      .where(eq(subscriptions.id, id))
      .returning();
    return results[0];
  }

  async updateSubscriptionStripeId(id: number, stripeSubscriptionId: string): Promise<Subscription> {
    const results = await this.db
      .update(subscriptions)
      .set({ stripeSubscriptionId })
      .where(eq(subscriptions.id, id))
      .returning();
    return results[0];
  }

  // Subscription link operations
  async createSubscriptionLink(link: InsertSubscriptionLink): Promise<SubscriptionLink> {
    const results = await this.db.insert(subscriptionLinks).values(link).returning();
    return results[0];
  }

  async getSubscriptionLinkByToken(token: string): Promise<SubscriptionLink | undefined> {
    const results = await this.db
      .select()
      .from(subscriptionLinks)
      .where(eq(subscriptionLinks.token, token));
    return results[0];
  }

  async markSubscriptionLinkAsUsed(id: number): Promise<SubscriptionLink> {
    const results = await this.db
      .update(subscriptionLinks)
      .set({ isUsed: true })
      .where(eq(subscriptionLinks.id, id))
      .returning();
    return results[0];
  }

  async getActiveSubscriptionLinks(): Promise<SubscriptionLink[]> {
    const now = new Date();
    return this.db
      .select()
      .from(subscriptionLinks)
      .where(
        and(
          eq(subscriptionLinks.isUsed, false),
          gt(subscriptionLinks.expiresAt, now)
        )
      )
      .orderBy(desc(subscriptionLinks.createdAt));
  }

  // Admin user operations
  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const results = await this.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email));
    return results[0];
  }

  async verifyAdminCredentials(email: string, password: string): Promise<AdminUser | undefined> {
    // In a real app, this would properly compare hashed passwords
    const user = await this.getAdminUserByEmail(email);
    if (user && user.passwordHash === password) {
      return user;
    }
    return undefined;
  }
}

// Export storage instance based on environment
export const storage = process.env.DATABASE_URL 
  ? new DbStorage()
  : new MemStorage();
