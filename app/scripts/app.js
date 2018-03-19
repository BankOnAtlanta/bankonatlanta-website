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
    lib.doWhenExists('#modal', positionModal);

    window.addEventListener('resize', function(){
        positionModal();
    });
});

function displayPage(id, displayFilters){
    $('.component').addClass('hidden');
    $('#' + id).removeClass('hidden');
    if(displayFilters){
        $('#filters-collapsed').removeClass('hidden');
    }
}

function positionModal(){
    var modal = $('#modal');
    var leftPos = (window.innerWidth - modal.width()) / 2;
    var topPos = (window.innerHeight - modal.height()) / 2;
    modal.offset({left: leftPos, top: topPos});
}