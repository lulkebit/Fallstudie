import { TrendingUp } from 'lucide-react';
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';

const PageViewsChart = ({ data }) => {
    // Fallback für leere oder fehlende Daten
    if (!data || data.length === 0) {
        data = [
            { date: '01.01', views: 0 },
            { date: '02.01', views: 0 },
            { date: '03.01', views: 0 },
            { date: '04.01', views: 0 },
            { date: '05.01', views: 0 },
            { date: '06.01', views: 0 },
            { date: '07.01', views: 0 },
        ];
    }

    // Berechne die prozentuale Veränderung
    const calculateChange = () => {
        if (data.length < 2) return 0;
        const oldValue = data[0].views;
        const newValue = data[data.length - 1].views;
        if (oldValue === 0) return 100;
        return (((newValue - oldValue) / oldValue) * 100).toFixed(1);
    };

    const change = calculateChange();
    const trendUp = change >= 0;

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg'>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-1'>
                        {label}
                    </p>
                    <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {payload[0].value.toLocaleString()} Aufrufe
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='w-full space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <div className='flex items-start gap-2'>
                        <div className='h-10 w-10 rounded-xl bg-gradient-to-br from-[#4785FF] to-[#8c52ff] flex items-center justify-center'>
                            <TrendingUp className='w-5 h-5 text-white' />
                        </div>
                        <div className='flex flex-col'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                Seitenaufrufe der letzten 7 Tage
                            </h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Tägliche Entwicklung der Besucherzahlen
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        trendUp
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : 'bg-red-100 dark:bg-red-900/20'
                    }`}
                >
                    <span
                        className={`text-sm font-medium ${
                            trendUp
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                        {change}%
                    </span>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                        {trendUp ? 'Zuwachs' : 'Rückgang'}
                    </p>
                </div>
            </div>

            <div className='h-[300px] w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id='pageViewsGradient'
                                x1='0'
                                y1='0'
                                x2='0'
                                y2='1'
                            >
                                <stop
                                    offset='5%'
                                    stopColor='#4785FF'
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset='95%'
                                    stopColor='#4785FF'
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray='3 3'
                            vertical={false}
                            stroke='#E5E7EB'
                            className='dark:stroke-gray-700'
                        />
                        <XAxis
                            dataKey='date'
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            className='dark:text-gray-400'
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            className='dark:text-gray-400'
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type='monotone'
                            dataKey='views'
                            stroke='#4785FF'
                            strokeWidth={2}
                            fill='url(#pageViewsGradient)'
                            dot={{
                                fill: '#FFFFFF',
                                stroke: '#4785FF',
                                strokeWidth: 2,
                                r: 4,
                            }}
                            activeDot={{
                                fill: '#4785FF',
                                stroke: '#FFFFFF',
                                strokeWidth: 2,
                                r: 6,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PageViewsChart;
