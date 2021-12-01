import React, { Component } from "react";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";
import { EditorState, RichUtils } from "draft-js";

import { getEditorData, extendSelectionByData } from "../helpers/editor";
import {
  createEntity,
  removeEntity,
  findEntityInSelection,
  getEntities
} from "../helpers/entity";
import Input from "../components/Input";

export default onClickOutside(
  class extends Component {
    static propTypes = {
      entityType: PropTypes.string,
      editorState: PropTypes.object,
      position: PropTypes.object,
      placeholder: PropTypes.string,
      onChange: PropTypes.func,
      onClose: PropTypes.func
    };
    constructor(props) {
      super();
      const { entityType, editorState } = props;
      this.entity = findEntityInSelection(editorState, entityType);
      this.state = {
        value: this.entity !== null ? this.entity.entity.data.value : ""
      };
    }
    componentWillMount() {
      const { entityType, editorState, onChange } = this.props;
      if (this.entity !== null) {
        this.editorStateBackup = extendSelectionByData(
          editorState,
          getEntities(editorState, entityType, this.entity.entityKey)
        );
      } else {
        this.editorStateBackup = editorState;
      }
      onChange(RichUtils.toggleInlineStyle(this.editorStateBackup, "SELECTED"));
    }

    componentWillUnmount() {
      this.props.onChange(this.editorStateBackup);
    }
    handleClickOutside = () => {
      this.props.onClose();
    };
    applyValue = e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        const { value } = this.state;
        const { entityType, onClose } = this.props;
        const { contentState } = getEditorData(this.editorStateBackup);
        if (this.entity === null) {
          this.editorStateBackup = createEntity(
            this.editorStateBackup,
            entityType,
            { value }
          );
        } else {
          contentState.mergeEntityData(this.entity.entityKey, { value });
        }
        onClose();
      }
    };
    _onRemoveClick = () => {
      const { entityType, onClose } = this.props;
      this.editorStateBackup = removeEntity(this.editorStateBackup, entityType);
      onClose();
    };
    _onInputChange = e => {
      this.setState({ value: e.target.value });
    };
    render() {
      const { value } = this.state;
      const { position, placeholder, isCommentInput } = this.props;
      return (
        <Input
          position={position}
          value={value}
          placeholder={placeholder}
          onKeyDown={this.applyValue}
          onChange={this._onInputChange}
          onClickRemove={this._onRemoveClick}
          enableRemove={this.entity !== null}
        />
      );
    }
  }
);
