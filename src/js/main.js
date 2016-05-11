function ask(request, handleReply)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            var responseReceivedTime = new Date().getTime();
            var serverTime = responseReceivedTime - ms;
            var msLabel = document.getElementById("ms");
            msLabel.innerHTML = "Time (ms) " + serverTime;
            var returnedJson = JSON.parse(xhttp.responseText);
            if(returnedJson["status"] != "SUCCESS")
            {
                var errorLab = document.getElementById("errorLabel");
                errorLab.innerHTML = returnedJson["message"];
            }
            handleReply(returnedJson);
        }
    };

    xhttp.open("POST", "http://54.237.198.126:8089",true);
    // xhttp.open("POST", "http://127.0.0.1:8089",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var ms = new Date().getTime();
    xhttp.send(JSON.stringify(request));
}

function newAsk(request, params)
{
    return {"guid" : "testGUID", "request" : request, "parameters" : params};
}

function ping()
{
    var request  = newAsk("ping", {});
    var handler = function(j)
    {
       var pingLabel = document.getElementById("pingLabel");
       pingLabel.innerHTML = j["status"];
    };
    ask(request, handler);
}

function createAlbum()
{
    var name    = document.getElementById("newAlbumName").value;
    var params  = {"name" : name};
    var request = newAsk("newAlbum", params);
    var handler = function(j) { if(j["status"] == "SUCCESS"){showAlbums();} };
    ask(request, handler);
}

function prettyCategories(termsDiv, aCategory)
{
    var href = document.createElement('a');
    href.innerHTML = aCategory;
    href.onclick = function () {
        displayTerms(aCategory);
    };
    termsDiv.appendChild(href);
}

function showCategories()
{
    var request = newAsk("categoryNames", {});
    var handler = function(j)
    {
        var categories = document.getElementById("categories");
        categories.innerHTML = j["data"]["names"];

        var dddiv = document.getElementById("myDropdown");
        for(var i = 0; i < j["data"]["names"].length; i++)
        {
            var aCategory = j["data"]["names"][i];
            prettyCategories(dddiv, aCategory);
        }
    };

    ask(request, handler);
}

function eraseCategory()
{
    var name = document.getElementById("eraseCategoryName").value;
    var params = {"name" : name};
    var request = newAsk("eraseCategory", params);
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS")
            showCategories();
    };

    ask(request, handler);
}

function createCategory()
{
    var name    = document.getElementById("newCategoryName").value;
    var params  = {"name" : name};
    var request = newAsk("newCategory", params);
    var handler = function(j) { if(j["status"] == "SUCCESS"){
        showCategories();}
    };
    ask(request, handler);
}

function getImageThumb(album, imgFileName)
{
    var params = {"album" : album, "name" : imgFileName};

    var request = newAsk("getImage", params);
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS") {

            var image = new Image();
            image.src = 'data:image/jpg;base64,' + j["data"]["image"];
            var canv = showThumb(image);
            canv.className = "rotatingImage";
            canv.onclick = function(){
                displaySelectedImage(album, imgFileName);
            };
        }
    };

    ask(request, handler);
}

function removeAnnotation(button, album, imgFileName, category, term)
{
    button.onclick = function(j)
    {
        var params = {"album": album, "imageName": imgFileName, "category": category, "term": term};
        var request = newAsk("eraseAnnotation", params);
        var handler = function(j)
        {
            if(j["status"] == "SUCCESS")
                showAnnotations(album, imgFileName);
        };
        ask(request, handler);
    }

}
function showAnnotations(album, imgFileName)
{
    var params = {"album" : album, "imageName" : imgFileName};
    var request = newAsk("getTags", params);
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS")
        {

            var imageTagsDiv = document.getElementById("imageTags");
            clearChildren(imageTagsDiv);
            for (var i = 0; i < j["data"]["terms"].length; i++) {
                var button = document.createElement("button");
                button.className = "PicSet";
                var category = j["data"]["terms"][i]["category"];
                var term = j["data"]["terms"][i]["term"];
                button.innerHTML = category + ":" + term;
                removeAnnotation(button, album, imgFileName, category, term);
                imageTagsDiv.appendChild(button);
            }
        }
    };
    ask(request, handler);
}

function displaySelectedImage(album, imgFileName)
{
    var params = {"album" : album, "name" : imgFileName};

    var request = newAsk("getImage", params);
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS") {
            var image = new Image();
            image.src = 'data:image/jpg;base64,' + j["data"]["image"];
            var imgDiv = document.getElementById("selectedImage");
            while(imgDiv.firstChild)
                imgDiv.removeChild(imgDiv.firstChild);
            imgDiv.appendChild(image);

            var lab = document.getElementById("selectedImageName");
            lab.innerHTML = imgFileName;

            var albLabel = document.getElementById("selectedImageAlbumName");
            albLabel.innerHTML = album;
            showAnnotations(album, imgFileName);
            clearChildren(document.getElementById("tagging"));
        }
    };

    ask(request, handler);
}

function getImage()
{
    var album       = document.getElementById("getImageAlbum").value;
    var imgFileName = document.getElementById("getImage").value;
    displaySelectedImage(album, imgFileName);
    // clearChildren(document.getElementById("tagging"));
    // showCategories();
}

function eraseImage()
{
    var album       = document.getElementById("eraseImageAlbum").value;
    var imgFileName = document.getElementById("eraseImage").value;

    var params = {"album" : album, "name" : imgFileName};
    var request = newAsk("eraseImage", params);
    var handler = function(j)
    {
        displayImages(album);
    };

    ask(request,handler);
}

function uploadImage2(aFile)
{
    var album = document.getElementById("uploadAlbumName").value;
    var reader = new FileReader();

    if(reader != null)
    {
        reader.onload = function(e)
        {
            var b64 = showThumbGetPic(e);
            var params = {"album" : album, "name" : aFile.name, "image" : b64};
            var request = newAsk("saveImage", params);
            var handler = function(j){
                if(j["status"] == "SUCCESS")
                   displayImages(album);
               };
            ask(request, handler);
        };
        reader.readAsDataURL(aFile);
    }
}

function eraseTerms()
{
    var category = document.getElementById("eraseTermCategory").value;
    var strTerms = document.getElementById("eraseTerms").value;
    var terms = strTerms.split(",");
    var params = {"category" : category, "terms" : terms};
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS")
            displayTerms(category);
    };
    var request = newAsk("eraseTerms", params);
    ask(request,handler);
}

function uploadTerms()
{
    var category = document.getElementById("uploadCategoryName").value;
    var strTerms = document.getElementById("newTerms").value;
    var terms = strTerms.split(",");
    var params = {"category" : category, "terms" : terms};
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS")
            displayTerms(category);
    };
    var request = newAsk("newTerms", params);
    ask(request,handler);
}

function uploadImage(allfiles)
{
    if (allfiles == null || allfiles == undefined)
    {
        document.write("This Browser has no support for HTML5 FileReader yet!");
        return false;
    }

    var files = filterNonImages(allfiles);

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        uploadImage2(file);
    }
}

function displayImages(album)
{
    var params = {"album" : album};
    var request = newAsk("imageNames", params);
    var handler = function(j)
    {
        var images = document.getElementById("images");
        images.innerHTML = j["data"]["images"];
        var imageNames = j["data"]["images"];

        clearChildren(document.getElementById("thumbs"));
        for(var i = 0; i < imageNames.length; i++)
            getImageThumb(album,imageNames[i]);
    };

    ask(request, handler);
}

function tagImage(aButton, tagCategory, tagName, albumName, imgName)
{
    aButton.onclick = function()
    {
        var params = {"album" : albumName, "imageName" : imgName, "category": tagCategory, "term" : tagName}
        var request = newAsk("tag", params);
        var handler = function(j)
        {
            if(j["status"] == "SUCCESS") {
                showAnnotations(albumName, imgName);
            }
        };
        ask(request, handler);
    };
}

function displayTerms(categoryName)
{
    var params = {"category" : categoryName};
    var request = newAsk("getTerms", params);
    var handler = function(j)
    {
        var terms = document.getElementById("terms");
        terms.innerHTML = j["data"]["terms"];

        var taggingDiv = document.getElementById("tagging");
        while(taggingDiv.firstChild)
            taggingDiv.removeChild(taggingDiv.firstChild);
        for(var i = 0; i < j["data"]["terms"].length; i++)
        {
            var button = document.createElement("button");
            button.className = "PicSet";
            var tagName = j["data"]["terms"][i];
            button.innerHTML = tagName;
            var albumName = document.getElementById("selectedImageAlbumName").innerHTML;
            var imgName   = document.getElementById("selectedImageName").innerHTML;
            tagImage(button, categoryName, tagName, albumName, imgName);
            taggingDiv.appendChild(button);
        }
    };

    ask(request, handler);
}
function getTerms()
{
    var categoryName = document.getElementById("categoryName").value;
    displayTerms(categoryName);
}

function showImages()
{
    var album = document.getElementById("albumName").value;
    displayImages(album);
}

function eraseAlbum()
{
    var name = document.getElementById("eraseAlbumName").value;
    var params = {"name" : name};
    var request = newAsk("eraseAlbum", params);
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS")
            showAlbums();
    };

    ask(request, handler);
}

function prettyAlbums(albumsDiv, anAlbum)
{
    var href = document.createElement('a');
    href.innerHTML = anAlbum;
    href.onclick = function () {
        displayImages(anAlbum);
    };
    albumsDiv.appendChild(href);
}

function showAlbums()
{
    var request = newAsk("albumNames", {});
    var handler = function(j)
    {
        var albums = document.getElementById("albums");
        albums.innerHTML = j["data"]["albums"];
        var albumNames = j["data"]["albums"];
        var albumsDD = document.getElementById("myAlbumsDropdown");
        for(var i = 0; i < albumNames.length; i++)
            prettyAlbums(albumsDD, albumNames[i]);
    };

    ask(request, handler);
}

function filterNonImages(files) {
    var imgs = [];
    var imageType = /image.*/;
    for(var i = 0; i < files.length; i++)
        if(files[i].type.match(imageType))
            imgs.push(files[i]);
    return imgs;
}

// function thumb(allFiles) {
//     if (allFiles == null || allFiles == undefined)
//     {
//         document.write("This Browser has no support for HTML5 FileReader yet!");
//         return false;
//     }
//
//     var files = filterNonImages(allFiles);
//     var b64Images = [];
//     for (var i = 0; i < files.length; i++) {
//         var file = files[i];
//
//         var reader = new FileReader();
//
//         if (reader != null) {
//             reader.onload = function(e){
//                 var src = showThumbGetPic(e);
//                 b64Images.push(src);
//
//                 if(files.length == b64Images.length)
//                 {
//                     var obj = {"request" : "saveImages",
//                                "content" :
//                                            {
//                                                "setName": "images1",
//                                                "images" : b64Images
//                                            }
//                               };
//                     ask(obj,function(j){alert(j["response"])});
//                 }
//                 return src;
//             };
//             reader.readAsDataURL(file);
//         }
//     }
// }

function clearChildren(el)
{
    while(el.firstChild)
        el.removeChild(el.firstChild);
}

function showThumb(img)
{
    var canv = document.createElement('canvas');
    var ctx = canv.getContext('2d');
    canv.width  = 64;
    canv.height = 64;
    ctx.drawImage(img, 0,0, canv.width, canv.height);
    var thumbs = document.getElementById("thumbs");
    thumbs.appendChild(canv);
    return canv;
}

function showThumbGetPic(e){
    var myCan = document.createElement('canvas');
    var img   = new Image();
    img.src   = e.target.result;

    img.onload = function () {
        myCan.id = "myTempCanvas";
        var tsize = 64;
        myCan.width = Number(tsize);
        myCan.height = Number(tsize);
        if (myCan.getContext) {
            var cntxt = myCan.getContext("2d");
            cntxt.drawImage(img, 0, 0, myCan.width, myCan.height);
            var dataURL = myCan.toDataURL();

            if (dataURL != null && dataURL != undefined) {
                var nImg = document.createElement('img');
                nImg.src = dataURL;
                document.body.appendChild(nImg);
            }
            else
                alert('unable to get context');
        }
    };
    return img.src;
}

function init()
{
    ping();
    showAlbums();
    showCategories();
    displayImages("Cars");
}

/* When the user clicks on the button,
 toggle between hiding and showing the dropdown content */
function myFunction2() {
    document.getElementById("myAlbumsDropdown").classList.toggle("show");
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
