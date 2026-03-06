// Price lookup tables for all product categories
// Returns { min, max, suggested } price in ₹

export const HDPE_PRICES = {
    '20 mm': { min: 30, max: 60, suggested: 45 },
    '25 mm': { min: 30, max: 60, suggested: 50 },
    '32 mm': { min: 40, max: 70, suggested: 55 },
    '40 mm': { min: 50, max: 80, suggested: 65 },
    '50 mm': { min: 55, max: 85, suggested: 70 },
    '63 mm': { min: 70, max: 100, suggested: 85 },
    '75 mm': { min: 110, max: 160, suggested: 135 },
    '90 mm': { min: 140, max: 180, suggested: 160 },
    '110 mm': { min: 180, max: 300, suggested: 240 },
    '160 mm': { min: 280, max: 420, suggested: 350 },
};

export const PVC_PRICES = {
    '20 mm': { min: 35, max: 60, suggested: 47 },
    '25 mm': { min: 40, max: 65, suggested: 52 },
    '32 mm': { min: 45, max: 70, suggested: 57 },
    '40 mm': { min: 50, max: 75, suggested: 62 },
    '50 mm': { min: 55, max: 80, suggested: 67 },
    '63 mm': { min: 60, max: 85, suggested: 72 },
    '75 mm': { min: 65, max: 90, suggested: 77 },
    '90 mm': { min: 70, max: 95, suggested: 82 },
    '110 mm': { min: 80, max: 110, suggested: 95 },
};

export const PUMP_PRICES = {
    '0.5 HP': { min: 4000, max: 7000, suggested: 5500 },
    '1 HP': { min: 5000, max: 8000, suggested: 6500 },
    '2 HP': { min: 8000, max: 12000, suggested: 10000 },
    '3 HP': { min: 12000, max: 18000, suggested: 15000 },
    '5 HP': { min: 18000, max: 30000, suggested: 24000 },
    '7.5 HP': { min: 30000, max: 45000, suggested: 37500 },
    '10 HP': { min: 40000, max: 70000, suggested: 55000 },
    '15 HP': { min: 65000, max: 100000, suggested: 80000 },
};

export function getSuggestedPrice(category, diameter, pumpPower) {
    if (category === 'HDPE' && diameter) return HDPE_PRICES[diameter]?.suggested || 0;
    if (category === 'PVC' && diameter) return PVC_PRICES[diameter]?.suggested || 0;
    if (category === 'Water Pump' && pumpPower) return PUMP_PRICES[pumpPower]?.suggested || 0;
    return 0;
}
