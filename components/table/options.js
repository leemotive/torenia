

let options = {
  apiPrefix: '',
  defaultPagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    current: 1,
    pageSize: 10,
    total: 0,
  },

  globalDataPreProcess: data => {
    if (data.request && data.data) {
      return data.data;
    } else {
      return data;
    }
  }
};


export default options;

let done = false;
export function config(conf) {
  if (done) {
    return;
  }
  for(let [key, value] of Object.entries(conf)) {
    options[key] = value;
  }
  done = true;
}
