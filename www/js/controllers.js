angular.module('songhop.controllers', ['ionic', 'songhop.services'])

/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {
  var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  showLoading();

  // get our first songs
  Recommendations.init()
    .then(function() {
      $scope.currentSong = Recommendations.queue[0];
      Recommendations.playCurrentSong();
    })
    .then(function() {
      hideLoading();
      $scope.currentSong.loaded = true;
    });

  $scope.sendFeedback = function(bool){
   // first add to favrorites if they favorited
   if (bool) User.addSongToFavorites($scope.currentSong);

   $scope.currentSong.rated = bool;
   $scope.currentSong.hide = true;

   // prepare the next song
   Recommendations.nextSong();

   $timeout(function() {
    $scope.currentSong = Recommendations.queue[0];
    $scope.currentSong.loaded = false;
   }, 250);

   Recommendations.playCurrentSong().then(function() {
     $scope.currentSong.loaded = true;
   });
  };

  // used for retrieving the next album image.
  // if there isn't an album image available next, return empty string.
  $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].artwork_url;
    }
    return '';
  };

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $window, User, Play) {
  // get the list of our favorites from the user service
  $scope.favorites = User.favorites;
  $scope.media;

  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  };

  $scope.openSong = function(song) {
    // $window.open(song.open_url, "_system");
    Play.playSong(song);
  };
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations) {
  $scope.enteringFavorites = function() {
    Recommendations.haltAudio();
    User.newFavorites = 0;
  };

  $scope.leavingFavorites = function() {
    Recommendations.init();
  };

  $scope.favCount = User.favoriteCount;
});
