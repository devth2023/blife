
import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRouter } from '../contexts/RouterContext';

const RegistrationSuccess: React.FC = () => {
    const { navigate } = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto animate-fade-in text-center">
                <Card>
                    <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-gray-800">Account Created Successfully!</h1>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-6">
                            Welcome to Blife Healthy! You can now explore your dashboard and start your journey with us.
                        </p>
                        <Button onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegistrationSuccess;
