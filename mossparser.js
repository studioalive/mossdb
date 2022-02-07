function getMoss() {

    fetch('bryoatt1.json')
        .then((resp) => resp.json())
        .then(function (myJson) {
            moss = myJson;
            console.log(moss);          

        })

        .catch(function (error) {
            console.log(error);
        });
}

function mossFilter() {

    var habitat = document.getElementById("HABITAT").value;
    var ord = document.getElementById("ORDER").value;
    var leng = document.getElementById("LENG").value;
    var form = document.getElementById("FORM").value;
    var light = document.getElementById("LIGHT").value;
    var ph = document.getElementById("PH").value;
    var wet = document.getElementById("WET").value;
    var gem = document.getElementById("GEM").value;

    mossList = moss.filter((x) => { 
        return (!ord || x.Ord === ord) && 
        (!habitat || x[habitat] > 2) && 
        (!leng || x.Len === leng) &&
        (!gem || x.Gem === gem) &&
       (!light || x.L === parseInt(light)) &&
        (!form || x.LF1 === form) &&
        (!ph || x.R === parseInt(ph));
      });

    document.getElementById("mossNumber").innerHTML=mossList.length;
}

