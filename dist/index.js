"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operator;
(function (Operator) {
    Operator[Operator["ADD"] = 0] = "ADD";
    Operator[Operator["SUB"] = 1] = "SUB";
    Operator[Operator["MUL"] = 2] = "MUL";
    Operator[Operator["DIV"] = 3] = "DIV";
})(Operator || (Operator = {}));
class FractionalNum {
    constructor(num, den = 1) {
        this.num = num;
        this.den = den;
        if (!Number.isInteger(num) || !Number.isInteger(den)) {
            throw new Error("must be interger");
        }
    }
    add(that) {
        return new FractionalNum(this.num * that.den + this.den * that.num, this.den * that.den);
    }
    sub(that) {
        return new FractionalNum(this.num * that.den - this.den * that.num, this.den * that.den);
    }
    mul(that) {
        return new FractionalNum(this.num * that.num, this.den * that.den);
    }
    div(that) {
        return new FractionalNum(this.num * that.den, this.den * that.num);
    }
    reduce() {
        function gcd(a, b) {
            if (b === 0) {
                return a;
            }
            return gcd(b, a % b);
        }
        if (this.den === 0) {
            return new FractionalNum(this.num, this.den);
        }
        else {
            const divsor = gcd(this.den, this.num);
            return new FractionalNum(this.num / divsor, this.den / divsor);
        }
    }
    equals(that) {
        if (this.den === 0 && that.den === 0) {
            return this.num === that.num;
        }
        else if (this.den === 0 || that.den === 0) {
            return false;
        }
        else {
            return this.num * that.den === this.den * that.num;
        }
    }
    toString() {
        if (this.den === 1) {
            return String(this.num);
        }
        else {
            return `${this.num}/${this.den}`;
        }
    }
}
class ValueExpression {
    constructor(value) {
        this.value = value;
    }
}
class OperationExpression {
    constructor(operator, lValue, rValue) {
        this.operator = operator;
        this.lValue = lValue;
        this.rValue = rValue;
    }
}
function evaluate(expression) {
    if (expression instanceof ValueExpression) {
        return expression.value;
    }
    else if (expression instanceof OperationExpression) {
        switch (expression.operator) {
            case Operator.ADD: {
                return evaluate(expression.lValue).add(evaluate(expression.rValue));
            }
            case Operator.SUB: {
                return evaluate(expression.lValue).sub(evaluate(expression.rValue));
            }
            case Operator.MUL: {
                return evaluate(expression.lValue).mul(evaluate(expression.rValue));
            }
            case Operator.DIV: {
                return evaluate(expression.lValue).div(evaluate(expression.rValue));
            }
        }
    }
    throw new Error(); // satisfy type checker
}
function expressionToString(expression) {
    if (expression instanceof ValueExpression) {
        return expression.value.toString();
    }
    else if (expression instanceof OperationExpression) {
        switch (expression.operator) {
            case Operator.ADD: {
                return `(${expressionToString(expression.lValue)} + ${expressionToString(expression.rValue)})`;
            }
            case Operator.SUB: {
                return `(${expressionToString(expression.lValue)} - ${expressionToString(expression.rValue)})`;
            }
            case Operator.MUL: {
                return `(${expressionToString(expression.lValue)} * ${expressionToString(expression.rValue)})`;
            }
            case Operator.DIV: {
                return `(${expressionToString(expression.lValue)} / ${expressionToString(expression.rValue)})`;
            }
        }
    }
    throw new Error(); // satisfy type checker
}
exports.expressionToString = expressionToString;
function* joinExpressions(expressions) {
    if (expressions.length === 0) {
        throw new Error("no input error");
    }
    if (expressions.length === 1) {
        yield expressions[0];
    }
    for (let i = 0; i < expressions.length; i++) {
        for (let j = i + 1; j < expressions.length; j++) {
            const restExp = expressions.filter((v, index) => index !== i && index !== j);
            const added = new OperationExpression(Operator.ADD, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(added));
            const subed = new OperationExpression(Operator.SUB, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(subed));
            const muled = new OperationExpression(Operator.MUL, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(muled));
            const dived = new OperationExpression(Operator.DIV, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(dived));
            const subed2 = new OperationExpression(Operator.SUB, expressions[j], expressions[i]);
            yield* joinExpressions(restExp.concat(subed2));
            const dived2 = new OperationExpression(Operator.DIV, expressions[j], expressions[i]);
            yield* joinExpressions(restExp.concat(dived2));
        }
    }
}
function* suan(target, ...nums) {
    const exps = nums.map((num) => new ValueExpression(new FractionalNum(num)));
    const expressionIter = joinExpressions(exps);
    while (true) {
        const it = expressionIter.next();
        if (it.done) {
            break;
        }
        else {
            const expression = it.value;
            if (evaluate(expression).equals(new FractionalNum(target))) {
                yield expression;
            }
        }
    }
}
exports.suan = suan;
exports.suan24 = (...nums) => suan(24, ...nums);
//# sourceMappingURL=index.js.map