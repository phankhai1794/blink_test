import React from 'react';
import { Popper } from '@material-ui/core';
import styled from 'styled-components';

const StyledPopper = styled(Popper)`&&{
    z-index: 1301;
    max-width: 400px;
    padding: 15px;
    background: white;
    border-radius: 8px;
  
    &[x-placement*="right"] {
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
    }
  
    &[x-placement*="left"] {
      box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.15);
    }
  
    &[x-placement*="right"] .arrow {
      left: 0;
      margin-left: -0.9em;
  
      &:before {
        left: 3px;
        border-color: transparent white transparent transparent;
        box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.15);
      }
    }
  
    &[x-placement*="left"] .arrow {
      right: 0;
      margin-right: -0.9em;
  
      &:before {
        right: 3px;
        border-color: transparent transparent transparent white;
        box-shadow: 1px -1px 1px rgba(0, 0, 0, 0.15);
      }
    }
  
    .arrow {
      position: absolute;
      font-size: 10px;
      width: 3em;
      height: 3em;
  
      &:before {
        content: "";
        background: white;
        position: absolute;
        margin-top: 50%;
        display: block;
        width: 10px;
        height: 10px;
        border-style: solid;
        transform: rotate(45deg)
      }
    }
  }`;

const EllipsisPopper = ({ anchorEl, arrowRef, children }) => {
  const open = Boolean(anchorEl);
  return (
    <StyledPopper
      anchorEl={anchorEl}
      open={open}
      placement="right"
      modifiers={{
        flip: {
          enabled: true,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: 'scrollParent',
        },
        arrow: {
          enabled: true,
          element: arrowRef,
        }
      }}
    >
      {children}
    </StyledPopper>
  )
}

export default EllipsisPopper;