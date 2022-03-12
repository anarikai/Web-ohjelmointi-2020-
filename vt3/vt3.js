"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check 

console.log(data);
// tehdään lista, jonne silmukalla lisätään joukkueet
function joukkueetListaan() {
    var body = document.getElementsByTagName("body")[0];
    var list = document.getElementById("joukkueListaus");
    if (!list) {
        list = document.createElement("ul");
        list.setAttribute("id", "joukkueListaus");    
        body.appendChild(list);
    }

    let joukkueet = data.joukkueet;
    for (let i = 0; i < joukkueet.length; i++) {
        
        var li = document.createElement("li");
        li.textContent = joukkueet[i].nimi;
        var ul = document.createElement("ul");
        
        for (let j = 0; j < joukkueet[i].jasenet.length; j++) {
            var innerLi = document.createElement("li");
            innerLi.textContent = joukkueet[i].jasenet[j];

            ul.appendChild(innerLi);
        
        }
        
        li.appendChild(ul);
        list.appendChild(li);
    }
    
}

window.onload = function() {

    // Järjestetään joukkueiden nimet aakkosjärjestyksen mukaan.
    function jarjestaJoukkueet() {
        data.joukkueet.sort(function(a, b) {
            return (a.nimi > b.nimi) ? 1 : -1;
        });
        }

jarjestaJoukkueet();

joukkueetListaan();

function tarkistaJasenmaara() {
    var kaikkiNimet = [];
    var nimet = document.querySelectorAll("input[name='jasen']");
    for (let i = 0; i < nimet.length; i++) {
        if (nimet[i].value.trim() != "") {
            kaikkiNimet.push(nimet[i].value);
        }
        if (kaikkiNimet.length < 2) {
            let jasenet = document.querySelector("input[name='jasen']");
            jasenet.setCustomValidity("Kirjoita ainakin kahden jäsenen nimet!");
            return false;
        }
        else 
        {
            return true;
        }
 }
    
}

tarkistaJasenmaara();

var form = document.querySelector("form");
form.onsubmit = this.lisaaJoukkue.bind(form);
};



function tarkistaJasenmaara() {
    var kaikkiNimet = [];
    var nimet = document.querySelectorAll("input[name='jasen']");
    for (let i = 0; i < nimet.length; i++) {
        if (nimet[i].value.trim() != "") {
            kaikkiNimet.push(nimet[i].value);
        }
        if (kaikkiNimet.length < 2) {
            let jasenet = document.querySelector("input[name='jasen']");
            jasenet.setCustomValidity("Kirjoita ainakin kahden jäsenen nimet!");
            return false;
        }
        else 
        {
            return true;
        }
 }
    
}

tarkistaJasenmaara();

function haeJasenet() {
    let jasenet = [];
    var kaikkiJasenet = document.querySelectorAll("[id^='jasen']");
    for (let i = 0; i < kaikkiJasenet.length - 1; i++) {
        let jasen = kaikkiJasenet[i].value;
        jasenet.push(jasen);
    }
    return jasenet;
}

function teeId() {
    let joukkueet = data.joukkueet;
    let suurin = 0;
    for (let i = 0; i < joukkueet.length; i++) {
        let joukkueId = joukkueet[i].id;
        for (let j = 1; j < joukkueet.length; j++) {
            let seuraavaId = joukkueet[j].id;
            if (joukkueId < seuraavaId) {
                suurin = seuraavaId;
            }
            if (joukkueId > seuraavaId) {
                suurin = joukkueId;
            }
            if (joukkueId === seuraavaId) {
                suurin = joukkueId;
            }
        }
    }

    let uusiJoukkueId = suurin + 1;
    return uusiJoukkueId;
}

function haeSarja() {
    let valittu = "2h";
    if(document.getElementById("2h").checked) {
        valittu = document.getElementById("2h").value;
    }
    if(document.getElementById("4h").checked) {
        valittu = document.getElementById("4h").value;
    }
    if(document.getElementById("8h").checked) {
        valittu = document.getElementById("8h").value;
    }

    return valittu;
}



// Funktio leimaustavan katsomiseen
function leimaus() {
    let leimaustavat = [];
    let leimausGps = document.getElementById("gps");
    let leimausNfc = document.getElementById("nfc");
    let leimausQr = document.getElementById("qr");
    let leimausLomake = document.getElementById("lomake");

    if(leimausGps.checked == true) {
        leimaustavat.push(leimausGps.value);
    }
    if(leimausNfc.checked == true) {
        leimaustavat.push(leimausNfc.value);
    }
    if(leimausQr.checked == true) {
        leimaustavat.push(leimausQr.value);
    }
    if(leimausLomake.checked == true) {
        leimaustavat.push(leimausLomake.value);
    }

return leimaustavat;

}

// Viikkotehtävä 1:n valmis funktio
function log() {
    let pre = document.getElementById("log");
 
    for (let arg of arguments) {
             pre.textContent += arg + " ";
    }
    pre.textContent += "\n";
 }
 
 
 // http://appro.mit.jyu.fi/tiea2120/luennot/forms/dynaaminen.html (muokattu!)
window.addEventListener("load", function() {
    let jasenet = document.getElementById("jasen2");
    jasenet.addEventListener("input", addNew);
    function addNew(e) {
        var inputit = document.querySelectorAll("[id^='jasen']");
        let viimeinen_tyhja = -1; // viimeisen tyhjän kentän paikka listassa
        
        for (let i = inputit.length-1 ; i>-1; i--) { // inputit näkyy ulommasta funktiosta
            let jasen = inputit[i];

            if ( viimeinen_tyhja > -1 && jasen.value.trim() == "") { 
                let poistettava = inputit[viimeinen_tyhja].parentNode;
                document.getElementById("lisaajasen").removeChild( poistettava );
                viimeinen_tyhja = i;
            }
            if ( viimeinen_tyhja == -1 && jasen.value.trim() == "") {
                    viimeinen_tyhja = i;
            }
        }
        if ( viimeinen_tyhja == -1) {
            let label = document.createElement("label");
            label.textContent = "Jäsen " + (inputit.length +1).toString() + " ";
            let input = document.createElement("input");
            input.setAttribute("type", "text");   
            input.setAttribute("id", "jasen");
            input.addEventListener("input", addNew);
            document.getElementById("lisaajasen").appendChild(label).appendChild(input);
        }
    }


});

// Järjestetään joukkueiden nimet aakkosjärjestyksen mukaan.
function jarjestaJoukkueet() {
    data.joukkueet.sort(function(a, b) {
        return (a.nimi.toUpperCase() > b.nimi.toUpperCase()) ? 1 : -1;
    });
    }

    
function haeNimi() {
    let joukkueet = data.joukkueet;
    let jNimi = document.getElementById("nimi").value;
    for (let i = 0; i < joukkueet.length; i++) {
        if (jNimi.toUpperCase() === joukkueet[i].nimi.toUpperCase()) {
            console.log("Tämä nimi on jo varattu. Valitse toinen nimi!");
            return false;
        }
        else if (jNimi.length < 2 || jNimi === "") {
            console.log("Joukkueen nimen tulee olla vähintään 2 merkkiä pitkä!");
            return false;
        }

    }

    return jNimi;
    
}



function lisaaJoukkue(event) {
    event.preventDefault();

    var uusiJoukkue = {
        "nimi": haeNimi(),
        "jasenet": haeJasenet(),
        "id": teeId(),
        "sarja": haeSarja(),
        "leimaustapa": leimaus()
    };
    if (!uusiJoukkue.nimi) {
        return;
    }
    console.log(uusiJoukkue);
    let joukkue = uusiJoukkue;

    data.joukkueet.push(joukkue);
    let jlista = document.getElementById("joukkueListaus");
    while (jlista.firstChild) {
        jlista.removeChild(jlista.lastChild);
    }
    jarjestaJoukkueet();
    joukkueetListaan();
    log("Joukkue " + uusiJoukkue.nimi + " on lisätty!");

    

    //data.joukkueet.push(nimi);
}








