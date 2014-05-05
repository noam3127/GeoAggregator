
var map, currCenter, currBounds, loc, specific, flickrPlaceId, service, 
	addedFlickrListener = false,
	savedMarkers = {},
	markers = {};
	markers.wikiMarkers = [];
	markers.hotelMarkers = [];
	markers.landMarkers = [];
	markers.flickrMarkers = [];
	
	
$(document).ready(function() {
	//"use strict";
	var geoArray = [];
    var mapOptions = {
	  center: new google.maps.LatLng(40.0955, -74.2220),
	  zoom: 2
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	/*var marker = new google.maps.Marker({
		position: mapOptions.center,
		map: map,
		title:"Lakewood"
	});
	markers.home = marker;*/
	
	
	var myControl = new CustomMapControls.controlsDiv(map);
	CustomMapControls.addEraseButton(map);
	
	currBounds = map.getBounds();
		
    var first = true;
    
	$("#input").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#input-btn").click();
	    }
	});
	$("#input-btn").click(function(){
		
		loc = $("#input").val();
	    $("#input").val("");
	    
		if (first) {
			$("#where").fadeOut(500);
		    $("#input-container").animate({"margin-top": "-=150"}, 500);	
		    $("#menu").append("<table id='choice-container'><table>");
		    first = false;
		} else {
			$("#tabs").fadeOut("fast");
		}
		var flickr_woe = "http://api.flickr.com/services/rest/?method=flickr.places.find&api_key=9b0940f2dd674df5abb54f9c95f480d9&query=" 
			+ loc + "&format=json&jsoncallback=?",
			 specific;
			 
		$.getJSON(flickr_woe, function (data) {
		    specific = specify(data);
		});
		$.each(markers, function() {
			mapSettings.clearMarkers(this);	
		});
		google.maps.event.addListener(map, 'center_changed', function() {
	       currBounds = map.getBounds();
	       console.log(currBounds);
	       currCenter = map.getCenter();
   		});
   		
		$("#erase-btn").click(function() {
			$.each(markers, function(){
				var j;
				for (j = 0; j < this.length; j++) {
					this[j].setMap(null);
				}
			});
			var bounds = map.getBounds(),
				
				sw = bounds.getSouthWest,
				ne = bounds.getNorthEast;
				/*east = ne..j,
				west = bounds.Ba.k,
				north = bounds.ra.j,
				south = bounds.ra.k;*/
			console.log(sw);
			/*var wikiBoundsUrl = "http://api.geonames.org/wikipediaSearch?"
	       		+ "east=" + east + "&west=" + west + "&north=" + north + "&south=" + south +"&maxRows=40&username=noam3127&type=json&callback=?";
	       		
			ajaxData.fetchWiki(wikiBoundsUrl);*/
			
		});
	});
	
	function specify(data) {
		
		var places = data.places.place;
		$("#choice-container").html("<thead><td>Please choose a location:</td></thead><tbody>").show();
		$.each(places, function(k, v) {	
			var string = v._content,
				woeid = v.woeid;
			
			$("#choice-container").append("<tr><td id='" + woeid + "' class='choice'>" + string + "</td></tr>");
			$("#" + woeid).data(v);
			$("#" + woeid).click( function () {
				$("#choice-container").hide();
				getData(v);
			});
		});
		$("#choice-container").append("</tbody>");
		$("#choice-container").css({
			"font-family": "futura",
			"font-size": "1.5em",
			background: "#808080",
			color: "#383333",
			cursor: "pointer",
			"margin-left": "1em",
			"padding-left": "1em",
			width: "90%",
			"border-radius": "4px",
			overflow: "auto"
		});
		$(".choice").css({
			"font-family": "arial",
			"font-size": ".7em",
			//"padding-left": "1em",
			"padding-top": "10px"
		});
		
		$("#choice-container .choice").mouseenter(function (){
			$(this).css("background", "white");
		}).mouseleave(function () {
			$(this).css("background", "default");
		});
	}
	
	function getData(place) {
		flickrPlaceId = place.place_id;
		$( "#tabs" ).tabs({ active: 0 }).fadeIn(1100);
	    $( "#tabs" ).tabs({ show: { effect: "blind", duration: 600 } });
	    var content = place._content;
	    var geoURLPart1 = "http://api.geonames.org/wikipediaSearch?";
	    var fullURL = geoURLPart1 + "&q=" +  content + "&maxRows=20&username=noam3127&type=json&callback=?";
	
		ajaxData.fetchWiki(fullURL);
		flickrData.displayFlickr(1);
		
		var EANpart1 = 'http://dev.api.ean.com/ean-services/rs/hotel/v3/list?CID=55505&apiKey=d88batasn4m69t9xfmr7k7sj&destinationString=';
		var fullEAN = EANpart1 + content + '&callback=?';
		ajaxData.fetchEANHotels(fullEAN);
		
		//var googleRests = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAQy7fhEdJNLiPHwCPsllhSKPudRaAtyA4&"
		 //	+"types=food&sensor=true&callback=?&query=" + loc;
		
		var poiUrl = "http://dev.api.ean.com/ean-services/rs/hotel/v3/geoSearch?CID=55505&apiKey=d88batasn4m69t9xfmr7k7sj&type=2&destinationString="
			+ content + "&callback=?";
		ajaxData.fetchPOI(poiUrl);
	/*	var request = {
		    location: map.getCenter(),
		    radius: '500',
		    types: ['store', 'park']
		};
	    service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, accordions.displayGooglePlaces);*/
	}
	function getAllMarkers(){
		return markers;
	}
	
});



var accordions = (function () {
	
	var infoWindow = new google.maps.InfoWindow({
			content: ""
	}); 
	
	function markerPan(marker) {
		//map.setZoom(12);
		map.panTo(marker.getPosition());
		map.setZoom(13);
	}
	
	function addMarkerListener(marker, info, markerCat) {
	   google.maps.event.addListener(marker, "click", function () {
	   		
			infoWindow.setContent(info);
		    infoWindow.open(map, marker);
	   });
	}
	function getClosureDiv(div) {
		var theDiv = div;
		return theDiv;
	}
	
	function googlePlaces() {
		var request = {
		    location: map.getCenter(),
		    radius: '500',
		    types: ['store', 'park']
		};
	    service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, accordions.displayGooglePlaces);
		
	}
	
	function displayGooglePlaces(results) {
	   var i;
	   //console.log(results);
	  /* if (status == google.maps.places.PlacesServiceStatus.OK) {
	       for (i = 0; i < results.length; i++) {
	             var place = results[i];
		         var marker = new google.maps.Marker({
					position: place.geometry.location,
					map: map,
					title: place.name
				});
				console.log(place.name);
	       
	       }
	   }*/
	}
	return {
		displayGooglePlaces: displayGooglePlaces,
		googlePlaces: googlePlaces,
		markerPan: markerPan,
		addMarkerListener: addMarkerListener
	};
}());
/*
 * https://api.flickr.com/services/feeds/photos_public.gne?tags=mount%20rainier&format=json&jsoncallback=?
 * $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?",
 * http://api.flickr.com/services/rest/?method=flickr.places.find&query=
 */

