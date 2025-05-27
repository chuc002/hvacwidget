import { Router } from "express";
import { storage } from "../storage";
import { z } from "zod";

const router = Router();

// Schema for customer customization data
const customizationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  defaultSelectedPlan: z.string().optional(),
  showPricesOnWidget: z.boolean().default(true),
});

// Get current customer information
router.get("/me", async (req, res) => {
  try {
    // In a real implementation, you'd get the customer ID from the authenticated session
    // For now, we'll use a placeholder approach
    const customerId = req.query.customerId || 1; // This should come from auth
    
    const customer = await storage.getCustomerById(Number(customerId));
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Failed to fetch customer information" });
  }
});

// Update customer customization settings
router.put("/customization", async (req, res) => {
  try {
    const validatedData = customizationSchema.parse(req.body);
    const customerId = req.query.customerId || 1; // This should come from auth
    
    // Update customer with customization data
    const updatedCustomer = await storage.updateCustomerCustomization(
      Number(customerId),
      validatedData
    );

    res.json(updatedCustomer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    
    console.error("Error updating customer customization:", error);
    res.status(500).json({ error: "Failed to update customization" });
  }
});

// Complete onboarding process
router.post("/complete-onboarding", async (req, res) => {
  try {
    const customerId = req.query.customerId || 1; // This should come from auth
    
    const updatedCustomer = await storage.updateCustomerOnboardingStatus(
      Number(customerId),
      true
    );

    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
});

// Create trial customer (used during signup)
router.post("/create-trial", async (req, res) => {
  try {
    const customerData = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      companyName: z.string().optional(),
      companyUrl: z.string().url().optional().or(z.literal("")),
      phone: z.string().optional(),
    }).parse(req.body);

    // Set trial expiration to 14 days from now
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const newCustomer = await storage.createCustomer({
      ...customerData,
      password: "", // Will be set during full registration
      isTrialUser: true,
      trialEndsAt,
      onboardingCompleted: false,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    
    console.error("Error creating trial customer:", error);
    res.status(500).json({ error: "Failed to create trial customer" });
  }
});

export default router;