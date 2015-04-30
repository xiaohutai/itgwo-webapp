(function() {
    'use strict';

    angular.module('application').controller('EntriesController',
        [
            '$http', '$scope', '$stateParams', '$controller',
            function ($http, $scope, $stateParams, $controller)
            {

                angular.extend(this, $controller(
                    'DefaultController',
                    { $http: $http, $scope: $scope, $stateParams: $stateParams}
                    ));

                $scope.loadEntries = function() {
                    $http
                    .get("http://www.intothegreatwideopen.nl/json/berichten")
                    .then(function(result){
                        $scope.entries = result.data.entries;
                    }).catch(function(e) {
                        console.log("Could not fetch Entries");
                        console.log(e);
                    });

                };


                if (!$scope.entries) {
                    $scope.loadEntries($scope, $http);
                }

            }
        ]
    );



})();