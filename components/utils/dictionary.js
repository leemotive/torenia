class Dictionary {
  constructor() {
    this.dics = {};
  }

  put(name, value) {
    const names = name.split('.');
    names.reduce((last, key, index, arr) => {
      last[key] = last[key] || {};
      if (index === arr.length - 1) {
        last[key] = value;
      }
      return last[key];
    }, this.dics);
  }
  getValue(name, label) {
    const names = name.split('.');
    const data = names.reduce((last, key) => {
      return key ? last[key] : last;
    }, this.dics);

    if (label == undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return (data.find(item => item.label === label) || {}).value;
    } else if (typeof data[label] !== 'object') {
      return data[label];
    } else {
      return data[label].value;
    }
  }
  getLabel(name, value) {
    const names = name.split('.');
    const data = names.reduce((last, key) => {
      return key ? last[key] : last;
    }, this.dics);

    if (Array.isArray(data)) {
      return (data.find(item => item.value === value) || {}).label;
    } else {
      return (Object.entries(data).find(item => {
        if (typeof item[1] !== 'object') {
          return item[1] === value;
        } else {
          return item[1].value === value;
        }
      }) || [])[0];
    }
  }
  getOptions(name, reverse, filter = {}, extra = {}) {
    const names = name.split('.');
    const data = names.reduce((last, key) => {
      return key ? last[key] : last;
    }, this.dics);

    let options;
    if (Array.isArray(data)) {
      options = data.map(item => ({ label: item.label, value: item.value }));
    } else {
      options = Object.entries(data).map(item => ({
        label: item[0],
        value: item[1],
      }));
    }
    if (Array.isArray(extra.prepend)) {
      options.unshift(...extra.prepend);
    }
    if (Array.isArray(extra.append)) {
      options.push(...extra.append);
    }

    if (Array.isArray(filter.label) || Array.isArray(filter.value)) {
      const { label = [], value = [] } = filter;
      options = options.filter(
        item => !label.includes(item.label) && !value.includes(item.value),
      );
    }

    if (reverse) {
      options = options.map(item => ({ label: item.value, value: item.label }));
    }
    return options;
  }
}

export default new Dictionary();
