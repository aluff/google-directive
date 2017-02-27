angular.module('myApp.mapView', ['ngRoute', 'Google-Maps'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/mapView', {
            templateUrl: 'mapView/mapView.html',
            controller: 'MapViewCtrl'
        });
    }])

    .controller('MapViewCtrl', ['$scope', function($scope) {
        $scope.mapPos = {lat: 32.880951, lng: -117.233827};

        // Map Initial Options
        $scope.center = $scope.mapPos;
        $scope.zoom = 13;
        $scope.mapOpt = {backgroundColor: "black"};

        // Marker Initial Options
        $scope.markerPos = $scope.mapPos;
        $scope.draggable = true;

        // Line Initial Options
        $scope.line = [$scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        // Triangle Initial Options
        $scope.triangle = [$scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        // Rectangle Initial Options
        $scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        // Map New Options
        $scope.newCenter = {lat: 32.880951, lng: -117.250000};
        $scope.newZoom = 9;
        $scope.newOpt = {draggable: false};

        // Marker New Options
        $scope.newMarkerPos = $scope.newCenter;
        $scope.newMarkerIcon = 'http://image.flaticon.com/icons/png/128/91/91484.png';
        $scope.newMarkerOpt = {opacity: 0.5};

        // Polyline New Options
        $scope.newLine = [$scope.mapPos, {lat: 32.886325, lng: -117.239278 }, $scope.newCenter];
        $scope.newShapeOpt = {strokeColor: "red"};

        // Polygon New Options
        $scope.newTriangle = [$scope.mapPos, {lat: 32.877880, lng: -117.237214 }, $scope.newCenter];

        // Rectangle New Options
        $scope.newRectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.239278};

        $scope.changeAttribute = function(elemId, attribute, changeVal){
            var changeElem = document.getElementById(elemId);
            var changeScope = angular.element(changeElem).isolateScope();
            changeScope[attribute] = changeVal;
        };

        $scope.deleteRender = function(elemId){
            console.log("delete called");
            var deleteElem = document.getElementById(elemId);
            var deleteScope = angular.element(deleteElem).isolateScope();
            deleteScope.$destroy();
        };
    }]);