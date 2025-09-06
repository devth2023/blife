import React from 'react';
import { Button } from '../components/ui/Button';
import { useRouter } from '../contexts/RouterContext';
import { Logo } from '../components/icons/Logo';

const Landing: React.FC = () => {
    const { navigate } = useRouter();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <header className="absolute top-0 left-0 right-0 p-4">
                <div className="container mx-auto flex justify-between items-center">
                     <div className="flex items-center space-x-2">
                        <Logo className="h-8 w-8 text-emerald-600" />
                        <span className="font-bold text-xl text-gray-800">Blife Healthy</span>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/login')}>Login / Sign Up</Button>
                </div>
            </header>
            <main className="flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
                    Your Journey to a <span className="text-emerald-600">Healthier Life</span>
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-gray-600">
                    Discover premium healthy products and build your own business with our unique platform. Join a community that values well-being and success.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Button className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow" onClick={() => navigate('/products')}>
                        Start Shopping
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
                        Become a Seller
                    </Button>
                </div>
            </main>
             <footer className="absolute bottom-0 p-4 text-center text-gray-500 text-sm w-full">
                <p>&copy; {new Date().getFullYear()} Blife Healthy. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;