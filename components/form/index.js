import Form from './Form';
import BaseWidget from './widgets/BaseWidget';
import { registerFormWidget } from './widgets';
import { MessageProvider, messages } from './context';

Form.BaseWidget = BaseWidget;
Form.registerFormWidget = registerFormWidget;
Form.MessageProvider = MessageProvider;
Form.messages = messages;

export default Form;
