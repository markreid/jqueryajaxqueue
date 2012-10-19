/**
 * jQuery.ajaxQueue
 * github.com/markreid/jqueryajaxqueue
 *
 * implements UMD wrapper by jburke
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
    $.fn.ajaxQueue = function (){

    };
}));