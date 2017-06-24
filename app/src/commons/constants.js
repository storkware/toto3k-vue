'use strict';

const protocol = {
  PROTOCOL: 'toto3k'
};
protocol['PROTOCOL_WITH_SLASHES'] = protocol.PROTOCOL + '://';

export default {
  events: {
    PLAY_FILE: 'play-file',
    PAUSE_FILE: 'pause-file',
    FILES_SCANNED: 'files-scanned',
    FOLDER_CHANGED: 'folder-changed'
  },
  protocol: protocol
};
