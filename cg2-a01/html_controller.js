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
         * event handler for "new BezierCurve".
         */
        $("#btnBezierCurve").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
			
			// just for dev, points should come from user input
			var points = [[100, 100], [150, 50], [150, 150], [200, 100]];
			var t = 0.5;
			var showControlPolygons = true;
			var tickMarkStyle = null;
					
            var bezierCurve = new BezierCurve(points, t, style, tickMarkStyle, showControlPolygons);
            scene.addObjects([bezierCurve]);
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(bezierCurve); // this will also redraw
                        
        }));
		
       /*
         * event handler for "new ParametricCurve".
         */
        $("#btnParametricCurve").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };

			var f = function(t) { return 350 + (100 * Math.sin(t)); } 
			var g = function(t) { return 150 + (100 * Math.cos(t)); } 			
					
            var parametricCurve = new ParametricCurve(f, g, 0, 5, 20, style);
            scene.addObjects([parametricCurve]);
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(parametricCurve); // this will also redraw
                        
        }));
        
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

        /*$("#width").change((function(e) {
			sceneController.onObjChange(function(){
				var obj = sceneController.getSelectedObject();
				obj.style.width = $('#width').val();
				// deselect all objects, then select the newly created object
				sceneController.deselect();
				sceneController.select(obj); // this will also redraw
			});
        }));

        $("#color").change((function(e) {
			var val = $(this).val();
			console.log("foo")
			sceneController.onObjChange(function(val){
				var obj = sceneController.getSelectedObject();
				obj.style.color = val;
				// deselect all objects, then select the newly created object
				sceneController.deselect();
				sceneController.select(obj); // this will also redraw
			}, val);
        }));*/
		
		sceneController.onSelection(function(obj){
			$('#color').val(obj.style.color);
			$('#width').val(obj.style.width);
			if(obj.radius){
				if($('#radius').parent().is(':hidden')){
					$('#radius').parent().show();
				}
				$('#radius').val(obj.radius);
			} else {
				$('#radius').parent().hide();
			}
		});
		
		$(document).delegate(document, 'mousedragcircle', function(e, radius){
			console.log("drag")
			$('#radius').val(radius);
		});
		
        $(document).delegate('.changeobj', 'change', function(e){
			var val = $(this).val(),
				id = $(this).attr('id');
			sceneController.onObjChange(function(params){
				var obj = sceneController.getSelectedObject();
				if(id == "radius"){
					obj[params.id] = params.val;
				} else {
					obj.style[params.id] = params.val;
				}
				// deselect all objects, then select the newly created object
				sceneController.deselect();
				sceneController.select(obj); // this will also redraw
			}, {val: val, id: id});
        });
		
        /*$(".changeobj").change((function(e) {
			var val = $(this).val(),
				id = $(this).attr('id');
				console.log("f00", val)
			sceneController.onObjChange(function(params){
				var obj = sceneController.getSelectedObject();
				obj.style[params.id] = params.val;
				// deselect all objects, then select the newly created object
				sceneController.deselect();
				sceneController.select(obj); // this will also redraw
			}({val: val, id: id}));
        }));*/
    
    };

    // return the constructor function 
    return HtmlController;


})); // require 