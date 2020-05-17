'use_strict';

const path = require('path');

/**
 * @param {string} filename
 * @return {string} - filename + extension
 */
exports.addExtension = filename => {

    let ext = path.extname(filename || '').split('.');
    ext = ext[ext.length - 1];

    if (ext !== 'yaml' || ext !== 'yml') {
        filename += '.yml';
    }

    return filename;

}
