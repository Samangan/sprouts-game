
;(function (root) {
    var SproutsGame = root.SproutsGame = root.SproutsGame || {};

    var Game = SproutsGame.Game = function (canvas, edgeCanvas) {
        var self = this;

        // Stuff relating to drawing the current line:
        this.IS_DRAWING_LINE = false;
        this.HAS_LEFT_SOURCE_NODE = false;  // Note: I am not currently using this flag, but I was using it when I was doing mousemove's into a node to finish an edge automatically.
        this.currentLineBuffer = new SproutsGame.CurrentEdgeBuffer();

        this.canvas = canvas;
        this.edgeCanvas = edgeCanvas;

        this.nodes = [];
        this.edges = [];

        this.players = [];
        this.currentPlayer = 0; // This is the index of the players array that stores the current playing player.
    };

    Game.prototype.step = function (context){
        // TODO: compute loss condition:
        // * loss condition:
        // * * Trivial loss: There are no 'available' nodes (at least N-1 nodes have maximum number of edges)
        // * * TODO: Non-Trivial loss: There is no path that can connect 2 available nodes without crossing itself or another line (floodfill algorithm?)

        this.draw(context);
    };
    
    Game.prototype.play = function (context) {
        var self = this;

        this.populateInitialNodes();

        this.canvas.addEventListener("mousemove", function (e) {
            var x = event.pageX - self.canvas.offsetLeft,
                y = event.pageY - self.canvas.offsetTop;
    
            if (self.IS_DRAWING_LINE) {
                console.log("mousemove event");
                console.log(x, y);

                // If the mousemoves over an existing edge: Stop the line and remove the buffer.
                // Check if this x,y is over an existing edge.
                var imgDataForCurrentClick = self.edgeCanvas.getContext("2d").getImageData(x, y, 1, 1).data;

                // TODO: DRY up these line hit checks.
                // !!! Next thing to do 
                 if (imgDataForCurrentClick[0] != 0 || imgDataForCurrentClick[1] != 0 || imgDataForCurrentClick[2] != 0 || imgDataForCurrentClick[3] != 0) {
                    console.log("LINE HIT!!");
                    stopDrawingCurrentEdge(self);
                } else {
                    // TODO: Before we push a pixel we need to do a check like if(prevClick) .. below to make sure that 
                    //       we dont draw over our own current edge (This logic should be moved into currentEdgeBuffer class probably a function called isValidNextLocation() or something)
                    self.currentLineBuffer.pushNewPixel({x, y});
                }

                var prevClick = self.currentLineBuffer.getPixelBuffer().slice(-2)[0];

                console.log(prevClick);

                if (prevClick) {
                    // we need to see if there is a line in between the prevClick and the current click.
                    _.each(SproutsGame.Utility.getAllPixelsBetweenTwoPoints(prevClick.x, prevClick.y, x, y), function (pixel) {
                        var imgDataForPixel = self.edgeCanvas.getContext("2d").getImageData(pixel.x, pixel.y, 1, 1).data;

                        if (imgDataForPixel[0] != 0 || imgDataForPixel[1] != 0 || imgDataForPixel[2] != 0 || imgDataForPixel[3] != 0) {
                            console.log("LINE HIT!!");
                            stopDrawingCurrentEdge(self);
                        }                         
                    });
                }                
            }     
        }, false);

        this.canvas.addEventListener("mousedown", function (e) {
            var x = event.pageX - self.canvas.offsetLeft,
                y = event.pageY - self.canvas.offsetTop;
    
            console.log("mousedown event");
            console.log(x, y);

            if (!self.IS_DRAWING_LINE) {
                // See if the user clicked a node.
                self.nodes.forEach(function (node) {
                    if (node.isClicked(context, {x, y})) {
                        console.log('clicked a node: ' + node);

                        if (node.getEdges().length < 3) {
                            startDrawingCurrentEdge(self, node);
                            //break;
                        } else {
                            console.log("TOO MANY EDGES FOR THIS NODE!!");
                            stopDrawingCurrentEdge(self);
                        }

                    }
                });
            }
        }, false);

        this.canvas.addEventListener("mouseup", function (e) {
            // TODO: Split this logic up into a function to DRY this all up
            var x = event.pageX - self.canvas.offsetLeft,
                y = event.pageY - self.canvas.offsetTop;

            console.log("mouseup event");
            console.log(x, y);

            if (self.IS_DRAWING_LINE) {
                // See if the user clicked a node.
                self.nodes.forEach(function (node) {
                    if (node.isClicked(context, {x, y})) {

                        var amountOfEdgesToAdd = 1;
                        if (node === self.currentLineBuffer.getSourceNode()) {
                            amountOfEdgesToAdd = 2;
                        }

                        if (node.getEdges().length + amountOfEdgesToAdd <= 3) {
                            console.log('Completing an edge! ');

                            var edge = finishDrawingAnEdge(self, node);
                            self.edges.push(edge);
                    
                            // TODO: Allow the user to place the new node somewhere on the edge (Then do the rest of the logic the same)
                            // * How am I going to do that?....
                            // * * I think there should be a new node under the cursor following it until the user clicks.
                            // * * * Then the node flashes red if it cannot be placed at the current spot (It's not on the edge or its on the edge but too close to another node)
                            //       or it places the node at that location and the rest of this logic happens.


                            // Attach a new node to the midpoint of this new edge (eventually make it user placed)
                            var midpointOfEdge = Math.floor(edge.getPixelWaypoints().length / 2);
                            var newNode = new SproutsGame.Node({
                                "position" : {
                                    x: edge.getPixelWaypoints()[midpointOfEdge].x - edge.getSourceNode().getDimensions()[0] / 2, 
                                    y: edge.getPixelWaypoints()[midpointOfEdge].y - edge.getSourceNode().getDimensions()[1] / 2
                                }
                            });

                            self.nodes.push(newNode);
                            self.edges.push(edge.splitEdgeIntoTwoEdges(newNode, midpointOfEdge));
                            self.currentLineBuffer = new SproutsGame.CurrentEdgeBuffer();
                            
                            //break;
                        } else {
                            console.log("TOO MANY EDGES FOR THIS NODE!!");
                            stopDrawingCurrentEdge(self);
                        }
                    }
                });
            }
        }, false);

        this.canvas.addEventListener("mouseout", function (e) {
            console.log("mouseout event.");
            stopDrawingCurrentEdge(self);
        }, false);

        setInterval(function () {
            self.step(context);
        }, 1000/60);
    };
    
    Game.prototype.draw = function (context) {
        var self = this;
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        _.each(this.nodes, function (node) {
            node.draw(context);
        });

        _.each(this.edges, function (edge) {
            edge.draw(context, self.edgeCanvas.getContext("2d"));
        });

        this.currentLineBuffer.draw(context);
    };

    Game.prototype.populateInitialNodes = function (numOfNodes) {
        var numOfNodes = numOfNodes || 3;

        for (var i = 0; i < numOfNodes; i++) {
            this.nodes.push(new SproutsGame.Node({
                "position" : {
                    x: Math.floor(Math.random() * (this.canvas.width - 20)) + 20, 
                    y: Math.floor(Math.random() * (this.canvas.height - 20)) + 20
                }
            }));
        }
    };



    var startDrawingCurrentEdge = function (self, sourceNode) {
        self.IS_DRAWING_LINE = true;
        self.HAS_LEFT_SOURCE_NODE = false;
        self.currentLineBuffer.associateSourceNode(sourceNode);
    };

    var stopDrawingCurrentEdge = function (self) {
        self.IS_DRAWING_LINE = false;
        self.HAS_LEFT_SOURCE_NODE = false;          
        self.currentLineBuffer = new SproutsGame.CurrentEdgeBuffer();
    };

    var finishDrawingAnEdge = function (self, desintationNode) {
        self.IS_DRAWING_LINE = false;
        self.HAS_LEFT_SOURCE_NODE = false;
        self.currentLineBuffer.associateDestinationNode(desintationNode);
        return new SproutsGame.Edge(self.currentLineBuffer);
    };


})(window);
