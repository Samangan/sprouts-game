
;(function(root) {
    var SproutsGame = root.SproutsGame = root.SproutsGame || {};
    var canvas = document.getElementById("sprouts-canvas");
    var context = canvas.getContext("2d");

    var edgeCanvas = document.getElementById("edge-canvas");
    
    var game = new SproutsGame.Game(canvas, edgeCanvas);
    
    console.log(game);
    game.play(context);
    
})(window);
