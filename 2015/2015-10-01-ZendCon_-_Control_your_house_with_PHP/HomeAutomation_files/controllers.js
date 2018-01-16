/* global angular, document, window */
'use strict';

angular.module('starter.controllers', ['config',  'highcharts-ng'])

.controller(["highchartsNG", function(highchartsNG){
// do anything you like
// ...
highchartsNG.ready(function(){
  // init chart config, see lazyload example
},this);
}])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('Qm4Ctrl', function($scope, $stateParams, $timeout, $location, $ionicPopup, ionicMaterialMotion, ionicMaterialInk, $ionicLoading, HouseService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    $ionicLoading.show({
		template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div>'
    });
    
    HouseService.rooms().success(function (response) {
		$scope.rooms = response;
		$ionicLoading.hide();
		$timeout(function() {
	        ionicMaterialMotion.fadeSlideIn({
	            selector: '.animate-fade-slide-in .item'
	        });
	    }, 1);
	}).error(function (response) {
		$ionicPopup.alert({
            title: "Cannot reach Backend.\nPlease check the settings.",
            template: ''
        });
		$location.path("/app/settings");
		$ionicLoading.hide();
	});
    
    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('RoomCtrl', function($scope, $interval, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicLoading, HouseService, knxService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    var bgImgInterval = function(interval) {
    	$interval(function() {
    		$scope.roomBg = $scope.roomBg.split("&uid")[0] + "&uid=" + (new Date()).getTime();
    	}, interval);
    }

    HouseService.getRoomDevices($stateParams.roomId).success(function (response) {
    	$scope.items = ($stateParams.fullControl) ? response.advanced : response.basic;
    	
    	$scope.roomLabel = response.label;
    	$scope.roomBg = response.bg_room_img;
    	$scope.roomAvatar = response.avatar;
    	
    	var cams = response.camera;
    	for (var camId in cams) {
    		if (cams[camId].use_as_bg) $scope.roomBg = cams[camId].jpeg;
    		$scope.camera = {"available": true};
    		bgImgInterval(cams[camId].interval);
    	}
    	
		$ionicLoading.hide();
		
		for (var itemId in $scope.items) {
			$scope.setState($scope.items[itemId]['openHabId'], $scope.items[itemId]['type']);
		}
		$timeout(function() {
			ionicMaterialMotion.fadeSlideInRight({
	            startVelocity: 3000
	        });
	    }, 700);
	});
    
    $ionicLoading.show({
		template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div>'
    });
    
    $scope.roomId = $stateParams.roomId;
    $scope.roomLabel = $stateParams.roomLabel;
    $scope.roomBg = $stateParams.roomBg;
    $scope.roomAvatar = $stateParams.roomAvatar;

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);
    
    $scope.setState = function(openHabId, type) {
    	if (type == 'switch') {
	    	knxService.getState(openHabId).success(function (response) {
				$scope.items[openHabId].checked = (response == 'ON') ? true : false;
			});
    	}
    	else if (type == 'dimmer') {
	    	knxService.getState(openHabId).success(function (response) {
				$scope.items[openHabId].value = response;
			});
    	}
    }

	$scope.switchLights = function(item) {
		var value = (item.checked ? 'ON' : 'OFF'); 
		knxService.write(item.openHabId, value).success(function (response) {
		});
	}
	
	$scope.dimLights = function(item) {
		knxService.write(item.openHabId, item.value).success(function (response) {
		});
	}
	
	$scope.shutterControl = function (item, command) {
		knxService.write(item.openHabId, command).success(function (response) {
		});
	}

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('TemperatureCtrl', function($scope, $timeout, $stateParams, ionicMaterialMotion, ionicMaterialInk, HouseService, TemperatureCollectorService, knxService) {
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);
    
    HouseService.getTemperatureMeta($stateParams.roomId).success(function (response) {
    	knxService.getState(response.openHabId).success(function (response) {
    		$scope.temperatureValue = Math.round(response * 10) / 10 ;
    	});
        
        knxService.getState(response.heating.openHabId).success(function (response) {
    		$scope.heatingState = response;
    	});
	});
    
    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'spline'
            },
            loading: {
                hideDuration: 1000,
                showDuration: 1000
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    minute: '%H:%M'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Temperature'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%H:%M}: {point.y:.2f} °C'
            }
        },
        series: [],
        title: {
            text: 'Temperature'
        },
        loading: false
    }
    
    $scope.highchartsNG.loading = true;
    $scope.seriesName = $stateParams.roomId;
    
	$scope.setTemperatureLine = function (roomId, roomLabel, timeRange) {
		TemperatureCollectorService.get(roomId, timeRange).success(function (response) {
			$scope.highchartsNG.loading = false;
			
			$scope.highchartsNG.series.push({
		    	name: roomLabel,
		        data: response
		    });
		});
	}
	
	$scope.drawTemperatureLines = function (timeRange) {
		$scope.highchartsNG.loading = true;
		var chart = $scope.highchartsNG.getHighcharts();
		while (chart.series.length > 0) {
			chart.series[0].remove();
		}
		$scope.highchartsNG.series = []
		$scope.setTemperatureLine($stateParams.roomId, $stateParams.roomLabel, timeRange);
		$scope.setTemperatureLine('outside', 'outside', timeRange);
	}
	
	$scope.setTemperatureLine($stateParams.roomId, $stateParams.roomLabel, '1 day');
	$scope.setTemperatureLine('outside', 'outside', '1 day');
	
    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('CameraCtrl', function($scope, $interval, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, $ionicLoading, HouseService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    var camImgInterval = function(camId, interval) {
    	$interval(function() {
    		$scope.cameras[camId].jpeg = $scope.cameras[camId].jpeg.split("&uid")[0] + "&uid=" + (new Date()).getTime();
    	}, interval);
    }
    
    HouseService.getRoomDevices($stateParams.roomId).success(function (response) {
    	$scope.roomLabel = response.label;
    	
    	$scope.cameras = response.camera;
    	
    	for (var camId in $scope.cameras) {
    		camImgInterval(camId, $scope.cameras[camId].interval);
    	}
    	
		$ionicLoading.hide();
		
		$timeout(function() {
		    ionicMaterialMotion.fadeSlideInRight({
		        selector: '.animate-fade-slide-in .item'
		    });
	    }, 700);
	});
    
    $ionicLoading.show({
		template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div>'
    });
    
    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });

})

.controller('FlowCtrl', function($scope, $timeout, $stateParams, ionicMaterialMotion, ionicMaterialInk, $ionicPopup, $ionicLoading, HouseService, MsgService, $websocket, $localStorage) {
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    $scope.roomLabel = '';
    
    $scope.roomId = null;
    if ($stateParams.roomId) {
    	$scope.roomId = $stateParams.roomId;
    	$scope.roomLabel = $stateParams.roomLabel;
    }

    $ionicLoading.show({
		template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div>'
    });
    
    HouseService.getFlows($scope.roomId).success(function (response) {
		$scope.flows = response;
		$ionicLoading.hide();
		$timeout(function() {
			ionicMaterialMotion.fadeSlideInRight({
	            startVelocity: 3000
	        });
	    }, 700);
	});
    
    $scope.publishMqtt = function(topic, payload) {
        $ionicLoading.show({
    		template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div>'
        });
        $scope.topic = topic;
		$scope.payload = payload;
    	MsgService.publishMqtt(topic, payload).success(function (response) {
    		$scope.showPopup();
    	}).error(function (response) {
    		console.log(response);
    	});

        $scope.waitForFlowResponse();
    } 
    
    $scope.showPopup = function() {
    	$ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Flow \'' + $scope.payload + '\' started!',
            template: ''
        });
        
        $timeout(function() {
        	ionicMaterialInk.displayEffect();
        }, 0);
    };
    
    $scope.waitForFlowResponse = function() {
    	var ws = $websocket.$new($localStorage.nodeRedUrl + '/ws/flow');

        ws.$on('flowresponse', function (message) { // it listents for 'incoming event'
        	var alertPopup = $ionicPopup.alert({
                title: 'Message from Flow \'' + $scope.payload + '\':<br />' + message,
                template: ''
            });
        });
    }

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('CheckCtrl', function($scope, $timeout, $stateParams, ionicMaterialMotion, ionicMaterialInk, $ionicPopup, $ionicLoading, HouseService, knxService) {
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    $scope.roomLabel = '';
    
    $scope.checkId = null;
    if ($stateParams.checkId) {
    	$scope.checkId = $stateParams.checkId;
    }

    $ionicLoading.show({
		template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div>'
    });
    
    HouseService.getChecks($scope.checkId).success(function (response) {
		$scope.checks = response;
		$scope.checkitems = response.items;
		
		for (var itemId in $scope.checkitems) {
			$scope.setState($scope.checkitems[itemId]['openHabId'], $scope.checkitems[itemId]['type']);
		}
		
		$ionicLoading.hide();
		
		$timeout(function() {
			ionicMaterialMotion.fadeSlideInRight({
	            startVelocity: 3000
	        });
	    }, 700);
	});
    
    $scope.setState = function(openHabId, type) {
    	knxService.getState(openHabId).success(function (response) {
    		var item = $scope.checkitems.find( function (item) { return item.openHabId === openHabId; });
    		item.statusOk = true;
    		
    		if (type == 'switch') {
    			item.checked = (response == 'ON') ? true : false;
			}
    		else if (type == 'dimmer') {
    			item.value = response;
    		}
    		
    		if (response != item.shouldBe) item.statusOk = false;
    	})
    	.error(function (response) {
    		var item = $scope.checkitems.find( function (item) { return item.openHabId === openHabId; });
    		item.notOk = true;
    	});
    }
    
	$scope.switchLights = function(item) {
		var value = (item.checked ? 'ON' : 'OFF'); 
		knxService.write(item.openHabId, value).success(function (response) {
			$scope.setState(item.openHabId, item.type);
		});
	}
	
	$scope.dimLights = function(item) {
		knxService.write(item.openHabId, item.value).success(function (response) {
			$scope.setState(item.openHabId, item.type);
		});
	}
	
	$scope.shutterControl = function (item, command) {
		knxService.write(item.openHabId, command).success(function (response) {
			$scope.setState(item.openHabId, item.type);
		});
	}
    
    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('StatsCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, TemperatureCollectorService, HouseService) {
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);
    
    $scope.highchartsNG = {
            options: {
                chart: {
                    type: 'spline'
                },
                loading: {
                    hideDuration: 1000,
                    showDuration: 1000
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        minute: '%H:%M'
                    },
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Temperature'
                    },
                    min: 15
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:%H:%M}: {point.y:.2f} °C'
                }
            },
            series: [],
            title: {
                text: 'Temperature'
            },
            loading: false
        }
        
        $scope.highchartsNG.loading = true;
    	$scope.setChartLine = function(roomId, roomLabel) {
    		TemperatureCollectorService.get(roomId, '1 day').success(function (response) {
	    		$scope.highchartsNG.loading = false;
	    		$scope.highchartsNG.series.push({
	    	    	name: roomLabel,
	    	        data: response
	    	    })
	    	});
    	}
    	
    	HouseService.rooms().success(function (response) {
    		$scope.rooms = response;
    		//$ionicLoading.hide();
    		for (var roomId in response) {
    			$scope.setChartLine(roomId, response[roomId].label);
    		}
    	});
    	
        ionicMaterialInk.displayEffect();
})

.controller('PresenceCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, $ionicLoading, HouseService) {
	$scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    
    $ionicLoading.show({
		template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div>'
    });
    
    HouseService.getPresence().success(function (response) {
    	$scope.presence = response;
    	
    	$ionicLoading.hide();
		
    	$timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 500);
    });
    
    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('SettingsCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, $ionicPopup, $localStorage) {
    $scope.$parent.clearFabs();
    $scope.formData = {};

    $scope.load = function() {
        $scope.formData.openhabUrl = $localStorage.openhabUrl;
        $scope.formData.apigilityUrl = $localStorage.apigilityUrl;
        $scope.formData.nodeRedUrl = $localStorage.nodeRedUrl;
    }
    
    $scope.submit = function() {
    	$localStorage.openhabUrl = $scope.formData.openhabUrl;
    	$localStorage.apigilityUrl = $scope.formData.apigilityUrl;
    	$localStorage.nodeRedUrl = $scope.formData.nodeRedUrl;
    	var alertPopup = $ionicPopup.alert({
            title: 'saved!',
            template: ''
        });
    }
    
    $scope.load();
    
    ionicMaterialInk.displayEffect();
})

;
