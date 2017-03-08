angular.module('Google-Maps', [])
    .directive('myMap', function(){
        function link(scope, element, attrs, ctrl) {
            scope.$watch('center', function (newVal, oldVal){
                console.log("Map: center watch fired");
                if (!angular.equals(newVal, oldVal)){
                    scope.map.setCenter(newVal);
                }
            });

            scope.$watch('zoom', function (newVal, oldVal){
                console.log("Map: zoom watch fired");
                if (!angular.equals(newVal, oldVal)){
                    scope.map.setZoom(newVal);
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Map: options watch fired");

                if (!angular.equals(newVal, oldVal)){
                    scope.map.setOptions(newVal);
                }
            });
        }
        return {
            restrict: 'E',
            scope: {
                options: '=?',
                center: '=',
                zoom: '='
            },
            transclude: true,
            link: link,
            controller: ['$scope', '$rootScope', function myMapController($scope, $rootScope){
                if (!$scope.options){
                    $scope.options = {};
                }
                $scope.options.center = $scope.center;
                $scope.options.zoom = $scope.zoom;
                $scope.map = new google.maps.Map(document.getElementById('map'), $scope.options);
                $rootScope.map = $scope.map;

                this.addObject = function (scope, type){
                    var options = scope.options;
                    var newObject;
                    if (!options){
                        options = {};
                    }

                    options.map = $scope.map;

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
                            newObject = new google.maps.Polyline(options);
                            break;

                        case "polygon":
                            options.paths = scope.paths;
                            console.log(options);

                            newObject = new google.maps.Polygon(options);
                            break;

                        case "rectangle":
                            options.bounds = scope.bounds;
                            console.log(options);
                            newObject = new google.maps.Rectangle(options);
                            break;
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
                if (!angular.equals(newVal, oldVal)){
                    scope.marker.setPosition(newVal);
                }
            });

            scope.$watch('draggable', function (newVal, oldVal){
                console.log("Marker: draggable watch fired");
                if (!angular.equals(newVal, oldVal)){
                    scope.marker.setDraggable(newVal);

                }
            });

            scope.$watch('icon', function (newVal, oldVal){
                console.log("Marker: icon watch fired");
                if (!angular.equals(newVal, oldVal)){
                    scope.marker.setIcon(newVal);
                }
            });

            scope.$watch('info', function (newVal, oldVal){
                if (!angular.equals(newVal, oldVal)){
                    scope.marker._infoWin.setContent(newVal);
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Marker: markerOpt watch fired");
                if (!angular.equals(newVal, oldVal)) {
                    if(newVal.hasOwnProperty("animation")) {
                        scope.marker.setAnimation(newVal.animation);
                        delete newVal.animation;
                    }
                    if(newVal.hasOwnProperty("clickable")) {
                        scope.marker.setClickable(newVal.clickable);
                        delete newVal.clickable;
                    }
                    if(newVal.hasOwnProperty("cursor")) {
                        scope.marker.setCursor(newVal.cursor);
                        delete newVal.cursor;
                    }
                    if(newVal.hasOwnProperty("label")) {
                        scope.marker.setLabel(newVal.label);
                        delete newVal.label;
                    }
                    if(newVal.hasOwnProperty("opacity")) {
                        scope.marker.setOpacity(newVal.opacity);
                        delete newVal.opacity;
                    }
                    if(newVal.hasOwnProperty("title")) {
                        scope.marker.setTitle(newVal.title);
                        delete newVal.title;
                    }
                    if(newVal.hasOwnProperty("visible")) {
                        scope.marker.setVisible(newVal.visible);
                        delete newVal.visible;
                    }
                    if(newVal.hasOwnProperty("zIndex")) {
                        scope.marker.setZIndex(newVal.zIndex);
                        delete newVal.zIndex;
                    }
                    console.log("Options left:", newVal);
                    if (!angular.equals(newVal, {})){
                        console.log("Calling setOptions");
                        scope.marker.setOptions(newVal);
                    }
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
                if (!angular.equals(newVal, oldVal)){
                    scope.polyline.setPath(newVal);
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("PolyLine: options watch fired");
                if (!angular.equals(newVal, oldVal)) {
                    if (newVal.hasOwnProperty("draggable")) {
                        scope.polyline.setDraggable(newVal.draggable);
                        delete newVal.draggable;
                    }
                    if (newVal.hasOwnProperty("editable")) {
                        scope.polyline.setEditable(newVal.editable);
                        delete newVal.editable;
                    }
                    if (newVal.hasOwnProperty("visible")) {
                        scope.polyline.setVisible(newVal.visible);
                        delete newVal.visible;
                    }
                    if (!angular.equals(newVal, {})) {
                        console.log("Calling setOptions");
                        scope.polyline.setOptions(newVal);
                    }
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
                if (!angular.equals(newVal, oldVal)){
                    scope.polygon.setPaths(newVal);
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Polygon: options watch fired");
                if (!angular.equals(newVal, oldVal)) {
                    if (newVal.hasOwnProperty("draggable")) {
                        scope.polygon.setDraggable(newVal.draggable);
                        delete newVal.draggable;
                    }
                    if (newVal.hasOwnProperty("editable")) {
                        scope.polygon.setEditable(newVal.editable);
                        delete newVal.editable;
                    }
                    if (newVal.hasOwnProperty("visible")) {
                        scope.polygon.setVisible(newVal.visible);
                        delete newVal.visible;
                    }
                    if (!angular.equals(newVal, {})) {
                        console.log("Calling setOptions");
                        scope.polygon.setOptions(newVal);
                    }
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
                if (!angular.equals(newVal, oldVal)){
                    scope.rectangle.setBounds(newVal);
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Rectangle: options watch fired");
                if (!angular.equals(newVal, oldVal)) {
                    if (newVal.hasOwnProperty("draggable")) {
                        scope.rectangle.setDraggable(newVal.draggable);
                        delete newVal.draggable;
                    }
                    if (newVal.hasOwnProperty("editable")) {
                        scope.rectangle.setEditable(newVal.editable);
                        delete newVal.editable;
                    }
                    if (newVal.hasOwnProperty("visible")) {
                        scope.rectangle.setVisible(newVal.visible);
                        delete newVal.visible;
                    }
                    if (!angular.equals(newVal, {})) {
                        console.log("Calling setOptions");
                        scope.rectangle.setOptions(newVal);
                    }
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
                if (!angular.equals(newVal, oldVal)){
                    scope.circle.setCenter(newVal);
                }
            });

            scope.$watch('radius', function (newVal, oldVal){
                console.log("Circle: radius watch fired");
                if (!angular.equals(newVal, oldVal)){
                    scope.circle.setRadius(newVal);
                }
            });

            scope.$watch('options', function (newVal, oldVal){
                console.log("Circle: options watch fired");
                if (!angular.equals(newVal, oldVal)) {
                    if (newVal.hasOwnProperty("draggable")) {
                        scope.circle.setDraggable(newVal.draggable);
                        delete newVal.draggable;
                    }
                    if (newVal.hasOwnProperty("editable")) {
                        scope.circle.setEditable(newVal.editable);
                        delete newVal.editable;
                    }
                    if (newVal.hasOwnProperty("visible")) {
                        scope.circle.setVisible(newVal.visible);
                        delete newVal.visible;
                    }
                    if (!angular.equals(newVal, {})) {
                        console.log("Calling setOptions");
                        scope.circle.setOptions(newVal);
                    }
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
                options: '=?'
            },
            link: link
        }
    });