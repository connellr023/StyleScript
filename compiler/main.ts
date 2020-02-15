/**
 * Style Script Main Compiler File
 * @author Connell Reffo (Crisp32)
 */

import { Function } from "./objects";
import * as fs from "fs";
import * as path from "path";

export class StyleScript {
    private functions:Array<Function> = [
        new Function("import", ["Files to Import (*.ss)"]),
        new Function("var", ["Variable Name", "Value"])
    ];

    public static compile(filePath:string):string {
        var file:string = path.resolve(filePath);

        // Remove Whitespace from File Content
        var toCompile:string = fs.readFileSync(file).toString();
        toCompile = toCompile.replace(/[\n\r\t]/g, "").replace(/\s+/g, "");

        // Parse Each Line into its own Array Index
        var lines:Array<string> = toCompile.split(/[;]/g);

        console.log(lines)

        return toCompile;
    }
}

//console.log(StyleScript.compile("./ss_files/file1.ss"));