angular.module('application').controller('ProgrammaController',
    [
        '$http', '$scope', '$stateParams', '$controller',
        function ($http, $scope, $stateParams, $controller)
        {

            angular.extend(this, $controller(
                'DefaultController',
                { $http: $http, $scope: $scope, $stateParams: $stateParams}
                ));

            $scope.loadProgramma = function() {
                console.log('load programma');

                $http.get("http://programma.greatwideopen.nl/json/speeltijden")
                    .then(function(result){
                        $scope.speeltijden = result.data.speeltijden;
                    }).catch(function(e) {
                        console.log("Could not fetch programma");
                        console.log(e);
                    });

            };

            if (!$stateParams.id && !$scope.speeltijden) {
                $scope.loadProgramma();
            }

            // Als we op een specifiek programma-item zijn.
            if ($stateParams.id) {

                $http.get("http://programma.greatwideopen.nl/json/speeltijden/" + $stateParams.id)
                    .then(function(result){
                        console.log('load item', $stateParams.id);
                        $scope.bericht = result.data;

                    }).catch(function(e) {
                        console.log("Could not fetch entry " + $stateParams.id );
                        console.log(e);
                    });

            }


        }
    ]
);


