
import React, { useMemo, useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';
import { useProduct } from '../contexts/ProductContext';
import { useStore } from '../contexts/StoreContext';
import { useReview } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import { StarRating } from '../components/ui/StarRating';

interface ProductDetailProps {
  productId: string;
}

const ReviewForm: React.FC<{ productId: number; onSubmit: () => void }> = ({ productId, onSubmit }) => {
    const { addReview } = useReview();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0 && comment.trim()) {
            addReview({ productId, rating, comment });
            setRating(0);
            setComment('');
            onSubmit();
        } else {
            alert('Please provide a rating and a comment.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
                <label className="font-semibold text-gray-700">Your Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} />
            </div>
             <div>
                <label htmlFor="comment" className="font-semibold text-gray-700">Your Review</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="mt-1 flex w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Tell us what you think about the product..."
                />
            </div>
            <Button type="submit">Submit Review</Button>
        </form>
    );
}


const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { getProductById } = useProduct();
  const { getStoreById } = useStore();
  const { user } = useAuth();
  const { getOrdersByUserId } = useOrder();
  const { getReviewsByProductId } = useReview();

  const product = getProductById(parseInt(productId, 10));
  const store = product ? getStoreById(product.storeId) : undefined;
  
  const hasPurchased = useMemo(() => {
      if (!user || !product) return false;
      const userOrders = getOrdersByUserId(user.id);
      return userOrders.some(order => 
          order.items.some(item => item.product.id === product.id)
      );
  }, [user, getOrdersByUserId, product]);
  
  const productReviews = useMemo(() => {
    if (!product) return [];
    return getReviewsByProductId(product.id);
  }, [product, getReviewsByProductId]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / productReviews.length;
  }, [productReviews]);

  if (!product) {
    return (
      <div className="text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
        <p className="text-gray-500 mt-2">We couldn't find the product you're looking for.</p>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-8">
      <Button variant="outline" onClick={() => navigate('/products')} className="mb-6">
        &larr; Back to Products
      </Button>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-4">
            <img
              src={`${product.imageUrl}&w=600&h=600&fit=crop`}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-lg text-gray-500 mt-1">{product.name_th}</p>
              {store && (
                 <p className="text-sm text-gray-600 mt-2">
                    Sold by: 
                    <a 
                      href={`#/store/${store.storeId}`} 
                      onClick={(e) => { e.preventDefault(); navigate(`/store/${store.storeId}`); }}
                      className="text-emerald-600 hover:underline font-medium ml-1"
                    >
                      {store.storeName}
                    </a>
                 </p>
               )}
              
              {/* Average Rating */}
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={averageRating} />
                <span className="text-sm text-gray-500">
                  {averageRating.toFixed(1)} ({productReviews.length} reviews)
                </span>
              </div>
              
              <p className="text-3xl font-semibold text-emerald-600 my-4">
                ฿{product.price.toLocaleString()}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
              <Button className="w-full sm:w-auto" onClick={() => addToCart(product)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
        </CardHeader>
        <CardContent>
          {user && hasPurchased && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg">Leave a Review</h3>
                <p className="text-sm text-gray-600 mb-2">Share your thoughts with other customers.</p>
                <ReviewForm productId={product.id} onSubmit={() => alert('Review submitted!')} />
            </div>
          )}
          {user && !hasPurchased && (
            <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-center">
              <p>You must purchase this item to leave a review.</p>
            </div>
          )}

          {productReviews.length > 0 ? (
            <div className="space-y-6">
              {productReviews.map(review => (
                <div key={review.id} className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${review.userName}`} alt="" className="w-8 h-8 rounded-full bg-gray-200"/>
                        <span className="font-semibold text-gray-800">{review.userName.split('@')[0]}</span>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">This product has no reviews yet.</p>
          )}

        </CardContent>
      </Card>

    </div>
  );
};

export default ProductDetail;