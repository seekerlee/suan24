import {expressionToString, suan24} from "../index"
const pp = suan24(4, 6, 7, 9, 89)
const vv = pp.next().value
const str = expressionToString(vv)
// tslint:disable-next-line: no-console
console.log(str) // will print ((4 + 6) + ((9 + 89) / 7))
