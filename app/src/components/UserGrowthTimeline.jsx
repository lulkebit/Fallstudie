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

const INTERVALS = [
    { value: 'hour', label: 'Stündlich', range: 24 },
    { value: 'day', label: 'Täglich', range: 30 },
    { value: 'week', label: 'Wöchentlich', range: 12 },
    { value: 'month', label: 'Monatlich', range: 3 },
];

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
            console.log(response.data.stats);
            setLoading(false);
        } catch (err) {
            setError('Fehler beim Laden der Daten: ' + err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selectedInterval);
    }, [selectedInterval]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-sm'>
                    <p className='text-sm font-semibold text-gray-600 mb-1'>
                        {label}
                    </p>
                    <p className='text-sm text-[#4785FF] mb-1'>
                        {`Neue Nutzer: ${payload[0].value}`}
                    </p>
                    <p className='text-sm text-[#82ca9d]'>
                        {`Gesamtnutzer: ${payload[1].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className='bg-white rounded-lg shadow-sm p-4 col-span-2'>
                <div className='flex items-center justify-center h-[400px]'>
                    <div className='text-gray-500'>Laden...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-white rounded-lg shadow-sm p-4 col-span-2'>
                <div className='flex items-center justify-center h-[400px]'>
                    <div className='text-red-500'>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white rounded-lg shadow-sm p-4 col-span-2'>
            <div className='flex justify-between items-center mb-6 px-2'>
                <h3 className='font-bold text-gray-700 text-lg'>
                    Nutzerwachstum
                </h3>
                <div className='flex gap-2'>
                    {INTERVALS.map((interval) => (
                        <button
                            key={interval.value}
                            onClick={() => setSelectedInterval(interval.value)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                selectedInterval === interval.value
                                    ? 'bg-[#4785FF] text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {interval.label}
                        </button>
                    ))}
                </div>
            </div>

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
                        />
                        <XAxis
                            dataKey='period'
                            stroke='#718096'
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#E2E8F0' }}
                            axisLine={{ stroke: '#E2E8F0' }}
                        />
                        <YAxis
                            stroke='#718096'
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#E2E8F0' }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            yAxisId='left'
                        />
                        <YAxis
                            stroke='#718096'
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#E2E8F0' }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            yAxisId='right'
                            orientation='right'
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType='circle'
                        />
                        <Brush
                            dataKey='period'
                            height={30}
                            stroke='#4785FF'
                            fill='#F7FAFC'
                            travellerWidth={10}
                            className='mt-4'
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
                            stroke='#82ca9d'
                            strokeWidth={2}
                            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#82ca9d' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserGrowthTimeline;
