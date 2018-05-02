export class DrawingCanvas {

	public static isEraser:boolean = false;

	private jCanvas:HTMLCanvasElement;
	private ctx    :CanvasRenderingContext2D;

	private mouseX:any = null;
	private mouseY:any = null;

	private finger:Array<any>;

	private DRAW_SIZE :number = 3;
	private DRAW_COLOR:string = '#000000';

	constructor(jCanvas:HTMLCanvasElement) {

		this.jCanvas = jCanvas;
		this.ctx     = <CanvasRenderingContext2D> this.jCanvas.getContext('2d');
		this.finger = [];

		var finger = this.finger;
		for (var i=0; i<10; i++) {
			finger[i] = { x:0,y:0,x1:0,y1:0 };
		}

		this.jCanvas.addEventListener('mousedown', event => this.onMousedown(event), false);
		this.jCanvas.addEventListener('mousemove', event => this.onMousemove(event) , false);
		this.jCanvas.addEventListener('mouseup'  , event => this.onDrawend(event), false);
		this.jCanvas.addEventListener('mouseout' , event => this.onDrawend(event), false);

		this.jCanvas.addEventListener('touchstart', event => this.onTouchstart(event), false);
		this.jCanvas.addEventListener('touchmove', event => this.onTouchmove(event) , false);

	}

	private onMousedown(event:any):void {

		if (event.button === 0) {
			var rect = event.target.getBoundingClientRect();
			var x = ~~(event.clientX - rect.left);
			var y = ~~(event.clientY - rect.top);
			this.mouseDraw(x,y);
		}

	}

	private onMousemove(event:any):void {

		if (event.buttons === 1 || event.witch === 1) {
			var rect = event.target.getBoundingClientRect();
			var x = ~~(event.clientX - rect.left);
			var y = ~~(event.clientY - rect.top);
			this.mouseDraw(x,y);
		};

	}

	private onDrawend(event:any):void {

		this.mouseX = this.mouseY = null;

	}

	private onTouchstart(event:any):void {

		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		var x = ~~(event.clientX - rect.left);
		var y = ~~(event.clientY - rect.top);

		var finger = this.finger;
		for (var i=0; i<finger.length; i++){
			finger[i].x1 = event.touches[i].clientX - rect.left;
			finger[i].y1 = event.touches[i].clientY - rect.top;
		}

	}

	private onTouchmove(event:any):void {

		event.preventDefault();
		var rect = event.target.getBoundingClientRect();
		var ctx  = this.ctx;

		var finger = this.finger;
		for(var i=0; i<finger.length;i++) {

			var x = event.touches[i].clientX - rect.left;
			var y = event.touches[i].clientY - rect.top;

			this.draw(finger[i].x1,finger[i].y1,x,y);

			finger[i].x1 = finger[i].x = x;
			finger[i].y1 = finger[i].y = y;

		}

	}

	private mouseDraw(x:number,y:number):void {

		var moveX:number = 0;
		var moveY:number = 0;
		if (this.mouseX === null || this.mouseY === null) {
			moveX = x;
			moveY = y;
		} else {
			moveX = this.mouseX;
			moveY = this.mouseY;
		}

		this.draw(moveX,moveY,x,y);
		this.mouseX = x;
		this.mouseY = y;

	}

	private draw(moveX:number,moveY:number,x:number,y:number):void {

		var ctx = this.ctx;

		ctx.beginPath();
		ctx.globalAlpha = 1;
		ctx.moveTo(moveX,moveY);

		ctx.globalCompositeOperation = this.getGlobalCompositeOperation();

		ctx.lineTo(x,y);
		ctx.lineCap     = 'round';
		ctx.lineWidth   = this.DRAW_SIZE * 2;
		ctx.strokeStyle = this.DRAW_COLOR;
		ctx.stroke();

	}

	private getGlobalCompositeOperation():string {

		return DrawingCanvas.isEraser ? 'destination-out' : 'source-over';

	}

	public clear():void {

		this.ctx.clearRect(0,0,this.jCanvas.width,this.jCanvas.height);

	}

	public getData():string {

		return this.jCanvas.toDataURL();

	}

	public getSize():number {

		return this.DRAW_SIZE;

	}

	public setSize(size:number):void {

		this.DRAW_SIZE = ~~size;

	}

	public setColor(color:string):void {

		this.DRAW_COLOR = color;

	}

}