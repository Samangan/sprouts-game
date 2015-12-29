
;(function (root) {
    var SproutsGame = root.SproutsGame = root.SproutsGame || {};

    var Node = SproutsGame.Node = function (initialState) {
        this.color = initialState.color || SproutsGame.Utility.getRandomColor();
        this.position = initialState.position || { x: 1, y: 1 }; // TODO: generate random starting place as the default

        this.width = initialState.width || 20;
        this.height = initialState.height  || 20;

        this.edges = initialState.edges || [];
    };

    Node.prototype.draw = function (context) {
        // For debug purposes I should write the color name next to each node.
        context.fillStyle = this.color;
        context.font = "12px Arial";
        context.fillText(this.color, this.position.x - 2, this.position.y -2);


        // TODO: Nodes should be circles, not rectangles
        context.fillStyle = this.color;
        context.lineWidth = 1;
        context.beginPath();           
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        context.stroke();    
    };

    Node.prototype.isClicked = function (context, clickedPosition) {
        var x = clickedPosition.x;
        var y = clickedPosition.y;

        if (y > this.position.y && y < this.position.y + this.height && x > this.position.x && x < this.position.x + this.height) {
            return true;
        }
        return false;
    };

    Node.prototype.addEdge = function (edge) {
        this.edges.push(edge);
    };

    Node.prototype.getEdges = function (edge) {
        return this.edges;
    };

    Node.prototype.removeEdge = function (edge) {

        for (var i = this.edges.length; i >= 0; i--) {
            if (edge === this.edges[i]) {
                this.edges.splice(i, 1);
            }
        }
    };


    Node.prototype.getDimensions = function (edge) {
        return [this.width, this.height];
    };


})(window);
