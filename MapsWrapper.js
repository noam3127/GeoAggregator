var mapSettings = (function(){
	var getLatLngObj = function (lat, long) {
		return new google.maps.LatLng(lat, long);
	};
	function setCenter(lat, long){	
		map.setCenter(getLatLngObj(lat, long));
	}
	function setZoom(num){
		map.setZoom(num);
	}
	function setMarker(lat, long, name, imageSrc){
		var marker = new google.maps.Marker({
			map: map,
			position: getLatLngObj(lat, long),
			title: name
		});
		
		if (imageSrc) {
			marker.setIcon(imageSrc);
		}
		return marker;
	}
	
	function clearMarkers(markersCat) {
		var i;
		for (i = 0; i < markersCat.length; i++) {
			markersCat[i].setVisible(false);
		}
	}
	function showMarkers(markersCat) {
		var i;
		for (i = 0; i < markersCat.length; i++) {
			markersCat[i].setVisible(true);
		}
	}
	
	return {
		setCenter: setCenter,
		setZoom: setZoom,
		setMarker: setMarker,
		clearMarkers: clearMarkers,
		showMarkers: showMarkers,
		getLatLngObj: getLatLngObj
	};
}());

var	mapStyle =[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]},
	{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},
	{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},
	{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},
	{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},
	{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},
	{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},
	{"featureType":"poi.business","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},
	{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},
	{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},
	{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},
	{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},
	{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},
	{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]}];