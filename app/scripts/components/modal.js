var modal;
if (!modal) {
	modal = {};
}
var modal = (function (w, $) {

    var Modal = function(){
        var self = this;

        self.init = function(){
            lib.doWhenExists('#modal', function(){self.modal = $('#modal');})
        };

        self.display = function(id){
            var content = $('#' + id);
            content.removeClass('hidden');
            self.modal[0].innerHTML = content.html();
        };

        self.drop = function() {
            $('#modal-container').removeClass('hidden');
            var leftPos = (window.innerWidth - self.modal.width()) / 2;
            var topPos = (window.innerHeight - self.modal.height()) / 2;
            self.modal.offset({ left: leftPos, top: 0 });
            self.modal.animate({ top: topPos + 20 }, 250, 'swing');
            self.modal.animate({ top: topPos - 10 }, 100);
            self.modal.animate({ top: topPos }, 50);
        };
        
        self.position = function() {
            var modal = $('#modal');
            var leftPos = (window.innerWidth - self.modal.width()) / 2;
            var topPos = (window.innerHeight - self.modal.height()) / 2;
            self.modal.offset({ left: leftPos, top: topPos });
        };
    }

var mod = new Modal();
return {
    init: function(){
        mod.init();
    },
    display: function(id){
        mod.display(id);
    },
    drop: function(){
        mod.drop();
    },
    position: function(){
        mod.position();
    }
}
})(window, window.jQuery);