function getMoss() {

    fetch('bryoatt2.json')
        .then((resp) => resp.json())
        .then(function (myJson) {
            moss = myJson;
            mossFilter();

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

    page = 0;
    pages = mossList.length;
    document.getElementById("mossNumber").innerHTML = pages;
    displayPage(0);

}

function displayPage(i) {
    document.getElementById("phrase").innerHTML ="";
    document.getElementById("wiki").innerHTML = "";
    document.getElementById("gallery").innerHTML = "";
    document.getElementById("page").innerHTML = page + 1;
    document.getElementById("pagetotal").innerHTML = pages;
    var title = mossList[i].Name_new;
    displayFacts(i);
    // getWiki(title);
    getImages(title);
    mossNames(title);
}


function displayFacts(i) {
    let title = mossList[i].Name_new;
    let leng = mossList[i].Len;
    let gem = mossList[i].Gem;
    let light = mossList[i].L;
    let form = mossList[i].LF1;
    let ph = mossList[i].R;
    let wet = mossList[i].F;
    let count = mossList[i].GBno;

    addWord("a");
    document.getElementById("title").innerHTML = title;
    document.getElementById("count").innerHTML = count + countness(count); 
    document.getElementById("leng").innerHTML = leng+sizeness(leng);
    document.getElementById("light").innerHTML = light+lightness(light);
    document.getElementById("form").innerHTML = form+formness(form);
    document.getElementById("ph").innerHTML = ph+phness(ph);
    document.getElementById("wet").innerHTML = wet+wetness(wet);
    addWord("moss");
    document.getElementById("gem").innerHTML = gem+gemmaeness(gem);
    cleanPhrase();
}

function addWord(word) {
    document.getElementById("phrase").innerHTML+= word + ", "; 
}

function cleanPhrase() {
    let phrase = document.getElementById("phrase").innerHTML;   
    let newphrase = phrase.replace(',','').slice(0, -2); 
    let newphrase2 = newphrase.replace(', moss,',' moss');   
    let newphrase3 = newphrase2.replace(', moss',' moss');   
    document.getElementById("phrase").innerHTML = newphrase3;

}


function getWiki(title) {

    let wiki = underscore(title);

    var apiEndpoint = "https://en.wikipedia.org/w/api.php";
    var params = "action=parse&format=json&page=" + wiki;
    var wikiurl = apiEndpoint + "?" + params + "&origin=*";
    fetch(wikiurl)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            wikidata = response;
            wikitext = wikidata.parse.text["*"];
            var regex = /src="/gm;
            var str = wikitext;
            var subst = `src="https:`;
            var result = str.replace(regex, subst);

            var regex2 = /href="\/wiki/gm;
            var str2 = result;
            var subst2 = `target="_blank" href="https://en.wikipedia.org/wiki`;
            var result2 = str2.replace(regex2, subst2);

            document.getElementById("wiki").innerHTML = result2;
        })

        .catch(function (error) {
            console.log(error);
        });

}

function underscore(title) {
    var regex = / /gm;
    var str = title;
    var subst = `_`;
    return str.replace(regex, subst);
}


function getImages(title) {
    let wiki = underscore(title);
    var wikiurl = 'https://commons.wikimedia.org/w/api.php?action=query&generator=images&prop=imageinfo&gimlimit=12&iiurlwidth=1000&redirects=1&iiprop=url&format=json&titles=' + wiki + '&origin=*';
    fetch(wikiurl)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            images = response;
            imageArray = findAllByKey(images, 'url');
            document.getElementById("hero").style.backgroundImage= "url("+imageArray[5]+")";
            console.log(imageArray[0]);
            gallery(imageArray);
        })

        .catch(function (error) {
            console.log(error);
        });
}

function findAllByKey(obj, keyToFind) {
    return Object.entries(obj)
        .reduce((acc, [key, value]) => (key === keyToFind)
            ? acc.concat(value)
            : (typeof value === 'object')
                ? acc.concat(findAllByKey(value, keyToFind))
                : acc
            , [])
}

function gallery(array) {
    for (i = 0; i < array.length; i++) {
        var imagenode = document.createElement("IMG");
        imagenode.setAttribute("onclick", "openImage(" + i + ")");
        imagenode.className = "galleryimage";
        imagenode.id = "galleryimage" + i;
        document.getElementById('gallery').appendChild(imagenode).setAttribute('src', array[i]);
    }

}

function openImage(id) {
    var imageModal = document.getElementById("imageModal");
    var modalImg = document.getElementById("modalImage");

    imageModal.style.display = "block";
    oldsrc = document.getElementById("galleryimage" + id).src;
    modalImg.src = oldsrc;
    modalImg.dataset.number = id;
    var span = document.getElementsByClassName("imageModalclose")[0];

    span.onclick = function () {
        imageModal.style.display = "none";
    }
}

function nextImage() {
    var imageNumber = document.getElementById("modalImage");
    var next = parseInt(imageNumber.dataset.number) + 1;
    if (next > 11) { next = 0; }
    openImage(next);
}

function prevImage() {
    var imageNumber = document.getElementById("modalImage");
    var prev = parseInt(imageNumber.dataset.number) - 1;
    if (prev < 0) { prev = 11; }
    openImage(prev);
}

function sizeness(x) {
    x = parseInt(x*1);

    if (x < 5) { word = "tiny"; addWord('tiny'); } else
        if (x < 10) { word = "small"; } else
            if (x < 50) { word = "medium-sized"; } else
                if (x < 100) { word = "large"; } else { word = "very large"; addWord('rambling'); }
    return word;
}

function countness(x) { 
    x = parseInt(x*1);
    if (x < 5) { word = "very rare"; addWord('rare'); } else
        if (x < 10) { word = "rare"; } else
            if (x < 50) { word = "uncommon"; } else
                if (x < 200) { word = "common"; } else { word = "very common"; addWord('very common'); }
    return word;
}

function wetness(x) {
    x = parseInt(x*1);

    if (x < 3) { word = "arid";addWord('very dry') } else
        if (x < 5) { word = "dry"; } else
            if (x < 8) { word = "wet"; } else { word = "sodden"; addWord('very wet')}
    return word;
}

function phness(x) {
    x = parseInt(x*1);
    if (x < 3) { word = "very acidic"; addWord('acid-loving'); } else
        if (x < 7) { word = "acidic"; } else 
        if (x < 9) { word = "alkaline"; } else 
        { word = "very alkaline"; addWord('alkaline-loving'); }
    return word;
}

function lightness(x) {
    x = parseInt(x*1);
    if (x < 1) { word = "total darkness"; addWord('grows in total darkness'); } else
        if (x < 3) { word = "dark"; } else
            if (x < 5) { word = "shade"; } else
                if (x < 8) { word = "semi-sunshine"; } else { word = "direct sunlight"; addWord('sun-loving'); }
    return word;
}

function gemmaeness(x) {
    if (x === "F") { word = "frequent"; addWord('with gemmae often found on its leaves'); } else
        if (x === "O") { word = "occasional"; } else 
        if (x === "R") { word = "occasional"; } else { word = ""; }
    return word;
}

function formness(x) {

}

function mossNames(latin) {
    fetch('names.json')
    .then((resp) => resp.json())
    .then(function (myJson) {
        common = myJson;
       commonname =  common.find(x => x.latin === latin).english;
       document.getElementById("common").innerHTML = commonname;      
})

.catch(function (error) {
    console.log(error);
});
}