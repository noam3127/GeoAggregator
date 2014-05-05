var flickrData = (function(){
	var getPhotoId = (function (photoId) {
		var getLocalId = function(){
			return photoId;
		};
		return getLocalId;
		
	}());
	function getFlickrClickHandler(lat, long, title, flickrPhoto, photoInfoBox) {
		
		return function() {
		//	addMarkerListener(flickrPhoto, photoInfoBox);
			var photoMarker = mapSettings.setMarker(lat, long, title, flickrPhoto, photoInfoBox);
			markers.flickrMarkers.push(photoMarker);
			accordions.addMarkerListener(photoMarker, photoInfoBox, "Flickr");
			accordions.markerPan(photoMarker);
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
			
			var flickrSlide = $("#flickr-slide").html("").appendTo($("#map-canvas"));
			//map.controls[google.maps.ControlPosition.LEFT_CENTER].push(flickrSlide[0]);
			flickrSlide.append($("<img id='medium-img' src='" + flickrPhotoMedium + "'/>")).fadeIn();
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
			
				var flickrPhoto = "http://farm" + farm + ".static.flickr.com/" + server + "/" + id + "_" + secret + "_s.jpg",
				    flickrPhotoMedium  = "http://farm" + farm + ".static.flickr.com/" + server + "/" + id + "_" + secret + "_m.jpg",
				    photoInfoBox = "<h3 class='flickrTitle'>" + title + "</h3><img src='" + flickrPhotoMedium + "'/>";
				$("#flickrBox").append("<img id='" + id + "' src='" + flickrPhoto + "'/>");
				var thePicDiv = document.getElementById(id);
				$("#" + id).click(getFlickrClickHandler(lat, long, title, flickrPhoto, photoInfoBox));
				
			//	$("#" + id).hover(getFlickrHoverHandler(id, flickrPhotoMedium, title, photoInfoBox),
			  //  getFlickrLeaveHandler(id, flickrPhotoMedium, title, photoInfoBox));	
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
				
				//if (scrolltop >= (scrollheight - (windowheight + scrolloffset))) {
					$("#flickrBox span").html("");
					++pageNum;	
					getFlickrJSON(pageNum);
					addedFlickrListener = true;
				//}
			});
		}
			
		
	}  
	return {
		displayFlickr: displayFlickr 
	};
}());
