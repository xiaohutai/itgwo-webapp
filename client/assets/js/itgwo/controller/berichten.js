(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.berichten', [
    '$scope', '$sce', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification', 'itgwo.service.localstorage',
    function ($scope, $sce, $controller, $state, $http, $rootScope, config, itgwoServiceNotification, itgwoServiceLocalstorage) {

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));


      localforage.getItem('berichten').then(function(berichten) {
        if (berichten == null) {
          fetchRemoteBericht();
        } else {
          getCachedBericht(berichten);
        }
      });

      // Haal een bericht op uit de cache.
      function getCachedBericht(berichten) {
        $scope.berichten = berichten;

        var bericht = findBericht($state.params.id, $scope.berichten);
        $scope.bericht = fixBericht(bericht);
        $rootScope.title = bericht.title;
        $scope.$apply();
      }

      // Haal een bericht op, als we 'm nog niet in de cache hebben.
      function fetchRemoteBericht() {

        $http
        .get(config.api.url + 'berichten?' + jQuery.param({ 'page[size]': 10 }), { cache: true })
        .then(function(result){

          $scope.berichten = result.data.data;
          localforage.setItem('berichten', $scope.berichten).then(function(value){
            console.log('localForage set berichten:', value.length);
            localforage.setItem('berichten_timestamp', new Date());
          });

          var bericht = findBericht($state.params.id, $scope.berichten);
          $scope.bericht = fixBericht(bericht);
          $rootScope.title = bericht.title;
        });

      }

      // Clean up 'bericht'..
      function fixBericht(bericht) {

        // Larger image..
        bericht.image.thumbnail = bericht.image.thumbnail.replace('240x240', '752x564');

        // Replace '/files/' for a thumbnail.

        bericht.body = bericht.body.replace(/\/files\//g, 'http://www.intothegreatwideopen.nl/thumbs/576x576r/');
        bericht.body = bericht.body.replace(/\/programmaonderdeel\//g, 'http://www.intothegreatwideopen.nl/programmaonderdeel/');

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

    }
  ]);

})();
