import React, { useEffect } from 'react';
import { Snackbar, IconButton, Icon, SnackbarContent } from '@material-ui/core';
import { green, amber, blue } from '@material-ui/core/colors';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as Actions from 'app/store/actions';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '60%'
  },
  success: {
    backgroundColor: green[600],
    color: '#FFFFFF'
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.getContrastText(theme.palette.error.dark)
  },
  info: {
    backgroundColor: blue[600],
    color: '#FFFFFF'
  },
  warning: {
    backgroundColor: amber[600],
    color: '#FFFFFF',
    '& .MuiSvgIcon-root': {
      marginRight: '0.8rem'
    }
  },
  circularSuccess: {
    display: 'flex',
    position: 'relative',
    width: 40,
    height: 40,
    '& .MuiCircularProgress-root': {
      position: 'absolute'
    },
    '& .MuiButtonBase-root': {
      position: 'absolute',
      padding: '7px 6px 8px 7px'
    }
  }
}));

const variantIcon = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error_outline',
  info: 'info'
};

function FuseMessage() {
  const dispatch = useDispatch();
  const state = useSelector(({ fuse }) => fuse.message.state);
  const options = useSelector(({ fuse }) => fuse.message.options);
  const [progress, setProgress] = React.useState(0);
  const classes = useStyles();

  useEffect(() => {
    if (progress === 100) {
      dispatch(Actions.hideMessage());
      setProgress(0)
    }
  }, [progress]);

  useEffect(() => {
    if (state && options.variant === 'success') {
      const timer = setInterval(() => {
        setProgress((oldProgress) => oldProgress >= 100 ? 0 : oldProgress + 10);
      }, 500);
      return () => {
        clearInterval(timer);
      };
    }
  });

  const renderIconButton = () => {
    if (options.variant !== 'success') {
      return (
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => dispatch(Actions.hideMessage())}
        >
          <Icon>close</Icon>
        </IconButton>
      )
    } else {
      return (
        <div className={classes.circularSuccess}>
          <CircularProgress
            variant="static"
            value={progress}
            color="inherit"
            thickness={2}
          />
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => dispatch(Actions.hideMessage())}
          >
            <Icon>close</Icon>
          </IconButton>
        </div>
      )
    }
  }

  return (
    <Snackbar
      {...options}
      open={state}
      onClose={() => dispatch(Actions.hideMessage())}
      classes={{
        root: classes.root
      }}
      ContentProps={{
        variant: 'body2',
        headlineMapping: {
          body1: 'div',
          body2: 'div'
        }
      }}
    >
      <SnackbarContent
        className={clsx(classes[options.variant])}
        message={
          <div className="flex items-center">
            {variantIcon[options.variant] && (
              <>
                {options.variant === 'warning' ? (
                  <ReportProblemOutlinedIcon />
                ) : (
                  <Icon className="mr-8" color="inherit">
                    {variantIcon[options.variant]}
                  </Icon>
                )}
              </>
            )}
            {options.message}
          </div>
        }
        action={[
          renderIconButton()
        ]}
      />
    </Snackbar>
  );
};

export default React.memo(FuseMessage);
