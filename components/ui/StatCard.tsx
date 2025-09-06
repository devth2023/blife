
import React from 'react';
import { Card, CardContent, CardHeader } from './Card';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-800">{value}</div>
            </CardContent>
        </Card>
    );
};
