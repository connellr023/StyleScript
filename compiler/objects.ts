/**
 * StyleScript Object File
 * @author Connell Reffo (Crisp32)
 */

export const config:object = {
    fileExtension: "ss",
    keywordPrefix: "%"
};

export class Function {
    private funcName:string;
    private params:Array<string>;

    constructor(funcName:string, params:Array<string>) {
        this.funcName = funcName;
        this.params = params;
    }
}