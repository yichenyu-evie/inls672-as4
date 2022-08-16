// Add a click event listener to the 'Find Parks' button; when clicked, call getParks()
   let findButton = document.querySelector('#findParks');
   findButton.addEventListener('click', getParks);

   // This is the JSON object created from the JSON url.
   // It is a global variable because it is referenced by multiple functions.
   var obj;

   // This function call starts the application by loading the data from url
   loadData();

   async function loadData() {
      let url = 'https://storage.googleapis.com/kagglesdsdata/datasets/10525/14746/schoolInfo.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20210429%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210429T030214Z&X-Goog-Expires=259199&X-Goog-SignedHeaders=host&X-Goog-Signature=02645adfa002b792d09fea7aea9c2f5b2495c4c669a0bf0bbcae83aa09602ea98d310bd91c58d059c15db7d372522c03bd301c2daf2b4e6d410c52404382a0848703dde0a763750e12245e9fb10babed65f620f02fcc1b20946a0b933b8f3a797d05efe7bd75190375496e4f425100f81fed1495239e1b757ac391006e3a22c2b4665de2fca84a02eb10eb6c480d76d6c840174d4968daf279f3eecaac1262515863330dbcd7a9e22aca1e158735373966ee0ee43d7bb9355991eeda5d874c8b139df2ce917b2cae0722ff732795a10391a328e5f10686a0fee717c903ef5dc5de166c3d6d8fa2f733f3fb07ee073bf220cc142363cb22758f8992f45d51a095';

      try {
        let response = await fetch(url);
        obj = await response.json();
        console.log(obj);   // Look at this in the Inspector to see what the data structure looks like.

        // Create a set of features found in data.
        // Since multiple parks may have the same feature, we want to remove any duplicates from our list.
        // A set data structure will not allow a duplicate item to be added.
        let featureSet = new Set();
        obj.forEach(park => {
          featureSet.add(park.state);
        });
        
        // Convert the set to a sorted array (or list)
        featuresList = Array.from(featureSet).sort();
        let featureOptions = '';

        // Create the dropdown list of options for the feature list
        featuresList.forEach(feature => {
          let option = `<option>${feature}</option>`;
          featureOptions += option;
        });

        let selectOptions = document.querySelector('#feature');
        selectOptions.innerHTML = featureOptions;
      } catch (error) {
        console.log(error);
      }
    }

   // Generate the <li> of parks for the selected feature
   function getParks() {
     // Clear any previous results before adding newly selected park details
     document.querySelector('#details').innerHTML =  "";

     let parkList = '<ul>';
     // Loop through the obj list and look for parks with the selected feature value.
     // If there is a match, add as a <li> item, and associated an onclick event with the item.
     // If the list item is clicked, then the showDetails function is called with parameters describing the park
     obj.forEach(park => {
       if (park.state == feature.value) {
         let actavg = park["act-avg"];
         let satavg = park["sat-avg"];
         let parkData = `<li class="parkname" onclick="showDetails('${park.city}','${park.displayName}','${park.overallRank}', '${actavg}', '${satavg}', '${park.primaryPhoto}')">${park.displayName}</li>`;
         parkList += parkData;
       }
     });

     parkList += '</ul>';
     // Add the list of parks to the <ul> list element
     let selectedParks = document.querySelector('#parklist');
     selectedParks.innerHTML = parkList;
   }

   // Show the name (linked to url), address, hours of operation, and lat/lon for the park.
   // Call showMap to display the Leaflet map for the park.
   function showDetails(city, name, rank, act, sat, uniimg) {
     details = `<h4>${name}</h4>
                <p class="desc">Locate in ${city}</p>
                <p class="desc">Overall ranking: ${rank}</p>
                <p class="desc">Average ACT score: ${act}</p>
                <p class="desc">Average SAT score: ${sat}</p>
                <br/>
                <img src="${uniimg}">`
     document.querySelector('#details').innerHTML = details;
     
   }

   //  Uses the Leaflet API to render the map using the latitude and longitude values
//   function showMap(lat, lon) {
//      var mymap = L.map('map').setView([lat, lon], 13);
//      mymap.setView([lat, lon], 13);
//      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
//        maxZoom: 18,
//        id: 'mapbox/streets-v11',
//        tileSize: 512,
//        zoomOffset: -1,
//        accessToken: 'your.mapbox.access.token'
//   } ).addTo(mymap);
//
//   L.marker([lat, lon]).addTo(mymap);
// }