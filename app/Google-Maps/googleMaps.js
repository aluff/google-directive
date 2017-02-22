angular.module('Google-Maps', [])
    .directive('myMap', function(){
        function link(scope, element, attrs, ctrl) {
            scope.$watch('center', function (newVal, oldVal){
                console.log("Map: center watch fired");
                if (newVal !== oldVal){
                    scope.map.setCenter(newVal);
                }
            });

            scope.$watch('zoom', function (newVal, oldVal){
                console.log("Map: zoom watch fired");
                if (newVal != oldVal){
                    scope.map.setZoom(newVal);
                }
            });

            scope.$watch('mapOpt', function (newVal, oldVal){
                console.log("Map: mapOpt watch fired");
                if (newVal != oldVal){
                    var prevCenter = scope.map.getCenter();
                    newVal.center = { lat: prevCenter.lat(), lng: prevCenter.lng() };
                    newVal.zoom = scope.map.getZoom();
                    scope.map.setOptions(newVal);
                }
            });
        }
        return {
            restrict: 'E',
            scope: {
                mapOpt: '=?',
                center: '=',
                zoom: '='
            },
            transclude: true,
            link: link,
            controller: ['$scope', '$rootScope', function myMapController($scope, $rootScope){
                if (!$scope.mapOpt){
                    $scope.mapOpt = {};
                }
                $scope.mapOpt.center = $scope.center;
                $scope.mapOpt.zoom = $scope.zoom;
                $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOpt);
                $rootScope.map = $scope.map;

                this.addObject = function (scope, type){
                    var options = scope.options;
                    var newObject;
                    if (!options){
                        options = {};
                    }

                    options.map = $scope.map;

                    if (["polygon", "circle", "rectangle"].indexOf(type) > -1){
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
                    }

                    switch (type){
                        case "circle":
                            options.center = scope.center;
                            options.radius = scope.radius;
                            newObject = new google.maps.Circle(options);
                            break;

                        case "marker":
                            options.position = scope.position;
                            if (scope.draggable){
                                options.draggable = scope.draggable;
                            }
                            if (scope.icon){
                                options.icon = scope.icon;
                            }
                            if (scope.info) {
                                var infoWindow = new google.maps.InfoWindow({
                                    content: scope.info
                                });
                                options._infoWin = infoWindow;
                            }
                            newObject = new google.maps.Marker(options);
                            if (scope.info){
                                newObject.addListener('click', function(){
                                    infoWindow.open($scope.map, newObject);
                                });
                            }
                            break;

                        case "polyline":
                            options.path = scope.path;
                            if (scope.color){
                                options.strokeColor = scope.color;
                            }
                            if (scope.width){
                                options.strokeWeight = scope.width;
                            }
                            if (scope.opacity){
                                options.strokeOpacity = scope.opacity;
                            }
                            newObject = new google.maps.Polyline(options);
                            break;

                        case "polygon":
                            options.paths = scope.paths;
                            newObject = new google.maps.Polygon(options);
                            break;

                        case "rectangle":
                            options.bounds = scope.bounds;
                            newObject = new google.maps.Rectangle(options);
                            break;

                        default:
                            console.error("Unknown shape type");
                    }
                    return newObject;
                }
            }],
            template: "<div id='map'><div ng-transclude></div></div>"
        };
    })
    .directive('myMarker', function(){
        function link(scope, element, attrs, mapCtrl) {
            scope.marker = mapCtrl.addObject(scope, "marker");

            scope.$watch('position', function (newVal, oldVal){
                console.log("Marker: position watch fired");
                if (newVal != oldVal){
                    scope.marker.setPosition(newVal);
                }
            });

            scope.$watch('draggable', function (newVal, oldVal){
                console.log("Marker: draggable watch fired");
                if (newVal != oldVal){
                    scope.marker.setDraggable(newVal);

                }
            });

            scope.$watch('icon', function (newVal, oldVal){
                console.log("Marker: icon watch fired");
                if (newVal != oldVal){
                    scope.marker.setIcon(newVal);
                }
            });

            scope.$watch('info', function (newVal, oldVal){
                if (newVal != oldVal){
                    scope.marker._infoWin.setContent(newVal);

                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Marker: markerOpt watch fired");
                if (newVal != oldVal){
                    newVal.position = scope.marker.getPosition();
                    newVal.draggable = scope.marker.getDraggable();
                    newVal.icon = scope.marker.getIcon();
                    scope.marker.setOptions(newVal);
                }
            });

            scope.$on('$destroy', function() {
                console.log("Destroy Marker");
                scope.marker.setMap(null);
            });
        }
        return {
            require: '^myMap',
            restrict: 'E',
            replace: true,
            scope:{
                position: '=',
                draggable: '=?',
                icon: '=?',
                info: '=?',
                options: '=?'
            },
            link: link
        };
    })
    .directive('myPolyline', function(){
        function link(scope, element, attrs, mapCtrl) {
            scope.polyline = mapCtrl.addObject(scope, "polyline");

            scope.$watch('path', function (newVal, oldVal){
                console.log("Polyline: path watch fired");
                if (newVal != oldVal){
                    scope.polyline.setPath(newVal);
                }
            });

            scope.$watch('color', function (newVal, oldVal){
                console.log("Polyline: strokecolor watch fired");
                if (newVal != oldVal){
                    scope.polyline.setOptions({strokeColor: newVal});

                }
            });

            scope.$watch('width', function (newVal, oldVal){
                console.log("PolyLine: width watch fired");
                if (newVal != oldVal){
                    scope.polyline.setOptions({strokeWeight: newVal});
                }
            });

            scope.$watch('opacity', function (newVal, oldVal){
                console.log("PolyLine: opacity watch fired");
                if (newVal != oldVal){
                    scope.polyline.setOptions({strokeOpacity: newVal});
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("PolyLine: options watch fired");
                if (newVal != oldVal){
                    scope.polyline.setOptions(newVal);
                }
            });

            scope.$on('$destroy', function() {
                console.log("Destroy PolyLine");
                scope.polyline.setMap(null);
            });
        }
        return {
            require: '^myMap',
            restrict: 'E',
            replace: true,
            scope:{
                path: '=',
                color: '=?',
                width: '=?',
                opacity: '=?',
                options: '=?'
            },
            link: link
        }
    })
    .directive('myPolygon', function(){
        function link(scope, element, attrs, mapCtrl) {
            scope.polygon = mapCtrl.addObject(scope, "polygon");

            scope.$watch('paths', function (newVal, oldVal){
                console.log("Polygon: paths watch fired");
                if (newVal != oldVal){
                    scope.polygon.setPath(newVal);
                }
            });

            scope.$watch('fillColor', function (newVal, oldVal){
                console.log("Polygon: fillColor watch fired");
                if (newVal != oldVal){
                    scope.polygon.setOptions({fillColor: newVal});

                }
            });

            scope.$watch('fillOpacity', function (newVal, oldVal){
                console.log("Polygon: fillOpacity watch fired");
                if (newVal != oldVal){
                    scope.polygon.setOptions({fillOpacity: newVal});
                }
            });

            scope.$watch('lineWidth', function (newVal, oldVal){
                console.log("Polygon: lineWidth watch fired");
                if (newVal != oldVal){
                    scope.polygon.setOptions({strokeWeight: newVal});
                }
            });

            scope.$watch('lineColor', function (newVal, oldVal){
                console.log("Polygon: lineColor watch fired");
                if (newVal != oldVal){
                    scope.polygon.setOptions({strokeColor: newVal});
                }
            });

            scope.$watch('lineOpacity', function (newVal, oldVal){
                console.log("Polygon: lineOpacity watch fired");
                if (newVal != oldVal){
                    scope.polygon.setOptions({strokeOpacity: newVal});
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Polygon: options watch fired");
                if (newVal != oldVal){
                    scope.polygon.setOptions(newVal);
                }
            });

            scope.$on('$destroy', function() {
                console.log("Destroy Polygon");
                scope.polygon.setMap(null);
            });
        }
        return {
            require: '^myMap',
            restrict: 'E',
            replace: true,
            scope:{
                paths: '=',
                fillColor: '=?',
                fillOpacity: '=?',
                lineWidth: '=?',
                lineColor: '=?',
                lineOpacity: '=?',
                options: '=?'
            },
            link: link
        }
    })
    .directive('myRectangle', function(){
        function link(scope, element, attrs, mapCtrl) {
            scope.rectangle = mapCtrl.addObject(scope, "rectangle");

            scope.$watch('bounds', function (newVal, oldVal){
                console.log("Rectangle: bounds watch fired");
                if (newVal != oldVal){
                    scope.rectangle.setBounds(newVal);
                }
            });

            scope.$watch('fillColor', function (newVal, oldVal){
                console.log("Rectangle: fillColor watch fired");
                if (newVal != oldVal){
                    scope.rectangle.setOptions({fillColor: newVal});

                }
            });

            scope.$watch('fillOpacity', function (newVal, oldVal){
                console.log("Rectangle: fillOpacity watch fired");
                if (newVal != oldVal){
                    scope.rectangle.setOptions({fillOpacity: newVal});
                }
            });

            scope.$watch('lineWidth', function (newVal, oldVal){
                console.log("Rectangle: lineWidth watch fired");
                if (newVal != oldVal){
                    scope.rectangle.setOptions({strokeWeight: newVal});
                }
            });

            scope.$watch('lineColor', function (newVal, oldVal){
                console.log("Rectangle: lineColor watch fired");
                if (newVal != oldVal){
                    scope.rectangle.setOptions({strokeColor: newVal});
                }
            });

            scope.$watch('lineOpacity', function (newVal, oldVal){
                console.log("Rectangle: lineOpacity watch fired");
                if (newVal != oldVal){
                    scope.rectangle.setOptions({strokeOpacity: newVal});
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Rectangle: options watch fired");
                if (newVal != oldVal){
                    scope.rectangle.setOptions(newVal);
                }
            });

            scope.$on('$destroy', function() {
                console.log("Destroy Rectangle");
                scope.rectangle.setMap(null);
            });
        }
        return {
            require: '^myMap',
            restrict: 'E',
            scope:{
                bounds: '=',
                fillColor: '=?',
                fillOpacity: '=?',
                lineWidth: '=?',
                lineColor: '=?',
                lineOpacity: '=?',
                options: '=?'
            },
            link: link
        }
    })
    .directive('myCircle', function(){
        function link(scope, element, attrs, mapCtrl) {
            scope.circle = mapCtrl.addObject(scope, "circle");

            scope.$watch('center', function (newVal, oldVal){
                console.log("Circle: center watch fired");
                if (newVal != oldVal){
                    scope.circle.setCenter(newVal);
                }
            });

            scope.$watch('radius', function (newVal, oldVal){
                console.log("Circle: radius watch fired");
                if (newVal != oldVal){
                    scope.circle.setRadius(newVal);
                }
            });

            scope.$watch('fillColor', function (newVal, oldVal){
                console.log("Circle: fillColor watch fired");
                if (newVal != oldVal){
                    scope.circle.setOptions({fillColor: newVal});

                }
            });

            scope.$watch('fillOpacity', function (newVal, oldVal){
                console.log("Circle: fillOpacity watch fired");
                if (newVal != oldVal){
                    scope.circle.setOptions({fillOpacity: newVal});
                }
            });

            scope.$watch('lineWidth', function (newVal, oldVal){
                console.log("Circle: lineWidth watch fired");
                if (newVal != oldVal){
                    scope.circle.setOptions({strokeWeight: newVal});
                }
            });

            scope.$watch('lineColor', function (newVal, oldVal){
                console.log("Circle: lineColor watch fired");
                if (newVal != oldVal){
                    scope.circle.setOptions({strokeColor: newVal});
                }
            });

            scope.$watch('lineOpacity', function (newVal, oldVal){
                console.log("Circle: lineOpacity watch fired");
                if (newVal != oldVal){
                    scope.circle.setOptions({strokeOpacity: newVal});
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Circle: options watch fired");
                if (newVal != oldVal){
                    scope.circle.setOptions(newVal);
                }
            });

            scope.$on('$destroy', function() {
                console.log("Destroy Circle");
                scope.circle.setMap(null);
            });
        }
        return {
            require: '^myMap',
            restrict: 'E',
            scope:{
                center: '=',
                radius: '=',
                fillColor: '=?',
                fillOpacity: '=?',
                lineWidth: '=?',
                lineColor: '=?',
                lineOpacity: '=?',
                options: '=?'
            },
            link: link
        }
    });