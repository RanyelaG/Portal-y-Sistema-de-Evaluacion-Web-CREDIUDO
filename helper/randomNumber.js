var randomAlphanumeric = function(length) {
    var str = '';
    var chars ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(
        '');
    var charsLen = chars.length;
    if (!length) {
      length = ~~(Math.random() * charsLen);
    }
    for (var i = 0; i < length; i++) {
      str += chars[~~(Math.random() * charsLen)];
    }
    return str;
  };
  module.exports = randomAlphanumeric;
  