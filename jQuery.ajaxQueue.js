/**
 * jQuery.ajaxQueue
 * github.com/markreid/jqueryajaxqueue
 * built for jQuery 1.8+, may work with earlier
 *
 * Queues jQuery.ajax requests so they fire consecutively instead of in parallel.
 * Optionally provide a label for each request, and no more than one of each label
 * will be queued.  Adding a request with an existing label moves that request
 * to the back of the queue.
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

    // helpers, primarily for testing.
    $.fn.ajaxQueueGet = function(){
        return queue;
    };

    $.fn.ajaxQueueClear = function(){
        queue = [];
    };


    /**
     * Adds jQuery.ajax requests to a queue.
     * If provided with an optional label, will check the queue for existing requests
     * that match the label and move them to the back, rather than queueing up another.
     * @param  {Object} opts  jQuery.ajax options
     * @param  {String} label Label (optional)
     * @return {jQuery.Deferred.promise}
     */
    $.ajaxQueue = function (opts, label){
        var dfd = $.Deferred();
        var promise = dfd.promise();

        if(label && checkForLabel(label)) return queue[queue.length-1];

        dfd._ajaxQueue = {
            opts: opts,
            label: label
        };
        addToQueue(dfd);
        return promise;
    };

    /**
     * Check the queue for a request with a matching label, move it to the back of the queue
     * @param  {String} label   Label
     * @return {Boolean}        Match found?
     */
    var checkForLabel = function(label){
        var len, i = queue.length;
        while(i--){
            if(queue[i]._ajaxQueue.label === label){
                queue.push(queue.splice(i, 1)[0]);
                return true;
            }
        }
        return false;
    };

    /**
     * Push a request into the queue.  If it's the only one there, call makeRequest()
     * @param {Object} req  jQuery.Deferred
     * @return {Boolean}    Called stepQueue?
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
     * @return {Boolean}  Was request fired?
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