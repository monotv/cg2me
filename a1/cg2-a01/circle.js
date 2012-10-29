/*
 * (C)opyright teamifndef
 *
 * Module: circle
 *
 * A StraighLine knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "resize_circle_dragger"], 
       (function(Util,vec2,Scene,PointDragger, ResizeCircleDragger) {

    "use strict";

    /**
     *  A simple circle can be dragged 
     *  around by its center point and manipulated in size by dragging the circle itself.
     *  Parameters:
     *  - point0: array object representing [x,y] coordinates of center point
	 *	- radius: radius of the circl
     *  - style: object defining width and color attributes for line drawing, 
     *       begin of the form { width: 2, color: "#00FF00" }
     */ 

    var Circle = function(point0, radius, style) {

        console.log("creating circle at [" + 
                    point0[0] + "," + point0[1] + "] width a radius of " + radius + '.');

        // default draw style
		this.radius = radius || 10;
        this.style = style || {  
            width: 2,
            color: '#ff0000', 
            fill: false
        };

        // convert to Vec2 just in case the points was given as array
        this.p0 = point0 || [0,0];

    };

    // draw this line into the provided 2D rendering context
    Circle.prototype.draw = function(context) {

        // what shape to draw
        context.beginPath();
        context.arc(this.p0[0], this.p0[1], // position
                    this.radius,    		// radius
                    0.0, Math.PI*2,           // start and end angle
                    true);                    // clockwise
        context.closePath();

        // draw style
        context.lineWidth   = this.style.width;
        context.strokeStyle = this.style.color;
        context.fillStyle   = this.style.color;

        // trigger the actual drawing
        if(this.style.fill) {
            context.fill();
        };
        context.stroke();

    };

    // test whether the mouse position is on this circle
    Circle.prototype.isHit = function(context,pos) {
	
		// distance from center of circle
		var distance = vec2.length(vec2.sub(this.p0, pos));
		
        // allow 2 pixels extra "sensitivity
        return (distance <= (((this.style.width/2)+2)+this.radius) && (distance >= (this.radius - ((this.style.width/2)+2))));
        
    };
    
    // return list of draggers to manipulate this line
    Circle.prototype.createDraggers = function() {
    
        var draggerStyle = { radius:4, color: this.style.color, width:0, fill:true }
        var draggers = [];
        
        // create closure and callbacks for dragger
        var _circle = this;
        var getP0 = function(){
			return _circle.p0;
		};
        var setP0 = function(dragEvent){
			_circle.p0 = dragEvent.position;
		};
        var getRadius = function(){
			return _circle.radius;
		};
		var setRadius = function(radius){
			_circle.radius = radius;
		};
		
        draggers.push(new PointDragger(getP0, setP0, draggerStyle) );
		draggers.push(new ResizeCircleDragger(getRadius, setRadius, getP0));
        
        return draggers;

    };

    // this module only exports the constructor for Circle objects
    return Circle;

})); // define