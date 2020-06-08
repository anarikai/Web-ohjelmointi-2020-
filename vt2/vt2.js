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

let joukkueData = taytaSarjanNimet(data);

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
    
}

tee_taulukko(data);

};
