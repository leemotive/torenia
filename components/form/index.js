import Form from './Form';
import BaseWidget from './widgets/BaseWidget';
import { registerFormWidget } from './widgets';

Form.BaseWidget = BaseWidget;
Form.registerFormWidget = registerFormWidget;

export default Form;
