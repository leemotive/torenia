import React, { Component } from 'react';
import { Input } from 'antd';
import request from '../../utils/request';

const { Group: InputGroup } = Input;

class Captcha extends Component {
  static defaultProps = {
    url: '/api/captcha',
    method: 'post',
    resolveUrl: data => data.data.url,
    captchaWidth: 102,
    captchaHeight: 32,
    className: '',
  }
  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
    };
  }

  refreshCaptcha = async () => {
    let { url, api } = this.props;
    if (api) {
      url = await this.getCaptcha();
    } else {
      url = `${url}?${Date.now()}`
    }
    this.setState({
      url
    });
  }

  getCaptcha = async () => {
    const { api, resolveUrl } = this.props;
    const data = await request({
      url: api,
    });
    return resolveUrl(data);
  }

  componentDidMount = () => {
    this.refreshCaptcha();
  }

  render() {
    const { children, className, resolveUrl, captchaWidth, captchaHeight, ...inputProps } = this.props;

    return (
      <InputGroup className={className} compact={true} style={{ display: 'flex' }}>
        <Input style={{ flex: 1 }} {...inputProps} />
        <img style={{ minWidth: captchaWidth, height: captchaHeight }} onClick={this.refreshCaptcha} src={this.state.url} />
      </InputGroup>
    )
  }
}

export default Captcha;
