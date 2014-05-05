var savedMap = (function () {
	function saveLocal(markers) {
		var markerRefs = {},
			i;
		//$.each(markers, function() {
			for (i = 0; i < markers.wikiMarkers.length; i++) {
				markerRefs.wikiMarkers[i] = this[i];
			}
		//});
		localStorage.setItem("localSavedMarkers", JSON.stringify(markers));
	}
	
	function getSavedMarkers() {
		var savedMarkers = localStorage.getItem(JSON.parse(localSavedMarkers));
		return savedMarkers;
	}
	
	return {
		saveLocal: saveLocal,
		getSavedMarkers: getSavedMarkers
	};
}());
