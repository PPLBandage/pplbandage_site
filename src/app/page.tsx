"use client";

import { Context } from "vm";
import React from 'react';
import { useEffect, useState, useRef } from 'react';

import style from "./styles/root/page.module.css";
import { bandage_load, crop_pepe, clear, fill_bandage, load_custom } from "./bandage_manager";
import "./styles/root/style.css";
import { ColourOption, shapeColourOptions, groupedOptions } from "./data";

import { ControlledAccordion, AccordionItem as Item, useAccordionProvider } from "@szhsin/react-accordion";
import axios from "axios";
import { ChromePicker } from 'react-color';
import Select, { ActionMeta, GroupBase, GroupProps, components } from 'react-select';
import { WalkingAnimation, IdleAnimation, SkinViewer } from "skinview3d";
import { Cookies, useCookies } from 'next-client-cookies';

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

function handleImageChange(event: { target: any; }, rerender: any) {
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
			rerender();
		};
		reader.readAsDataURL(file);
	}
}

async function parse_nick(new_value: ColourOption, 
						actionMeta: ActionMeta<ColourOption>, 
						rerender: (arg0: Boolean) => void,
						set_nick_value: React.Dispatch<React.SetStateAction<{value: string, label: string}>>,
						set_loading: React.Dispatch<React.SetStateAction<Boolean>>,
						skinViewer: React.MutableRefObject<SkinViewer>){
	const canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
	const nickname = new_value;
	const ctx = canvas.getContext('2d', { willReadFrequently: true }) as Context;
	const error_label = document.getElementById('error_label') as HTMLCanvasElement;
	set_nick_value( {value: nickname.value, label: nickname.value} );
	if (!nickname.value) return;

	const img = new Image();
	img.onload = function () {
		if (img.height == 32) {
			error_label.innerHTML = "Ваш скин имеет формат до версии 1.8";
			error_label.style.display = "block";
			return;
		}
		error_label.style.display = "none";
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Отрисовка изображения на canvas
		ctx.drawImage(img, 0, 0);
		var pixelData = ctx.getImageData(46, 52, 1, 1).data;
		(document.getElementById(pixelData[3] == 255 ? "steve" : "alex") as HTMLInputElement).checked = true;
		rerender(true);

		const result_canvas = document.getElementById('hidable_canvas') as HTMLCanvasElement;
		result_canvas.style.display = "inline-flex";

		const select_file = document.getElementById('drop_container') as HTMLSpanElement;
		select_file.style.display = "none";

		const nick = document.getElementById("nick_input");
		nick.style.display = "none"
	};
	try {
		set_loading(true);
		const response = await axios.get("https://skinserver.pplbandage.ru/skin/" + nickname.value + "?cape=true");
		img.crossOrigin = "Anonymous";
		img.src = "data:image/png;base64," + response.data.data.skin;
		if (response.data.data.cape === "") 
			skinViewer.current.resetCape();
		else
			skinViewer.current.loadCape("data:image/png;base64," + response.data.data.cape);
	} catch (e) {
		if (e.response && e.response.status == 404) {
			error_label.innerHTML = "Игрок с таким никнеймом не найден!";
			error_label.style.display = "block";
			return;
		}
	}
	finally{
		set_loading(false);
	}

}

const get_skin_type = () => {
	const inp = document.getElementsByName('skin_type') as NodeListOf<HTMLInputElement>;
	for (let i = 0; i < inp.length; i++) {
		if (inp[i].type == "radio" && inp[i].checked) {
			return inp[i].value;
		}
	}
}

interface ColorComponentProps {
	rerender: (arg0: boolean) => void;
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
		const color_btn = document.getElementById("color_button") as HTMLSpanElement;
		color_btn.style.backgroundColor = color.hex;
		this.setState({ background: color.hex });
		this.props.rerender(true);
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
					<div style={{colorScheme: "light"}}>
						<ChromePicker
							color={this.state.background}
							onChange={this.handleChange}
							disableAlpha={true}
							
						/>
					</div>
				</div> : null}
			</>
		);
	}
}

const download_skin = () => {
	const link = document.createElement('a');
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
		contentProps={{ className: ({ isEnter }) => `${style.itemContent} ${!isEnter ? style.not_enter : ""}`}}
		panelProps={{ className: style.itemPanel }}
	/>
);

const clear_skin = (rerender: () => void, 
					set_nick_value: React.Dispatch<React.SetStateAction<{value: string, label: string}>>, 
					skinViewer: React.MutableRefObject<SkinViewer>) => {
	const skin = new Image(); // Create new img element
	skin.src = "./static/steve.png"; // Set source path

	skin.onload = () => {
		const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
		const ctx = skin_canvas.getContext('2d', { willReadFrequently: true }) as Context;

		ctx.clearRect(0, 0, 64, 64);
		ctx.drawImage(skin, 0, 0);
		ctx.beginPath();

		const result_canvas = document.getElementById('hidable_canvas') as HTMLCanvasElement;
		result_canvas.style.display = "none";

		const select_file = document.getElementById('drop_container') as HTMLSpanElement;
		select_file.style.display = "inline-flex";

		const nick = document.getElementById("nick_input");
		nick.style.display = "block";

		set_nick_value({value: "no_data", label: "Введите никнейм"});

		(document.getElementById("steve") as HTMLInputElement).checked = false;
		(document.getElementById("alex") as HTMLInputElement).checked = false;
		skinViewer.current.resetCape();
		rerender();
	};
}

const change_theme = (dark: Boolean,
						set_dark: React.Dispatch<React.SetStateAction<Boolean>>, 
						cookies: Cookies, 
						skinViewer: React.MutableRefObject<SkinViewer>) => {
	cookies.set('dark', String(dark), { expires: (365 * 10) })
	document.body.style.colorScheme = dark ? "dark" : "light";
	skinViewer.current.loadPanorama(`./static/panorama${dark ? "_dark" : ""}.png`);
	set_dark(dark);
}

export default function Home() {
	const cookies = useCookies();
	const [nick_value, set_nick_value] = useState({value: "no_data", label: "Введите никнейм"});
	const [dark, set_dark] = useState(cookies.get("dark") === "true");
	const [input_value, set_input_value] = useState("");
	const [pepe_type, set_pepe_type] = useState("");
	const [nicknames, set_nicknames] = useState([]);
	const [loading, set_loading] = useState(false);
	const skinViewer = useRef<SkinViewer>();

	const providerValue = useAccordionProvider({
		allowMultiple: false,
		transition: true,
		transitionTimeout: 250
	  });
	  // Destructuring `toggle` and `toggleAll` from `providerValue`
	  const { toggle, toggleAll } = providerValue;

	const update_pepe = (new_value: ColourOption, actionMeta: ActionMeta<ColourOption>) => {
		set_pepe_type(new_value.value);
		let custom_pepe = document.getElementById('custom_pepe') as HTMLInputElement;
		if (new_value.value == "not_set"){
			rerender(false);
		}else if (new_value.value != "custom_pepe") {
			bandage_load(rerender, new_value.value);
			custom_pepe.style.display = "none";
			rerender(true);
		} else {
			custom_pepe.style.display = "block";
			rerender(true);
		}
		
	}

	useEffect(() => {
		let input = document.getElementById('imageInput') as HTMLInputElement;
		input.addEventListener('change', (event) => handleImageChange(event, rerender));

		let custom_pepe = document.getElementById('custom_pepe') as HTMLInputElement;
		custom_pepe.addEventListener('change', (event) => load_custom(event, rerender));

		let canvas = document.getElementById("skin_container") as HTMLCanvasElement;
		skinViewer.current = new SkinViewer({
			canvas: canvas,
			skin: "./static/steve.png"
		});
		skinViewer.current.animation = new WalkingAnimation();
		skinViewer.current.controls.enablePan = true;
		skinViewer.current.fov = 90;
		skinViewer.current.animation.speed = 0.65;
		skinViewer.current.camera.position.x = 20;
		skinViewer.current.camera.position.y = 15;
		skinViewer.current.globalLight.intensity = 2.5;
		const viewportWidth = document.documentElement.clientWidth;
		const viewportHeight = document.documentElement.clientHeight;
		let container = document.getElementById("settings_container") as HTMLDivElement;

		if (viewportWidth >= 768) {

			skinViewer.current.width = viewportWidth * 0.75;
			skinViewer.current.height = viewportHeight;

			container.style.width = Math.round(viewportWidth / 4) + "px";
			container.style.height = Math.round(viewportHeight) + "px";
		} else {
			skinViewer.current.width = Math.round(viewportWidth) + 0.1;
			skinViewer.current.height = Math.round(viewportWidth * 0.7) + 0.1;
			container.style.width = Math.round(viewportWidth) + "px";
		}

		let dark_local = cookies.get("dark");
		if (dark_local == null) {
			let system_theme = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
			cookies.set("dark", String(system_theme), { expires: (365 * 10) });
			change_theme(system_theme, set_dark, cookies, skinViewer);
		} else change_theme(dark_local == "true", set_dark, cookies, skinViewer);

		const skin = new Image(); // Create new img element
		skin.src = "./static/steve.png"; // Set source path

		skin.onload = () => {
			const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
			const ctx = skin_canvas.getContext('2d', { willReadFrequently: true }) as Context;

			ctx.drawImage(skin, 0, 0);
			ctx.beginPath();
			rerender(false);
		};

		window.addEventListener("resize", () => {
			const viewportWidth = document.documentElement.clientWidth;
			const viewportHeight = document.documentElement.clientHeight;
			let container = document.getElementById("settings_container") as HTMLDivElement;

			if (viewportWidth >= 768) {

				skinViewer.current.width = Math.round(viewportWidth * 0.75) + 0.1;
				skinViewer.current.height = Math.round(viewportHeight);

				container.style.width = Math.round(viewportWidth / 4) + "px";
				container.style.height = Math.round(viewportHeight) + "px";
			} else {
				skinViewer.current.width = Math.round(viewportWidth) + 0.1;
				skinViewer.current.height = Math.round(viewportWidth * 0.7) + 0.1;

				container.style.width = Math.round(viewportWidth) + "px";
			}
			rerender();
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


		//(document.getElementById("clear") as HTMLInputElement).checked = true;
		(document.getElementById("first_layer") as HTMLInputElement).checked = true;
		(document.getElementById("second_layer") as HTMLInputElement).checked = true;
		set_nicknames([{value: "no_data", label: "Введите никнейм", isDisabled: true}]);
		console.log("%cТы думал тут что-то будет?", "background: none; color: red; font-size: x-large; font-weight: 800");
		console.log("%cОооо, нет, тут нет ничего, закрывай, закрывай консоль и иди в баню", "font-weight: 800");
	}, [])

	const rerender = (pepe_setted = true) => {
		const canvas = document.getElementById('result_skin_canvas') as HTMLCanvasElement;
		const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
		const bandage_canvas = document.getElementById('pepe_original_canvas') as HTMLCanvasElement;
		const lining_canvas = document.getElementById('lining_original_canvas') as HTMLCanvasElement;

		const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(skin_canvas, 0, 0);

		const height = Math.max(bandage_canvas.height, lining_canvas.height);
		(document.getElementById('position') as HTMLInputElement).max = (12 - height) + "";
		const slim = get_skin_type() == 'alex' ? true : false;
		const body_part = parseInt((document.getElementById('body_part') as HTMLInputElement).value);
		const position = (12 - height) - parseFloat((document.getElementById('position') as HTMLInputElement).value);
		const clear_pix = (document.getElementById('clear') as HTMLInputElement).checked;

		let pepe = crop_pepe(bandage_canvas, slim, height, body_part);
		let cropped_pepe = document.createElement("canvas") as HTMLCanvasElement;
		cropped_pepe.width = 16;
		cropped_pepe.height = height;
		const ctx_pepe = cropped_pepe.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

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

		if (pepe_setted && clear_pix)
			clear(canvas, body_part_x_overlay[body_part], body_part_y_overlay[body_part] + position, height);

		const coef = slim && (body_part == 0 || body_part == 2) ? 1 : 0;
		ctx_pepe.drawImage(pepe, coef, 0, pepe.width - coef, height, 0, 0, pepe.width - coef, height);
		ctx_lining.drawImage(lining, coef, 0, lining.width - coef, height, 0, 0, lining.width - coef, height);

		const first_layer = document.getElementById("first_layer") as HTMLInputElement;
		const second_layer = document.getElementById("second_layer") as HTMLInputElement;

		const layers = (document.getElementById("layers") as HTMLSelectElement).value;
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

		if (pepe_setted && first_layer.checked)
			ctx.drawImage(cropped_lining,
						  first_x, first_y + position);

		if (pepe_setted && second_layer.checked)
			ctx.drawImage(cropped_pepe,
						  overlay_x, overlay_y + position);
		skinViewer.current.loadSkin(canvas.toDataURL(), { model: slim ? "slim" : "default" });
	}

	const fetch_nicknames = (nickname: string) => {
		if (nickname.length >= 16){
			nickname = nickname.slice(0, 16);
		}
		set_input_value(nickname);
		if (nickname.length == 0){
			set_nicknames([{ value: "no_data", label: "Введите никнейм", isDisabled: true }]);
			return;
		}

		set_nicknames([{ value: nickname, label: <b>{nickname}</b> }]);
		if (nickname.length == 17) return;
		
		if (nickname.length >= 2){
			set_loading(true);
			axios.get("https://skinserver.pplbandage.ru/search/" + nickname).then(response => {
				if (response.status == 200){
					const data = response.data.data.map((nick: string) => {
						const first_pos = nick.toLowerCase().indexOf(nickname.toLowerCase());
						const first = nick.slice(0, first_pos);
						const middle = nick.slice(first_pos, first_pos + nickname.length);
						const last = nick.slice(first_pos + nickname.length, nick.length);
						return {value: nick, label: <>{first}<b>{middle}</b>{last}</>}
					});
					set_nicknames([{ value:  response.data.requestedFragment, label: <b>{response.data.requestedFragment}</b> }, { label: 'Совпадения', options: data }]);
				}
			}).finally(() => set_loading(false))
		}
	}

	return (
		<body className={dark ? "dark" : ""} style={{ colorScheme: dark ? "dark" : "light" }}>
			<main className={`${style.main} ${dark ? style.dark : ""}`}>
				<meta name="description" content="Повязка Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!" />
				<link rel="shortcut icon" href="/static/icons/icon.svg" type="image/svg+xml"></link>
				<link rel="preload" href="./static/icons/moon.svg" as="image" />
				<link rel="preload" href="./static/icons/sun.svg" as="image" />
				<canvas id="pepe_original_canvas" style={{ display: "none" }} height="4"></canvas>
				<canvas id="lining_original_canvas" style={{ display: "none" }} height="4"></canvas>
				<canvas id="skin_container" className={style.render_canvas}></canvas>
				<button id="theme_swapper" className={`${style.theme_swapper} ${dark ? style.dark : ""}`} onClick={() => change_theme(!dark, set_dark, cookies, skinViewer)}>
					<img src={dark ? "./static/icons/moon.svg" : "./static/icons/sun.svg"} id="sun" alt="theme swapper"/>
				</button>

				<div className={`${style.settings_container} ${dark ? style.dark : ""}`} id="settings_container">
					<ControlledAccordion providerValue={providerValue}>
						<AccordionItem header="1. Загрузка скина" dark={dark} initialEntered itemKey="item-1">
							<div className={style.styles_main}>
								<p id="error_label" className={style.error_label}></p>
								<p style={{ display: "none" }} className={`trigger ${dark ? "dark" : ""}`}></p>
								<Select
									options={nicknames}
									className={`react-select-container`}
									classNamePrefix="react-select"
									isSearchable={true}
									onInputChange={fetch_nicknames}
									inputValue={input_value}
									onChange={(new_value: ColourOption, actionMeta: ActionMeta<ColourOption>) => parse_nick(new_value, actionMeta, rerender, set_nick_value, set_loading, skinViewer)}
									isLoading={loading}
									id="nick_input"
									value={nick_value}
								/>
								<div style={{width: "100%"}}>
									<label className={style.input_file} id="drop_container" style={{marginTop: "1rem"}}>
										<div id="hidable" className={style.hidable}>
											<input type="file" name="imageInput" id="imageInput" accept="image/png" />
											<span id="select_file">Выберите файл<br />или<br />скиньте его сюда</span>
										</div>
									</label>
							
									<div className={`${style.input_file} ${style.hidable_canvas}`} id="hidable_canvas" style={{ display: "none" }}>
										<canvas id="original_canvas" width="64" height="64" className={style.original_canvas}></canvas>
										<div className={style.type_selector}>
											<h4 style={{ marginBottom: 0, marginTop: "1rem" }}>Тип скина:</h4>
											<div style={{ display: "flex", alignItems: "center" }}>
												<input type="radio" id="steve" name="skin_type" value="steve" onChange={() => rerender()} style={{ marginTop: 0 }} />
												<label htmlFor={"steve"}>Стандартный</label>
											</div>

											<div style={{ display: "flex", alignItems: "center" }}>
												<input type="radio" id="alex" name="skin_type" value="alex" onChange={() => rerender()} style={{ marginTop: 0 }} />
												<label htmlFor={"alex"}>Тонкий</label>
											</div>
										</div>

										<button id="clear_skin" className={`${style.clear_skin} ${dark ? style.dark : ""}`} onClick={() => clear_skin(rerender, set_nick_value, skinViewer)}>Сбросить скин</button>
									</div>
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
								{pepe_type.startsWith("pepe") ? <ColorComponent rerender={rerender} /> : null}
								{pepe_type == "custom_pepe" ? <p className={`${style.instruction} ${style.dark}`}><a target="_blank" href="https://github.com/Andcool-Systems/pepe_docs/blob/main/README.md">Инструкция</a></p> : null}
								<input type="file" name="custom_pepe" className={style.custom_pepe} id="custom_pepe" accept="image/png" />
								<p id="error_label_pepe" className={style.error_label}></p>
							</div>
						</AccordionItem>

						<AccordionItem header="3. Основные настройки" dark={dark}>
							<div className={style.styles_main} style={{ paddingBottom: "1rem" }}>
								<div className={style.sidebar}>
									<input type="range" id="position" min="0" max="8" step="1" onInput={() => rerender()} className={style.position} />
									<div className={style.side}>
										<div className={style.layers_div}>
											<div style={{ marginRight: "0.5rem" }}>
												<input type="checkbox" id="first_layer" name="first_layer" onInput={() => rerender()} />
												<label htmlFor="first_layer">Первый слой</label>
											</div>
											<div>
												<input type="checkbox" id="second_layer" name="second_layer" onInput={() => rerender()} />
												<label htmlFor="second_layer">Второй слой</label>
											</div>
										</div>
										<div>
											<h3>Слой повязки</h3>
											<select name="layers" id="layers" onChange={() => rerender()} defaultValue={0}>
												<option value="0">На разных слоях</option>
												<option value="1">Только на первом слое</option>
												<option value="2">Только на втором слое</option>
											</select>
										</div>
										<div>
											<h3>Часть тела</h3>
											<select name="body_part" id="body_part" onChange={() => rerender()}>
												<option value="0">Левая рука</option>
												<option value="1">Левая нога</option>
												<option value="2">Правая рука</option>
												<option value="3">Правая нога</option>
											</select>
										</div>
									</div>
								</div>
								<div>
									<input type="checkbox" id="clear" name="clear" onInput={() => rerender()} />
									<label htmlFor="clear">Очистить пиксели на втором слое рядом с повязкой</label>
								</div>

							</div>
						</AccordionItem>
						<AccordionItem header="4. Скачать готовый скин" dark={dark}>
							<div className={style.styles_main} style={{ display: "flex", alignItems: "center", paddingBottom: "1rem" }}>
								<canvas id="result_skin_canvas" width="64" height="64" style={{ width: 64, height: 64 }}></canvas>
								<div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
									<button onClick={download_skin} className={`${style.clear_skin} ${dark ? style.dark : ""}`} style={{ marginLeft: "5px" }}>Скачать</button>
									<button onClick={() => {
											const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
											const out_canvas = document.getElementById("result_skin_canvas") as HTMLCanvasElement;
											const ctx = skin_canvas.getContext('2d', { willReadFrequently: true }) as Context;

											ctx.clearRect(0, 0, 64, 64);
											ctx.drawImage(out_canvas, 0, 0);
											ctx.beginPath();
											toggle('item-1', true);
										}
									} className={`${style.clear_skin} ${dark ? style.dark : ""}`} style={{ marginLeft: "5px" }}>Использовать этот скин как исходный</button>
								</div>
							</div>
						</AccordionItem>
					</ControlledAccordion>
				</div>
				<footer className={dark ? "dark" : ""}>
					<h3>Created by <a href="https://andcool.ru" target="_blank">AndcoolSystems</a><br />Production: <a href="https://vk.com/shapestd" target="_blank">Shape</a> Build: v0.1.9</h3>
				</footer>
			</main>
		</body>
	);
}