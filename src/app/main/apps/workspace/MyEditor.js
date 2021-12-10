import React, { Component } from "react";
import AddCommentIcon from '@material-ui/icons/AddComment';
import { Popover, IconButton } from "@material-ui/core";
import InformationForm from "./components/InformationForm";
import { withStyles } from "@material-ui/styles";

const styles = theme => ({
  disabledText: {
    color: "blue",
    fontSize: "1rem",
    textTransform: "uppercase"
  },
  popover: {
    pointerEvents: "none",
  },
  circlePopover: {
    "& > div":
    {
      borderRadius: "200px"
    }
  },
  popoverContent: {
    pointerEvents: "auto"
  }
})

class MyEditor extends Component {
  constructor(props) {
    super();
    this.state = {
      anchorCmtBtn: null,
      anchorCmtBox: null,
      divRef: React.createRef(),
    };
  }
  _onOpenCommentButton = (event) => {
    event.preventDefault()
    this.setState({
      anchorCmtBtn: event.currentTarget
    })
  }
  _onCloseCommentButton = () => {
    this.setState({
      anchorCmtBtn: null,
    })

  }
  _onOpenCommentBox = () => {
    this.setState({
      anchorCmtBtn: null,
      anchorCmtBox: this.state.divRef.current
    })
  }
  _onCloseCommentBox = () => {
    this.setState({
      anchorCmtBox: null
    })
  }
  render() {
    const {
      anchorCmtBtn,
      anchorCmtBox,
      divRef,
    } = this.state;
    const { hasComment, classes, title, children } = this.props
    const openCmtBtn = Boolean(anchorCmtBtn);
    const idCmtBtn = openCmtBtn ? 'comment-button-popover' : undefined;
    const openCmtBox = Boolean(anchorCmtBox);
    const idCmtBox = openCmtBox ? 'comment-box-popover' : undefined;
    return (
      <>
        <Popover
          id={idCmtBtn}
          open={openCmtBtn}
          anchorEl={anchorCmtBtn}
          onClose={this._onCloseCommentButton}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          className={`${classes.popover} ${classes.circlePopover}`}
          classes={{
            paper: classes.popoverContent
          }}
          PaperProps={{ onMouseEnter: this._onOpenCommentButton, onMouseLeave: this._onCloseCommentButton }}
        >
          <IconButton color="primary" onClick={this._onOpenCommentBox}><AddCommentIcon /></IconButton>
        </Popover>
        <Popover
          id={idCmtBox}
          open={openCmtBox}
          anchorEl={anchorCmtBox}
          onClose={this._onCloseCommentBox}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          className={classes.popover}
          classes={{
            paper: classes.popoverContent
          }}
          PaperProps={{ onMouseEnter: this._onOpenCommentBox, onMouseLeave: this._onCloseCommentBox }}

        >
          <div>

            <InformationForm onClose={this._onCloseCommentBox} hasComment={hasComment} />
          </div>

        </Popover>
        <div
          style={{
            // fix some UI when div being commented
            marginTop: `${hasComment ? "-3px" : ""}`,
            width: "100%", height: "100%"
          }}
          ref={divRef}
          onMouseEnter={hasComment ? this._onOpenCommentBox : this._onOpenCommentButton}
          onMouseLeave={hasComment ? (this._onCloseCommentBox) : (this._onCloseCommentButton)}

        >
          <h1 className={classes.disabledText}>{title}</h1>
          <div style={{ paddingBottom: `${this.props.paddingBottom}` }}>
            {children}
          </div>
        </div>
      </ >
    );
  }
}

export default withStyles(styles)(MyEditor)