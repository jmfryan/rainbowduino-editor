var MatrixDisplay = require("./matrix_display.js").MatrixDisplay;


var display = new MatrixDisplay("/dev/tty.usbserial-AH00MOA4", 9600);

var write_colour = function() {
    var c = Math.floor(Math.random() * 0xFFFFFF);
    
    display.renderImage([
        [c, c, c, c, c, c, c, c],
        [c, c, c, c, c, c, c, c],
        [c, c, c, c, c, c, c, c],
        [c, c, c, c, c, c, c, c],
        [c, c, c, c, c, c, c, c],
        [c, c, c, c, c, c, c, c],
        [c, c, c, c, c, c, c, c],
        [c, c, c, c, c, c, c, c]
    ]);

    setTimeout(write_colour, 1000);
}

write_colour();
