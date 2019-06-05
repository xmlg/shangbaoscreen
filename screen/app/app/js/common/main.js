var app = angular.module("myApp",['ui.router','oc.lazyLoad']);
//暴露angularjs一些方法
// app.config(["$provide","$compileProvider","$controllerProvider","$filterProvider",function($provide,$compileProvider,$controllerProvider,$filterProvider){
//     app.controller = $controllerProvider.register;
//     app.directive = $compileProvider.directive;
//     app.filter = $filterProvider.register;
//     app.factory = $provide.factory;
//     app.service  =$provide.service;
//     app.constant = $provide.constant;
// }])
app.config(['$stateProvider','$ocLazyLoadProvider',function($stateProvider,$ocLazyLoadProvider){
    $stateProvider
        .state('mm',{
            url:'/mm',
            templateUrl:'view/myMsRele.html',
            controller:'myMsReleCtrl'
        })
        .state('cyh',{
            url:'/cyh',
            templateUrl:'view/cyhIndex.html',
            controller:'cyhInexController',
            resolve:{
                deps:['$ocLazyLoad',function($ocLazyLoad) {
                    $ocLazyLoad.load('css/screen/style.css');
                    $ocLazyLoad.load('css/screen/ringChart.css');
                    return $ocLazyLoad.load('js/controller/cyhIndex.js');
                }],
            }
        });
    // $urlRouterProvider.otherwise('/view/myMsRele');
}]);

// 'use strict';
// var app=angular.module('myApp',['ngRoute']);
// // 路由
// app.config(['$routeProvider', function($routeProvider){
//     $routeProvider
//         .when('/',{
//             templateUrl:'view/myMsRele.html',
//             controller:'myMsReleCtrl'
//         }).when("/cyhIndex",{
//             templateUrl:'view/cyhIndex.html',
//             controller:'cyhInexController'
//         })
// }]);