import BaseField from './BaseField';

class NormalField extends BaseField {
  render() {
    const field = this.getField();
    const { context, fullname } = this.props;
    const { label, itemProps, onChange, ...widgetProps } = field;
    const Widget = this.getWidget();

    return this.getFieldItem(
      <Widget
        {...widgetProps}
        onChange={this.onChange}
        fullname={fullname}
        context={context}
      />,
    );
  }
}

export default NormalField;
