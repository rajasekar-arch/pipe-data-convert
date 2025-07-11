import React, { useState, useEffect } from 'react';

// --- Start of PipeDataConvert Class Definition (for direct React use) ---
// In a real scenario, you'd import this from your npm package:
// import PipeDataConvert from 'PipeDataConvert'; // Package name changed to 'PipeDataConvert'
class PipeDataConvert {
    constructor() {
        this.conversionFactors = {
            length: {
                'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000,
                'inch': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mile': 1609.34,
            },
            area: {
                'sq_mm': 1e-6, 'sq_cm': 1e-4, 'sq_m': 1, 'sq_km': 1e6,
                'sq_inch': 0.00064516, 'sq_ft': 0.092903, 'acre': 4046.86, 'hectare': 10000,
            },
            volume: {
                'ml': 1e-6, 'liter': 0.001, 'cubic_cm': 1e-6, 'cubic_m': 1,
                'cubic_inch': 1.63871e-5, 'cubic_ft': 0.0283168, 'us_gallon': 0.00378541,
                'uk_gallon': 0.00454609, 'barrel': 0.158987,
            },
            flow_rate: {
                'lps': 0.001, 'lpm': 0.001 / 60, 'lmh': 0.001 / 3600,
                'cubic_mps': 1, 'cubic_mph': 1 / 3600,
                'us_gpm': 0.00378541 / 60, 'uk_gpm': 0.00454609 / 60,
                'cfm': 0.0283168 / 60, 'bpd': 0.158987 / (24 * 3600),
            },
            pressure: {
                'pa': 1, 'kpa': 1000, 'mpa': 1e6, 'bar': 100000, 'psi': 6894.76,
                'atm': 101325, 'kgf_per_sq_cm': 98066.5, 'mmHg': 133.322,
                'inHg': 3386.39, 'water_meter': 9806.65, 'water_ft': 2989.06,
            },
            temperature: {
                'celsius': (value, toBase = true) => toBase ? value + 273.15 : value - 273.15,
                'fahrenheit': (value, toBase = true) => toBase ? (value - 32) * 5/9 + 273.15 : (value - 273.15) * 9/5 + 32,
                'kelvin': (value, toBase = true) => value,
                'rankine': (value, toBase = true) => toBase ? value * 5/9 : value * 9/5,
            },
            mass: {
                'mg': 1e-6, 'g': 0.001, 'kg': 1, 'tonne': 1000,
                'lb': 0.453592, 'oz': 0.0283495, 'us_ton': 907.185, 'uk_ton': 1016.05,
            },
            velocity: {
                'mps': 1, 'kmph': 1 / 3.6, 'fps': 0.3048, 'mph': 0.44704, 'knot': 0.514444,
            },
            power: {
                'watt': 1, 'kw': 1000, 'hp': 745.7, 'btu_per_hr': 0.293071, 'ft_lb_per_s': 1.35582,
            },
            density: {
                'kg_per_cubic_m': 1, 'g_per_cubic_cm': 1000,
                'lb_per_cubic_ft': 16.0185, 'lb_per_cubic_inch': 27679.9,
            }
        };
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
        return null;
    }

    // --- New String Conversion Methods ---

    /**
     * Converts any value to its string representation.
     * @param {*} value - The value to convert.
     * @returns {string} The string representation of the value.
     */
    toString(value) {
        return String(value);
    }

    /**
     * Converts a string to a specified target type (number, boolean, date, array, object).
     * @param {string} str - The string to convert.
     * @param {string} targetType - The desired target type ('number', 'boolean', 'date', 'array', 'object').
     * @returns {*} The converted value, or null if conversion fails/type is unsupported.
     */
    fromString(str, targetType) {
        if (typeof str !== 'string') {
            console.error("Input for fromString must be a string.");
            return null;
        }
        switch (targetType.toLowerCase()) {
            case 'number':
                const num = parseFloat(str);
                return isNaN(num) ? null : num;
            case 'boolean':
                const lowerStr = str.toLowerCase().trim();
                return lowerStr === 'true' || lowerStr === '1' || lowerStr === 'yes';
            case 'date':
                const date = new Date(str);
                return isNaN(date.getTime()) ? null : date;
            case 'array':
            case 'object':
                try {
                    const parsed = JSON.parse(str);
                    if (targetType.toLowerCase() === 'array' && !Array.isArray(parsed)) {
                        console.error("String is not a valid JSON array.");
                        return null;
                    }
                    if (targetType.toLowerCase() === 'object' && (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null)) {
                        console.error("String is not a valid JSON object.");
                        return null;
                    }
                    return parsed;
                } catch (e) {
                    console.error(`Failed to parse string as ${targetType}:`, e);
                    return null;
                }
            default:
                console.warn(`Unsupported targetType for fromString: ${targetType}`);
                return str; // Return original string if type is unknown
        }
    }

    /**
     * Converts a string to camelCase. Eliminates spaces and special characters.
     * @param {string} str - The input string.
     * @returns {string} The camelCase string.
     */
    toCamelCase(str) {
        return String(str).replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, (match) => match.toLowerCase());
    }

    /**
     * Converts a string to snake_case. Eliminates spaces and special characters.
     * @param {string} str - The input string.
     * @returns {string} The snake_case string.
     */
    toSnakeCase(str) {
        return String(str).replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase();
    }

    /**
     * Converts a string to kebab-case. Eliminates spaces and special characters.
     * @param {string} str - The input string.
     * @returns {string} The kebab-case string.
     */
    toKebabCase(str) {
        return String(str).replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * Converts a string to PascalCase. Eliminates spaces and special characters.
     * @param {string} str - The input string.
     * @returns {string} The PascalCase string.
     */
    toPascalCase(str) {
        return String(str).replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, (match) => match.toUpperCase());
    }

    /**
     * Removes whitespace from both ends of a string. Does not affect internal spaces.
     * @param {string} str - The input string.
     * @returns {string} The trimmed string.
     */
    trim(str) {
        return String(str).trim();
    }

    /**
     * Converts a string to uppercase. Does not affect spaces.
     * @param {string} str - The input string.
     * @returns {string} The uppercase string.
     */
    toUpperCase(str) {
        return String(str).toUpperCase();
    }

    /**
     * Converts a string to lowercase. Does not affect spaces.
     * @param {string} str - The input string.
     * @returns {string} The lowercase string.
     */
    toLowerCase(str) {
        return String(str).toLowerCase();
    }

    // --- New Boolean Conversion Methods ---

    /**
     * Converts various types to a boolean.
     * Recognizes 'true', '1', 'yes' (case-insensitive) as true for strings.
     * Numbers other than 0 are true.
     * @param {*} value - The value to convert.
     * @returns {boolean} The boolean representation of the value.
     */
    toBoolean(value) {
        if (typeof value === 'string') {
            const lowerValue = value.toLowerCase().trim();
            return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes';
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        return !!value; // Handles null, undefined, 0, empty string, etc.
    }

    /**
     * Converts a boolean value to a string ('true'/'false') or number (1/0).
     * @param {boolean} boolValue - The boolean value to convert.
     * @param {string} [targetType='string'] - The desired target type ('string' or 'number').
     * @returns {string|number|null} The converted value, or null if input is not boolean or type is unsupported.
     */
    fromBoolean(boolValue, targetType = 'string') {
        if (typeof boolValue !== 'boolean') {
            console.error("Input for fromBoolean must be a boolean.");
            return null;
        }
        switch (targetType.toLowerCase()) {
            case 'string':
                return boolValue ? 'true' : 'false';
            case 'number':
                return boolValue ? 1 : 0;
            default:
                console.warn(`Unsupported targetType for fromBoolean: ${targetType}`);
                return boolValue;
        }
    }
}
// --- End of PipeDataConvert Class Definition ---

// Initialize the converter outside the component to avoid re-instantiation on re-renders
const pipeConverter = new PipeDataConvert();

const App = () => {
    // State for Unit Conversions
    const [category, setCategory] = useState('length');
    const [value, setValue] = useState(10);
    const [fromUnit, setFromUnit] = useState('inch');
    const [toUnit, setToUnit] = useState('mm');
    const [convertedResult, setConvertedResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const availableCategories = pipeConverter.getAvailableCategories();
    const unitsForSelectedCategory = pipeConverter.getUnitsForCategory(category);

    // State for String Conversions
    const [stringInput, setStringInput] = useState('hello world this is a test');
    const [stringConversionType, setStringConversionType] = useState('toCamelCase');
    const [stringConvertedResult, setStringConvertedResult] = useState('');
    const [stringTargetType, setStringTargetType] = useState('number'); // For fromString

    // State for Boolean Conversions
    const [booleanInput, setBooleanInput] = useState('true'); // Can be 'true', 'false', '1', '0', etc.
    const [booleanConvertedResult, setBooleanConvertedResult] = useState(null);
    const [fromBooleanTargetType, setFromBooleanTargetType] = useState('string'); // For fromBoolean

    // Effect to update 'from' and 'to' units when category changes
    useEffect(() => {
        if (unitsForSelectedCategory && unitsForSelectedCategory.length > 0) {
            setFromUnit(unitsForSelectedCategory[0]);
            setToUnit(unitsForSelectedCategory.length > 1 ? unitsForSelectedCategory[1] : unitsForSelectedCategory[0]);
        } else {
            setFromUnit('');
            setToUnit('');
        }
        setConvertedResult(null); // Clear previous result
        setErrorMessage(''); // Clear previous error
    }, [category, unitsForSelectedCategory]);

    // Handler for Unit Conversion
    const handleConvert = () => {
        setErrorMessage(''); // Clear previous error
        setConvertedResult(null); // Clear previous result

        if (isNaN(value)) {
            setErrorMessage('Please enter a valid number for the value.');
            return;
        }
        if (!fromUnit || !toUnit) {
            setErrorMessage('Please select both "From Unit" and "To Unit".');
            return;
        }
        if (fromUnit === toUnit) {
            setConvertedResult(`${value} ${toUnit.replace(/_/g, ' ')} (same units)`);
            return;
        }

        const result = pipeConverter.convert(category, value, fromUnit, toUnit);

        if (result !== null) {
            setConvertedResult(`${value} ${fromUnit.replace(/_/g, ' ')} = ${result.toFixed(6)} ${toUnit.replace(/_/g, ' ')}`);
        } else {
            setErrorMessage('Unit conversion failed. Please check your inputs and selected units.');
        }
    };

    // Handler for String Conversion
    const handleStringConvert = () => {
        let result;
        setErrorMessage('');
        setStringConvertedResult('');

        try {
            switch (stringConversionType) {
                case 'toString':
                    result = pipeConverter.toString(stringInput);
                    break;
                case 'fromString':
                    result = pipeConverter.fromString(stringInput, stringTargetType);
                    break;
                case 'toCamelCase':
                    result = pipeConverter.toCamelCase(stringInput);
                    break;
                case 'toSnakeCase':
                    result = pipeConverter.toSnakeCase(stringInput);
                    break;
                case 'toKebabCase':
                    result = pipeConverter.toKebabCase(stringInput);
                    break;
                case 'toPascalCase':
                    result = pipeConverter.toPascalCase(stringInput);
                    break;
                case 'trim':
                    result = pipeConverter.trim(stringInput);
                    break;
                case 'toUpperCase':
                    result = pipeConverter.toUpperCase(stringInput);
                    break;
                case 'toLowerCase':
                    result = pipeConverter.toLowerCase(stringInput);
                    break;
                default:
                    setErrorMessage('Invalid string conversion type selected.');
                    return;
            }
            setStringConvertedResult(JSON.stringify(result)); // Use JSON.stringify for complex types like array/object
        } catch (e) {
            setErrorMessage(`String conversion error: ${e.message}`);
        }
    };

    // Handler for Boolean Conversion
    const handleBooleanConvert = () => {
        setErrorMessage('');
        setBooleanConvertedResult(null);

        try {
            // First, convert the string input from the text field to a boolean using toBoolean
            const booleanValue = pipeConverter.toBoolean(booleanInput);

            // Now, convert this booleanValue to the selected target type (string or number)
            const convertedOutput = pipeConverter.fromBoolean(booleanValue, fromBooleanTargetType);
            
            // Display the result
            if (convertedOutput !== null) {
                setBooleanConvertedResult(convertedOutput.toString()); // Ensure it's a string for display
            } else {
                setErrorMessage('Boolean conversion failed. Check input or target type.');
            }
        } catch (e) {
            setErrorMessage(`Boolean conversion error: ${e.message}`);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-inter">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">PipeDataConvert: Unit & Data Converter</h1>

                {/* Unit Conversion Section */}
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Unit Conversions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="categorySelect" className="block text-gray-700 text-sm font-medium mb-2">Select Category:</label>
                            <select
                                id="categorySelect"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {availableCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.replace(/_/g, ' ').toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="valueInput" className="block text-gray-700 text-sm font-medium mb-2">Value to Convert:</label>
                            <input
                                type="number"
                                id="valueInput"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter value"
                                value={value}
                                onChange={(e) => setValue(parseFloat(e.target.value))}
                            />
                        </div>

                        <div>
                            <label htmlFor="fromUnitSelect" className="block text-gray-700 text-sm font-medium mb-2">From Unit:</label>
                            <select
                                id="fromUnitSelect"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                            >
                                {unitsForSelectedCategory && unitsForSelectedCategory.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="toUnitSelect" className="block text-gray-700 text-sm font-medium mb-2">To Unit:</label>
                            <select
                                id="toUnitSelect"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                            >
                                {unitsForSelectedCategory && unitsForSelectedCategory.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleConvert}
                        className="w-full mt-6 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:-translate-y-1"
                    >
                        Convert Units
                    </button>

                    {convertedResult && (
                        <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg text-center text-lg font-semibold text-blue-800 mt-4">
                            <p>{convertedResult}</p>
                        </div>
                    )}
                </div>

                {/* String Conversion Section */}
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">String Conversions</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Note: Casing conversions (Camel Case, Snake Case, Kebab Case, Pascal Case) are designed to remove spaces and special characters.
                        Use 'Trim', 'To Upper Case', or 'To Lower Case' if you wish to preserve internal spaces.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="stringInput" className="block text-gray-700 text-sm font-medium mb-2">String Input:</label>
                            <input
                                type="text"
                                id="stringInput"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter string"
                                value={stringInput}
                                onChange={(e) => setStringInput(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="stringConversionType" className="block text-gray-700 text-sm font-medium mb-2">Conversion Type:</label>
                            <select
                                id="stringConversionType"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={stringConversionType}
                                onChange={(e) => setStringConversionType(e.target.value)}
                            >
                                <option value="toString">To String</option>
                                <option value="fromString">From String (to specified type)</option>
                                <option value="toCamelCase">To Camel Case</option>
                                <option value="toSnakeCase">To Snake Case</option>
                                <option value="toKebabCase">To Kebab Case</option>
                                <option value="toPascalCase">To Pascal Case</option>
                                <option value="trim">Trim Whitespace</option>
                                <option value="toUpperCase">To Upper Case</option>
                                <option value="toLowerCase">To Lower Case</option>
                            </select>
                        </div>
                        {stringConversionType === 'fromString' && (
                            <div>
                                <label htmlFor="stringTargetType" className="block text-gray-700 text-sm font-medium mb-2">Target Type for From String:</label>
                                <select
                                    id="stringTargetType"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={stringTargetType}
                                    onChange={(e) => setStringTargetType(e.target.value)}
                                >
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="date">Date</option>
                                    <option value="array">Array (JSON)</option>
                                    <option value="object">Object (JSON)</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleStringConvert}
                        className="w-full mt-6 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:-translate-y-1"
                    >
                        Convert String
                    </button>
                    {stringConvertedResult && (
                        <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg text-center text-lg font-semibold text-blue-800 mt-4">
                            <p>Result: {stringConvertedResult}</p>
                        </div>
                    )}
                </div>

                {/* Boolean Conversion Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Boolean Conversions</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="booleanInput" className="block text-gray-700 text-sm font-medium mb-2">Input Value (e.g., 'true', 'false', '1', '0', 'yes', 'no', 1, 0, any string):</label>
                            <input
                                type="text"
                                id="booleanInput"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter value for boolean conversion"
                                value={booleanInput}
                                onChange={(e) => setBooleanInput(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="fromBooleanTargetType" className="block text-gray-700 text-sm font-medium mb-2">Display Converted Boolean As:</label>
                            <select
                                id="fromBooleanTargetType"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={fromBooleanTargetType}
                                onChange={(e) => setFromBooleanTargetType(e.target.value)}
                            >
                                <option value="string">String ('true'/'false')</option>
                                <option value="number">Number (1/0)</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleBooleanConvert}
                        className="w-full mt-6 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out transform hover:-translate-y-1"
                    >
                        Convert Boolean
                    </button>
                    {booleanConvertedResult !== null && (
                        <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg text-center text-lg font-semibold text-blue-800 mt-4">
                            <p>Result: {booleanConvertedResult}</p>
                        </div>
                    )}
                </div>

                {errorMessage && (
                    <div className="bg-red-50 border border-red-300 p-4 rounded-lg text-center text-red-700 font-medium mt-4">
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
