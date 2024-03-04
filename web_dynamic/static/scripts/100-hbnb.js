$(document).ready(function () {
    var amenitiesIDs = {};

    $('input[type="checkbox"]').change(function () {
      const el = e.target;
      let tt;

      // let me try and use the switch-case to make it more dynamic
      switch (el.id) {
        case "state_filter":
          tt = states;
          break;
        case "city_filter":
          tt = cities;
          break;
        case "amenity_filter":
          tt = amenities;
          break;
      }
      // check if the checkbox is checked
      if (el.checked) {
        tt[el.dataset.name] = el.dataset.id;
      } else {
        delete tt[el.dataset.name];
      }
      // if id is amenity_filter
      if (el.id === "amenity_filter") {
        $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
      } else {
        $(".locations h4").text(
          Object.keys(Object.assign({}, states, cities)).sort().join(", ")
        );
      }
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

    $.ajax({
        url: `http://127.0.0.1:5001/api/v1/places_search/`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function (response) {
          response.forEach(function (place) {
            const placeContent = `
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">
                ${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}
                </div>
                <div class="number_rooms">
                ${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}
                </div>
                <div class="number_bathrooms">
                ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}
                </div>
              </div>
              <div class="description">
                ${place.description}
              </div>
            </article>`;
            $("section.places").append(placeContent);
          })
        },
        dataType: "json",
        error: function (error) {
              console.error('Error: ' + error);
        }
    });

    function searchPlace() {
      $.post({
        url: `${HOST}/api/v1/places_search`,
        data: JSON.stringify({
        amenities: Object.values(amenities),
        states: Object.values(states),
        cities: Object.values(cities),
        }),
        headers: {
        "Content-Type": "application/json",
        },
        success: (data) => {
        $("section.places").empty();
        data.forEach((d) => console.log(d.id));
        data.forEach((place) => {
          $("section.places").append(
          `<article>
            <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
            <div class="max_guest">${place.max_guest} Guest${
            place.max_guest !== 1 ? "s" : ""
          }</div>
              <div class="number_rooms">${place.number_rooms} Bedroom${
            place.number_rooms !== 1 ? "s" : ""
          }</div>
              <div class="number_bathrooms">${
              place.number_bathrooms
              } Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
            </div>
            <div class="description">
            ${place.description}
            </div>
            <div class="reviews" data-place="${place.id}">
            <h2></h2>
            <ul></ul>
            </div>
          </article>`
          );
          fetchReviews(place.id);
        });
        },
        dataType: "json",
      });
      }


      function searchPlace() {
        $.post({
          url: 'http://127.0.0.1:5001/api/v1/places_search',
          data: JSON.stringify({
          amenities: Object.values(amenities),
          states: Object.values(states),
          cities: Object.values(cities),
          }),
          headers: {
          "Content-Type": "application/json",
          },
          success: (data) => {
          $("section.places").empty();
          data.forEach((d) => console.log(d.id));
          data.forEach((place) => {
            $("section.places").append(
            `<article>
              <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
              <div class="max_guest">${place.max_guest} Guest${
                place.max_guest !== 1 ? "s" : ""
              }</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${
              place.number_rooms !== 1 ? "s" : ""
            }</div>
                <div class="number_bathrooms">${
                place.number_bathrooms
                } Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
              </div>
              <div class="description">
              ${place.description}
              </div>
              <div class="reviews" data-place="${place.id}">
              <h2></h2>
              <ul></ul>
              </div>
            </article>`
            );
            fetchReviews(place.id);
          });
          },
          dataType: "json",
        });
        }

        function fetchReviews(placeId) {
          $.getJSON(
            `${HOST}/api/v1/places/${placeId}/reviews`,
            (data) => {
            $(`.reviews[data-place="${placeId}"] h2`)
              .text("test")
              .html(`${data.length} Reviews <span id="toggle_review">show</span>`);
            $(`.reviews[data-place="${placeId}"] h2 #toggle_review`).bind(
              "click",
              { placeId },
              function (e) {
              const rev = $(`.reviews[data-place="${e.data.placeId}"] ul`);
              if (rev.css("display") === "none") {
                rev.css("display", "block");
                data.forEach((r) => {
                $.getJSON(
                  `${HOST}/api/v1/users/${r.user_id}`,
                  (u) =>
                  $(".reviews ul").append(`
                  <li>
                  <h3>From ${u.first_name + " " + u.last_name} the ${
                    r.created_at
                  }</h3>
                  <p>${r.text}</p>
                  </li>`),
                  "json"
                );
                });
              } else {
                rev.css("display", "none");
              }
              }
              );
            },
            "json"
          );
          }

    updateApiStatus();

    $('section.filters button').bind("click", searchPlace);
    searchPlace();


});
