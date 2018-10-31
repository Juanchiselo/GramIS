// ArcGIS Global Variables
var view;
var map;
var symbol;
var layerList;

function initializeMapElements()
{
  require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/LayerList",
    "dojo/domReady!"
  ], 
  function (Map, MapView, LayerList) 
  {
    // Creates the Symbol used for the Graphic of the photo.
    symbol = 
    {
      type: "picture-marker",
      url: "./IG_Logo.png",
      width: "30px",
      height: "30px"
    };

    symbolViewed =
    {
      type: "picture-marker",
      url: "./IG_GrayLogo.png",
      width: "30px",
      height: "30px"
    };

    map = new Map
    ({
      basemap: "dark-gray-vector"
    });
  
    view = new MapView
    ({
      center: [-30, 10],
      container: "viewDiv",
      map: map,
      zoom: 2
    });  

    view.constraints = {
      minScale: 1
    };

    layerList = new LayerList({
      view: view,
      listItemCreatedFunction: function (event) {    
        // The event object contains properties of the
        // layer in the LayerList widget.
        var item = event.item;

        if(item.title === searchTerm)
         {
          item.actionsSections = [
            [{
              title: "Go to full extent",
              className: "esri-icon-zoom-out-fixed",
              id: "full-extent"
            },
            {
              title: "Remove layer",
              className: "esri-icon-close",
              id: "remove-layer"
            }]
          ];

          item.panel = {
            className: "esri-icon-drag-horizontal",
            open: item.visible
          };
        }
      }
    });

    // Adds widget below other elements in the top left corner of the view
    view.ui.add(layerList, {
      position: "bottom-left"
    });

    view.on("click", function(event) 
    {  
      view.hitTest(event.screenPoint).then(function(response) 
      {  
        var graphics = response.results;

        graphics.forEach(function(graphic) 
        {
          if(graphic.graphic.geometry != null)
          {
            graphic.graphic.symbol = symbolViewed;
          }
        });  
      });  
    });  
    
    
    view.when(
      function()
      {
        document.getElementById('searchBar').style.opacity = 1;

        layerList.on("trigger-action", function(event) 
        {
          var id = event.action.id;

          if (id === "full-extent") 
            view.goTo(event.item.layer.graphics);
          else if(id === 'remove-layer')
          {
            stopQuery();
            map.layers.remove(event.item.layer);
          }
        });        
      }, 
      function(error)
      {
        console.log(error);
      });
  });
}

function createLayer(searchTerm)
{
  require([
    "esri/layers/GraphicsLayer",
    "dojo/domReady!"
  ], 
  function (GraphicsLayer) 
  {
    map.layers.forEach
    (
      function(element)
      {
        element.visible = false;
      }
    );

    // Creates the GraphicsLayer where the Graphics
        // for the photos will be stored into.
        var photoLayer = new GraphicsLayer(
          {
            id: searchTerm,
            title: searchTerm
          }
        );

        map.add(photoLayer);
  });
}

function resetMapZoom()
{
  view.zoom = 2;
  view.center = [-30, 10];
}

function mapPhotos(data, searchTerm)
{
  require([
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/PopupTemplate",
    "dojo/domReady!"
  ], 
  function (Graphic, GraphicsLayer, PopupTemplate) 
  {
    if(data != null)
      {
        var currentLayer = map.findLayerById(searchTerm);

        data.forEach(function(element) 
        {
          var point = {
            type: "point",
            latitude: element.latitude,
            longitude: element.longitude
          };
  
          var pointGraphic = new Graphic({
            geometry: point,
            symbol: symbol
          });

          pointGraphic.attributes = 
          {
            "address": element.address,
            "caption": element.caption,
            "city": element.city,
            "latitude": element.latitude,
            "likes": element.likes !== null ? element.likes.toLocaleString('en') : 0,
            "location": element.location,
            "longitude": element.longitude,
            "profilePicUrl": element.profilePicUrl,
            "takenAt": element.takenAt.toUpperCase(),
            "url": element.url,
            "username": element.username
          };

          pointGraphic.popupTemplate = {
            title: "{location}",
            content: [
              {
                type: "text",
                text: '<div class="popup-grid">'
                      + '<div class="popup-header">'
                        + '<a href="https://www.instagram.com/{username}/" target="_blank"><img class="profile-picture" src="{profilePicUrl}"></a>'
                        + '<div class="user-location-information">'
                          + '<div class="username">{username}</div>'
                          + '<div class="location">{location}</div>'
                        + '</div>'
                    + '</div>'
                    + '<img class="popup-content" src="{url}" alt="{caption}" onClick="openImageModal(this.src, this.alt)">'
                    + '<div class="popup-footer">'
                      + '<div class="likes">{likes} likes</div>'
                      + '<div class="caption"><b>{username}</b> {caption}</div>'
                      + '<div class="date">{takenAt}</div>'
                    + '</div>'
                  + '</div>'
              }
            ]
          };

          
  
          currentLayer.graphics.add(pointGraphic);
          
        }); 

        //view.goTo(currentLayer.graphics);
      }
      else
        console.log("Data is null");

      
  });

  

  var listItem = layerList.operationalItems.find(function(element){
    return element.title === searchTerm;

    
  });

  listItem.panel.content = updateLayerListData(listItem);  
}

function updateLayerListData(photoLayer)
{
  updateProgressPercentage(photoLayer.layer.graphics.length, searchTermInfo.mediaCount);

  var layerListStats = '<p><b>' + searchTermInfo.mediaCount.toLocaleString('en') + '</b> Total media.<br>' +
                         '<b>' +  photoLayer.layer.graphics.length.toLocaleString('en') + '</b> Geo-tagged media.</p>';
  
  return layerListStats;
}

function createPopupContent()
{
  var popupHTML = '<div class="popup-grid">'
    + '<div class="popup-header">'
    + '<img class="profile-picture" src="{profilePicUrl"}>'
    + '<div class="user-location-information">'
      + '<div class="username"></div>'
      + '<div class="location"></div>'
    + '</div>'
  + '</div>';

  return popupHTML;
}

initializeMapElements();

function openImageModal(url, caption)
{
    // Get the modal
  var modal = document.getElementById('lightbox');

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  var modalImg = document.getElementById("modal-image");
  var captionText = document.getElementById("caption");

  // Get the <span> element that closes the modal
  var span = document.getElementById("close");

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() 
  { 
    modal.style.display = "none";
    searchBar.style.opacity = 1;
  }

    modal.style.display = "block";
    modalImg.src = url;
    captionText.innerHTML = caption;
}



  

