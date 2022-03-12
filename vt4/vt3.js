"use strict";
//@ts-check 

window.onload = function () {
    jaaPollo();
};

function teeCanvas(image, x, y, width, height) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    return canvas;
}

function jaaPollo() {
    const kokoKuva = [];
    let img = document.getElementById("pollo");
    let div = document.getElementById("owl");
    let pollo1 = teeCanvas(img, img.width/2, 0, img.width/2, img.height/2);
    let pollo2 = teeCanvas(img, img.width/2, img.height/2, img.width/2, img.height/2);
    let pollo3 = teeCanvas(img, 0, img.height/2, img.width/2, img.height/2);
    let pollo4 = teeCanvas(img, 0, 0, img.width/2, img.height/2);

    div.appendChild(img);


    pollo1.setAttribute("id", "pollo1");

    pollo1.aloitus = {
        "top": "0%",
        "left": "calc(100% - " + img.width/2 + "px)"
    };
    pollo1.lopetus = {
        "top": "calc(50% - " + img.height/2 + "px)",
        "left": "50%"
    };


    pollo2.setAttribute("id", "pollo2");

    pollo2.aloitus = {
        "top": "calc(100% - " + img.height/2 + "px)",
        "left": "calc(100% - " + img.width/2 + "px)"
    };
    pollo2.lopetus = {
        "top": "50%",
        "left": "50%"
    };
    pollo3.setAttribute("id", "pollo3");

    pollo3.aloitus = {
        "top": "calc(100% - " + img.height/2 + "px)",
        "left": "0%"
    };
    pollo3.lopetus = {
        "top": "50%",
        "left": "calc(50% - " + img.width/2 + "px)"
    };


    pollo4.setAttribute("id", "pollo4");

    pollo4.aloitus = {
        "top": "0%",
        "left": "0%"
    };
    pollo4.lopetus = {
        "top": "calc(50% - " + img.height/2 + "px)",
        "left": "calc(50% - " + img.width/2 + "px)"
    };

    kokoKuva.push(pollo1);
    kokoKuva.push(pollo2);
    kokoKuva.push(pollo3);
    kokoKuva.push(pollo4);
    for(let i of kokoKuva) {
        animaatio(i);
        div.appendChild(i);
    }
    img.remove();
}

function animaatio(kuva) {
    let keyframes = findKeyframesRule(kuva.id);
    for (let i of keyframes.cssRules) {
        if (i.keyText === "0%") {
            i.style.cssText = "top: " + kuva.aloitus.top + "; left: " + kuva.aloitus.left + ";";
        }
        if (i.keyText === "50%") {
            i.style.cssText = "top: " + kuva.lopetus.top + "; left: " + kuva.lopetus.left + ";";
        }
        if (i.keyText === "100%") {
            i.style.cssText = "top: " + kuva.aloitus.top + "; left: " + kuva.aloitus.left + ";";
        }
    }
}

// Otettu pääteohjauksessa olleesta esimerkistä: 
// http://appro.mit.jyu.fi/tiea2120/ohjaus/ohjaus4/
function findKeyframesRule(rule) {
    var ss = document.styleSheets;
    for (var i = 0; i < ss.length; ++i) {
      for (var j = 0; j < ss[i].cssRules.length; ++j) {
        if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE && 
        ss[i].cssRules[j].name == rule) { 
          return ss[i].cssRules[j]; }
      }
    }
    return null;
}

function teePalkit(vari) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    svg.appendChild(rect);

    let defs = vari;
    svg.appendChild(defs);
    svg.setAttribute("class", "palkki");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "10%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("fill", 'url(#sininenVari)');

    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    return svg;
}

function maalaaPalkit() {
    let blueLinearGradient = document.createElementNS("http://www.w3.org/2000/svg", "lineargradient");
    let greenLinearGradient = document.createElementNS("http://www.w3.org/2000/svg", "lineargradient");

    // Store an array of stop information for the <linearGradient>
    var stops = [
        {
            "color": "#000000",
            "offset": "0%"
        },{
            "color": "#00CED1",
            "offset": "50%"
        },{
            "color": "#000000",
            "offset": "100%"
        }
    ];
}
