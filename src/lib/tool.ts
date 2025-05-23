// 节流
export const throttle = (func: <T>(...args:T[]) => unknown, limit: number = 16) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function<T> (...args: T[]) {
    if (!lastRan) {
      func.apply(window, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(window, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}