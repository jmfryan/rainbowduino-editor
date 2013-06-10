GraphicStore = function(){};

GraphicStore.prototype.save = function(graphic) {
    for(var y = 0; y < graphic.colours.length; y++)
        for(var x = 0; x < graphic.colours[y].length; x++)
            if(!/^#[0-9A-Fa-f]{6}$/.matches(graphic.colours[y][x]))
                throw "Value " + graphic.colours[y][x] + " at position (" + x + ',' + y + ') is not valid.';
};


module.exports = GraphicStore;