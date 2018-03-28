var filters;
if (!filters) {
	filters = {};
}
var filters = (function (w, $) {

    var Filters = function(){
        var self = this;

        self.displayInput = function(name, isFromModal) {
          var modal = $('#modal');
          var filter = $('#' + name + '-filter');
          var filterHeight = $('#zip-filter').height();
          if (parseInt(filter.height()) === 0 && isFromModal) {
            filter.height(0);
            filter.removeClass('hidden');
            modal.animate({ height: modal.outerHeight() + filterHeight + 'px', top: modal.offset().top - 26 }, 250, 'linear');
            filter.animate({ height: filterHeight + 'px' }, 250);
          }
        };

        function hideInput(name){
            var modal = $('#modal');
            var filter = $('#' + name + '-filter');
            var filterHeight = filter.height();
            modal.animate({ height: modal.outerHeight() - filterHeight + 'px', top: modal.offset().top + 26 }, 250, 'linear');
            filter.animate({ height: 0 }, 250);
            filter.addClass('hidden');
        }

        function resetInput(name){
            document.getElementById(name + '-input-collapsed').value = 0;
            document.getElementById(name + '-input-modal').value = 0;
            localStorage.setItem('boa-' + name, 0);
        }

        self.handleInput = function(filterName, isFromModal){
            switch(filterName){
                case 'zip': 
                    if(isFromModal && $('#services-filter').height() > 0){
                        hideInput('services');
                    }
                    resetInput('demo');
                    resetInput('service');
                    //Write logic to populate demographics based on zip.
                    self.displayInput('demographics', isFromModal)
                    break;
                case 'demo':
                    resetInput('service');
                    //Write logic to populate services based on zip & demo
                    self.displayInput('services', isFromModal);
                    break;
                case 'service':
                    self.submitInput(isFromModal);
                    break;
                default: 
                    break;
            }
        }

        self.submitInput = function(isFromModal){
            if(isFromModal){
                var zip = document.getElementById('zip-input-modal').value;
                var demo = document.getElementById('demo-input-modal').value;
                var service = document.getElementById('service-input-modal').value;
                setAllFilters(zip, demo, service);
                modal.close();
            } else{
                var zip = document.getElementById('zip-input-collapsed').value;
                var demo = document.getElementById('demo-input-collapsed').value;
                var service = document.getElementById('service-input-collapsed').value;
                setAllFilters(zip, demo, service);
            }
        };

        self.setCollapsedFilters = function(zip, demo, service){
            setAllFilters(zip, demo, service);
        };

        self.refineSearch = function(){
            modal.display('filter-modal-content');
            $('.filter-modal-section').removeClass('hidden');

            var zip = document.getElementById('zip-input-collapsed').value || localStorage.getItem('boa-zip') || 0;
            if(lib.varExists(zip)){
                var demo = document.getElementById('demo-input-collapsed').value || localStorage.getItem('boa-demo') || 0;
                var service = document.getElementById('service-input-collapsed').value || localStorage.getItem('boa-service') || 0;
                setAllFilters(zip, demo, service);
            }

            modal.drop();
        };


        function setAllFilters(zip, demo, service){
            var inputObj = {
                'zip': zip,
                'demo': demo,
                'service': service
            }

            var value;

            Object.keys(inputObj).forEach(function(filterName, i){
                value = inputObj[Object.keys(inputObj)[i]] || 0;
                document.getElementById(filterName + '-input-collapsed').value = value;
                document.getElementById(filterName + '-input-modal').value = value;
                localStorage.setItem('boa-' + filterName, value);
            })
        }
    }

    var fil = new Filters();
    return { 
        displayInput: function(name) {
            fil.displayInput(name);
        }, 
        submitInput: function(isFromModal){
            fil.submitInput(isFromModal);
        },
        setCollapsedFilters: function(zip, demo, service){
            fil.setCollapsedFilters(zip, demo, service);
        },
        refineSearch: function(){
            fil.refineSearch();
        },
        handleInput: function(filterName, isFromModal){
            fil.handleInput(filterName, isFromModal);
        }
    };
})(window, window.jQuery);