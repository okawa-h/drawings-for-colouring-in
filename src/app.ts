import {DrawingColouring} from './drawingColouring';

let jBoard = <HTMLDivElement> document.getElementById('board');
let drawingColouring = new DrawingColouring(jBoard);

window.addEventListener('resize',onResize);

function onResize() {

	drawingColouring.resize();

}
