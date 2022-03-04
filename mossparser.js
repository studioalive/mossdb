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
    var asex = document.getElementById("ASEX").value;




    mossList = moss.filter((x) => {

        let dataleng = parseInt(x.Len*1);  
        let proleng ="";
        if (dataleng < 5) { proleng = "1"; } else
            if (dataleng < 10) { proleng = "2"; } else
                if (dataleng < 50) { proleng = "3"; } else
                    if (dataleng < 100) { proleng = "4"; } else { proleng = "5"; }



        return (!ord || x.Ord === ord) &&
            (!habitat || x[habitat] > 2) &&
            (!leng || proleng === leng) &&
            (!light || x.L === parseInt(light)) &&
            (!form || x.LF1 === form) &&
            (!ph || x.R === parseInt(ph)) &&
            (!wet || x.F === parseInt(wet)) &&
            (!asex || x[asex] === 'F') 

            
            
            ;
    });

    page = 0;
    pages = mossList.length;
    document.getElementById("mossNumber").innerHTML = pages;
    displayPage(0);

}

function displayPage(i) {
    document.getElementById("hero").style.backgroundImage = "";
    gbifgallery=[];
    document.getElementById("common").innerHTML ="";
    document.getElementById("wiki").innerHTML = "";
    document.getElementById("gallery").innerHTML = "";
    document.getElementById("ease").innerHTML = "";
    document.getElementById("notes").innerHTML = "";
    document.getElementById("page").innerHTML = page + 1;
    document.getElementById("pagetotal").innerHTML = pages;
    var title = mossList[i].Name_new;
    displayFacts(i);
    // getWiki(title);
    getImages(title);
    mossNames(title);
    mossDiff(title);
}


function displayFacts(i) {
    let title = mossList[i].Name_new;
    let leng = mossList[i].Len;
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

    let gem = mossList[i].Gem; if (!gem) {gem="Z";};
    let tub = mossList[i].Tub;if (!tub) {tub="Z";};
    let lea = mossList[i].Lvs;if (!lea) {lea="Z";};
    let bul = mossList[i].Bul;if (!bul) {bul="Z";};
    let bra = mossList[i].Bra;if (!bra) {bra="Z";};
    let fr = mossList[i].Fr;
    let spbeg = mossList[i].Spbeg;
    let spend = mossList[i].Spend;
    let spbeg2 = mossList[i].Spbeg2;
    let spend2 = mossList[i].Spend2;
    let sex = mossList[i].Sex;




    document.getElementById("title").innerHTML = title;
    document.getElementById("count").innerHTML = countness(count);
    document.getElementById("leng").innerHTML = sizeness(leng);
    document.getElementById("light").innerHTML = lightness(light);
    document.getElementById("form").innerHTML = formness(form);
    document.getElementById("ph").innerHTML = phness(ph);
    document.getElementById("wet").innerHTML = wetness(wet);
    document.getElementById("type").innerHTML = typeness(type);
    document.getElementById("habitat").innerHTML = oxford(hablist);
    // document.getElementById("gem").innerHTML = gemmaeness(gem);
    document.getElementById("fr").innerHTML = frness(fr);
    document.getElementById("beg").innerHTML = months(spbeg,spend,spbeg2,spend2);
    document.getElementById("sex").innerHTML = sextype(sex);
    document.getElementById("prop").innerHTML = prop(gem,tub,lea,bul,bra);


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
            if (imageArray.length<3) {gbif(title);} else {
            document.getElementById("hero").style.backgroundImage = "url(" + imageArray[5] + ")";
            gallery(imageArray);
            }
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
            if (x === "R") { word = "rare"; } else { word = ""; }
    return word;
}

function frness(x) {
    if (x === "A") { word = "abundant"; } else
    if (x === "F") { word = "frequent"; } else
        if (x === "O") { word = "occasional"; } else
            if (x === "R") { word = "rare"; } else { word = "unknown"; }
    return word;
}

function months(spbeg,spend,spbeg2,spend2) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (spbeg) {   
    let word = monthNames[spbeg-1]+" and "+monthNames[spend-1];
    document.getElementById("season").style.display = "inline";
    return word;
        }
        else
        {
            document.getElementById("season").style.display = "none";
        }
}

function sextype(x) {
    if (x === "D") { word = "the same plant"; } else
        if (x === "D(M)") { word = "the same plant"; } else
            if (x === "MD") { word = "the same plant"; } else 
            if (x === "M(D)") { word = "separate plants"; } else
            if (x === "M") { word = "separate plants"; } else { word = "Male and female parts are absent"; }

    return word;
}

function prop(gem,tub,lea,bul,bra) {
    
    var proparray = [
    ];
    proparray.push({'type':'gemmae','freq':gem});
    proparray.push({'type':'tubers','freq':tub});
    proparray.push({'type':'leaves','freq':lea});
    proparray.push({'type':'bulbils','freq':bul});
    proparray.push({'type':'branches','freq':bra});


    
     let firstkey = proparray.sort((a, b) => a.freq > b.freq? 1 : -1);
     console.log(firstkey);
    if (firstkey[0].freq==="Z") {
        document.getElementById("asex").style.display ="none";
    }

    else {
        document.getElementById("asex").style.display ="inline";

        let pfletter=firstkey[0].freq;
        if (pfletter === "F") { propfreq = "frequently"; } else
        if (pfletter === "O") { propfreq = "occasionally"; } else
            if (pfletter === "R") { propfreq = "rarely"; } else { propfreq = "very rarely"; }
        document.getElementById("propfreq").innerHTML = propfreq;
    }
   

    return firstkey[0].type;
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
            var common = myJson;
 
                commonname = common.filter(x => x.latin === latin); 
        if (commonname.length>0) 
            {document.getElementById("common").innerHTML = commonname[0].english;} else
            {document.getElementById("common").innerHTML = latin;}
        })

        .catch(function (error) {
            console.log(error);
        });
}

function mossDiff(name) {
    fetch('diff.json')
        .then((resp) => resp.json())
        .then(function (myJson) {
            var diff = myJson;
 
                ease = diff.filter(x => x.NAME === name); 

            console.log(ease);

document.getElementById("ease").innerHTML = ease[0].DIFF;
document.getElementById("notes").innerHTML = ease[0].NOTES;

        })

        .catch(function (error) {
            console.log(error);
        });
}


function gbif(title) {
    fetch('https://api.gbif.org/v1/species?name=' + title)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            gbifkey = response;
            


            imagekey = gbifkey.results[0].key;
            console.log(imagekey);
            gbifImage(imagekey);
        })

        .catch(function (error) {
            console.log(error);
        });
}

function gbifImage(title) {
    fetch('https://api.gbif.org/v1/occurrence/search?media_type=StillImage&limit=9&taxon_key=' + title)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            gbifarray = response;
            console.log(gbifarray);

            // results[0].media[0].identifier
            for (i = 0; i < gbifarray.results[0].media.length; i++) {
                        var gbifimage = gbifarray.results[0].media[i].identifier;
                        gbifgallery.push(gbifimage);
                        }
                        document.getElementById("hero").style.backgroundImage = "url(" + gbifgallery[0] + ")";
                            gallery(gbifgallery);
        })

        .catch(function (error) {
            console.log(error);
        });
}

// function inat(title) {
//     alert(title);
//     fetch('https://api.inaturalist.org/v1/observations?&per_page=10&q=' + title)
//     .then(function (response) {
//         inatarray = response;
//         console.log(inatarray);
//         for (i = 0; i < inatarray.length; i++) {
//         inatimage = inatarray.results[i].photos[0].url;
//         inatgallery.push(inatimage);
//         }
//         document.getElementById("hero").style.backgroundImage = "url(" + inatgallery[0] + ")";
//             gallery(inatgallery);
//     })

//     .catch(function (error) {
//         console.log(error);
//     });
// }


