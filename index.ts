namespace Language24{
    enum Operator {
        ADD,
        SUB,
        MUL,
        DIV,
    }
    
    class fNumber {
        constructor(readonly num: number, readonly den: number = 1) {
            if (!Number.isInteger(num) || !Number.isInteger(den)) {
                throw "must be interger"
            }
        }
        add(that: fNumber) :fNumber {
            return new fNumber(this.num * that.den + this.den * that.num, this.den * that.den)
        }
        sub(that: fNumber) :fNumber {
            return new fNumber(this.num * that.den - this.den * that.num, this.den * that.den)
        }
        mul(that: fNumber) :fNumber {
            return new fNumber(this.num * that.num, this.den * that.den)
        }
        div(that: fNumber) :fNumber {
            return new fNumber(this.num * that.den, this.den * that.num)
        }
        reduce(): fNumber {
            function gcd(a: number, b: number): number {
                if(b === 0) {
                    return a
                }
                return gcd(b, a % b)
            }
            if (this.den === 0) {
                return new fNumber(this.num, this.den)
            } else {
                let divsor = gcd(this.den, this.num)
                return new fNumber(this.num / divsor, this.den / divsor)
            }
        }
        equals(that: fNumber): boolean {
            if(this.den === 0 && that.den === 0) {
                return this.num === that.num
            } else if(this.den === 0 || that.den === 0) {
                return false
            } else {
                return this.num * that.den === this.den * that.num
            }
        }
        toString() :string {
            if (this.den === 1) {
                return String(this.num)
            } else {
                return `${this.num}/${this.den}`
            }
        }
    }

    interface Expression {
    }
    
    class ValueExpression implements Expression{
        constructor(readonly value: fNumber) {}
    }
    
    class OperationExpression implements Expression {
        private value?: fNumber
        constructor(readonly operator: Operator, readonly lValue: Expression, readonly rValue: Expression) {
        }
    }
    
    function eval(expression: Expression): fNumber {
        if(expression instanceof ValueExpression) {
            return expression.value
        } else if (expression instanceof OperationExpression) {
            switch(expression.operator) {
                case Operator.ADD: {
                    return eval(expression.lValue).add(eval(expression.rValue))
                }
                case Operator.SUB: {
                    return eval(expression.lValue).sub(eval(expression.rValue))
                }
                case Operator.MUL: {
                    return eval(expression.lValue).mul(eval(expression.rValue))
                }
                case Operator.DIV: {
                    return eval(expression.lValue).div(eval(expression.rValue))
                }
            }
        }
    }
    
    function toString(expression: Expression): String {
        if(expression instanceof ValueExpression) {
            return String(expression.value)
        } else if (expression instanceof OperationExpression) {
            switch(expression.operator) {
                case Operator.ADD: {
                    return `(${toString(expression.lValue)} + ${toString(expression.rValue)})`
                }
                case Operator.SUB: {
                    return `(${toString(expression.lValue)} - ${toString(expression.rValue)})`
                }
                case Operator.MUL: {
                    return `(${toString(expression.lValue)} * ${toString(expression.rValue)})`
                }
                case Operator.DIV: {
                    return `(${toString(expression.lValue)} / ${toString(expression.rValue)})`
                }
            }
        }
    }
    
    function* joinExpressions(expressions: Expression[]) {
        if (expressions.length === 0) {
            throw("no input error")
        }
        if (expressions.length === 1) {
            yield expressions[0]
        }
        for(let i = 0; i < expressions.length; i ++) {
            for(let j = i + 1; j < expressions.length; j ++) {
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

    export function suan(target: number, ...nums: number[]) {
        let exps = nums.map(num => new ValueExpression(new fNumber(num)))
        const expressionIter = joinExpressions(exps)
        let i = 0
        while(true) {
            let it = expressionIter.next()
            if(it.done) {
                break
            } else {
                i ++
                let expression = it.value
                if(eval(expression).equals(new fNumber(target))) {
                    console.log(toString(expression))
                }
            }
        }
    }

    export const suan24 = (...nums: number[]) => suan(24, ...nums)
}

Language24.suan24(11,21,31,414,15)