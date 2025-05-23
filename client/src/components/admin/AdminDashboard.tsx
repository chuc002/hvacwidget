import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubscriptionsTable from "@/components/admin/SubscriptionsTable";
import CustomersTable from "@/components/admin/CustomersTable";
import GenerateLinks from "@/components/admin/GenerateLinks";
import EmbedGenerator from "@/components/admin/EmbedGenerator";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("subscriptions");

  return (
    <div id="admin-dashboard" className="bg-white rounded-xl shadow-md p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <Button 
          id="logout-btn" 
          variant="outline" 
          onClick={onLogout}
          className="px-4 py-2 text-sm"
        >
          Logout
        </Button>
      </div>
      
      <Tabs 
        defaultValue="subscriptions" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="generate-links">Generate Links</TabsTrigger>
          <TabsTrigger value="embed">Embed Widget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions">
          <SubscriptionsTable />
        </TabsContent>
        
        <TabsContent value="customers">
          <CustomersTable />
        </TabsContent>
        
        <TabsContent value="generate-links">
          <GenerateLinks />
        </TabsContent>
        
        <TabsContent value="embed">
          <EmbedGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
