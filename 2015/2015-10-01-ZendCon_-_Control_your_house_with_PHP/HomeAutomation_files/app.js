// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'ionic-material', 'ionMdInput', 'ngWebsocket', 'ngStorage'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(['highchartsNGProvider', function (highchartsNGProvider) {
	highchartsNGProvider.lazyLoad();
}])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    
    .state('app.qm4', {
        url: '/qm4',
        views: {
            'menuContent': {
                templateUrl: 'templates/qm4.html',
                controller: 'Qm4Ctrl',
                resolve: {factory: checkRouting}
            },
        }
    })
    
    .state('app.room', {
        url: '/room/:roomId/:roomLabel/:roomBg/:roomAvatar',
        views: {
            'menuContent': {
                templateUrl: 'templates/room.html',
                controller: 'RoomCtrl'
            }
        }
    })
    
    .state('app.roomadvanced', {
        url: '/roomadvanced/:roomId/:fullControl',
        views: {
            'menuContent': {
                templateUrl: 'templates/roomadvanced.html',
                controller: 'RoomCtrl'
            }
        }
    })
    
    .state('app.temperature', {
        url: '/temperature/:roomId/:roomLabel',
        views: {
            'menuContent': {
                templateUrl: 'templates/temperature.html',
                controller: 'TemperatureCtrl'
            }
        }
    })
    
    .state('app.camera', {
        url: '/camera/:roomId',
        views: {
            'menuContent': {
                templateUrl: 'templates/camera.html',
                controller: 'CameraCtrl'
            }
        }
    })
    
    .state('app.flow', {
        url: '/flow/:roomId?/:roomLabel?',
        views: {
            'menuContent': {
                templateUrl: 'templates/flow.html',
                controller: 'FlowCtrl'
            }
        }
    })
    
    .state('app.check', {
        url: '/check',
        views: {
            'menuContent': {
                templateUrl: 'templates/check.html',
                controller: 'CheckCtrl'
            }
        }
    })
    
    .state('app.checkitems', {
        url: '/check/:checkId?',
        views: {
            'menuContent': {
                templateUrl: 'templates/checkitems.html',
                controller: 'CheckCtrl'
            }
        }
    })
    
    .state('app.presence', {
        url: '/presence',
        views: {
            'menuContent': {
                templateUrl: 'templates/presence.html',
                controller: 'PresenceCtrl'
            }
        }
    })
    
    .state('app.stats', {
        url: '/stats',
        views: {
            'menuContent': {
                templateUrl: 'templates/stats.html',
                controller: 'StatsCtrl'
            }
        }
    })
    
    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/qm4');
});

var checkRouting = function ($q, $rootScope, $location, $localStorage) {
	var apigilityUrl = $localStorage.apigilityUrl;
	var openhabUrl = $localStorage.openhabUrl;
	var nodeRedUrl = $localStorage.nodeRedUrl;
    if (apigilityUrl && openhabUrl && nodeRedUrl) {
        return true;
    } 

    $location.path("/app/settings");
};
