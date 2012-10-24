/*
 * (C)opyright team ifndef
 *
 * Module: tick_mark
 *
 * A TickMark knows how to draw itself into a specified 2D context,
 * can tell at which points the curve has been interpreted.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene"], 
       (function(Util,vec2,Scene) {
       
    "use strict";

    /**
     *  A tick mark indicating at which points the curve has been interpreted
     *  Parameters:
     *  - point: array object representing [x,y] coordinates of the tick mark
	 *  - tanPoints: array object needed to calculate the slope of the tangent
     *  - style: object defining width and color attributes for tick mark drawing, 
     *       begin of the form { width: 2, color: "#00FF00", len: 1 }
     */ 

    var TickMark = function(point, tanPoints, style) {
        
        // draw style for drawing the TickMark
        this.style = style || { width: 2, color: "#ff0000", len: 0.2 };

		// calculate slope of the tangent
		this.point = point;
		this.tanP0 = [tanPoints[0][0], tanPoints[0][1]];
		this.tanP1 = [tanPoints[1][0], tanPoints[1][1]];
		this.tan = [this.tanP1[0] - this.tanP0[0], this.tanP1[1] - this.tanP0[1]];
		this.norm = [-this.tan[1], this.tan[0]];

		// starting point of tick, based on the parametric curve point, modified by norm vector
		this.normP0 = [this.point[0] - (this.norm[0]*this.style.len), this.point[1] - (this.norm[1]*this.style.len)];

		// end point of tick, modified by norm vector
		this.normP1 = [this.point[0] + (this.norm[0]*this.style.len), this.point[1] + (this.norm[1]*this.style.len)];
    };

    // draw this tick into the provided 2D rendering context
    TickMark.prototype.draw = function(context) {
	
        // draw actual tick
        context.beginPath();

		// start drawing at point
        context.moveTo(this.normP0[0], this.normP0[1]);

		// stop drawing at point
        context.lineTo(this.normP1[0], this.normP1[1]);
        
        // set drawing style
        context.lineWidth = this.style.width;
        context.strokeStyle = this.style.color;
        
        // actually start drawing
        context.stroke(); 

    };
    
    // this module only exports the constructor for TickMark objects
    return TickMark;

})); // define
