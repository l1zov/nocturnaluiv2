import { createSingleton } from './base';
import type { Suggestion, SuggestionsData } from '../types';

class SuggestionServiceClass {
    private suggestions: Suggestion[] = [];
    private loaded = false;

    async loadSuggestions(): Promise<void> {
        if (this.loaded) return;

        try {
            this.suggestions = this.buildSuggestions();
            this.loaded = true;
        } catch (error) {
            console.error('[SuggestionService.load]', error);
        }
    }

    // get all suggestions
    getSuggestions(): Suggestion[] {
        return this.suggestions;
    }

    // check if suggestions are loaded
    isLoaded(): boolean {
        return this.loaded;
    }

    // build suggestions from data
    private buildSuggestions(): Suggestion[] {
        const data = this.getSuggestionsData();

        return [
            ...(data.function ?? []),
            ...(data.property ?? []),
            ...(data.class ?? []),
            ...(data.method ?? []),
        ];
    }

    // get raw suggestions data
    private getSuggestionsData(): SuggestionsData {
        return SUGGESTIONS_DATA;
    }
}

const getSuggestionService = createSingleton(() => new SuggestionServiceClass());

export const suggestionService = getSuggestionService();

const SUGGESTIONS_DATA: SuggestionsData = {
    function: [
        { label: "local", detail: "keyword", documentation: "Declares a local variable" },
        { label: "function", detail: "keyword", documentation: "Declares a function" },
        { label: "if", detail: "keyword", documentation: "Starts an if statement" },
        { label: "then", detail: "keyword", documentation: "Used after if condition" },
        { label: "else", detail: "keyword", documentation: "Alternative branch in if statement" },
        { label: "elseif", detail: "keyword", documentation: "Additional condition in if statement" },
        { label: "end", detail: "keyword", documentation: "Ends a block statement" },
        { label: "for", detail: "keyword", documentation: "Starts a for loop" },
        { label: "while", detail: "keyword", documentation: "Starts a while loop" },
        { label: "do", detail: "keyword", documentation: "Starts a do block" },
        { label: "repeat", detail: "keyword", documentation: "Starts a repeat-until loop" },
        { label: "until", detail: "keyword", documentation: "Ends a repeat-until loop" },
        { label: "break", detail: "keyword", documentation: "Exits a loop" },
        { label: "return", detail: "keyword", documentation: "Returns from a function" },
        { label: "nil", detail: "keyword", documentation: "Represents no value" },
        { label: "true", detail: "keyword", documentation: "Boolean true value" },
        { label: "false", detail: "keyword", documentation: "Boolean false value" },
        { label: "and", detail: "keyword", documentation: "Logical AND operator" },
        { label: "or", detail: "keyword", documentation: "Logical OR operator" },
        { label: "not", detail: "keyword", documentation: "Logical NOT operator" },
        { label: "in", detail: "keyword", documentation: "Used in for loops" },

        { label: "print", detail: "(message: any) -> void", documentation: "Prints a message to output" },
        { label: "warn", detail: "(message: string) -> void", documentation: "Outputs a warning message" },
        { label: "error", detail: "(message: string, level?: number) -> never", documentation: "Throws an error" },
        { label: "type", detail: "(value: any) -> string", documentation: "Returns the type of a value" },
        { label: "tostring", detail: "(value: any) -> string", documentation: "Converts to string" },
        { label: "tonumber", detail: "(value: string, base?: number) -> number?", documentation: "Converts to number" },
        { label: "pairs", detail: "(table: table) -> iterator", documentation: "Iterates over key-value pairs" },
        { label: "ipairs", detail: "(table: table) -> iterator", documentation: "Iterates over array elements" },
        { label: "next", detail: "(table: table, index?: any) -> any, any", documentation: "Returns next key-value pair" },
        { label: "select", detail: "(index: number|string, ...args) -> any", documentation: "Returns selected arguments" },
        { label: "unpack", detail: "(table: table, i?: number, j?: number) -> ...", documentation: "Unpacks table elements" },
        { label: "pcall", detail: "(func: function, ...args) -> boolean, ...", documentation: "Protected function call" },
        { label: "xpcall", detail: "(func: function, errHandler: function, ...args) -> boolean, ...", documentation: "Protected call with error handler" },
        { label: "require", detail: "(moduleName: string) -> any", documentation: "Loads a module" },
        { label: "setmetatable", detail: "(table: table, metatable: table?) -> table", documentation: "Sets the metatable" },
        { label: "getmetatable", detail: "(object: any) -> table?", documentation: "Gets the metatable" },
        { label: "rawget", detail: "(table: table, key: any) -> any", documentation: "Gets without metamethod" },
        { label: "rawset", detail: "(table: table, key: any, value: any) -> table", documentation: "Sets without metamethod" },
        { label: "rawequal", detail: "(v1: any, v2: any) -> boolean", documentation: "Compares without metamethod" },
        { label: "collectgarbage", detail: "(opt?: string, arg?: number) -> any", documentation: "Controls garbage collector" },

        { label: "table.insert", detail: "(table: table, pos?: number, value: any) -> void", documentation: "Inserts element into table" },
        { label: "table.remove", detail: "(table: table, pos?: number) -> any", documentation: "Removes element from table" },
        { label: "table.sort", detail: "(table: table, comp?: function) -> void", documentation: "Sorts table in place" },
        { label: "table.concat", detail: "(table: table, sep?: string, i?: number, j?: number) -> string", documentation: "Concatenates table elements" },
        { label: "table.find", detail: "(table: table, value: any) -> number?", documentation: "Finds value in array" },
        { label: "table.clear", detail: "(table: table) -> void", documentation: "Clears all elements" },
        { label: "table.clone", detail: "(table: table) -> table", documentation: "Shallow clones a table" },
        { label: "table.freeze", detail: "(table: table) -> table", documentation: "Makes table read-only" },
        { label: "table.isfrozen", detail: "(table: table) -> boolean", documentation: "Checks if table is frozen" },
        { label: "table.pack", detail: "(...) -> table", documentation: "Packs arguments into table" },
        { label: "table.unpack", detail: "(table: table, i?: number, j?: number) -> ...", documentation: "Unpacks table elements" },
        { label: "table.move", detail: "(a1: table, f: number, e: number, t: number, a2?: table) -> table", documentation: "Moves elements between tables" },
        { label: "table.create", detail: "(count: number, value?: any) -> table", documentation: "Creates table with size hint" },
        { label: "table.getn", detail: "(table: table) -> number", documentation: "Gets array length" },
        { label: "table.foreach", detail: "(table: table, callback: function) -> void", documentation: "Iterates with callback" },
        { label: "table.foreachi", detail: "(table: table, callback: function) -> void", documentation: "Iterates array with callback" },

        // String functions
        { label: "string.len", detail: "(s: string) -> number", documentation: "Returns string length" },
        { label: "string.sub", detail: "(s: string, i: number, j?: number) -> string", documentation: "Returns substring" },
        { label: "string.upper", detail: "(s: string) -> string", documentation: "Converts to uppercase" },
        { label: "string.lower", detail: "(s: string) -> string", documentation: "Converts to lowercase" },
        { label: "string.rep", detail: "(s: string, n: number, sep?: string) -> string", documentation: "Repeats string n times" },
        { label: "string.reverse", detail: "(s: string) -> string", documentation: "Reverses string" },
        { label: "string.byte", detail: "(s: string, i?: number, j?: number) -> number...", documentation: "Returns byte values" },
        { label: "string.char", detail: "(...numbers) -> string", documentation: "Creates string from bytes" },
        { label: "string.find", detail: "(s: string, pattern: string, init?: number, plain?: boolean) -> number?, number?", documentation: "Finds pattern in string" },
        { label: "string.match", detail: "(s: string, pattern: string, init?: number) -> ...string?", documentation: "Matches pattern" },
        { label: "string.gmatch", detail: "(s: string, pattern: string) -> iterator", documentation: "Global pattern iterator" },
        { label: "string.gsub", detail: "(s: string, pattern: string, repl: string|function|table, n?: number) -> string, number", documentation: "Global substitution" },
        { label: "string.format", detail: "(formatstring: string, ...args) -> string", documentation: "Formats string" },
        { label: "string.split", detail: "(s: string, separator?: string) -> {string}", documentation: "Splits string by separator" },

        { label: "math.abs", detail: "(x: number) -> number", documentation: "Returns absolute value" },
        { label: "math.ceil", detail: "(x: number) -> number", documentation: "Rounds up" },
        { label: "math.floor", detail: "(x: number) -> number", documentation: "Rounds down" },
        { label: "math.round", detail: "(x: number) -> number", documentation: "Rounds to nearest" },
        { label: "math.max", detail: "(...numbers) -> number", documentation: "Returns maximum" },
        { label: "math.min", detail: "(...numbers) -> number", documentation: "Returns minimum" },
        { label: "math.sqrt", detail: "(x: number) -> number", documentation: "Returns square root" },
        { label: "math.pow", detail: "(x: number, y: number) -> number", documentation: "Returns x^y" },
        { label: "math.exp", detail: "(x: number) -> number", documentation: "Returns e^x" },
        { label: "math.log", detail: "(x: number, base?: number) -> number", documentation: "Returns logarithm" },
        { label: "math.log10", detail: "(x: number) -> number", documentation: "Returns log base 10" },
        { label: "math.sin", detail: "(x: number) -> number", documentation: "Returns sine" },
        { label: "math.cos", detail: "(x: number) -> number", documentation: "Returns cosine" },
        { label: "math.tan", detail: "(x: number) -> number", documentation: "Returns tangent" },
        { label: "math.asin", detail: "(x: number) -> number", documentation: "Returns arc sine" },
        { label: "math.acos", detail: "(x: number) -> number", documentation: "Returns arc cosine" },
        { label: "math.atan", detail: "(y: number, x?: number) -> number", documentation: "Returns arc tangent" },
        { label: "math.atan2", detail: "(y: number, x: number) -> number", documentation: "Returns arc tangent of y/x" },
        { label: "math.deg", detail: "(x: number) -> number", documentation: "Converts radians to degrees" },
        { label: "math.rad", detail: "(x: number) -> number", documentation: "Converts degrees to radians" },
        { label: "math.random", detail: "(m?: number, n?: number) -> number", documentation: "Returns random number" },
        { label: "math.randomseed", detail: "(x: number) -> void", documentation: "Sets random seed" },
        { label: "math.clamp", detail: "(x: number, min: number, max: number) -> number", documentation: "Clamps value to range" },
        { label: "math.sign", detail: "(x: number) -> number", documentation: "Returns sign (-1, 0, 1)" },
        { label: "math.noise", detail: "(x: number, y?: number, z?: number) -> number", documentation: "Returns Perlin noise" },
        { label: "math.lerp", detail: "(a: number, b: number, t: number) -> number", documentation: "Linear interpolation" },
        { label: "math.huge", detail: "number", documentation: "Positive infinity" },
        { label: "math.pi", detail: "number", documentation: "Value of π" },
    ],
    property: [],
    class: [],
    method: [],
};
