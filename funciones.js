var fs = require('fs')

module.exports = {
    definido: function (e) {
        return e !== undefined && e !== '' && e !== null;
    }
}