'use strict';

describe('testing map directives', function() {
    var $compile, scope;

    beforeEach(function() {
        // Load myApp module
        module('myApp');
        module('Google-Maps');

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        inject(function(_$compile_, _$rootScope_){
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            scope = _$rootScope_;
        });

        scope.mapPos = {lat: 32.880951, lng: -117.233827};
        scope.center = scope.mapPos;
        scope.zoom = 13;
        scope.mapOpt = {backgroundColor: "black"};

        scope.newCenter = {lat: 32.880951, lng: -117.250000};
        scope.newZoom = 9;
        scope.newOpt = {draggable: false};
    });




    // afterEach(function() {
    //     var testDiv = document.getElementById("testDiv");
    //     testDiv.parentNode.removeChild(testDiv);
    // });


    it('should create a google map', function() {
        var map_div = document.createElement("div");
        map_div.setAttribute("id", "testDiv");
        map_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"></my-map>';
        document.body.appendChild(map_div);
        var directiveElem = $compile(document.body)(scope);
        scope.$digest();

        expect(scope.map).toBeDefined();
        expect(scope.map.zoom).toEqual(13);
        expect(scope.map.getCenter().toUrlValue()).toEqual('32.880951,-117.233827');
        expect(scope.map.backgroundColor).toEqual("black");

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should create a marker', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        var marker_div = document.createElement('div');
        marker_div.setAttribute("id", "testDiv");
        marker_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>';
        document.body.appendChild(marker_div);
        var markerElem = $compile(document.body)(scope);
        scope.$digest();

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.draggable).toEqual(true);
        expect(markerScope.marker.getPosition().toUrlValue()).toEqual('32.880951,-117.233827');

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should create a polyline', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        var polyline_div = document.createElement('div');
        polyline_div.setAttribute("id", "testDiv");
        polyline_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-polyline id="polyline1" path="line" color="\'red\'" opacity="0.5" width="5"></my-polyline></my-map>';
        document.body.appendChild(polyline_div);
        var polylineElem = $compile(document.body)(scope);
        scope.$digest();

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.strokeColor).toEqual("red");
        expect(polylineScope.polyline.strokeOpacity).toEqual(0.5);
        expect(polylineScope.polyline.getPath().b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polylineScope.polyline.getPath().b[1].toUrlValue()).toEqual('32.886325,-117.239278');
        expect(polylineScope.polyline.strokeWeight).toEqual(5);

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should create a polygon', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        var polygon_div = document.createElement('div');
        polygon_div.setAttribute("id", "testDiv");
        polygon_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-polygon id="polygon1" paths="triangle" fill-color="\'red\'" line-width="1" fill-opacity="1"></my-polygon></my-map>';
        document.body.appendChild(polygon_div);
        var polygonElem = $compile(document.body)(scope);
        scope.$digest();

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.fillColor).toEqual("red");
        expect(polygonScope.polygon.fillOpacity).toEqual(1);
        expect(polygonScope.polygon.strokeWeight).toEqual(1);
        expect(polygonScope.polygon.getPaths().getArray()[0].b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[1].toUrlValue()).toEqual('32.87788,-117.237214');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[2].toUrlValue()).toEqual('32.875468,-117.232348');

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should create a rectangle', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        var rect_div = document.createElement('div');
        rect_div.setAttribute("id", "testDiv");
        rect_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>';
        document.body.appendChild(rect_div);
        var rectElem = $compile(document.body)(scope);
        scope.$digest();

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.getBounds().toUrlValue()).toEqual('32.878531,-117.225922,32.882937,-117.222145');
        expect(rectScope.rectangle.draggable).toEqual(true);

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should create a circle', function(){

        var cir_div = document.createElement('div');
        cir_div.setAttribute("id", "testDiv");
        cir_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" fill-opacity="0.05" options="{editable: true}"></my-circle></my-map>';
        document.body.appendChild(cir_div);
        var circleElem = $compile(document.body)(scope);
        scope.$digest();

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.getCenter().toUrlValue()).toEqual('32.880951,-117.233827');
        expect(circleScope.circle.radius).toEqual(1000);
        expect(circleScope.circle.fillOpacity).toEqual(0.05);
        expect(circleScope.circle.editable).toEqual(true);

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should change marker options', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        var marker_div = document.createElement('div');
        marker_div.setAttribute("id", "testDiv");
        marker_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>';
        document.body.appendChild(marker_div);
        var markerElem = $compile(document.body)(scope);
        scope.$digest();

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.position = scope.newCenter;
        markerScope.icon = 'http://image.flaticon.com/icons/png/128/91/91484.png';
        markerScope.options = {opacity: 0.5};
        markerScope.draggable = false;
        markerScope.info = 'New Marker Info';

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.draggable).toEqual(false);
        expect(markerScope.marker.getPosition().toUrlValue()).toEqual('32.880951,-117.25');
        expect(markerScope.marker.icon).toEqual('http://image.flaticon.com/icons/png/128/91/91484.png');
        expect(markerScope.marker._infoWin.content).toEqual('New Marker Info');
        expect(markerScope.marker.opacity).toEqual(0.5);

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should change polyline options', function(){
        scope.$destroy();
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        var polyline_div = document.createElement('div');
        polyline_div.setAttribute("id", "testDiv");
        polyline_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-polyline id="polyline1" path="line" color="\'red\'" opacity="0.5" width="5"></my-polyline></my-map>';
        document.body.appendChild(polyline_div);
        var polylineElem = $compile(document.body)(scope);
        scope.$digest();

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        polylineScope.$digest();

        polylineScope.path = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }, scope.newCenter];
        polylineScope.options = {visible: false};
        polylineScope.color = "black";
        polylineScope.width = 11;
        polylineScope.opacity = 0.1;

        polylineScope.$digest();
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.visible).toEqual(false);
        expect(polylineScope.polyline.strokeColor).toEqual("black");
        expect(polylineScope.polyline.strokeWeight).toEqual(11);
        expect(polylineScope.polyline.strokeOpacity).toEqual(0.1);
        expect(polylineScope.polyline.getPath().b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polylineScope.polyline.getPath().b[1].toUrlValue()).toEqual('32.886325,-117.239278');
        expect(polylineScope.polyline.getPath().b[2].toUrlValue()).toEqual('32.880951,-117.25');

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should create polygon options', function(){
        scope.$destroy();
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        var polygon_div = document.createElement('div');
        polygon_div.setAttribute("id", "testDiv");
        polygon_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-polygon id="polygon1" paths="triangle" fill-color="\'red\'" line-width="1" fill-opacity="1"></my-polygon></my-map>';
        document.body.appendChild(polygon_div);
        var polygonElem = $compile(document.body)(scope);
        scope.$digest();

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        polygonScope.$digest();

        polygonScope.paths = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, scope.newCenter];
        polygonScope.fillColor = "black";
        polygonScope.fillOpacity = 0.4;
        polygonScope.lineWidth = 22;
        polygonScope.lineColor = "red";
        polygonScope.lineOpacity = 0.3;
        polygonScope.options = {visible: false};

        polygonScope.$digest();
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.fillColor).toEqual("black");
        expect(polygonScope.polygon.fillOpacity).toEqual(0.4);
        expect(polygonScope.polygon.strokeWeight).toEqual(22);
        expect(polygonScope.polygon.strokeColor).toEqual("red");
        expect(polygonScope.polygon.strokeOpacity).toEqual(0.3);
        expect(polygonScope.polygon.visible).toEqual(false);
        expect(polygonScope.polygon.getPaths().getArray()[0].b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[1].toUrlValue()).toEqual('32.87788,-117.237214');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[2].toUrlValue()).toEqual('32.880951,-117.25');

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should change rectangle options', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        var rect_div = document.createElement('div');
        rect_div.setAttribute("id", "testDiv");
        rect_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>';
        document.body.appendChild(rect_div);
        var rectElem = $compile(document.body)(scope);
        scope.$digest();

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        rectScope.$digest();

        rectScope.bounds = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.239278};
        rectScope.fillColor = "blue";
        rectScope.fillOpacity = 0.4;
        rectScope.lineWidth = 22;
        rectScope.lineColor = "green";
        rectScope.lineOpacity = 0.3;
        rectScope.options = {visible: false};

        rectScope.$digest();
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.getBounds().toUrlValue()).toEqual('32.878531,-117.239278,32.882937,-117.222145');
        expect(rectScope.rectangle.visible).toEqual(false);
        expect(rectScope.rectangle.fillColor).toEqual("blue");
        expect(rectScope.rectangle.fillOpacity).toEqual(0.4);
        expect(rectScope.rectangle.strokeWeight).toEqual(22);
        expect(rectScope.rectangle.strokeColor).toEqual("green");
        expect(rectScope.rectangle.strokeOpacity).toEqual(0.3);

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    it('should change circle options', function(){
        var cir_div = document.createElement('div');
        cir_div.setAttribute("id", "testDiv");
        cir_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" fill-opacity="0.05" options="{editable: true}" line-color="\'red\'" line-opacity="1"></my-circle></my-map>';
        document.body.appendChild(cir_div);
        var circleElem = $compile(document.body)(scope);
        scope.$digest();

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        circleScope.$digest();
        circleScope.center = scope.newCenter;
        circleScope.radius = 500;
        circleScope.fillColor = "blue";
        circleScope.fillOpacity = 0.4;
        circleScope.lineWidth = 22;
        circleScope.lineColor = "green";
        circleScope.lineOpacity = 0.3;
        circleScope.options = {visible: false};

        circleScope.$digest();
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.getCenter().toUrlValue()).toEqual('32.880951,-117.25');
        expect(circleScope.circle.radius).toEqual(500);
        expect(circleScope.circle.fillColor).toEqual("blue");
        expect(circleScope.circle.fillOpacity).toEqual(0.4);
        expect(circleScope.circle.strokeWeight).toEqual(22);
        expect(circleScope.circle.strokeColor).toEqual("green");
        expect(circleScope.circle.strokeOpacity).toEqual(0.3);
        expect(circleScope.circle.visible).toEqual(false);

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });


    it('should change map options', function() {
        var map_div = document.createElement("div");
        map_div.setAttribute("id", "testDiv");
        map_div.innerHTML = '<my-map center="center" zoom="zoom" map-opt="mapOpt"></my-map>';
        document.body.appendChild(map_div);
        var directiveElem = $compile(document.body)(scope);
        scope.$digest();

        var mapScope = scope.$$childHead;

        mapScope.$digest();
        mapScope.center = scope.newCenter;
        mapScope.zoom = scope.newZoom;
        mapScope.mapOpt = scope.newOpt;

        mapScope.$digest();
        console.log(mapScope);
        expect(scope.map).toBeDefined();
        expect(scope.map.zoom).toEqual(9);
        expect(scope.map.getCenter().toUrlValue()).toEqual('32.880951,-117.25');
        expect(scope.map.draggable).toEqual(false);

        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });


});

//ng-repeat vs array -- destroy scope when using it
