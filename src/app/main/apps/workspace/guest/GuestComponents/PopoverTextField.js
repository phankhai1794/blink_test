import React, { useEffect } from "react";
import AddCommentIcon from '@material-ui/icons/AddComment';
import { Popover, IconButton, TextField, InputAdornment } from "@material-ui/core";
import InformationForm from "./InformationForm";
import { makeStyles } from "@material-ui/styles";
import { useState } from "react";
import { useRef } from "react";
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import _ from '@lodash'
import { green } from "@material-ui/core/colors";

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
		backgroundColor: "#f5f8fa",

	},
	input: {
		fontFamily: "Courier New"
	},
	notchedOutlineChecked: {
		borderColor: `${green[500]} !important`
	},
	notchedOutlineNotChecked: {
		borderColor: `red !important`
	}
}))
const PopoverTextField = (props) => {
	const classes = useStyles()
	const [anchorCmtBtn, setAnchorCmtBtn] = useState(null)
	const [anchorCmtBox, setAnchorCmtBox] = useState(null)
	const [isRightMost, setIsRightMost] = useState(false)
	const [allowEdit, setAllowEdit] = useState(false)
	const { data } = props
	const { question, content, title, open } = data[props.title]
	const [inputContent, setInputContent] = useState(content)
	const openCmtBtn = Boolean(anchorCmtBtn);
	const openCmtBox = Boolean(anchorCmtBox);
	const idCmtBox = openCmtBox ? 'comment-box-popover' : undefined;
	const divRef = useRef()
	let questionIsEmpty = true
	if (question.choices.length > 0) {
		questionIsEmpty = false
	}
	const onOpenCommentBox = () => {
		const { x, width } = divRef.current.getBoundingClientRect()
		// check if div is on the right most of screen -> change posiition of popover
		if (x + width >= 900) {
			setIsRightMost(true)
		}
		// event.preventDefault()
		setAnchorCmtBox(divRef.current)
	}
	const onCloseCommentBox = () => {
		// event.preventDefault()
		setAnchorCmtBox(null)
	}
	const onSave = (savedQuestion, title) => {
		if (savedQuestion.selectedChoice !== undefined || savedQuestion.selectedChoice !== "") {
			setInputContent(savedQuestion.selectedChoice)
		}
		props.onSave(savedQuestion, title)
	}
	const onCloseForm = (e) => {
		e.preventDefault()
		setAnchorCmtBox(null)
	}
	const handleAllowEdit = () => {
		setAllowEdit(!allowEdit)
		// props.onSaveContentOnly(content)
	}
	const toggleDrawer = () => {
		props.toggleDrawer(title)
	}
	let fullWidth = "auto"
	if (props.fullWidth === false) {
		fullWidth = "fit-content"
	}
	return (
		<>
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
				style={{
					pointerEvents: `${allowEdit ? "auto" : "none"}`
				}}
				classes={{
					paper: classes.popoverContent
				}}
				PaperProps={{ onMouseEnter: onOpenCommentBox, onMouseLeave: onCloseCommentBox }}

			>
				<div>
					<InformationForm
						onClose={onCloseCommentBox}
						title={title}
						question={question}
						content={content}
						onSave={onSave}
						onCloseForm={onCloseForm}
						questionIsEmpty={questionIsEmpty}
						toggleDrawer={toggleDrawer}
					/>
				</div>

			</Popover>
			<div
				ref={divRef}
				onMouseEnter={!questionIsEmpty && onOpenCommentBox}
				onMouseLeave={!questionIsEmpty && onCloseCommentBox}
				style={{
					width: `${fullWidth}`,
				}}
			>
				<TextField id="outlined-disabled"
					value={inputContent}
					onChange={(e) => setInputContent(e.target.value)}
					variant="outlined"
					fullWidth={true}
					classes={{
						root:
							classes.root
					}}
					onBlur={handleAllowEdit}
					InputProps={{
						style: {
							fontFamily: "Courier New",
							backgroundColor: `${openCmtBtn !== openCmtBox ?
								"yellow" : `${open ? "yellow" : "#f5f8fa"}`}`,

						},
						endAdornment: (
							<InputAdornment position="end" >
								{!questionIsEmpty ? <ChatBubbleIcon color="primary" /> : ""}
							</InputAdornment>
						),
						classes: {
							notchedOutline: `${!questionIsEmpty ?
								(question.selectedChoice ? classes.notchedOutlineChecked : classes.notchedOutlineNotChecked) : ""}`
						}
					}}
				/>
			</div>
		</>
	);
}

export default PopoverTextField