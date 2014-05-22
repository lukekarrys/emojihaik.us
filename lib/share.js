var detect = require('zepto-detect');

module.exports = function (text) {
    var twitter;
    var copy = text + '\n\n' + window.location.href;

    if (detect.os.ios) {
        twitter = 'twitter://post?message=' + encodeURIComponent(copy);
    } else {
        twitter = 'https://twitter.com/share?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(text + '\n\n');
    }

    return {
        twitter: twitter,
        copy: copy
    };
};
