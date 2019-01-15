enum Operator {
    ADD,
    SUB,
    MUL,
    DIV,
}

class FractionalNum {
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
    public reduce(): FractionalNum {
        function gcd(a: number, b: number): number {
            if (b === 0) {
                return a
            }
            return gcd(b, a % b)
        }
        if (this.den === 0) {
            return new FractionalNum(this.num, this.den)
        } else {
            const divsor = gcd(this.den, this.num)
            return new FractionalNum(this.num / divsor, this.den / divsor)
        }
    }
    public equals(that: FractionalNum): boolean {
        if (this.den === 0 && that.den === 0) {
            return this.num === that.num
        } else if (this.den === 0 || that.den === 0) {
            return false
        } else {
            return this.num * that.den === this.den * that.num
        }
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

function evaluate(expression: Expression): FractionalNum {
    if (expression instanceof ValueExpression) {
        return expression.value
    } else if (expression instanceof OperationExpression) {
        switch (expression.operator) {
            case Operator.ADD: {
                return evaluate(expression.lValue).add(evaluate(expression.rValue))
            }
            case Operator.SUB: {
                return evaluate(expression.lValue).sub(evaluate(expression.rValue))
            }
            case Operator.MUL: {
                return evaluate(expression.lValue).mul(evaluate(expression.rValue))
            }
            case Operator.DIV: {
                return evaluate(expression.lValue).div(evaluate(expression.rValue))
            }
        }
    }
    throw new Error() // satisfy type checker
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
            const subed2 = new OperationExpression(Operator.SUB, expressions[j], expressions[i])
            yield* joinExpressions(restExp.concat(subed2))
            const dived2 = new OperationExpression(Operator.DIV, expressions[j], expressions[i])
            yield* joinExpressions(restExp.concat(dived2))
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
            if (evaluate(expression).equals(new FractionalNum(target))) {
                yield expression
            }
        }
    }
}

export const suan24 = (...nums: number[]) => suan(24, ...nums)