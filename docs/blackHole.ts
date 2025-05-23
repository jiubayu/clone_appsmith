function createBlackHole(): any {
  return new Proxy(
    function () {
      return createBlackHole();
    },
    {
      get(_, p) {
        if (p === 'toString') {
          return function () {
            return '';
          };
        }

        // 定义对象转换为原始值的行为
        if (p === Symbol.toPrimitive) {
          // 对象转换为原始值 为 空字符串 ''
          return function () {
            return '';
          };
        }

        return createBlackHole();
      },
    }
  );
}

const obj = createBlackHole();
obj.a = 1;
console.log(obj.a);
console.log(obj + 1)
