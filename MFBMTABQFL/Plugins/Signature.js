//function signatureCapture() {
//    var canvas = document.getElementById("newSignature");
//    var context = canvas.getContext("2d");
//    canvas.width = 500;
//    canvas.height = 400;
//    context.fillStyle = "#fff";
//    context.strokeStyle = "#444";
//    context.lineWidth = 5;
//    context.lineCap = "round";
//    context.fillRect(0, 0, canvas.width, canvas.height);
//    var disableSave = true;
//    var pixels = [];
//    var cpixels = [];
//    var xyLast = {};
//    var xyAddLast = {};
//    var calculate = false;
//    {   //functions
//        function remove_event_listeners() {
//            canvas.removeEventListener('mousemove', on_mousemove, false);
//            canvas.removeEventListener('mouseup', on_mouseup, false);
//            canvas.removeEventListener('touchmove', on_mousemove, false);
//            canvas.removeEventListener('touchend', on_mouseup, false);

//            document.body.removeEventListener('mouseup', on_mouseup, false);
//            document.body.removeEventListener('touchend', on_mouseup, false);
//        }

//        function get_coords(e) {
//            var x, y;

//            if (e.changedTouches && e.changedTouches[0]) {
//                var offsety = canvas.offsetTop || 0;
//                var offsetx = canvas.offsetLeft || 0;

//                x = e.changedTouches[0].pageX - offsetx;
//                y = e.changedTouches[0].pageY - offsety;
//            } else if (e.layerX || 0 == e.layerX) {
//                x = e.layerX;
//                y = e.layerY;
//            } else if (e.offsetX || 0 == e.offsetX) {
//                x = e.offsetX;
//                y = e.offsetY;
//            }

//            return {
//                x: x, y: y
//            };
//        };

//        function on_mousedown(e) {
//            e.preventDefault();
//            e.stopPropagation();

//            canvas.addEventListener('mouseup', on_mouseup, false);
//            canvas.addEventListener('mousemove', on_mousemove, false);
//            canvas.addEventListener('touchend', on_mouseup, false);
//            canvas.addEventListener('touchmove', on_mousemove, false);
//            document.body.addEventListener('mouseup', on_mouseup, false);
//            document.body.addEventListener('touchend', on_mouseup, false);

//            empty = false;
//            var xy = get_coords(e);
//            context.beginPath();
//            pixels.push('moveStart');
//            context.moveTo(xy.x, xy.y);
//            pixels.push(xy.x, xy.y);
//            xyLast = xy;
//        };

//        function on_mousemove(e, finish) {
//            e.preventDefault();
//            e.stopPropagation();

//            var xy = get_coords(e);
//            var xyAdd = {
//                x: (xyLast.x + xy.x) / 2,
//                y: (xyLast.y + xy.y) / 2
//            };

//            if (calculate) {
//                var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
//                var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
//                pixels.push(xLast, yLast);
//            } else {
//                calculate = true;
//            }

//            context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
//            pixels.push(xyAdd.x, xyAdd.y);
//            context.stroke();
//            context.beginPath();
//            context.moveTo(xyAdd.x, xyAdd.y);
//            xyAddLast = xyAdd;
//            xyLast = xy;

//        };

//        function on_mouseup(e) {
//            remove_event_listeners();
//            disableSave = false;
//            context.stroke();
//            pixels.push('e');
//            calculate = false;
//        };
//    }
//    canvas.addEventListener('touchstart', on_mousedown, false);
//    canvas.addEventListener('mousedown', on_mousedown, false);
//}



function signatureCapture() {
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimaitonFrame ||
            function (callback) {
                //window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Set up the canvas
    var canvas = document.getElementById("newSignature");
    var ctx = canvas.getContext("2d");


    canvas.width = 500;
    canvas.height = 400;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ctx.strokeStyle = "#222222";
    //ctx.lineWith = 2;
    var clearBtn
    clearBtn = document.getElementById("btnOtherClearid");
    //clearBtn = document.getElementById("btnSubmitOtherSite");
    //clearBtn.addEventListener("click", function (e) {
    //    clearCanvas();

    //}, false);


    // Set up mouse events for drawing
    var drawing = false;
    var mousePos = { x: 0, y: 0 };
    var lastPos = mousePos;
    canvas.addEventListener("mousedown", function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        drawing = false;
    }, false);
    canvas.addEventListener("mousemove", function (e) {
        mousePos = getMousePos(canvas, e);
    }, false);

    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    // Get the position of the mouse relative to the canvas
    function getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
    }

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    // Draw to the canvas
    function renderCanvas() {
        if (drawing) {

            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 5;

            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            lastPos = mousePos;
        }
    }

    // Clear the canvas
    function clearCanvas() {
        canvas.width = canvas.width;
    }

    // Allow for animation
    (function drawLoop() {
        requestAnimFrame(drawLoop);
        renderCanvas();
    })();

}



function signatureCapture1() {
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimaitonFrame ||
            function (callback) {
                //window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Set up the canvas
    var canvas = document.getElementById("newSignature1");
    var ctx = canvas.getContext("2d");


    canvas.width = 450;
    canvas.height = 350;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ctx.strokeStyle = "#222222";
    //ctx.lineWith = 2;
    var clearBtn
    clearBtn = document.getElementById("btnOtherClearid");
    //clearBtn = document.getElementById("btnSubmitOtherSite");
    //clearBtn.addEventListener("click", function (e) {
    //    clearCanvas();
      
    //}, false);
   
  
    // Set up mouse events for drawing
    var drawing = false;
    var mousePos = { x: 0, y: 0 };
    var lastPos = mousePos;
    canvas.addEventListener("mousedown", function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        drawing = false;
    }, false);
    canvas.addEventListener("mousemove", function (e) {
        mousePos = getMousePos(canvas, e);
    }, false);

    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    // Get the position of the mouse relative to the canvas
    function getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
    }

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    // Draw to the canvas
    function renderCanvas() {
        if (drawing) {
           
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 5;
           
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            lastPos = mousePos;
        }
    }

    // Clear the canvas
    function clearCanvas() {
        canvas.width = canvas.width;
    }

    // Allow for animation
    (function drawLoop() {
       requestAnimFrame(drawLoop);
        renderCanvas();
    })();

}



function signatureCapture1Damage() {
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimaitonFrame ||
            function (callback) {
                //window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Set up the canvas
    var canvas = document.getElementById("newSignature1Damage");
    var ctx = canvas.getContext("2d");


    canvas.width = 450;
    canvas.height = 350;
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ctx.strokeStyle = "#222222";
    //ctx.lineWith = 2;
    var clearBtn
    clearBtn = document.getElementById("btnOtherClearidDamage");
    //clearBtn = document.getElementById("btnSubmitOtherSite");
    //clearBtn.addEventListener("click", function (e) {
    //    clearCanvas();

    //}, false);


    // Set up mouse events for drawing
    var drawing = false;
    var mousePos = { x: 0, y: 0 };
    var lastPos = mousePos;
    canvas.addEventListener("mousedown", function (e) {
        drawing = true;
        lastPos = getMousePos(canvas, e);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        drawing = false;
    }, false);
    canvas.addEventListener("mousemove", function (e) {
        mousePos = getMousePos(canvas, e);
    }, false);

    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    // Get the position of the mouse relative to the canvas
    function getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
    }

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    // Draw to the canvas
    function renderCanvas() {
        if (drawing) {

            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#444";
            ctx.lineWidth = 5;

            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            lastPos = mousePos;
        }
    }

    // Clear the canvas
    function clearCanvas() {
        canvas.width = canvas.width;
    }

    // Allow for animation
    (function drawLoop() {
        requestAnimFrame(drawLoop);
        renderCanvas();
    })();

}
   

        // Get a regular interval for drawing to the screen

