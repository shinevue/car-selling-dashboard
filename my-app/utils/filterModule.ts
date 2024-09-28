import { Filters, CarData } from '@/types/CarData';

export const initialFilters: Filters = {
    trim: null,
    mileage: null,
    exteriorColor: null,
    interiorColor: null,
    transmission: null,
    drivetrain: null,
    period: 'day',
    periodCount: 7,
    startDate: null,
    endDate: null,
    listing_type: null,
    onlyWithPricing: false, // Add this new filter
};

export const applyTimeFilter = (filters: Filters): Filters => {
    const endDate = new Date();
    const startDate = new Date();

    switch (filters.period) {
        case 'day':
            startDate.setDate(endDate.getDate() - filters.periodCount);
            break;
        case 'week':
            startDate.setDate(endDate.getDate() - filters.periodCount * 7);
            break;
        case 'month':
            startDate.setMonth(endDate.getMonth() - filters.periodCount);
            break;
        case 'custom':
            return filters; // Don't modify custom date range
    }

    return {
        ...filters,
        startDate,
        endDate,
    };
};

export const updateFilter = (filters: Filters, key: keyof Filters, value: any): Filters => {
    const newFilters = { ...filters, [key]: value };
    
    if (['period', 'periodCount'].includes(key)) {
        return applyTimeFilter(newFilters);
    }

    return newFilters;
};

export const removeFilter = (filters: Filters, key: keyof Filters): Filters => {
    const newFilters = { ...filters, [key]: null };
    return newFilters;
};

export const getActiveFilters = (filters: Filters): [string, any][] => {
    return Object.entries(filters).filter(([key, value]) =>
        value !== null && !['period', 'periodCount', 'startDate', 'endDate'].includes(key)
    );
};

export const applyFiltersToData = (data: CarData[], filters: Filters): CarData[] => {
    return data.filter((car: CarData) => {
        // Convert photos JSON string and get first image URL
        if (typeof car.photos == 'string') {
            try {
                const photosArray = JSON.parse(car.photos);
                car.image = photosArray[0] || null;
            } catch (error) {
                console.error('Error parsing photos JSON:', error);
                car.image = null;
            }
        } else {
            car.image = null;
        }

        const carDate = car.date_listed ? new Date(car.date_listed) : null;
        const isInTimeRange = carDate && filters.startDate && filters.endDate
            ? carDate >= filters.startDate && carDate <= filters.endDate
            : true;

        // Skip listings with null prices if onlyWithPricing is true
        if (filters.onlyWithPricing && (car.price === null || car.price === undefined)) {
            return false;
        }

        const matchesColor = (carColor: string | null, filterColor: string | null) =>
            !filterColor || (carColor && carColor.toLowerCase().includes(filterColor.toLowerCase()));

        const matchesListingType = !filters.listing_type || car.listing_type === filters.listing_type;

        const matchesTransmission = !filters.transmission ||
            (car.transmission && car.transmission.toLowerCase().includes(filters.transmission.toLowerCase()));

        return (
            (!filters.trim || car.trim === filters.trim) &&
            (!filters.mileage || (car.mileage !== null && car.mileage <= filters.mileage)) &&
            matchesColor(car.exterior_color, filters.exteriorColor) &&
            matchesColor(car.interior_color, filters.interiorColor) &&
            matchesTransmission &&
            (!filters.drivetrain || car.drivetrain === filters.drivetrain) &&
            matchesListingType &&
            isInTimeRange
        );
    });
};