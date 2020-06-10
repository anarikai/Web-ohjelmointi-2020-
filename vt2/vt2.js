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

// Tässä tehdään taulukko nimeltä Tulokset,
// jossa on mukana kolumnit sarja ja joukkue.
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

 // Kutsutaan edellistä funktiota parametrina
 // oikein järjestetty data.
 tee_taulukko(sortedData);


 // Funktio lisää uuden rastin data-rakenteeseen
 // ja määrää uudelle rastille id:n seuraavalla tavalla:
 // käy läpi jo olemassa olevien rastien id:t,
 // etsi niistä suurin.
 // Uuden rastin id:ksi tulee suurin id + 1.
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
        if (rasti.lon === undefined) {
            rasti.lon = "";
        }
        if (rasti.koodi === undefined) {
            rasti.koodi = "";
        }
        if (rasti.lat === undefined) {
            rasti.lat = "";
        }
        if (rasti.id === undefined) {
            rasti.id = "";
        }
    }
    rasti.id = suurin + 1;
    rastit.push(rasti);

    console.log("- Alta näet kaikkien rastien koodit ja koordinaatit -");

    for (let i = 0; i < rastit.length; i++) {
        
        console.log("Koodi: " + rastit[i].koodi);
        console.log("Koordinaatit " + rastit[i].lon + " " + rastit[i].lat);
    }

    /*var malliRasti = {
      "lon": "25.542413",
      "koodi": "6Y",
      "lat": "62.120776",
      "id": 0
    };*/
}

//lisaaRasti(data, malliRasti);

// Tämä hirviöfunktio luo rastilomakkeen ja
// tekee eventlistnerin buttonille.
// Lopussa kutsutaan lisaaRasti-funktiota 
function rastiForm(data) {
    
    var form = document.getElementsByTagName("form")[0];
    var fieldset = document.createElement("fieldset");

    form.appendChild(fieldset);

    var legend = document.createElement("legend");
    legend.textContent = "Rastin tiedot";

    fieldset.appendChild(legend);
    
    var latP = document.createElement("p");
    var latLabel = document.createElement("label");
    latLabel.textContent = "Lat ";

    var latInput = document.createElement("input");
    latInput.id = "latValue";
    latInput.setAttribute("type", "text");
    latInput.setAttribute("value", "");

    fieldset.appendChild(latP);
    latP.appendChild(latLabel);
    latLabel.appendChild(latInput);

    var lonP = document.createElement("p");
    var lonLabel = document.createElement("label");
    lonLabel.textContent = "Lon ";

    var lonInput = document.createElement("input");
    lonInput.id = "lonValue";
    lonInput.setAttribute("type", "text");
    lonInput.setAttribute("value", "");

    fieldset.appendChild(lonP);
    lonP.appendChild(lonLabel);
    lonLabel.appendChild(lonInput);

    var kP = document.createElement("p");
    var kLabel = document.createElement("label");
    kLabel.textContent = "Koodi ";

    var kInput = document.createElement("input");
    kInput.id = "koodiValue";
    kInput.setAttribute("type", "text");
    kInput.setAttribute("value", "");

    fieldset.appendChild(kP);
    kP.appendChild(kLabel);
    kLabel.appendChild(kInput);

    var buttonP = document.createElement("p");
    var button = document.createElement("button");
    button.textContent = "Lisää rasti";
    button.setAttribute("name", "rasti");
    button.setAttribute("id", "rasti");

    fieldset.appendChild(buttonP);
    buttonP.appendChild(button);

    let painike = document.querySelector("button");
    painike.addEventListener("click", function (e) {
        e.preventDefault();
        latInput.setAttribute("value", latInput.value);
        lonInput.setAttribute("value", lonInput.value);
        kInput.setAttribute("value", kInput.value);
        if (latInput.getAttribute("value") === "" || lonInput.getAttribute("value") === "" || kInput.getAttribute("value") === "") {
            console.log("Täytä lisättävä rasti!");
        }
        else {
            var uusiRasti = {
                "lat": latInput.value,
                "lon": lonInput.value,
                "koodi": kInput.value
            };

            lisaaRasti(data, uusiRasti);
        }

    });

}

rastiForm(data);


};
