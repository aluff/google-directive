/**
 * Created by Amanda on 10/13/2016.
 */
'use strict';

angular.module('myApp.mainView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/mainView', {
            templateUrl: 'mainView/mainView.html',
            controller: 'MainViewCtrl'
        });
    }])

    .controller('MainViewCtrl', ['$scope', function($scope) {
        $scope.listStr = "cat,dog";
    }])
    .directive('myListDir', function() {
        function link(scope, element, attrs){

            function updateList(value){
                var oldUl = document.getElementById("myListUl");
                if ( oldUl ) {
                    element[0].removeChild(oldUl);
                }
                var ul = document.createElement("ul");
                ul.setAttribute("id", "myListUl");
                value.split(',').forEach(function(item){
                    var li = document.createElement("li");
                    li.appendChild(document.createTextNode(item));
                    element[0].appendChild(ul);
                    ul.appendChild(li);
                });
            };

            scope.$watch('myListDir', function(value){
                updateList(value)
            }, true);
        }
        return {
            restrict: 'A',
            scope:{
                myListDir: '@'
            },
            link: link
        };
    });