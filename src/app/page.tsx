"use client";

import { Context } from "vm";
import React from 'react';
import { useEffect, useState } from 'react';

import style from "./styles/root/page.module.css";
import { bandage_load, crop_pepe, clear, fill_bandage, load_custom } from "./bandage_manager";
import "./styles/root/style.css";
import { ColourOption, shapeColourOptions, groupedOptions } from "./data";
import axios from "axios";

import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { ChromePicker } from 'react-color';
import Select, { ActionMeta, GroupBase, GroupProps, components } from 'react-select';
import { WalkingAnimation, IdleAnimation, SkinViewer } from "skinview3d";
import { Cookies, useCookies } from 'next-client-cookies';

let skinViewer: SkinViewer;
let bandage_set: boolean = false;
const body_part_x = [32, 16, 40, 0];
const body_part_y = [52, 52, 20, 20];
const body_part_x_overlay = [48, 0, 40, 0];
const body_part_y_overlay = [52, 52, 36, 36];

const groupStyles = {
	borderRadius: '5px',
	background: '#f2fcff',
};

const Group = (props: React.JSX.IntrinsicAttributes & GroupProps<unknown, boolean, GroupBase<unknown>>) => (
	<div style={groupStyles}>
		<components.Group {...props} />
	</div>
);

function handleImageChange(event: { target: any; }, setTrigger: any) {
	const input = event.target;
	const canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d', { willReadFrequently: true }) as Context;
	const error_label = document.getElementById('error_label') as HTMLCanvasElement;

	const file = input.files[0];
	if (file) {
		const reader = new FileReader();

		reader.onload = function (e) {
			const img = new Image();
			img.onload = function () {
				if (img.width != 64 || img.height != 64) {
					error_label.innerHTML = "Ваш скин должен иметь разрешение 64х64 пикселя";
					error_label.style.display = "block";
					return;
				}
				error_label.style.display = "none";
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				ctx.drawImage(img, 0, 0);
				var pixelData = ctx.getImageData(46, 52, 1, 1).data;
				(document.getElementById(pixelData[3] == 255 ? "steve" : "alex") as HTMLInputElement).checked = true;

				const result_canvas = document.getElementById('hidable_canvas') as HTMLCanvasElement;
				result_canvas.style.display = "inline-flex";

				const select_file = document.getElementById('drop_container') as HTMLSpanElement;
				select_file.style.display = "none";
			};
			img.src = e.target?.result as string;
			setTrigger(true);
		};

		// Чтение содержимого файла в формате Data URL
		reader.readAsDataURL(file);
	}
}

async function parse_nick(setTrigger: React.Dispatch<React.SetStateAction<boolean>>) {
	const canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
	const nickname = document.getElementById('nickname') as HTMLInputElement;
	const ctx = canvas.getContext('2d', { willReadFrequently: true }) as Context;
	const error_label = document.getElementById('error_label') as HTMLCanvasElement;

	if (!nickname.value) return;

	const img = new Image();
	img.onload = function () {
		if (img.height == 32) {
			error_label.innerHTML = "Ваш скин имеет формат до версии 1.8";
			error_label.style.display = "block";
			nickname.style.borderColor = "#ff0000";
			return;
		}
		nickname.style.borderColor = "#b1b1b1";
		error_label.style.display = "none";
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Отрисовка изображения на canvas
		ctx.drawImage(img, 0, 0);
		var pixelData = ctx.getImageData(46, 52, 1, 1).data;
		(document.getElementById(pixelData[3] == 255 ? "steve" : "alex") as HTMLInputElement).checked = true;
		setTrigger(true);

		const result_canvas = document.getElementById('hidable_canvas') as HTMLCanvasElement;
		result_canvas.style.display = "inline-flex";

		const select_file = document.getElementById('drop_container') as HTMLSpanElement;
		select_file.style.display = "none";
	};
	try {
		let response = await axios.get("https://skinserver.pplbandage.ru/skin/" + nickname.value, {
			responseType: 'arraybuffer'
		});
		const blob = new Blob([response.data], { type: 'image/png' });
		const imgUrl = URL.createObjectURL(blob);
		img.crossOrigin = "Anonymous";
		img.src = imgUrl;
	} catch (e) {
		if (e.response && e.response.status == 404) {
			error_label.innerHTML = "Игрок с таким никнеймом не найден!";
			error_label.style.display = "block";
			nickname.style.borderColor = "#ff0000";
			return;
		}
	}

}

interface ColorComponentProps {
	setTrigger: (arg0: boolean) => void;
}

const get_skin_type = () => {
	var inp = document.getElementsByName('skin_type') as NodeListOf<HTMLInputElement>;
	for (var i = 0; i < inp.length; i++) {
		if (inp[i].type == "radio" && inp[i].checked) {
			return inp[i].value;
		}
	}
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
				{this.state.displayColorPicker ? <div id="picker" style={{ position: "absolute", zIndex: 2 }}>
					<div style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }} onClick={this.handleClose} />
					<ChromePicker
						color={this.state.background}
						onChange={this.handleChange}
						disableAlpha={true}
					/>
				</div> : null}
			</>
		);
	}
}

//<div style={ {position: "fixed", top: 0, right: 0, bottom: 0, left: 0} } onClick={ this.handleClose }/>

const download_skin = () => {
	let link = document.createElement('a');
	link.download = 'skin.png';
	link.href = (document.getElementById('result_skin_canvas') as HTMLCanvasElement).toDataURL()
	link.click();
}

const AccordionItem = ({ header, dark, ...rest }) => (
	<Item
		{...rest}
		header={
			<>
				{header}
				<img className={`${style.chevron} ${dark ? style.dark : ""}`} src="./static/chevron-down.svg" alt="Chevron Down" />
			</>
		}
		className={`${style.item} ${dark ? style.dark : ""}`}
		buttonProps={{
			className: ({ isEnter }) =>
				`${style.itemBtn} ${isEnter && style.itemBtnExpanded} ${dark ? style.dark : ""}`
		}}
		contentProps={{ className: style.itemContent }}
		panelProps={{ className: style.itemPanel }}
	/>
);

const clear_skin = (setTrigger: React.Dispatch<React.SetStateAction<boolean>>) => {
	const skin = new Image(); // Create new img element
	skin.src = "./static/steve.png"; // Set source path

	skin.onload = () => {
		const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
		const ctx = skin_canvas.getContext('2d', { willReadFrequently: true }) as Context;

		ctx.clearRect(0, 0, 64, 64);
		ctx.drawImage(skin, 0, 0);
		ctx.beginPath();
		setTrigger(true);

		const result_canvas = document.getElementById('hidable_canvas') as HTMLCanvasElement;
		result_canvas.style.display = "none";

		const select_file = document.getElementById('drop_container') as HTMLSpanElement;
		select_file.style.display = "inline-flex";

		(document.getElementById("nickname") as HTMLInputElement).value = "";
		(document.getElementById(get_skin_type() as string) as HTMLInputElement).checked = false;
	};
}


const change_theme = (dark: Boolean, set_dark, cookies: Cookies) => {
	cookies.set('dark', String(dark), { expires: (365 * 10) })
	document.body.style.colorScheme = dark ? "dark" : "light";
	skinViewer.loadPanorama(`./static/panorama${dark ? "_dark" : ""}.png`);
	set_dark(dark);
}

export default function Home() {
	const cookies = useCookies();
	const [trigger_render, setTrigger] = useState(false);
	const [pepe_type, set_pepe_type] = useState("");
	const [dark, set_dark] = useState(cookies.get("dark") === "true");

	let update_pepe = (new_value: ColourOption, actionMeta: ActionMeta<ColourOption>) => {
		set_pepe_type(new_value.value);
		let custom_pepe = document.getElementById('custom_pepe') as HTMLInputElement;
		bandage_set = true;
		if (new_value.value == "not_set"){
			bandage_set = false;
			setTrigger(true);
		}else if (new_value.value != "custom_pepe") {
			bandage_load(setTrigger, new_value.value);
			custom_pepe.style.display = "none";
		} else {
			custom_pepe.style.display = "block";
		}
		
	}

	useEffect(() => {
		let input = document.getElementById('imageInput') as HTMLInputElement;
		input.addEventListener('change', (event) => handleImageChange(event, setTrigger));

		let custom_pepe = document.getElementById('custom_pepe') as HTMLInputElement;
		custom_pepe.addEventListener('change', (event) => load_custom(event, setTrigger));

		let canvas = document.getElementById("skin_container") as HTMLCanvasElement;
		skinViewer = new SkinViewer({
			canvas: canvas,
			skin: "./static/steve.png"
		});
		skinViewer.animation = new WalkingAnimation();
		skinViewer.controls.enablePan = true;
		skinViewer.fov = 90;
		skinViewer.animation.speed = 0.65;
		skinViewer.camera.position.x = 20;
		skinViewer.camera.position.y = 15;
		skinViewer.globalLight.intensity = 2.5;
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;
		let container = document.getElementById("settings_container") as HTMLDivElement;

		if (viewportWidth >= 768) {

			skinViewer.width = viewportWidth * 0.75;
			skinViewer.height = viewportHeight;

			container.style.width = Math.round(viewportWidth / 4) + "px";
			container.style.height = Math.round(viewportHeight) + "px";
		} else {
			skinViewer.width = Math.round(viewportWidth) + 0.1;
			skinViewer.height = Math.round(viewportWidth * 0.7) + 0.1;
			container.style.width = Math.round(viewportWidth) + "px";
		}

		let dark_local = cookies.get("dark");
		if (dark_local == null) {
			let system_theme = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
			cookies.set("dark", String(system_theme), { expires: (365 * 10) });
			change_theme(system_theme, set_dark, cookies);
		} else change_theme(dark_local == "true", set_dark, cookies);

		const skin = new Image(); // Create new img element
		skin.src = "./static/steve.png"; // Set source path

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

			if (viewportWidth >= 768) {

				skinViewer.width = Math.round(viewportWidth * 0.75) + 0.1;
				skinViewer.height = Math.round(viewportHeight);

				container.style.width = Math.round(viewportWidth / 4) + "px";
				container.style.height = Math.round(viewportHeight) + "px";
			} else {
				skinViewer.width = Math.round(viewportWidth) + 0.1;
				skinViewer.height = Math.round(viewportWidth * 0.7) + 0.1;

				container.style.width = Math.round(viewportWidth) + "px";
			}
			setTrigger(true);
		});

		let dropContainer = document.getElementById('drop_container') as HTMLLabelElement;
		dropContainer.ondragover = dropContainer.ondragover = function (evt) {
			if ((evt.dataTransfer as DataTransfer).items[0].type == "image/png") {
				evt.preventDefault();
				let drag_container = document.getElementById("drop_container") as HTMLDivElement;
				drag_container.style.borderStyle = "solid";
			}
		};

		dropContainer.ondragleave = dropContainer.ondragleave = function (evt) {
			let drag_container = document.getElementById("drop_container") as HTMLDivElement;
			drag_container.style.borderStyle = "dashed";
		};

		dropContainer.ondrop = function (evt: DragEvent) {
			const dT = new DataTransfer();
			dT.items.add((evt.dataTransfer as DataTransfer).files[0]);
			(document.getElementById('imageInput') as HTMLInputElement).files = dT.files;
			(document.getElementById('imageInput') as HTMLInputElement).dispatchEvent(new Event('change'))
			evt.preventDefault();
			let drag_container = document.getElementById("drop_container") as HTMLDivElement;
			drag_container.style.borderStyle = "dashed";
		};

		(document.getElementById('nickname') as HTMLInputElement).addEventListener('keydown', function (event) {
			if (event.key === 'Enter') {
				parse_nick(setTrigger);
			}
		});

		(document.getElementById("clear") as HTMLInputElement).checked = true;
		(document.getElementById("first_layer") as HTMLInputElement).checked = true;
		(document.getElementById("second_layer") as HTMLInputElement).checked = true;

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

		let height = Math.max(bandage_canvas.height, lining_canvas.height);
		(document.getElementById('position') as HTMLInputElement).max = (12 - height) + "";
		let slim = get_skin_type() == 'alex' ? true : false;
		let body_part = parseInt((document.getElementById('body_part') as HTMLInputElement).value);
		let position = (12 - height) - parseFloat((document.getElementById('position') as HTMLInputElement).value);
		let clear_pix = (document.getElementById('clear') as HTMLInputElement).checked;

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

		if (pepe_type == "pepe" || pepe_type == "pepe_1") {
			var element = document.getElementById("color_button") as HTMLButtonElement;
			var computedStyles = window.getComputedStyle(element);
			var backgroundColor = computedStyles.backgroundColor;
			var rgb = backgroundColor.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
			pepe = fill_bandage(pepe, rgb);
			lining = fill_bandage(lining, rgb);
		}

		if (bandage_set && clear_pix)
			clear(canvas, body_part_x_overlay[body_part], body_part_y_overlay[body_part] + position, height);

		let coef = slim && (body_part == 0 || body_part == 2) ? 1 : 0;

		ctx2.drawImage(pepe, coef, 0, pepe.width - coef, height, 0, 0, pepe.width - coef, height);
		ctx_lining.drawImage(lining, coef, 0, lining.width - coef, height, 0, 0, lining.width - coef, height);

		let first_layer = document.getElementById("first_layer") as HTMLInputElement;
		let second_layer = document.getElementById("second_layer") as HTMLInputElement;

		let layers = (document.getElementById("layers") as HTMLSelectElement).value;
		let overlay_x = body_part_x_overlay[body_part];
		let overlay_y = body_part_y_overlay[body_part];

		let first_x = body_part_x[body_part];
		let first_y = body_part_y[body_part];

		if (layers == "1") {
			overlay_x = first_x;
			overlay_y = first_y;
		}

		if (layers == "2") {
			first_x = overlay_x;
			first_y = overlay_y;
		}

		if (first_layer.checked && bandage_set)
			ctx.drawImage(cropped_lining,
				first_x, first_y + position);

		if (second_layer.checked && bandage_set)
			ctx.drawImage(cropped_pepe,
				overlay_x, overlay_y + position);


		skinViewer.loadSkin(canvas.toDataURL(), { model: slim ? "slim" : "default" });
	}, [trigger_render])

	return (
		<body className={dark ? "dark" : ""} style={{ colorScheme: dark ? "dark" : "light" }}>
			<main className={`${style.main} ${dark ? style.dark : ""}`}>
				<meta name="description" content="Повязка Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!" />
				<link rel="icon" href="https://pplbandage.ru/static/favicon.ico" type="image/x-icon"></link>
				<link rel="preload" href="./static/icons/moon.svg" as="image" />
				<link rel="preload" href="./static/icons/sun.svg" as="image" />
				<canvas id="pepe_original_canvas" style={{ display: "none" }} height="4"></canvas>
				<canvas id="lining_original_canvas" style={{ display: "none" }} height="4"></canvas>
				<canvas id="skin_container" className={style.render_canvas}></canvas>
				<button id="theme_swapper" className={`${style.theme_swapper} ${dark ? style.dark : ""}`} onClick={() => change_theme(!dark, set_dark, cookies)}>
					<img src={dark ? "./static/icons/moon.svg" : "./static/icons/sun.svg"} id="sun" alt="theme swapper"></img>
				</button>

				<div className={`${style.settings_container} ${dark ? style.dark : ""}`} id="settings_container">
					<Accordion transition transitionTimeout={250}>
						<AccordionItem header="1. Загрузка скина" dark={dark} initialEntered>
							<div className={style.import_skin}>
								<p id="error_label" className={style.error_label}></p>
								<label className={style.input_file} id="drop_container">
									<div id="hidable" className={style.hidable}>
										<input type="file" name="imageInput" id="imageInput" accept="image/png" />
										<input type="text" id="nickname" className={style.nickname} placeholder="Введите свой никнейм"
											maxLength={16}
											onBlur={() => parse_nick(setTrigger)}
											onChange={() => {
												let nick = document.getElementById("nickname") as HTMLElement;
												nick.style.borderColor = "#949494";
												let error_label = document.getElementById("error_label") as HTMLElement;
												error_label.style.display = "none";
											}}
										/>
										<span id="select_file">или<br />выберите файл<br />или<br />скиньте его сюда</span>
									</div>
								</label>
								<div className={style.hidable_canvas} id="hidable_canvas" style={{ display: "none" }}>
									<canvas id="original_canvas" width="64" height="64" className={style.original_canvas}></canvas>
									<div className={style.type_selector}>
										<h4 style={{ marginBottom: 0, marginTop: "1rem" }}>Тип скина:</h4>
										<div style={{ display: "flex", alignItems: "center" }}>
											<input type="radio" id="steve" name="skin_type" value="steve" onChange={() => setTrigger(true)} style={{ marginTop: 0 }} />
											<label htmlFor={"steve"}>Стандартный</label>
										</div>

										<div style={{ display: "flex", alignItems: "center" }}>
											<input type="radio" id="alex" name="skin_type" value="alex" onChange={() => setTrigger(true)} style={{ marginTop: 0 }} />
											<label htmlFor={"alex"}>Тонкий</label>
										</div>
									</div>

									<button id="clear_skin" className={style.clear_skin} onClick={() => clear_skin(setTrigger)}>Сбросить скин</button>
								</div>
							</div>
						</AccordionItem>
						<AccordionItem header="2. Стили" dark={dark}>
							<div className={style.styles_main} style={{ paddingBottom: "1rem" }}>
								<p style={{ display: "none" }} className={`trigger ${dark ? "dark" : ""}`}></p>
								<Select<ColourOption>
									defaultValue={shapeColourOptions[0]}
									options={groupedOptions}
									components={{ Group }}
									onChange={update_pepe}
									className={`react-select-container`}
									classNamePrefix="react-select"
									isSearchable={false}
								/>
								{pepe_type.startsWith("pepe") ? <ColorComponent setTrigger={setTrigger} /> : null}
								{pepe_type == "custom_pepe" ? <p className={style.instruction}><a target="_blank" href="https://github.com/Andcool-Systems/pepe_docs/blob/main/README.md">Инструкция</a></p> : null}
								<input type="file" name="custom_pepe" className={style.custom_pepe} id="custom_pepe" accept="image/png" />
								<p id="error_label_pepe" className={style.error_label}></p>
							</div>
						</AccordionItem>

						<AccordionItem header="3. Основные настройки" dark={dark}>
							<div className={style.styles_main} style={{ paddingBottom: "1rem" }}>
								<div className={style.sidebar}>
									<input type="range" id="position" min="0" max="8" step="1" onInput={() => setTrigger(true)} className={style.position} />
									<div className={style.side}>
										<div className={style.layers_div}>
											<div style={{ marginRight: "0.5rem" }}>
												<input type="checkbox" id="first_layer" name="first_layer" onInput={() => setTrigger(true)} />
												<label htmlFor="first_layer">Первый слой</label>
											</div>
											<div>
												<input type="checkbox" id="second_layer" name="second_layer" onInput={() => setTrigger(true)} />
												<label htmlFor="second_layer">Второй слой</label>
											</div>
										</div>
										<div>
											<h3>Слой повязки</h3>
											<select name="layers" id="layers" onChange={() => setTrigger(true)} defaultValue={0}>
												<option value="0">На разных слоях</option>
												<option value="1">Только на первом слое</option>
												<option value="2">Только на втором слое</option>
											</select>
										</div>
										<div>
											<h3>Часть тела</h3>
											<select name="body_part" id="body_part" onChange={() => setTrigger(true)}>
												<option value="0">Левая рука</option>
												<option value="1">Левая нога</option>
												<option value="2">Правая рука</option>
												<option value="3">Правая нога</option>
											</select>
										</div>
									</div>
								</div>
								<div>
									<input type="checkbox" id="clear" name="clear" onInput={() => setTrigger(true)} />
									<label htmlFor="clear">Очистить пиксели на втором слое рядом с повязкой</label>
								</div>

							</div>
						</AccordionItem>
						<AccordionItem header="4. Скачать готовый скин" dark={dark}>
							<div className={style.styles_main} style={{ display: "flex", alignItems: "center", paddingBottom: "1rem" }}>
								<canvas id="result_skin_canvas" width="64" height="64" style={{ width: 64, height: 64 }}></canvas>
								<button onClick={download_skin} className={style.clear_skin} style={{ marginLeft: "5px" }}>Скачать</button>
							</div>
						</AccordionItem>
					</Accordion>
				</div>
				<footer className={dark ? "dark" : ""}>
					<h3>Created by <a href="https://andcool.ru" target="_blank">AndcoolSystems</a><br />Production: <a href="https://vk.com/shapestd" target="_blank">Shape</a> Build: v0.1.7 public-beta</h3>
				</footer>
			</main>
		</body>
	);
}