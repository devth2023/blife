
import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRouter } from '../contexts/RouterContext';

const OrderConfirmation: React.FC = () => {
    const { navigate } = useRouter();

    return (
        <div className="w-full max-w-md mx-auto animate-fade-in text-center">
            <Card>
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-gray-800">Thank You For Your Order!</h1>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-6">
                        We've received your order and will start processing it right away. A confirmation email has been sent to you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate('/products')}>
                            Continue Shopping
                        </Button>
                         <Button variant="outline" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderConfirmation;
