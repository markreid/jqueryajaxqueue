beforeEach(function() {
  this.addMatchers({
    toBeIn: function(expected) {
      return expected.indexOf(this.actual) != -1
    }
  });
});