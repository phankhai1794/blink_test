import { EditorState, Modifier } from 'draft-js';
import { getEditorData, getSelectedBlocksByType } from './editor';

export function createEntity(editorState, entityType, data = {}) {
  const { contentState, selectionState } = getEditorData(editorState);
  const contentStateWithEntity = contentState.createEntity(
    entityType,
    'MUTABLE',
    data,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: Modifier.applyEntity(
      contentStateWithEntity,
      selectionState,
      entityKey,
    ),
  });
  return newEditorState;
}

export function removeEntity(editorState, entityType) {
  const { contentState, selectionState } = getEditorData(editorState);
  const blocks = getSelectedBlocksByType(editorState, entityType);
  if (blocks.length !== 0) {
    let newContentState = contentState;
    blocks.forEach(({ block, start, end }, key) => {
      const blockKey = block.getKey();
      newContentState = Modifier.applyEntity(
        newContentState,
        selectionState.merge({
          anchorKey: blockKey,
          focusKey: blockKey,
          anchorOffset: start,
          focusOffset: end,
          isBackward: false,
        }),
        null,
      );
    });
    return EditorState.set(editorState, {
      currentContent: newContentState,
    });
  }
}

export function findEntityInSelection(editorState, entityType) {
  const { startKey, startOffset, endOffset } = getEditorData(editorState);
  const entities = getEntitiesByBlockKey(editorState, entityType, startKey);
  if (entities.length === 0) return null;

  let selectedEntity = null;
  entities.forEach(entity => {
    const { blockKey, start, end } = entity;
    if (
      blockKey === startKey &&
      ((startOffset > start && startOffset < end) ||
        (endOffset > start && endOffset < end) ||
        (startOffset === start && endOffset === end))
    ) {
      selectedEntity = entity;
    }
  });
  return selectedEntity;
}

export function findEntities(entityType, contentBlock, callback, contentState) {
  return contentBlock.findEntityRanges(
    character => entityFilter(character, entityType, contentState),
    callback,
  );
}

function entityFilter(character, entityType, contentState) {
  const entityKey = getEntity(character);
  return (
    entityKey !== null &&
    contentState.getEntity(entityKey).getType() === entityType
  );
}

function getEntity(character) {
  return character.getEntity();
}

export function getEntities(
  editorState,
  entityType = null,
  selectedEntityKey = null,
) {
  const { contentState } = getEditorData(editorState);
  const entities = [];
  contentState.getBlocksAsArray().forEach(block => {
    let selectedEntity = null;
    block.findEntityRanges(
      character => {
        const entityKey = character.getEntity();
        if (entityKey !== null) {
          const entity = contentState.getEntity(entityKey);
          if (!entityType || (entityType && entity.getType() === entityType)) {
            if (
              selectedEntityKey === null ||
              (selectedEntityKey !== null && entityKey === selectedEntityKey)
            ) {
              selectedEntity = {
                entityKey,
                blockKey: block.getKey(),
                entity: contentState.getEntity(entityKey),
              };
              return true;
            } else {
              return false;
            }
          }
        }
        return false;
      },
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      },
    );
  });
  return entities;
}

export function getEntitiesByBlockKey(
  editorState,
  entityType = null,
  blockKey = null,
) {
  return getEntities(editorState, entityType).filter(
    entity => entity.blockKey === blockKey,
  );
}
