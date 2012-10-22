/**
 * jQuery.ajaxQueue
 * github.com/markreid/jqueryajaxqueue
 *
 * built for jQuery 1.8+, may work with earlier
 *
 * UMD wrapper by jburke
 * github.com/umdjs/umd
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var queue = [];

    // helper, mostly for testing.
    $.fn.ajaxQueueGet = function(){
        return queue;
    };

    $.fn.ajaxQueueClear = function(){
        queue = [];
    };

    $.ajaxQueue = function (opts, label){
        var dfd = $.Deferred();
        var promise = dfd.promise();

        if(label && checkForLabel(label)) return queue[queue.length-1];

        // attach the options and label to the promise, that's what we're going to put in the queue.
        dfd._ajaxQueue = {
            opts: opts,
            label: label
        };
        addToQueue(dfd);
        return promise;
    };

    var checkForLabel = function(label){
        // find a promise with this label in the queue.
        var len, i = queue.length;
        while(i--){
            if(queue[i]._ajaxQueue.label === label){
                console.log('matching label found at queue[%s]', i);
                queue.push(queue.splice(i, 1)[0]);
                return true;
            }
        }
    };

    /**
     * Push a request into the queue.  If it's the only one there, call makeRequest()
     * @param {Object} req  Deferred
     * @return {Boolean}    Did we call stepQueue
     */
    var addToQueue = function(dfd){
        queue.push(dfd);
        var len = queue.length;
        if(len !== 1) return false;
        stepQueue();
        return true;
    };

    /**
     * Fire a request for the first object in the queue
     * @return {Boolean}  Whether a request was fired or not
     */
    var stepQueue = function(){
        var dfd = queue[0];
        if(!dfd) return false;
        $.when($.ajax(dfd._ajaxQueue.opts)).done(dfd.resolve).fail(dfd.reject).then(completeHandler, completeHandler);
        return true;
    };

    /**
     * Remove the first object from the queue and if it's not empty call stepQueue()
     * @param  {Object} response    AJAX response
     * @param  {String} status      Request status
     * @param  {jqXHR} xhr          jqXHR object
     * @return {Void}
     */
    var completeHandler = function(response, status, xhr){
        queue = queue.slice(1);
        if(queue.length) stepQueue();
    };

}));