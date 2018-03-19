var lib;
if (!lib) {
	lib = {};
}
var lib = (function (w, $) {

    var Library = function(){
        var self = this;

        self.doWhenExists = function(selector, action, intervalMs) {
            intervalMs = (self.varExists(intervalMs)) ? intervalMs : 25;
            var awaiter = setInterval(function () {
                if (self.varExists($(selector)[0])){
                    action();
                    clearInterval(awaiter);
                }
            }, intervalMs);
        };
        
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
            return library.varExists(library);
        }
    }
})(window, window.jQuery);