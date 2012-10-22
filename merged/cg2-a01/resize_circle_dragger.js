/*
 * (C)opyright team ifndef
 *
 * Module: resize_circle_dragger
 *
 * A ResizeCircleDragger is a drawable object than can react to 
 * events from a SceneController. It will typically control
 * the radius of one circle obejct.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene"], 
       (function(Util, vec2, Scene) {

    "use strict";

    var ResizeCircleDragger = function(getRadius, setRadius, getPos, style) {

		// settings
		this.radius = getRadius();
		this.setRadius = setRadius || function(){return 10;};
		this.getPos = getPos;

		// default draw style
        this.style = style || {  
            width: 2,
            color: '#ff0000', 
            fill: false
        };

        // attribute queried by SceneController to recognize draggers
        this.isDragger = true; 
               
    };

    /*
     * draw the dragger as a circle
     */
    ResizeCircleDragger.prototype.draw = function (context) {

        // what is my current position?
        var pos = this.getPos();

        // what shape to draw
        context.beginPath();
        context.arc(pos[0], pos[1], // position
                    this.radius,    // radius
                    0.0, Math.PI*2,           // start and end angle
                    true);                    // clockwise
        context.closePath();
        
        // draw style
        context.lineWidth   = this.style.width;
        context.strokeStyle = this.style.color;
        context.fillStyle   = this.style.color;
        
        // trigger the actual drawing
        context.stroke();
    };

    // test whether the mouse position is on this circle dragger
    ResizeCircleDragger.prototype.isHit = function(context,pos){
	
		// distance from center of circle dragger
		var distance = vec2.length(vec2.sub(this.getPos(), pos));
		
        // allow 2 pixels extra "sensitivity
        return (distance <= (((this.style.width/2)+2)+this.radius) && (distance >= (this.radius - ((this.style.width/2)+2))));

    };
        
    /*
     * Event handler triggered by a SceneController when mouse
     * is being dragged
     */
    ResizeCircleDragger.prototype.mouseDrag = function (dragEvent) {

		var radius = vec2.length(vec2.sub(this.getPos(), dragEvent.position));
		
        // change position of the associated original (!) object
		$(document).trigger('mousedragcircle', [radius]);
        this.setRadius(radius);
		this.radius = radius;

    };

    // this module exposes only the constructor for Dragger objects
    return ResizeCircleDragger;

})); // define
