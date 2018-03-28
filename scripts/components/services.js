var services;
if (!services) {
	services = {};
}
var services = (function (w, $) {

    var Services = function(){
        var self = this;

        self.init = function(){
            sizePage();
        }

        function sizePage(){
            var body = $('body');
            var remainingHeight = window.innerHeight - body.children().outerHeight() + 'px';
            $('#services-page').height(remainingHeight);
        }
    }

    var serv = new Services();
    return { 
        init: function(){
            serv.init();
        }
    };
})(window, window.jQuery);