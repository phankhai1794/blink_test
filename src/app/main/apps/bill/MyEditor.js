import React, { Component } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
} from "draft-js";
import styled from "styled-components";
// import { stateToHTML } from "draft-js-export-html";

import "./editorStyles.module.css";
import decorator from "./decorators";
import Input from "./containers/Input";
import ToolbarButton from "./components/ToolbarButton";
import { getEditorData } from "./helpers/editor";
import { getSelected, getPosition } from "./helpers/selection";
import Toolbar from "./components/Toolbar";
// const Toolbar = styled.div`
//   div {
//     &:first-child {
//       border-top-left-radius: 5px;
//       border-bottom-left-radius: 5px;
//     }
//     &:last-child {
//       border-top-right-radius: 5px;
//       border-bottom-right-radius: 5px;
//     }
//   }
// `;

class MyEditor extends Component {
  constructor(props) {
    super();
    this.state = {
      showCommentInput: false,
      exportedOptions: {},
      position: {},
      showToolbar: false,
      editorState: EditorState.createWithContent(
        ContentState.createFromText(
          props.children ? props.children : ""
        )
      )
    };
  }
  _onChange = (editorState) => {
    this.setState({ editorState });
  };
  _onBoldClick = (e) => {
    e.preventDefault();
    this._onChange(RichUtils.toggleInlineStyle(this.state.editorState, "HIGHLIGHTED"));
  };
  _onCommentClick = (e) => {
    e.preventDefault();
    this.setState({
      showCommentInput: true
    });
  };
  _onCommentInputClose = () => {
    this.setState({
      showCommentInput: false
    });
  };
  _onMouseOrKeyUp = () => {
    var selected = getSelected();
    // this.setState({
    // });
    if (selected.rangeCount > 0) {
      setTimeout(() => {
        this.setState({
          position: getPosition(selected),
          // showToolbar: !this.state.showToolbar
        });
      }, 1);
    }
  };

  // _onClick = () => {
  //   this.setState({
  //     showToolbar: false
  //   })
  // }
  componentDidMount() {
    this._onChange(
      EditorState.set(this.state.editorState, {
        decorator: decorator({
          clickComment: this._onCommentClick,
        })
      })
    );
  }
  render() {
    const {
      showCommentInput,
      position,
      editorState,
      showToolbar
    } = this.state;
    const { contentState } = getEditorData(editorState);
    return (
      <div>
        <Toolbar
          disabled={getSelected().isCollapsed || showCommentInput}
          position={position}>
          <ToolbarButton icon="bold" onClick={this._onBoldClick}>
            Highlight
          </ToolbarButton>
          <ToolbarButton icon="commenting-o" onClick={this._onCommentClick}>
            Comment
          </ToolbarButton>
        </Toolbar>

        <div
          style={{
            margin: "1rem 0"
          }}
          onKeyUp={this._onMouseOrKeyUp}
          onMouseUp={this._onMouseOrKeyUp}
        >
          <Editor
            ref={(element) => (this.editor = element)}
            editorState={editorState}
            onChange={this._onChange}
            customStyleMap={{
              SELECTED: {
                backgroundColor: "yellow"
                // background: "#e2f2ff"
              },
              HIGHLIGHTED: {
                backgroundColor: "yellow"
              }
            }}
          />
          {/* {showExportedHTML && stateToHTML(contentState, exportedOptions)} */}
        </div>
        {
          showCommentInput && (
            <Input
              entityType="COMMENT"
              placeholder="Write down some comment..."
              editorState={editorState}
              onChange={this._onChange}
              position={position}
              onClose={this._onCommentInputClose}
            />
          )
        }
        {/* <CommentButton
          disabled={getSelected().isCollapsed || showCommentInput}
          position={position}
          onClick={this._onCommentClick}
        /> */}
        <input type="file" id="imgUpload" style={{ display: "none" }} />
      </div>
    );
  }
}

const containerStyle = {
  position: "relative"
};

export default MyEditor