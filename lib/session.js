// Generated by CoffeeScript 1.7.1
(function() {
  var EventEmitter, MediaControls, Session, assignMetadata,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('./event_emitter');

  MediaControls = require('./media-controls');

  Session = (function(_super) {
    __extends(Session, _super);

    function Session(session, castAway) {
      this.session = session;
      this.castAway = castAway;
      if (!this.castAway.cast) {
        throw "CastAway instance not found";
      }
      this.cast = this.castAway.cast;
      this.namespace = this.castAway.namespace || "urn:x-cast:json";
      if (this.session.media[0]) {
        this.session.media[0].addUpdateListener((function(_this) {
          return function() {
            return _this.sessionUpdateListener();
          };
        })(this));
      }
    }

    Session.prototype.displayName = function() {
      return this.session.displayName;
    };

    Session.prototype.receiverName = function() {
      return this.session.receiver.friendlyName;
    };

    Session.prototype.send = function(name, payload, cb) {
      var data, onError, onSuccess;
      if (payload == null) {
        payload = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      onSuccess = function(data) {
        return cb(null, data);
      };
      onError = function(err) {
        return cb(err);
      };
      data = JSON.stringify({
        _name: name,
        _payload: payload
      });
      return this.session.sendMessage(this.namespace, data, onSuccess, onError);
    };

    Session.prototype.load = function(mediaInfo, cb) {
      var onError, onSuccess, request;
      if (cb == null) {
        cb = function() {};
      }
      request = new chrome.cast.media.LoadRequest(mediaInfo);
      onSuccess = (function(_this) {
        return function(media) {
          var controls;
          media.addUpdateListener(function() {
            return _this.sessionUpdateListener();
          });
          controls = new MediaControls(media, _this.castAway);
          return cb(null, controls);
        };
      })(this);
      onError = function(err) {
        return cb(err);
      };
      return this.session.loadMedia(request, onSuccess, onError);
    };

    Session.prototype.sessionUpdateListener = function() {
      var event, media;
      media = this.session.media[0];
      event = (function() {
        switch (media.playerState) {
          case 'PLAYING':
            return 'play';
          case 'PAUSED':
            return 'pause';
          case 'STOPPED':
            return 'stop';
          case 'SEEKING':
            return 'seek';
          case 'ERROR':
            return 'error';
          case 'IDLE':
            return 'idle';
          case 'LOADING':
            return 'load';
        }
      })();
      return this.emit(event);
    };

    Session.prototype.music = function(config, cb) {
      var mediaInfo, metadata;
      if (config == null) {
        config = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!config.url) {
        throw "Url required for music";
      }
      if (!config.contentType) {
        throw "Content-type required for music";
      }
      mediaInfo = new chrome.cast.media.MediaInfo(config.url, config.contentType);
      metadata = new chrome.cast.media.MusicTrackMediaMetadata();
      metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
      mediaInfo.metadata = assignMetadata(metadata, config);
      return this.load(mediaInfo, cb);
    };

    Session.prototype.tvShow = function(config, cb) {
      var mediaInfo, metadata;
      if (config == null) {
        config = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!config.url) {
        throw "Url required for tv show";
      }
      if (!config.contentType) {
        throw "Content-type required for tv show";
      }
      mediaInfo = new chrome.cast.media.MediaInfo(config.url, config.contentType);
      metadata = new chrome.cast.media.TvShowMediaMetadata();
      metadata.metadataType = chrome.cast.media.MetadataType.TV_SHOW;
      mediaInfo.metadata = assignMetadata(metadata, config);
      return this.load(mediaInfo, cb);
    };

    Session.prototype.movie = function(config, cb) {
      var mediaInfo, metadata;
      if (config == null) {
        config = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!config.url) {
        throw "Url required for movie";
      }
      if (!config.contentType) {
        throw "Content-type required for movie";
      }
      mediaInfo = new chrome.cast.media.MediaInfo(config.url, config.contentType);
      metadata = new chrome.cast.media.MovieMediaMetadata();
      metadata.metadataType = chrome.cast.media.MetadataType.MOVIE;
      mediaInfo.metadata = assignMetadata(metadata, config);
      return this.load(mediaInfo, cb);
    };

    Session.prototype.photo = function(config, cb) {
      var mediaInfo, metadata;
      if (config == null) {
        config = {};
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!config.url) {
        throw "Url required for photo";
      }
      if (!config.contentType) {
        throw "Content-type required for photo";
      }
      mediaInfo = new chrome.cast.media.MediaInfo(config.url, config.contentType);
      metadata = new chrome.cast.media.PhotoMediaMetadata();
      metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
      mediaInfo.metadata = assignMetadata(metadata, config);
      return this.load(mediaInfo, cb);
    };

    Session.prototype.release = function(cb) {
      if (cb == null) {
        cb = function() {};
      }
      if (!this.session) {
        return;
      }
      this.emit('release');
      return this.session.stop((function(data) {
        return cb(null, data);
      }), (function(err) {
        return cb(err);
      }));
    };

    return Session;

  })(EventEmitter);

  assignMetadata = function(metadata, config) {
    var image, key, value;
    for (key in config) {
      value = config[key];
      if (key === 'images') {
        value = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            image = value[_i];
            _results.push(new chrome.cast.Image(image));
          }
          return _results;
        })();
      }
      metadata[key] = value;
    }
    return metadata;
  };

  module.exports = Session;

}).call(this);
