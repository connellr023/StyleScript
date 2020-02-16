/**
 * Style Script Main Compiler File
 * @author Connell Reffo (Crisp32)
 */

import { Function, ISelector, Property } from "./objects";
import * as fs from "fs";
import * as path from "path";
import * as utils from "./utils";

/**
 * Character to be Placed before Functions EX: %var(name, val);
 */
export const keywordPrefix:string = "%";
export const fileExtension:string = "sscr";

export class StyleScript {

    /**
     * List of Registered StyleScript Functions
     */
    static functions:Array<Function> = [
        new Function("print", (args) => console.log(args.join(" "))),
        new Function("var", utils.defineVar)
    ];

    /**
     * List of Read CSS Selectors
     */
    static selectors:Array<ISelector> = [];

    /**
     * List of StyleScript Variables
     */
    static variables:Array<Property> = [];

    /**
     * StyleScript Main Compilation Function
     * @param filePath is the path to the *.ss file to be compiled
     * @param vars is for values that are to be passed to the StyleScript compiler
     */
    public static compile(filePath:string, vars?:object):string {
        var compiled:string = "/* Generated with the StyleScript Compiler */\n";

        // Validate File Extension
        const extensionMatches:Array<string> = filePath.match(/\.[0-9a-z]+$/gi);
        const extension:string = extensionMatches[extensionMatches.length - 1].toLowerCase();
        
        if (extension != `.${fileExtension}`) {
            return `/* File Must have a .${fileExtension} Extension */`;
        }

        // Start Compilation Process
        var file:string = path.resolve(filePath);

        // Register Passed Variables
        if (vars != null) {
            const varNames = Object.keys(vars);
            const varValues = Object.values(vars);

            for (var v = 0; v < varNames.length; v++) {
                const name:string = varNames[v];
                const value:string = varValues[v];

                utils.defineVar([name, value]);
            }
        }

        // Remove Whitespace from File Content
        var toCompile:string = fs.readFileSync(file).toString();
        toCompile = toCompile
            .replace(/[\n\r\t]/g, "")
            .replace(/\s+/g, "")
            .replace(/\/\*(.*?)\*\//g, "");

        // Parse Each Line into its own Array Index
        var lines:Array<string> = toCompile.split(";");

        var selector:string = "";
        var readingSelector:boolean = false;

        // Iterate through Each Line
        for (var l = 0; l < lines.length; l++) {
            const line:string = lines[l];
            var isFunc:boolean = false;

            if (readingSelector) {
                if (line.includes("}")) {

                    // Split Selectors into Name and Property
                    const propStart = selector.indexOf("{");
                    const props:Array<string> = selector.substr(propStart).split(";");
                    const selName:string = selector.substr(0, propStart).replace("}", "");

                    compiled += `\n${selName} {\n`;

                    // Get Properties
                    var properties:Array<Property> = [];

                    for (var prop in props) {
                        var property = props[prop].replace("{", "").split(":");

                        if (property[0] != "") {

                            // Insert Variables
                            for (var variable in this.variables) {
                                property[1] = property[1].replace(this.variables[variable].name, this.variables[variable].value);
                            }

                            // Add Spaces Around Calculations
                            if (property[1].includes("(")) {
                                const start:number = property[1].indexOf("(");
                                const end:number = property[1].indexOf(")");

                                const inside:string = property[1].substr(start, end);

                                property[1] = property[1].replace(inside, inside
                                    .replace("-", " - ")
                                    .replace("+", " + ")
                                    .replace("*", " * ")
                                    .replace("/", " / ")
                                );
                            }

                            compiled += `\t${property[0]}: ${property[1]};\n`;

                            // Add to Properties Array
                            properties.push(new Property(property[0], property[1]));
                        }
                    }

                    this.selectors.push({
                        selector: selName,
                        properties: properties
                    });

                    compiled += "}\n";

                    // Reset
                    selector = "";
                    readingSelector = false;
                    l--;
                }

                selector += `${line};`.replace("}", "");
            }
            else {

                // Check for Functions
                for (var f in this.functions) {
                    const func:Function = this.functions[f];

                    if (line.includes(keywordPrefix + func.name)) {
                        const args:Array<string> = func.parseArgs(line);
                        isFunc = true;

                        // Process Arguments
                        func.callback(args);
                    }
                }

                // Get Selector and its Properties
                if (!isFunc) {
                    if (line.includes("{")) {
                        selector = `${line};`;
                        readingSelector = true;
                    }
                }
            }
        }
        
        return compiled;
    }

    public static middleware(req:any, res:any, next:(() => void)):void {
        console.log(req.body);

        // Call Next Middleware Function
        next();
    }
}

// Export Modules for Node require();
exports.StyleScript = StyleScript;