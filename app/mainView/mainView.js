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
        $scope.listAdd = '';
        $scope.listRemove = '';
        $scope.listArr = [];

        $scope.addToList =function (item){
          $scope.listArr.push(item);
        };

        $scope.removeFromList =function (item){
            var removeIdx = $scope.listArr.indexOf(item);
            if (removeIdx != -1){
                $scope.listArr.splice(removeIdx, 1);
            }
        };

        $scope.changeInList =function (){
            $scope.listArr[1] = "foo";
        };
    }])
    .directive('myListDir', function() {
        function link(scope, element, attrs){

            function addList(item, index){
                var ul = document.getElementById("myListUl");
                var li = document.createElement("li");
                li.setAttribute("id", "li" + index);
                li.appendChild(document.createTextNode(item));
                ul.appendChild(li);
            }

            function updateList(item, index){
                var li = document.getElementById("li" +  index);
                li.innerHTML = item;
            }

            function removeList(index){
                var ul = document.getElementById("myListUl");
                var li = document.getElementById("li" + index);
                ul.removeChild(li);
            }

            scope.$watchCollection('listarr', function(newValues, oldValues){
                if (newValues && oldValues) {
                    newValues.forEach(function (item, index) {
                        if (index < oldValues.length && item != oldValues[index]) {
                            updateList(item, index);
                        }
                        else if (index >= oldValues.length) {
                            addList(item, index);
                        }
                    });

                    for (var removeIdx = newValues.length; removeIdx < oldValues.length; removeIdx++) {
                        removeList(removeIdx);
                    }
                }
            });
        }
        return {
            restrict: 'E',
            scope:{
                listarr: '='
            },
            template: "<div id='myListDiv'><ul id='myListUl'></ul></div>",
            link: link
        };
    });