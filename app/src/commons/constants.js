'use strict';

const protocol = {
  PROTOCOL: 'toto3k'
};
protocol['PROTOCOL_WITH_SLASHES'] = protocol.PROTOCOL + '://';

export default {
  events: {
    FILES_SCANNED: 'files-scanned',
    FOLDER_CHANGED: 'folder-changed',
    FILE_TO_PLAY: 'file-to-play',
    FILE_SELECTED: 'file-selected'
  },
  protocol: protocol
};
