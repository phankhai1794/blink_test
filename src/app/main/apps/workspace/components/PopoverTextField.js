import React from "react";
import AddCommentIcon from '@material-ui/icons/AddComment';
import { Popover, IconButton } from "@material-ui/core";
import InformationForm from "./InformationForm";
import { makeStyles } from "@material-ui/styles";
import { useState } from "react";
import { useRef } from "react";
import _ from '@lodash'
const useStyles = makeStyles(theme => ({
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
	},
	root: {
		// color: theme.palette.secondary.contrastText,
		backgroundColor: "#f5f8fa",
	},
	input: {
		fontFamily: "Courier New"
	}
}))

const PopoverTextField = (props) => {
	const [anchorCmtBtn, setAnchorCmtBtn] = useState(null)
	const [anchorCmtBox, setAnchorCmtBox] = useState(null)
	const [isRightMost, setIsRightMost] = useState(false)
	const classes = useStyles()
	const { hasComment, children, question } = props
	const openCmtBtn = Boolean(anchorCmtBtn);
	const idCmtBtn = openCmtBtn ? 'comment-button-popover' : undefined;
	const openCmtBox = Boolean(anchorCmtBox);
	const idCmtBox = openCmtBox ? 'comment-box-popover' : undefined;
	const divRef = useRef()
	let questionIsEmpty = true
	if (question) {
		if (question.name !== "") {
			questionIsEmpty = false
		}
	}
	const onOpenCommentButton = (event) => {
		event.preventDefault()
		const { x, width } = divRef.current.getBoundingClientRect()
		// check if div is on the right most of screen -> change posiition of popover
		if (x + width >= 900) {
			setIsRightMost(true)
		}
		setAnchorCmtBtn(event.currentTarget)
	}
	const onCloseCommentButton = (event) => {
		event.preventDefault()
		setAnchorCmtBtn(null)
	}
	const onOpenCommentBox = (event) => {
		event.preventDefault()
		setAnchorCmtBox(divRef.current)
	}
	const onCloseCommentBox = (event) => {
		event.preventDefault()
		setAnchorCmtBox(null)
	}
	const onSave = (savedQuestion) => {
		props.onSave(savedQuestion)
	}
	const onCloseForm = (e) => {
		e.preventDefault()
		setAnchorCmtBox(null)
	}
	let fullWidth = "auto"
	if (props.fullWidth === false) {
		fullWidth = "fit-content"
	}

	return (
		<>
			<Popover
				id={idCmtBtn}
				open={openCmtBtn}
				anchorEl={anchorCmtBtn}
				onClose={onCloseCommentButton}
				anchorOrigin={{
					vertical: 'center',
					horizontal: `${isRightMost ? 'left' : 'right'}`,
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: `${isRightMost ? 'right' : 'left'}`,
				}}
				className={`${classes.popover} ${classes.circlePopover}`}
				classes={{
					paper: classes.popoverContent
				}}
				PaperProps={{ onMouseEnter: (questionIsEmpty ? onOpenCommentButton : onOpenCommentBox), onMouseLeave: onCloseCommentButton }}
			>
				<IconButton color="primary" onClick={onOpenCommentBox}><AddCommentIcon style={{ transform: `${isRightMost ? "scaleX(1)" : "scaleX(-1)"}` }} /></IconButton>
			</Popover>
			<Popover
				id={idCmtBox}
				open={openCmtBox}
				anchorEl={anchorCmtBox}
				onClose={onCloseCommentBox}
				anchorOrigin={{
					vertical: 'center',
					horizontal: `${isRightMost ? 'left' : 'right'}`,
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: `${isRightMost ? 'right' : 'left'}`,
				}}
				className={classes.popover}
				classes={{
					paper: classes.popoverContent
				}}
				PaperProps={{ onMouseEnter: onOpenCommentBox, onMouseLeave: onCloseCommentBox }}

			>
				<div>
					<InformationForm onClose={onCloseCommentBox} hasComment={hasComment} question={question} onSave={onSave} onCloseForm={onCloseForm} questionIsEmpty={questionIsEmpty} />
				</div>

			</Popover>
			<div
				ref={divRef}
				onMouseEnter={!questionIsEmpty ? onOpenCommentBox : onOpenCommentButton}
				onMouseLeave={!questionIsEmpty ? onCloseCommentBox : onCloseCommentButton}
				style={{ width: `${fullWidth}`, border: `${!questionIsEmpty && "1px solid red"}` }}
			>
				{/* CODE TEST QUESTIONBOX UI 
				<QuestionBox question={{
					name: "We found discrepancy in the routing information between SI and OPUS booking details",
					choices: [
						{
							id: 1,
							content: "OPTION1"
						},
						{
							id: 2,
							content: "OPTION2"
						}
					],
					addOther: true
				}} /> */}
				{children}
				{/* <TextField disabled id="outlined-disabled"

					defaultValue=" BUSAN"
					variant="outlined"
					fullWidth={true}
					multiline
					classes={{ root: classes.root }}
					InputProps={{ classes: { root: classes.input } }}
				/> */}
			</div>
		</ >
	);
}

export default PopoverTextField