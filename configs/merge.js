const getType = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
const isArray = value => getType(value) === 'array';
const isObject = value => getType(value) === 'object';
const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj ?? {}, prop);

const mergeArr = (base, extend, key = 'id') => {
  if (!isArray(base)) {
    return extend;
  }
  if (!isArray(extend)) {
    return base;
  }
  const sameItems = {};
  [...base, ...extend].map(item => {
    const idKey = isObject(item) ? item[key] ?? JSON.stringify(item) : item;
    if (sameItems[idKey] === undefined) {
      sameItems[idKey] = item;
    } else {
      const oldItem = sameItems[idKey];
      if (isObject(oldItem) && isObject(item)) {
        sameItems[idKey] = mergeObj(oldItem, item, key);
      } else if (isArray(oldItem) && isArray(item)) {
        sameItems[idKey] = mergeArr(oldItem, item, key);
      } else {
        sameItems[idKey] = item;
      }
    }
  });
  return Object.keys(sameItems).map(v => sameItems[v]);
};

const mergeObj = (base, extend, key = 'id') => {
  if (!isObject(base)) {
    return extend;
  }
  if (!isObject(extend)) {
    return base;
  }
  for (let k in extend) {
    if (hasProp(extend, k)) {
      if (isObject(base[k]) && isObject(extend[k])) {
        base[k] = mergeObj(base[k], extend[k], key);
      } else if (isArray(base[k]) && isArray(extend[k])) {
        base[k] = mergeArr(base[k], extend[k], key);
      } else {
        base[k] = extend[k];
      }
    } else {
      Object.setPrototypeOf(base, {[k]: extend[k]});
    }
  }
  return base;
};

const merge = (target, ...extend) => {
  const handleMerge = isArray(target) ? mergeArr : mergeObj;
  extend.map(item => (target = handleMerge(target, item)));
  return target;
};

export default merge;
