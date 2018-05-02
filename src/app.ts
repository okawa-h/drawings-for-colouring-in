import {DrawingColouring} from './drawingColouring';

var jBoard = <HTMLDivElement> document.getElementById('board');
var drawingColouring = new DrawingColouring(jBoard);

window.addEventListener('resize',onResize);

function onResize() {

	drawingColouring.resize();

}
