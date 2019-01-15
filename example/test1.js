const a = require('../dist')
let pp = a.suan24(4,6,7,9,89)
let vv = pp.next().value
let str = a.expressionToString(vv)
console.log(str) // will print ((4 + 6) + ((9 + 89) / 7))