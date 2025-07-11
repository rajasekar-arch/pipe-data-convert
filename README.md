# **PipeDataConvert**

**PipeDataConvert** is a comprehensive and lightweight JavaScript library designed for efficient and versatile unit and data conversions. Whether you're dealing with pipe-related measurements (length, volume, flow rate, pressure, temperature, etc.) or need to transform string and boolean data types, PipeDataConvert provides a simple and consistent API.

This package is built to be framework-agnostic, making it easy to integrate into any JavaScript project, including React, Angular, Vue.js, Node.js, or plain HTML/JavaScript applications.

## **Features**

* **Extensive Unit Conversions**: Supports a wide range of categories like length, area, volume, flow rate, pressure, temperature, mass, velocity, and power, with numerous units within each.  
* **Flexible String Conversions**: Convert any data type to a string, parse strings to numbers, booleans, dates, arrays, or objects (from JSON), and apply various casing transformations (camelCase, snake\_case, kebab-case, PascalCase), trimming, and case changes.  
* **Robust Boolean Conversions**: Convert diverse values (strings, numbers, etc.) to booleans, and booleans to string or number representations.  
* **Simple API**: Easy-to-use methods for quick and reliable conversions.  
* **Lightweight & No Dependencies**: Minimal footprint for optimal performance.

## **Installation**

You can install PipeDataConvert using npm:

npm install PipeDataConvert

## **How to Use**

### **1\. Import and Initialize**

First, import the `PipeConverter` class and create an instance:

// For ES Modules (e.g., in React, Angular, Vue.js, or modern Node.js)  
import PipeConverter from 'PipeDataConvert';

const converter \= new PipeConverter();

// For CommonJS (e.g., older Node.js environments)  
// const PipeConverter \= require('PipeDataConvert').default;  
// const converter \= new PipeConverter();

// For direct use in browser via \<script type="module"\> (assuming 'dist/PipeConverter.js' is served)  
// import PipeConverter from './node\_modules/PipeDataConvert/dist/PipeConverter.js';  
// const converter \= new PipeConverter();

### **2\. Unit Conversions**

Use the `convert(category, value, fromUnit, toUnit)` method for unit conversions.

**Syntax:**

converter.convert(category: string, value: number, fromUnit: string, toUnit: string): number | null

**Example: Length Conversion**

const lengthInInches \= 10;  
const lengthInMM \= converter.convert('length', lengthInInches, 'inch', 'mm');  
console.log(\`${lengthInInches} inches is ${lengthInMM.toFixed(2)} mm\`);  
// Output: 10 inches is 254.00 mm

const lengthInFeet \= 50;  
const lengthInMeters \= converter.convert('length', lengthInFeet, 'ft', 'm');  
console.log(\`${lengthInFeet} feet is ${lengthInMeters.toFixed(2)} meters\`);  
// Output: 50 feet is 15.24 meters

**Example: Pressure Conversion**

const pressureInPSI \= 15;  
const pressureInKPA \= converter.convert('pressure', pressureInPSI, 'psi', 'kpa');  
console.log(\`${pressureInPSI} psi is ${pressureInKPA.toFixed(2)} kpa\`);  
// Output: 15 psi is 103.42 kpa

**Example: Temperature Conversion**

Temperature conversions are handled correctly with their additive nature (e.g., Celsius to Kelvin).

const tempInCelsius \= 25;  
const tempInFahrenheit \= converter.convert('temperature', tempInCelsius, 'celsius', 'fahrenheit');  
console.log(\`${tempInCelsius}°C is ${tempInFahrenheit.toFixed(2)}°F\`);  
// Output: 25°C is 77.00°F

const tempInKelvin \= 300;  
const tempInCelsiusFromK \= converter.convert('temperature', tempInKelvin, 'kelvin', 'celsius');  
console.log(\`${tempInKelvin}K is ${tempInCelsiusFromK.toFixed(2)}°C\`);  
// Output: 300K is 26.85°C

### **3\. String Conversions**

PipeDataConvert provides several methods for string manipulation and type conversion.

**Note on Casing Conversions:** Methods like `toCamelCase`, `toSnakeCase`, `toKebabCase`, and `toPascalCase` are designed to remove spaces and special characters from the input string as part of their transformation to create a single, continuous string. If you need to preserve internal spaces, use `trim()`, `toUpperCase()`, or `toLowerCase()`.

**Example: `toString(value)`**

Converts any value to its string representation.

console.log(converter.toString(123));          // "123"  
console.log(converter.toString(true));         // "true"  
console.log(converter.toString(\[1, 2, 3\]));    // "1,2,3"  
console.log(converter.toString({a: 1}));       // "\[object Object\]"

**Example: `fromString(str, targetType)`**

Converts a string to a specified target type.

console.log(converter.fromString("123.45", "number"));    // 123.45  
console.log(converter.fromString("true", "boolean"));     // true  
console.log(converter.fromString("yes", "boolean"));      // true  
console.log(converter.fromString("2023-01-15", "date"));  // Date object for 2023-01-15  
console.log(converter.fromString("\[1,2,3\]", "array"));   // \[1, 2, 3\]  
console.log(converter.fromString('{"key":"value"}', "object")); // { key: "value" }  
console.log(converter.fromString("not a number", "number")); // null

**Example: Casing Conversions**

const myString \= "hello world this is a test string";

console.log(converter.toCamelCase(myString));     // "helloWorldThisIsATestString"  
console.log(converter.toSnakeCase(myString));     // "hello\_world\_this\_is\_a\_test\_string"  
console.log(converter.toKebabCase(myString));     // "hello-world-this-is-a-test-string"  
console.log(converter.toPascalCase(myString));    // "HelloWorldThisIsATestString"

console.log(converter.toCamelCase("another-example\_with spaces")); // "anotherExampleWithSpaces"

**Example: Other String Manipulations**

const spacedString \= "  leading and trailing spaces  ";  
console.log(converter.trim(spacedString));        // "leading and trailing spaces"

console.log(converter.toUpperCase("hello"));      // "HELLO"  
console.log(converter.toLowerCase("WORLD"));      // "world"

### **4\. Boolean Conversions**

PipeDataConvert offers methods to convert to and from boolean types.

**Example: `toBoolean(value)`**

Converts various types to a boolean.

console.log(converter.toBoolean("true"));   // true  
console.log(converter.toBoolean("1"));      // true  
console.log(converter.toBoolean("yes"));    // true  
console.log(converter.toBoolean("false"));  // false  
console.log(converter.toBoolean("0"));      // false  
console.log(converter.toBoolean("no"));     // false  
console.log(converter.toBoolean(1));        // true  
console.log(converter.toBoolean(0));        // false  
console.log(converter.toBoolean("any string")); // true (non-empty string is truthy)  
console.log(converter.toBoolean(null));     // false  
console.log(converter.toBoolean(undefined)); // false

**Example: `fromBoolean(boolValue, targetType)`**

Converts a boolean to a string or number.

console.log(converter.fromBoolean(true, "string"));   // "true"  
console.log(converter.fromBoolean(false, "string"));  // "false"  
console.log(converter.fromBoolean(true, "number"));   // 1  
console.log(converter.fromBoolean(false, "number"));  // 0

## **Available Categories and Units**

You can programmatically retrieve available categories and units:

console.log(converter.getAvailableCategories());  
/\*  
\[  
  'length', 'area', 'volume', 'flow\_rate', 'pressure',  
  'temperature', 'mass', 'velocity', 'power', 'density'  
\]  
\*/

console.log(converter.getUnitsForCategory('length'));  
/\*  
\[  
  'mm', 'cm', 'm', 'km', 'inch', 'ft', 'yd', 'mile'  
\]  
\*/

console.log(converter.getUnitsForCategory('temperature'));  
/\*  
\[  
  'celsius', 'fahrenheit', 'kelvin', 'rankine'  
\]  
\*/

## **Contribution**

Contributions are welcome\! 
If you have suggestions for new units, categories, or data conversion methods, please feel free to open an issue or submit a pull request.

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

