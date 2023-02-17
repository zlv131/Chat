import {UI} from "./UI.js";

export function changeModal() {
	UI.BTN_SETTINGS.addEventListener('click', () => {
		UI.MODAL_SETTINGS.style.display = 'block';
	})
	
	UI.CLOSE_SETTINGS.addEventListener('click', () => {
		UI.MODAL_SETTINGS.style.display = 'none';
	})
	
	window.addEventListener('click', () => {
		if (event.target == UI.MODAL_SETTINGS) {
			UI.MODAL_SETTINGS.style.display = 'none';
		}
	})
}
