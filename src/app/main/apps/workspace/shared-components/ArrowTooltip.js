import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const arrowGenerator = (arrowColor, shadowColor) => ({
  '&[x-placement*="bottom"] $arrow': {
    top: '-6px',
    width: '16px',
    height: '8px',
    '&::before': {
      left: 0,
      right: 0,
      top: '1px',
      margin: '0 auto',
      borderWidth: '0 6px 6px 6px',
      borderColor: `transparent transparent ${arrowColor} transparent`,
    },
    '&::after': {
      left: 0,
      right: 0,
      top: 0,
      margin: '0 auto',
      borderWidth: '0 6px 6px 6px',
      borderColor: `transparent transparent ${shadowColor} transparent`,
    },
  },
  '&[x-placement*="top"] $arrow': {
    bottom: '-6px',
    width: '16px',
    height: '8px',
    '&::before': {
      left: 0,
      right: 0,
      bottom: '1px',
      margin: '0 auto',
      borderWidth: '6px 6px 0 6px',
      borderColor: `${arrowColor} transparent transparent transparent`,
    },
    '&::after': {
      left: 0,
      right: 0,
      bottom: 0,
      margin: '0 auto',
      borderWidth: '6px 6px 0 6px',
      borderColor: `${shadowColor} transparent transparent transparent`,
    },
  },
  '&[x-placement*="right"] $arrow': {
    left: '-6px',
    width: '8px',
    height: '16px',
    '&::before': {
      top: 0,
      bottom: 0,
      left: '1px',
      margin: 'auto 0',
      borderWidth: '6px 6px 6px 0',
      borderColor: `transparent ${arrowColor} transparent ${arrowColor}`,
    },
    '&::after': {
      top: 0,
      bottom: 0,
      left: 0,
      margin: 'auto 0',
      borderWidth: '6px 6px 6px 0',
      borderColor: `transparent ${shadowColor} transparent ${shadowColor}`,
    },
  },
  '&[x-placement*="left"] $arrow': {
    right: '-6px',
    width: '8px',
    height: '16px',
    '&::before': {
      top: 0,
      bottom: 0,
      right: '1px',
      margin: 'auto 0',
      borderWidth: '6px 0 6px 6px',
      borderColor: `transparent ${arrowColor} transparent ${arrowColor}`,
    },
    '&::after': {
      top: 0,
      bottom: 0,
      right: 0,
      margin: 'auto 0',
      borderWidth: '6px 0 6px 6px',
      borderColor: `transparent ${shadowColor} transparent ${shadowColor}`,
    },
  },
});

const styles = theme => ({
  arrow: {
    position: 'absolute',
    fontSize: 6,
    '&::before': {
      borderStyle: 'solid',
      content: '""',
      display: 'block',
      width: 0,
      height: 0,
      position: 'absolute',
    },
    '&::after': {
      borderStyle: 'solid',
      content: '""',
      display: 'block',
      width: 0,
      height: 0,
      position: 'absolute',
      zIndex: -1,
    },
  },
  arrowPopper: arrowGenerator(
    theme.palette.common.white,
    theme.palette.grey[50]
  ),
  lightTooltip: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[3],
    color: '#515E6A',
    fontSize: 15,
    fontFamily: "Montserrat",
    // whiteSpace: 'break-word	',
    position: 'relative',
    wordWrap: 'break-word	'
  },
});

class ArrowTooltip extends React.Component {
  state = {
    arrowRef: null,
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
  };

  render() {
    const { children, classes, title, placement, isLongText } = this.props;
    
    if (!children.props.rows && isLongText) {
      return (
        <Tooltip
          placement={placement}
          title={
            <>
              {title}
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </>
          }
          classes={{ tooltip: classes.lightTooltip, popper: classes.arrowPopper }}
          PopperProps={{
            popperOptions: {
              modifiers: {
                arrow: {
                  enabled: Boolean(this.state.arrowRef),
                  element: this.state.arrowRef,
                },
              },
            },
          }}
        >
          {children}
        </Tooltip>
      );
    } else return <> {children} </>
  }
}

ArrowTooltip.propTypes = {
  classes: PropTypes.object.isRequired,
  placement: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(ArrowTooltip);
