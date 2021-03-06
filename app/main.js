/* global document */
var size = 64
var host = '/emojis'
var _ = require('underscore')
_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g}
var Emoji = require('random-emoji')
var domready = require('domready')
var share = require('../lib/share')
var addEvent = require('../lib/event')
var attachFastClick = require('fastclick')
var shareTextTmpl = _.template('{{ text }}\n\n{{ characters }}')
var $ = function (id) { return document.querySelector('#' + id) }
var ondeck = null

function preload (images) {
  _.each(images, function (src) {
    (new window.Image()).src = src
  })
}

function byLine (lines, prop) {
  return _.map(lines, function (line) {
    return _.map(line, function (emoji) {
      return typeof prop === 'string' ? emoji[prop] : prop(emoji)
    })
  })
}

function joinAndReplace (join, find, fn) {
  return function (item) {
    item = item.join(join)
    if (find) {
      item = item.replace(find, join)
    }
    if (fn) {
      item = fn(item)
    }
    return item
  }
}

function sentenceCase (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getEmoji () {
  var haiku = Emoji.haiku({
    host: host,
    height: size
  })

  preload(_.pluck(_.flatten(haiku, true), 'imageSrc'))

  var text = byLine(haiku, 'name').map(joinAndReplace(' ', /_/g, sentenceCase))
  var images = byLine(haiku, function (emoji) {
    var url = 'http://emojipedia.org/' + emoji.character
    return '<a href="' + url + '" target="_blank">' + emoji.image + '</a>'
  })
  .map(joinAndReplace(''))
  .join('</span><br><span>')
  var characters = byLine(haiku, 'character').map(joinAndReplace(' ')).join('\n')
  var shareText = shareTextTmpl({text: text.join('\n'), characters: characters})
  return {
    images: '<span>' + images + '</span>',
    share: share(shareText),
    text: text.join('<br>')
  }
}

function setDom (opts) {
  $('haiku').innerHTML = opts.images
  $('copy').setAttribute('data-text', encodeURIComponent(opts.share.copy))
  $('haikuText').innerHTML = opts.text
  $('tweetButton').setAttribute('href', opts.share.twitter)
}

function copyit () {
  window.prompt('Copy to clipboard: Ctrl+C, Enter', decodeURIComponent(this.getAttribute('data-text')))
}

function doit () {
  setDom(ondeck || getEmoji())
  ondeck = getEmoji()
}

domready(function () {
  attachFastClick(document.body)
  doit()
  addEvent($('refresh'), 'click', doit)
  addEvent($('copy'), 'click', copyit)
})
