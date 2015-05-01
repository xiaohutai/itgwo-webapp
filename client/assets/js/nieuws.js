angular.module('application').controller('NewsController',
    [
        '$http', '$scope', '$stateParams', '$controller',
        function ($http, $scope, $stateParams, $controller)
        {

            angular.extend(this, $controller(
                'DefaultController',
                { $http: $http, $scope: $scope, $stateParams: $stateParams}
                ));

            $scope.loadBerichten = function() {
                console.log('load berichten');

                $http.get("http://www.intothegreatwideopen.nl/json/berichten")
                    .then(function(result){

                        $scope.berichten = result.data.berichten;
                    }).catch(function(e) {
                        console.log("Could not fetch berichten");
                        console.log(e);
                    });

            };

            if (!$stateParams.id && !$scope.berichten) {
                $scope.loadBerichten();
            }

            // Als we op een specifiek nieuwsbericht zijn.
            if ($stateParams.id) {

                $http.get("http://www.intothegreatwideopen.nl/json/berichten/" + $stateParams.id)
                    .then(function(result){
                        console.log('load bericht', $stateParams.id);
                        $scope.bericht = result.data;

                    }).catch(function(e) {
                        console.log("Could not fetch entry " + $stateParams.id );
                        console.log(e);
                    });

            }


        }
    ]
);


