/**
 * 绑定code的执行环境this，使用new Function来处理
 * @param code
 * @returns
 */
function runUserCode(code: string) {
  // with 将给定的表达式添加到在评估语句时使用的作用域链上。表达式周围的括号是必需的。
  const finalCode = `with(this){
    return (function(){
    'use strict';
      return (${code})
    }).call(this)
  }`;
  return new Function(finalCode);
}

const blacklistSet = new Set([
  'top',
  'window',
  'self',
  'globalThis',
  'frames',
  'parent',
  'fetch',
  'XMLHttpRequest',
  'document',
  'MutationObserver',
]);

const globalVarNames = new Set<PropertyKey>([
  'window',
  'globalThis',
  'self',
  'global',
]);

function isDomElement(obj: any): boolean {
  return obj instanceof Element || obj instanceof HTMLCollection;
}

function getPropertyFromNativeWindow(prop: PropertyKey): any {
  const ret = Reflect.get(window, prop);
  // 绑定window
  if (typeof ret === 'function' && !ret.prototype) {
    return ret.bind(window);
  }
  // 限制访问DOM属性
  if (isDomElement(ret)) {
    return undefined;
  }

  return ret;
}

/**
 * 创建黑洞沙盒，限制访问全局变量
 */
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

function createMockWindow(base?: object) {
  const win: any = new Proxy(Object.assign({}, base), {
    has() {
      return true;
    },
    set(target, prop, value) {
      Reflect.set(target, prop, value);
      return true;
    },
    get(target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }

      if (globalVarNames.has(prop)) {
        return win;
      }

      if (typeof prop === 'string' && blacklistSet.has(prop)) {
        return createBlackHole();
      }

      return getPropertyFromNativeWindow(prop);
    },
  });

  return win;
}

function proxySandbox(context: any) {
  const isProtectedVar = (key: PropertyKey) => {
    return key in context || globalVarNames.has(key);
  };

  const mockWindow = createMockWindow(undefined);

  return new Proxy(mockWindow, {
    has() {
      return true;
    },
    get(target, p, receiver) {
      // 定义对象在with语句中哪些变量不可用
      if (p === Symbol.unscopables) {
        return undefined;
      }

      if (p === 'toJSON') {
        return target;
      }

      if (globalVarNames.has(p)) {
        return target;
      }

      if (p in context) {
        const value = Reflect.get(context, p, receiver);
        // 对象不可变
        if (typeof value === 'object' && value !== null) {
          Object.freeze(value);
          Object.values(value).forEach(Object.freeze);
        }

        return value;
      }
    },
    set(target, p, value, receiver) {
      if (isProtectedVar(p)) {
        throw new Error(p.toString() + 'is protected');
      }

      return Reflect.set(context, p, value, receiver);
    },
    defineProperty(target, p, attributes) {
      if (isProtectedVar(p)) {
        throw new Error(p.toString() + 'is protected');
      }

      return Reflect.defineProperty(context, p, attributes);
    },
    setPrototypeOf() {
      throw new Error('setPrototypeOf is not allowed');
    }
  });
}

export function evalScript(script: string, dataTree: Record<string, any>) {
  const userCode = runUserCode(script);
  const sandbox = proxySandbox(dataTree);
  const result = userCode.call(sandbox);

  return result;
}
