import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, Phone, MapPin, User, Calendar } from 'lucide-react';
import { api } from '@/services/api';
import type { Order } from '@/types';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (orderId) {
        try {
          const orderData = await api.getOrderById(orderId);
          setOrder(orderData);
        } catch (error) {
          console.error('Failed to fetch order:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order not found</h2>
          <Link to="/">
            <Button className="bg-green-600 hover:bg-green-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll contact you soon for confirmation.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-medium">#{order.id?.slice(-8).toUpperCase()}</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
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

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900">Delivery Details</h3>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-gray-400 mt-1" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gray-400 mt-1" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <span>{order.address}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900">Order Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.quantity}x</span>
                    <span className="text-gray-700">{item.productName}</span>
                  </div>
                  <span className="font-medium">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">৳{order.totalAmount}</span>
            </div>

            {order.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {order.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
