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
  getValue(name, title) {
    const names = name.split('.');
    const data = names.reduce((last, key) => {
      return key ? last[key] : last;
    }, this.dics);

    if (title == undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return (data.find(item => item.title === title) || {}).value
    } else if (typeof data[title] !== 'object') {
      return data[title];
    } else {
      return data[title].value;
    }
  }
  getTitle(name, value) {
    const names = name.split('.');
    const data = names.reduce((last, key) => {
      return key ? last[key] : last;
    }, this.dics);

    if (Array.isArray(data)) {
      return (data.find(item => item.value === value) || {}).title;
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
  getOption(name, reverse) {
    const names = name.split('.');
    const data = names.reduce((last, key) => {
      return key ? last[key] : last;
    }, this.dics);

    let options;
    if (Array.isArray(data)) {
      options = data.map(item => ({ label: item.title, value: item.value }));
    } else {
      options = Object.entries(data).map(item => ({ label: item[0], value:item[1] }));
    }
    if (reverse) {
      options = options.map(item => ({ label: item.value, value: item.label }));
    }
    return options;
  }
}

export default new Dictionary();
