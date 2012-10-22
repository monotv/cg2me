/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: tick_mark
 *
 * A StraighLine knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene"], 
       (function(Util,vec2,Scene) {
       
    "use strict";

    /**
     *  A simple straight line that can be dragged 
     *  around by its endpoints.
     *  Parameters:
     *  - point: [x,y] coordinates of the point which gives tangent for normal vector
     *  - tanPoints: array of [x,y] coordinates of the tangent points calculated from point
     *  - style: object defining width, color and length attributes for line drawing, 
     *       begin of the form { width: 2, color: "#ff0000", len: 1 }
     */ 

    var TickMark = function(point, tanPoints, style) {
        
        // draw style for drawing the TickMark
        this.style = style || { width: 2, color: "#ff0000", len: 1 };
		
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

    // draw this line into the provided 2D rendering context
    TickMark.prototype.draw = function(context) {
	
        // draw actual line
        context.beginPath();
        
        context.moveTo(this.normP0[0], this.normP0[1]);
        context.lineTo(this.normP1[0], this.normP1[1]);
        
        // set drawing style
        context.lineWidth = this.style.width;
        context.strokeStyle = this.style.color;
        
        // actually start drawing
        context.stroke(); 
        
    };

    // test whether the mouse position is on this line segment
    TickMark.prototype.isHit = function(context,pos) {
		
		// should we select the ParametricCurve when a TickMark is hit?
		
		return false;
        // project point on line, get parameter of that projection point
        var t = vec2.projectPointOnLine(pos, this.p0, this.p1);
                
        // outside the line segment?
        if(t<0.0 || t>vec2.length(vec2.sub(this.p0,this.p1))) {
            return false; 
        }
        
        // coordinates of the projected point 
        var p = vec2.add(this.p0, vec2.mult( vec2.sub(this.p1,this.p0), t ));

        // distance of the point from the line
        var d = vec2.length(vec2.sub(p,pos));
        
        // allow 2 pixels extra "sensitivity"
        return d<=(this.style.width/2)+2;
        
    };
    
    // this module only exports the constructor for TickMark objects
    return TickMark;

})); // define

    
