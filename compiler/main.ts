/**
 * Style Script Main Compiler File
 * @author Connell Reffo (Crisp32)
 */

import { Function, ISelector, Property } from "./objects";
import * as fs from "fs";
import * as path from "path";

/**
 * Character to be Placed before Functions EX: %var(name, val);
 */
export const keywordPrefix:string = "%";

export class StyleScript {

    /**
     * List of Registered StyleScript Functions
     */
    static functions:Array<Function> = [
        new Function("import"),
        new Function("var")
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
     * @param filePath is the Path to the *.ss File to be Compiled
     */
    public static compile(filePath:string):string {
        var file:string = path.resolve(filePath);
        var compiled:string;

        // Remove Whitespace from File Content
        var toCompile:string = fs.readFileSync(file).toString();
        toCompile = toCompile.replace(/[\n\r\t]/g, "").replace(/\s+/g, "");

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

                    // Get Properties
                    var properties:Array<Property> = [];

                    for (var prop in props) {
                        var property = props[prop].replace("{", "").split(":");

                        if (property[0] != "") {

                            // Insert Variables
                            for (var variable in this.variables) {
                                if (property[1] == this.variables[variable].name) {
                                   property[1] = this.variables[variable].value; 
                                }
                            }

                            // Add to Properties Array
                            properties.push(new Property(property[0], property[1]));
                        }
                    }

                    this.selectors.push({
                        selector: selName,
                        properties: properties
                    });

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
                        const args:Array<string> = func.parseParams(line);
                        isFunc = true;

                        // Process Arguments
                        if (func.name === "var") {
                            this.variables.push(new Property(args[0], args[1]));
                        }
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
        
        console.log(this.selectors[0].properties);
        return compiled;
    }
}

StyleScript.compile("./ss_files/file1.ss");