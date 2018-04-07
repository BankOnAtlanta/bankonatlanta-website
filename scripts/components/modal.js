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

        self.drop = function(isFirstTimeOpened) {
            $('#modal-container').removeClass('hidden');
            if(isFirstTimeOpened){
                $('#modal-close-button').hide();
            } else{
                $('#modal-close-button').show();
            }
            var leftPos = (window.innerWidth - self.modal.outerWidth()) / 2;
            var topPos = (window.innerHeight - self.modal.outerHeight()) / 2;
            self.modal.offset({ left: leftPos, top: (-1) * self.modal.outerHeight() });
            self.modal.animate({ top: topPos + 20 }, 250, 'swing');
            self.modal.animate({ top: topPos - 10 }, 100);
            self.modal.animate({ top: topPos }, 50);
        };
        
        self.position = function() {
            var leftPos = (window.innerWidth - self.modal.outerWidth()) / 2;
            var topPos = (window.innerHeight - self.modal.outerHeight()) / 2;
            self.modal.offset({ left: leftPos, top: topPos });
        };

        self.close = function(){
            var topPos = (-1) * self.modal.outerHeight();
            self.modal.animate({ top: self.modal.offset().top + 10 }, 100);
            self.modal.animate({top: topPos}, 250, 'swing', function(){
                $('#modal-container').addClass('hidden');
            })
        }
    }

var mod = new Modal();
return {
    init: function(){
        mod.init();
    },
    display: function(id){
        mod.display(id);
    },
    drop: function(isFirstTimeOpened){
        mod.drop(isFirstTimeOpened);
    },
    position: function(){
        mod.position();
    },
    close: function(){
        mod.close();
    }
}
})(window, window.jQuery);