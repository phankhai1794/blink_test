import {
  Tooltip,
} from '@material-ui/core';
import React from 'react';

export const TrashIcon = ({ onDelete }) =>
  <Tooltip title="Delete">
    <div style={{ marginLeft: '10px' }} onClick={onDelete}>
      <img
        style={{ height: '22px', cursor: 'pointer' }}
        src="/assets/images/icons/trash.svg"
      />
    </div>
  </Tooltip>
