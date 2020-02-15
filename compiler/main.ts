/**
 * Style Script Main Compiler File
 * @author Connell Reffo (Crisp32)
 */

import { Function } from "./objects";
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

        // Iterate through Each Line
        for (var l = 0; l < lines.length; l++) {
            const line:string = lines[l];
            var isFunc:boolean = false;

            // Check for Functions
            for (var f in this.functions) {
                const func:Function = this.functions[f];

                if (line.includes(keywordPrefix + func.name)) {
                    const params:Array<string> = func.parseParams(line);
                    isFunc = true;
                }
            }

            // Get Selector and its Properties
            if (!isFunc) {
                if (line.includes("{")) {
                    var selector:string = "";

                    for (var lineIndex in lines.slice(l)) {
                        const currentLine = lines[lineIndex];

                        if (currentLine.includes("}")) {
                            const endBracket:number = currentLine.indexOf("}");
                            selector += currentLine.substr(0, endBracket + 1);

                            break;
                        }

                        l++;
                        selector += currentLine;
                    }

                    console.log(selector);
                }
            }
        }
        return compiled;
    }
}

StyleScript.compile("./ss_files/file1.ss");