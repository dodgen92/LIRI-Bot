
// Keeps your secret
require("dotenv").config();

// Import variables
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");


var spotify = new Spotify(keys.spotify);


var command = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");

// function secton



var getArtistNames = function (artist) {
  return artist.name;
};
var command = process.argv[2];


var getMeSpotify = function (songName) {
  if (songName == "") {
    songName = "Forty Six and Two";
  };
  spotify.search({
      type: "track",
      query: songName
    },
    
    function (err, data) {
      if (err) {
        console.log("Error occured: " + err);
        return;
      }
      var songList = data.tracks.items;
      if (songList.length === 0) {
        console.log("No Results Found");
      } else {
        for (var i = 0; i < songList.length; i++) {
          console.log(i);
          console.log("Artist(s): " + songList[i].artists.map(getArtistNames));
          console.log("Song Name: " + songList[i].name);
          console.log("Preview Song: " + songList[i].preview_url);
          console.log("Album: " + songList[i].album.name);
          console.log("--------------------------------");
        }
      }
    }
  );
};


var getMyBands = function (searchTerm) {

  var queryURL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";

  axios.get(queryURL).then(


    function (response) {
      var jsonData = response.data;

      console.log(jsonData)
      console.log(jsonData[0].venue)

      for (let i = 0; i < jsonData.length; i++) {
        console.log("venue:", jsonData[i].venue.name)
        console.log("location:", jsonData[i].venue.city + " " + jsonData[i].venue.country)
        console.log("Date:", moment(jsonData[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"))
        console.log("----------------------------------------\n")
      }
    }
  );
};



function getMyMovie(searchTerm) {
  if (searchTerm === "") {
    searchTerm = "The Last Waltz";
  };

  console.log("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy")
  axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy").then(function (response) {

    console.log("Title:", response.data.Title)
    console.log("Year:", response.data.Year)
    console.log("imdbRating:", response.data.imdbRating)
    console.log("Rotten Tomatoes:", response.data.Ratings[1].Value)
    console.log("Country:", response.data.Country)
    console.log("Language:", response.data.Language)
    console.log("Plot:", response.data.Plot)
    console.log("Actors:", response.data.Actors)
  })
}


function getDoWhatItSays() {

  fs.readFile("./random.txt", "utf8", function (err, data) {

    var fileData = data.split(",")
    command = fileData[0]
    searchTerm = fileData[1]
    pick(command, searchTerm)
  })

}

// determines command ran
var pick = function (command, searchTerm) {
 
  switch (command) { 
    case "spotify-this-song": 
      getMeSpotify(searchTerm) 
      break;
    case "concert-this":
      getMyBands(searchTerm);
      break;
    case "movie-this":
      getMyMovie(searchTerm);
      break;
    case "do-what-it-says":
      getDoWhatItSays();
    default:
      break;
  }
};


var runThis = function (command, searchTerm) {
  pick(command, searchTerm);
};

runThis(command, searchTerm);
