"use strict";
//@ts-check 
// voit tutkia tarkemmin käsiteltäviä tietorakenteita konsolin kautta 
// tai json-editorin kautta osoitteessa http://jsoneditoronline.org/
// Jos käytät json-editoria niin avaa data osoitteesta:
// http://appro.mit.jyu.fi/tiea2120/vt/vt1/2020/data.json


// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 

//---------------------- TASO 1 --------------------------

console.log("- TASO 1 -");

// Funktio, joka vastaa joukkueiden tulostuksesta konsoliin.
function tulostaJoukkueet(data) {
    let tulostettavatJoukkueet = data.joukkueet;
    for (let i in tulostettavatJoukkueet) {
         console.log(tulostettavatJoukkueet[i].nimi);
    }
}

// Tällä funktiolla lisätään uusi joukkue haluttuun sarjaan.
function lisaaJoukkue(data, joukkue, sarja) {
    let kilpailunSarjat = data.sarjat;
    let sarjanId = -1;
    for (let i in kilpailunSarjat) {
        if (sarja == kilpailunSarjat[i].nimi) {
            sarjanId = kilpailunSarjat[i].id;
            break;
            //kilpailunSarjat.push(joukkue);
        }
    }
    if (sarjanId !== -1) {
        joukkue.sarja = sarjanId;
        data.joukkueet.push(joukkue);
    }

}

// Tarkistetaan, vastaako sarjan nimi ja sarjan id toisiaan.
function idMatches(data, sarjanNimi, sarjanId) {
    for (let sarjanIndex in data.sarjat) {
        if (sarjanNimi === data.sarjat[sarjanIndex].nimi && 
            sarjanId === data.sarjat[sarjanIndex].id) {
            return true;
        }
    }
    return false;
}

// Funktio, joka vastaa tietyn joukkueen poistamisesta (sarjan ja joukkueen nimen mukaan).
function poistaJoukkue(data, sarja, joukkue) {
    let index;
    for (let currentIndex in data.joukkueet) {
        if (joukkue === data.joukkueet[currentIndex].nimi && 
            idMatches(data, sarja, data.joukkueet[currentIndex].sarja)) {
            index = currentIndex;
            break;
            //kilpailunSarjat.push(joukkue);
        }
    }
    if (index) {
        data.joukkueet.splice(index, 1);
    }
}

// Yksinkertaisempi toteutus edelliseen nähden. Poistetaan pelkän nimen perusteella.
function yksinkertainenPoistaJoukkue(nimi) {
    let joukkueet = data.joukkueet;
    for (let i = 0; i < joukkueet.length; i++) {
        if(nimi === joukkueet[i].nimi) {
            joukkueet.splice(i, 1);
        }
    }
}


// Lisättävä joukkue valmiiksi annetuilla tiedoilla.
var malliJoukkue = {
    "nimi": "Mallijoukkue",
    "jasenet": [
      "Tommi Lahtonen",
      "Matti Meikäläinen"
    ],
    "id": 99999
};

// Kutsutaan edellisiä funktioita.
lisaaJoukkue(data, malliJoukkue, "8h");

// Järjestetään joukkueiden nimet aakkosjärjestyksen mukaan.
data.joukkueet.sort(function(a, b) {
    if (a.nimi > b.nimi) {
        return 1;
    }
    else if (a.nimi < b.nimi) {
        return -1;
    }
    return 0;
});

// Kutsutaan joukkueiden tulostus funktiota. 
tulostaJoukkueet(data);

// HalututRastit-niminen tyhjä taulukko, johon kerätään numerolla alkavat, haluttujen rastien koodit.
var halututRastit = [];

function numeroRastit() {
    let rastit = data.rastit;
    for (let i = 0; i < rastit.length; i++) {
        let rastinKoodi = rastit[i].koodi;
        if (parseInt(rastinKoodi)) {
            halututRastit[i] = rastinKoodi + "; ";
        }
    }
}

// Kutsutaan edellistä funktiota.
numeroRastit();
// Järjestetään halututRastit-taulukko.
halututRastit.sort();
// Tulostetaan konsoliin.
console.log(halututRastit);

console.log("- TASO 3 -");

// Poistetaan ohjeissa annetut kolme joukkuetta.
yksinkertainenPoistaJoukkue("Vara 1");
yksinkertainenPoistaJoukkue("Vara 2");
yksinkertainenPoistaJoukkue("Vapaat");

// Tulostetaan data.
//tulostaJoukkueet(data);

// Funktio luo tietorakenteen nimeltä joukkueetJaPisteet, johon jemmataan pisteet.
function haeRastinId(data) {
    var joukkueetJaPisteet = [];

    for (let i in data.joukkueet) {
        joukkueetJaPisteet.push({
            'nimi': data.joukkueet[i].nimi,
            'pisteet': 0
        });
    }
    var tulos = TaytaRastit(data, joukkueetJaPisteet);
    for (let i in tulos) {
        console.log(tulos[i].nimi + " (" + tulos[i].pisteet + " p)");
    }
}

// Tämä funktio laskee joukkueiden pisteet.
// Ensin käydään läpi kaikki datan rastit, sitten 
// käydään läpi kaikki joukkueet ja etsitään joukkueiden rasteista 
// läpikäytävä rasti. Mikäli se löytyy, tulkitaan tämän rastin pistemäärä,
// ja lisätään se joukkueetJaPisteet-tietorakenteeseen. 
function TaytaRastit(tulosData, joukkueetJaPisteet) {
    let joukkueet = tulosData.joukkueet;
    let rastiLista = tulosData.rastit;


    let alkuAika = new Date(data.alkuaika.toString());
    let loppuAika = new Date(data.loppuaika.toString());

    for (let i in rastiLista) {

        let rastinId = rastiLista[i].id.toString();
        let rastinKoodi = rastiLista[i].koodi;

        for (let j in joukkueet) {
            let joukkue = joukkueet[j];
            let joukkueenIndex = -1;

            for (let joukkueIndex in joukkueetJaPisteet) {
                if (joukkue.nimi === joukkueetJaPisteet[joukkueIndex].nimi) {
                    joukkueenIndex = joukkueIndex;
                    break;
                }
            }
            if (joukkueenIndex === -1 || !joukkue.rastit) {
                continue;
            }
            for (let k in joukkue.rastit) {
                let singleRasti = joukkue.rastit[k].rasti; 
                let rastinAika = new Date(joukkue.rastit[k].aika.toString());

                if (singleRasti === rastinId && rastinAika.getTime() >= alkuAika.getTime() &&
                    rastinAika.getTime() <= loppuAika.getTime()) {
                    let eka = rastinKoodi.charAt(0);
                    let parsittu = parseInt(eka);

                    if (Number.isInteger(parsittu)) {
                        joukkueetJaPisteet[joukkueenIndex].pisteet += parsittu;
                    }
                    break;
                }
               
            }    
        }
    }

    joukkueetJaPisteet.sort((a, b) => b.pisteet - a.pisteet);
    return joukkueetJaPisteet;

}

haeRastinId(data);

/*function joukkueenRastit(data) {
    let joukkueet = data.joukkueet;
    //let summa = 0;
    for (let i = 0; i < joukkueet.length; i++) {
        let rastit = joukkueet[i].rastit;
        if (!rastit) {
            continue;
        }
        for (let j = 0; j < rastit.length; j++) {
            return rastit[j]; 
            //console.log(joukkueet[i].nimi + " " + rastit[j].rasti);
        }

    }
}
*/

//joukkueenRastit(data);
// poistaJoukkue(data, sarja, "Vara 2");
// poistaJoukkue(data, sarja, "Vapaat");

// omia kokeiluja...
/*function nameSort(propName) {
    return function(a,b) {
        if (a[propName] > b[propName])
        {
            return 1;
        } 
        else if (a[propName] < b[propName]) 
        {
            return -1;
        }
        return 0;
    };
}*/

//data.joukkueet.sort(nameSort("nimi"));


