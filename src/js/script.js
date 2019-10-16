let navbar = document.getElementById('navbar');
let thumbnailContainer = document.getElementById('thumbnails');

window.onload = function () {
    loadImageUrls()
};
window.onscroll = function () { setNavBackground() }

function setNavBackground() {
    var scrollPosition = window.scrollY;

    if (scrollPosition === 0) {
        navbar.style.backgroundColor = "rgba(248, 248, 248, 0.0)";
    } else {
        navbar.style.backgroundColor = calculateNavColor(scrollPosition);
    }
}

function calculateNavColor(scrollPosition) {
    x = ((1 - (75 - scrollPosition) / 75) * 0.08) + 0.1;
    return "rgba(248, 248, 248, " + x + ")";
}

function loadImageUrls() {
    params = { "table": "josieimages" };
    dbParams = JSON.stringify(params);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            createThumbnails(JSON.parse(this.responseText));
        }
    };
    xmlhttp.open("GET", "php/dbConn.php?params=" + dbParams, true);
    xmlhttp.send();
}

function createThumbnails(data) {
    for (let image of data) {
        let div = document.createElement('div');
        div.innerHTML = generateThumbnailHtml(image);
        thumbnailContainer.appendChild(div);
    }
}

function generateThumbnailHtml(image) {
    return `
    <div class="thumbnail-outer">
        <img class="thumbnail-image" src=".${image.FILE_LOCATION}" />
        <div class="thumbnail-inner">
            <div class="thumbnail-title">${image.NAME}</div>
            <div class="thumbnail-desc">${image.DESCRIPTION}</div>
        </div>
    </div>
    `;
}