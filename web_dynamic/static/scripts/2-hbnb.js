$(document).ready(function () {
    var amenitiesIDs = {};

    $('input[type="checkbox"]').change(function () {
        if ($(this).is(':checked')) {
            amenitiesID[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete amenitiesID[$(this).attr('data-id')];
        }
        $('.amenities H4').text(Object.values(amenitiesID).join(', '));
    });

    function updateApiStatus() {
        $.get('http://127.0.0.1:5001/api/v1/status/', function (data) {
            if (data.status === "OK") {
                $('#api_status').addClass('available');
            } else {
                $('#api_status').removeClass('available');
            }
        });
    }

    updateApiStatus();
});