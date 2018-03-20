var filters;
if (!filters) {
	filters = {};
}
var filters = (function (w, $) {

    var Filters = function(){
        var self = this;

        self.displayInput = function(name) {
          var modal = $("#modal");
          var filter = $("#" + name + "-filter");
          var filterHeight = $("#zip-filter").height();
          if (parseInt(filter.height()) === 0) {
            filter.height(0);
            filter.removeClass("hidden");
            modal.animate({ height: modal.outerHeight() + filterHeight + "px", top: modal.offset().top - 26 }, 250, "linear");
            filter.animate({ height: filterHeight + "px" }, 250);
          }
        };

        self.handleInput = function(filterName, isFromModal){
            switch(filterName){
                case 'zip': 
                    //Write logic to populate demographics based on zip.
                    self.displayInput('demographics')
                    break;
                case 'demo':
                    //Write logic to populate services based on zip & demo
                    self.displayInput('services');
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
                var service = document.getElementById('services-input-modal').value;
                self.setCollapsedFilters(zip, demo, service);

                modal.close();
                localStorage.setItem('boa-zip', zip);
                localStorage.setItem('boa-demo', demo);
                localStorage.setItem('boa-service', service);
            }
        };

        self.setCollapsedFilters = function(zip, demo, service){
            document.getElementById('zip-input-collapsed').value = zip;
            document.getElementById('demo-input-collapsed').value = demo;
            document.getElementById('services-input-collapsed').value = service;
        };

        self.refineSearch = function(){
            modal.display('filter-modal-content');
            $('.filter-modal-section').removeClass('hidden');

            var zip = document.getElementById('zip-input-collapsed').value || localStorage.getItem('boa-zip') || 0;
            if(lib.varExists(zip)){
                var demo = document.getElementById('demo-input-collapsed').value || localStorage.getItem('boa-demo') || 0;
                var service = document.getElementById('services-input-collapsed').value || localStorage.getItem('boa-service') || 0;
                document.getElementById('zip-input-modal').value = zip;
                document.getElementById('demo-input-modal').value = demo;
                document.getElementById('services-input-modal').value = service;
            }

            modal.drop();
        };
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