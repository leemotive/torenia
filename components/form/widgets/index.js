import Input, { TextArea } from './Input';
import Select from './Select';
import Checkbox from './Checkbox';
import Radio from './Radio';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import Cascader, { Address } from './Cascader';
import Transfer from './Transfer';
import Slider from './Slider';
import Switch from './Switch';
import Password from './Password';
import SmsCode from './SmsCode';
import Captcha from './Captcha';
import Rate from './Rate';
import AutoComplete from './AutoComplete';

const Widgets = {
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  DatePicker,
  TimePicker,
  Cascader,
  Address,
  Transfer,
  Slider,
  Switch,
  Password,
  SmsCode,
  Captcha,
  Rate,
  AutoComplete,
};

export default Widgets;

export const resolveWidget = widgetName => {
  const names = widgetName.split('.');
  return names.reduce((last, name) => last[name], Widgets);
};

export const registerFormWidget = function(name, widget) {
  if (Widgets[name]) {
    return;
  }
  Widgets[name] = widget;
};
