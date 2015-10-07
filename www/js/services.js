angular.module('songhop.services', [])
  .factory('User', function(){

    var o = {
      favorites: []
    };

    o.addSongToFavorites = function(song){
      // make sure there's a song to add
      if (!song) return false;

      // add to favorites array
      o.favorites.unshift(song);
    }

    o.removeSongFromFavorites = function(song, index){
      //make sure there's a song to remove
      if (!song) return false;

      // remove from favorites array
      o.favorites.splice(index, 1);
    }

    return o;
  })
  .factory('Recommendations', function($http, $q, SERVER) {
    var media;
    var o = {
      queue: []
    };



    o.playCurrentSong = function() {
      var defer = $q.defer();

      media = new Audio(o.queue[0].preview_url);

      media.addEventListener('loadeddata', function(){
        defer.resolve();
      });

      media.play();

      return defer.promise;
    }

    o.haltAudio = function(){
      if (media) media.pause();
    }

    o.getNextSongs = function() {
      return $http({
        method: 'GET',
        url: SERVER.url + '/recommendations'
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
  });
