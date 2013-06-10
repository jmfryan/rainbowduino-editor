var events = require("events");
var serialport = require("serialport");

var SerialPort = serialport.SerialPort; // localize object constructor
var serial;

var queue = [];
var waiting = false;

function processNextQueueItem() {
    var item = queue.shift();
    
    if(item == null)
    {
        waiting = true;
        return;
    }

    serial.write(item);
}

function push(item)
{
    queue.push(item);
    if(waiting)
    {
        waiting = false;
        processNextQueueItem();   
    }
}

function MatrixDisplay() {
    events.EventEmitter.call(this);
    serial = new SerialPort("/dev/tty.usbserial-AH00MOA4");
    
    serial.on( "data", function( chunk ) { 
        chunk = "" + chunk;

        var parts = chunk.split('\n');

        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];

            if(part == 1)
                processNextQueueItem();
        }
    });
};

var START_GRAPHIC = 0, 
    END_GRAPHIC = 1,
    SET_PIXEL = 2;

var start_graphic = function() {
    var buf = new Buffer(2);
    buf.writeInt8(2, 0);
    buf.writeInt8(START_GRAPHIC, 1);
    push(buf);
};

var end_graphic = function() {
    var buf = new Buffer(2);
    buf.writeInt8(2, 0);
    buf.writeInt8(END_GRAPHIC, 1);
    push(buf);
};

var set_pixel = function(x, y, r, g, b) {
    if(x < 0 || x > 7) throw "X value out of range. Value: " + x;
    if(y < 0 || y > 7) throw "Y value out of range. Value: " + y;
    if(r < 0 || r > 255) throw "Red value out of range. Value: " + r;
    if(g < 0 || g > 255) throw "Green value out of range. Value: " + g;
    if(b < 0 || b > 255) throw "Blue value out of range. Value: " + b;

    var buf = new Buffer(7);
    buf.writeInt8(7, 0);
    buf.writeInt8(SET_PIXEL, 1);
    buf.writeInt8(x, 2);
    buf.writeInt8(y, 3);
    buf.writeUInt8(r, 4);
    buf.writeUInt8(g, 5);
    buf.writeUInt8(b, 6);
    push(buf);
}

function hex2rgb(hex) {
    if(typeof(hex) === 'number')
        hex = hex.toString(16);

    if(hex.charAt(0) == "#") hex = hex.slice(1); //Remove the '#' char - if there is one.
    hex = hex.toUpperCase();
    var hex_alphabets = "0123456789ABCDEF";
    var value = new Array(3);
    var k = 0;
    var int1,int2;
    for(var i=0;i<6;i+=2) {
        int1 = hex_alphabets.indexOf(hex.charAt(i));
        int2 = hex_alphabets.indexOf(hex.charAt(i+1)); 
        value[k] = (int1 * 16) + int2;
        k++;
    }
    return(value);
}

MatrixDisplay.super_ = events.EventEmitter;

MatrixDisplay.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: MatrixDisplay,
        enumerable: false
    }
});

MatrixDisplay.prototype.renderImage = function (display) {
    start_graphic();

    for(var y = 0; y < display.length; y++) {
        for(var x = 0; x < display[y].length; x++){
            var hex = hex2rgb(display[y][x])
            set_pixel(x, y, hex[0], hex[1], hex[2]);
        }
    }

    end_graphic();
}

module.exports.MatrixDisplay = MatrixDisplay;