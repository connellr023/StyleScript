/**
 * StyleScript Utility Function File
 * @author Connell Reffo (Crisp32)
 */

import { StyleScript, fileExtension } from "./stylescript";
import { Property } from "./objects";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Defines a StyleScript Variable
 * @param args[0] Variable Name
 * @param args[1] Variable Value
 */
export const defineVar = (args:Array<string>):void => {
    var varExists:boolean = false;

    for (var v in StyleScript.variables) {
        const variable = StyleScript.variables[v];

        // Redefine Variable if it Exists
        if (variable.name == args[0]) {
            StyleScript.variables[v] = new Property(args[0], args[1]);
            varExists = true;
            break;
        }
    }

    if (!varExists) {
        StyleScript.variables.push(new Property(args[0], args[1]));
    }
}

/**
 * Condenses StyleScript for Compilation
 * @param code the StyleScript code to be condensed
 */
export const formatStyles = (code:string):string => {
    return code
        .replace(/[\n\r\t]/g, "")
        .replace(/\s+/g, "")
        .replace(/\/\*(.*?)\*\//g, "");
}

/**
 * Includes a StyleScript File into main Compilation String
 * @param files is a list of StyleScript files to Include (Don't put File Extension)
 */
export const includeFiles = (files:Array<string>):void => {
    for (var file in files) {
        file = resolve(files[file] + `.${fileExtension}`);

        // Check if Already Included
        if (!StyleScript.included.includes(file)) {
            var newLines = formatStyles(readFileSync(file).toString()).split(";");
            StyleScript.lines = StyleScript.lines.concat(newLines);

            StyleScript.included.push(file);
        }
    }
}