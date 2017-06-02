'use strict';

const protocol = {
  PROTOCOL: 'toto3k'
};
protocol['PROTOCOL_WITH_SLASHES'] = protocol.PROTOCOL + '://';

export default {
  events: {
    FILES_SCANNED: 'files-scanned',
    FOLDER_CHANGED: 'folder-changed'
  },
  protocol: protocol
};
