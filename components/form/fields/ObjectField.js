import BaseField from './BaseField';
import Field from './index';

class ObjectField extends BaseField {
  renderField() {
    const { fullname } = this.props;
    const { fields } = this.getField();

    const items = [];
    for (let field of fields) {
      const fieldName = `${fullname}.${field.name}`.replace(/^\./, '');
      items.push(<Field fullname={fieldName} key={fieldName} />);
    }
    return items;
  }

  render() {
    return this.renderField();
  }
}

export default ObjectField;
