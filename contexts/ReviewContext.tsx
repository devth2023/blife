
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';
import { Review, AddReviewData } from '../types';

interface ReviewContextType {
  reviews: Review[];
  addReview: (reviewData: AddReviewData) => void;
  getReviewsByProductId: (productId: number) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    api.getReviews().then(setReviews);
  }, []);

  const addReview = useCallback((reviewData: AddReviewData) => {
    if (!user) {
        console.error("Cannot add review: user is not logged in.");
        return;
    }
    api.addReview(reviewData, user).then(newReview => {
        setReviews(prevReviews => [newReview, ...prevReviews]);
    });
  }, [user]);

  const getReviewsByProductId = useCallback((productId: number) => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews]);


  return (
    <ReviewContext.Provider value={{ reviews, addReview, getReviewsByProductId }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};