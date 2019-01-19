declare enum Operator {
    ADD = 0,
    SUB = 1,
    MUL = 2,
    DIV = 3
}
declare enum PositionInOperator {
    LEFT = 0,
    RIGHT = 1
}
declare class FractionalNum {
    readonly num: number;
    readonly den: number;
    static readonly ZERO: FractionalNum;
    constructor(num: number, den?: number);
    add(that: FractionalNum): FractionalNum;
    sub(that: FractionalNum): FractionalNum;
    mul(that: FractionalNum): FractionalNum;
    div(that: FractionalNum): FractionalNum;
    equals(that: FractionalNum): boolean;
    identicalTo(that: FractionalNum): boolean;
    toString(): string;
}
declare type Expression = ValueExpression | OperationExpression;
declare class ValueExpression {
    readonly value: FractionalNum;
    constructor(value: FractionalNum);
}
declare class OperationExpression {
    readonly operator: Operator;
    readonly lValue: Expression;
    readonly rValue: Expression;
    private value?;
    constructor(operator: Operator, lValue: Expression, rValue: Expression);
}
export declare function expressionToString(expression: Expression, keepParentheses?: boolean, parentOperator?: Operator, position?: PositionInOperator): string;
export declare function suan(target: number, ...nums: number[]): IterableIterator<Expression>;
export declare const suan24: (...nums: number[]) => IterableIterator<Expression>;
export {};
