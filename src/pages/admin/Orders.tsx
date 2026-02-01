import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Printer,
  FileText
} from 'lucide-react';
import { api } from '@/services/api';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
    loadOrders();
  }, [navigate]);

  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(o =>
        (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.phone || '').includes(searchQuery) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const loadOrders = async () => {
    try {
      const allOrders = await api.getOrders();
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.deleteOrder(orderId);
        toast.success('Order deleted successfully');
        loadOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Calculate totals
  const totalSales = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Manage Orders</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">৳{totalSales}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Orders</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by customer, phone, or order ID..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">
                        #{order.id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ৳{order.totalAmount}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                          >
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(order.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-16">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                <p className="text-gray-500 mt-1">Orders will appear here when customers place them</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader className="print:hidden">
                <div className="flex justify-between items-center">
                  <DialogTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Order Details
                  </DialogTitle>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
                  </Button>
                </div>
              </DialogHeader>

              <div id="invoice" className="space-y-4 p-4">
                <div className="text-center border-b pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-green-600">Pure Food BD</h1>
                  <p className="text-gray-500">Fresh & Organic Food Products</p>
                  <p className="text-sm text-gray-400">Invoice / Order Receipt</p>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-medium">#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Bill To:</h4>
                  <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {selectedOrder.customerName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedOrder.phone}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="flex-1">{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm">Item</th>
                        <th className="text-center py-2 px-3 text-sm">Qty</th>
                        <th className="text-right py-2 px-3 text-sm">Price</th>
                        <th className="text-right py-2 px-3 text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-3">{item.productName}</td>
                          <td className="py-2 px-3 text-center">{item.quantity}</td>
                          <td className="py-2 px-3 text-right">৳{item.price}</td>
                          <td className="py-2 px-3 text-right font-medium">৳{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center bg-gray-100 p-4 rounded">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">৳{selectedOrder.totalAmount}</span>
                </div>

                {selectedOrder.notes && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {selectedOrder.notes}
                    </p>
                  </div>
                )}

                <div className="text-center text-sm text-gray-500 border-t pt-4 mt-4">
                  <p>Thank you for shopping with Pure Food BD!</p>
                  <p>For any queries, contact: +880 1XXX-XXXXXX</p>
                </div>

                <div className="print:hidden">
                  <Separator className="my-4" />
                  <h4 className="font-semibold mb-2">Update Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {(['pending', 'processing', 'completed', 'cancelled'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={selectedOrder.status === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(selectedOrder.id, status)}
                        className={selectedOrder.status === status ? getStatusColor(status) : ''}
                      >
                        {getStatusIcon(status)}
                        <span className="ml-1 capitalize">{status}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
