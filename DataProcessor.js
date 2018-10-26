/* Searches for the given search term */
function search()
{
    numberOfProcessedPhotos = 0;
    doStopQuery = false; 
    searchTerm = searchTermTextInput.value;
    searchType = Array.from(document.getElementsByName('searchType'))
                        .find(radioButton => radioButton.checked).value;

    switch(searchType)
    {
        case 'People':
            getUserInfo(searchTerm);                
            break;
        case 'Tags':
            getTagInfo(searchTerm, '', '');
            break;
        case 'Places':
            getPlaceInfo(searchTerm, '');
            break;
        default:
            showMessage('ERROR: Not a valid search type.');
    }
}

/* Sleep function to wait between API calls */
const sleep = (milliseconds) => 
{
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// function sendRequest(url, requestData)
// {
//     var request = new XMLHttpRequest();
//     request.open('POST', url, true);
//     request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     request.send(requestData);
//     return request;
// }

/* Gets the User Info for the specified Username */
function getUserInfo(username)
{
    showMessage('Getting ' + username + '\'s information...', true, true, true);
    var url = './vendor/GetUserInfo.php';
    var requestData = 'username=' + username;
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");   
    request.onload = function() 
    {
        //console.log("Response" + request.responseText);
        var response = JSON.parse(request.responseText);
        
        if(response.code == "OK")
        {
            searchTermInfo = response.data;
            if(!response.data.isPrivate)
            {
                showMessage('Loading photos...', true, true, true);
                createLayer(username);
                getUserFeed(username, "");
            }
            else
                showMessage('ERROR: ' + username + '\'s account is private!', true, false, false);
        }
        else
        {
            if(response.error.indexOf("User not found.") != 1)
                showMessage('ERROR: User "' + username + '" was not found!', true, false, false);
            else
                console.log(response.error);            
        }
    };
    request.send(requestData);
}

function getUserFeed(username, nextMaxID)
{
  var url = './vendor/GetUserFeed.php';
  var requestData = 'username=' + username + '&nextMaxID=' + nextMaxID;
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.onload = function() 
  {
    //console.log(request.responseText);
    response = JSON.parse(request.responseText);

    if(response.code == "OK")
    {
        numberOfProcessedPhotos += response.progress;
        mapPhotos(response.data, username);

        if(!doStopQuery && response.nextMaxID != null)
        {
            sleep(2000).then(() => 
            {
                getUserFeed(username, response.nextMaxID);
            });
            
        }
        else
            showMessage(null, false, false, false);
    }
    else
        console.log(response.error);
  };

  request.send(requestData);
};

function getTagInfo(tag)
{
    showMessage('Getting #' + tag + '\'s tag information...', true, true, true);
    var url = './vendor/GetTagInfo.php';
    var requestData = 'tag=' + tag;
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function() 
    {
        //console.log("Response" + request.responseText);
        var response = JSON.parse(request.responseText);
        
        if(response.code == "OK")
        {
            searchTermInfo = response.data;

            if(searchTermInfo.id != null || searchTermInfo.mediaCount > 0)
            {
                if(response.data.nonViolating == 1)
                {          
                    showMessage('Loading photos...', true, true, true);
                    createLayer(tag);
                    getTagFeed(tag, "", "");
                }
                else
                    showMessage('ERROR: This content cannot be retrieved because it violates Instagram\'s guidelines.', true, false, true);
            }
            else
                showMessage('ERROR: Tag #' + tag + ' does not exist!', true, false, false);
        }
        else
            console.log(response.error);      
        
    
    };
    request.send(requestData);
}


function getTagFeed(tag, rankToken, nextMaxID)
{
    var url = './vendor/GetTagFeed.php';
    var requestData = 'tag=' + tag + '&rankToken=' + rankToken + '&nextMaxID=' + nextMaxID;
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function() 
    {
        //console.log("Response" + request.responseText);
        var response = JSON.parse(request.responseText);
        //console.log(response);
        
        if(response.code == "OK")
        {
            mapPhotos(response.data, tag);

            if(!doStopQuery && response.nextMaxID != null)
            {
                sleep(2000).then(() => 
                {
                    getTagFeed(tag, response.rankToken, response.nextMaxID);
                });
                
            }
            else
                messageGrid.style.opacity = 0;
        }
        else
        {
            console.log(response.error);            
        }
    };
    request.send(requestData);
}

function getPlaceInfo(place)
{
    showMessage('Getting ' + place + '\'s information...', true, true, true);
    var url = './vendor/GetPlaceInfo.php';
    var requestData = 'place=' + place + '&rankToken=';
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function() 
    {
        console.log("Response" + request.responseText);
        var response = JSON.parse(request.responseText);
        
        if(response.code == "OK")
        {
            searchTermInfo = response.data;

            // if(searchTermInfo.id != null || searchTermInfo.mediaCount > 0)
            // {
            //     if(response.data.nonViolating == 1)
            //     {          
            //         showMessage('Loading photos...', true, true, true);
            //         createLayer(place);
            //         getPlacesFeed(place, "");
            //     }
            //     else
            //         showMessage('ERROR: This content cannot be retrieved because it violates Instagram\'s guidelines.', true, false, true);
            // }
            // else
            //     showMessage('ERROR: Place "' + place + '" does not exist!', true, false, false);
        }
        else
            console.log(response.error);      
    };
    request.send(requestData);
}

function getPlacesFeed(place, rankToken)
{
    var url = './vendor/GetPlacesFeed.php';
    var requestData = 'place=' + place + '&rankToken=' + rankToken;
    console.log("Data: " + requestData);
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onload = function() 
    {
        //console.log("Response" + request.responseText);
        var response = JSON.parse(request.responseText);
        console.log(response);
        
        if(response.code == "OK")
        {
            showMessage('Loading photos...', true, true, true);
            createLayer(place);
            mapPhotos(response.data, place);

            if(response.nextMaxID != null)
            {
                sleep(3000);
                //getPlacesFeed(place, response.rankToken, response.nextMaxID);
            }
        }
        else
        {
            console.log(response.error);            
        }
    };
    request.send(requestData);
}


