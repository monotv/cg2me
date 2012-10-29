/*
 * (C)opyright team ifndef
 *
 * Module: BezierCurve
 *
 * A BezierCurve knows how to draw itself into a specified 2D context,
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
     *  - showControlPolygons: show showControlPolygons if true, else hide.
     */ 

    var BezierCurve = function(points, t, style, showControlPolygons, steps, controlStyle) {

        console.log("creating BezierCurve.");
        this.steps = steps || 5;
        // settings
		this.points = points || [[100, 100], [150, 50], [150, 150], [200, 100]];
		this.t = t || 0.5;
		this.showTickMarks = true;
		this.showControlPolygons = showControlPolygons;

		// draw style for drawing the bezier curve
        this.style = style || {  
            width: 2,
            color: '#ff0000'
        }

        this.controlStyle = controlStyle || {  
            width: 2,
            color: '#cccccc'
        }

		// draw style of drawing the tick mark
		this.tickMarkStyle = {
			width: 1,
			color: '#ff0000',
			len: 0.2
		}    
    };

    // draw this line into the provided 2D rendering context
    BezierCurve.prototype.draw = function(context) {
        // draw
		this.context = context;
        this.bezier_recursive(this.points[0], this.points[1], this.points[2], this.points[3], this.t, 0);
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
    
    // return list of draggers to manipulate this curve
    BezierCurve.prototype.createDraggers = function() {

        var draggerStyle = { radius:4, color: this.controlStyle.color, width:0, fill:true }
        var draggers = [];
        
        // create closure and callbacks for dragger
        var _bezierCurve = this;
        var getP0 = function() { return _bezierCurve.points[0]; };
        var getP1 = function() { return _bezierCurve.points[1]; };
		var getP2 = function() { return _bezierCurve.points[2]; };
		var getP3 = function() { return _bezierCurve.points[3]; };
		
        var setP0 = function(dragEvent) { _bezierCurve.points[0] = dragEvent.position; };
        var setP1 = function(dragEvent) { _bezierCurve.points[1] = dragEvent.position; };
		var setP2 = function(dragEvent) { _bezierCurve.points[2] = dragEvent.position; };
		var setP3 = function(dragEvent) { _bezierCurve.points[3] = dragEvent.position; };
        draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
        draggers.push( new PointDragger(getP1, setP1, draggerStyle) );
		draggers.push( new PointDragger(getP2, setP2, draggerStyle) );
		draggers.push( new PointDragger(getP3, setP3, draggerStyle) );
        
        return draggers;

    };

	// return list of tick marks of the parametric curve
    BezierCurve.prototype.createTickMarks = function() {

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
		for(var i = 0;i<this.segments;i++){
			t = (this.maxT/this.segments)*(i+1);
			tickMarks.push(new TickMark(this.points[i], [[this.fx(t-0.1), this.fy(t-0.1)], [this.fx(t+0.1), this.fy(t+0.1)]], tickMarkStyle));
		}

		// return tick marks array
        return tickMarks;

    };
    /**
     *  A BezierCurve - Calculates curve recursive-adaptive with casteljau algorithm.
     *  Parameters:
     *  - points: p0, p1, p2, p3 for the first polygon.
	 *	- t: parameter we use as starting value for the casteljau algorithm.
     *  - step: which step
     */ 	
	
	BezierCurve.prototype.bezier_recursive = function(p0, p1, p2, p3, t, step){
		console.log(step)
		step != null ? step++ : "";
		
		var a0, a1, a2, b0, b1, c0;
		// calculate new polygons
		
		if(this.showControlPolygons){
			// paint control polygon
			this.drawPolygon(p0, p1, p2, p3, this.randomColor(), 1);
			//console.log("control")
		}			
		// step 1
		//(1-t)*p1 + t*p2;
		a0 = vec2.add([(1-t)*p0[0], (1-t)*p0[1]],[t*p1[0], t*p1[1]]);
		a1 = vec2.add([(1-t)*p1[0], (1-t)*p1[1]],[t*p2[0], t*p2[1]]);
		a2 = vec2.add([(1-t)*p2[0], (1-t)*p2[1]],[t*p3[0], t*p3[1]]);
		// step 2
		b0 = vec2.add([(1-t)*a0[0], (1-t)*a0[1]],[t*a1[0], t*a1[1]]);
		b1 = vec2.add([(1-t)*a1[0], (1-t)*a1[1]],[t*a2[0], t*a2[1]]);
		// step 3
		c0 = vec2.add([(1-t)*b0[0], (1-t)*b0[1]],[t*b1[0], t*b1[1]]);
		
		var vec = this.getVectors(p0, a0, b0, c0);
		var deg = [this.getDegree(vec[0], vec[1]), this.getDegree(vec[1], vec[2])];								

		// check if calculation is sufficient for left side
		if (step && step == this.steps){
			this.drawPolygon(p0, a0, b0, c0, this.style.color, this.style.width);
		} else {
			// left side polygon
			this.bezier_recursive(p0, a0, b0, c0, t, step);
		}				
		
		vec = this.getVectors(c0, b1, a2, p3);
		deg = [this.getDegree(vec[0], vec[1]), this.getDegree(vec[1], vec[2])];		
		
		// check if calculation is sufficient for right side}
		if(step == this.steps){
			this.drawPolygon(c0, b1, a2, p3, this.style.color, this.style.width);
		} else {
			// right side polygon
			this.bezier_recursive(c0, b1, a2, p3, t, step);				
		}				
	};
	
	BezierCurve.prototype.getVectors = function(p0, p1, p2, p3){
		var vectors = [
			[p1[0] - p0[0], p1[1] - p0[1]],
			[p2[0] - p1[0], p2[1] - p1[1]],
			[p3[0] - p2[0], p3[1] - p2[1]]
		];
		return vectors;
	};	

	// calculating the degree of two vectors
	BezierCurve.prototype.getDegree = function(v1, v2){
		var foo = Math.abs(((v1[0]*v2[0])+(v1[1]*v2[1])) / (Math.sqrt((v1[0]*v1[0]) + (v1[1]*v1[1])) * Math.sqrt((v2[0]*v2[0]) + (v2[1]*v2[1]))));
		return (Math.acos(foo)* 180 )/Math.PI;
	};

	// draws a polygon
	BezierCurve.prototype.drawPolygon = function(p0, p1, p2, p3, style, width){
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

	// generating a random color
	BezierCurve.prototype.randomColor = function() {
        // convert a byte (0...255) to a 2-digit hex string
        var toHex2 = function(byte){
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