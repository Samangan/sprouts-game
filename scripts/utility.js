
;(function (root) {
    var SproutsGame = root.SproutsGame = root.SproutsGame || {};
    
    var Utility = SproutsGame.Utility = function (){};
    
    Utility.extendClass = function (BaseClass, ChildClass) {
		function Surrogate () {};
		Surrogate.prototype = BaseClass.prototype;
		ChildClass.prototype = new Surrogate();
    };

	// TODO: We dont actually need random colors. It looks dumb. Just use a nice teal for the nodes and red or grey for the edges.
    Utility.getRandomColor = function () {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
		    color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
    };

   Utility.getAllPixelsBetweenTwoPoints = function (x0, y0, x1, y1){
	   // Uses: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
	   var dx = Math.abs(x1-x0);
	   var dy = Math.abs(y1-y0);
	   var sx = (x0 < x1) ? 1 : -1;
	   var sy = (y0 < y1) ? 1 : -1;
	   var err = dx-dy;

	   var pixels = [];

	   while(true){
	     pixels.push({ 'x': x0, 'y': y0});

	     if ((x0==x1) && (y0==y1)) break;
	     var e2 = 2*err;
	     if (e2 >-dy){ err -= dy; x0  += sx; }
	     if (e2 < dx){ err += dx; y0  += sy; }
	   }

	   return pixels;
	};

})(window);
