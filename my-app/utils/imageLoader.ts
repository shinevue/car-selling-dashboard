import { CarData } from '@/types/CarData';

export const preloadImages = async (data: CarData[]): Promise<{ [key: string]: string }> => {
    const imageCache: { [key: string]: string } = {};

    const preloadPromises = data
        .filter(car => car.image)
        .map(car => new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
                imageCache[car.image!] = car.image!;
                resolve();
            };
            img.onerror = () => {
                resolve();
            };
            img.src = car.image!;
        }));

    await Promise.all(preloadPromises);
    return imageCache;
};