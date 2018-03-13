function initMap() {
  var userAddress = {
    lat: -25.363,
    lng: 131.044
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
