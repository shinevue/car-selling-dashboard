import React from 'react';
import { LineChartComponent } from "@/components/charts/LineChart";
import { ScatterChartComponent } from "@/components/charts/ScatterChart";
import { CarData } from '@/types/CarData';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

interface ChartSectionProps {
    filteredData: CarData[];
    filters: {
        startDate: Date | null;
        endDate: Date | null;
    };
    imageLoader: (src: string) => string;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ filteredData, filters, imageLoader }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div className="mb-16"  >
            <div className="flex flex-col space-y-20  px-1 md:px-0">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className={`bg-white dark:bg-gray-800 rounded-sm shadow-md ${isMobile ? "w-full" : "p-6"}`}
                >
                    <LineChartComponent
                        data={filteredData}
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                    />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className={`bg-white dark:bg-gray-800 rounded-sm shadow-md ${isMobile ? "w-full" : "p-6"}`}
                >
                    <ScatterChartComponent
                        data={filteredData}
                        onTimeSelection={() => { }}
                        onDataSelection={() => { }}
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        imageLoader={imageLoader}
                    />
                </motion.div>
            </div>
        </div>
    );
};