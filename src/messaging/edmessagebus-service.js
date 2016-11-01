angular.module('ed.messaging', ['ed.events'])

.factory("edMessageBus", function($rootScope, edEventBus) {
    'use strict';
    var edMessageBusInstance = {

        emit: function(eventName, payLoad) {
            edEventBus.emit(eventName, payLoad, $rootScope);
        },
        on: function(eventName, func, contextScope) {
            edEventBus.on(eventName, func, $rootScope, contextScope);
        },
        off: function(eventName, func) {
            edEventBus.off(eventName, func, $rootScope);
        }
    };
    return edMessageBusInstance;
});
