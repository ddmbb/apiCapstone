"use strict";

const apiKey = "hPnejYCjDvhmMhTbYECuUq15682jUtDm";
const nytURL = "https://api.nytimes.com/svc/books/v3/lists/current/";
const googleKey = "AIzaSyD9OPopSiOT_qHbXpC9_MBK-1d83kvVVIs";
const googleURL = "https://www.googleapis.com/books/v1/volumes?";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}

function displayDetails(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  $("#results-list").append(
    `<li><h2>${responseJson.items[0].volumeInfo.title} by: <li>${responseJson.items[0].volumeInfo.authors}</h2></li>`
  );
  let previewISBN =
    responseJson.items[0].volumeInfo.industryIdentifiers[0].identifier;
  let previewURL = responseJson.items[0].volumeInfo.previewLink;
  console.log(previewISBN);
  console.log(previewURL);
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
  /*$("#js-list-name").addClass("hidden");*/
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

function watchForm() {
  $("#js-list-name").on("click", "button", function () {
    event.preventDefault();
    var listName = this.value;
    getList(listName);
    /*THIS WILL HIDE LIST SELECTION */
    /* $("#js-list-name").addClass("hidden"); */
  });
}

$(watchForm);
