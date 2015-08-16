(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.berichten', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {


      // --[ fetch bericht ]------------------------------------------------------
      $http
      .get(config.api.url + 'berichten?' + jQuery.param({ 'page[size]': 10 }), { cache: true })
      .then(function(result){

        $scope.addLog('HTTP Get berichten');
        $scope.berichten = result.data.data;
        $scope.storeData('berichten', $scope.berichten);

        var bericht = findBericht($state.params.id, $scope.berichten);

        console.log(bericht);

        $scope.bericht = fixBericht(bericht);

        $rootScope.title = bericht.title;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));


      if ($scope.getData('berichten')) {
        console.log('joe!');
      } else {
        console.log('no');
      }


      // Clean up 'bericht'..
      function fixBericht(bericht) {

        // Larger image..
        bericht.image.thumbnail = bericht.image.thumbnail.replace('240x180', '752x564');

        // Replace '/files/' for a thumbnail.

        bericht.body = bericht.body.replace(/\/files\//g, 'http://www.intothegreatwideopen.nl/thumbs/576x576r/');

        // console.log(bericht.body);

        return bericht;

      }


      function findBericht(id, berichten) {

        var i=0;

        for (i=0; i < berichten.length; i++) {
          console.log(berichten[i].id);
          if (berichten[i].id == id) {
            berichten[i].attributes.id = id;
            return berichten[i].attributes;
          }
        }

      }


    }
  ]);

})();
