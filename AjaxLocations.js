var ajaxData = (function () { 
	
	function fetchEANHotels(url) {
		$.ajax({ 
			 url: url,
			 dataType: 'json',
			 data: {},
			 type: 'get',
			 success: function(json) {
			 	//console.log(json);
		        hotelsData.displayHotels(json);
		      //  console.log(json);
		     }
		 });
	}
	function fetchWiki(url) {
		$.getJSON(url, function(data){
			geo = data.geonames;
			wikiData.displayWiki(data);
		});
	}
	function fetchWikiByBounds() {
	
	}
	
	function fetchGooglePlaces(url) {
		$.ajax({ 
			 url: url,
			 dataType: 'json',
			 data: {},
			 type: 'post',
			 success: function(json) {
		        accordions.displayGooglePlaces(json);
		        //console.log(json);
		     }
		 });
	}
	
	function fetchPOI(url) {
		$.getJSON(url, function(json){
			landmarksData.displayPOI(json);
			
		});
	}
		
	function fetchFlickrPlaces(loc) {
		var flickr_woe = "http://api.flickr.com/services/rest/?method=flickr.places.find&api_key=9b0940f2dd674df5abb54f9c95f480d9&query=" 
			+ loc + "&format=json&jsoncallback=?",
		    places;
		
		$.getJSON(flickr_woe, function (data) {		
			places = data;
		});
		
	}
		
	function postSavedMarkers(category, str) {
		var string = JSON.stringify(str);
		$.ajax({ 
			 url: 'saveMarkers.php',
			 dataType: 'json',
			 data: {'category': category, 'info': string},
			 type: 'POST',
			 success: function(json) {
	  	 	 	//alert("saved marker for " + category + string);
		     }
	    });
	}
	
	return {
		fetchEANHotels: fetchEANHotels,
		fetchWiki: fetchWiki,
		fetchWikiByBounds: fetchWikiByBounds,
		fetchGooglePlaces: fetchGooglePlaces,
		fetchPOI: fetchPOI,
		fetchFlickrPlaces: fetchFlickrPlaces,
		postSavedMarkers: postSavedMarkers
	};
}());