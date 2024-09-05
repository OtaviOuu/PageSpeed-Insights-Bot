const path = require('path');

const dir = path.join(__dirname, '..', 'relatorios');

function sanitizeUrl(url) {
    return path.join(dir, url
        .replace('https://', '')
        .replace(/\./gi, '_')
        .replace(/\//gi, '_') + '.png');
}

module.exports = sanitizeUrl;