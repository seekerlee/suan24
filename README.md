# suan24(算24)
这是一个算 24 的程序，可以在 node 或者浏览器中使用。

默认编译为 ES2015 的 JavaScript, 如果需要 ES5 可以 clone 后自行编译，编译结果是 dist/index.js：

```bash
git clone git@github.com:seekerlee/suan24.git
cd suan24
npm install
npm run build-es5
```

## Feature

- Api & Cli 方式调用
- 可以算除了 24 之外的数字，比如算 36
- 不限制数字个数，例如 6 个数字算 24，也可以 2 个数字
- 算术式展示结果，无非必要的括号

## Cli Usage

### 安装

```bash
npm install -g suan24
suan24 -h # for help 使用说明
```
使用说明：

```
usage:
normal mode:
    suan24 <numbers...>
target mode with --target(or -t) option. You can specify other numbers instead of 24 as target.
    suan24 --target <target number> <numbers...>
    suan24 -t <target number> <numbers...>
option --parentheses(or -p) will keep all parentheses of output required or not.
Example:
    suan24 8 8 3 3
    suan24 4 6
    suan24 --target 25 5 1 5 1
you can try more numbers, for example 5 numbers:
    suan24 4 6 7 9 89
about:
    A simple program to resolve suan 24 (calculate 24) game
    this program is presented by Simon1987.com
```

### 普通算24

```bash
suan24 8 8 3 3 # will print 8 ÷ (3 - 8 ÷ 3)
suan24 10 10 4 4 # will print (10 × 10 - 4) ÷ 4
```

### 6 个数字和3个数字算24

```bash
suan24 11 17 19 22 29 31 # will print (11 + 17) × (22 - 19) - 29 - 31 and many others
suan24 3 8 1 # will print 3 × 8 × 1 and some others
```

如果更多数字算 24 耗时会显著增长

### 算 36

```bash
suan24 --target 36 8 8 3 4 # will print (8 + 8 - 4) × 3 and some others
```

## API Usage

```typescript
// typescript code:
import {expressionToString, suan24} from "suan24"
const pp = suan24(4, 6, 7, 9, 89)
const vv = pp.next().value
const str = expressionToString(vv)
console.log(str) // will print result
```

```javascript
// javascript code:
const a = require('suan24')
let pp = a.suan24(4,6,7,9,89)
let vv = pp.next().value
let str = a.expressionToString(vv)
console.log(str) // will print result
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

## 微信小程序

基于这个库的一个微信小程序，二维码：

![wechat-mini-program](https://user-images.githubusercontent.com/1234986/51798918-216f0800-2255-11e9-900f-806cedf062fa.jpg)

效果：

![preview](https://user-images.githubusercontent.com/1234986/51799028-fbe2fe00-2256-11e9-8d62-7e461969a8d9.png)

## Future work (Maybe)

- [x] 去除结果中无必要的括号
- [x] 去掉重复的结果
- [ ] 改进去重复的性能
- [ ] 增加一个网页直接操作
- [ ] 支持 BigInt 解决大数字精度问题

## License

[WTFPL](http://www.wtfpl.net)
