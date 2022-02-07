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
        (!ph || x.R === parseInt(ph)) &&
        (!wet || x.F === parseInt(wet));
      });

    document.getElementById("mossNumber").innerHTML=mossList.length;
    var title = mossList[0].Name_new;
    console.log(title);
    getWiki(title,0);
}

// function mossMaker(i) {
// https://commons.wikimedia.org/w/api.php?action=query&generator=images&prop=imageinfo&gimlimit=8&redirects=1t&iiprop=url&format=json&titles=
// }

function getWiki(title, i) {

                var regex = / /gm;
                var str = title;
                var subst = `_`;
                var wiki = str.replace(regex, subst);

    var apiEndpoint = "https://en.wikipedia.org/w/api.php";
    var params = "action=parse&format=json&page=" + wiki;

    fetch(apiEndpoint + "?" + params + "&origin=*")
        .then(function (response) { return response.json(); })
        .then(function (response) {
            wikidata = response;
            wikitext = wikidata.parse.text["*"];
            console.log(wikitext);
            var regex = /src="/gm;
            var str = wikitext;
            var subst = `src="https:`;
            var result = str.replace(regex, subst);

            var regex2 = /href="\/wiki/gm;
            var str2 = result;
            var subst2 = `target="_blank" href="https://en.wikipedia.org/wiki`;
            var result2 = str2.replace(regex2, subst2);

            var nodeP = document.createElement("DIV");
            nodeP.id = "posttext" + i;
            document.getElementById(i).appendChild(nodeP).innerHTML = result2;
        });

}
