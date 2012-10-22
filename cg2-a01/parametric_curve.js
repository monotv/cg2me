/*
 * (C)opyright Florian Ritzel 
 *
 * Module: ParametricCurve
 *
 * A StraighLine knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "tick_mark"], 
       (function(Util,vec2,Scene,PointDragger, TickMark) {
       
    "use strict";

    /**
     *  A simple ParametricCurve can be dragged 
     *  around by its center point and manipulated in size by dragging the ParametricCurve itself.
     *  Parameters:
     *  - point0: array object representing [x,y] coordinates of center point
	 *	- radius: radius of the circl
     *  - style: object defining width and color attributes for line drawing, 
     *       begin of the form { width: 2, color: "#00FF00" }
     */ 

    var ParametricCurve = function(fx, fy, minT, maxT, segments, style, tickMarkStyle) {

        console.log("creating ParametricCurve at [");
        
        // settings
		this.fx = fx || function(t){Math.sin(t)};
		this.fy = fy || function(t){Math.cos(t)};
		this.minT = minT || 0;
		this.maxT = maxT || 5;
		this.segments = segments || 20;
        this.style = style || {  
            width: 2,
            color: '#ff0000', 
            fill: false
        };

		this.tickMarkStyle = tickMarkStyle || {
			width: 1,
			color: '#ff0000',
			len: 0.2
		};
		
        // initialize array
        this.points = [[0,0]];
		
		// calculate points
		var i;
		var t;
		for(i = 0;i<this.segments;i++){
			t = (this.maxT/this.segments)*(i+1);
			this.points[i] = [this.fx(t), this.fy(t)];
		}
        
    };

    // draw this line into the provided 2D rendering context
    ParametricCurve.prototype.draw = function(context) {
		
		var i;
		
        // what
		for(i=0;i<this.points.length-1;i++){
			//console.log("p", this.p[i][0], this.p[i][1], "p", this.p[i+1][0], this.p[i+1][1])
			context.beginPath();
			context.moveTo(this.points[i][0], this.points[i][1]);
			context.lineTo(this.points[i+1][0], this.points[i+1][1]);
			context.lineWidth   = this.style.width;
			context.strokeStyle = this.style.color;
			context.stroke();
		}
 
        // draw
        
    };

    // test whether the mouse position is on this ParametricCurve
    ParametricCurve.prototype.isHit = function(context,pos) {
		var i;
		for(i=0;i<this.points.length-1;i++){
			// project point on line, get parameter of that projection point
			var t = vec2.projectPointOnLine(pos, this.points[i], this.points[i+1]);
					
			// coordinates of the projected point 
			var p = vec2.add(this.points[i], vec2.mult( vec2.sub(this.points[i+1],this.points[i]), t ));

			// distance of the point from the line
			var d = vec2.length(vec2.sub(p,pos));

			// allow 2 pixels extra "sensitivity"
			var foo = !(t<0.0 || t>vec2.length(vec2.sub(this.points[i],this.points[i+1])));
			if(foo && d<=(this.style.width/2)+2){
				return true;
			}
		}
		return false;
    };
    
    // return list of draggers to manipulate this line
    ParametricCurve.prototype.createDraggers = function() {
    
        var draggers = [];
        
        return draggers;
        
    };

    ParametricCurve.prototype.createTickMarks = function() {
    
        var tickMarks = [];
		var tickMarkStyle = { color: this.tickMarkStyle.color, width: this.tickMarkStyle.width, len: this.tickMarkStyle.len }
        var _parametricCirlce = this;
		/*var getPoints = function(dragEvent){
			return _parametricCirlce.points;
		}*/
		
		var i;
		var t;
		for(i = 0;i<this.segments;i++){
			t = (this.maxT/this.segments)*(i+1);
			tickMarks.push(new TickMark(this.points[i], [[this.fx(t-0.1), this.fy(t-0.1)], [this.fx(t+0.1), this.fy(t+0.1)]], tickMarkStyle));
		}

        return tickMarks;
        
    };
	
    // this module only exports the constructor for ParametricCurve objects
    return ParametricCurve;

})); // define

    
