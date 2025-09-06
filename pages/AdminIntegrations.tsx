
import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const IntegrationCard: React.FC<{ title: string, description: string, iconUrl: string }> = ({ title, description, iconUrl }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <img src={iconUrl} alt={`${title} logo`} className="h-10 w-10" />
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor={`${title}-key`} className="text-sm font-medium text-gray-700">API Key</label>
                    <Input id={`${title}-key`} type="password" placeholder="••••••••••••••••••••••••" />
                </div>
                <div className="flex justify-between items-center">
                    <label htmlFor={`${title}-toggle`} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" id={`${title}-toggle`} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">Enable</span>
                    </label>
                    <Button variant="outline" size="sm">Save</Button>
                </div>
            </CardContent>
        </Card>
    )
}

const AdminIntegrations: React.FC = () => {
    const { user } = useAuth();
    
    if (user?.role !== 'ADMIN') {
        return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">API Integrations</h1>
                <p className="text-gray-500 mt-1">Connect and manage third-party services for your platform.</p>
            </div>

            {/* Payment Gateways */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Gateways</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IntegrationCard 
                        title="Stripe"
                        description="Accept payments online."
                        iconUrl="https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                    />
                    <IntegrationCard 
                        title="Omise"
                        description="Online payment gateway for SEA."
                        iconUrl="https://cdn.worldvectorlogo.com/logos/omise.svg"
                    />
                </div>
            </section>
            
             {/* Logistics Providers */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Logistics Providers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IntegrationCard 
                        title="Flash Express"
                        description="Express delivery service."
                        iconUrl="https://img.ws.mms.shopee.co.id/2b23194c25f53d221ab0735a28956961"
                    />
                    <IntegrationCard 
                        title="Kerry Express"
                        description="Parcel delivery services."
                        iconUrl="https://iconlogovector.com/uploads/images/2023/10/kerry-express-65239e0835f83.webp"
                    />
                </div>
            </section>
        </div>
    );
};

export default AdminIntegrations;