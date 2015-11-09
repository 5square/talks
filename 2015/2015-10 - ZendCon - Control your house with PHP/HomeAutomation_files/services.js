angular.module('starter.services', [])

.factory('knxService', function($http, $localStorage) {
	 
    var knxApi = {};
    var API_HOST = $localStorage.openhabUrl;

    knxApi.write = function(openHabId, value) {
    	var url = API_HOST + '/rest/items/' + openHabId;
    	
    	return $http({
    	    method: 'POST',
    	    headers: { 'Content-Type': 'text/plain'},
    	    data: value,
    	    url: url
    	});
    };
    
    knxApi.getState = function(openHabId) {
    	var url = API_HOST + '/rest/items/' + openHabId + '/state';
    	
    	return $http({
    	    method: 'GET',
    	    headers: { 'Content-Type': 'text/plain'},
    	    url: url
    	});
    };
    
    return knxApi;
})

.factory('TemperatureCollectorService', function($http, $localStorage) {
	 
    var TemperatureCollectorApi = {};
    var APIGILITY_HOST = $localStorage.apigilityUrl;
    
    TemperatureCollectorApi.get = function(roomId, timeRange) {
    	var url = APIGILITY_HOST + '/knx_info?type=temperature&room=' + roomId + "&timeRange=" + timeRange;
    	
    	return $http({
    	    method: 'GET',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url
    	});
    };
    
    return TemperatureCollectorApi;
})

.factory('MsgService', function($http, $localStorage) {
	 
    var MsgApi = {};
    var APIGILITY_HOST = $localStorage.apigilityUrl;

    MsgApi.publishMqtt = function(topic, payload) {
    	var url = APIGILITY_HOST + '/mqtt';
    	
    	return $http({
    	    method: 'POST',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url,
    	    data: '{"topic": "' + topic +'", "msg": "' + payload + '"}'
    	});
    };
    
    return MsgApi;
})

.factory('HouseService', function($http, $localStorage) {
	 
    var HouseApi = {};
    var APIGILITY_HOST = $localStorage.apigilityUrl;

    HouseApi.rooms = function() {
    	var url = APIGILITY_HOST + '/rooms';
    	
    	return $http({
    	    method: 'GET',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url
    	});
    };
    
    HouseApi.getRoomDevices = function(roomId) {
    	var url = APIGILITY_HOST + '/rooms/' + roomId;
    	
    	return $http({
    	    method: 'GET',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url
    	});
    };
    
    HouseApi.getFlows = function(roomId) {
    	var url = APIGILITY_HOST + '/flow';
    	if (roomId) url += "?roomId=" + roomId;
    	
    	return $http({
    	    method: 'GET',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url
    	});
    };
    
    HouseApi.getChecks = function(checkId) {
    	var url = APIGILITY_HOST + '/check';
    	if (checkId) url += "/" + checkId;
    	
    	return $http({
    	    method: 'GET',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url
    	});
    };
    
    HouseApi.getPresence = function() {
    	var url = APIGILITY_HOST + '/presence';

    	return $http({
    	    method: 'GET',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url
    	});
    };
    
    HouseApi.getTemperatureMeta = function(roomId) {
    	var url = APIGILITY_HOST + '/temperature/' + roomId;
    	
    	return $http({
    	    method: 'GET',
    	    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
    	    url: url
    	});
    };
    
    
    return HouseApi;
})
;

angular.module("ConsoleLogger", [])
.factory("PrintToConsole", ["$rootScope", function ($rootScope) {
    var handler = { active: false };
    handler.toggle = function () { handler.active = !handler.active; };
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (handler.active) {
            console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
            console.log(arguments);
        };
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        if (handler.active) {
            console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
            console.log(arguments);
        };
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (handler.active) {
            console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
            console.log(arguments);
        };
    });
    $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
        if (handler.active) {
            console.log("$viewContentLoading --- event, viewConfig");
            console.log(arguments);
        };
    });
    $rootScope.$on('$viewContentLoaded', function (event) {
        if (handler.active) {
            console.log("$viewContentLoaded --- event");
            console.log(arguments);
        };
    });
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        if (handler.active) {
            console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
            console.log(arguments);
        };
    });
    return handler;
}]);