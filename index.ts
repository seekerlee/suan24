enum Operator {
    ADD,
    SUB,
    MUL,
    DIV,
}

enum PositionInOperator {
    LEFT, RIGHT,
}

function OperatorCompare(op1: Operator, op2: Operator): number {
    function orderOfOp(op: Operator): number {
        if (op === Operator.ADD || op === Operator.SUB) {
            return 0
        }
        // else if (op === Operator.MUL || op === Operator.DIV)
        return 1
    }
    return orderOfOp(op1) - orderOfOp(op2)
}

Number.isInteger = Number.isInteger || ((value: any) => {
    return typeof value === "number" &&
      isFinite(value) &&
      Math.floor(value) === value
})

class FractionalNum {
    public static readonly ZERO = new FractionalNum(0)
    constructor(readonly num: number, readonly den: number = 1) {
        if (!Number.isInteger(num) || !Number.isInteger(den)) {
            throw new Error("must be interger")
        }
    }
    public add(that: FractionalNum): FractionalNum {
        return new FractionalNum(this.num * that.den + this.den * that.num, this.den * that.den)
    }
    public sub(that: FractionalNum): FractionalNum {
        return new FractionalNum(this.num * that.den - this.den * that.num, this.den * that.den)
    }
    public mul(that: FractionalNum): FractionalNum {
        return new FractionalNum(this.num * that.num, this.den * that.den)
    }
    public div(that: FractionalNum): FractionalNum {
        return new FractionalNum(this.num * that.den, this.den * that.num)
    }
    public equals(that: FractionalNum): boolean {
        if (this.den === 0 && that.den === 0) {
            return this.num === that.num
        } else {
            return this.num * that.den === this.den * that.num
        }
    }
    public identicalTo(that: FractionalNum): boolean {
        return this.num === that.num && this.den === that.den
    }
    public toString(): string {
        if (this.den === 1) {
            return String(this.num)
        } else {
            return `${this.num}/${this.den}`
        }
    }
}

type Expression = ValueExpression | OperationExpression
class ValueExpression {
    constructor(readonly value: FractionalNum) {}
}

class OperationExpression {
    private value?: FractionalNum
    constructor(readonly operator: Operator, readonly lValue: Expression, readonly rValue: Expression) {}
}

function isExpressionIdentical(exp1: Expression, exp2: Expression): boolean {
    if (exp1 instanceof ValueExpression && exp2 instanceof ValueExpression) {
        return exp1.value.identicalTo(exp2.value)
    } else if (exp1 instanceof OperationExpression && exp2 instanceof OperationExpression) {
        return exp1.operator === exp2.operator &&
            isExpressionIdentical(exp1.lValue, exp2.lValue) &&
            isExpressionIdentical(exp1.rValue, exp2.rValue)
    } else {
        return false
    }
}

function evaluate(expression: Expression): FractionalNum | undefined {
    if (expression instanceof ValueExpression) { // denominator can't be 0 here
        return expression.value
    } else if (expression instanceof OperationExpression) {
        const lValueEval = evaluate(expression.lValue)
        if (lValueEval === undefined) {
            return // undefined
        }
        const rValueEval = evaluate(expression.rValue)
        if (rValueEval === undefined) {
            return // undefined
        }
        switch (expression.operator) {
            case Operator.ADD: {
                return lValueEval.add(rValueEval)
            }
            case Operator.SUB: {
                return lValueEval.sub(rValueEval)
            }
            case Operator.MUL: {
                return lValueEval.mul(rValueEval)
            }
            case Operator.DIV: {
                if (rValueEval.equals(FractionalNum.ZERO)) {
                    return // undefined
                } else {
                    return lValueEval.div(rValueEval)
                }
            }
        }
    }
    throw new Error("input is not an Expression") // satisfy type checker
}

export const expressionToString = (expression: Expression, keepParentheses: boolean = false) => exp2Str(expression, keepParentheses)
function exp2Str(expression: Expression, keepParentheses: boolean = false, parentOperator?: Operator, position?: PositionInOperator): string {
    if (expression instanceof ValueExpression) {
        return expression.value.toString()
    } else if (expression instanceof OperationExpression) {
        let needParen = true
        if (!keepParentheses) {
            if (parentOperator === undefined) {
                needParen = false
            } else {
                const opCompare = OperatorCompare(expression.operator, parentOperator)
                if (opCompare > 0) {
                    needParen = false
                } else if (opCompare === 0) {
                    if (parentOperator === Operator.ADD || parentOperator === Operator.MUL) {
                        needParen = false
                    } else if (parentOperator === Operator.SUB) {
                        if (position === PositionInOperator.LEFT) {
                            needParen = false
                        }
                    } else if (parentOperator === Operator.DIV) {
                        if (position === PositionInOperator.LEFT) {
                            needParen = false
                        }
                    }
                }
            }
        }
        // make string
        let thisString: string
        switch (expression.operator) {
            case Operator.ADD: {
                thisString = `${exp2Str(expression.lValue, keepParentheses, Operator.ADD, PositionInOperator.LEFT)} + ${exp2Str(expression.rValue, keepParentheses, Operator.ADD, PositionInOperator.RIGHT)}`
                break
            }
            case Operator.SUB: {
                thisString = `${exp2Str(expression.lValue, keepParentheses, Operator.SUB, PositionInOperator.LEFT)} - ${exp2Str(expression.rValue, keepParentheses, Operator.SUB, PositionInOperator.RIGHT)}`
                break
            }
            case Operator.MUL: {
                thisString = `${exp2Str(expression.lValue, keepParentheses, Operator.MUL, PositionInOperator.LEFT)} × ${exp2Str(expression.rValue, keepParentheses, Operator.MUL, PositionInOperator.RIGHT)}`
                break
            }
            case Operator.DIV: {
                thisString = `${exp2Str(expression.lValue, keepParentheses, Operator.DIV, PositionInOperator.LEFT)} ÷ ${exp2Str(expression.rValue, keepParentheses, Operator.DIV, PositionInOperator.RIGHT)}`
                break
            } default: {
                throw new Error("unknow operator")
            }
        }
        if (needParen) {
            return `(${thisString})`
        } else {
            return thisString
        }
    }
    throw new Error("not an expression") // satisfy type checker
}

function* joinExpressions(expressions: Expression[]): IterableIterator<Expression> {
    if (expressions.length === 0) {
        throw new Error("no input error")
    }
    if (expressions.length === 1) {
        yield expressions[0]
    }
    const selectedPairs: Array<[Expression, Expression]> = []
    function isPairProcessed(pair: [Expression, Expression]): boolean {
        function isPairIdentical(p1: [Expression, Expression], p2: [Expression, Expression]) {
            return isExpressionIdentical(p1[0], p2[0]) && isExpressionIdentical(p1[1], p2[1]) ||
                isExpressionIdentical(p1[0], p2[1]) && isExpressionIdentical(p1[1], p2[0])
        }
        return selectedPairs.some(pairExisting => isPairIdentical(pairExisting, pair))
    }
    for (let i = 0; i < expressions.length; i ++) {
        for (let j = i + 1; j < expressions.length; j ++) {
            const leftExp = expressions[i]
            const rightExp = expressions[j]
            if (isPairProcessed([leftExp, rightExp])) {
                continue
            } else {
                selectedPairs.push([leftExp, rightExp])
            }
            const restExp = expressions.filter((v, index) => index !== i && index !== j )
            const added = new OperationExpression(Operator.ADD, leftExp, rightExp)
            yield* joinExpressions([added as Expression].concat(restExp))
            const subed = new OperationExpression(Operator.SUB, leftExp, rightExp)
            yield* joinExpressions([subed as Expression].concat(restExp))
            const muled = new OperationExpression(Operator.MUL, leftExp, rightExp)
            yield* joinExpressions([muled as Expression].concat(restExp))
            const dived = new OperationExpression(Operator.DIV, leftExp, rightExp)
            yield* joinExpressions([dived as Expression].concat(restExp))
            if (!isExpressionIdentical(leftExp, rightExp)) {
                // consider a - b identical to b - a and a / b identical to b / a when a == b
                const subed2 = new OperationExpression(Operator.SUB, rightExp, leftExp)
                yield* joinExpressions(restExp.concat(subed2))
                const dived2 = new OperationExpression(Operator.DIV, rightExp, leftExp)
                yield* joinExpressions(restExp.concat(dived2))
            }
        }
    }
}

export function* suan(target: number, ...nums: number[]) {
    const exps = nums.map((num) => new ValueExpression(new FractionalNum(num)))
    const expressionIter = joinExpressions(exps)
    while (true) {
        const it = expressionIter.next()
        if (it.done) {
            break
        } else {
            const expression = it.value
            const expressionVal = evaluate(expression)
            if (expressionVal && expressionVal.equals(new FractionalNum(target))) {
                yield expression
            }
        }
    }
}

export const suan24 = (...nums: number[]) => suan(24, ...nums)
