/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve", "bezier_curve"], 
       (function($, StraightLine, Circle, ParametricCurve, BezierCurve) {

    "use strict"; 

    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {

        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };

        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };

        // generate random color in hex notation
        var randomColor = function() {

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
        
        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click( (function() {

            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };

            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw

        }));

        /*
         * event handler for "new circle button".
         */
        $("#btnCircle").click( (function() {

            // create the actual circle and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var circle = new Circle( [randomX(),randomY()], 
                                         context.canvas.width / 2, 
                                         style);
            scene.addObjects([circle]);
			
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));

		/*
         * event handler for "new parametric curve button".
         */
        $("#btnParametricCurve").click( (function() {
        
            // create the actual curve and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };

			var f = "350 + (100 * Math.sin(t))";
			var g = "150 + (100 * Math.cos(t))";

            var parametricCurve = new ParametricCurve(f, g, 0, 5, 20, style);
            scene.addObjects([parametricCurve]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(parametricCurve); // this will also redraw

        }));

		/*
         * event handler for "new bezier curve button".
         */
        $("#btnBezierCurve").click( (function() {
        
            // create the actual curve and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
			
			// just for dev, points should come from user input
			var points = [[100, 100], [150, 50], [150, 150], [200, 100]];
			var t = 0.5;
			var showControlPolygons = false;
			var steps = 5;
					
            var bezierCurve = new BezierCurve(points, t, style, showControlPolygons, steps, null);
            scene.addObjects([bezierCurve]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(bezierCurve); // this will also redraw

        }));

		/*
         * event handler for selecting an object, getting its attribute values
         */
		sceneController.onSelection(function(obj){

			// clear selected object list if exists
			if ($('#modifyList').length > 0) {
				$('#modifyList').html('');
			}
			// append selected object list if doesn't exist
			else {
				$('#selectedObject').append('<h3>Selected Object:</h3><ul id="modifyList"></ul>');
			}
			// if selected obj is a StraightLine
			if (obj instanceof StraightLine) {
				$('#modifyList').append('<li><label name="color">Color</label><input class="changeobj" id="color" type="color" /></li>');
				$('#modifyList').append('<li><label name="width">Line width</label><input class="changeobj" id="width" type="number" /></li>');
				$('#color').val(obj.style.color);
				$('#width').val(obj.style.width);
			}
			// if selected obj is a Circle
			else if (obj instanceof Circle) {
				$('#modifyList').append('<li><label name="color">Color:</label><input class="changeobj" id="color" type="color" /></li>');
				$('#modifyList').append('<li><label name="width">Line width:</label><input class="changeobj" id="width" type="number" /></li>');
				$('#modifyList').append('<li><label name="radius">Radius:</label><input class="changeobj" id="radius" type="number" /></li>');
				$('#color').val(obj.style.color);
				$('#width').val(obj.style.width);
				$('#radius').val(obj.radius);
			}
			// if selected obj is a ParametricCurve
			else if (obj instanceof ParametricCurve) {
				$('#modifyList').append('<li><label name="color">Color:</label><input class="changeobj" id="color" type="color" /></li>');
				$('#modifyList').append('<li><label name="width">Line width:</label><input class="changeobj" id="width" type="number" /></li>');
				$('#modifyList').append('<li><label name="fx">x(t):</label><input class="changeobj" id="fx" type="text" /></li>');
				$('#modifyList').append('<li><label name="fy">y(t):</label><input class="changeobj" id="fy" type="text" /></li>');
				$('#modifyList').append('<li><label name="minT">min t:</label><input class="changeobj" id="minT" type="number" /></li>');
				$('#modifyList').append('<li><label name="maxT">max t:</label><input class="changeobj" id="maxT" type="number" /></li>');
				$('#modifyList').append('<li><label name="segments">Segments:</label><input class="changeobj" id="segments" type="number" /></li>');
				$('#modifyList').append('<li><label name="showTickMarks">Tick marks:</label><input class="changeobj" id="showTickMarks" type="checkbox" /></li>');
				$('#color').val(obj.style.color);
				$('#width').val(obj.style.width);
				$('#fx').val(obj.fx);
				$('#fy').val(obj.fy);
				$('#minT').val(obj.minT);
				$('#maxT').val(obj.maxT);
				$('#segments').val(obj.segments);
				$('#showTickMarks').prop('checked', obj.showTickMarks);
			}
			// if selected obj is a BezierCurve
			else if(obj instanceof BezierCurve) {
				$('#modifyList').append('<li><label name="color">Color:</label><input class="changeobj" id="color" type="color" /></li>');
				$('#modifyList').append('<li><label name="width">Line width:</label><input class="changeobj" id="width" type="number" /></li>');
				$('#modifyList').append('<li><label name="t">t:</label><input class="changeobj" id="t" type="number" /></li>');
				$('#modifyList').append('<li><label name="p0x">p0x:</label><input class="changeobj" id="p0x" type="number" /></li>');
				$('#modifyList').append('<li><label name="p0y">p0y:</label><input class="changeobj" id="p0y" type="number" /></li>');
				$('#modifyList').append('<li><label name="p1x">p1x:</label><input class="changeobj" id="p1x" type="number" /></li>');
				$('#modifyList').append('<li><label name="p1y">p1y:</label><input class="changeobj" id="p1y" type="number" /></li>');
				$('#modifyList').append('<li><label name="p2x">p2x:</label><input class="changeobj" id="p2x" type="number" /></li>');
				$('#modifyList').append('<li><label name="p2y">p2y:</label><input class="changeobj" id="p2y" type="number" /></li>');
				$('#modifyList').append('<li><label name="p3x">p3x:</label><input class="changeobj" id="p3x" type="number" /></li>');
				$('#modifyList').append('<li><label name="p3y">p3y:</label><input class="changeobj" id="p3y" type="number" /></li>');
				$('#modifyList').append('<li><label name="steps">Steps:</label><input class="changeobj" id="steps" type="number" /></li>');
				$('#color').val(obj.style.color);
				$('#width').val(obj.style.width);
				$('#t').val(obj.t);
				$('#p0x').val(obj.points[0][0]);
				$('#p0y').val(obj.points[0][1]);
				$('#p1x').val(obj.points[1][0]);
				$('#p1y').val(obj.points[1][1]);
				$('#p2x').val(obj.points[2][0]);
				$('#p2y').val(obj.points[2][1]);
				$('#p3x').val(obj.points[3][0]);
				$('#p3y').val(obj.points[3][1]);
				$('#steps').val(obj.steps);
				$('#modifyList').append('<li><label name="showControlPolygons">Show control polygons:</label><input class="changeobj" id="showControlPolygons" type="checkbox" /></li>');
				$('#showControlPolygons').prop('checked', obj.showControlPolygons);
				$('#modifyList').append('<li><label name="showTickMarks">Tick marks:</label><input class="changeobj" id="showTickMarks" type="checkbox" /></li>');
				$('#showTickMarks').prop('checked', obj.showTickMarks);

			}

		});

		/*
         * event handler for dragging a circle radius, updating its value
         */
		$(document).delegate(document, 'mousedragcircle', function(e, radius){

			console.log("drag");
			$('#radius').val(radius);

		});

		/*
         * event handler for changing an objects attributes
         */
        $(document).delegate('.changeobj', 'change', function(e){

			var val;
			var id = $(this).attr('id');
			if ($(this).attr('type') == "checkbox") {
				val = $(this).is(':checked');
			}
			else {
				val = $(this).val();
			}
			sceneController.onObjChange(function(args){
				var obj = sceneController.getSelectedObject();
				switch (id) {
					case "radius":
						obj[args.id] = parseFloat(args.val);
						break;
					case "color":
					case "width":
						obj.style[args.id] = args.val;
						break;
					case "p0x":
						obj.points[0][0] = args.val;
						break;
					case "p0y":
						obj.points[0][1] = args.val;
						break;
					case "p1x":
						obj.points[1][0] = args.val;
						break;
					case "p1y":
						obj.points[1][1] = args.val;
						break;
					case "p2x":
						obj.points[2][0] = args.val;
						break;
					case "p2y":
						obj.points[2][1] = args.val;
						break;
					case "p3x":
						obj.points[3][0] = args.val;
						break;
					case "p3y":
						obj.points[3][1] = args.val;
						break;
					case "steps":				
						obj.steps = args.val;
						break;						
					default:
						obj[args.id] = args.val;
						break;
				}

				// deselect all objects, then select the newly created object
				sceneController.deselect();
				sceneController.select(obj);
			}, {val: val, id: id});

        });

    };

    // return the constructor function 
    return HtmlController;

})); // require
