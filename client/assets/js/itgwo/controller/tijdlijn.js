(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.tijdlijn', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // todo: itgwo.controller.timeline query parameters as array
      // $scope.type = 'anekdotes'; // ?sort=timelineposition

      // $rootScope.timeline = true; // doesn't get set to false.
      $rootScope.title = $state.current.data.vars.title;

      // --[ fetch anekdotes ]--------------------------------------------------

      $http
      .get(config.api.url + 'anekdotes?' + jQuery.param({ 'sort': 'timelineposition' }), { cache: true })
      .then(function(result){
        $scope.anekdotes = result.data.data;
      })
      .catch(function(e) {
        itgwoServiceNotification.notification(e.data);
      });

      // --[ extend base controller ]-------------------------------------------
      angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

    }
  ]);

  itgwo.directive('tijlijnScroll', ['$document', function($document){
    return {
      restrict: 'A',
      link: function (scope, elm, attrs) {
        elm.bind("click", function () {

          var anekdotes = jQuery('.anekdote');
          var container = jQuery(anekdotes[0]).parent().parent();

          anekdotes = anekdotes.filter(function(index) {
            var position = $(this).data('position');
            return attrs.from <= position && position <= attrs.to;
          });

          var scrollTo = 0;

          if (anekdotes.length >= 1) {
            var anekdote = jQuery(anekdotes[0]);
            console.log(anekdote.offset().top);
            scrollTo = anekdote.offset().top + container.scrollTop()
          }

          container.animate({
            scrollTop: scrollTo
          }, 150);

        });

      }
    };
  }]);

})();
