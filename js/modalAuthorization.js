import {UI} from "./UI.js";
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
let formEmail = false;

UI.INPUT_AUTHORIZATION.addEventListener('input', checkInput);

function checkInput(){
	if (isEmailValid(UI.INPUT_AUTHORIZATION.value)) {
		formEmail = true;
	} else {
		formEmail = false;
	}
}

function isEmailValid(value) {
	return EMAIL_REGEXP.test(value);
}

export function changeModalConfirmation(){
	if (Cookies.get('Code') === undefined){
		UI.MODAL_CONFIRMATION.style.display = 'block';
	}
	
	UI.SPAN_CONFIRMATION.addEventListener('click', () => {
		if (UI.INPUT_CONFIRMATION.value === ''){
			return;
		} else {
			UI.MODAL_CONFIRMATION.style.display = 'none';
		}
	})
}

export function changeModalAuthorization(){
	if(Cookies.get('Code') === undefined){
		UI.MODAL_AUTHORIZATION.style.display = 'block';
	}
		UI.BTN_AUTHORIZATION.addEventListener('click', () => {
			if ((UI.INPUT_AUTHORIZATION.value === '') || (formEmail === false)) {
				return;
			} else {
				UI.MODAL_AUTHORIZATION.style.display='none';
				UI.MODAL_CONFIRMATION.style.background = 'rgba(0, 0, 0, 0.65)';
			}
		})
	
		UI.SPAN_AUTHORIZATION.addEventListener('click', () => {
			UI.MODAL_AUTHORIZATION.style.display = 'none';
			UI.MODAL_CONFIRMATION.style.background = 'rgba(0, 0, 0, 0.65)';
		});
}
