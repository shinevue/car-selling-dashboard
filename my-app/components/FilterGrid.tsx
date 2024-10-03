"use client";

import React from 'react';
import { CarData, Filters } from '@/types/CarData';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import '../styles/FilterGrid.css';
import { capitalizeWords } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FilterGridProps {
    data: CarData[];
    currentFilters: Filters;
    handleFilterChange: (filters: Filters) => void;
    handleSubmit: () => void;
    includedFilters: (keyof Filters)[];
    isLoading: boolean;
    uniqueFilterValues: {
        make: string[],
        model: string[],
        trim: string[],
        year: number[];
    };
}

const colorOptions = ['Black', 'White', 'Gray', 'Silver', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Brown', 'Purple', 'Pink', 'Beige', 'Gold'];
const transmissionOptions = ['Manual', 'Automatic'];

const mileageRanges = [
    { value: 10000, label: "Up to 10,000" },
    { value: 25000, label: "Up to 25,000" },
    { value: 50000, label: "Up to 50,000" },
    { value: 75000, label: "Up to 75,000" },
    { value: 100000, label: "Up to 100,000" },
    { value: 150000, label: "Up to 150,000" },
    { value: 200000, label: "Up to 200,000" },
    { value: Infinity, label: "Any mileage" },
];

export function FilterGrid({ data, currentFilters, handleFilterChange, handleSubmit, includedFilters, isLoading, uniqueFilterValues }: FilterGridProps) {
    const uniqueOptions = (key: keyof CarData) => {
        return Array.from(new Set(data?.map(item => item[key])))
            .filter(Boolean)
            .sort((a, b) => (a && b ? a.toString().localeCompare(b.toString()) : 0));
    };

    const handleFilterChangeLocal = (key: keyof Filters, value: any) => {
        handleFilterChange({ ...currentFilters, [key]: value === 'all' ? null : value });
    };

    const filterConfig: Record<keyof Filters, { label: string; options: any[]; }> = {
        make: { label: 'Make', options: uniqueFilterValues?.make },
        model: { label: 'Model', options: uniqueFilterValues?.model },
        trim: { label: 'Trim', options: uniqueFilterValues?.trim },
        mileage: { label: 'Mileage', options: mileageRanges },
        exteriorColor: { label: 'Exterior Color', options: colorOptions },
        interiorColor: { label: 'Interior Color', options: colorOptions },
        transmission: { label: 'Transmission', options: transmissionOptions },
        drivetrain: { label: 'Drivetrain', options: uniqueOptions('drivetrain') },
        listingType: { label: 'Listing Type', options: uniqueOptions('listing_type') },
        startDate: { label: 'Start Date', options: [] }, // Handled separately
        endDate: { label: 'End Date', options: [] }, // Handled separately
        period: { label: 'Period', options: [] }, // Handled separately
        periodCount: { label: 'Period Count', options: [] }, // Handled separately
        onlyWithPricing: { label: 'Only With Pricing', options: [] }, // Handled separately
        year: { label: 'Year', options: uniqueFilterValues?.year },
    };

    return (
        <div className="flex gap-6 mb-8 flex-wrap">
            {Object.entries(filterConfig).map(([key, config]) => {
                if (!includedFilters.includes(key as keyof Filters)) return null;

                if (key === 'onlyWithPricing') {
                    return (
                        <div key={key} className="flex items-center space-x-2">
                            <Switch
                                checked={currentFilters.onlyWithPricing}
                                onCheckedChange={(checked) => handleFilterChangeLocal('onlyWithPricing', checked)}
                            />
                            <Label className="text-sm font-medium text-gray-700">
                                Only With Pricing
                            </Label>
                        </div>
                    );
                }

                return (
                    <div key={key} className="flex-grow max-w-xs space-y-2 mr-4">
                        <Select
                            value={(currentFilters[key as keyof Filters] as string) || 'all'}
                            onValueChange={(value) => handleFilterChangeLocal(key as keyof Filters, value)}
                        >
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder={`Select ${config.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{config.label}</SelectLabel>
                                    <SelectItem value="all">All {config.label}s</SelectItem>
                                    {config.options.map((option) => (
                                        <SelectItem
                                            key={option.value?.toString() || option}
                                            value={option.value?.toString() || option}
                                        >
                                            {capitalizeWords(option.label || option)}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                );
            })}
            {handleSubmit &&
                <motion.button
                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Filtering...' : 'Apply Filters'}
                </motion.button>
            }
        </div>
    );
}