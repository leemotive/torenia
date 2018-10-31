import dictionary from './dictionary';
import Moment from 'moment';
import { Tag } from 'antd';
import DecimalFormat from 'decimal-format';
import React from 'react';

const render = {
  dic(type) {
    return function(text, record) {
      return dictionary.getLabel(type, text);
    }
  },
  tag(type) {
    return function(text, record) {
      const dic = dictionary.getValue(type);
      let tag;
      if (Array.isArray(dic)) {
        tag = dic.find(item => item.value === text)
      } else {
        for (let [label, item] of Object.entries(dic)) {
          if (item.value === text) {
            tag = { ...item, label };
            break;
          }
        }
      }
      return <Tag color={tag.color}>{tag.label}</Tag>
    }
  },
  moment(format = 'YYYY-MM-DD HH:mm:ss') {
    return function(text, record) {
      return Moment(text).format(format);
    }
  },
  date() {
    return render.moment('YYYY-MM-DD');
  },
  dateTime() {
    return render.moment();
  },
  time() {
    return render.moment('HH:mm:ss')
  },
  pipe(renders) {
    const tasks = renders.split('|').map(task => {
      const [name, ...param] = task.split(':');
      return render[name](...param);
    });
    return function(text, record) {
      return tasks.reduce((last, name) => {
        return name(last, record);
      }, text);
    }
  },
  number(format) {
    const df = new DecimalFormat(format);
    return function(text, record) {
      return df.format(text);
    }
  }
};


export default render;
