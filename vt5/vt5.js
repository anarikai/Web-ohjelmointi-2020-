"use strict";
// seuraavat estävät jshintin narinat jqueryn ja leafletin objekteista
/* jshint jquery: true */
/* globals L */

// Valmis funktio, joka generoi värit.
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    let c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

// Piirretään kartalle rastit.
function piirraRastit(rastit, mymap) {
    var lat;
    var lon;

    for(let i in rastit) {
        lat = rastit[i].lat;
        lon = rastit[i].lon;
        
        let circle = L.circle(
            [lat, lon], 
            {color: 'red', 
            fillColor: '#f03', 
            fillOpacity: 0.5, 
            radius: 150}).addTo(mymap);
    }
}

// Järjestetään joukkueiden nimet aakkosjärjestyksen mukaan.
data.joukkueet.sort(function(a, b) {
    if (a.nimi.toUpperCase() > b.nimi.toUpperCase()) {
        return 1;
    }
    else if (a.nimi.toUpperCase() < b.nimi.toUpperCase()) {
        return -1;
    }
    return 0;
});

function joukkueetListaan(vanhemmanNimi, teams) {
    var vanhempi = document.getElementById(vanhemmanNimi);
    for (let i in teams) {
        vanhempi.appendChild(document.createElement('div'));
        vanhempi.lastChild.appendChild(document.createTextNode(teams[i].nimi));
        vanhempi.lastChild.style.backgroundColor = rainbow(teams.length, i);
        vanhempi.lastChild.setAttribute('draggable','true');
        vanhempi.lastChild.setAttribute('id', teams[i].id);
        vanhempi.lastChild.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData("text/plain", e.target.id);
        });
    }
}

// Tehdään rastien koodeille globaali taulukko.
let koodit = [];

// Haetaan rastien koodit ja järjestetään käänteiseen aakkosjärjestykseen.
function haeRastit() {
    let rastit = data.rastit;
    for (let i = 0; i < rastit.length; i++) {
        let rastinKoodi = rastit[i].koodi;
        koodit.push(rastinKoodi);
    }
    koodit.sort();
    koodit.reverse();
}

haeRastit();

function rastitListaan(parent, koodit) {
    var parentElement = document.getElementById(parent);
    for (let i in koodit) {
        let li = parentElement.appendChild(document.createElement('div'));
        li.setAttribute("class", "rastinKoodi");
        parentElement.lastChild.appendChild(document.createTextNode(koodit[i]));
        parentElement.lastChild.style.backgroundColor = rainbow(koodit.length, i);
        parentElement.lastChild.setAttribute('draggable','true');
        parentElement.lastChild.setAttribute('id', koodit[i]);
        parentElement.lastChild.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData("text/plain", e.target.id);
        });
    }
}

// Haetaan maximi ja minimi koordinaatit.
function haeKoordinaatit (rastit) {
    var latMin = rastit[0].lat;
    var lonMin = rastit[0].lon;
    var latMax = rastit[0].lat;
    var lonMax = rastit[0].lon;

    for (let i in rastit) {
        if (rastit[i].lat < latMin) {
            latMin = rastit[i].lat;
        }
        if (rastit[i].lon < lonMin) {
            lonMin = rastit[i].lon;
        }
        if (rastit[i].lat > latMax) {
            latMax = rastit[i].lat;
        }
        if (rastit[i].lon > lonMax) {
            lonMax = rastit[i].lon;
        } 
    }

    return [latMin, latMax, lonMin, lonMax];

}

// Piirretään joukkueen reitti kartalle.
function reitti(joukkueId, map) {
    let joukkueet = data.joukkueet;
    for (let i in joukkueet) {
        if (parseInt(joukkueet[i].id) == parseInt(joukkueId)) {
            piirraViivat(joukkueet[i], rainbow(joukkueet.length, i), map);
        }
    }
}


let joukkueidenReitit = [];

// Piirretään niiden rastien välille viivat, joilla joukkue on käynyt.
function piirraViivat(joukkue, vari, map) {
    var koords = [];
    for (let i in joukkue.rastit) {
        for (let j in data.rastit) {
            if (parseInt(joukkue.rastit[i].rasti) == parseInt(data.rastit[j].id)) {
                koords.push([data.rastit[j].lat, data.rastit[j].lon]);
            }
        }
    }

    let polyLine = L.polyline(koords, {color: vari}).addTo(map);
    polyLine.bringToFront();
    joukkueidenReitit.push({
        id: joukkue.id,
        polyLine: polyLine
    });
}

// Poistetaan joukkueen reitti kartalta.
function poistaReitti(joukkueId, map) {
    var loydettyJoukkue = joukkueidenReitit.find(joukkue => {
        return joukkue.id.toString() === joukkueId.toString();
    });
    var polyLine = loydettyJoukkue.polyLine;
    map.removeLayer(polyLine);
    polyLine.remove(map);
    joukkueidenReitit = joukkueidenReitit.filter(el => el.id.toString() !== joukkueId.toString());
}


window.onload = function() {
    // Alustetaan karttaa varten sopiva elementti ja asetetaan sen leveydeksi ikkunan leveys ja korkeudeksi puolet ikkunan korkeudesta.
    let karttaDiv = $("#map");
	karttaDiv.css("width", Math.round(window.innerWidth) + "px");
    karttaDiv.css("height", Math.round(window.innerHeight / 2) + "px");

    var keskita = haeKoordinaatit(data.rastit);
    
    // Luodaan varsinainen kartta ja lisätään siihen maanmittauslaitoksen maastokartta.
    let mymap = new L.map('map', {
        crs: L.TileLayer.MML.get3067Proj()})
       .fitBounds([[keskita[0], keskita[2]], [keskita[1], keskita[3]]]);
    L.tileLayer.mml_wmts({ layer: "maastokartta" }).addTo(mymap);

    // Kutsutaan funktiota piirraRastit, joka piirtää rastit kartalle.
    piirraRastit(data.rastit, mymap);

    // Haetaan joukkueille div.
    let joukkueetDiv = $("#joukkueet");
    joukkueetDiv.append('<h2>Joukkueet</h2>');
    joukkueetDiv.append('<div id="joukkueetListaan">');
    joukkueetListaan('joukkueetListaan', data.joukkueet);
    joukkueetDiv.append('</div>');

    // Haetaan pudotusalueelle div.
    let kartallaDiv = $("#kartalla");
    kartallaDiv.append('<h2>Kartalla</h2>');
    kartallaDiv.append('<div id="dropJoukkueetjaRastit"></div>');

    let mapDiv = document.getElementById("dropJoukkueetjaRastit");
    mapDiv.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });
    mapDiv.addEventListener("drop", dropToMap(mymap));

    let joukkueDiv = document.getElementById("joukkueet");
    joukkueDiv.addEventListener("dragover", function(e) {
       e.preventDefault();
       e.dataTransfer.dropEffect = "move";
    });
    joukkueDiv.addEventListener("drop", palautaJoukkue(mymap));
   
    let rastitDiv = $("#rastit");
    rastitDiv.append('<h2>Rastit</h2>');
    rastitDiv.append('<div id="rastitListaan">');
    rastitListaan('rastitListaan', koodit);
    rastitDiv.append('</div>');

    let rastiDiv = document.getElementById("rastit");
    rastiDiv.addEventListener("dragover", function(e) {
        e.preventDefault();
        // Set the dropEffect to move
        e.dataTransfer.dropEffect = "move";   
    }); 
    rastiDiv.addEventListener("drop", palautaRasti());
};

function dropToMap(mymap) {
    return (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        var dropped = document.getElementById(data);
        $(dropped).addClass("pos-absolute");

        var x = event.offsetX;
        var y = event.offsetY;
        if (e.target.tagName === 'DIV') {
            $(dropped).addClass("pos-absolute");
            e.target.appendChild(dropped);
            dropped.style.left = x + 'px';
            dropped.style.top = y + 'px';
        }
        reitti(e.dataTransfer.getData("text"), mymap);
    };
}

function palautaRasti() {
    return (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        var dropped = document.getElementById(data);

        if (!dropped.classList.contains('rastinKoodi')) {
            return;
        }

        dropped.classList.remove("pos-absolute");
    
        if (e.target.id !== 'rastitListaan') {
            e.target.parentElement.appendChild(dropped);
            return;
        }
        e.target.appendChild(dropped);
    };
}

function palautaJoukkue(mymap) {
    return (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        var dropped = document.getElementById(data);
        if (dropped.classList.contains('rastinKoodi')) {
            return;
        }
        e.target.appendChild(dropped, e.target.parentElement.firstChild);
        
        dropped.classList.remove("pos-absolute");
        $(dropped).addClass("joukkueetListaan");
        dropped.setAttribute('draggable', 'true');
        poistaReitti(e.dataTransfer.getData("text"), mymap);
    };
}

