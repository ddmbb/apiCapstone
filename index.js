"use strict";

const apiKey = "hPnejYCjDvhmMhTbYECuUq15682jUtDm";
const nytURL = "https://api.nytimes.com/svc/books/v3/lists/current/";
const nytGenresURL = "https://api.nytimes.com/svc/books/v3/lists/names.json?";
const googleKey = "AIzaSyD9OPopSiOT_qHbXpC9_MBK-1d83kvVVIs";
const googleURL = "https://www.googleapis.com/books/v1/volumes?";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}

function displayDetails(responseJson) {
  console.log(responseJson);
  $("#results-list").empty().removeClass("hidden").append(
    `<li><image src="${responseJson.items[0].volumeInfo.imageLinks.thumbnail}"><button id="preview" type="button">Preview</button></li>
    <li>${responseJson.items[0].volumeInfo.description}</li>`
  );
  $("#results-list").on("click", "button", function () {
    console.log("click");
    event.preventDefault();
    $("#results-list")
      .empty()
      .append(
        `<li><script type="text/javascript">GBS_insertEmbeddedViewer(${responseJson.items[0].volumeInfo.industryIdentifiers[0].identifier}, 600, 500);</script></li>`
      );
  });
  // $("#viewer") this erases all other info
  //   .removeClass("hidden")
  //   .append(
  //     `<li><script type="text/javascript">GBS_insertPreviewButtonPopup(${responseJson.items[0].volumeInfo.industryIdentifiers[0].identifier});</script></li>`
  //   );
}

function getDetails(isbn13) {
  const params = {
    key: googleKey,
    q: "isbn=" + isbn13,
  };

  const queryString = formatQueryParams(params);
  const url = googleURL + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayDetails(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayList(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  for (let i = 0; i < responseJson.results.books.length; i++) {
    $("#results-list").append(
      `<li><img src= ${responseJson.results.books[i].book_image} alt="cover" value= ${responseJson.results.books[i].primary_isbn13}>`
    );
  }
}

$("#results-list").on("click", "img", function () {
  event.preventDefault();
  let isbn13 = $(this).attr("value");
  console.log(isbn13);
  getDetails(isbn13);
});

$("#results").removeClass("hidden");

function getList(listName) {
  const params = {
    "api-key": apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = nytURL + listName + ".json?" + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayList(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayGenres(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  for (let i = 0; i < responseJson.results.length; i++) {
    $("#results-list").append(
      `<li><a href="${responseJson.results[i].list_name_encoded}">${responseJson.results[i].display_name}</a></li>`
    );
  }
}

$("#results-list").on("click", "a", function () {
  event.preventDefault();
  let listName = $(this).attr("href");
  console.log(listName);
  getList(listName);
});

$("#results").removeClass("hidden");

function getGenres(nytGenresURL) {
  const params = {
    "api-key": apiKey,
    updated: "weekly",
  };
  const queryString = formatQueryParams(params);
  const url = nytGenresURL + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayGenres(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

$("#start").on("click", function () {
  event.preventDefault();
  $("#start").addClass("hidden");
  $("#js-list-name").removeClass("hidden");
  getGenres(nytGenresURL);
});
