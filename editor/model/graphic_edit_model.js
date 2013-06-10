
var GraphicEditModel = function(colours) {
    var default_colour = '#000000';
    this.width = 8;
    this.height = 8;

    this.colours = [];

    for (var y = 0; y < this.height; y++) {
        this.colours.push([]);

        for (var x = 0; x < this.width; x++) {
            this.colours[y].push(default_colour);
        };        
    };
};

module.exports.GraphicEditModel = GraphicEditModel;