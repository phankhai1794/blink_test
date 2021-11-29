import React from 'react';
// import { AnimateIn } from './AnimateIn';
import { ContentState, convertToRaw } from 'draft-js';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import 'megadraft/dist/css/megadraft.css';

export class Element extends React.Component {
    static defaultProps = {
        value: 'Hello World',
        handleChange: () => { }
    };

    constructor() {
        super(...arguments);
        this.state = {
            length: this.props.value.length,
            isFocused: false,
            editorState: editorStateFromRaw(
                convertToRaw(ContentState.createFromText(this.props.value))
            )
        };
    }

    onChange = editorState => {
        const length = editorState.getCurrentContent().getPlainText('').length;
        this.setState({ editorState, length });
    };

    handleBlur = e => {
        const hasText = this.state.editorState.getCurrentContent().hasText();
        this.props.handleChange(hasText);
    };

    render() {
        const { editorState, length, isFocused } = this.state;
        const { maxChars } = this.props;
        const showError = maxChars && length > maxChars;

        // const errorMessage = (
        // 	<AnimateIn animation="slide" show={showError}>
        // 		<div className="error-message">You typed too much text </div>
        // 	</AnimateIn>
        // );

        return (
            <span className="element">
                <MegadraftEditor
                    ref="editor"
                    // onFocus={() => this.setState({ isFocused: true })}
                    // onBlur={() => this.setState({ isFocused: false })}
                    // shouldDisplayToolbarFn={() => isFocused}
                    placeholder={this.props.placeholder}
                    editorState={editorState}
                    onChange={this.onChange}
                    sidebarRendererFn={() => null}
                    {...this.props}
                />
            </span>
        );
    }
}
