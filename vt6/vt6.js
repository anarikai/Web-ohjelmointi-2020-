
"use strict";

// jäädytetään alkuperäinen data, jotta sitä ei voi vahingossakaan muuttaa
Object.freeze(data);
Object.freeze(data.joukkueet);
Object.freeze(data.sarjat);
Object.freeze(data.rastit);
Object.freeze(data.leimaustavat);

for( let joukkue of data.joukkueet ) {
  Object.freeze(joukkue.jasenet);
  Object.freeze(joukkue.leimaustapa);
  Object.freeze(joukkue.rastit);
  for(let rasti of joukkue.rastit) {
      Object.freeze( rasti );
  }
  Object.freeze(joukkue);
}

for( let sarja of data.sarjat ) {
  Object.freeze(sarja);
}

for( let rasti of data.rastit ) {
  Object.freeze(rasti);
}


// datarakenteen kopioiminen
function kopioi_kilpailu(data) {
        let kilpailu = new Object();
        kilpailu.nimi = data.nimi;
        kilpailu.loppuaika = data.loppuaika;
        kilpailu.alkuaika = data.alkuaika;
        kilpailu.kesto = data.kesto;
        kilpailu.leimaustavat = Array.from( data.leimaustavat );
        function kopioi_rastit(j) {
            	        let uusir = {};
            	        uusir.id = j.id;
            	        uusir.koodi = j.koodi;
            	        uusir.lat = j.lat;
            	        uusir.lon = j.lon;
            	        return uusir; 
        }
        kilpailu.rastit = Array.from( data.rastit, kopioi_rastit );
        function kopioi_sarjat(j) {
            	        let uusir = {};
            	        uusir.id = j.id;
            	        uusir.nimi = j.nimi;
            	        uusir.kesto = j.kesto;
            	        uusir.loppuaika = j.loppuaika;
            	        uusir.alkuaika = j.alkuaika;
            	        return uusir; 
        }
        kilpailu.sarjat = Array.from( data.sarjat, kopioi_sarjat );
        function kopioi_joukkue(j) {
                    let uusij = {};
                    uusij.nimi = j.nimi;
                    uusij.id = j.id;
                    uusij.sarja = j.sarja;

                    uusij["jasenet"] = Array.from( j["jasenet"] );
	            function kopioi_leimaukset(j) {
            	        let uusir = {};
            	        uusir.aika = j.aika;
            	        uusir.rasti = j.rasti;
            	        return uusir;
	            }
                    uusij["rastit"] = Array.from( j["rastit"], kopioi_leimaukset );
                    uusij["leimaustapa"] = Array.from( j["leimaustapa"] );
                    return uusij;
        }

        kilpailu.joukkueet = Array.from( data.joukkueet, kopioi_joukkue);

	return kilpailu;
}


class App extends React.PureComponent {

  constructor(props) {
    super(props);
      // Käytetään samaa dataa kuin viikkotehtävässä 1
      // Alustetaan tämän komponentin tilaksi data.
      // Tee tehtävässä vaaditut lisäykset ja muutokset tämän komponentin tilaan
      // päivitettäessä React-komponentin tilaa on aina vanha tila kopioitava uudeksi
      // kopioimista varten on annettu valmis mallifunktio
      // Objekteja ja taulukoita ei voida kopioida pelkällä sijoitusoperaattorilla
      // kts. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
      this.state = {"kilpailu": data};
      this.state.teams = Array.from(this.state.kilpailu.joukkueet); 
      this.state.leimaustavat = Array.from(this.state.kilpailu.leimaustavat);
      this.state.sarjat = Array.from(this.state.kilpailu.sarjat);
    }
  
  // Luodaan joukkue.
  createTeam = (teamState) => {
    const newTeam = {};
    newTeam.nimi = teamState.nimi;
    newTeam.sarja = teamState.sarja ? teamState.sarja : null;
    newTeam.jasenet = teamState.jasenet;
    newTeam.leimaustapa = teamState.leimaustavat ? teamState.leimaustavat : null;
    newTeam.id = this.uusiId(this.state.teams);
    this.setState(prevState => ({
        teams: [...prevState.teams, newTeam]
    }));
  };

  // Luodaan uudelle joukkueelle oma uniikki id.
  uusiId = (teams) => {
    let suurinId = teams[0].id;
    for (let i in teams) {
      if (suurinId < teams[i].id) {
        suurinId = teams[i].id;
      }
    }
    return (suurinId + 1);
  };

  render () {
      return <div>
	   <LisaaJoukkue tiiminluonti={this.createTeam} leimaustavat={this.state.leimaustavat} sarjat={this.state.sarjat} />
	   <ListaaJoukkueet teams={this.state.teams} />
        </div>;
    }
}



class LisaaJoukkue extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
          nimi: '',
          leimaustavat: [],
          sarja: '',
          jasenet: [],
          jasenInputs: {},
      };

      // Bindataan tapahtumakäsittelijät lomakkeen kentille.
      this.onNimiChange = this.onNimiChange.bind(this);
      this.onSarjaChange = this.onSarjaChange.bind(this);
      this.onLeimausChange = this.onLeimausChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.onJasenChange = this.onJasenChange.bind(this);
    }

    onNimiChange = (e) => {
      let nimi = e.target.value;
      if (nimi == '') {
        e.target.setCustomValidity("Syötä joukkueen nimi");
      } else {
        e.target.setCustomValidity("");
        this.setState(prevState => ({
          nimi: nimi
      }));
      }
   }

   onLeimausChange = (e) => {
     let leimaus = e.target.checked;
     let lisattyLeimaus = e.target.id;
     if (leimaus) {
       this.setState(prevState => ({
         leimaustavat: [...prevState.leimaustavat, lisattyLeimaus]
       }))
     } else {
       let taulukko = this.state.leimaustavat;
       taulukko = taulukko.filter(l => l !== lisattyLeimaus);
       this.setState(prevState => ({
         leimaustavat: taulukko
       }));

     }
   }

   onSarjaChange = (e) =>  {
      let sarja = e.target.id;
      this.setState(prevState => ({
        sarja: sarja
      }));  
    }

    onJasenChange = (e) => {
      let jasenTaulukko = [];
      let jasen = e.target.value;
      this.state.jasenInputs[e.target.id] = jasen;
      Object.keys(this.state.jasenInputs).forEach(key => {
        if (this.state.jasenInputs[key] !== '') {
          jasenTaulukko.push(this.state.jasenInputs[key]);
          return;        
        }
      });
      this.setState(prevState => ({
          jasenet: jasenTaulukko
      }));
       
    }

   handleSubmit = (e) => {
     e.preventDefault();
     this.props.tiiminluonti(this.state);
   }

    render () {
      const leimausItems = this.props.leimaustavat.map((leimaus, i) => {
        return <p key={i}><label> { leimaus } <input type="checkbox" id={leimaus} onChange={this.onLeimausChange} /></label></p>
      });

      const sarjaItems = this.props.sarjat.sort((a,b) => {
        if (a.nimi > b.nimi) {
          return 1;
 
        } else if (b.nimi > a.nimi) {
          return -1;
        }
        return 0;
      }).map((sarja, i) => {
        return <p key={i}><label>{ sarja.nimi } <input type="radio" id={sarja.nimi} name="sarjaRadio" onChange={this.onSarjaChange} required={true} /></label></p>
      });

      var jasenTaulukko = [];
      for (let i = 0; i <= 4; i++) {
        let item = <p key={i}><label>Jäsen {i+1} <input type="text" className="text-input" id={i} onBlur={this.onJasenChange} required={i < 2}/></label></p>;
        jasenTaulukko.push(item);
      }

      return (
        <div id="joukkue-form">
          <h2>Lisää joukkue</h2>
            <form onSubmit={this.handleSubmit}>
              <fieldset>
                <legend>Joukkueen tiedot</legend>
                <p>
                  <label>
                   Nimi <input id="nimi" className="text-input" type="text" required="required" onBlur={this.onNimiChange} required={true} />
                  </label>
                </p>
                <p>
                  <label> Leimaustapa </label>
                </p>
                <div className="leimaus-form"> { leimausItems } </div>
                <label> Sarja </label>
                <div className="leimaus-form"> { sarjaItems } </div>
              </fieldset>
              <fieldset>
                <legend>Jäsenet</legend>
                <div>
               { jasenTaulukko }
               </div>
              </fieldset>
              <button type="submit">Tallenna</button>
            </form>
        </div>
      )   
    }
}

class ListaaJoukkueet extends React.PureComponent {
    constructor(props) {
      super(props);
      return;
    }
    render () {
      // Joukkueiden aakkostus.
      const teams = this.props.teams.sort((a, b) => a.nimi.localeCompare(b.nimi, 'fi', {sensititivy: 'case'}));

      return (
        <div id="listaaJoukkueet">
          <h2>Joukkueet</h2>
             <ul>
               {teams.map((team, i) => {
                 return <li key={i}>{ team.nimi }</li>
                 })}
             </ul>
        </div>
      )
    }
}


ReactDOM.render(
    <App />,
  document.getElementById('root')

);
