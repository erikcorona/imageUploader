/**
 * Created by erik on 5/16/16.
 */

function mouseMoved(e){
    var canvas;
    if (!e)
        e = window.event;
    if (e.target)
        canvas = e.target;
    else if (e.srcElement)
        canvas = e.srcElement;
    if (canvas.nodeType == 3) // defeat Safari bug
        canvas = canvas.parentNode;

    var x = event.clientX - (canvas.offsetLeft - window.pageXOffset);
    var y = event.clientY - (canvas.offsetTop - window.pageYOffset);
    return {x: x, y: y};
}
