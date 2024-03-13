"use client";

import { Context } from "vm";
import React from 'react';
//import Image from "next/image";
import { WalkingAnimation, IdleAnimation, SkinViewer } from "skinview3d";
import { useEffect, useState } from 'react';
import style from "./page.module.css"
import { bandage_load, crop_pepe, clear, fill_bandage } from "./bandage_manager"
import "./styles/style.css"
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { ChromePicker } from 'react-color';

let skinViewer: SkinViewer;
let bandage_set: boolean = false;
const body_part_x = [32, 16, 40, 0];
const body_part_y = [52, 52, 20, 20];
const body_part_x_overlay = [48, 0, 40, 0];
const body_part_y_overlay = [52, 52, 36, 36];

function handleImageChange(event: { target: any; }, setTrigger: any) {
	const input = event.target;
	const canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d', { willReadFrequently: true }) as Context;

	const file = input.files[0];
	if (file) {
	  const reader = new FileReader();

	  reader.onload = function (e) {
		const img = new Image();
		img.onload = function () {
		  	// Очистите canvas перед отрисовкой нового изображения
		  	ctx.clearRect(0, 0, canvas.width, canvas.height);

		  	// Отрисовка изображения на canvas
		  	ctx.drawImage(img, 0, 0);
		  	var pixelData = ctx.getImageData(46, 52, 1, 1).data;
		  	(document.getElementById("slim") as HTMLInputElement).value = pixelData[3] == 255 ? "steve" : "alex";

		  	const result_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
		  	result_canvas.style.display = "block";

			const select_file = document.getElementById('select_file') as HTMLSpanElement;
			select_file.style.display = "none";
		};
		img.src = e.target?.result as string;
		setTrigger(true);
	  };

	  // Чтение содержимого файла в формате Data URL
	  reader.readAsDataURL(file);
	}
}

interface ColorComponentProps {
	setTrigger: (boolean) => void;
}

class ColorComponent extends React.Component<ColorComponentProps> {
    state = {
      background: '#fff',
	  displayColorPicker: false,
    };

	handleClick = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker })
	  };	
  
    handleChange = (color) => {
		let color_btn = document.getElementById("color_button") as HTMLSpanElement;
		color_btn.style.backgroundColor = color.hex;
      	this.setState({ background: color.hex });
		this.props.setTrigger(true);
    };

	handleClose = () => {
		this.setState({ displayColorPicker: false })
	};
  
    render() {
      	return (
			<>
				<p className={style.color_container}>Выберите цвет: <span className={style.color_button} id="color_button" onClick={this.handleClick}></span></p>
				{ this.state.displayColorPicker ? <div id="picker" style={{position: "absolute", zIndex: 2}}>
				<div style={ {position: "fixed", top: 0, right: 0, bottom: 0, left: 0} } onClick={ this.handleClose }/>
				<ChromePicker 
					color={ this.state.background }
					onChange={ this.handleChange }
					disableAlpha={true}
				/> 
				</div> : null}
			</>
      	);
    }
}

function parse_nick(setTrigger) {
	const canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
	const nickname = (document.getElementById('nickname') as HTMLInputElement).value;
	const ctx = canvas.getContext('2d', { willReadFrequently: true }) as Context;
	const error_label = document.getElementById('error_label') as HTMLCanvasElement;

	if(!nickname) return;

	const img = new Image();
	img.onload = function () {
		if (img.height == 32){
			error_label.innerHTML = "Ваш скин не найден или имеет формат до версии 1.8";
			error_label.style.display = "block";
			return;
		}
		error_label.style.display = "none";
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Отрисовка изображения на canvas
		ctx.drawImage(img, 0, 0);
		var pixelData = ctx.getImageData(46, 52, 1, 1).data;
		(document.getElementById("slim") as HTMLInputElement).value = pixelData[3] == 255 ? "steve" : "alex";
		setTrigger(true);

		const result_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
		result_canvas.style.display = "block";

		const select_file = document.getElementById('select_file') as HTMLSpanElement;
		select_file.style.display = "none";
	};
	img.crossOrigin = "Anonymous";
	img.src = "https://mineskin.eu/skin/" + nickname;

}


const AccordionItem = ({ header, ...rest }) => (
    <Item
      {...rest}
      header={
        <>
          {header}
          <img className={style.chevron} src="./resources/chevron-down.svg" alt="Chevron Down" />
        </>
      }
      className={style.item}
      buttonProps={{
        className: ({ isEnter }) =>
          `${style.itemBtn} ${isEnter && style.itemBtnExpanded}`
      }}
      contentProps={{ className: style.itemContent }}
      panelProps={{ className: style.itemPanel }}
    />
);

const update_anim = () => {
	let canvas = document.getElementById("animation") as HTMLSelectElement;
	if (canvas.value == "none"){
		skinViewer.animation = null;
	}else if (canvas.value == "idle"){
		skinViewer.animation = new IdleAnimation();
		skinViewer.animation.speed = parseFloat((document.getElementById('speed') as HTMLInputElement).value);
	}else if (canvas.value == "walking"){
		skinViewer.animation = new WalkingAnimation();
		skinViewer.animation.speed = parseFloat((document.getElementById('speed') as HTMLInputElement).value);
	}
}

const setSpeed = () => {
	if (skinViewer.animation)
		skinViewer.animation.speed = parseFloat((document.getElementById('speed') as HTMLInputElement).value);
}

export default function Home() {
	const [trigger_render, setTrigger] = useState(false);

  	useEffect(() => {
    	let input = document.getElementById('imageInput') as HTMLInputElement;
		input.addEventListener('change', (event) => handleImageChange(event, setTrigger));

		let canvas = document.getElementById("skin_container") as HTMLCanvasElement;
		skinViewer = new SkinViewer({
			canvas: canvas,
			skin: "./resources/steve.png"
		});
		skinViewer.animation = new WalkingAnimation();
		skinViewer.controls.enablePan = true;
		skinViewer.loadPanorama("resources/panorama.png");
		skinViewer.fov = 90;
		skinViewer.animation.speed = parseFloat((document.getElementById('speed') as HTMLInputElement).value);
		skinViewer.camera.position.x = 20;
		skinViewer.camera.position.y = 15;
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;
		let container = document.getElementById("settings_container") as HTMLDivElement;

		if (viewportWidth >= 768){

			skinViewer.width = viewportWidth * 0.75;
			skinViewer.height = viewportHeight;

			container.style.width = Math.round(viewportWidth / 4) + "px";
			container.style.height = Math.round(viewportHeight) + "px";
		}else {
			skinViewer.width = Math.round(viewportWidth) + 0.1;
			skinViewer.height = Math.round(viewportWidth);
			container.style.width = Math.round(viewportWidth) + "px";
		}

		const skin = new Image(); // Create new img element
		skin.src = "./resources/steve.png"; // Set source path

		skin.onload = () => {
			const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
			const ctx = skin_canvas.getContext('2d', { willReadFrequently: true }) as Context;

			ctx.drawImage(skin, 0, 0);
			ctx.beginPath();
			setTrigger(true);
		};
		setInterval(() => setTrigger(false), 100);
		window.addEventListener("resize", () => {
			const viewportWidth = document.documentElement.clientWidth;
			const viewportHeight = document.documentElement.clientHeight;
			let container = document.getElementById("settings_container") as HTMLDivElement;

			if (viewportWidth >= 768){

				skinViewer.width = Math.round(viewportWidth * 0.75) + 0.1;
				skinViewer.height = Math.round(viewportHeight);

				container.style.width = Math.round(viewportWidth / 4) + "px";
				container.style.height = Math.round(viewportHeight) + "px";
			} else {
				skinViewer.width = Math.round(viewportWidth) + 0.1;
				skinViewer.height = Math.round(viewportWidth) + 0.1;

				container.style.width = Math.round(viewportWidth) + "px";
				container.style.height = "auto";
			}
			setTrigger(true);
		});

		let dropContainer = document.getElementById('drop_container');
		dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
			evt.preventDefault();
		};
		dropContainer.ondrop = function (evt) {
			const dT = new DataTransfer();
			dT.items.add(evt.dataTransfer.files[0]);
			(document.getElementById('imageInput') as HTMLInputElement).files = dT.files;
			document.getElementById('imageInput').dispatchEvent(new Event('change'))
			evt.preventDefault();
		};

		document.getElementById('nickname').addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
				parse_nick(setTrigger);
			}
		});
			
	}, [])

	useEffect(() => {
		setTrigger(false);
		const canvas = document.getElementById('result_skin_canvas') as HTMLCanvasElement;
		const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
		const bandage_canvas = document.getElementById('pepe_original_canvas') as HTMLCanvasElement;
		const lining_canvas = document.getElementById('lining_original_canvas') as HTMLCanvasElement;

		const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(skin_canvas, 0, 0);
		
		let height = bandage_canvas.height;
		(document.getElementById('position') as HTMLInputElement).max = (12 - height) + "";
		let slim = (document.getElementById("slim") as HTMLInputElement).value == 'alex' ? true : false;
		let body_part = parseInt((document.getElementById('body_part') as HTMLInputElement).value);
		let position = (12 - height) - parseFloat((document.getElementById('position') as HTMLInputElement).value);
		let clear_pix = (document.getElementById('clear') as HTMLInputElement).checked;
		let pepe_type = (document.getElementById("pepe_type") as HTMLSelectElement).value;

		let pepe = crop_pepe(bandage_canvas, slim, height, body_part);
		let cropped_pepe = document.createElement("canvas") as HTMLCanvasElement;
		cropped_pepe.width = 16;
		cropped_pepe.height = height;
		const ctx2 = cropped_pepe.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

		let lining = crop_pepe(lining_canvas, slim, height, body_part);
		let cropped_lining = document.createElement("canvas") as HTMLCanvasElement;
		cropped_lining.width = 16;
		cropped_lining.height = height;
		const ctx_lining = cropped_lining.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

		if (pepe_type == "pepe"){
			var element = document.getElementById("color_button");
			var computedStyles = window.getComputedStyle(element);
			var backgroundColor = computedStyles.backgroundColor;
			var rgb = backgroundColor.replace(/^rgba?\(|\s+|\)$/g,'').split(',');
			pepe = fill_bandage(pepe, rgb);
			lining = fill_bandage(lining, rgb);
		}
		
		if (bandage_set && clear_pix)
			clear(canvas, body_part_x_overlay[body_part], body_part_y_overlay[body_part] + position, height);

		if (slim && (body_part == 0 || body_part == 2)){
			ctx2.drawImage(pepe, 1, 0, pepe.width - 1, height, 0, 0, pepe.width - 1, height);
			ctx_lining.drawImage(lining, 1, 0, lining.width - 1, height, 0, 0, lining.width - 1, height);
		}else{
			ctx2.drawImage(pepe, 0, 0, pepe.width, height, 0, 0, pepe.width, height);
			ctx_lining.drawImage(lining, 0, 0, lining.width, height, 0, 0, lining.width, height);
		}

		ctx.drawImage(cropped_pepe, 
			body_part_x_overlay[body_part], body_part_y_overlay[body_part] + position);

		ctx.drawImage(cropped_lining, 
			body_part_x[body_part], body_part_y[body_part] + position);
		
		
		skinViewer.loadSkin(canvas.toDataURL(), {model: slim? "slim" : "default"});
	}, [trigger_render])

  	return (
		<main>
			<canvas id="pepe_original_canvas"style={{display: "none"}}></canvas>
			<canvas id="lining_original_canvas" width="64" height="64" style={{display: "none"}}></canvas>
			<canvas id="skin_container" className={style.render_canvas}></canvas>
			<canvas id="result_skin_canvas" width="64" height="64" style={{width: 64, height: 64}} className={style.result_skin_canvas}></canvas>

			<div className={style.settings_container} id="settings_container">
				<Accordion transition transitionTimeout={250}>
					<AccordionItem header="Загрузка скина" initialEntered>
						<div className={style.import_skin}>
							<input type="text" id="nickname" className={style.nickname} placeholder="Введите свой никнейм" maxLength={16} onBlur={() => parse_nick(setTrigger)}/>
							<p id="error_label" className={style.error_label}></p>
							<label className={style.input_file} id="drop_container">
								<input type="file" name="imageInput" id="imageInput" accept="image/png"/>		
								<span id="select_file">Выберите файл<br/>или<br/>скиньте его сюда</span>
								<canvas id="original_canvas" width="64" height="64" className={style.original_canvas}></canvas>
							</label>
						</div>
					</AccordionItem>
					<AccordionItem header="Стили">
						<div className={style.styles_main}>
							<ColorComponent setTrigger={setTrigger}/>
							<select name="pepe_type" id="pepe_type" onChange={() => {bandage_load(setTrigger); bandage_set = true;}} defaultValue={"not_set"}>
								<option value="not_set" disabled={true}>Стиль повязки</option>
								<option value="pepe">Кастомная</option>
								<option value="gold">Золотая</option>
								<option value="silver">Серебряная</option>
								<option value="space">Космос</option>
								<option value="moder">ModErator</option>
							</select>
						</div>
					</AccordionItem>

					<AccordionItem header="Основные настройки">
						<div className={style.styles_main}>
							<input type="range" id="position" min="0" max="8" step="1" onInput={() => setTrigger(true)} className={style.position}/>
							<div>
								<input type="checkbox" id="clear" name="clear" onInput={() => setTrigger(true)}/>
								<label htmlFor="clear">Очистить пиксели на втором слое рядом с повязкой</label>
							</div>
							<select name="slim" id="slim" onChange={() => setTrigger(true)}>
								<option value="steve">Стив</option>
								<option value="alex">Алекс</option>
							</select>

							<select name="body_part" id="body_part" onChange={() => setTrigger(true)}>
								<option value="0">Левая рука</option>
								<option value="1">Левая нога</option>
								<option value="2">Правая рука</option>
								<option value="3">Правая нога</option>
							</select>
						</div>
					</AccordionItem>
					<AccordionItem header="Отображение и анимация">
						<div className={style.styles_main}>
							<input type="range" id="speed" min="0" max="1" step="0.1" onInput={setSpeed}/>
							<select name="animation" id="animation" onChange={update_anim} defaultValue={"walking"}>
								<option value="none">Нет</option>
								<option value="idle">Стандартная</option>
								<option value="walking">Ходьба</option>
							</select>
						</div>
					</AccordionItem>
				</Accordion>
			</div>
		</main>
  	);
}