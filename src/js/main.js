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

    // xhttp.open("POST", "http://54.237.198.126:8088",true);
    xhttp.open("POST", "http://127.0.0.1:8088",true);
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


function showCategories()
{
    var request = newAsk("categoryNames", {});
    var handler = function(j)
    {
        var categories = document.getElementById("categories");
        categories.innerHTML = j["data"]["names"];
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

function getImage()
{
    var album       = document.getElementById("getImageAlbum").value;
    var imgFileName = document.getElementById("getImage").value;

    var params = {"album" : album, "name" : imgFileName};

    var request = newAsk("getImage", params);
    var handler = function(j)
    {
        if(j["status"] == "SUCCESS") {
            var image = new Image();
            image.src = 'data:image/jpg;base64,' + j["data"]["image"];
            document.body.appendChild(image);
        }
    };

    ask(request, handler);
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
        // if(j["status"] == "SUCCESS")
        //     displayTerms(category);
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
    };

    ask(request, handler);
}

function displayTerms(categoryName)
{
    var params = {"category" : categoryName};
    var request = newAsk("getTerms", params);
    var handler = function(j)
    {
        var terms = document.getElementById("terms");
        terms.innerHTML = j["data"]["terms"];
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

function showAlbums()
{
    var request = newAsk("albumNames", {});
    var handler = function(j)
    {
        var albums = document.getElementById("albums");
        albums.innerHTML = j["data"]["albums"];
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

function thumb(allFiles) {
    if (allFiles == null || allFiles == undefined)
    {
        document.write("This Browser has no support for HTML5 FileReader yet!");
        return false;
    }

    var files = filterNonImages(allFiles);
    var b64Images = [];
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        var reader = new FileReader();

        if (reader != null) {
            reader.onload = function(e){
                var src = showThumbGetPic(e);
                b64Images.push(src);

                if(files.length == b64Images.length)
                {
                    var obj = {"request" : "saveImages",
                               "content" :
                                           {
                                               "setName": "images1",
                                               "images" : b64Images
                                           }
                              };
                    ask(obj,function(j){alert(j["response"])});
                }
                return src;
            };
            reader.readAsDataURL(file);
        }
    }
}

function showThumbGetPic(e){
    var myCan = document.createElement('canvas');
    var img   = new Image();
    img.src   = e.target.result;

    img.onload = function () {
        myCan.id = "myTempCanvas";
        var tsize = document.getElementById("txtThumbSize").value;
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
//     ask({"requestType":"imageSets"}, function(j){
//         var namesArr = j["sets"]; //get array of image set names
//         var parent = document.getElementById("showImgSets");
//         for(var i = 0; i < namesArr.length; i++)
//         {
//             var aLabel = document.createElement("Button");
//             aLabel.className = "PicSet";
//             aLabel.innerHTML = namesArr[i];
//             parent.appendChild(aLabel);
//         }
//     });
}
