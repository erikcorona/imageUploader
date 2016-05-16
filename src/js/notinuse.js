/**
 * Created by erik on 5/16/16.
 */

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
