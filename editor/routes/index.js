var GraphicEditModel = require('../model/graphic_edit_model.js').GraphicEditModel;
var MatrixDisplay = require('../model/matrix_display.js').MatrixDisplay;

var display = new MatrixDisplay("/dev/tty.usbserial-AH00MOA4", 9600);

exports.index = function(req, res){
    res.render('index', new GraphicEditModel());
};

function rgb2hex(rgb) {
    rgb = rgb.match(/^a?rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("00" + parseInt(x).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function pad(n, len) {
  s = n.toString();
  if (s.length < len) {
      s = ('0000000000' + s).slice(-len);
  }

  return s;
}

exports.updateDisplay = function (req, res) {
    var colours = JSON.parse(req.body['grid-colours']);
    console.log(colours);

    var model = new GraphicEditModel();
    
    for(var y = 0; y < colours.length; y++) {
        for(var x = 0; x < colours[y].length; x++) {
            colours[y][x] = rgb2hex(colours[y][x]);
            model.colours[y][x] = colours[y][x];
        }        
    }

    console.log(colours);

    display.renderImage(colours);
    res.render('index', model);
};