jQuery.ajaxQueue
===============

A simple jQuery plugin to allow queueing of ajax requests so they are fired consecutively, rather than in parallel.
A request can optionally be labelled, and only one instance of each label will be added to the queue.
If a request with a matching label exists in the queue, it will be moved to the end.