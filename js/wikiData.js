var wikiData = (function () {
	
	function displayWiki(data) {
		  if (data === "null") return;
		  console.log(data);
			geoArray = data.geonames;
			$("#accordion").html("Showing top 20 results"); 
			
		    $.each(geoArray, function (key, val) {
			    var marker = mapSettings.setMarker(this.lat, this.lng, this.title, "images/wMarker.png");  
			    markers.wikiMarkers.push(marker);
			    var newAccord = "<h3 id='" + this.geoNameId + "' class='accHead' font-size='13px' height='16px'><a href='#'>"
			      + this.title + "<img src='" + this.thumbnailImg + "' height='20px' align='right'></a></h3>"
			      + "<div class='summary'><img src = '" + this.thumbnailImg + "'/>"
			      + this.summary + "<br /><span class='wikiLink'><a target='_blank' href='http://" + this.wikipediaUrl
			      + "'>Go to Wikipedia Article</a></span><br /><button id='btn-" + this.geoNameId + "' class='save-marker-btn'>Save this Marker</button></div>";
			  //  var newAccord = wikiTemplate(this.geoNameId, this.thumbnailImg, this.summary, this.wikipediaUrl); 
			    $("#accordion").append(newAccord);
			    var geoNameId = this.geoNameId;
			    var theWikiDiv = $("#" + geoNameId)[0];
			   
		    	$.data(theWikiDiv, {
	        		theAccord: newAccord
			    });
			   
			    $("#" + geoNameId).click(function () {   
					accordions.markerPan(marker);
					var closeureDiv = getClosureDiv(theWikiDiv);	
			    });
			    
			    $("#btn-" + geoNameId).click(function () {  
			    	var elem = getClosureElement(geoArray[key]); 
					console.log("pressed " + elem.geoNameId);
					ajaxData.postSavedMarkers("wikipedia", elem);
			    });
			    accordions.addMarkerListener(marker, newAccord, "Wikipedia");			    
			});
			
			$("#accordion").accordion("refresh").accordion({active: 0});
			if (!$("#wikiCheck").is(":checked")) {
				mapSettings.clearMarkers(markers.wikiMarkers);
			}
			
			//addSaveButtonHandler(geoArray);
			var newCenter = mapSettings.getLatLngObj(geoArray[0].lat, geoArray[0].lng);
			map.panTo(newCenter);
			mapSettings.setZoom(12);
	}
	function getClosureDiv(div) {
		var theDiv = div;
		return theDiv;
	}
	function getClosureElement(elem) {
		element = elem;
		return element;
	}
	
	function addSaveButtonHandler(geoArray) {
		console.log(geoArray);
		var i;
		for (i = 0; i < geoArray.length; i++) {
			$("#btn-" + geoArray[i].geoNameId).click(function(){
				var elem = getClosureElement(geoArray[i]);
				console.log(i + ": pressed " + elem.geoNameId);
				ajaxData.postSavedMarkers("wikipedia", elem);
			});
		}
	}
	function wikiTemplate(geoNameId ) {
		
	}
	
	return {
		displayWiki: displayWiki
	};
}());
