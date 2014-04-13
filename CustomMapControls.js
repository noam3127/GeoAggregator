
var CustomMapControls = (function () {
	function controlsDiv(map, theDiv, position) {
		var cDiv = $("#map-options").appendTo("#map-canvas").fadeIn(1500);
		cDiv.index = 0;
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(cDiv[0]);
		var num = 0;
		
		$("input[type=checkbox]").on("click", function(){
		   
			if ($(this).val() === "Wikipedia") {
				doMarkers(this, markers.wikiMarkers);
			} else if ($(this).val() === "Landmarks") {
				doMarkers(this, markers.landMarkers);
			} else if ($(this).val() === "Hotels") {
				doMarkers(this, markers.hotelsMarkers);
			} else {
				doMarkers(this, markers.flickrMarkers);
			}
  
		});
	    function doMarkers(selector, markersCat) {
	    	$(selector).is(":checked") ? mapSettings.showMarkers(markersCat) : mapSettings.clearMarkers(markersCat);
	    } 
		
	}
	function addControls() {
		
	}
	
	return {
		controlsDiv: controlsDiv,
		addControls: addControls
	};

}());

