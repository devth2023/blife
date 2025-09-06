
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useLog } from '../contexts/LogContext';
import { useAuth } from '../contexts/AuthContext';
import { LogLevel, LogSource } from '../types';

const AdminLogsViewer: React.FC = () => {
    const { user } = useAuth();
    const { logs } = useLog();
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');
    const [sourceFilter, setSourceFilter] = useState<LogSource | 'ALL'>('ALL');

    if (user?.role !== 'ADMIN') {
        return <div className="text-center p-8">You do not have permission to view this page.</div>;
    }

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => levelFilter === 'ALL' || log.level === levelFilter)
            .filter(log => sourceFilter === 'ALL' || log.source === sourceFilter)
            .filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [logs, levelFilter, sourceFilter, searchTerm]);

    const getLevelVariant = (level: LogLevel) => {
        switch (level) {
            case 'INFO': return 'success';
            case 'WARN': return 'warning';
            case 'ERROR': return 'danger';
            default: return 'default';
        }
    };

    const getSourceVariant = (source: LogSource) => {
        // Just for some color variety
         switch (source) {
            case 'Auth': return 'bg-blue-100 text-blue-800';
            case 'Product': return 'bg-purple-100 text-purple-800';
            case 'Order': return 'bg-pink-100 text-pink-800';
            case 'Store': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">System Event Logs</h1>
            <p className="text-gray-500 mb-6">Monitor all critical activities happening across the platform.</p>
            <Card>
                <CardHeader>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Input 
                            placeholder="Search log message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value as any)}
                            className="flex h-10 w-full sm:w-auto rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm"
                        >
                            <option value="ALL">All Levels</option>
                            <option value="INFO">Info</option>
                            <option value="WARN">Warning</option>
                            <option value="ERROR">Error</option>
                        </select>
                         <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value as any)}
                            className="flex h-10 w-full sm:w-auto rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm"
                        >
                            <option value="ALL">All Sources</option>
                            <option value="Auth">Auth</option>
                            <option value="Product">Product</option>
                            <option value="Order">Order</option>
                            <option value="Store">Store</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Timestamp</th>
                                    <th scope="col" className="px-6 py-3">Level</th>
                                    <th scope="col" className="px-6 py-3">Source</th>
                                    <th scope="col" className="px-6 py-3">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4"><Badge variant={getLevelVariant(log.level)}>{log.level}</Badge></td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceVariant(log.source)}`}>
                                                {log.source}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{log.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLogs.length === 0 && <p className="text-center text-gray-500 py-8">No logs match the current filters.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogsViewer;