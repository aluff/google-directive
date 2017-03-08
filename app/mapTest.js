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

    afterEach(function() {
        var testDiv = document.getElementById("testDiv");
        testDiv.parentNode.removeChild(testDiv);
        scope.$destroy();
    });

    var createElem = function(html){
        var elem_div = document.createElement('div');
        elem_div.setAttribute("id", "testDiv");
        elem_div.innerHTML = html;
        document.body.appendChild(elem_div);
        $compile(document.body)(scope);
        scope.$digest();
    };

    /*-------------------------------------------------------
     Map Tests
     -------------------------------------------------------- */

    it('should create a google map with options', function() {
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"></my-map>');

        expect(scope.map).toBeDefined();
        expect(scope.map.zoom).toEqual(13);
        expect(scope.map.getCenter().toUrlValue()).toEqual('32.880951,-117.233827');
        expect(scope.map.backgroundColor).toEqual("black");
    });

    it('should create a google map without options', function() {
        createElem('<my-map center="center" zoom="zoom"></my-map>');

        expect(scope.map).toBeDefined();
        expect(scope.map.zoom).toEqual(13);
        expect(scope.map.getCenter().toUrlValue()).toEqual('32.880951,-117.233827');
    });

    it('should change map center', function() {
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"></my-map>');

        var mapScope = scope.$$childHead;
        mapScope.$digest();
        mapScope.center = scope.newCenter;

        mapScope.$digest();
        expect(scope.map).toBeDefined();
        expect(scope.map.getCenter().toUrlValue()).toEqual('32.880951,-117.25');
    });

    it('should change map zoom', function() {
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"></my-map>');

        var mapScope = scope.$$childHead;
        mapScope.$digest();
        mapScope.zoom = scope.newZoom;

        mapScope.$digest();
        expect(scope.map).toBeDefined();
        expect(scope.map.zoom).toEqual(9);
    });

    it('should change map options', function() {
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"></my-map>');

        var mapScope = scope.$$childHead;
        mapScope.$digest();
        mapScope.options = scope.newOpt;

        mapScope.$digest();
        expect(scope.map).toBeDefined();
        expect(scope.map.draggable).toEqual(false);
    });

    /*-------------------------------------------------------
        Marker Tests
      -------------------------------------------------------- */

    it('should create a marker with no optional attr', function(){
        scope.markerPos = scope.mapPos;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.getPosition().toUrlValue()).toEqual('32.880951,-117.233827');
    });

    it('should create a marker with draggable attr', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.draggable).toEqual(true);
        expect(markerScope.marker.getPosition().toUrlValue()).toEqual('32.880951,-117.233827');
    });

    it('should create a marker with info attr', function(){
        scope.markerPos = scope.mapPos;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker._infoWin.content).toEqual("This is a marker");
    });

    it('should create a marker with icon attr', function(){
        scope.markerPos = scope.mapPos;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" icon="\'https://portfolium.cloudimg.io/s/crop/128x128/https://cdn.portfolium.com/ugcs3/networks/ucsdlogo.png\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.icon).toEqual("https://portfolium.cloudimg.io/s/crop/128x128/https://cdn.portfolium.com/ugcs3/networks/ucsdlogo.png");
    });

    it('should change marker position', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.position = scope.newCenter;

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.getPosition().toUrlValue()).toEqual('32.880951,-117.25');
    });

    it('should change marker draggable', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.draggable = false;

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.draggable).toEqual(false);
    });

    it('should change marker icon', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.icon = 'http://image.flaticon.com/icons/png/128/91/91484.png';

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.icon).toEqual('http://image.flaticon.com/icons/png/128/91/91484.png');
    });

    it('should change marker icon', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.info = 'This is new info';

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker._infoWin.content).toEqual('This is new info');
    });

    it('should change marker animation', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {animation: google.maps.Animation.BOUNCE};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.animation).toEqual(google.maps.Animation.BOUNCE);
    });

    it('should change marker clickable', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {clickable: false};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.clickable).toEqual(false);
    });

    it('should change marker cursor', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {cursor: 'Cursor test text'};

        markerScope.$digest();
        console.log(markerScope);
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.cursor).toEqual('Cursor test text');
    });

    it('should change marker label', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {label: 'a label'};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.label).toEqual('a label');
    });

    it('should change marker opacity', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {opacity: 0.5};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.opacity).toEqual(0.5);
    });

    it('should change marker title', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {title: "a new marker title"};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.title).toEqual("a new marker title");
    });

    it('should change marker visibility', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {visible: false};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.visible).toEqual(false);
    });

    it('should change marker zindex', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {zIndex: 10};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.zIndex).toEqual(10);
    });

    it('should change marker anchorPoint', function(){
        scope.markerPos = scope.mapPos;
        scope.draggable = true;

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-marker id="marker1" position="markerPos" draggable="draggable" info="\'This is a marker\'"></my-marker></my-map>');

        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        markerScope.$digest();

        markerScope.options = {anchorPoint: new google.maps.Point(10,10)};

        markerScope.$digest();
        expect(markerScope.marker).toBeDefined();
        expect(markerScope.marker.anchorPoint).toEqual(new google.maps.Point(10,10));
    });

    /*-------------------------------------------------------
     Polyline Tests
     -------------------------------------------------------- */

    it('should create a polyline without options', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        createElem('<my-map center="center" zoom="zoom"><my-polyline id="polyline1" path="line"></my-polyline></my-map>');

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.getPath().b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polylineScope.polyline.getPath().b[1].toUrlValue()).toEqual('32.886325,-117.239278');
    });

    it('should create a polyline with options', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polyline id="polyline1" path="line" options="{strokeColor: \'red\'}"></my-polyline></my-map>');

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.getPath().b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polylineScope.polyline.getPath().b[1].toUrlValue()).toEqual('32.886325,-117.239278');
        expect(polylineScope.polyline.strokeColor).toEqual("red");
    });

    it('should change polyline path', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polyline id="polyline1" path="line"></my-polyline></my-map>');

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        polylineScope.$digest();

        polylineScope.path = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }, scope.newCenter];

        polylineScope.$digest();
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.getPath().b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polylineScope.polyline.getPath().b[1].toUrlValue()).toEqual('32.886325,-117.239278');
        expect(polylineScope.polyline.getPath().b[2].toUrlValue()).toEqual('32.880951,-117.25');
    });

    it('should change polyline draggable', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polyline id="polyline1" path="line"></my-polyline></my-map>');

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        polylineScope.$digest();

        polylineScope.options = {draggable: false};

        polylineScope.$digest();
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.draggable).toEqual(false);
    });

    it('should change polyline editable', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polyline id="polyline1" path="line"></my-polyline></my-map>');

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        polylineScope.$digest();

        polylineScope.options = {editable: false};

        polylineScope.$digest();
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.editable).toEqual(false);
    });

    it('should change polyline editable', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polyline id="polyline1" path="line"></my-polyline></my-map>');

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        polylineScope.$digest();

        polylineScope.options = {visible: false};

        polylineScope.$digest();
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.visible).toEqual(false);
    });

    it('should change polyline strokeColor', function(){
        scope.line = [scope.mapPos, {lat: 32.886325, lng: -117.239278 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polyline id="polyline1" path="line"></my-polyline></my-map>');

        var polylineScope = scope.$$childTail.$$childHead.$$childHead;
        polylineScope.$digest();

        polylineScope.options = {strokeColor: "red"};

        polylineScope.$digest();
        expect(polylineScope.polyline).toBeDefined();
        expect(polylineScope.polyline.strokeColor).toEqual("red");
    });

    /*-------------------------------------------------------
     Polygon Tests
     -------------------------------------------------------- */

    it('should create a polygon without options', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polygon id="polygon1" paths="triangle"></my-polygon></my-map>');

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.getPaths().getArray()[0].b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[1].toUrlValue()).toEqual('32.87788,-117.237214');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[2].toUrlValue()).toEqual('32.875468,-117.232348');
    });

    it('should create a polygon with options', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polygon id="polygon1" paths="triangle" options="{strokeColor: \'red\'}"></my-polygon></my-map>');

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.getPaths().getArray()[0].b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[1].toUrlValue()).toEqual('32.87788,-117.237214');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[2].toUrlValue()).toEqual('32.875468,-117.232348');
        expect(polygonScope.polygon.strokeColor).toEqual("red");
    });

    it('should create polygon paths', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polygon id="polygon1" paths="triangle"></my-polygon></my-map>');

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        polygonScope.$digest();

        polygonScope.paths = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, scope.newCenter];

        polygonScope.$digest();
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.getPaths().getArray()[0].b[0].toUrlValue()).toEqual('32.880951,-117.233827');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[1].toUrlValue()).toEqual('32.87788,-117.237214');
        expect(polygonScope.polygon.getPaths().getArray()[0].b[2].toUrlValue()).toEqual('32.880951,-117.25');
    });

    it('should create polygon draggable', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polygon id="polygon1" paths="triangle"></my-polygon></my-map>');

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        polygonScope.$digest();

        polygonScope.options = {draggable: false};

        polygonScope.$digest();
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.draggable).toEqual(false);
    });

    it('should create polygon editable', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polygon id="polygon1" paths="triangle"></my-polygon></my-map>');

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        polygonScope.$digest();

        polygonScope.options = {editable: false};

        polygonScope.$digest();
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.editable).toEqual(false);
    });

    it('should create polygon visible', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polygon id="polygon1" paths="triangle"></my-polygon></my-map>');

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        polygonScope.$digest();

        polygonScope.options = {visible: false};

        polygonScope.$digest();
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.visible).toEqual(false);
    });

    it('should create polygon strokeColor', function(){
        scope.triangle = [scope.mapPos, {lat: 32.877880, lng: -117.237214 }, {lat: 32.875468, lng: -117.232348 }];

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-polygon id="polygon1" paths="triangle"></my-polygon></my-map>');

        var polygonScope = scope.$$childTail.$$childHead.$$childHead;
        polygonScope.$digest();

        polygonScope.options = {strokeColor: "red"};

        polygonScope.$digest();
        expect(polygonScope.polygon).toBeDefined();
        expect(polygonScope.polygon.strokeColor).toEqual("red");
    });

    /*-------------------------------------------------------
     Rectangle Tests
     -------------------------------------------------------- */

    it('should create a rectangle without options', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle"></my-rectangle></my-map>');

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.getBounds().toUrlValue()).toEqual('32.878531,-117.225922,32.882937,-117.222145');
    });

    it('should create a rectangle with options', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>');

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.getBounds().toUrlValue()).toEqual('32.878531,-117.225922,32.882937,-117.222145');
        expect(rectScope.rectangle.draggable).toEqual(true);
    });

    it('should change rectangle bounds', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>');

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        rectScope.$digest();

        rectScope.bounds = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.239278};

        rectScope.$digest();
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.getBounds().toUrlValue()).toEqual('32.878531,-117.239278,32.882937,-117.222145');
    });

    it('should change rectangle draggable', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>');

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        rectScope.$digest();

        rectScope.options = {draggable: false};

        rectScope.$digest();
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.draggable).toEqual(false);
    });

    it('should change rectangle editable', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>');

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        rectScope.$digest();

        rectScope.options = {editable: false};

        rectScope.$digest();
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.editable).toEqual(false);
    });

    it('should change rectangle visible', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>');

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        rectScope.$digest();

        rectScope.options = {visible: false};

        rectScope.$digest();
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.visible).toEqual(false);
    });

    it('should change rectangle strokeColor', function(){
        scope.rectangle = {north: 32.882937, south: 32.878531, east: -117.222145, west: -117.225922};

        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-rectangle id="rectangle1" bounds="rectangle" options="{draggable: true}"></my-rectangle></my-map>');

        var rectScope = scope.$$childTail.$$childHead.$$childHead;
        rectScope.$digest();

        rectScope.options = {strokeColor: "red"};

        rectScope.$digest();
        expect(rectScope.rectangle).toBeDefined();
        expect(rectScope.rectangle.strokeColor).toEqual("red");
    });


    /*-------------------------------------------------------
     Circle Tests
     -------------------------------------------------------- */

    it('should create a circle without options', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.getCenter().toUrlValue()).toEqual('32.880951,-117.233827');
        expect(circleScope.circle.radius).toEqual(1000);
    });

    it('should create a circle with options', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" options="{editable: true}"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.getCenter().toUrlValue()).toEqual('32.880951,-117.233827');
        expect(circleScope.circle.radius).toEqual(1000);
        expect(circleScope.circle.editable).toEqual(true);
    });

    it('should change circle center', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" options="{editable: true}"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        circleScope.$digest();
        circleScope.center = scope.newCenter;

        circleScope.$digest();
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.getCenter().toUrlValue()).toEqual('32.880951,-117.25');
    });

    it('should change circle radius', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" options="{editable: true}"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        circleScope.$digest();
        circleScope.radius = 500;

        circleScope.$digest();
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.radius).toEqual(500);
    });

    it('should change circle draggable', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" options="{editable: true}"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        circleScope.$digest();
        circleScope.options = {draggable: false};

        circleScope.$digest();
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.draggable).toEqual(false);
    });

    it('should change circle editable', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" options="{editable: true}"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        circleScope.$digest();
        circleScope.options = {editable: false};

        circleScope.$digest();
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.editable).toEqual(false);
    });

    it('should change circle visible', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" options="{editable: true}"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        circleScope.$digest();
        circleScope.options = {visible: false};

        circleScope.$digest();
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.visible).toEqual(false);
    });

    it('should change circle strokeColor', function(){
        createElem('<my-map center="center" zoom="zoom" options="mapOpt"><my-circle id="circle1" center="mapPos" radius="1000" options="{editable: true}"></my-circle></my-map>');

        var circleScope = scope.$$childTail.$$childHead.$$childHead;
        circleScope.$digest();
        circleScope.options = {strokeColor: "red"};

        circleScope.$digest();
        expect(circleScope.circle).toBeDefined();
        expect(circleScope.circle.strokeColor).toEqual("red");
    });

    it('should create a marker within a collection', function(){
        scope.$destroy();
        scope.markers = [{lat: 32.878665, lng: -117.240544}, {lat: 32.881143, lng: -117.237379}, {lat: 32.881810, lng: -117.233517}];

        var marker_div = document.createElement('div');
        marker_div.setAttribute("id", "testDiv");
        marker_div.innerHTML = '<my-map center="center" zoom="zoom" options="mapOpt"><my-marker ng-repeat="marker in markers" position="marker"></my-marker></my-map>';
        document.body.appendChild(marker_div);
        var markerElem = $compile(document.body)(scope);
        scope.$digest();

        console.log(scope);
        var markerScope = scope.$$childTail.$$childHead.$$childHead;
        // expect(markerScope.marker).toBeDefined();
        // expect(markerScope.marker.getPosition().toUrlValue()).toEqual('32.880951,-117.233827');

        // var testDiv = document.getElementById("testDiv");
        // testDiv.parentNode.removeChild(testDiv);
        // scope.$destroy();
    });
});
