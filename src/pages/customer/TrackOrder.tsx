import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Package, Phone, MapPin, User, Calendar, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { getOrders } from '@/services/storage';
import type { Order } from '@/types';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function TrackOrder() {
  const [phoneQuery, setPhoneQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!phoneQuery.trim()) return;
    
    const allOrders = getOrders();
    const customerOrders = allOrders.filter(o => 
      o.phone.includes(phoneQuery.trim())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setOrders(customerOrders);
    setHasSearched(true);
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
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'processing': return <Truck className="h-5 w-5" />;
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order is pending confirmation';
      case 'processing': return 'Your order is being processed';
      case 'completed': return 'Your order has been delivered';
      case 'cancelled': return 'Your order has been cancelled';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Track Your Order</h1>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="tel"
                    placeholder="e.g., 01712345678"
                    value={phoneQuery}
                    onChange={(e) => setPhoneQuery(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                <p className="text-gray-500 mt-1">
                  We couldn't find any orders with this phone number
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Found {orders.length} order{orders.length !== 1 ? 's' : ''}
                </h2>
                
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-mono font-medium">
            #{order.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      {/* Status Message */}
                      <div className={`p-3 rounded-lg mb-4 ${getStatusColor(order.status)}`}>
                        <p className="font-medium">{getStatusMessage(order.status)}</p>
                      </div>

                      {/* Order Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>

                      <Separator className="my-4" />

                      {/* Customer Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span className="flex-1">{order.address}</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium text-gray-900">Order Items</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.quantity}x</span>
                              <span className="text-gray-700">{item.productName}</span>
                            </div>
                            <span className="font-medium">৳{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-xl font-bold text-green-600">৳{order.totalAmount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
