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

function displayFacts(i) {
    let title = mossList[i].Name_new;
    let leng = mossList[i].Len;
    let gem = mossList[i].Gem;
    let light = mossList[i].L;
    let form = mossList[i].LF1;
    let ph = mossList[i].R;
    let wet = mossList[i].F;
    let count = mossList[i].GBno;

    document.getElementById("title").innerHTML = title;
    document.getElementById("leng").innerHTML = leng;
    document.getElementById("gem").innerHTML = gem;
    document.getElementById("light").innerHTML = light;
    document.getElementById("form").innerHTML = form;
    document.getElementById("ph").innerHTML = ph;
    document.getElementById("wet").innerHTML = wet;
    document.getElementById("count").innerHTML = count;


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

function displayPage(i) {
    document.getElementById("wiki").innerHTML = "";
    document.getElementById("gallery").innerHTML = "";
    document.getElementById("page").innerHTML = page + 1;
    document.getElementById("pagetotal").innerHTML = pages;
    var title = mossList[i].Name_new;
    displayFacts(i);
    getWiki(title);
    getImages(title);
}

function underscore(title) {
    var regex = / /gm;
    var str = title;
    var subst = `_`;
    return str.replace(regex, subst);
}


function getImages(title) {
    let wiki = underscore(title);
    var wikiurl = 'https://commons.wikimedia.org/w/api.php?action=query&generator=images&prop=imageinfo&gimlimit=9&iiurlwidth=1000&redirects=1&iiprop=url&format=json&titles=' + wiki + '&origin=*';
    fetch(wikiurl)
        .then(function (response) { return response.json(); })
        .then(function (response) {
            images = response;
            console.log(images);
            imageArray = findAllByKey(images, 'url');
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
    if (next > 8) {next = 0;}
    openImage(next);
}

function prevImage() {
    var imageNumber = document.getElementById("modalImage");
    var prev = parseInt(imageNumber.dataset.number) - 1;
    if (prev < 0) {prev = 8;}
    openImage(prev);
}
