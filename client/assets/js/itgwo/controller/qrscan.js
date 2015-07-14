(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.controller('itgwo.controller.qrscan', [
    '$scope', '$controller', '$state','$http', '$rootScope', 'config', 'itgwo.service.notification',
    function ($scope, $controller, $state, $http, $rootScope, config, itgwoServiceNotification) {

      // // --[ fetch onderwerpen ]------------------------------------------------
      // $http
      // .get(config.api.url + 'onderwerpen?' + jQuery.param({ 'filter[themas]': $state.params.id }), { cache: true })
      // .then(function(result){
      //   $scope.onderwerpen = result.data.data;
      // })
      // .catch(function(e) {
      //   itgwoServiceNotification.notification(e.data);
      // });

      // // --[ fetch thema ]------------------------------------------------------
      // $http
      // .get(config.api.url + 'themas/' + $state.params.id, { cache: true })
      // .then(function(result){
      //   $scope.thema = result.data.data;
      //   $rootScope.title = result.data.data.attributes.title;
      // })
      // .catch(function(e) {
      //   itgwoServiceNotification.notification(e.data);
      // });

      // // --[ extend base controller ]-------------------------------------------
      // angular.extend(this, $controller('itgwo.controller.base', { $scope: $scope }));

      $scope.counter = 0;

      $scope.myClick = function() {
          $scope.counter++;
          $scope.name = 'ctrl' + $scope.counter;
      };

      $scope.scan = function() {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) {

            alert("We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);

           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
        } );
      }



    }
  ]);

})();


