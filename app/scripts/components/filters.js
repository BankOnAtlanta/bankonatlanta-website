function displayInput(name){
    var modal = $('#modal');
    var filter = $('#' + name + '-filter');
    var filterHeight = $('#zip-filter').height();
    if(parseInt(filter.height()) === 0){
        filter.height(0);
        filter.removeClass('hidden');
        modal.animate({height: modal.outerHeight() + filterHeight + 'px', top: modal.offset().top - 26}, 250, 'linear');
        filter.animate({height: filterHeight + 'px'}, 250);
    }
}