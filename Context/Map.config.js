console.log("Map config");
var paramsString = window.location.search.split("?params=");
paramsString = paramsString.length>1?paramsString[1]:null;
var paramsObject = JSON.parse(decodeURIComponent(paramsString));
console.log("paramsObject in Info app",paramsObject);
var params = paramsObject?Object.keys(paramsObject):null;
const mapContext = params&&params.indexOf('mapContext')!=="-1"?paramsObject['mapContext']:null;
module.exports = {
  params: {
    center: mapContext?(mapContext["center"]?mapContext["center"]:[48.836703,2.334345]):window.mapContext?(window.mapContext.center?window.mapContext.center:[48.836703,2.334345]):[48.836703,2.334345],
    zoomControl: false,
    zoom: mapContext?(mapContext["zoom"]?mapContext["zoom"]:6):window.mapContext?(window.mapContext.zoom?window.mapContext.zoom:6):5,
    maxZoom: 18,
    minZoom: 1,
    scrollwheel: false,
    legends: true,
    infoControl: false,
    attributionControl: true
  },
  tileLayer : {
    uri: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    params: {
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      id: '',
      accessToken: ''
    }
  }
};
