/**
 * StyleScript Object File
 * @author Connell Reffo (Crisp32)
 */

export class Function {
    public name:string;
    public callback:((args:Array<string>) => void);

    /**
     * Function Class Constructor
     * @param funcName is the Name of the StyleScript Function
     * @param priority is a Function to be checked for and Executed as First Priority
     */
    constructor(funcName:string, callback:((args:Array<string>) => void)) {
        this.name = funcName;
        this.callback = callback;
    }

    public parseArgs(line:string):Array<string> {
        const openBracket:number = line.indexOf("(");
        const closeBracket:number = line.indexOf(")");
        
        const parameters:Array<string> = line.substr(openBracket, closeBracket).split(",");

        for (var param in parameters) {
            parameters[param] = parameters[param].replace(/[()]/g, "");
        }

        return parameters;
    }
}

export class Property {
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
    properties:Array<Property>,
    isBlock:boolean
}