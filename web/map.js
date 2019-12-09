var map = new mapboxgl.Map({
    "container": "map",
    "hash": "map",
    "zoom": 15,
    "center": [19.76231, 52.51863],
    "minZoom": 6,
    "maxZoom": 19,
    "style": {
        "version": 8,
        "sources": {
            "raster-tiles": {
            "type": "raster",
            "tiles": [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            "tileSize": 256,
            "attribution": "© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors"
            },
            "mvt-tiles": {
                "type": "vector",
                "tiles": [
                    "https://budynki.openstreetmap.org.pl/mvt/{z}/{x}/{y}.pbf"
                ]
            }
        },
        "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
        "layers": [
            {
                "id": "simple-tiles",
                "type": "raster",
                "source": "raster-tiles",
                "minzoom": 0,
                "maxzoom": 21
            }, {
                "id": "prg2load_general",
                "type": "circle",
                "source": "mvt-tiles",
                "source-layer": "prg2load_geomonly",
                "minzoom": 6,
                "maxzoom": 15,
                "paint": {
                    "circle-radius": 3,
                    "circle-color": "purple",
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                    "circle-opacity": 0.5
                }
            }, {
                "id": "prg2load",
                "type": "circle",
                "source": "mvt-tiles",
                "source-layer": "prg2load",
                "minzoom": 15,
                "paint": {
                    "circle-radius": 3,
                    "circle-color": "purple",
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                    "circle-opacity": 0.9
                }
            }, {
                "id": "house-numbers",
                "type": "symbol",
                "source": "mvt-tiles",
                "source-layer": "prg2load",
                "minzoom": 15,
                "layout": {
                    "text-field": "{nr}",
                    "text-font": ["Metropolis Regular"],
                    "text-size": 12,
                    "text-variable-anchor": ["bottom"],
                    "text-justify": "center"
                },
                "paint": {
                    "text-halo-color": "white",
                    "text-halo-width": 2
                }
            }, {
                "id": "buildings",
                "type": "fill",
                "source": "mvt-tiles",
                "source-layer": "lod1_buildings",
                "minzoom": 14,
                "paint": {
                    "fill-color": "red",
                    "fill-opacity": 0.7
                }
            }
        ]
    }
});

map.addControl(new mapboxgl.NavigationControl());

// When a click event occurs on a feature in the states layer, open a popup at the
// location of the click, with description HTML from its properties.
map.on("click", "prg2load", function (e) {
    console.log(e.features[0].properties);
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(getPopupText(e))
    .addTo(map);
});

// Change the cursor to a pointer when the mouse is over the states layer.
map.on("mouseenter", "prg2load", function () {
    map.getCanvas().style.cursor = "pointer";
});

// Change it back to a pointer when it leaves.
map.on("mouseleave", "prg2load", function () {
    map.getCanvas().style.cursor = "";
});

map.scrollZoom.setWheelZoomRate(1/100);

window.onload = function() {
  var a = document.getElementById("button-prg-dl");
  var b = document.getElementById("button-buildings-dl");

  a.onclick = function() {
    var bounds = map.getBounds().toArray();
    var xmin = bounds[0][0];
    var xmax = bounds[1][0];
    var ymin = bounds[0][1];
    var ymax = bounds[1][1];
    var theUrl = "/prg/not_in/osm/?format=osm&filter_by=bbox&xmin="+xmin+"&ymin="+ymin+"&xmax="+xmax+"&ymax="+ymax
    console.log(theUrl);
    window.open(theUrl);
  }
  b.onclick = function() {
    var bounds = map.getBounds().toArray();
    var xmin = bounds[0][0];
    var xmax = bounds[1][0];
    var ymin = bounds[0][1];
    var ymax = bounds[1][1];
    var theUrl = "/lod1/not_in/osm/?format=osm&filter_by=bbox&xmin="+xmin+"&ymin="+ymin+"&xmax="+xmax+"&ymax="+ymax
    console.log(theUrl);
    window.open(theUrl);
  }
}

function getPopupText(element) {
    var s = "<table>"
    s += "<tr><td>lokalnyid:</td><td>" + element.features[0].properties.lokalnyid + "</td></tr>"
    s += "<tr><td>kod miejscowości:</td><td>" + element.features[0].properties.teryt_simc + "</td></tr>"
    s += "<tr><td>miejscowość:</td><td>" + element.features[0].properties.teryt_msc + "</td></tr>"
    if (element.features[0].properties.teryt_ulic) {
        s += "<tr><td>kod_ulic:</td><td>" + element.features[0].properties.teryt_ulic + "</td></tr>"
        s += "<tr><td>ulica:</td><td>" + element.features[0].properties.teryt_ulica + "</td></tr>"
    }
    s += "<tr><td>numer porządkowy:</td><td>" + element.features[0].properties.nr + "</td></tr>"
    if (element.features[0].properties.pna) {
        s += "<tr><td>kod pocztowy:</td><td>" + element.features[0].properties.pna + "</td></tr>"
    }
    return s += "</table>"
}
