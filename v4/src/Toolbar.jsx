import React from 'react';
import Tooltip from './Tooltip';
import Tippy, { useSingleton } from '@tippyjs/react';

import {
  STORAGE_TYPES, NTYPE, TOOL_TYPES, IMPORT_TYPES,
} from './types';

export default function Toolbar({ tool, openAddNode, openEditNode, mergeNode, connectNode, deleteNode, toggleTool, downloadGraph }) {
  const [source, target] = useSingleton({
    disabled: tool !== null
  });
  return (
    <div className="toolbar">
      <Tippy singleton={source} placement="right" />
      { /* eslint-disable-next-line */}
      <div className="birb" onClick={() => { document.querySelector('.birb').innerHTML = '🗿' }}>
        <span role="img" aria-label="bird">🐦</span>
        <span role="img" aria-label="bird">🐦</span>
      </div>
      <Tippy singleton={target} content={<Tooltip title="Hello" desc="ADd a node" />} >
        <button className={tool === TOOL_TYPES.ADD ? 'tool active' : 'tool'} type="button" onClick={() => openAddNode()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
      </Tippy>
      <Tippy singleton={target} content={<Tooltip title="Edit node" desc="Edwits da noad" />} >
        <button className={tool === TOOL_TYPES.EDIT ? 'tool active' : 'tool'} type="button" onClick={() => openEditNode()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.1346 5.62957C20.5138 6.01957 20.5138 6.64957 20.1346 7.03957L18.3554 8.86957L14.7096 5.11957L16.4888 3.28957C16.8679 2.89957 17.4804 2.89957 17.8596 3.28957L20.1346 5.62957ZM2.9165 20.9995V17.2495L13.6693 6.18953L17.3151 9.93953L6.56234 20.9995H2.9165Z" />
          </svg>
        </button>
      </Tippy>
      <Tippy singleton={target} content={<Tooltip title="Merge node" desc="Poots da node toguther wit another nowd" />} >
        <button className={tool === TOOL_TYPES.MERGE ? 'tool active' : 'tool'} type="button" onClick={() => mergeNode()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.75022 20C13.0474 20 16.528 16.42 16.528 12C16.528 7.58 13.0474 4.00001 8.75022 4.00001C4.453 4.00001 0.972446 7.58001 0.972447 12C0.972448 16.42 4.453 20 8.75022 20ZM8.75013 5.99998C11.9682 5.99998 14.5835 8.68998 14.5835 12C14.5835 15.31 11.9682 18 8.75013 18C5.53208 18 2.9168 15.31 2.9168 12C2.9168 8.68998 5.53208 5.99998 8.75013 5.99998ZM16.528 17.6501C18.7933 16.8301 20.4169 14.6101 20.4169 12.0001C20.4169 9.3901 18.7933 7.1701 16.528 6.3501L16.528 4.26011C19.8822 5.1501 22.3613 8.2701 22.3613 12.0001C22.3613 15.7301 19.8822 18.8501 16.528 19.7401L16.528 17.6501Z" />
          </svg>
        </button>
      </Tippy>
      <Tippy singleton={target} content={<Tooltip title="Connect" desc="Draw da line" />}>
        <button className={tool === TOOL_TYPES.CONNECT ? 'tool active' : 'tool'} type="button">
          <svg width="24" height="24" viewBox="0 0 40 40" fill="currentColor" onClick={() => connectNode()}>
            <path d="M29.9987 7.5L23.332 14.1667H28.332V25.8333C28.332 27.6667 26.832 29.1667 24.9987 29.1667C23.1654 29.1667 21.6654 27.6667 21.6654 25.8333V14.1667C21.6654 10.4833 18.682 7.5 14.9987 7.5C11.3154 7.5 8.33203 10.4833 8.33203 14.1667V25.8333H3.33203L9.9987 32.5L16.6654 25.8333H11.6654V14.1667C11.6654 12.3333 13.1654 10.8333 14.9987 10.8333C16.832 10.8333 18.332 12.3333 18.332 14.1667V25.8333C18.332 29.5167 21.3154 32.5 24.9987 32.5C28.682 32.5 31.6654 29.5167 31.6654 25.8333V14.1667H36.6654L29.9987 7.5Z" />
          </svg>
        </button>
      </Tippy>
      <Tippy singleton={target} content={<Tooltip title="" desc="" />} >
        <button className={tool === TOOL_TYPES.DELETE ? 'tool active' : 'tool'} type="button" onClick={() => deleteNode()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" />
          </svg>
        </button>
      </Tippy>
      <Tippy singleton={target} placement="right" content={<Tooltip />} >
        <button className={tool === TOOL_TYPES.IMPORT ? 'tool active' : 'tool'} type="button" onClick={() => toggleTool(TOOL_TYPES.IMPORT, true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5V3H20V5H4ZM11 11H8L12 7L16 11H13V21H11V11Z" />
          </svg>
        </button>
      </Tippy>
      <Tippy singleton={target} content={<Tooltip />} >
        <button className="tool" type="button" onClick={() => downloadGraph()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 13H16L12 17L8 13H11V3H13V13ZM4 21V19H20V21H4Z" />
          </svg>
        </button>
      </Tippy>
      <div className="toolbar-bottom">
        <Tippy placement="right" content={<Tooltip />} >
          <button className={tool === TOOL_TYPES.OPEN ? 'tool active' : 'tool'} type="button" onClick={() => toggleTool(TOOL_TYPES.OPEN, true)}>
            <svg width="24" height="24" viewBox="0 0 36 36" fill="currentColor">
              <path d="M15 6H6C4.35 6 3.015 7.35 3.015 9L3 27C3 28.65 4.35 30 6 30H30C31.65 30 33 28.65 33 27V12C33 10.35 31.65 9 30 9H18L15 6Z" />
            </svg>
          </button>
        </Tippy>
        <Tippy placement="right" content={<Tooltip />} >
          <button className="tool" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.10999 4 6.59998 5.64 5.34998 8.04C2.34003 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.78998 18 2 16.21 2 14C2 11.95 3.53003 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08002 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18ZM10.55 13H8L12 9L16 13H13.45V16H10.55V13Z" />
            </svg>
          </button>
        </Tippy>
      </div>
    </div>);
}