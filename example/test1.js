const a = require('../dist')
let pp = a.suan24(4, 6,0,0,0,0)
while(true) {
    const nn = pp.next()
    if (!nn.done) {
        let str = a.expressionToString(nn.value, false)
        console.log(str) 
    } else {
        break
    }
}