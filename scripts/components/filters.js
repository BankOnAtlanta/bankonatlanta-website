var filters;
if (!filters) {
	filters = {};
}
var filters = (function (w, $) {

    var Filters = function(){
        var self = this;
        self.uniqueZips;
        self.zipIsInitialized = false;
        self.seedData;

        self.init = function(){
            self.seedData = repo.getData();
            var zipArray = $.map(self.seedData, function(service){
                return service.zip;                
            });
            self.uniqueZips = zipArray.filter(onlyUnique).sort();
        };

        self.initZipDropdowns = function() {
            var collapsedZipDropdown = getDropdown('zip','collapsed');
            var modalZipDropdown = getDropdown('zip','modal');
            var option;
            self.uniqueZips.forEach(function(uniqueZip) {
                option = createElement('option', uniqueZip, uniqueZip);
                collapsedZipDropdown.appendChild(option);

                option = createElement('option', uniqueZip, uniqueZip);
                modalZipDropdown.appendChild(option);
            });
            self.zipIsInitialized = true;
        };

        self.displayInput = function(name, isFromModal) {
          var filterModal = $('#modal');
          var filter = $('#' + name + '-filter');
          var filterHeight = $('#zip-filter').height();
          if (parseInt(filter.height()) === 0 && isFromModal) {
            filter.height(0);
            filter.removeClass('hidden');
            filterModal.animate({ height: filterModal.outerHeight() + filterHeight + 'px', top: filterModal.offset().top - 26 }, 250, 'linear');
            filter.animate({ height: filterHeight + 'px' }, 250);
          }
        };

        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        function hideInput(name){
            var filterModal = $('#modal');
            var filter = $('#' + name + '-filter');
            var filterHeight = filter.height();
            filterModal.animate({ height: filterModal.outerHeight() - filterHeight + 'px', top: filterModal.offset().top + 26 }, 250, 'linear');
            filter.animate({ height: 0 }, 250);
            filter.addClass('hidden');
        }

        function resetInput(name){
            var collapsedDropdown = $('#' + name + '-input-collapsed');
            var modalDropdown = $('#' + name + '-input-modal');

            //Empty the dropdowns
            collapsedDropdown.empty();
            modalDropdown.empty();

            //Add the default option back
            var optionZero = createElement('option', 0, ' -- Select an Option -- ');
            collapsedDropdown.append(optionZero);
            optionZero = createElement('option', 0, ' -- Select an Option -- ');
            modalDropdown.append(optionZero);

            //Set to default option
            collapsedDropdown.value = 0;
            modalDropdown.value = 0;
            localStorage.setItem('boa-' + name, 0);
        }

        self.handleInput = function(filterName, isFromModal){
            var value;
            var dropdown;
            switch(filterName){
                case 'zip': 
                    resetInput('demo');
                    
                    if(isFromModal && $('#services-filter').height() > 0){
                        hideInput('services');
                    }

                    dropdown = isFromModal ? getDropdown(filterName, 'modal') : getDropdown(filterName, 'collapsed');
                    value = dropdown.options[dropdown.selectedIndex].value;
                    localStorage.setItem('boa-' + filterName, value);
                    populateDemoInput(value);
                    resetInput('service');
                    
                    //Write logic to populate demographics based on zip.
                    self.displayInput('demographics', isFromModal)
                    break;
                case 'demo':
                    resetInput('service');

                    dropdown = isFromModal ? getDropdown(filterName, 'modal') : getDropdown(filterName, 'collapsed');
                    value = dropdown.options[dropdown.selectedIndex].value;
                    localStorage.setItem('boa-' + filterName, value);
                    populateServicesInput(value);

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
            var zip;
            var demo;
            var service;
            if(isFromModal){
                zip = getDropdown('zip', 'modal').value;
                demo = getDropdown('demo', 'modal').value;
                service = getDropdown('service', 'modal').value;
                setAllFilters(zip, demo, service);
                modal.close();
            } else{
                zip = getDropdown('zip', 'collapsed').value;
                demo = getDropdown('demo', 'collapsed').value;
                service = getDropdown('service', 'collapsed').value;
                setAllFilters(zip, demo, service);
            }
        };

        self.setCollapsedFilters = function(zip, demo, service){
            setAllFilters(zip, demo, service);
        };

        self.refineSearch = function(){
            modal.display('filter-modal-content');
            $('.filter-modal-section').removeClass('hidden');

            var zip = getDropdown('zip', 'collapsed').value || localStorage.getItem('boa-zip') || 0;
            if(lib.varExists(zip)){
                var demo = getDropdown('demo', 'collapsed').value || localStorage.getItem('boa-demo') || 0;
                var service = service = getDropdown('service', 'collapsed').value || localStorage.getItem('boa-service') || 0;
                setAllFilters(zip, demo, service);
            }

            modal.drop();
        };

        function setAllFilters(zip, demo, service){
            populateDemoInput(zip);
            populateServicesInput(demo);
            var inputObj = {
                'zip': zip,
                'demo': demo,
                'service': service
            }

            var value;

            Object.keys(inputObj).forEach(function(filterName, i){
                value = inputObj[Object.keys(inputObj)[i]] || 0;
                getDropdown(filterName, 'modal').value = value;
                getDropdown(filterName, 'collapsed').value = value;
                localStorage.setItem('boa-' + filterName, value);
            })
        }

        function populateDemoInput(zip){
            self.zipFilteredServices = $.map(self.seedData, function(service){
                if(service.zip === parseInt(zip)){ 
                    return service;
                }
            });

            var demographics = $.map(self.zipFilteredServices, function(service){
                return service.demo;
            });

            demographics.sort();

            var option;
            var modalDropdown = getDropdown('demo', 'modal');
            var collapsedDropdown = getDropdown('demo', 'collapsed');
            demographics.forEach(function(demo) {
                option = createElement('option', demo, demo);
                modalDropdown.appendChild(option);

                option = createElement('option', demo, demo);
                collapsedDropdown.appendChild(option);
            });
        }

        function populateServicesInput(demo){
            self.filteredServices = $.map(self.zipFilteredServices, function(service){
                if(service.demo === demo){
                    return service;
                }
            })

            var categories = $.map(self.filteredServices, function(service){
                return service.category;
            })

            var option;
            var modalDropdown = getDropdown('service', 'modal');
            var collapsedDropdown = getDropdown('service', 'collapsed');
            categories.forEach(function(category) {
                option = createElement('option', category, category);
                modalDropdown.appendChild(option);

                option = createElement('option', category, category);
                collapsedDropdown.appendChild(option);
            });
        }

        function createElement(type, value, text){
            var element = document.createElement(type);
            element.value = value;
            if(lib.varExists(text)){
                element.innerText = text;
            }

            return element;
        }

        function getDropdown(filterName, parent){
            return document.getElementById(filterName + '-' + 'input-' + parent);
        }
    }

    var fil = new Filters();
    return { 
        init: function() {
            fil.init();
        },
        initZipDropdowns: function() {
            fil.initZipDropdowns();
        },
        zipIsInitialized: function() {
            return fil.zipIsInitialized;
        },
        displayInput: function(name) {
            fil.displayInput(name);
        }, 
        submitInput: function(isFromModal) {
            fil.submitInput(isFromModal);
        },
        setCollapsedFilters: function(zip, demo, service) {
            fil.setCollapsedFilters(zip, demo, service);
        },
        refineSearch: function() {
            fil.refineSearch();
        },
        handleInput: function(filterName, isFromModal) {
            fil.handleInput(filterName, isFromModal);
        }
    };
})(window, window.jQuery);