import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Check, Shield, Truck, Leaf } from 'lucide-react';
import { api } from '@/services/api';
import type { Product } from '@/types';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function ProductDetails() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            if (productId) {
                try {
                    const foundProduct = await api.getProductById(productId);
                    if (foundProduct) {
                        setProduct(foundProduct);
                    } else {
                        toast.error('Product not found');
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Error fetching product:', error);
                    toast.error('Product not found');
                    navigate('/');
                } finally {
                    setIsLoading(false);
                }
            }
        }
        fetchProduct();
    }, [productId, navigate]);

    const handleAddToCart = () => {
        if (!product) return;

        if (quantity > product.stock) {
            toast.error('Not enough stock available');
            return;
        }

        addToCart(product, quantity);
        setAdded(true);
        toast.success(`${product.name} added to cart!`);

        setTimeout(() => {
            setAdded(false);
        }, 1500);
    };

    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(q => q + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Product not found</h2>
                    <Button onClick={() => navigate('/')}>Back to Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Button
                    variant="ghost"
                    className="mb-8 text-gray-600 hover:text-green-600"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                </Button>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12">
                        {/* Image Section */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-4 left-4 bg-green-600 text-sm py-1 px-3">
                                {product.category}
                            </Badge>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col">
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-3xl font-bold text-green-600">
                                        ৳{product.price}
                                    </span>
                                    <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="text-sm">
                                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                    </Badge>
                                </div>

                                <div className="prose prose-green max-w-none mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                        <Leaf className="h-5 w-5 text-green-600" />
                                        <span className="text-xs font-medium text-green-800">100% Organic</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                        <Truck className="h-5 w-5 text-green-600" />
                                        <span className="text-xs font-medium text-green-800">Fast Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                        <Shield className="h-5 w-5 text-green-600" />
                                        <span className="text-xs font-medium text-green-800">Quality Assured</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="mt-auto space-y-4 border-t pt-8">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg p-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 hover:bg-gray-100"
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-5 w-5" />
                                        </Button>
                                        <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 hover:bg-gray-100"
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Total: <span className="font-bold text-gray-900 ml-1">৳{product.price * quantity}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 shadow-md"
                                    onClick={handleAddToCart}
                                    disabled={added || product.stock === 0}
                                >
                                    {added ? (
                                        <>
                                            <Check className="h-5 w-5 mr-2" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        'Add to Cart'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold">Pure Food BD</h3>
                            <p className="text-gray-400 text-sm mt-2 max-w-sm">
                                Your trusted source for 100% fresh, organic, and pure food delivered straight to your door.
                            </p>
                        </div>
                        <div className="md:text-right">
                            <p className="text-gray-400 text-sm">Contact: +880 1XXX-XXXXXX</p>
                            <p className="text-gray-400 text-sm">Email: info@purefoodbd.com</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-500 text-sm">© 2024 Pure Food BD. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
