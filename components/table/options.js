let options = {
  apiPrefix: '',
  defaultPagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: total => `共 ${total} 条`,
    current: 1,
    pageSize: 10,
    total: 0,
  },

  pageKey: {
    limit: 'limit',
    offset: 'offset',
    order: 'order',
    orderBy: 'orderBy',
  },
  pageType: 'offset', // currentPage表示当前页，offset表示忽略记录条数

  globalDataPreProcess: data => {
    if (data.request && data.data) {
      return data.data;
    } else {
      return data;
    }
  },

  globalBeforeQuery: c => c,
  globalBeforeSave: c => c,
  globalBeforeDelete: c => c,
};

export default options;

let done = false;
export function config(conf) {
  if (done) {
    return;
  }
  for (let [key, value] of Object.entries(conf)) {
    options[key] = value;
  }
  done = true;
}
