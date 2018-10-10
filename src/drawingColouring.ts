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
	private COLOR_LIST     :Array<string> = ['#f44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722','#795548','#9E9E9E','#607D8B','#000000','#ffffff'];

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

		let list = <HTMLLIElement> this.jPalette.children.item(0);
		list.click();

	}

	private onClickTool(event:any):void {

		let target =<HTMLLIElement> event.target;
		let tool   =<string> target.getAttribute('data-tool');
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

		let value:number = Number(this.jSize.value);
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

		let baseData:string = this.jBaseCanvas.toDataURL();
		let drawData:string = this.drawingCanvas.getData();
		let canvas  :HTMLCanvasElement = document.createElement('canvas');
		let ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

		DrawingColouring.loadImage(baseData,baseImage => {
			DrawingColouring.loadImage(drawData,drawImage => {

				canvas.width  = drawImage.width;
				canvas.height = drawImage.height;
				ctx.drawImage(baseImage, 0, 0);
				ctx.drawImage(drawImage, 0, 0);
				DrawingColouring.download(canvas.toDataURL(),'image.png');

			});
		});

	}

	private onChangeColor(event:any):void {

		let target =<HTMLLIElement> event.target;
		let color  =<string> target.getAttribute('data-color');
		event.preventDefault();
		if (color != null) this.drawingCanvas.setColor(color);
		let items:HTMLCollection = this.jPalette.children;

		for (let i = 0; i < items.length; ++i) {
			let item = items.item(i);
			let name = color == item.getAttribute('data-color') ? 'active':'';
			item.className = name;
		}

	}

	private start():void {

		let canvas = this.jBaseCanvas;
		let ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
		DrawingColouring.loadImage(this.BASE_IMAGE_PATH,image => {

			this.jBoard.style.width  = String(image.width)  + 'px';
			this.jBoard.style.height = String(image.height) + 'px';
			this.setSize();

			let scale = canvas.width / image.width;
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

		this.jBaseCanvas.width  = this.jColorCanvas.width  = this.jBoard.clientWidth;
		this.jBaseCanvas.height = this.jColorCanvas.height = this.jBoard.clientHeight; 

	}

	private static download(data:string,name:string):void {

		let link:HTMLAnchorElement = document.createElement('a');
		link.href      = data;
		link.download  = name;
		link.innerText = 'download';
		link.click();

	}

	private static loadImage(data:string,callback:(image:HTMLImageElement)=>void):void {

		let image:HTMLImageElement = new Image();
		image.onload = event => callback(image);
		image.src    = data;

	}

	public resize():void {

		// this.setSize();

	}

}