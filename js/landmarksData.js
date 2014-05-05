var landmarksData = (function () {
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
				
				//var streetImg = "http://maps.googleapis.com/maps/api/streetview?size=200x200&location="
					+ this.description + "&fov=90&heading=235&pitch=10&sensor=true";
				//var streetImg = "http://maps.googleapis.com/maps/api/streetview?size=200x200&location="
					//+ this.latitude + "," + this.longitude + "&fov=90&heading=135&pitch=20&sensor=true";
			
				var newAccord = "<h3 id='" + this.destinationId + "' class='accHead' font-size='8px' height='16px'><a href='#'>"
					 + this.description + "</a></h3><div class='flickr" + num + "' align='center' font-size='14px'>"
					  + "<br /><button class='save-marker-btn'>Save this Marker</button></div>";
					 
				$("#poiAccordion").append(newAccord); 
				$("#poiAccordion").accordion({ heightStyle: "content" });
				var flickrPlaceUrl = "http://api.flickr.com/services/rest/?method=flickr.places.find&api_key=9b0940f2dd674df5abb54f9c95f480d9&query="
					 + this.description + "&place_id=" + flickrPlaceId + "&format=json&jsoncallback=?";
				var flickrPhoto;
				/*$.getJSON(flickrPlaceUrl, function (data) {
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
				
				});*/
				$("#" + this.destinationId).click(function () {
					accordions.markerPan(marker);
			    });
			    accordions.addMarkerListener(marker, this.description, "Landmarks");
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
	return {
		displayPOI: displayPOI
	};
}());
