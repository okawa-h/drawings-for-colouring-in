import {DrawingCanvas} from './drawingCanvas';

export class DrawingColouring {

	private jBoard         :HTMLDivElement;
	private jBaseCanvas    :HTMLCanvasElement;
	private jColorCanvas   :HTMLCanvasElement;
	private jPalette       :HTMLUListElement;
	private jTools         :HTMLUListElement;
	private jSize          :HTMLInputElement;
	private drawingCanvas  :DrawingCanvas;
	private BASE_IMAGE_PATH:string = 'files/img/base.jpg';
	private COLOR_LIST     :Array<string> = ['#000000','#0000ff','#00ffff','#00ff00','#990000','#ffff00'];

	constructor(jBoard:HTMLDivElement) {

		this.jBoard       = jBoard;
		this.jBaseCanvas  = document.createElement('canvas');
		this.jColorCanvas = document.createElement('canvas');
		this.jPalette     = <HTMLUListElement> document.getElementById('color-palette');
		this.jTools       = <HTMLUListElement> document.getElementById('tools');
		this.jSize        = <HTMLInputElement> document.getElementById('size');

		this.jBaseCanvas.id  = 'base-canvas';
		this.jColorCanvas.id = 'color-canvas';

		this.jBoard.appendChild(this.jBaseCanvas);
		this.jBoard.appendChild(this.jColorCanvas);

		this.start();
		this.setPalette();
		this.drawingCanvas = new DrawingCanvas(this.jColorCanvas);

		this.jSize.value = String(this.drawingCanvas.getSize());
		this.jSize.addEventListener('change',event => this.onSize(event));

		this.jPalette.addEventListener('click',event => this.onChangeColor(event));
		this.jTools.addEventListener('click',event => this.onClickTool(event));

		var list = <HTMLLIElement> this.jPalette.children.item(0);
		list.click();

	}

	private onClickTool(event:any):void {

		let target =<HTMLLIElement> event.target;
		let tool  =<string> target.getAttribute('data-tool');
		event.preventDefault();
		if (tool == null) return;

		switch (tool) {
			case 'eraser':
				this.onEraser(target);
				break;
			case 'clear':
				this.onClear();
				break;
			case 'download':
				this.onDownload();
				break;
			
			default:
				// code...
				break;
		}

	}

	private onSize(event:any):void {

		var value:number = Number(this.jSize.value);
		this.drawingCanvas.setSize(value);

	}

	private onEraser(target:HTMLLIElement):void {

		if (target.className == 'active') {
			target.className = '';
			DrawingCanvas.isEraser = false;
		} else {
			target.className = 'active';
			DrawingCanvas.isEraser = true;
		}

	}

	private onClear():void {

		if (confirm('キャンバスをクリアしてもよろしいですか？')) this.drawingCanvas.clear();

	}

	private onDownload():void {

		var data  :string             = this.drawingCanvas.getData();
		var canvas:HTMLCanvasElement  = document.createElement('canvas');
		var ctx      = <CanvasRenderingContext2D>canvas.getContext('2d');

		canvas.width  = this.jBoard.clientWidth;
		canvas.height = this.jBoard.clientHeight;

		DrawingColouring.loadImage(this.BASE_IMAGE_PATH,image => {

			ctx.drawImage(image, 0, 0);

			DrawingColouring.loadImage(data,image2 => {
				ctx.drawImage(image2, 0, 0);
				DrawingColouring.download(canvas.toDataURL(),'sample.png');
			});

		});

	}

	private onChangeColor(event:any):void {

		let target =<HTMLLIElement> event.target;
		let color  =<string> target.getAttribute('data-color');
		event.preventDefault();
		if (color != null) this.drawingCanvas.setColor(color);
		var items:HTMLCollection = this.jPalette.children;

		for (var i = 0; i < items.length; ++i) {
			var item = items.item(i);
			var name = color == item.getAttribute('data-color') ? 'active':'';
			item.className = name;
		}

	}

	private start():void {

		this.setSize();

		var canvas = this.jBaseCanvas;
		var ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
		DrawingColouring.loadImage(this.BASE_IMAGE_PATH,image => {

			var scale = canvas.width / image.width;
			ctx.setTransform(scale, 0, 0, scale, 0, 0);
			ctx.drawImage(image, 0, 0);

		});

	}

	private setPalette():void {

		let html:string = '';
		for (var i = 0; i < this.COLOR_LIST.length; ++i) {
			let color:string = this.COLOR_LIST[i];
			html += `<li data-color="${color}" style="background-color:${color};">&nbsp;</li>`;
		}
		this.jPalette.innerHTML = html;

	}

	private setSize():void {

		var width :number = this.jBoard.clientWidth;
		var height:number = this.jBoard.clientHeight;
		this.jBaseCanvas.width  = this.jColorCanvas.width  = width;
		this.jBaseCanvas.height = this.jColorCanvas.height = height; 

	}

	private static download(data:string,name:string):void {

		var link:HTMLAnchorElement = document.createElement('a');
		link.href      = data;
		link.download  = name;
		link.innerText = 'download';
		link.click();

	}

	private static loadImage(data:string,callback:(image:HTMLImageElement)=>void):void {

		var image:HTMLImageElement = new Image();
		image.onload = event => callback(image);
		image.src    = data;

	}

	public resize():void {

		// this.setSize();

	}

}