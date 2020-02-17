/**
 * Style Script Main Compiler File
 * @author Connell Reffo (Crisp32)
 */

import { Function, ISelector, Property } from "./objects";
import * as fs from "fs";
import * as path from "path";
import * as utils from "./utils";

/**
 * Character to be Placed before Keywords/Functions EX: %var(name, val);
 */
export const keywordPrefix:string = "%";
export const fileExtension:string = "sscr";

export class StyleScript {

    /**
     * List of Registered StyleScript Functions
     */
    static functions:Array<Function> = [
        new Function("include", utils.includeFiles),
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
     * StyleScript to be Compiled
     */
    static lines:Array<string> = [];

    /**
     * StyleScript Files that have Already been Included (Prevents Multi Inclusion)
     */
    static included:Array<string> = [];

    /**
     * StyleScript Main Compilation Function
     * @param filePath is the path to the StyleScript File to be compiled
     * @param vars is for values that are to be passed to the StyleScript compiler
     */
    public static compile(filePath:string, vars?:object):string {
        this.lines = [];
        this.included = [path.resolve(filePath)];

        var toCompile:string = "";
    
        // Validate File Extension
        const extensionMatches:Array<string> = filePath.match(/\.[0-9a-z]+$/gi);
        const extension:string = extensionMatches[extensionMatches.length - 1].toLowerCase();
        
        if (extension != `.${fileExtension}`) {
            return `/* File Must have a .${fileExtension} Extension */`;
        }

        // Start Compilation Process
        var file:string = path.resolve(filePath);
        var compiled:string = "/* Generated with the StyleScript Compiler */\n";

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
        toCompile = fs.readFileSync(file).toString();
        toCompile = utils.formatStyles(toCompile);

        // Parse Each Line into its own Array Index
        this.lines = toCompile.split(";");

        var selector:string = "";
        var readingSelector:boolean = false;

        // Iterate through Each Line
        for (var l = 0; l < this.lines.length; l++) {
            const line:string = this.lines[l];
            var isFunc:boolean = false;

            if (readingSelector) {
                if (line.includes("}")) {

                    // Split Selectors into Name and Property
                    const propStart = selector.indexOf("{");
                    const props:Array<string> = selector.substr(propStart).split(";");
                    const selName:string = selector.substr(0, propStart).replace("}", "");

                    var isBlock:boolean = false;

                    if (selName.substr(0, 1) == keywordPrefix) {
                        isBlock = true;
                    }
                    else {
                        compiled += `\n${selName} {\n`;
                    }

                    // Get Properties
                    var properties:Array<Property> = [];

                    for (var prop in props) {
                        var property = props[prop].replace("{", "").split(":");

                        if (property[0] != "") {
                            const isBlockReference:boolean = (property[0].substr(0, 1) == keywordPrefix);

                            if (!isBlockReference) {

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
    
                                if (!isBlock) { compiled += `\t${property[0]}: ${property[1]};\n`; }
                                
                                // Add to Properties Array
                                properties.push(new Property(property[0], property[1]));
                            }
                            else {
                                
                                // Get Referenced Block Properties
                                for (var s = 0; s < this.selectors.length; s++) {
                                    var sel = this.selectors[s];

                                    // Concatinate Each Selector Property to main Selector
                                    if (sel.selector == property[0]) {
                                        for (var p in sel.properties) {
                                            var blockProps = sel.properties[p];
                                            compiled += `\t${blockProps.name}: ${blockProps.value};\n`;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (!isBlock) { compiled += "}\n"; }

                    this.selectors.push({
                        selector: selName,
                        properties: properties,
                        isBlock: isBlock
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

    /**
     * A Middleware Function that automatically Compiles all StyleScript Files Requested
     * (Requires the 'body-parser' Package)
     */
    public static autoCompile(req:any, res:any, next:(() => void), root:string, variables:object):void {
        const filePath = req.url;
        
        // Check File Extension
        const extension = filePath.substr(-4);
        
        if (extension == fileExtension) {
            res.setHeader("content-type", "text/css");
            res.send(StyleScript.compile(path.join(root, filePath), variables));
        }

        // Call Next Middleware Function
        next();
    }
}

// Export Modules for Node require();
exports.StyleScript = StyleScript;