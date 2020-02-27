coverage-percentage
===================
[![Build Status](https://drone.io/github.com/ashaffer/coverage-percentage/status.png)](https://drone.io/github.com/ashaffer/coverage-percentage/latest)
[![Coverage Status](https://drone.io/github.com/ashaffer/coverage-percentage/files/badge.png)](https://drone.io/github.com/ashaffer/coverage-percentage/files/coverage/lcov-report/index.html)

Tiny utility for turning a coverage report in various formats into a numerical percentage.  Built for use with [https://www.github.com/ppvg/node-coverage-badge](coverage-badge).

## Example

```json
"scripts": {
  "test": "istanbul test _mocha --report lcov -- -R spec",
  "badge": "coverage-badge `coverage-percentage ./coverage/lcov.info --lcov` badge.png"
}
```

Then simply:

```
npm test --coverage
npm run-script badge
```
