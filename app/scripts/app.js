$(document).ready(function () {
    $.get('views/landingPage.html')
        .done(function (data) {
            $('#landing-page').html(data);
        });
    $.get('views/footer.html')
        .done(function (data) {
            $('#footer').html(data);
        });
    $.get('views/nav-bar.html')
        .done(function (data) {
            $('#nav-bar').html(data);
        });
    $.get('views/filtersCollapsed.html')
        .done(function (data) {
            $('#filters-collapsed').html(data);
        });
    $.get('views/modalContainer.html')
        .done(function (data) {
            $('#modal-container').html(data);
        });


    $('#landing-page').removeClass('hidden');
    modal.init();
});

function displayPage(id, displayFilters) {
    $('.component').addClass('hidden');
    $('#' + id).removeClass('hidden');
    var isInitialLoad = true;
    if (displayFilters) {
        $('#filters-collapsed').removeClass('hidden');

        if(isInitialLoad){
            modal.display('filter-modal-content');
            modal.drop();
            window.addEventListener('resize', function () {
                modal.position();
            });
            
            isInitialLoad = false;
        }
    }
}