$(document).ready(function () {
    //Once the document is ready, take the html from the views files
    //and insert them into their respective elements in index.html
    $.get('/views/landing-page.html')
        .done(function (data) {
            $('#landing-page').html(data);
        });
    $.get('/views/footer.html')
        .done(function (data) {
            $('#footer').html(data);
        });
    $.get('/views/nav-bar.html')
        .done(function (data) {
            $('#nav-bar').html(data);
        });
    $.get('/views/filters-collapsed.html')
        .done(function (data) {
            $('#filters-collapsed').html(data);
        });
    $.get('/views/modal-container.html')
        .done(function (data) {
            $('#modal-container').html(data);
        });
    $.get('/views/services-page.html')
        .done(function (data) {
            $('#services-page').html(data);
        });

    //Show the landing page by default
    $('#landing-page').removeClass('hidden');

    //Initialize necessary components
    modal.init();
    filters.init();

    //Resize listener that makes sure the modal is always in the middle
    //of the screen
    window.addEventListener('resize', function () {
        modal.position();
        filters.setAllFilters();
    });
});

//This is the function that is used to swap out the content based off
//which links are clicked at the top of the page.
function displayPage(id, displayFilters) {
    //Hide all components
    $('.component').addClass('hidden');
    var isInitialLoad = true;

    //If the content needs the filters, display them.
    if (displayFilters) {
        $('#filters-collapsed').removeClass('hidden');

        //Initializes the zipcode dropdown with the unique zipcodes in
        //the services array.
        if (!filters.zipIsInitialized()) {
            filters.initZipDropdowns();
        }

        //See if localStorage has values from previous user session.
        var zip = localStorage.getItem('boa-zip');
        if(lib.varExists(zip)){
            var demo = localStorage.getItem('boa-demo');
            var service = localStorage.getItem('boa-service');

            //Initialize all filters if there is data in localStorage.
            filters.setAllFilters(zip, demo, service);

            //If the filters are already set from localStorage, submit the input
            //to go ahead and showed the filtered list of service cards.
            filters.submitInput(false);
        } else{
            //If there is no data in localStorage from a previous session, drop
            //the filter modal in, so the user can specify what they are looking for.
            if(isInitialLoad){
                modal.display('filter-modal-content');
                modal.drop(true);
                
                isInitialLoad = false;
            }
        }
    }

    //Initialize components as they are needed.
    switch(id){
        case 'services-page':
            services.init();
        break;
        default:

        break;
    }

    //Actually display the page the user wants to see.
    $('#' + id).removeClass('hidden');
}