import React from 'react';
import { Pie } from 'react-chartjs-2';

const StatCard = ({ chartData, chartOptions }) => {
    return (
        <div className='p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl'>
            <div className='mt-6'>
                <div className='relative aspect-square w-full max-w-xs mx-auto'>
                    <Pie
                        data={chartData}
                        options={{
                            ...chartOptions,
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                ...chartOptions.plugins,
                                legend: {
                                    ...chartOptions.plugins.legend,
                                    position: 'bottom',
                                    labels: {
                                        ...chartOptions.plugins.legend.labels,

                                        padding: 20,
                                        font: {
                                            size: 14,
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
