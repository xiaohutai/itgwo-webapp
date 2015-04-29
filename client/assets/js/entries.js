(function() {
  'use strict';

  angular.module('application').controller('EntriesController',
    [ '$http', '$scope', '$stateParams', '$controller',
    function ($http, $scope, $stateParams, $controller)
    {

    angular.extend(this, $controller(
        'DefaultController',
        { $http: $http, $scope: $scope, $stateParams: $stateParams}
        ));

    $scope.loadData = function() {
      $http
          .get("http://bob.biz.tm/json/entries")
          .then(function(result){
            $scope.entries = result.data.entries;
          }).catch(function(e) {
            console.log(e);
          });

        };

    if (!$scope.entries) {
      $scope.loadData();
    }

  }]);



})();