(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.programma', [
    '$scope', '$sce', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification', 'itgwo.service.localstorage',
    function ($scope, $sce, $controller, $state, $http, $rootScope, config, itgwoServiceNotification, itgwoServiceLocalstorage) {

      $scope.filter = "vr";

      if ($state.params.id) {

        // --[ fetch single programma ]-----------------------------------------
        $http
        .get(config.api.url + 'programmaonderdelen/' + $state.params.id, { cache: true })
        .then(function(result){
          $scope.onderdeel = result.data.data.attributes;
          // Larger image..
          $scope.onderdeel.image.thumbnail = $scope.onderdeel.image.thumbnail.replace('240x180', '752x564');

          if ($scope.onderdeel.video.url) {
            // NO: https://www.youtube.com/watch?v=bIYNs2Gq8Vw
            // OK: https://www.youtube-nocookie.com/embed/bIYNs2Gq8Vw

            // $scope.onderdeel.video.url = $scope.onderdeel.video.url.replace('//cdn.embedly.com', 'https://cdn.embedly.com');
            $scope.onderdeel.video.url = $scope.onderdeel.video.url.replace('www.youtube.com', 'www.youtube-nocookie.com');
            $scope.onderdeel.video.url = $scope.onderdeel.video.url.replace('/watch?v=', '/embed/');
          }

          $rootScope.title = result.data.data.attributes.name;
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      } else {

        // --[ fetch programmas ]-----------------------------------------------

        // update bolt_speeltijden AS s SET s.image = (select p.image from bolt_programmaonderdelen as p where p.id = s.programmaonderdelen)

        $http
        .get(config.api.url + 'speeltijden?' + jQuery.param({ 'page[size]': 1000, 'sort': 'title' }), { cache: true })
        .then(function(result){
          itgwoServiceLocalstorage.addLog('HTTP Get speeltijden');
          $scope.speeltijden = result.data.data;
          itgwoServiceLocalstorage.storeData('speeltijden', $scope.speeltijden);
        })
        .catch(function(e) {
          itgwoServiceNotification.notification(e.data);
        });

      }

      $scope.onderdeelVideo = function() {
        var res = '<iframe width="854" height="480" scrolling="no" frameborder="0" allowfullscreen src="' + $scope.onderdeel.video.url + '"></iframe>';
        return $sce.trustAsHtml(res);
      };

      $scope.onderdeelEmbed = function() {
        return $sce.trustAsHtml($scope.onderdeel.embed);
      };

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      // Haal de versie uit localstorage op.
      $scope.berichten = itgwoServiceLocalstorage.getData('speeltijden');

    }

  ]);

})();
