import BaseField from './BaseField';

class NormalField extends BaseField {
  render() {
    const field = this.getField();
    const { context, fullname } = this.props;
    const { label, itemProps, ...widgetProps } = field;
    const Widget = this.getWidget();

    return this.getFieldItem(
      <Widget {...widgetProps} fullname={fullname} context={context} />,
    );
  }
}

export default NormalField;
