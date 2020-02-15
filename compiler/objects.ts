/**
 * StyleScript Object File
 * @author Connell Reffo (Crisp32)
 */

import { keywordPrefix } from "./main";

export class Function {
    public name:string;

    /**
     * Function Class Constructor
     * @param funcName Name of StyleScript Function
     */
    constructor(funcName:string) {
        this.name = funcName;
    }

    public parseParams(line:string):Array<string> {
        const openBracket:number = line.indexOf("(");
        const closeBracket:number = line.indexOf(")");
        
        const parameters:Array<string> = line.substr(openBracket, closeBracket).split(",");

        for (var param in parameters) {
            parameters[param] = parameters[param].replace(/[()]/g, "");
        }

        return parameters;
    }
}

class Property {
    public name:string;
    public value:string;

    /**
     * Property Class Constructor
     * @param name Property Name
     * @param value Property Value
     */
    constructor(name:string, value:string) {
        this.name = name;
        this.value = value;
    }
}

/**
 * @interface ISelector
 * Represents a CSS Selector with a Name and Properties
 */
export interface ISelector {
    selector:string,
    properties:Array<Property>
}