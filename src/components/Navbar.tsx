import { Link } from 'react-router-dom';
import { ShoppingCart, Store, PackageSearch } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Pure Food BD</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/track-order">
              <Button variant="ghost" size="sm">
                <PackageSearch className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Track Order</span>
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" className="relative" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
                <span className="ml-2 hidden sm:inline">Cart</span>
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}
