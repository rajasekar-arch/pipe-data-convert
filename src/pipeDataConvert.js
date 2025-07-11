/**
 * @file pipeDataConvert.js
 * @description A comprehensive JavaScript module for various pipe-related unit conversions.
 * Designed to be framework-agnostic and easily integrated into npm packages.
 */

class PipeDataConvert {
    constructor() {
        /**
         * @private
         * @property {Object.<string, Object.<string, number>>} conversionFactors -
         * A nested object storing conversion factors.
         * The first level keys are conversion categories (e.g., 'length', 'volume').
         * The second level keys are units within that category.
         * The values are the conversion factors to a defined base unit for that category.
         * Example: 'meter': 1 (base unit for length), 'inch': 0.0254 (1 inch = 0.0254 meters).
         */
        this.conversionFactors = {
            length: {
                // Base unit: meter (m)
                'mm': 0.001,
                'cm': 0.01,
                'm': 1,
                'km': 1000,
                'inch': 0.0254,
                'ft': 0.3048,
                'yd': 0.9144,
                'mile': 1609.34,
            },
            area: {
                // Base unit: square meter (m²)
                'sq_mm': 1e-6,
                'sq_cm': 1e-4,
                'sq_m': 1,
                'sq_km': 1e6,
                'sq_inch': 0.00064516,
                'sq_ft': 0.092903,
                'acre': 4046.86,
                'hectare': 10000,
            },
            volume: {
                // Base unit: cubic meter (m³)
                'ml': 1e-6,
                'liter': 0.001,
                'cubic_cm': 1e-6,
                'cubic_m': 1,
                'cubic_inch': 1.63871e-5,
                'cubic_ft': 0.0283168,
                'us_gallon': 0.00378541,
                'uk_gallon': 0.00454609,
                'barrel': 0.158987, // US liquid barrel
            },
            flow_rate: {
                // Base unit: cubic meter per second (m³/s)
                'lps': 0.001, // Liters per second
                'lpm': 0.001 / 60, // Liters per minute
                'lmh': 0.001 / 3600, // Liters per hour
                'cubic_mps': 1, // Cubic meters per second
                'cubic_mph': 1 / 3600, // Cubic meters per hour
                'us_gpm': 0.00378541 / 60, // US Gallons per minute
                'uk_gpm': 0.00454609 / 60, // UK Gallons per minute
                'cfm': 0.0283168 / 60, // Cubic feet per minute
                'bpd': 0.158987 / (24 * 3600), // Barrels per day
            },
            pressure: {
                // Base unit: Pascal (Pa)
                'pa': 1,
                'kpa': 1000,
                'mpa': 1e6,
                'bar': 100000,
                'psi': 6894.76,
                'atm': 101325,
                'kgf_per_sq_cm': 98066.5, // Kilogram-force per square centimeter
                'mmHg': 133.322, // Millimeters of mercury
                'inHg': 3386.39, // Inches of mercury
                'water_meter': 9806.65, // Meters of water column
                'water_ft': 2989.06, // Feet of water column
            },
            temperature: {
                // Base unit: Kelvin (K) - requires offset for Celsius/Fahrenheit
                'celsius': (value) => value + 273.15, // To Kelvin
                'fahrenheit': (value) => (value - 32) * 5/9 + 273.15, // To Kelvin
                'kelvin': (value) => value, // To Kelvin
                'rankine': (value) => value * 5/9, // To Kelvin
                // For inverse conversions (from Kelvin)
                'celsius_inv': (value) => value - 273.15,
                'fahrenheit_inv': (value) => (value - 273.15) * 9/5 + 32,
                'kelvin_inv': (value) => value,
                'rankine_inv': (value) => value * 9/5,
            },
            mass: {
                // Base unit: kilogram (kg)
                'mg': 1e-6,
                'g': 0.001,
                'kg': 1,
                'tonne': 1000, // Metric ton
                'lb': 0.453592, // Pounds
                'oz': 0.0283495, // Ounces
                'us_ton': 907.185, // US Short ton
                'uk_ton': 1016.05, // UK Long ton
            },
            velocity: {
                // Base unit: meter per second (m/s)
                'mps': 1,
                'kmph': 1 / 3.6, // Kilometers per hour
                'fps': 0.3048, // Feet per second
                'mph': 0.44704, // Miles per hour
                'knot': 0.514444, // Nautical miles per hour
            },
            power: {
                // Base unit: Watt (W)
                'watt': 1,
                'kw': 1000,
                'hp': 745.7, // Mechanical horsepower
                'btu_per_hr': 0.293071, // BTU per hour
                'ft_lb_per_s': 1.35582, // Foot-pounds per second
            },
            density: {
                // Base unit: kilogram per cubic meter (kg/m³)
                'kg_per_cubic_m': 1,
                'g_per_cubic_cm': 1000, // 1 g/cm³ = 1000 kg/m³
                'lb_per_cubic_ft': 16.0185, // Pounds per cubic foot
                'lb_per_cubic_inch': 27679.9, // Pounds per cubic inch
            }
            // Add more categories and units as needed to reach 150+ conversions
            // For example, energy, viscosity, etc.
        };

        // Populate inverse temperature conversion methods
        this.conversionFactors.temperature.celsius = (value, toBase = true) => toBase ? value + 273.15 : value - 273.15;
        this.conversionFactors.temperature.fahrenheit = (value, toBase = true) => toBase ? (value - 32) * 5/9 + 273.15 : (value - 273.15) * 9/5 + 32;
        this.conversionFactors.temperature.kelvin = (value, toBase = true) => value;
        this.conversionFactors.temperature.rankine = (value, toBase = true) => toBase ? value * 5/9 : value * 9/5;
    }

    /**
     * Converts a value from one unit to another within the same category.
     *
     * @param {string} category - The category of conversion (e.g., 'length', 'pressure').
     * @param {number} value - The numerical value to convert.
     * @param {string} fromUnit - The unit to convert from (e.g., 'inch', 'psi').
     * @param {string} toUnit - The unit to convert to (e.g., 'mm', 'kpa').
     * @returns {number | null} The converted value, or null if units/category are invalid.
     */
    convert(category, value, fromUnit, toUnit) {
        // Validate category
        if (!this.conversionFactors[category]) {
            console.error(`Error: Unknown conversion category '${category}'.`);
            return null;
        }

        const categoryUnits = this.conversionFactors[category];

        // Validate fromUnit and toUnit
        if (!categoryUnits[fromUnit]) {
            console.error(`Error: Unknown 'from' unit '${fromUnit}' for category '${category}'.`);
            return null;
        }
        if (!categoryUnits[toUnit]) {
            console.error(`Error: Unknown 'to' unit '${toUnit}' for category '${category}'.`);
            return null;
        }

        let valueInBaseUnit;

        // Handle temperature conversions separately due to their additive nature
        if (category === 'temperature') {
            // Convert from 'fromUnit' to Kelvin (base unit)
            valueInBaseUnit = categoryUnits[fromUnit](value, true); // true indicates converting TO base
            // Convert from Kelvin (base unit) to 'toUnit'
            return categoryUnits[toUnit](valueInBaseUnit, false); // false indicates converting FROM base
        }

        // For all other categories, use multiplicative factors
        // Convert the input value to the category's base unit
        valueInBaseUnit = value * categoryUnits[fromUnit];

        // Convert the base unit value to the target unit
        const convertedValue = valueInBaseUnit / categoryUnits[toUnit];

        return convertedValue;
    }

    /**
     * Returns a list of available conversion categories.
     * @returns {string[]} An array of category names.
     */
    getAvailableCategories() {
        return Object.keys(this.conversionFactors);
    }

    /**
     * Returns a list of available units for a given category.
     * @param {string} category - The category name.
     * @returns {string[] | null} An array of unit names, or null if the category is invalid.
     */
    getUnitsForCategory(category) {
        if (this.conversionFactors[category]) {
            // For temperature, exclude the inverse conversion functions from the list of units
            if (category === 'temperature') {
                return Object.keys(this.conversionFactors[category]).filter(unit => !unit.endsWith('_inv'));
            }
            return Object.keys(this.conversionFactors[category]);
        }
        console.warn(`Category '${category}' not found.`);
        return null;
    }
}

// Export the class for use in modules (e.g., Node.js, Webpack, Rollup)
export default PipeDataConvert;

// For direct use in browsers (e.g., via <script> tag), you might also expose it globally:
// if (typeof window !== 'undefined') {
//     window.PipeDataConvert = PipeDataConvert;
// }
