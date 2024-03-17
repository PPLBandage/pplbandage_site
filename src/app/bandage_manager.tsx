
export function bandage_load(setTrigger: any, name: string){
	const bandage = new Image(); // Create new img element
	bandage.src = `./static/pepes/colored/${name}.png`; // Set source path

	bandage.onload = () => {
		let bandage_canvas = document.getElementById("pepe_original_canvas") as HTMLCanvasElement;
		const ctx = bandage_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
		bandage_canvas.width = bandage.width;
		bandage_canvas.height = bandage.height;

		ctx.drawImage(bandage, 0, 0);
		ctx.beginPath();
		setTrigger(true);
	};

	const lining = new Image(); // Create new img element
	lining.src = `./static/lining/colored/${name}.png`; // Set source path

	lining.onload = () => {
		let lining_canvas = document.getElementById("lining_original_canvas") as HTMLCanvasElement;
		const ctx_lining = lining_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
		lining_canvas.width = lining.width;
		lining_canvas.height = lining.height;

		ctx_lining.drawImage(lining, 0, 0);
		ctx_lining.beginPath();
		setTrigger(true);
	};
}


export function crop_pepe(pepe_canvas: HTMLCanvasElement, slim: boolean, height: number, body_part: number): HTMLCanvasElement{
	let bandage_canvas = document.createElement("canvas") as HTMLCanvasElement;
	bandage_canvas.width = 16;
	bandage_canvas.height = height;
	const ctx = bandage_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

	if (slim && (body_part == 0 || body_part == 2)){
		ctx.drawImage(pepe_canvas, 0, 0, 15, height, 0, 0, 15, height);
	}else{
		ctx.drawImage(pepe_canvas, 0, 0);
	}

	if (body_part > 1){
		let result = document.createElement("canvas") as HTMLCanvasElement;
		result.width = 16;
		result.height = height;
		const ctx2 = result.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
		
		let paste_position = !(slim && (body_part == 0 || body_part == 2)) ? 8 : 7;
		ctx2.drawImage(bandage_canvas, 0, 0, 8, height, paste_position, 0, 8, height);  // left
		ctx2.drawImage(bandage_canvas, paste_position, 0, 8, height, 0, 0, 8, height);  // right
		return result;

	}
	return bandage_canvas;
}

export function clear(canvas: HTMLCanvasElement, pos_x: number, pos_y: number, height: number){
	const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
	ctx.clearRect(pos_x, pos_y, 16, height);
}

export function fill_bandage(canvas: HTMLCanvasElement, color){
	const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
	for (let y = 0; y < canvas.height; y++){
		for (let x = 0; x < canvas.width; x++){
			var pixelData = ctx.getImageData(x, y, 1, 1).data;
			if (pixelData[3] != 0 && (pixelData[0] == pixelData[1] && pixelData[1] == pixelData[2] && pixelData[0] == pixelData[2])){
				ctx.fillStyle = "rgba("+ (pixelData[0] / 255) * color[0] + "," + (pixelData[1] / 255) * color[1] + "," + (pixelData[2] / 255) * color[2] + ",1)";
				ctx.fillRect( x, y, 1, 1 );
			}
		}
	}
	return canvas;
}


export function load_custom(event, setTrigger){
	const input = event.target;
	const error_label = document.getElementById('error_label_pepe') as HTMLParagraphElement;

	const file = input.files[0];
	if (file) {
	  const reader = new FileReader();
	  reader.onload = function (e) {
		const img = new Image();
		img.onload = function () {
			let bandage_canvas = document.getElementById("pepe_original_canvas") as HTMLCanvasElement;
			const ctx = bandage_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
			
			let lining_canvas = document.getElementById("lining_original_canvas") as HTMLCanvasElement;
			const ctx_lining = lining_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

			if (img.height % 2 != 0 || img.width != 16 || (img.height > 24 || img.height < 1)){
				error_label.innerHTML = "Файл с повязкой должен иметь ширину 16 и высоту от 2 до 24 пикселей";
				error_label.style.display = "block";
				return
			}
			error_label.style.display = "none";
			let height = Math.floor(img.height / 2);

			bandage_canvas.width = 16;
			bandage_canvas.height = height;

			lining_canvas.width = 16;
			lining_canvas.height = height;

			ctx.drawImage(img, 0, 0, 16, height, 0, 0, 16, height);
			ctx_lining.drawImage(img, 0, height, 16, height, 0, 0, 16, height);
			setTrigger(true);
		};
		img.src = e.target?.result as string;
	  };

	  // Чтение содержимого файла в формате Data URL
	  reader.readAsDataURL(file);
	}
}
