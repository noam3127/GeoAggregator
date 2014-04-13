
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
	
	var marker = new google.maps.Marker({
		position: mapOptions.center,
		map: map,
		title:"Lakewood"
	});
	markers.home = marker;
	
	google.maps.event.addListener(map, 'center_changed', function() {
	    currBounds = map.getBounds();
	    currCenter = map.getCenter();
	});

	var myControl = new CustomMapControls.controlsDiv(map);
	currBounds = map.getBounds();
		
    var first = true;
	
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
		accordions.displayFlickr(1);
		
		var EANpart1 = 'http://api.ean.com/ean-services/rs/hotel/v3/list?apiKey=w365b3fzkx9xd3k4qm8fuky5&destinationString=';
		var fullEAN = EANpart1 + content + '&callback=?';
		ajaxData.fetchEANHotels(fullEAN);
		
		//var googleRests = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAQy7fhEdJNLiPHwCPsllhSKPudRaAtyA4&"
		 //	+"types=food&sensor=true&callback=?&query=" + loc;
		
		var poiUrl = "http://api.ean.com/ean-services/rs/hotel/v3/geoSearch?apiKey=w365b3fzkx9xd3k4qm8fuky5&type=2&destinationString="
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
	
});



var accordions = (function accordions() {
	
	var infoWindow = new google.maps.InfoWindow({
			content: ""
	}); 
	
	function markerPan(marker) {
		//map.setZoom(12);
		map.panTo(marker.getPosition());
		map.setZoom(13);
	}
	
	function addMarkerListener(marker, info) {
	   google.maps.event.addListener(marker, "click", function () {
			infoWindow.setContent(info);
		    infoWindow.open(map, marker);
		   
	   });
	  
	}
	
	function displayWiki(data) {
		  if (data === "null") return;
			geoArray = data.geonames;
			
			$("#accordion").html("Showing top 20 results"); 
			
		    $.each(geoArray, function (key, val) {
			    var marker = mapSettings.setMarker(this.lat, this.lng, this.title, "images/wMarker.png");  
			  	
			    markers.wikiMarkers.push(marker);
			    marker.setAnimation("BOUNCE");
			    var newAccord = "<h3 id='" + this.geoNameId + "' class='accHead' font-size='13px' height='16px'><a href='#'>"
			      + this.title + "<img src='" + this.thumbnailImg + "' height='20px' align='right'></a></h3>"
			      + "<div class='summary'><img src = '" + this.thumbnailImg + "'/>"
			      + this.summary + "<br /><span class='wikiLink'><a target='_blank' href='http://" + this.wikipediaUrl
			      + "'>Go to Wikipedia Article</a></span></div>";
			    $("#accordion").append(newAccord);
			    
			    var geoNameId = this.geoNameId;
			    $("#" + geoNameId).data(this, marker);
			    $("#" + geoNameId).click(function () {   
					markerPan(marker);					
			    });
			   
			    addMarkerListener(marker, newAccord);
			    
			});
			
			$("#accordion").accordion("refresh").accordion({active: 0});
			if (!$("#wikiCheck").is(":checked")) {
				mapSettings.clearMarkers(markers.wikiMarkers);
			}
			var newCenter = mapSettings.getLatLngObj(geoArray[0].lat, geoArray[0].lng);
			//google.maps.event.trigger(map, "resize");
			map.panTo(newCenter);
			mapSettings.setZoom(12);
	}
	
	function displayHotels(data) {	
		
		var hotels = data.HotelListResponse.HotelList.HotelSummary;
		$("#eanAccordion").html("Showing top 20 of " + hotels.length + " results"); 
		//console.log(hotels);
		var num = 0;
		
		 $.each(hotels, function (key, val) {
			 var info = decodeURIComponent(this.shortDescription);
		 	 info = $("<div/>").html(info).text();
		     //info = $("<div/>").html(info).html();
		  
			 if (num > 20) return;	
			 var marker = mapSettings.setMarker(this.latitude, this.longitude, this.name, "images/HotelMarker.png"); 
			 markers.hotelMarkers.push(marker);
			 var newAccord = "<h3 id='" + this.hotelId + "' class='accHead' font-size='13px' height='16px'><a href='#'>"
			      + this.name + "<img src='http://images.travelnow.com" + this.thumbNailUrl + "' height='20px' align='right'></a></h3>"
			      + "<div class='summary'><img src = 'http://images.travelnow.com" + this.thumbNailUrl + "'/>"
			      + this.address1 + "<br/>" + this.city + ", " + this.postalCode + ", " + this.locationDescription + "\t"
			      + this.countryCode + "<br/><span class='rating'> General Rating: " + this.hotelRating + "<br/>Trip Advisor Rating: "
			      + this.tripAdvisorRating + "</span><br/><div class='summary'>" + info + "..."
			      + "<a target='_blank' href='"+ this.deepLink + "'> More info</a></div>" 
			      + "</div>";
				$("#eanAccordion").append(newAccord); 
				$( "#eanAccordion" ).accordion({ heightStyle: "content" });
				
				
				$("#" + this.hotelId).click(function () {
					markerPan(marker);
			    });
			    addMarkerListener(marker, newAccord);
				num++;
			});
		$("#eanAccordion").accordion("refresh").accordion({active: -1});
		if (!$("#hotelCheck").is(":checked")) {
				mapSettings.clearMarkers(markers.hotelMarkers);
		}
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
	
	function displayPOI(results) {
		//console.log(results);
		
		var count = results.LocationInfoResponse.LocationInfos["@size"],	
			info = results.LocationInfoResponse.LocationInfos.LocationInfo,
			num = 0;
			
			$("#poiAccordion").html("Showing top 20 of " + count + " results"); 
			$.each(info, function (key, value) {
				if (this.type !== 2 || this.activePropertyCount === 0) return;
				if (num > 20) return;
				var marker = mapSettings.setMarker(this.latitude, this.longitude, this.description, "images/LandmarkMarker.png");
				markers.landMarkers.push(marker);
				
				/*var streetImg = "http://maps.googleapis.com/maps/api/streetview?size=200x200&location="
					+ this.description + "&fov=90&heading=235&pitch=10&sensor=true";*/
				
				//var streetImg = "http://maps.googleapis.com/maps/api/streetview?size=200x200&location="
					//+ this.latitude + "," + this.longitude + "&fov=90&heading=135&pitch=20&sensor=true";
			
				var newAccord = "<h3 id='" + this.destinationId + "' class='accHead' font-size='8px' height='16px'><a href='#'>"
					 + this.description + "</a></h3><div class='flickr" + num + "' align='center' font-size='14px'>"
					  + "<br />(click on image to zoom in)</div>";
					 
				$("#poiAccordion").append(newAccord); 
				$("#poiAccordion").accordion({ heightStyle: "content" });
				var flickrPlaceUrl = "http://api.flickr.com/services/rest/?method=flickr.places.find&api_key=9b0940f2dd674df5abb54f9c95f480d9&query="
					 + this.description + "&place_id=" + flickrPlaceId + "&format=json&jsoncallback=?";
				var flickrPhoto;
				$.getJSON(flickrPlaceUrl, function (data) {
						console.log(data);
					var woe = data.places.place[0].woeid,
						i;
					var farm = data.photos.photo[0].farm,
						server = data.photos.photo[0].server,
						id = data.photos.photo[0].id,
						secret = data.photos.photo[0].secret;
					//  flickrPhoto = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9b0940f2dd674df5abb54f9c95f480d9&woe_id="
					 //+ woe + "&format=json&jsoncallback=?";
					// flickrPhoto = "http://api.flickr.com/services/feeds/photos_public.gne?&api_key=9b0940f2dd674df5abb54f9c95f480d9&woe_id="
					// + woe + "&jsoncallback=?";
					//flickrPhoto = "http://farm" + farm + ".static.flickr.com/" + server + "/" + id + "_" + secret + ".jpg";
					//console.log(flickrPhoto);
					flickrPhoto = "http://farm4.static.flickr.com/3809/13695993904_a5d1a2f91e_m.jpg";
					$("#flickr" + num).append("<img src='" + flickrPhoto + "'/>");
				
				});
				$("#" + this.destinationId).click(function () {
					markerPan(marker);
			    });
			    
			    addMarkerListener(marker, this.description);
				num++;
			});
			
			$(".flickrImg").click(function () {
				map.setZoom(20);
		    });
			$("#poiAccordion").accordion("refresh").accordion({active: -1});
			if (!$("#landmarkCheck").is(":checked")) {
				mapSettings.clearMarkers(markers.landMarkers);
			}
			
	  	    
	}
	
	//for closure problem with click handler
	var getPhotoId = (function (photoId) {
		var getLocalId = function(){
			return photoId;
		};
		return getLocalId;
		
	}());
	function getFlickrClickHandler(lat, long, title, flickrPhoto, photoInfoBox) {
		return function() {
			var photoMarker = mapSettings.setMarker(lat, long, title, flickrPhoto, photoInfoBox);
			markers.flickrMarkers.push(photoMarker);
			addMarkerListener(photoMarker, photoInfoBox);
			markerPan(photoMarker);
		};
	}
	function getFlickrHoverHandler(id, flickrPhotoMedium, title, photoInfoBox) {
		return function () {
			var mouseX, mouseY;
			$(document).mousemove( function(e) {
			    mouseX = e.pageX; 
			    mouseY = e.pageY;
			});  
			
			$("<img id='medium-img' src='" + flickrPhotoMedium + "'/>").appendTo("#flickr-hover");
			var imgHeight = $("#medium-img").height() + 200;
			var imgWidth =  $("#medium-img").height() + 200;
			$("#flickr-hover").css({
				'bottom': mouseY,
				'left': mouseX,
				'min-height': imgHeight,
				'min-width': imgWidth
			}).fadeIn("fast");
			
		};
	}	
	function getFlickrLeaveHandler() {
		return function () {
			$("#flickr-hover").hide().html("");
		};
	}
	
	function getFlickrJSON(pageNum) {
		var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9b0940f2dd674df5abb54f9c95f480d9"
			+ "&place_id=" + flickrPlaceId + "&sort=interestingness-desc&per_page=100&page="
			+ pageNum + "&has_geo=1&extras=geo&accuracy=13&format=json&jsoncallback=?";
			
		$.getJSON(url, function (data) {
			var i;
			for (i = 0; i < data.photos.photo.length; i++) {
				var farm = data.photos.photo[i].farm,
					server = data.photos.photo[i].server,
					id = data.photos.photo[i].id,
					secret = data.photos.photo[i].secret,
					lat = data.photos.photo[i].latitude,
					long = data.photos.photo[i].longitude,
					title = data.photos.photo[i].title;
			 //   console.log(id);
				var flickrPhoto = "http://farm" + farm + ".static.flickr.com/" + server + "/" + id + "_" + secret + "_s.jpg",
				    flickrPhotoMedium  = "http://farm" + farm + ".static.flickr.com/" + server + "/" + id + "_" + secret + "_m.jpg",
				    photoInfoBox = $("<h3 class='flickrTitle'>" + title + "</h3><img src='" + flickrPhotoMedium + "'/>");
				$("#flickrBox").append("<img id='" + id + "' src='" + flickrPhoto + "'/>");
				var thePicDiv = document.getElementById(id);
				$("#" + id).click(getFlickrClickHandler(lat, long, title, flickrPhoto, photoInfoBox));
				$("#" + id).hover(getFlickrHoverHandler(id, flickrPhotoMedium, title, photoInfoBox),
					 getFlickrLeaveHandler(id, flickrPhotoMedium, title, photoInfoBox));	
			}
			
			
			
			if (data.photos.pages > pageNum) {
				$("#flickrBox").append("</br><span font-size='14px' cursor='pointer'>click here to get more photos</span>");
			}
		});
		
	}
	function displayFlickr() {
		var pageNum = 1;
		$("#flickrBox").html("Click on a photo to show it\'s respective location on the map<br />");
		getFlickrJSON(pageNum);
		var scrolltop = $('#flickrBox').attr('scrollTop'),  
			scrollheight = $('#flickrBox').attr('scrollHeight'),  
			windowheight = $('#flickrBox').attr('clientHeight'),
			scrolloffset = 200;
		if (addedFlickrListener === false) {	 
			$(document).on("click", "#flickrBox span", function () {
				addedClickHandler = true;
				
				//if (scrolltop >= (scrollheight - (windowheight + scrolloffset))) {
					$("#flickrBox span").html("");
					++pageNum;	
					getFlickrJSON(pageNum);
					addedFlickrListener = true;
				//}
			});
		}
			
		 
			/*
			 * function scrollalert(){  
			    var scrolltop=$('#scrollbox').attr('scrollTop');  
			    var scrollheight=$('#scrollbox').attr('scrollHeight');  
			    var windowheight=$('#scrollbox').attr('clientHeight');  
			    var scrolloffset=20;  
			    if(scrolltop>=(scrollheight-(windowheight+scrolloffset)))  
			    {  
			        //fetch new items  
			        $('#status').text('Loading more items...');  
			        $.get('new-items.html', '', function(newitems){  
			            $('#content').append(newitems);  
			            updatestatus();  
			        });  
			    }  
			 */
			
		
		
	}  
	return {
		displayHotels: displayHotels,
		displayWiki: displayWiki,
		displayGooglePlaces: displayGooglePlaces,
		googlePlaces: googlePlaces,
		displayPOI: displayPOI,
		displayFlickr: displayFlickr
	};
}());
/*
 * https://api.flickr.com/services/feeds/photos_public.gne?tags=mount%20rainier&format=json&jsoncallback=?
 * $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?",
 * http://api.flickr.com/services/rest/?method=flickr.places.find&query=
 */

