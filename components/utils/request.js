/* global window */
import axios from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import cloneDeep from 'lodash.clonedeep';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';

const CORS = [];

const fetch = options => {
  let { method = 'get', data, fetchType, url, ...otherConfig } = options;

  const cloneData = cloneDeep(data);

  try {
    let domin = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domin] = url.match(/[a-zA-z]+:\/\/[^/]*/);
      url = url.slice(domin.length);
    }
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domin + url;
  } catch (e) {
    message.error(e.message);
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(
        url,
        {
          param: `${qs.stringify(data)}&callback`,
          name: `jsonp_${new Date().getTime()}`,
          timeout: 4000,
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
    });
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        ...otherConfig,
      });
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
        ...otherConfig,
      });
    case 'post':
      return axios.post(url, cloneData, otherConfig);
    case 'put':
      return axios.put(url, cloneData, otherConfig);
    case 'patch':
      return axios.patch(url, cloneData, otherConfig);
    default:
      return axios(options);
  }
};

function request(options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${
      options.url.split('//')[1].split('/')[0]
    }`;
    if (window.location.origin !== origin) {
      if (CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS';
      } else {
        options.fetchType = 'JSONP';
      }
    }
  }

  return fetch(options);
}

export default request;
request.axios = axios;
request.cors = function(...args) {
  if (!CORS.length) {
    CORS.push(...args);
  } else {
    throw 'can not set cors multiple times';
  }
};
