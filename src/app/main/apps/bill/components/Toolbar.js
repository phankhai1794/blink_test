import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { withStyles } from "@material-ui/styles";
const styles = theme => ({
    Toolbar: {
        outline: "none",
        position: "absolute",
        cursor: "pointer",
        display: "flex",
        padding: "0",
    },
    disabled: {

        visibility: "hidden",
        opacity: "0",
        transition: "visibility 0s linear 300ms, opacity 300ms",
    },
    enabled:
    {
        visibility: "visible",
        opacity: "1",
        transition: "visibility 0s linear 0ms, opacity 300ms",
    },
})
class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = { disabled: props.disabled };
    }
    disable(flag) {
        this.setState({ disabled: flag });
    }
    componentWillReceiveProps(nextProps) {
        const { disabled: nextDisabled } = nextProps;
        const { disabled } = this.props;
        if (disabled === false && nextDisabled === true) return;
        this.setState({ disabled });
    }
    render() {
        const { disabled } = this.state;
        const { position } = this.props;
        const { classes } = this.props;
        return (
            <div
                style={{
                    top: `${position.top + window.scrollY - 110}px`,
                    left: `${(position.left + position.right - window.scrollX - 100) / 2}px`,
                    backgroundColor: "white"
                }} className={`${classes.Toolbar} ${disabled ? classes.disabled : classes.enabled}`}>
                {this.props.children}
            </div>
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
export default withStyles(styles)(Toolbar);
