
import React from 'react';

interface ChartData {
    name: string;
    value: number;
}

interface SimpleBarChartProps {
    data: ChartData[];
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.value), 0);

    return (
        <div className="w-full h-64 p-4 border rounded-lg bg-white flex items-end space-x-2">
            {data.map((item, index) => {
                const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                return (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                         <div 
                            className="w-full bg-emerald-100 hover:bg-emerald-400 transition-all duration-300 ease-in-out rounded-t-md relative"
                            style={{ height: `${barHeight}%` }}
                        >
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
                                ฿{item.value.toLocaleString()}
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{item.name}</span>
                    </div>
                );
            })}
        </div>
    );
};
