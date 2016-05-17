function DrawOnImage(album, imgFileName, image)
{
    this.album = album;
    this.imgFileName = imgFileName;
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

DrawOnImage.prototype.addAnnotation = function(termCategory, term, regions, annotGUID)
{
    var region = this.clicked;
    this.annotations.push(new Annotation(this.album, this.imgFileName, termCategory, term, regions, annotGUID));
    this.drawLocalAnnotation(regions);
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
};

DrawOnImage.prototype.addSingleClick = function(pos)
{
    this.clicked.push(pos);
};

DrawOnImage.prototype.removeAnnotation = function(guid)
{
    for(var i = 0; i < this.annotations.length; i++)
    {
        if(this.annotations[i].aGuid == guid)
        {
            this.annotations.splice(i,1);
            return;
        }
    }
};
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
    this.clearCanvas();
    this.drawDots();
};

DrawOnImage.prototype.highlightAnnotation = function(guid)
{
    for(var i = 0; i < this.annotations.length; i++)
    {
        if(this.annotations[i].aGuid == guid)
            this.drawLocalAnnotation(this.annotations[i].allRegions, "yellow");
        else
            this.drawLocalAnnotation(this.annotations[i].allRegions);
    }
};

DrawOnImage.prototype.redraw = function()
{
    this.clearCanvas();
};

DrawOnImage.prototype.clearCanvas = function()
{
    var ctx = this.canv.getContext('2d');
    this.canv.width  = this.img.width;
    this.canv.height = this.img.height;
    ctx.drawImage(this.img, 0,0, this.canv.width, this.canv.height);
};

DrawOnImage.prototype.drawDisjointRegion = function(region, color)
{
    if(color == null)
        color = 'cyan';

    var canv = document.getElementById("singleImageCanv");
    var ctx = canv.getContext('2d');
    var radius = 4;

    for(var i = 0; i < region.length; i++)
    {
        var pos = region[i];
        ctx.beginPath();
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
    pos = region[0];
    ctx.moveTo(pos.x, pos.y);
    for(i = 1; i < region.length; i++)
    {
        pos = region[i];
        ctx.lineTo(pos.x, pos.y);
        ctx.globalAlpha = 0.20;
        ctx.fillStyle = color;
    }
    ctx.fill();
    ctx.closePath();
};

DrawOnImage.prototype.drawLocalAnnotation = function(regions, color)
{
    for(var i = 0; i < regions.length; i++)
        this.drawDisjointRegion(regions[i], color);
};


DrawOnImage.prototype.drawDots = function ()
{
    var canv = document.getElementById("singleImageCanv");
    var ctx = canv.getContext('2d');

    this.drawDisjointRegion(this.clicked);
};
