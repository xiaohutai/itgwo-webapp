(function() {
  'use strict';

  var itgwo = angular.module('itgwo');

  itgwo.service('itgwo.service.localstorage', [
    'config', '$filter', '$http',
    function (config, $filter, $http) {

      // http://html5demos.com/storage#view-source

      this.storeData = function(key, value) {

        // Stringify the data..
        value = JSON.stringify(value);

        this.addLog("LocalStorage Store " + key);

        localStorage.setItem(key, value);

      }

      this.getData = function(key) {

        if (localStorage.getItem(key)) {
          var value = JSON.parse(localStorage.getItem(key));
          this.addLog("LocalStorage Get HIT " + key);
          return value;
        } else {
          this.addLog("LocalStorage Get MISS " + key);
          return false;
        }

      }


      this.addLog = function(line) {

        var time = Date.create().format('{yy}-{MM}-{dd} {HH}:{mm}:{ss}');
        var line = "[" + time + "] " + line + "\n";

        globalDebugLog += line;

        this.debuglog = globalDebugLog;
        console.log(line);

      }

  }]);

})();
