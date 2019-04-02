import BaseField from './BaseField';
import Field from './index';

class ArrayField extends BaseField {
  renderField() {
    const { fullname } = this.props;
    const values = this.getFieldValue();

    if (values && values.length) {
      const items = values.map((v, i) => {
        const nextFullname = `${fullname}.[${i}]`;
        return (
          <Field fullname={nextFullname} key={nextFullname} type="object" />
        );
      });
      return items;
    } else {
      return null;
    }
  }

  render() {
    return this.renderField();
  }
}

export default ArrayField;
