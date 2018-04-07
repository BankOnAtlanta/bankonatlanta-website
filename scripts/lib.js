var lib;
if (!lib) {
	lib = {};
}
var lib = (function (w, $) {

    var Library = function(){
        var self = this;

        //This function performs a specified action once a jquery object is
        //available. Pass in the selector to wait for. It terminates after
        //10 seconds of looking to avoid an endless interval/memory leak.
        self.doWhenExists = function(selector, action, intervalMs) {
            intervalMs = (self.varExists(intervalMs)) ? intervalMs : 25;
            var time = 0;
            var awaiter = setInterval(function () {
                time += intervalMs;
                if (self.varExists($(selector)[0])){
                    action();
                    clearInterval(awaiter);
                }

                if(time >= 10000){
                    clearInterval(awaiter);
                }
            }, intervalMs);
        };
        
        //Returns true if the variable passed in exists.
        //False if it is null or undefined.
        self.varExists = function(variable){
            return (variable !== undefined && variable !== null);
        }
    }

    var library = new Library();
    return {
        doWhenExists: function(selector, action, intervalMs){
            library.doWhenExists(selector, action, intervalMs);
        },
        varExists: function(variable){
            return library.varExists(variable);
        }
    }
})(window, window.jQuery);