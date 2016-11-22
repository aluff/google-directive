angular.module('myApp.mapView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/mapView', {
            templateUrl: 'mapView/mapView.html',
            controller: 'MapViewCtrl'
        });
    }])

    .controller('MapViewCtrl', ['$scope', function($scope) {

        $scope.mapPos = {lat: 32.880951, lng: -117.233827};
        $scope.center = $scope.mapPos;
        $scope.zoom = 13;
        $scope.mapOpt = {backgroundColor: "black"};
        $scope.line = [$scope.mapPos, {lat: 32.886325, lng: -117.239278 }];
        $scope.triangle = [$scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];
        $scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};
    }])
    .directive('myMap', function(){
        return {
            restrict: 'E',
            scope: {
                mapOpt: '=',
                center: '=',
                zoom: '='
            },
            transclude: true,
            controller: ['$scope', function myMapController($scope){
                if (!$scope.mapOpt){
                    $scope.mapOpt = {};
                }
                $scope.mapOpt.center = $scope.center;
                $scope.mapOpt.zoom = $scope.zoom;
                $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOpt);

                this.addMarker = function (scope){
                    var options = scope.markerOpt;
                    if (!options){
                        options = {};
                    }
                    options.position = scope.position;
                    options.map = $scope.map;
                    if (scope.draggable){
                        options.draggable = scope.draggable;
                    }
                    if (scope.icon){
                        options.icon = scope.icon;
                    }

                    var newMarker = new google.maps.Marker(options);

                    if (scope.info){
                        var infoWindow = new google.maps.InfoWindow({
                            content: scope.info
                        });
                        newMarker.addListener('click', function(){
                            infoWindow.open($scope.map, newMarker);
                        })
                    }
                };

                this.addPolyline = function (scope){
                    var options = scope.polylineOpt;
                    if (!options){
                        options = {};
                    }
                    options.path = scope.path;
                    options.map = $scope.map;

                    if (scope.color){
                        options.strokeColor = scope.color;
                    }
                    if (scope.width){
                        options.strokeWeight = scope.width;
                    }
                    if (scope.opacity){
                        options.strokeOpacity = scope.opacity;
                    }

                    var newLine = new google.maps.Polyline(options);
                };

                this.addPolygon = function (scope){
                    var options = scope.polygonOpt;
                    if (!options){
                        options = {};
                    }
                    options.paths = scope.paths;
                    options.map = $scope.map;

                    if (scope.fillColor){
                        options.fillColor = scope.fillColor;
                    }
                    if (scope.fillOpacity){
                        options.fillOpacity = scope.fillOpacity;
                    }
                    if (scope.lineColor){
                        options.strokeColor = scope.lineColor;
                    }
                    if (scope.lineWidth){
                        options.strokeWeight = scope.lineWidth;
                    }
                    if (scope.lineOpacity){
                        options.strokeOpacity = scope.lineOpacity;
                    }

                    var newLine = new google.maps.Polygon(options);
                };

                this.addRectangle = function (scope){
                    var options = scope.rectangleOpt;
                    if (!options){
                        options = {};
                    }
                    options.bounds = scope.bounds;
                    options.map = $scope.map;

                    if (scope.fillColor){
                        options.fillColor = scope.fillColor;
                    }
                    if (scope.fillOpacity){
                        options.fillOpacity = scope.fillOpacity;
                    }
                    if (scope.lineColor){
                        options.strokeColor = scope.lineColor;
                    }
                    if (scope.lineWidth){
                        options.strokeWeight = scope.lineWidth;
                    }
                    if (scope.lineOpacity){
                        options.strokeOpacity = scope.lineOpacity;
                    }

                    var newLine = new google.maps.Rectangle(options);
                };

                this.addCircle = function (scope){
                    var options = scope.circleOpt;
                    if (!options){
                        options = {};
                    }
                    options.center = scope.center;
                    options.radius = scope.radius;
                    options.map = $scope.map;

                    if (scope.fillColor){
                        options.fillColor = scope.fillColor;
                    }
                    if (scope.fillOpacity){
                        options.fillOpacity = scope.fillOpacity;
                    }
                    if (scope.lineColor){
                        options.strokeColor = scope.lineColor;
                    }
                    if (scope.lineWidth){
                        options.strokeWeight = scope.lineWidth;
                    }
                    if (scope.lineOpacity){
                        options.strokeOpacity = scope.lineOpacity;
                    }

                    var newLine = new google.maps.Circle(options);
                };
            }],
            template: "<div id='map'></div><div ng-transclude></div>"
        };
    })
    .directive('myMarker', function(){
        function link(scope, element, attrs, mapCtrl) {
            mapCtrl.addMarker(scope);
        }
        return {
            require: '^myMap',
            restrict: 'E',
            scope:{
                position: '=',
                draggable: '=',
                icon: '=',
                info: '=',
                markerOpt: '='
            },
            link: link
        };
    })
    .directive('myPolyline', function(){
        function link(scope, element, attrs, mapCtrl) {
            mapCtrl.addPolyline(scope);
        }
        return {
            require: '^myMap',
            restrict: 'E',
            scope:{
                path: '=',
                color: '=',
                width: '=',
                opacity: '=',
                polylineOpt: '='
            },
            link: link
        }
    })
    .directive('myPolygon', function(){
        function link(scope, element, attrs, mapCtrl) {
            mapCtrl.addPolygon(scope);
        }
        return {
            require: '^myMap',
            restrict: 'E',
            scope:{
                paths: '=',
                fillColor: '=',
                fillOpacity: '=',
                lineWidth: '=',
                lineColor: '=',
                lineOpacity: '=',
                polygonOpt: '='
            },
            link: link
        }
    })
    .directive('myRectangle', function(){
        function link(scope, element, attrs, mapCtrl) {
            mapCtrl.addRectangle(scope);
        }
        return {
            require: '^myMap',
            restrict: 'E',
            scope:{
                bounds: '=',
                fillColor: '=',
                fillOpacity: '=',
                lineWidth: '=',
                lineColor: '=',
                lineOpacity: '=',
                rectangleOpt: '='
            },
            link: link
        }
    })
    .directive('myCircle', function(){
        function link(scope, element, attrs, mapCtrl) {
            mapCtrl.addCircle(scope);
        }
        return {
            require: '^myMap',
            restrict: 'E',
            scope:{
                center: '=',
                radius: '=',
                fillColor: '=',
                fillOpacity: '=',
                lineWidth: '=',
                lineColor: '=',
                lineOpacity: '=',
                circleOpt: '='
            },
            link: link
        }
    });
