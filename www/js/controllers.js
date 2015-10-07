angular.module('songhop.controllers', ['ionic', 'songhop.services'])

/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
  // get our first songs
  Recommendations.init()
    .then(function() {
      $scope.currentSong = Recommendations.queue[0];
      Recommendations.playCurrentSong();
    });

  $scope.sendFeedback = function(bool){
   // first add to favrorites if they favorited
   if (bool) User.addSongToFavorites($scope.currentSong);

   $scope.currentSong.rated = bool;
   $scope.currentSong.hide = true;

   // prepare the next song
   Recommendations.nextSong();

   $timeout(function() {
    //  var randomSong = Math.round(Math.random() * ($scope.songs.length-1));
    //  $scope.currentSong = angular.copy($scope.songs[randomSong]);
    $scope.currentSong = Recommendations.queue[0];
   }, 250);

   Recommendations.playCurrentSong();
  };

  // used for retrieving the next album image.
  // if there isn't an album image available next, return empty string.
  $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }
    return '';
  };

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
  // get the list of our favorites from the user service
  $scope.favorites = User.favorites;

  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  };
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations) {
  $scope.enteringFavorites = function() {
    Recommendations.haltAudio();
  };

  $scope.leavingFavorites = function() {
    Recommendations.init();
  };
});
