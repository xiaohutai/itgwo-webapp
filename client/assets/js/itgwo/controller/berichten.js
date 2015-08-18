(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.berichten', [
    '$scope', '$sce', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification', 'itgwo.service.localstorage',
    function ($scope, $sce, $controller, $state, $http, $rootScope, config, itgwoServiceNotification, itgwoServiceLocalstorage) {

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      if (itgwoServiceLocalstorage.getData('berichten')) {
        getCachedBericht();
      } else {
        fetchRemoteBericht();
      }



      // Haal een bericht op uit de cache.
      function getCachedBericht() {
        $scope.berichten = itgwoServiceLocalstorage.getData('berichten');

        var bericht = findBericht($state.params.id, $scope.berichten);
        $scope.bericht = fixBericht(bericht);
        $rootScope.title = bericht.title;
      }

      // Haal een bericht op, als we 'm nog niet in de cache hebben.
      function fetchRemoteBericht() {

        $http
        .get(config.api.url + 'berichten?' + jQuery.param({ 'page[size]': 10 }), { cache: true })
        .then(function(result){

          itgwoServiceLocalstorage.addLog('HTTP Get berichten');
          $scope.berichten = result.data.data;
          itgwoServiceLocalstorage.storeData('berichten', $scope.berichten);

          var bericht = findBericht($state.params.id, $scope.berichten);
          $scope.bericht = fixBericht(bericht);
          $rootScope.title = bericht.title;
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      }

      // Clean up 'bericht'..
      function fixBericht(bericht) {

        // Larger image..
        bericht.image.thumbnail = bericht.image.thumbnail.replace('240x180', '752x564');

        // Replace '/files/' for a thumbnail.

        bericht.body = bericht.body.replace(/\/files\//g, 'http://www.intothegreatwideopen.nl/thumbs/576x576r/');
        bericht.body = bericht.body.replace(/\/programmaonderdeel\//g, 'http://www.intothegreatwideopen.nl/programmaonderdeel/');

        if (bericht.video.url) {
          // NO: https://www.youtube.com/watch?v=bIYNs2Gq8Vw
          // OK: https://www.youtube-nocookie.com/embed/bIYNs2Gq8Vw

          // $scope.onderdeel.video.url = $scope.onderdeel.video.url.replace('//cdn.embedly.com', 'https://cdn.embedly.com');
          bericht.video.url = bericht.video.url.replace('www.youtube.com', 'www.youtube-nocookie.com');
          bericht.video.url = bericht.video.url.replace('/watch?v=', '/embed/');
        }

        console.log(bericht);

        return bericht;

      }

      // Filter een array met "berichten", en geef het bericht met de juiste id terug.
      function findBericht(id, berichten) {

        var i=0;

        for (i=0; i < berichten.length; i++) {
          if (berichten[i].id == id) {
            berichten[i].attributes.id = id;
            return berichten[i].attributes;
          }
        }

      }

      $scope.berichtVideo = function() {
        var res = '<iframe width="854" height="480" scrolling="no" frameborder="0" allowfullscreen src="' + $scope.bericht.video.url + '"></iframe>';
        return $sce.trustAsHtml(res);
      };

      $scope.berichtEmbed = function() {
        return $sce.trustAsHtml($scope.bericht.embed);
      };


    }
  ]);

})();
