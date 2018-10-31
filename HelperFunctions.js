var doStopQuery = false;
var searchTermInfo;
var searchType;
var searchTerm;
var numberOfProcessedPhotos;
var messageGrid = document.getElementsByClassName('message-grid')[0];
var progressPercentage = document.getElementsByClassName('progress-percentage')[0];
var spinnerAnimation = document.getElementsByClassName('spinner-animation')[0];
var messageText = document.getElementsByClassName('message-text')[0];
var stopQueryButton = document.getElementsByClassName('stop-query-button')[0];
var searchTermTextInput = document.getElementsByClassName('search-term-text-input')[0];
var searchBar = document.getElementById('searchBar');

searchTermTextInput.addEventListener('keyup', function(event) 
{
    event.preventDefault();
    if (event.keyCode === 13) 
        search();
});

document.getElementById('PeopleRadio').addEventListener('click', function(event)
{
  searchTermTextInput.placeholder = 'Username';
});

document.getElementById('TagsRadio').addEventListener('click', function(event)
{
  searchTermTextInput.placeholder = '#Hashtag';
});

function stopQuery()
{
    doStopQuery = true;
    messageGrid.style.opacity = 0;
}

function showMessage(message, doShowMessageGrid,
    doShowSpinnerAnimation, doShowStopQueryButton)
{
  if(doShowMessageGrid)
    messageText.innerHTML = message;

  doShowMessageGrid ? 
    messageGrid.style.opacity = 1 : 
    messageGrid.style.opacity = 0;

  doShowSpinnerAnimation ?
    spinnerAnimation.style.opacity = 1 :
    spinnerAnimation.style.opacity = 0;

  doShowStopQueryButton ?
    stopQueryButton.style.opacity = 1 :
    stopQueryButton.style.opacity = 0;
}

function updateProgressPercentage(progress, total)
{
  var completionPercentage = Math.round((numberOfProcessedPhotos / total) * 100);
  
  if(completionPercentage == 100)
    progressPercentage.style.opacity = 0;
  else
    progressPercentage.style.opacity = 1;

  progressPercentage.innerHTML = completionPercentage + '%';
}