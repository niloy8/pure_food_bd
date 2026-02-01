import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { Search, Leaf, Truck, Shield } from 'lucide-react';
import { api } from '@/services/api';
import type { Product } from '@/types';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await api.getProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative text-white bg-cover bg-center food-imgbg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pure Food BD
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Fresh, Organic & Pure Food Products Delivered to Your Doorstep
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 bg-slate-200  text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Track Order Button */}
            {/* <div className="mt-16">
              <Link to="/track-order">
                <Button variant="outline" className="bg-slate-800 text-white border-white/30 hover:bg-white/20">
                  <PackageSearch className="h-4 w-4 mr-2" />
                  Track Your Order
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full ml-[36px] lg:ml-0">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">100% Organic</h3>
                <p className="text-sm text-gray-500">Pure & Natural Products</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-500">Same Day Delivery</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quality Assured</h3>
                <p className="text-sm text-gray-500">Certified Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Pure Food BD</h3>
              <p className="text-gray-400 text-sm mt-1">Fresh & Organic Food Products</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">Contact: +880 1XXX-XXXXXX</p>
              <p className="text-gray-400 text-sm">Email: info@purefoodbd.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-gray-500 text-sm">© 2024 Pure Food BD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
