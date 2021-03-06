// Map
function map() {
    map = jq('#gmap').gmap({
        navigationControl: false, 
        mapTypeControl: true, 
        scrollwheel: false,
        zoom: 1,
        disableDoubleClickZoom: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }).bind('init', function() { 
        jq.getJSON( '/map-data', function(data) { 
            addMarkers(data);
        });
    });
}
        var lat, lng;

function addMarkers(data) {
    jq.each( data.markers, function(i, marker) {
         var geocoder = new google.maps.Geocoder(); 
    geocoder.geocode( { 'address': marker.raw_address }, function(results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
           console.log(status);
            lat = results[0].geometry.location.lat();
               lng = results[0].geometry.location.lng();
                jq('#gmap').gmap('addMarker', { 
                    'position': new google.maps.LatLng(lat, lng), 
                    'bounds': true ,
                    'title': marker.title,
                    'content': marker.content,
                }).click(function() {
                   jq('#gmap').gmap('openInfoWindow', { 'content': marker.content }, this);
                });
       }
    });

               
            });
}

function registerMapEvents() {
    jq('.results_entry').click(function() {
    var id = jq(this).data('id');
     var marker = map.gmap("find", 'markers', {'property': 'id', 'value': id}, function(marker, found) {
           if (marker.id == id) {
               map.gmap('openInfoWindow', {"content": marker.content}, marker);
           }
           
    });
            console.log('click');
    });
}