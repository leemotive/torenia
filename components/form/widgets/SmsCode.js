import React, { Component } from 'react';
import { Input, Button } from 'antd';
import request from '../../utils/request';

const { Group: InputGroup } = Input;

class SmsCode extends Component {
  static defaultProps = {
    api: '/api/smscode',
    btnWidth: 102,
    paramName: 'phone'
  }
  constructor(props) {
    super(props);
    this.state = {
      smsText: '获取验证码'
    };
  }

  getSmsCode = async () => {
    const { api, method = 'post', paramName, value: phone } = this.props;
    if (this.counting) {
      return;
    }
    const data = await request({
      url: api,
      method,
      data: {
        [paramName]: phone,
      }
    });

    this.countStart = Date.now();
    this.counting = true;
    this.countDown();
  }

  countDown = () => {
    let loop = 60 - Math.floor((Date.now() - this.countStart) / 1000);
    const smsText = loop === 0 ? '获取验证码' : `${loop}秒后获取`;
    this.timer = window.setTimeout(() => {
      this.setState({
        smsText
      });
      if (loop !== 0) {
        this.countDown();
        this.counting = false;
      }
    }, 1000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  render() {
    const { children, btnWidth, ...inputProps } = this.props;

    return (
      <InputGroup compact={true} style={{display: 'flex'}}>
        <Input style={{flex: 1}} {...inputProps} />
        <Button style={{width: btnWidth}} onClick={this.getSmsCode}>{this.state.smsText}</Button>
      </InputGroup>
    )
  }
}

export default SmsCode;
