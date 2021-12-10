import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: props.disabled };
  }
  disable(flag) {
    this.setState({ disabled: flag });
  }
  _onClick = e => {
    e.preventDefault();
    this.props.onClick(e);
  };
  componentWillReceiveProps(nextProps) {
    const { disabled: nextDisabled } = nextProps;
    const { disabled } = this.props;
    if (disabled === false && nextDisabled === true) return;
    this.setState({ disabled });
  }
  render() {
    const { disabled } = this.state;
    const { position } = this.props;
    return (
      <RoundButton
        disabled={disabled}
        style={{
          top: `${position.top + window.scrollY - 20}px`
        }}
        onClick={this._onClick}
      >
        <span className="fa-stack">
          <i className="fa fa-comment fa-stack-2x fa-inverse" />
          <strong
            className="fa-stack-1x fa-stack-text"
            style={{ color: "#333" }}
          >
            +
          </strong>
        </span>
      </RoundButton>
    );
  }
  static propTypes = {
    position: PropTypes.shape({
      top: PropTypes.number
    })
  };
  static defaultProps = {
    position: {
      top: 0
    }
  };
}

const RoundButton = styled.button`
  position: absolute;
  right: 0px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  outline: none;
  color: #999;
  background: #333;
  box-shadow: 0px 0px 5px #444;
  border: 0;
  border-radius: 50%;
  &:hover {
    color: #444;
    border-color: #444;
  }
  &:enabled {
    visibility: visible;
    opacity: 1;
    transition: visibility 0s linear 0ms, opacity 300ms;
  }

  &:disabled {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 300ms, opacity 300ms;
  }
`;
