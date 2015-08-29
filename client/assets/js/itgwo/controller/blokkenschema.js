(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.blokkenschema', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));


      // Toon het blokkenschema

      localforage.getItem('favs').then(function(favs) {
        if (favs == null) {
          favs = [];
        }
        timetable.init(config, favs);
      });


    }
  ]);

})();
