import { Row, Col, Button } from 'antd';
import BaseField from './BaseField';
import Field from './index';
import utils from '../../utils/utils';

class ArrayField extends BaseField {
  onChange(value) {
    const { fullname, name, context } = this.props;
    const { formData } = context;
    const newFormData = utils.setPathNameData(formData, fullname, value);

    context.onChange({ fullname, name, formData, newFormData });
  }

  onAddItem(i) {
    const values = this.getFieldValue() || [];
    values.splice(i + 1, 0, {});
    this.onChange(values);
  }
  onRemoveItem(i) {
    const values = this.getFieldValue();
    values.splice(i, 1);
    this.onChange(values);
  }

  onUpItem(i) {
    const values = this.getFieldValue() || [];
    const [item] = values.splice(i, 1);
    values.splice(i - 1, 0, item);
    this.onChange(values);
  }

  onDownItem(i) {
    const values = this.getFieldValue() || [];
    const [item] = values.splice(i, 1);
    values.splice(i + 1, 0, item);
    this.onChange(values);
  }

  getAddBtn(i) {
    return (
      <Button
        onClick={() => this.onAddItem(i)}
        className="arrayFieldOpBtn"
        icon="plus"
      />
    );
  }
  getRemoveBtn(i) {
    return (
      <Button
        onClick={() => this.onRemoveItem(i)}
        className="arrayFieldOpBtn"
        icon="minus"
      />
    );
  }
  getUpBtn(i) {
    return (
      <Button
        onClick={() => this.onUpItem(i)}
        className="arrayFieldOpBtn"
        icon="up"
        disabled={i === 0}
      />
    );
  }
  getDownBtn(i, length) {
    return (
      <Button
        onClick={() => this.onDownItem(i)}
        className="arrayFieldOpBtn"
        icon="down"
        disabled={i === length - 1}
      />
    );
  }

  renderField() {
    const { fullname } = this.props;
    const values = this.getFieldValue();

    if (values && values.length) {
      const items = values.map((v, i) => {
        const nextFullname = `${fullname}.[${i}]`;
        return (
          <Row key={nextFullname} type="flex">
            <Col style={{ flex: 1 }}>
              <Field fullname={nextFullname} type="object" noItem />
            </Col>
            <Col>
              {this.getAddBtn(i)}
              {this.getRemoveBtn(i)}
              {this.getUpBtn(i)}
              {this.getDownBtn(i, values.length)}
            </Col>
          </Row>
        );
      });
      return this.getFieldItem(items);
    } else {
      return this.getFieldItem(this.getAddBtn(-1));
    }
  }

  render() {
    return this.renderField();
  }
}

export default ArrayField;
