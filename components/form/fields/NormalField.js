import BaseField from './BaseField';
import { Form } from 'antd';

const { Item: FormItem } = Form;

class NormalField extends BaseField {
  render() {
    const field = this.getField();
    const { context, fullname } = this.props;
    const { itemProps, ...widgetProps } = field;
    const Widget = this.getWidget();

    return (
      <FormItem {...itemProps}>
        <Widget {...widgetProps} fullname={fullname} context={context} />
      </FormItem>
    );
  }
}

export default NormalField;
