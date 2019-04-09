import React from 'react';

const defaultMessages = {
  email: '请输入邮箱',
  equals: '两次输入不一致',
  float: '请输入小数',
  idcard: '请填入有效身份证号码',
  int: '请输入整数',
  length: '{title}长度需为{0}',
  max: '{title}不能大于{0}',
  maxlength: '{title}长度不能大于{0}',
  min: '{title}不能小于{0}',
  minlength: '{title}长度不能小于{0}',
  mobile: '请输入有效手机号',
  number: '请输入数字',
  required: '请填写{title}',
  zipcode: '请输入六位数邮政编码',
  default: '请正确填写{title}',
};

const FormContext = React.createContext();
const MessageContext = React.createContext(defaultMessages);

function MessageProvider({ value, children }) {
  return (
    <MessageContext.Provider value={{ ...defaultMessages, ...value }}>
      {children}
    </MessageContext.Provider>
  );
}
function messages(value) {
  Object.assign(defaultMessages, value);
}

export default FormContext;

export { MessageContext, MessageProvider, messages };
