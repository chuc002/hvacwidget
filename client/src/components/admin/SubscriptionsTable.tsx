import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function SubscriptionsTable() {
  const [planFilter, setPlanFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("30");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch subscriptions data
  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ['/api/subscriptions'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading subscriptions. Please try again later.</p>
      </div>
    );
  }

  // Filter subscriptions based on selected filters
  const filterSubscriptions = () => {
    if (!subscriptions) return [];

    let filtered = [...subscriptions];

    // Filter by plan
    if (planFilter !== "all") {
      filtered = filtered.filter(sub => sub.plan?.name.toLowerCase() === planFilter.toLowerCase());
    }

    // Filter by date
    if (dateFilter !== "all") {
      const days = parseInt(dateFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(sub => {
        const createdAt = new Date(sub.createdAt);
        return createdAt >= cutoffDate;
      });
    }

    return filtered;
  };

  const filteredSubscriptions = filterSubscriptions();
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const currentSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to format price display
  const formatPrice = (subscription: any) => {
    if (!subscription.plan) return '-';
    
    const price = parseFloat(subscription.plan.price);
    const interval = subscription.plan.interval;
    
    if (interval === 'month') {
      return `$${price}/mo`;
    } else if (interval === 'year') {
      return `$${price}/yr`;
    } else {
      return `$${price}`;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Recent Subscriptions</h3>
        <div className="flex gap-2">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSubscriptions.length > 0 ? (
              currentSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subscription.customer?.name || '-'}</div>
                      <div className="text-sm text-gray-500">{subscription.customer?.email || '-'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      subscription.plan?.name === 'Premium' ? 'default' :
                      subscription.plan?.name === 'Standard' ? 'secondary' :
                      'outline'
                    }>
                      {subscription.plan?.name || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subscription.createdAt ? 
                      formatDistanceToNow(new Date(subscription.createdAt), { addSuffix: true }) : 
                      '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      subscription.status === 'active' ? 'success' :
                      subscription.status === 'cancelled' ? 'destructive' :
                      'outline'
                    }>
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatPrice(subscription)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" className="text-primary hover:text-primary-dark">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No subscriptions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredSubscriptions.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubscriptions.length)} of {filteredSubscriptions.length} subscriptions
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
