import React, { Component } from 'react';
import { Input, Button } from 'antd';
import request from '../../utils/request';

const { Group: InputGroup } = Input;

class SmsCode extends Component {
  static defaultProps = {
    delay: 60,
    api: '/api/smscode',
    btnWidth: 102,
    paramName: 'phone',
    isSuccess(data) {
      return data === true || (data && data.code == 200);
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      smsText: '获取验证码',
    };
  }

  getSmsCode = async () => {
    const {
      api,
      method = 'post',
      isSuccess,
      paramName,
      value: phone,
    } = this.props;
    if (this.counting) {
      return;
    }
    const data = await request({
      url: api,
      method,
      data: {
        [paramName]: phone,
      },
    });
    if (isSuccess(data)) {
      this.countStart = Date.now();
      this.counting = true;
      this.countDown();
    }
  };

  countDown = () => {
    const { delay } = this.props;
    let loop = delay - Math.floor((Date.now() - this.countStart) / 1000);
    const smsText = loop > 0 ? `${loop}秒后获取` : '获取验证码';
    this.timer = window.setTimeout(() => {
      this.setState({
        smsText,
      });
      if (loop > 0) {
        this.countDown();
        this.counting = false;
      }
    }, 1000);
  };

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  render() {
    const {
      children,
      btnWidth,
      isSuccess,
      paramName,
      ...inputProps
    } = this.props;

    return (
      <InputGroup compact={true} style={{ display: 'flex' }}>
        <Input style={{ flex: 1 }} {...inputProps} />
        <Button style={{ width: btnWidth }} onClick={this.getSmsCode}>
          {this.state.smsText}
        </Button>
      </InputGroup>
    );
  }
}

export default SmsCode;
