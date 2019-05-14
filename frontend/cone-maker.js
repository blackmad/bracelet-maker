// https://www.templatemaker.nl/api/api.php?client=templatemaker&request=galleryitem&template=cone&file=example-math.jpg

//var R = 2;
var L = 7;
var M = 7.5;

var T = L / Math.PI;
var B = M / Math.PI;
var H = 2;

//var R = Math.sqrt(Math.pow(0.5*B - 0.5*T, 2) + Math.pow(H, 2));
var R = H;
var P = R / (B - T);
var Q = P + R;
var alphaRads = (L / P);
var alpha = alphaRads * 180/Math.PI;


console.log(P);
console.log(alpha);

var p1p1 = [P, 0];
var p1p2 = [P * Math.cos(alphaRads), P * Math.sin(alphaRads)];
var p2p1 = [Q, 0];
var p2p2 = [Q * Math.cos(alphaRads), Q * Math.sin(alphaRads)];

var makerjs = require('makerjs');
this.paths = {
    p1: new makerjs.paths.Arc([0,0], P, 0, alpha),
    p2: new makerjs.paths.Arc([0,0], Q, 0, alpha),
  	lp1: new makerjs.paths.Line(p1p1, p1p2),
    lp2: new makerjs.paths.Line(p2p1, p2p2)
};

console.log(paths['p1']);
//press enter here to add more blank lines

