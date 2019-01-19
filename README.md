# suan24(算24)
这是一个算 24 的程序，可以在 node 或者浏览器中使用。

## Feature

- Api & Cli 方式调用
- 可以算除了 24 之外的数字，比如算 36
- 不限制数字个数，例如 6 个数字算 24，也可以 2 个数字

## Cli Usage

```bash
npm install -g suan24
suan24 8 8 3 3 # will print (8 / (3 - (8 / 3)))
suan24 11 12 13 14 15 16 # will print ((15 - 16) * ((13 - 14) - (11 + 12))) and many others
suan24 -target 36 8 8 3 3 7 # will print (3 * (8 - ((7 - 3) - 8))) and many others
```

## API Usage

```typescript
// typescript code:
import {expressionToString, suan24} from "suan24"
const pp = suan24(4, 6, 7, 9, 89)
const vv = pp.next().value
const str = expressionToString(vv)
console.log(str) // will print ((4 + 6) + ((9 + 89) / 7))
```

```javascript
// javascript code:
const a = require('suan24')
let pp = a.suan24(4,6,7,9,89)
let vv = pp.next().value
let str = a.expressionToString(vv)
console.log(str) // will print ((4 + 6) + ((9 + 89) / 7))
```

## API

```typescript
// 把结果转换为 string
// keepParentheses 是否保留括号。默认是 false，会去掉非必要的括号
export declare const expressionToString: (expression: Expression, keepParentheses?: boolean) => string;
// 算任意数字，第一个参数是目标数字，剩下的是参与计算的数字
export declare function suan(target: number, ...nums: number[]): IterableIterator<Expression>;
// 算24，参数是参与计算的数字
export declare const suan24: (...nums: number[]) => IterableIterator<Expression>;
```

## Future work (Maybe)

- [x] 去除结果中无必要的括号
- [ ] 去掉重复的结果
- [ ] 增加一个网页直接操作
- [ ] 支持 BigInt 解决大数字精度问题

