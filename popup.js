function loadBookmarks() {
  chrome.storage.local.get({bookmarkButtonBookmarks : [] }, function(storedBookmarks) {
    var currentBookmarks = storedBookmarks.bookmarkButtonBookmarks;
    $('#bookmarks').append(getBookmarks(currentBookmarks));
  });
}

function getBookmarks(bookmarkList) {
  var list = $('<ul>');
  for (var i = 0; i < bookmarkList.length; i++) {
    list.append(getBookMark(bookmarkList[i]));
  }
  return list;
}

function getBookMark(bookmark) {
  if (bookmark.title) {

    var anchor = $('<a>');
    anchor.attr('href', bookmark.url);
    anchor.text(bookmark.title);

    anchor.click(function() {
      chrome.tabs.create({url: bookmark.url});
    });

    var span = $('<div>');
    var options = $('<span> <a id="deletelink" href="#">Delete</a></span>');

    span.hover(function() {
      span.append(options);

      $('#deletelink').click(function() {
        chrome.storage.local.get({bookmarkButtonBookmarks : [] }, function(storedBookmarks) {
          console.log(storedBookmarks);
          var bookmarkButtonBookmarks = storedBookmarks.bookmarkButtonBookmarks;

          console.log(bookmarkButtonBookmarks.pop({url: bookmark.url, title: bookmark.title}));

          chrome.storage.local.set({bookmarkButtonBookmarks: bookmarkButtonBookmarks}, function() {
            console.log('updated bookmarks', bookmarkButtonBookmarks);
          });
        });

        $('#bookmarks').empty();
        window.loadBookmarks();
      });

      options.fadeIn();
    },
    // unhover
    function() {
      options.remove();
    }).append(anchor);
  }
  var li = $('<li>').append(span);
  return li;
}

function addBookMark(){

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    var tab = tabs[0];
    var newBookmark = { 
      url : tab.url,
      title : tab.title
    };

    chrome.storage.local.get({bookmarkButtonBookmarks : [] }, function(storedBookmarks) {
      var bookmarkButtonBookmarks = storedBookmarks.bookmarkButtonBookmarks;

      var exists = false;
      bookmarkButtonBookmarks.forEach(function(element){
        if(element.url == newBookmark.url){
          exists = true;
        }
      });

      if(!exists){
        bookmarkButtonBookmarks.push(newBookmark);
      }

      chrome.storage.local.set({bookmarkButtonBookmarks: bookmarkButtonBookmarks}, function() {
      });
    });
  });
  $('#bookmarks').empty();
  window.loadBookmarks();
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Bookmark Button loaded');
  loadBookmarks();
  $('#addNewBookmark').click(function() {
    console.log("clicked")
    addBookMark();
  });
});
