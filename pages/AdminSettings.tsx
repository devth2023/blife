
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SettingsNav: React.FC<{ active: string; setActive: (tab: string) => void }> = ({ active, setActive }) => {
    const navItems = [
        'Basic Information', 'Home Page Themes', 'Media', 'Seo', 'Custom Css', 'Scripts', 'Shop & Checkout Page', 'Footer & Contact Page'
    ];
    
    return (
        <nav className="flex flex-col space-y-1">
            {navItems.map(item => (
                <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={`px-4 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                        active === item 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {item}
                </button>
            ))}
        </nav>
    );
};

const BasicInformationForm: React.FC = () => {
    const [settings, setSettings] = useState({
        appName: 'Blife Healthy',
        homePageTitle: 'E-commerce Shopping Platform',
        primaryColor: '#FF6A00',
        decimalSeparatorToggle: 'On',
        currencyDirection: 'Left',
        decimalSeparator: 'Dot',
        thousandSeparator: 'Comma',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({...prev, [name]: value}));
    };
    
    return (
         <form className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                    <label htmlFor="appName" className="block text-sm font-medium text-gray-700">App Name *</label>
                    <Input id="appName" name="appName" type="text" value={settings.appName} onChange={handleChange} className="mt-1"/>
                </div>
                 <div className="sm:col-span-1">
                    <label htmlFor="homePageTitle" className="block text-sm font-medium text-gray-700">Home Page Title *</label>
                    <Input id="homePageTitle" name="homePageTitle" type="text" value={settings.homePageTitle} onChange={handleChange} className="mt-1" />
                </div>
                <div className="sm:col-span-1">
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">Primary Colour Code *</label>
                    <div className="flex items-center mt-1">
                        <div className="relative">
                            <input 
                                type="color" 
                                value={settings.primaryColor}
                                onChange={handleChange}
                                name="primaryColor"
                                className="p-1 h-10 w-14 block bg-white border border-gray-300 rounded-md cursor-pointer"
                            />
                        </div>
                        <Input id="primaryColor" name="primaryColor" type="text" value={settings.primaryColor} onChange={handleChange} className="ml-2" />
                    </div>
                </div>
                 <div className="sm:col-span-1">
                    <label htmlFor="decimalSeparatorToggle" className="block text-sm font-medium text-gray-700">Decimal Separator *</label>
                    <select id="decimalSeparatorToggle" name="decimalSeparatorToggle" value={settings.decimalSeparatorToggle} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                        <option>On</option>
                        <option>Off</option>
                    </select>
                </div>
                 <div className="sm:col-span-1">
                    <label htmlFor="currencyDirection" className="block text-sm font-medium text-gray-700">Currency Direction *</label>
                    <select id="currencyDirection" name="currencyDirection" value={settings.currencyDirection} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                        <option value="Left">Left ($100.00)</option>
                        <option value="Right">Right (100.00$)</option>
                    </select>
                </div>
                 <div className="sm:col-span-1">
                    <label htmlFor="decimalSeparator" className="block text-sm font-medium text-gray-700">Decimal Separator *</label>
                    <select id="decimalSeparator" name="decimalSeparator" value={settings.decimalSeparator} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                        <option value="Dot">Dot (.)</option>
                        <option value="Comma">Comma (,)</option>
                    </select>
                </div>
                 <div className="sm:col-span-1">
                    <label htmlFor="thousandSeparator" className="block text-sm font-medium text-gray-700">Thousand Separator *</label>
                    <select id="thousandSeparator" name="thousandSeparator" value={settings.thousandSeparator} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                        <option value="Comma">Comma (,)</option>
                        <option value="Dot">Dot (.)</option>
                    </select>
                </div>
            </div>
            <div className="pt-5">
                <div className="flex justify-end">
                    <Button type="button" variant="outline" className="mr-2">Cancel</Button>
                    <Button type="submit">Submit</Button>
                </div>
            </div>
        </form>
    );
}

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Basic Information');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Basic Information</h1>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="p-6 border-r">
                         <SettingsNav active={activeTab} setActive={setActiveTab} />
                    </div>
                    <div className="md:col-span-3 p-6">
                        {activeTab === 'Basic Information' && <BasicInformationForm />}
                        {activeTab !== 'Basic Information' && (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>{activeTab} settings coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminSettings;
