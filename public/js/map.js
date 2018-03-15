function initMap(lat,lng) {
  var userAddress = {
    lat: lat,
    lng: lng
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: userAddress
  });
  var marker = new google.maps.Marker({
    position: userAddress,
    map: map
  });
}
