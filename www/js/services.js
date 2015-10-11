angular.module('songhop.services', [])
  .factory('User', function(){

    var o = {
      favorites: [],
      newFavorites: 0
    };

    o.addSongToFavorites = function(song){
      // make sure there's a song to add
      if (!song) return false;

      // add to favorites array
      o.favorites.unshift(song);
      o.newFavorites++;
    }

    o.favoriteCount = function() {
      return o.newFavorites;
    }

    o.removeSongFromFavorites = function(song, index){
      //make sure there's a song to remove
      if (!song) return false;

      // remove from favorites array
      o.favorites.splice(index, 1);
    }

    return o;
  })
  .factory('Recommendations', function($http, $q, SERVER, Play) {
    var o = {
      queue: []
    };

    o.init = function() {
      if (o.queue.length == 0) {
        return o.getNextSongs();
      } else {
        return o.playCurrentSong();
      }
    }

    o.playCurrentSong = function() {

      return Play.playSong(o.queue[0]);
    }

    o.haltAudio = function(){
      Play.pauseSong();
    }

    o.getNextSongs = function() {
      return $http({
        method: 'GET',
        // url: SERVER.url + '/recommendations'
        url: 'https://api.soundcloud.com/users/97314807/tracks?client_id=1ed7c8c3ff1c4d3e7ecc37858611ac81'
      }).success(function(data){
        // merge data into the queue
        o.queue = o.queue.concat(data);
      });
    }

    o.nextSong = function() {
      // pop the index 0 off
      o.queue.shift();

      o.haltAudio();

      // low on the queue? lets fill it up
      if (o.queue.length <= 3) {
        o.getNextSongs();
      }
    }

    return o;
  })
  .factory('Play', function($http, $q, SERVER) {
    var media;
    var o = {};

    o.playSong = function(thisSong) {
      // o.pauseSong();
      var defer = $q.defer();

      $http({
        method: 'GET',
        url: 'https://api.soundcloud.com/i1/tracks/' + thisSong.id + '/streams?client_id=' + SERVER.scid
      }).success(function(data){
        // merge data into the queue
        media = new Audio(data.http_mp3_128_url);

        media.addEventListener('loadeddata', function(){
          defer.resolve();
        });

        media.play();
      });
      console.log('playing the song');
      return defer.promise;
    }

    o.pauseSong = function(){
      console.log('pausing the song');
      if (media) media.pause();
    }

    return o;
  });
