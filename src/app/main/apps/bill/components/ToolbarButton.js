import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export default class extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  };
  static defaultProps = {
    className: "",
    disabled: false,
    onClick: () => { }
  };
  handleMouseDown = e => {
    const { disabled, onClick } = this.props;
    e.preventDefault();
    if (!disabled && e.button === 0) {
      onClick(e);
    }
  };
  render() {
    const { icon, children, className } = this.props;
    return (
      <ToolbarButton className={className} onMouseDown={this.handleMouseDown}>
        <Icon className={`fa fa-${icon}`} /> {children}
      </ToolbarButton>
    );
  }
}

const ToolbarButton = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 0.5rem 1rem;
  ${'' /* background: #333; */}
  color: "black";
  font-family: system-ui;
  font-size: "20px";
  font-weight: 100;
  &:hover {
    background: #555;
  }
`;

const Icon = styled.i`
  color: #fff;
`;
