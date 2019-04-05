const arrayKeyReg = /^\[(\d+)\]$/;

function getPathNameData(formData, fullname) {
  const namepath = fullname.split('.').filter(n => n);
  let value = formData;
  for (let name of namepath) {
    let match = name.match(arrayKeyReg);
    if (match) {
      name = match[1];
    }
    value = value[name];
    if (value == undefined) {
      break;
    }
  }
  return clonedeep(value);
}

function setPathNameDate(formData, fullname, value) {
  let cloneFormData = clonedeep(formData);
  const namepath = fullname.split('.');

  // 根据下级名字判断当前路径下的数据是什么类型
  function dataType(name) {
    if (!name) {
      return '';
    } else if (/^\[\d+\]$/.test(name)) {
      return 'array';
    } else {
      return 'object';
    }
  }
  if (!cloneFormData) {
    if (dataType(namepath[0]) === 'array') {
      cloneFormData = [];
    } else {
      cloneFormData = {};
    }
  }

  let node = cloneFormData;
  let match, name;
  // 获取父路的值，和getPathNameDat不一样，这里需要创缺失的父级
  for (let index = 0; index < namepath.length; index++) {
    name = namepath[index];
    match = name.match(arrayKeyReg);
    let data;
    if (match) {
      name = match[1];
    }

    if (index === namepath.length - 1) {
      node[name] = value;
      break;
    }

    data = node[name];

    if (!data) {
      if (dataType(namepath[index + 1]) === 'array') {
        data = node[name] = [];
      } else {
        data = node[name] = {};
      }
    }
    node = data;
  }

  return cloneFormData;
}

function clonedeep(src) {
  let wm = new WeakMap();
  const stack = [];
  let from = src;
  let [cloned, copy] = preClone(from);
  let to = copy;
  if (!cloned) {
    stack.push(
      ...Object.getOwnPropertySymbols(from),
      ...Object.keys(from).reverse(),
      { from, to: copy },
    );

    while (stack.length) {
      const key = stack.pop();
      if (typeof key === 'object') {
        ({ from, to } = key);
        continue;
      }

      const fromValue = from[key];
      [cloned, copy] = preClone(fromValue);
      to[key] = copy;
      if (!cloned) {
        stack.push(
          { from, to },
          ...Object.getOwnPropertySymbols(fromValue),
          ...Object.keys(fromValue).reverse(),
          { from: fromValue, to: copy },
        );
      }
    }
  }

  return to;

  function preClone(v) {
    let copy = wm.get(v);
    if (copy) {
      return [true, copy];
    } else if (!v) {
      return [true, v];
    } else if (typeof v.clone === 'function') {
      return [true, v.clone()];
    } else if (Array.isArray(v)) {
      copy = [];
      wm.set(v, copy);
      return [false, copy];
    } else if (isPlainObject(v)) {
      copy = {};
      wm.set(v, copy);
      return [false, copy];
    } else if (Object.prototype.toString.call(v) === '[object Date]') {
      return [true, new Date(v)];
    } else {
      return [true, v];
    }
  }
}

function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;
  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Object.prototype.toString.call(Ctor) === '[object Function]'
  );
}

function debounce(fun, delay, { leading = true, trailing = false } = {}) {
  let timer = 0;
  return function(...args) {
    if (timer) {
      timeout(this, ...args);
      return;
    }
    if (leading) {
      fun.call(this, ...args);
      timer = setTimeout(() => {
        timer = 0;
      }, delay);
      return;
    }
    timeout(this, ...args);
  };
  function timeout(context, ...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = 0;
      trailing && fun.call(context, ...args);
    }, delay);
  }
}

export default {
  getPathNameData,
  setPathNameDate,
  clonedeep,
  isPlainObject,
  debounce,
};
