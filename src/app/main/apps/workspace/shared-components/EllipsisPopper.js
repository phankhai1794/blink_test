import React, { cloneElement, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';

const useStyles = makeStyles((theme) => ({
  popper: {
    zIndex: 1301,
    borderRadius: 8,
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: 0,
      width: 0,
      borderTop: '1em solid transparent',
      borderBottom: '1em solid transparent',
      borderRight: '1em solid #BD0F73',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent transparent transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: 0,
      width: 0,
      borderTop: '1em solid transparent',
      borderBottom: '1em solid transparent',
      borderLeft: '1em solid #BD0F73',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent transparent`
      }
    }
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    }
  }
}));

function AltPopper({
  id: __id,
  placement,
  preventOverflow,
  disablePortal,
  keepMounted,
  modifiers,
  flip,
  transition,
  anchorEl,
  arrow,
  open,
  className,
  children
}) {
  const classes = useStyles();
  const [arrowRef, setArrowRef] = useState(null);
  const id = open ? __id : null;

  const renderChildren = ({ ...popperProps }) => {
    const elements = [];
    const $arrow = arrow ? <span key={0} className={classes.arrow} ref={setArrowRef} /> : null;

    let element;
    if (typeof children === 'function') {
      element = children({
        ...popperProps,
        ...(arrow ? { arrow: $arrow } : {})
      });
    } else {
      element = children;
      if (arrow) {
        elements.push($arrow);
      }
    }
    element = cloneElement(element, arrow ? { key: 1 } : {});
    elements.push(element);
    return elements;
  };

  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      keepMounted={keepMounted}
      disablePortal={disablePortal}
      transition={transition}
      className={clsx(classes.popper, className)}
      modifiers={{
        flip: {
          enabled: flip
        },
        arrow: {
          enabled: arrow,
          element: arrowRef
        },
        preventOverflow: {
          enabled: preventOverflow !== 'disabled',
          boundariesElement: preventOverflow === 'disabled' ? 'scrollParent' : preventOverflow
        },
        ...(modifiers || {})
      }}>
      {renderChildren}
    </Popper>
  );
}

export default AltPopper;
