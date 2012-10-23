describe("ajaxQueue", function() {

  // this needs to be something that will work.
  var testopts = {
    url: 'https://api.twitter.com/1/statuses/user_timeline.json',
    data: {
      include_entities: true,
      include_rts: true,
      screen_name: 'twitterapi'
    },
    dataType: 'jsonp'
  };

  // this needs to be something that will fail.
  var badopts = {
    url: 'http://nowhere.net',
    dataType: 'json'
  };


  beforeEach(function() {
    $.fn.ajaxQueueClear();
  });

  it("Will only fire one request at a time", function(){
    var requests = 0;

    var newopts = {
      beforeSend: function(){
        requests++;
      }
    };

    var merged = $.extend(testopts, newopts);

    // queue three requests and count the number that have fired.
    $.ajaxQueue(merged);
    $.ajaxQueue(merged);
    $.ajaxQueue(merged);

    expect(requests).toBe(1);

  });

  describe("Request labelling", function(){

    var queue, req, index;

    beforeEach(function(){
        $.fn.ajaxQueueClear();
        $.ajaxQueue(testopts, 'alpha');
        queue = $.fn.ajaxQueueGet();
        index = queue.length-1;
        req = queue[index];
    });

    it("Won't add a request to the queue if there is already one with the same label", function(){
        var length = queue.length;

        $.ajaxQueue(testopts, 'testlabel');
        $.ajaxQueue(testopts, 'testlabel');
        $.ajaxQueue(testopts, 'testlabel');

        expect($.fn.ajaxQueueGet().length).toBe(length+1);

    });


    it("Will remove a matching labelled request from its position in the queue", function(){
        $.ajaxQueue(testopts);
        $.ajaxQueue(testopts);
        $.ajaxQueue(testopts);
        $.ajaxQueue(testopts, 'alpha');

        expect(queue[index]).not.toBe(req);
    });

    it("Will move a matching labelled request to the end of the queue", function(){
        $.ajaxQueue(testopts, 'beta');
        $.ajaxQueue(testopts, 'gamma');
        $.ajaxQueue(testopts, 'alpha');

        expect(queue[queue.length-1]).toBe(req);
    });

    });

  describe("Asynchronous Specs", function(){

    beforeEach(function(){
      $.fn.ajaxQueueClear();
    });

    it("Will resolve the promise on successful completion", function(){
          var req;

          runs(function(){
            req = $.ajaxQueue(testopts);
          });

          waitsFor(function(){
            return req.state() === 'resolved';
          }, 'req.isResolved false', 10000);

          runs(function(){
            expect(req.state()).toBe('resolved');
          });
    });

    it("Will reject the promise on a failure", function(){
      var req;
      runs(function(){
        req = $.ajaxQueue(badopts);
      });

      waitsFor(function(){
        return req.state() === 'rejected';
      }, 'req.isRejected false', 10000);

      runs(function(){
        expect(req.state()).toBe('rejected');
      });

    });

    it("Will remove a request from the queue once it's been completed", function(){

        var queue, length, first;

        runs(function(){
            first = $.ajaxQueue(testopts);
            $.ajaxQueue(testopts);
            $.ajaxQueue(testopts);
            $.ajaxQueue(testopts);
            queue = $.fn.ajaxQueueGet();
            length = queue.length;

        });

        waitsFor(function(){
            return first.state() !== 'pending';
        }, 'always pending', 10000);

        runs(function(){
            // setTimeout or it jumps in too quickly.
            setTimeout(function(){
              expect(queue.length).toBe(length-1);
            }, 0);

        });

    })

  });
});