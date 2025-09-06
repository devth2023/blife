
import React from 'react';
import AuthForm from '../components/AuthForm';
import { useRouter } from '../contexts/RouterContext';

const LoginPage: React.FC = () => {
    const { navigate } = useRouter();
    return (
        <div className="min-h-screen bg-emerald-50/50 flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 left-4">
                 <a href="/#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-sm text-emerald-600 hover:underline">
                    &larr; Back to Home
                </a>
            </div>
            <AuthForm />
        </div>
    );
};

export default LoginPage;
