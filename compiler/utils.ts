/**
 * StyleScript Utility Function File
 * @author Connell Reffo (Crisp32)
 */

import { StyleScript } from "./stylescript";
import { Property } from "./objects";

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