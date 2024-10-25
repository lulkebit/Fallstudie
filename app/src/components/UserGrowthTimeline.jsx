import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Brush,
} from 'recharts';
import axios from 'axios';
import {
    Calendar,
    Users,
    TrendingUp,
    Loader2,
    AlertTriangle,
    Clock,
} from 'lucide-react';

const INTERVALS = [
    { value: 'hour', label: 'Stündlich', range: 24, icon: Clock },
    { value: 'day', label: 'Täglich', range: 30, icon: Calendar },
    { value: 'week', label: 'Wöchentlich', range: 12, icon: Users },
    { value: 'month', label: 'Monatlich', range: 3, icon: TrendingUp },
];

const IntervalButton = ({ interval, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
      ${
          selected
              ? 'bg-gradient-to-r from-[#4785FF] to-[#8c52ff] text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/10'
              : 'text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5'
      }`}
    >
        <interval.icon className='w-4 h-4' />
        {interval.label}
    </button>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className='bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 p-4 shadow-lg'>
                <div className='flex items-center gap-2 mb-2'>
                    <Calendar className='w-4 h-4 text-gray-400 dark:text-white/40' />
                    <p className='font-medium text-gray-900 dark:text-white'>
                        {label}
                    </p>
                </div>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-[#4785FF]' />
                        <p className='text-sm text-gray-600 dark:text-white/70'>
                            Neue Nutzer:{' '}
                            <span className='font-medium'>
                                {payload[0].value}
                            </span>
                        </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-[#8c52ff]' />
                        <p className='text-sm text-gray-600 dark:text-white/70'>
                            Gesamtnutzer:{' '}
                            <span className='font-medium'>
                                {payload[1].value}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const UserGrowthTimeline = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInterval, setSelectedInterval] = useState('month');

    const fetchData = async (interval) => {
        try {
            setLoading(true);
            const intervalConfig = INTERVALS.find((i) => i.value === interval);
            const response = await axios.get(
                `/user-growth?interval=${interval}&range=${intervalConfig.range}`
            );
            setData(response.data.stats);
            setLoading(false);
        } catch (err) {
            setError('Fehler beim Laden der Daten: ' + err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selectedInterval);
    }, [selectedInterval]);

    if (loading) {
        return (
            <div className='flex items-center justify-center h-[400px]'>
                <div className='flex flex-col items-center gap-4'>
                    <Loader2 className='w-8 h-8 text-[#4785FF] animate-spin' />
                    <p className='text-gray-500 dark:text-white/60'>
                        Daten werden geladen...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center h-[400px]'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-16 h-16 rounded-xl bg-red-500/10 flex items-center justify-center'>
                        <AlertTriangle className='w-8 h-8 text-red-500' />
                    </div>
                    <p className='text-red-500'>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Interval Selection */}
            <div className='flex flex-wrap gap-2'>
                {INTERVALS.map((interval) => (
                    <IntervalButton
                        key={interval.value}
                        interval={interval}
                        selected={selectedInterval === interval.value}
                        onClick={() => setSelectedInterval(interval.value)}
                    />
                ))}
            </div>

            {/* Chart */}
            <div className='h-[400px] w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray='3 3'
                            stroke='#E2E8F0'
                            vertical={false}
                            className='dark:opacity-10'
                        />
                        <XAxis
                            dataKey='period'
                            stroke='#718096'
                            tick={{ fill: '#718096', fontSize: 12 }}
                            tickLine={{ stroke: '#E2E8F0' }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            className='dark:text-white/40 dark:stroke-white/10'
                        />
                        <YAxis
                            stroke='#718096'
                            tick={{ fill: '#718096', fontSize: 12 }}
                            tickLine={{ stroke: '#E2E8F0' }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            yAxisId='left'
                            className='dark:text-white/40 dark:stroke-white/10'
                        />
                        <YAxis
                            stroke='#718096'
                            tick={{ fill: '#718096', fontSize: 12 }}
                            tickLine={{ stroke: '#E2E8F0' }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            yAxisId='right'
                            orientation='right'
                            className='dark:text-white/40 dark:stroke-white/10'
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px',
                            }}
                            iconType='circle'
                            formatter={(value) => (
                                <span className='text-gray-600 dark:text-white/70'>
                                    {value}
                                </span>
                            )}
                        />
                        <Brush
                            dataKey='period'
                            height={30}
                            stroke='#4785FF'
                            fill='#F7FAFC'
                            travellerWidth={10}
                            className='mt-4 dark:stroke-[#8c52ff] dark:fill-white/5'
                        />
                        <Line
                            yAxisId='left'
                            type='monotone'
                            dataKey='newUsers'
                            name='Neue Nutzer'
                            stroke='#4785FF'
                            strokeWidth={2}
                            dot={{ fill: '#4785FF', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#4785FF' }}
                        />
                        <Line
                            yAxisId='right'
                            type='monotone'
                            dataKey='totalUsers'
                            name='Gesamtnutzer'
                            stroke='#8c52ff'
                            strokeWidth={2}
                            dot={{ fill: '#8c52ff', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#8c52ff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserGrowthTimeline;
