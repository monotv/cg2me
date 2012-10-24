/*
 * (C)opyright team ifndef
 *
 * Module: ParametricCurve
 *
 * A ParametricCurve knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "tick_mark"], 
       (function(Util,vec2,Scene,PointDragger, TickMark) {
       
    "use strict";

    /**
     *  A parametric curve
     *  Parameters:
     *  - fx: function f(x)
	 *  - fy: function f(y)
	 *	- minT: min domain of the curve
	 *  - maxT: max domain of the curve
	 *  - segments: number of segments used for drawing the curve
     *  - style: object defining width and color attributes for curve drawing, 
     *       begin of the form { width: 2, color: "#FF0000" }
     */ 

    var ParametricCurve = function(fx, fy, minT, maxT, segments, style) {
	
		console.log("creating ParametricCurve with " + segments + " segments.");
        
        // settings
		this.fx = fx || "350 + (100 * Math.sin(t))";
		this.fy = fy || "150 + (100 * Math.cos(t))";
		this.minT = minT || 0;
		this.maxT = maxT || 5;
		this.segments = segments || 20;
		this.showTickMarks = true;

		// draw style for drawing the parametric curve
        this.style = style || {  
            width: 2,
            color: '#ff0000'
        };

		// draw style of drawing the tick mark
		this.tickMarkStyle = {
			width: 1,
			color: '#ff0000',
			len: 0.2
		};

    };

    // draw this line into the provided 2D rendering context
    ParametricCurve.prototype.draw = function(context) {
	
		// initialize points array
        this.points = [];

		// calculate points
		var t;
		var fx_func;
		var fx_;
		var fy_func;
		var fy_;
		for(var i=0;i<this.segments;i++) {
			t = ((this.maxT-this.minT)/this.segments)*(i+1);
			// test if function is valid, otherwise return
			try {
				fx_func = eval(this.fx);
				fx_ = function(t) { return fx_func };
				fy_func = eval(this.fy);
				fy_ = function(t) { return fy_func };
				this.points[i] = [fx_(t), fy_(t)];
			}
			catch (e) {
				console.log("input is not valid");
				return;
			}
		}
		
        // draw a line for each segment of the parametric curve
		for(var i=0;i<this.points.length-1;i++) {
			context.beginPath();
			context.moveTo(this.points[i][0], this.points[i][1]);
			context.lineTo(this.points[i+1][0], this.points[i+1][1]);
			context.lineWidth   = this.style.width;
			context.strokeStyle = this.style.color;
			context.stroke();
		}

    };

    // test whether the mouse position is on this ParametricCurve
    ParametricCurve.prototype.isHit = function(context,pos) {

		for(var i=0;i<this.points.length-1;i++){
			// project point on line, get parameter of that projection point
			var t = vec2.projectPointOnLine(pos, this.points[i], this.points[i+1]);
					
			// coordinates of the projected point 
			var p = vec2.add(this.points[i],
								vec2.mult(vec2.sub(this.points[i+1],this.points[i]), t));

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
    
    // return list of draggers to manipulate this curve
    ParametricCurve.prototype.createDraggers = function() {

		// initialize draggers array
        var draggers = [];

		// return empty draggers array
        return draggers;

    };

	// return list of tick marks of the parametric curve
    ParametricCurve.prototype.createTickMarks = function() {
 
		// initialize tick marks array
        var tickMarks = [];

		// set tick mark style
		var tickMarkStyle = {
			color: this.tickMarkStyle.color,
			width: this.tickMarkStyle.width,
			len: this.tickMarkStyle.len
		};

		// create tick marks and push it to array
		var t;
		var fx_func = this.fx;
		var fy_func = this.fy;
		var x;
		var y;
		for(var i=0;i<this.segments;i++) {
			// test if function is valid, otherwise return
			try {
				t = ((this.maxT-this.minT)/this.segments)*(i+1);
				eval('x = function(t) { return eval(fx_func) }');
				eval('y = function(t) { return eval(fy_func) }');
				tickMarks.push(new TickMark(this.points[i], [[x(t-0.1), y(t-0.1)], [x(t+0.1), y(t+0.1)]], tickMarkStyle));
			}
			catch (e) {
				console.log("input is not valid");
				return;
			}
		}

		// return tick marks array
        return tickMarks;

    };
	
    // this module only exports the constructor for ParametricCurve objects
    return ParametricCurve;

})); // define