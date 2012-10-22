/*
 * (C)opyright Florian Ritzel 
 *
 * Module: BezierCurve
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
     *  A BezierCurve - Calculated recursive-adaptive.
     *  Parameters:
     *  - points: p0, p1, p2, p3 for the first polygon.
	 *	- t: parameter we use as starting value for the casteljau algorithm.
     *  - style: look of the lines.
     *  - tickMarkStyle: look of the tick marks.
     */ 

    var BezierCurve = function(points, t, style, tickMarkStyle, showControlPolygons) {

        console.log("creating BezierCurve.");
        
        // settings
		this.points = points || [[100, 100], [150, 50], [150, 150], [200, 100]];
		this.t = t || 0.5;
        this.style = style || {  
            width: 2,
            color: '#ff0000'
        };

		this.tickMarkStyle = tickMarkStyle || {
			width: 1,
			color: '#ff0000',
			len: 0.2
		};
		this.showControlPolygons = showControlPolygons;
        // initialize array
        this.xx = [[0,0]];
		// this.bezier_curve(this.points[0], this.points[1], this.points[2], this.points[3], t);        
    };

    // draw this line into the provided 2D rendering context
    BezierCurve.prototype.draw = function(context) {
		
		/*var i;
		
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
 		*/
        // draw
		this.context = context;
        this.bezier_recursive(this.points[0], this.points[1], this.points[2], this.points[3], this.t);
    };

    // test whether the mouse position is on this BezierCurve
    BezierCurve.prototype.isHit = function(context,pos) {
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
    BezierCurve.prototype.createDraggers = function() {
    
        var draggers = [];
        
        return draggers;
        
    };

    BezierCurve.prototype.createTickMarks = function() {
    
        var tickMarks = [];
		var tickMarkStyle = { 
			color: this.tickMarkStyle.color,
			width: this.tickMarkStyle.width,
			len: this.tickMarkStyle.len
		};
        var _bezierCurve = this;
		
		var i;
		var t;
		for(i = 0;i<this.segments;i++){
			t = (this.maxT/this.segments)*(i+1);
			tickMarks.push(new TickMark(this.points[i], [[this.fx(t-0.1), this.fy(t-0.1)], [this.fx(t+0.1), this.fy(t+0.1)]], tickMarkStyle));
		}

        return tickMarks;
        
    };

	BezierCurve.prototype.bezier_recursive = function(p0, p1, p2, p3, t){
		// testing
		var v1 = [p1[0] - p0[0], p1[1] - p0[1]];
		var v2 = [p2[0] - p1[0], p2[1] - p1[1]];
		var v3 = [p3[0] - p2[0], p3[1] - p2[1]];
		var degV1V2 = ((v1[0] * v2[0]) + (v1[1] * v2[1])) / (Math.sqrt(((v1[0]*v1[0]) + (v1[1]*v1[1]))) * (Math.sqrt(((v2[0]*v2[0]) + (v2[1]*v2[1])))));
		var degV2V3 = ((v2[0] * v3[0]) + (v2[1] * v3[1])) / (Math.sqrt(((v2[0]*v2[0]) + (v2[1]*v2[1]))) * (Math.sqrt(((v3[0]*v3[0]) + (v3[1]*v3[1])))));  
		var radian1 = Math.atan(Math.abs(p1[1] - p0[1])/Math.abs(p1[0] - p0[0]));
		var radian2	= Math.atan(Math.abs(p2[1] - p1[1])/Math.abs(p2[0] - p1[0]));
		var radian3	= Math.atan(Math.abs(p3[1] - p2[1])/Math.abs(p3[0] - p2[0]));
		var degree1 = (radian1 * 180 )/Math.PI;
		var degree2 = (radian2 * 180 )/Math.PI;
		var degree3 = (radian3 * 180 )/Math.PI;
		console.log(v1, v2, v3, (Math.acos(degV1V2)* 180 )/Math.PI, (Math.acos(degV2V3)* 180 )/Math.PI, degree1, degree2, degree3)
		this.paintPolygon(p0, p1, p2, p3, this.style, this.width);
		return false;
		/*var a0, a1, a2, b0, b1, c0;
		// check if calculation is sufficient
		if(){	
			paintPolygon(p0, p1, p2, p3, this.style, this.width);
			return false;			
		} else {
			// calculate new polygons
			
			if(this.showControlPolygons){
				// paint control polygon
				paintPolygon(p0, p1, p2, p3, this.randomColor(), 1);
			}
			// step 1
			a0 = (1-t)*p0 + t*p1;
			a1 = (1-t)*p1 + t*p2;
			a2 = (1-t)*p2 + t*p3;
			// step 2
			b0 = (1-t)*a0 + t*a1;
			b1 = (1-t)*a1 + t*a2;
			// step 3
			c0 = (1-t)*b0 + t*b1;
			
			// check if calculation is sufficient for left side
			if(Math.tan(Math.abs(p1[1] - p0[1])/absMath.abs(p1[0] - p0[0]))){
				paintPolygon(p0, a0, b0, c0, this.randomColor(), 1);
				return;
			} else {
				// left side polygon
				this.bezier_recursive();				
			
			// check if calculation is sufficient for right side}
			if()
				paintPolygon(p0, p1, p2, p3, this.randomColor(), 1);{
				return false;
			} else {
				// right side polygon
				this.bezier_recursive();				
			}						
		}	*/
	};
	
	BezierCurve.prototype.paintPolygon = function(p0, p1, p2, p3, style, width){
		// paint polygon path
		this.context.beginPath();
		this.context.moveTo(p0[0], p0[1]);
		this.context.lineTo(p1[0], p1[1]);
		this.context.lineWidth   = width;
		this.context.strokeStyle = style;
		this.context.stroke();	
		
		this.context.beginPath();
		this.context.moveTo(p1[0], p1[1]);
		this.context.lineTo(p2[0], p2[1]);
		this.context.lineWidth   = width;
		this.context.strokeStyle = style;
		this.context.stroke();	
		
		this.context.beginPath();
		this.context.moveTo(p2[0], p2[1]);
		this.context.lineTo(p3[0], p3[1]);		
		this.context.lineWidth   = width;
		this.context.strokeStyle = style;
		this.context.stroke();	
	};
	
	BezierCurve.prototype.randomColor = function() {
        // convert a byte (0...255) to a 2-digit hex string
        var toHex2 = function(byte) {
            var s = byte.toString(16); // convert to hex string
            if(s.length == 1) s = "0"+s; // pad with leading 0
            return s;
        };
            
        var r = Math.floor(Math.random()*25.9)*10;
        var g = Math.floor(Math.random()*25.9)*10;
        var b = Math.floor(Math.random()*25.9)*10;
            
        // convert to hex notation
        return "#"+toHex2(r)+toHex2(g)+toHex2(b);
    };
	
    // this module only exports the constructor for BezierCurve objects
    return BezierCurve;

})); // define

    
