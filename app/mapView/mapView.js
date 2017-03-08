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

        $scope.markers = [{lat: 32.878665, lng: -117.240544}, {lat: 32.881143, lng: -117.237379}, {lat: 32.881810, lng: -117.233517}];
        $scope.lines = [[{lat: 32.878665, lng: -117.240544}, {lat: 32.881143, lng: -117.237379}], [{lat: 32.878665, lng: -117.240544}, {lat: 32.881810, lng: -117.233517}]];
        $scope.triangles = [[{lat: 32.883763, lng: -117.244426}, {lat: 32.888237, lng: -117.242524}, {lat: 32.885381, lng: -117.241022}],
                            [{lat: 32.885339, lng: -117.239140}, {lat: 32.883988, lng: -117.241114}, {lat: 32.883718, lng: -117.239784}]];
        $scope.rectangles = [{north: 32.880500, south: 32.878851, east: -117.241672, west: -117.243260},
                             {north: 32.873742, south: 32.871075, east: -117.233196, west: -117.236554}];
        $scope.circles = [{center: {lat: 32.872113, lng: -117.241011}, radius: 300}, {center: {lat: 32.873827, lng: -117.226570}, radius: 500}];

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

        $scope.addNewRender = function(type){
            console.log("add render");
            switch(type){
                case 'marker':
                    $scope.markers.push({lat: 32.884115, lng: -117.229351});
                    break;
                case 'polyline':
                    $scope.lines.push([{lat: 32.880601, lng: -117.242977}, {lat: 32.881810, lng: -117.233517}]);
                    break;
                case 'polygon':
                    $scope.triangles.push([{lat: 32.878501, lng: -117.241694}, {lat: 32.875500, lng: -117.242756}, {lat: 32.874022, lng: -117.236533}]);
                    break;
                case 'rectangle':
                    $scope.rectangles.push({north: 32.894443, south: 32.891533, east: -117.237853, west: -117.242112});
                    break;
                case 'circle':
                    $scope.circles.push({center: {lat: 32.874692, lng: -117.232332}, radius: 200});
                    break;
            }
        };

        $scope.deleteLastRender = function(type){
            console.log("delete render");
            switch(type){
                case 'marker':
                    $scope.markers.pop();
                    break;
                case 'polyline':
                    $scope.lines.pop();
                    break;
                case 'polygon':
                    $scope.triangles.pop();
                    break;
                case 'rectangle':
                    $scope.rectangles.pop();
                    break;
                case 'circle':
                    $scope.circles.pop();
                    break;
            }
        };
    }]);