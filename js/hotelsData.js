var hotelsData = (function () {
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
			      + "<a target='_blank' href='"+ this.deepLink + "'> More info</a><br /><button class='save-marker-btn'>"
			      + "Save this Marker</button></div></div>";
				$("#eanAccordion").append(newAccord); 
				$( "#eanAccordion" ).accordion({ heightStyle: "content" });
				
				
				$("#" + this.hotelId).click(function () {
					accordions.markerPan(marker);
			    });
			    accordions.addMarkerListener(marker, newAccord, "Hotels");
				num++;
			});
		$("#eanAccordion").accordion("refresh").accordion({active: -1});
		if (!$("#hotelCheck").is(":checked")) {
				mapSettings.clearMarkers(markers.hotelMarkers);
		}
	}
	return {
		displayHotels: displayHotels
	};
}());