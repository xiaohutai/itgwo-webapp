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

                $http.get("http://programma.greatwideopen.nl/json/speeltijden?sort=title&page[size]=10")
                    .then(function(result){
                        // $scope.speeltijden = result.data.speeltijden;
                        console.log(result);
                    }).catch(function(e) {
                        console.log("Could not fetch programma");
                        console.log(e);
                    });

            };

            if (!$stateParams.id && !$scope.speeltijden) {
                $scope.loadProgramma();
            }

            // Als we op een specifiek programma-item zijn.
            if ($stateParams.slug) {

                $http.get("http://programma.greatwideopen.nl/json/programmaonderdelen/" + $stateParams.slug)
                    .then(function(result){
                        console.log('load item', $stateParams.slug);
                        $scope.act = result.data;
                        console.log($scope.act);
                    }).catch(function(e) {
                        console.log("Could not fetch entry " + $stateParams.slug );
                        console.log(e);
                    });

            }


        }
    ]
);


