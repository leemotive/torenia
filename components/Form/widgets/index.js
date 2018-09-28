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
};

export default Widgets;

export const resolveWidget = (widgetName) => {
  const names = widgetName.split('.');
  return names.reduce((last, name) => last[name], Widgets);
}
