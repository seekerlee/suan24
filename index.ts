enum Operator {
    ADD,
    SUB,
    MUL,
    DIV,
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

export function expressionToString(expression: Expression): string {
    if (expression instanceof ValueExpression) {
        return expression.value.toString()
    } else if (expression instanceof OperationExpression) {
        switch (expression.operator) {
            case Operator.ADD: {
                return `(${expressionToString(expression.lValue)} + ${expressionToString(expression.rValue)})`
            }
            case Operator.SUB: {
                return `(${expressionToString(expression.lValue)} - ${expressionToString(expression.rValue)})`
            }
            case Operator.MUL: {
                return `(${expressionToString(expression.lValue)} * ${expressionToString(expression.rValue)})`
            }
            case Operator.DIV: {
                return `(${expressionToString(expression.lValue)} / ${expressionToString(expression.rValue)})`
            }
        }
    }
    throw new Error() // satisfy type checker
}

function* joinExpressions(expressions: Expression[]): IterableIterator<Expression> {
    if (expressions.length === 0) {
        throw new Error("no input error")
    }
    if (expressions.length === 1) {
        yield expressions[0]
    }
    for (let i = 0; i < expressions.length; i ++) {
        for (let j = i + 1; j < expressions.length; j ++) {
            const restExp = expressions.filter((v, index) => index !== i && index !== j )
            const added = new OperationExpression(Operator.ADD, expressions[i], expressions[j])
            yield* joinExpressions(restExp.concat(added))
            const subed = new OperationExpression(Operator.SUB, expressions[i], expressions[j])
            yield* joinExpressions(restExp.concat(subed))
            const muled = new OperationExpression(Operator.MUL, expressions[i], expressions[j])
            yield* joinExpressions(restExp.concat(muled))
            const dived = new OperationExpression(Operator.DIV, expressions[i], expressions[j])
            yield* joinExpressions(restExp.concat(dived))
            if (!isExpressionIdentical(expressions[i], expressions[j])) {
                const subed2 = new OperationExpression(Operator.SUB, expressions[j], expressions[i])
                yield* joinExpressions(restExp.concat(subed2))
                const dived2 = new OperationExpression(Operator.DIV, expressions[j], expressions[i])
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
