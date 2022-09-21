const remote = require('electron').remote;
window.electron = {
    dialog: remote.dialog
};
