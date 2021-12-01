import { EditorState, AtomicBlockUtils } from 'draft-js';
import { findEntities } from './entity';

function getEditorData(editorState) {
  return {
    contentState: editorState.getCurrentContent(),
    inlineStyle: editorState.getCurrentInlineStyle(),
    selectionState: editorState.getSelection(),
    hasFocus: editorState.getSelection().getHasFocus(),
    isCollapsed: editorState.getSelection().isCollapsed(),
    startKey: editorState.getSelection().getStartKey(),
    startOffset: editorState.getSelection().getStartOffset(),
    endKey: editorState.getSelection().getEndKey(),
    endOffset: editorState.getSelection().getEndOffset(),
  };
}

function getSelectedBlocks(editorState) {
  const { contentState, startKey, endKey } = getEditorData(editorState);
  const blocks = [];
  let block = contentState.getBlockForKey(startKey);
  while (true) {
    blocks.push(block);
    const blockKey = block.getKey();
    if (blockKey === endKey) break;

    block = contentState.getBlockAfter(blockKey);
  }
  return blocks;
}

function getSelectedBlocksByType(editorState, entityType) {
  const {
    contentState,
    startKey,
    endKey,
    startOffset,
    endOffset,
  } = getEditorData(editorState);
  const blocks = [];
  getSelectedBlocks(editorState).forEach(block => {
    const blockKey = block.getKey();
    const blockStartOffset = blockKey === startKey ? startOffset : 0;
    const blockEndOffset = blockKey === endKey ? endOffset : block.getLength();
    findEntities(
      entityType,
      block,
      (start, end) => {
        if (
          Math.max(start, blockStartOffset) <= Math.min(end, blockEndOffset)
        ) {
          const entityKey = block.getEntityAt(start);
          const text = block.getText().slice(start, end);
          const url = contentState.getEntity(entityKey).getData().url;
          blocks.push({ text, url, block, start, end });
        }
      },
      contentState,
    );
  });
  return blocks;
}

function isSelectedOneBlock(editorState) {
  const { startKey, endKey } = getEditorData(editorState);
  return startKey === endKey;
}

function getStartBlock(editorState) {
  const { contentState, startKey } = getEditorData(editorState);
  return contentState.getBlockForKey(startKey);
}

function getStartBlockSelectedText(editorState) {
  const { startOffset, endOffset } = getEditorData(editorState);
  const text = getStartBlock(editorState).getText();
  return isSelectedOneBlock(editorState)
    ? text.slice(startOffset, endOffset)
    : text.slice(startOffset);
}

function extendSelectionByData(editorState, data) {
  const {
    selectionState,
    startKey,
    startOffset,
    endKey,
    endOffset,
  } = getEditorData(editorState);
  let anchorKey = startKey;
  let focusKey = endKey;
  let anchorOffset = startOffset;
  let focusOffset = endOffset;
  data.forEach(({ blockKey, start, end }, key) => {
    if (key === 0) {
      anchorKey = blockKey;
      anchorOffset = start;
    }
    if (key === data.length - 1) {
      focusKey = blockKey;
      focusOffset = end;
    }
  });
  const state = Object.assign({}, anchorKey ? { anchorKey } : {}, {
    focusKey,
    anchorOffset,
    focusOffset,
    isBackward: false,
  });
  const newSelectionState = selectionState.merge(state);
  return EditorState.acceptSelection(editorState, newSelectionState);
}

function insertImage(editorState, data = {}) {
  const { contentState } = getEditorData(editorState);
  const newContentState = contentState.createEntity('IMAGE', 'IMMUTABLE', data);
  const entityKey = newContentState.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: newContentState,
  });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
}

export {
  getEditorData,
  getSelectedBlocks,
  getSelectedBlocksByType,
  getStartBlockSelectedText,
  extendSelectionByData,
  insertImage,
};
