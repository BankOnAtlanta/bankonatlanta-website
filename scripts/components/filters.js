var filters;
if (!filters) {
	filters = {};
}

//This is the object that will be exposed to the rest of the code.
var filters = (function (w, $) {

    //This is the constructor method that will specify how each of
    //the object's functions will work.
    var Filters = function(){
        var self = this;
        // self.uniqueZips;
        self.uniqueDemographics;
        self.zipIsInitialized = false;
        self.seedData;
        self.zipFilteredServices;
        self.demoFilteredServices;
        self.completelyFilteredServices;

        //This function will initialize the filters. It will retrieve the
        //array of services that are offered and retrieve the list of 
        //zip codes that have services offered.
        self.init = function(){
            //Get the services.
            self.seedData = repo.getData();
        };

        //Initialize the zip dropdown in the collapsed area & the modal.
        self.initZipDropdowns = function() {
            //Get an array of all the zip codes from the services array.
            var zipArray = $.map(self.seedData, function(service){
                return service.zip;                
            });

            //Filter the zipArray, so that we only have unique zip codes and
            //no duplicates. Also, sort them from lowest to highest.
            var uniqueZips = zipArray.filter(onlyUnique).sort();

            //Retrieve the two dropdowns from the DOM.
            var collapsedZipDropdown = getDropdown('zip','collapsed');
            var modalZipDropdown = getDropdown('zip','modal');
            var option;

            //For each zip code, create an option element and add it to
            //the modal and collapsed zip dropdowns
            uniqueZips.forEach(function(uniqueZip) {
                option = createElement('option', uniqueZip, uniqueZip);
                collapsedZipDropdown.appendChild(option);

                //You have to create another option to add, so it doesn't remove it from the 
                //other dropdown.
                option = createElement('option', uniqueZip, uniqueZip);
                modalZipDropdown.appendChild(option);
            });
            self.zipIsInitialized = true;
        };

        //This function is used to handle the animating of showing
        //the dropdowns in the modal.
        self.displayInput = function(name, isFromModal) {
            //Retrieve the modal and dropdown section from the DOM.
            var filterModal = $('#modal');
            var filter = $('#' + name + '-filter');
            var filterHeight = $('#zip-filter').height();

            //Only do this is the filter in question is not visible.
            if (parseInt(filter.height()) === 0 && isFromModal) {
                //Ensure a height of 0.
                filter.height(0);

                //Make it visible.
                filter.removeClass('hidden');

                //Animate the increase of height and y-axis position of the modal.
                filterModal.animate({ height: filterModal.outerHeight() + filterHeight + 'px', top: filterModal.offset().top - 26 }, 250, 'linear');

                //Animate the increase of height of the filter.
                filter.animate({ height: filterHeight + 'px' }, 250);
            }
        };

        //Takes an array and returns an array of unique values from 
        //the original array.
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        //This function is used to handle animating of closing a
        //dropdown section in the modal.
        function hideInput(name){
            //Retrieve the modal and dropdown section from the DOM.
            var filterModal = $('#modal');
            var filter = $('#' + name + '-filter');
            var filterHeight = filter.height();

            //Animate the decrease of height and y-axis position of the modal.
            filterModal.animate({ height: filterModal.outerHeight() - filterHeight + 'px', top: filterModal.offset().top + 26 }, 250, 'linear');

            //Animate the decrease of the height of the filter.
            filter.animate({ height: 0 }, 250);

            //Actually hide the filter section.
            filter.addClass('hidden');
        }

        //This function removes all options from the selected dropdown
        //and resets it back to the default option.
        function resetInput(name){
            var collapsedDropdown = $('#' + name + '-input-collapsed');
            var modalDropdown = $('#' + name + '-input-modal');

            //Empty the dropdowns
            collapsedDropdown.empty();
            modalDropdown.empty();

            //Add the default option back to the dropdown in the modal and collapsed section.
            var optionZero = createElement('option', 0, ' -- Select an Option -- ', ['disabled', 'selected']);
            collapsedDropdown.append(optionZero);
            optionZero = createElement('option', 0, ' -- Select an Option -- ', ['disabled', 'selected']);
            modalDropdown.append(optionZero);

            //Set to default option.
            collapsedDropdown.value = 0;
            modalDropdown.value = 0;

            //Reset the filter in localStorage.
            localStorage.setItem('boa-' + name, 0);
        }

        self.handleInput = function(filterName, isFromModal){
            var value;
            var dropdown;

            //Decides which block of code to run based off which filter's
            //input has been changed.
            switch(filterName){
                case 'zip': 
                    //If this was changed in the modal & the services filter is visible,
                    //make it invisible.
                    if(isFromModal && $('#services-filter').height() > 0){
                        hideInput('services');
                    }

                    //Get and save selected zip value.
                    value = getAndSaveFilterValue(filterName, isFromModal)

                    //Use the newly selected zip code to populate the demographics
                    //that can be served in that area.
                    populateDemoInput(value);

                    //Empty and reset the service dropdown.
                    resetInput('service');
                    
                    //Display the demographics dropdown.
                    self.displayInput('demographics', isFromModal)
                    break;
                case 'demo':
                    //Get and save selected demographic value.
                    value = getAndSaveFilterValue(filterName, isFromModal)

                    //Use the newly selected demographic to populate the services
                    //that can be selected
                    populateServicesInput(value);

                    //Display the services dropdown.
                    self.displayInput('services', isFromModal);
                    break;
                case 'service':

                    //Save selected service value.
                    getAndSaveFilterValue(filterName, isFromModal)

                    //If the services dropdown is changed, submit the dropdown values
                    //to display the correct service cards.
                    self.submitInput(isFromModal);
                    break;
                default: 
                    break;
            }
        }

        //This function gets the newly entered values from the respective dropdowns
        //to populate the correct service cards.
        self.submitInput = function(isFromModal){
            //Retrieve selected values from localStorage. These were set when the user
            //selected them from the dropdowns.
            var zip = localStorage.getItem("boa-zip");
            var demo = localStorage.getItem("boa-demo");
            var serviceCategory = localStorage.getItem("boa-service");

            //Close the modal if it's open.
            if(isFromModal){
                modal.close();
            }

            //Filters the remaining services by service category.
            self.completelyFilteredServices = $.map(self.demoFilteredServices, function(service){
                if(service.category === serviceCategory){ 
                    return service;
                }
            });
        };

        //
        self.refineSearch = function(){
            //Displays the modal with filters as its content
            modal.display('filter-modal-content');
            //Makes the content visible.
            $('.filter-modal-section').removeClass('hidden');

            //Retrieve values from localStorage and set all filters.
            var zip = localStorage.getItem('boa-zip') || getDropdown('zip', 'collapsed').value  || 0;
            if(lib.varExists(zip)){
                var demo = localStorage.getItem('boa-demo') || getDropdown('demo', 'collapsed').value || 0;
                var service =localStorage.getItem('boa-service') || getDropdown('service', 'collapsed').value || 0;
                self.setAllFilters(zip, demo, service);
            }

            //Drop the modal onto the screen.
            modal.drop();
        };

        //This function sets all the filters.
        self.setAllFilters = function(zip, demo, service){
            populateDemoInput(zip);
            populateServicesInput(demo);
            var inputObj = {
                'zip': zip,
                'demo': demo,
                'service': service
            }

            var value;

            //This loops through the inputObj, uses the names of the properties to retrieve
            //the respective dropdowns, and sets their values equal to what was passed in.
            //It also updates the values in localStorage, just to make sure everything is
            //on the same page.
            Object.keys(inputObj).forEach(function(filterName, i){
                value = inputObj[Object.keys(inputObj)[i]] || 0;
                getDropdown(filterName, 'modal').value = value;
                getDropdown(filterName, 'collapsed').value = value;
                localStorage.setItem('boa-' + filterName, value);
            })
        }

        //Get the value from the selected filter dropdown, save it, and return the value.
        function getAndSaveFilterValue(filterName, isFromModal){
            //Get the appropriate dropdown to retrieve the selected value from.
            dropdown = isFromModal ? getDropdown(filterName, 'modal') : getDropdown(filterName, 'collapsed');
            //Actually get the value.
            value = dropdown.options[dropdown.selectedIndex].value;
            //Store the new value in localStorage.
            localStorage.setItem('boa-' + filterName, value);
            return value;
        }

        //This function uses the selected zip code to determine which
        //demographics are served in that area, and populates the
        //dropdown with those demographics.
        function populateDemoInput(zip){
            //Reset the demographics dropdown b/c we don't know what demographics
            //are available for this zip yet.
            resetInput('demo');
                    
            //Filters all the services and only returns those within the selected
            //zipcode.
            self.zipFilteredServices = $.map(self.seedData, function(service){
                if(service.zip === parseInt(zip)){ 
                    return service;
                }
            });

            //Returns an array of all the zipcodes in the array of services above.
            var demographics = $.map(self.zipFilteredServices, function(service){
                return service.demo;
            });

            //Filter the demographics array, so that we only have unique demographics and
            //no duplicates. Also, sort them alphabetically.
            var uniqueDemographics = demographics.filter(onlyUnique).sort();

            //Retrieve the respective dropdowns from the DOM.
            var modalDropdown = getDropdown('demo', 'modal');
            var collapsedDropdown = getDropdown('demo', 'collapsed');

            //For each demographic, create an option element and add it to
            //the modal and collapsed demographic dropdowns
            var option;
            uniqueDemographics.forEach(function(demo) {
                option = createElement('option', demo, demo);
                modalDropdown.appendChild(option);

                option = createElement('option', demo, demo);
                collapsedDropdown.appendChild(option);
            });
        }

        //This function uses the selected demographic to determine which
        //services are available in that area, and populates the
        //dropdown with those services.
        function populateServicesInput(demo){
            //Reset the service dropdown b/c we don't know what services area
            //available for the selected demographic in the selected zip yet.
            resetInput('service');

            //Filters all the services and only returns those useful to the 
            //selected demographic.
            self.demoFilteredServices = $.map(self.zipFilteredServices, function(service){
                if(service.demo === demo){
                    return service;
                }
            })

            //Returns an array of all the servcie categories in the array of services above.
            var categories = $.map(self.demoFilteredServices, function(service){
                return service.category;
            })

            //Filter the categories array, so that we only have unique categories and
            //no duplicates. Also, sort them alphabetically.
            var uniqueCategories = categories.filter(onlyUnique).sort();

            //Retrieve the respective dropdowns from the DOM.
            var modalDropdown = getDropdown('service', 'modal');
            var collapsedDropdown = getDropdown('service', 'collapsed');

            //For each service category, create an option element and add it to
            //the modal and collapsed service category dropdowns
            var option;
            categories.forEach(function(category) {
                option = createElement('option', category, category);
                modalDropdown.appendChild(option);

                option = createElement('option', category, category);
                collapsedDropdown.appendChild(option);
            });
        }

        //Uses the passed in values to create and return an element to
        //append to the DOM.
        function createElement(type, value, text, attributesToAdd){
            //Creates the element and sets the value.
            //If there is text, sets that too.
            var element = document.createElement(type);
            element.value = value;
            if(lib.varExists(text)){
                element.innerText = text;
            }

            //If there are attributes that need to be set to true on the
            //element, this does that.
            if(lib.varExists(attributesToAdd)){
                attributesToAdd.forEach(function(attribute){
                    element[attribute] = true;
                })
            }

            return element;
        }

        //Returns the selected dropdown element based off its name and parent element.
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
        setAllFilters: function(zip, demo, service) {
            fil.setAllFilters(zip, demo, service);
        },
        refineSearch: function() {
            fil.refineSearch();
        },
        handleInput: function(filterName, isFromModal) {
            fil.handleInput(filterName, isFromModal);
        }
    };
})(window, window.jQuery);