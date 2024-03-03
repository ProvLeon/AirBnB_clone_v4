$(document).ready(function () {
    var amenitiesID = {};

    $('input[type="checkbox"]').change(function () {
        if ($(this).is(':checked')) {
            amenitiesID[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete amenitiesID[$(this).attr('data-id')];
        }
        $('.amenities H4').text(Object.values(amenities).join(', '));
    })
})