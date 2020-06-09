"use strict";
window.onload = function () {


//@ts-check 
// data-muuttuja on sama kuin viikkotehtävässä 1.
//console.log(data);

// Funktio käy kilpailun sarjat läpi
// ja tarkistaa, onko sarjat[i] id sama kuin joukkueen
// sarja. Sen perusteella se hakee sarjan nimen. 
function haeSarjanNimi(data, sarjanId) {
    let sarjat = data.sarjat;
    for (let i = 0; i < sarjat.length; i++){
        if (sarjat[i].id === sarjanId) {
            return sarjat[i].nimi;
        }
    }
}

// Funktio kerää taulukkoon joukkueiden nimet
// sekä sarjat. Sarjojen nimet saadaan edellisestä funktiosta.
function taytaSarjanNimet(data) {
    let joukkueet = data.joukkueet;
    var sarjatJaJoukkueet = [];

    for (let i in joukkueet) {
        //console.log(joukkueet[i].nimi);
        let sarjanNimi = haeSarjanNimi(data, joukkueet[i].sarja);
        sarjatJaJoukkueet.push({"joukkue": joukkueet[i].nimi, "sarja": sarjanNimi});
    }

    // Järjestetään joukkueet ensisijaisesti sarjan mukaan
    // ja toissijaisesti joukkueen nimen mukaan.
    // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    sarjatJaJoukkueet.sort((a, b) => (a.sarja > b.sarja) ? 1 : (a.sarja === b.sarja) ? ((a.joukkue > b.joukkue) ? 1 : -1) : -1 );
    console.log(sarjatJaJoukkueet);
    return sarjatJaJoukkueet;
}

let sortedData = taytaSarjanNimet(data);

function tee_taulukko(data) {
    var body = document.getElementsByTagName("body")[0];
    var div = document.getElementById("tupa");
    body.appendChild(div);

    var table = document.createElement("table");
    div.appendChild(table);

    var caption = document.createElement("caption");
    caption.textContent = "Tulokset";
    table.appendChild(caption);
    

    var tr = document.createElement("tr");
    table.appendChild(tr);

    var otsikkoSarja = document.createElement("th");
    otsikkoSarja.textContent = "Sarja";
    var otsikkoJoukkue = document.createElement("th");
    otsikkoJoukkue.textContent = "Joukkue";

    tr.appendChild(otsikkoSarja);
    tr.appendChild(otsikkoJoukkue);

    for (let i = 0; i < data.length; i++) {
        var uusiTr = document.createElement("tr");
        var tdSarja = document.createElement("td");
        var tdJoukkue = document.createElement("td");

        var textSarja = document.createTextNode(data[i].sarja);
        var textJoukkue = document.createTextNode(data[i].joukkue);

        tdSarja.appendChild(textSarja);
        tdJoukkue.appendChild(textJoukkue);

        uusiTr.appendChild(tdSarja);
        uusiTr.appendChild(tdJoukkue);

        table.appendChild(uusiTr);
    }
 }
    
 tee_taulukko(sortedData);


function lisaaRasti(data, rasti) {
    let rastit = data.rastit;
    let suurin = 0;
    for (let i = 0; i < rastit.length; i++) {
        let rastinId = rastit[i].id;
        for (let j = 1; j < rastit.length; j++) {
            let seuraavanRastinId = rastit[j].id;
            if (rastinId < seuraavanRastinId) {
                suurin = seuraavanRastinId;
            }
            if (rastinId > seuraavanRastinId) {
                suurin = rastinId;
            }
            if (rastinId === seuraavanRastinId) {
                suurin = rastinId;
            }
        }
    }
    rasti.id = suurin + 1;
    rastit.push(rasti);
}

var malliRasti = {
    "lon": "25.542413",
    "koodi": "6Y",
    "lat": "62.120776",
    "id": 0
};

lisaaRasti(data, malliRasti);
console.log(data);

};
