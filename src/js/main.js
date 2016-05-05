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

    xhttp.open("POST", "http://127.0.0.1:8088",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ms = new Date().getTime();
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

function PostReq()
{
    // ask({"requestType" : "ping"},function(j){alert(JSON.stringify(j));});
    ask(
        {"requestType" : "getImage"},
        function(j){
            var image = new Image();
            image.src = 'data:image/jpg;base64,' + j["img"];
            document.body.appendChild(image);
    });
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
    for (i = 0; i < files.length; i++) {
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
    }
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
