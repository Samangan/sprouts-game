
;(function (root) {
    var SproutsGame = root.SproutsGame = root.SproutsGame || {};

    var CurrentEdgeBuffer = SproutsGame.CurrentEdgeBuffer = function () {
		this.pixelBuffer = [];
		this.sourceNode = {};
		this.destinationNode = {};
    };

    CurrentEdgeBuffer.prototype.draw = function (context) {
        _.each(this.pixelBuffer, function(pixel) {
            context.fillStyle = SproutsGame.Utility.getRandomColor();
            context.lineWidth = 1;
            context.beginPath(); 
            context.fillRect(pixel.x, pixel.y, 8, 8);
            context.stroke();    
        });
    };

    CurrentEdgeBuffer.prototype.associateSourceNode = function (sourceNode) {
    	this.sourceNode = sourceNode;
    };

    CurrentEdgeBuffer.prototype.associateDestinationNode = function (destinationNode) {
        this.destinationNode = destinationNode;
    };


    CurrentEdgeBuffer.prototype.setPixelBuffer = function (pixelBuffer) {
        this.pixelBuffer = pixelBuffer;
    };

    CurrentEdgeBuffer.prototype.pushNewPixel = function (pixelPosition) {
        this.pixelBuffer.push(pixelPosition)
    };

    CurrentEdgeBuffer.prototype.getPixelBuffer = function () {
		return this.pixelBuffer;
    };

    CurrentEdgeBuffer.prototype.getSourceNode = function () {
		return this.sourceNode;
    };


})(window);
