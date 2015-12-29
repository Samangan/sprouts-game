

;(function (root) {
    var SproutsGame = root.SproutsGame = root.SproutsGame || {};

    var Edge = SproutsGame.Edge = function (currentEdgeBuffer) {
        this.pixelWayPoints = currentEdgeBuffer.pixelBuffer;
        this.sourceNode = currentEdgeBuffer.sourceNode;
        this.destinationNode = currentEdgeBuffer.destinationNode;

        this.sourceNode.addEdge(this);
        this.destinationNode.addEdge(this);
    };

    Edge.prototype.draw = function (context, edgeContext) {
        for (var i = 0; i < this.pixelWayPoints.length - 2; i++) {
            context.strokeStyle = 'teal';
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(this.pixelWayPoints[i].x, this.pixelWayPoints[i].y);
            context.lineTo(this.pixelWayPoints[i+1].x, this.pixelWayPoints[i+1].y);
            context.stroke();

            // Mark this edge in the edgeCanvas (The edgeCanvas is just used to do edge-only collision detection)
            edgeContext.strokeStyle = 'green';
            edgeContext.lineWidth = 3;
            edgeContext.beginPath();
            edgeContext.moveTo(this.pixelWayPoints[i].x, this.pixelWayPoints[i].y);
            edgeContext.lineTo(this.pixelWayPoints[i+1].x, this.pixelWayPoints[i+1].y);
            edgeContext.stroke();
        }
    };


    Edge.prototype.getPixelWaypoints = function () {
        return this.pixelWayPoints;
    };


    Edge.prototype.getSourceNode = function () {
        return this.sourceNode;
    };


    Edge.prototype.splitEdgeIntoTwoEdges = function (newNode, midpointOfEdge) {
        // sourceDesinationNode <---(this) existingEdge---> destinationNode
        //                            becomes
        // sourceDesinationNode <---edge1---> newNode <---edge2--->  destinationNode

        var tempLineBuffer = new SproutsGame.CurrentEdgeBuffer(); 
        tempLineBuffer.associateSourceNode(newNode);
        tempLineBuffer.associateDestinationNode(this.destinationNode);
        tempLineBuffer.setPixelBuffer(this.pixelWayPoints.slice(midpointOfEdge, this.pixelWayPoints.length));


        this.pixelWayPoints = this.pixelWayPoints.slice(0, midpointOfEdge);
        this.destinationNode.removeEdge(this);
        this.destinationNode = newNode;
        this.destinationNode.addEdge(this);   

        return new SproutsGame.Edge(tempLineBuffer);
    };


})(window);
