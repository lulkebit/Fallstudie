import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Goal } from 'lucide-react';

const StatCard = ({
    title,
    value,
    subvalue,
    chartData,
    chartOptions,
    highlight = false,
    goalDetails = null, // Neue Prop für die zusätzlichen Ziel-Details
}) => {
    return (
        <div
            className={`${
                highlight
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                    : 'bg-white'
            } p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}
        >
            <div className='flex items-center gap-3 mb-4'>
                <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        highlight
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-600'
                    }`}
                >
                    <Goal className='w-6 h-6' />
                </div>
                <div>
                    <h3
                        className={`text-sm font-medium ${
                            highlight ? 'text-blue-100' : 'text-gray-500'
                        }`}
                    >
                        {title}
                    </h3>
                    <p
                        className={`text-lg font-bold ${
                            highlight ? 'text-white' : 'text-gray-800'
                        }`}
                    >
                        {value}
                    </p>
                </div>
            </div>

            {goalDetails && (
                <div className='space-y-6'>
                    <p
                        className={
                            highlight ? 'text-blue-100' : 'text-gray-500'
                        }
                    >
                        {goalDetails.participationCount} Teilnahmen
                    </p>

                    <div className='grid grid-cols-2 gap-4'>
                        <div
                            className={`rounded-lg p-4 ${
                                highlight ? 'bg-white/10' : 'bg-gray-50'
                            }`}
                        >
                            <p
                                className={`text-sm ${
                                    highlight
                                        ? 'text-blue-100'
                                        : 'text-gray-500'
                                }`}
                            >
                                Aktueller Stand
                            </p>
                            <p
                                className={`text-xl font-bold ${
                                    highlight ? 'text-white' : 'text-gray-800'
                                }`}
                            >
                                {goalDetails.currentValue} {goalDetails.unit}
                            </p>
                        </div>
                        <div
                            className={`rounded-lg p-4 ${
                                highlight ? 'bg-white/10' : 'bg-gray-50'
                            }`}
                        >
                            <p
                                className={`text-sm ${
                                    highlight
                                        ? 'text-blue-100'
                                        : 'text-gray-500'
                                }`}
                            >
                                Zielwert
                            </p>
                            <p
                                className={`text-xl font-bold ${
                                    highlight ? 'text-white' : 'text-gray-800'
                                }`}
                            >
                                {goalDetails.targetValue} {goalDetails.unit}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {chartData ? (
                <div className='mt-4 h-[150px]'>
                    <Pie
                        data={chartData}
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                legend: {
                                    ...chartOptions.plugins.legend,
                                    labels: {
                                        ...chartOptions.plugins.legend.labels,
                                        color: highlight ? 'white' : undefined,
                                    },
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                subvalue && (
                    <p
                        className={`mt-2 text-sm ${
                            highlight ? 'text-blue-100' : 'text-gray-500'
                        }`}
                    >
                        {subvalue}
                    </p>
                )
            )}
        </div>
    );
};

export default StatCard;
