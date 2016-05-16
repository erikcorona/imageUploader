function DrawOnImage(image)
{
    this.img = image;

    this.canv = document.createElement('canvas');
    this.canv.id = "singleImageCanv";
    this.canv.className = "dottedBorder";

    //====================== add canvas =====================
    var ctx = this.canv.getContext('2d');
    this.canv.width  = this.img.width;
    this.canv.height = this.img.height;
    ctx.drawImage(this.img, 0,0, this.canv.width, this.canv.height);
    this.canv.addEventListener("click", this.addCoordEvent(), false);
    //=======================================================

    this.clicked = [];
    this.annotations = [];
}

DrawOnImage.prototype.saveAnnotation = function(annotGUID)
{
    var region = this.clicked;
    this.annotations.push(new Annotation(album, imageName, termCategory, term, region));
    this.clicked = [];
};

DrawOnImage.prototype.getCanvas = function()
{
    return this.canv;
};

DrawOnImage.prototype.getImage = function()
{
    return this.img;
};

DrawOnImage.prototype.hasRegion = function()
{
    return this.clicked.length > 0;
}

DrawOnImage.prototype.addSingleClick = function(pos)
{
    this.clicked.push(pos);
}

DrawOnImage.prototype.addCoordEvent = function(event)
{
    var myImg = this;
    return function()
    {
        myImg.addCoord(event);
        myImg.clearCanvas();
        myImg.drawDots();
    }
};

DrawOnImage.prototype.getRegion = function()
{
    return this.clicked;
}

DrawOnImage.prototype.addCoord = function(event)
{
    var pos = mouseMoved(event);
    this.addSingleClick(pos);
    // this.clicked.push(pos);
    this.clearCanvas();
    this.drawDots();
};

DrawOnImage.prototype.clearCanvas = function()
{
    var ctx = this.canv.getContext('2d');
    this.canv.width  = this.img.width;
    this.canv.height = this.img.height;
    ctx.drawImage(this.img, 0,0, this.canv.width, this.canv.height);
    // ctx.fillStyle = "#FF0000";
    // ctx.fillRect(0,0,150,75);
    // this.canv.addEventListener("click", drawDot, false);
};

DrawOnImage.prototype.drawDots = function ()
{
    var canv = document.getElementById("singleImageCanv");
    var ctx = canv.getContext('2d');

    var radius = 4;

    for(var i = 0; i < this.clicked.length; i++) {
        ctx.beginPath();
        var pos = this.clicked[i];
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
        ctx.globalAlpha = 0.80;
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.closePath();
    }

    ctx.beginPath();
    ctx.moveTo(this.clicked[0].x, this.clicked[0].y);
    for(i = 1; i < this.clicked.length; i++) {
        pos = this.clicked[i];
        ctx.lineTo(pos.x, pos.y);
        ctx.globalAlpha = 0.20;
        ctx.fillStyle = 'cyan';
    }
    ctx.fill();
    ctx.closePath();
};


function drawDot(event)
{
    var pos = mouseMoved(event);
    var canv = document.getElementById("singleImageCanv");
    var ctx = canv.getContext('2d');

    var radius = 4;
    // ctx.fillStyle = "#88e188";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    // ctx.fillRect(0,0,150,75);
    // ctx.fillRect(pos.x,pos.y,pos.x+150,pos.y+75);
}
