/* global document, ga */
var size = 64;
var host = '/emojis';
var _ = require('underscore');
_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};
var Emoji = require('../lib/emoji');
var domready = require('domready');
var share = require('../lib/share');
var addEvent = require('../lib/event');
var attachFastClick = require('fastclick');
var shareTextTmpl =  _.template('My emoji fortune is {{ characters }} ({{ text }}) —');
var $ = function (id) { return document.querySelector('#' + id); };
var ondeck = null;


function preload(images) {
    _.each(images, function(src) {
        (new Image()).src = src;
    });
}

function getEmoji() {
    var emoji = Emoji.fortune(3, host, size);
    preload(_.pluck(emoji, 'imgsrc'));
    var names = _.pluck(emoji, 'name');
    var text = names.join(' ').replace(/_/g, ' ');
    var characters = _.pluck(emoji, 'character').join(' ');
    var shareText = shareTextTmpl({text: text, characters: characters});
    return {
        images: '<span>' + _.pluck(emoji, 'image').join('') + '</span>',
        share: share(shareText),
        text: text
    };
}

function setDom(opts) {
    $('fortune').innerHTML = opts.images;
    $('copy').setAttribute('data-text', opts.share.copy);
    $('fortuneText').innerHTML = opts.text;
    $('tweetButton').setAttribute('href', opts.share.twitter);
}

function copyit() {
    window.prompt('Copy to clipboard: Ctrl+C, Enter', this.getAttribute('data-text'));
}

function doit() {
    setDom(ondeck ? ondeck : getEmoji());
    ondeck = getEmoji();
}

function trackit () {
    doit();
    ga('send', 'pageview');
}

domready(function () {
    attachFastClick(document.body);
    doit();
    addEvent($('refresh'), 'click', trackit);
    addEvent($('copy'), 'click', copyit);
});
