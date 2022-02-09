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
    // document.getElementById("phrase").innerHTML ="";
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
    let type = mossList[i].ML;

    let hablist = [];

    let soil = mossList[i].SO;
    let rock = mossList[i].SR;
    let rockhard = mossList[i].RH;
    let rocksoft = mossList[i].RS;
    let rockworked = mossList[i].RW;
    let trees = mossList[i].EW;
    let plants = mossList[i].EN;
    let gravelsand = mossList[i].GS;
    let peat = mossList[i].PT;
    let hollowwood = mossList[i].DW;
    let rottingv = mossList[i].DV;
    let rottinga = mossList[i].DA;
    let bryo = mossList[i].BR;
    let floating = mossList[i].AQ;

    if (soil > 2) { hablist.push('soil'); }
    if (rock > 2) { hablist.push('rock'); }
    if (rockhard > 2) { hablist.push('hard rock'); }
    if (rocksoft > 2) { hablist.push('soft rock'); }
    if (rockworked > 2) { hablist.push('rocks in quarries'); }
    if (trees > 2) { hablist.push('trees'); }
    if (plants > 2) { hablist.push('plants'); }
    if (gravelsand > 2) { hablist.push('sand and gravel'); }
    if (peat > 2) { hablist.push('peat'); }
    if (hollowwood > 2) { hablist.push('hollow wood'); }
    if (rottingv > 2) { hablist.push('rotting vegetation'); }
    if (rottinga > 2) { hablist.push('rotting animals'); }
    if (bryo > 2) { hablist.push('other bryophytes'); }
    if (floating > 2) { hablist.push('water'); }

    // habitatArray['soil'] = soil;
    // habitatArray['rock'] = rock;
    // habitatArray['rockhard'] = rockhard;
    // habitatArray['rocksoft'] = rocksoft;
    // habitatArray['rockworked'] = rockworked;
    // habitatArray['trees'] = trees;
    // habitatArray['plants'] = plants;
    // habitatArray['gravelsand'] = gravelsand;
    // habitatArray['peat'] = peat;
    // habitatArray['hollowwood'] = hollowwood;
    // habitatArray['rottingv'] = rottingv;
    // habitatArray['rottinga'] = rottinga;
    // habitatArray['bryo'] = bryo;
    // habitatArray['floating'] = floating;

    // console.log(habitatArray);

    // habitatArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));




    document.getElementById("title").innerHTML = title;
    document.getElementById("count").innerHTML = countness(count);
    document.getElementById("leng").innerHTML = sizeness(leng);
    document.getElementById("light").innerHTML = lightness(light);
    document.getElementById("form").innerHTML = formness(form);
    document.getElementById("ph").innerHTML = phness(ph);
    document.getElementById("wet").innerHTML = wetness(wet);
    document.getElementById("type").innerHTML = typeness(type);
    document.getElementById("habitat").innerHTML = oxford(hablist);
    document.getElementById("gem").innerHTML = gemmaeness(gem);
    // cleanPhrase();
}

// function addWord(word) {
//     document.getElementById("phrase").innerHTML+= word + ", "; 
// }



function cleanPhrase() {
    let phrase = document.getElementById("phrase").innerHTML;
    let newphrase = phrase.replace(',', '').slice(0, -2);
    let newphrase2 = newphrase.replace(', moss,', ' moss');
    let newphrase3 = newphrase2.replace(', moss', ' moss');
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
            document.getElementById("hero").style.backgroundImage = "url(" + imageArray[5] + ")";
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
    x = parseInt(x * 1);

    if (x < 5) { word = "tiny"; } else
        if (x < 10) { word = "small"; } else
            if (x < 50) { word = "medium-sized"; } else
                if (x < 100) { word = "large"; } else { word = "very large"; }
    return word;
}

function countness(x) {
    x = parseInt(x * 1);
    if (x < 5) { word = "very rare"; } else
        if (x < 10) { word = "rare"; } else
            if (x < 50) { word = "uncommon"; } else
                if (x < 200) { word = "common"; } else { word = "very common"; }
    return word;
}

function wetness(x) {
    x = parseInt(x * 1);

    if (x < 3) { word = "arid"; } else
        if (x < 5) { word = "dry"; } else
            if (x < 8) { word = "wet"; } else { word = "sodden"; }
    return word;
}

function phness(x) {
    x = parseInt(x * 1);
    if (x < 3) { word = "very acidic"; } else
        if (x < 7) { word = "acidic"; } else
            if (x < 9) { word = "alkaline"; } else { word = "very alkaline"; }
    return word;
}

function lightness(x) {
    x = parseInt(x * 1);
    if (x < 1) { word = "total darkness"; } else
        if (x < 3) { word = "darkness"; } else
            if (x < 5) { word = "shade"; } else
                if (x < 8) { word = "semi-sunshine"; } else { word = "direct sunlight"; }
    return word;
}

function gemmaeness(x) {
    if (x === "F") { word = "Gemmae are frequently found on its leaves."; } else
        if (x === "O") { word = "Gemmae are occasionally found on its leaves."; } else
            if (x === "R") { word = "occasional"; } else { word = ""; }
    return word;
}

function formness(x) {
    switch (x) {
        case 'Ac':
            form = "floating colonies in water";
            break;
        case 'At':
            form = "trails in water";
            break;
        case 'Cu':
            form = "cushions";
            break;
        case 'De':
            form = "tree-like woody stems and branches";
            break;
        case 'Fa':
            form = "fans";
            break;
        case 'Le':
            form = "floating patches";
            break;
        case 'Mr':
            form = "rough mats";
            break;
        case 'Ms':
            form = "smooth mats";
            break;
        case 'Mt':
            form = "layered mats";
            break;
        case 'Sc':
            form = "creeping shoots";
            break;
        case 'St':
            form = "rosettes";
            break;
        case 'Tf':
            form = "dense turfs";
            break;
        case 'Thread':
            form = "threads";
            break;
        case 'Tp':
            form = "turfs with visible threads";
            break;
        case 'Ts':
            form = "scattered turfs";
            break;
        case 'Tuft':
            form = "loose tufts";
            break;
        case 'We':
            form = "intertwining wefts";
            break;
    }
    return form;
}


function oxford(array) {
    console.log(array);
    if (array.length > 1) {
    const last = array.pop();
    const result = array.join(', ') + ' and ' + last;
    return result;
    }
    else {result = array[0];return result;}
    
}

function typeness(x) {
    if (x === "M") { word = "moss"; } else
        if (x === "L") { word = "liverwort"; } else { word = "hornwort"; }
    return word;
}

function mossNames(latin) {
    fetch('names.json')
        .then((resp) => resp.json())
        .then(function (myJson) {
            common = myJson;
            commonname = common.find(x => x.latin === latin).english;
            document.getElementById("common").innerHTML = commonname;
        })

        .catch(function (error) {
            console.log(error);
        });
}