// array to push track objects.
var queueArray = [];
var queueArrayName = [];

var playingCssClass = 'playing',
    audioObject = null;

// Template for track search results
var templateTrackSource = document.getElementById('track-results-template').innerHTML,
    trackTemplate = Handlebars.compile(templateTrackSource),
    resultTrackPlaceholder = document.getElementById('track-results');

// template for queueArray
var templateQueueSource = document.getElementById('queue-results-template').innerHTML,
    trackQueue = Handlebars.compile(templateQueueSource),
    resultQueuePlaceholder = document.getElementById('queue-results');


var fetchTracks = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
          console.log(response);
          callback(response);
        }
    });
};

var getTrack = function(trackId, callback){
  console.log('getTrack');
  console.log('trackId' + trackId);

  $.ajax({
    url: 'https://api.spotify.com/v1/tracks/' + trackId,
    success: function (response){
      callback(response);
      console.log(response);
      resultQueuePlaceholder.innterHTML = trackQueue(response);

      console.log('album.images[0].url:' + response.album.images[0].url);
      console.log('album.id: ' + response.album.id);
      console.log('album.preview_url: ' + response.preview_url);

      $('#queue-results').append('<li id=playlist-element style="background-image:url('+ response.album.images[0].url + ')" album-id=' + response.album.id + ' class="cover"></li>');
    }
  });
};

var searchTrack = function (query){
  console.log('searchTrack');
  $.ajax({
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: query,
        type: 'track',
      },
      success: function (response) {
        var num = 0;
        console.log(response);
        console.log(response.tracks.items[0].id);
        resultTrackPlaceholder.innerHTML = trackTemplate(response);

      }
  });
};

//enters main page after login page
$('#goto-main').on('click', function (){
  console.log('goto-mainpage');

    $('#loggedin').hide();
    $('.main-page').show();

});

//clear results on screen
$('#clear-results').on('click', function() {
  var clear1 = document.getElementById('results');
  var clear2 = document.getElementById('track-results');
  // while (clear1.firstChild) {
  //   clear1.removeChild(clear1.firstChild);
  // }
  while(clear2.firstChild){
    clear2.removeChild(clear2.firstChild);
  }
});

//pushing songs to array queue
$(document).on('click','[data-control=pushArray]', function(e){
  console.log('push-to-array');
  var target = e.target;
  var trackId = target.getAttribute('data-track-id');
  console.log('trackId: ' + trackId);
  queueArray.push(trackId);
  console.log(queueArray);

  getTrack(trackId, function (data){
    console.log('data.name: ' + data.name);
    queueArrayName.push(data.name);
    console.log(queueArrayName);
  });

});

$('#track-results').on('click', function (e){
  var target = e.target;
  if (target !== null && target.classList.contains('cover')) {
      if (target.classList.contains(playingCssClass)) {
          audioObject.pause();
      } else {
          if (audioObject) {
              audioObject.pause();
          }
          fetchTracks(target.getAttribute('data-track-album-id'), function (data) {
              audioObject = new Audio(data.tracks.items[0].preview_url);
              audioObject.play();
              target.classList.add(playingCssClass);
              audioObject.addEventListener('ended', function () {
                  target.classList.remove(playingCssClass);
              });
              audioObject.addEventListener('pause', function () {
                  target.classList.remove(playingCssClass);
              });
          });
      }
  }
});


$('#queue-results').on('click', function(e){
  var target = e.target;
  if (target !== null && target.classList.contains('cover')) {
      if (target.classList.contains(playingCssClass)) {
          audioObject.pause();
      } else {
          if (audioObject) {
              audioObject.pause();
          }
          fetchTracks(target.getAttribute('album-id'), function (data) {
              audioObject = new Audio(data.tracks.items[0].preview_url);
              audioObject.play();
              target.classList.add(playingCssClass);
              audioObject.addEventListener('ended', function () {
                  target.classList.remove(playingCssClass);
              });
              audioObject.addEventListener('pause', function () {
                  target.classList.remove(playingCssClass);
              });
          });
      }
  }
  });

document.getElementById('search-track-form').addEventListener('submit', function (e){
  e.preventDefault();
  searchTrack(document.getElementById('query-track').value);
}, false);

// references: http://jsfiddle.net/JMPerez/0u0v7e1b/
