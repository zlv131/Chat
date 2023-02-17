import {changeModal} from "./modalSettings.js";
import {changeModalAuthorization, changeModalConfirmation} from "./modalAuthorization.js";
import {UI} from "./UI.js";
import {getEmail, sendCodeToEmail, processingEmail, getNickname, changeNickname, processingNickname, checkToken, getHistoryOfChat, generateSMS, printMessage} from "./requests.js";

const socket = new WebSocket(`wss://edu.strada.one/websockets?${Cookies.get('Code')}`);

changeModal();
changeModalAuthorization();
changeModalConfirmation();
getHistoryOfChat(false);

UI.BUTTON_SEND.addEventListener('click', sendMessageToServer);
UI.FORM.addEventListener('submit', sendMessageToServer);
UI.BUTTON_AUTHORIZATION.addEventListener('click', processingEmail);
UI.BUTTON_CONFIRMATION.addEventListener('click', processingCode);
UI.BUTTON_SETTINGS.addEventListener('click', processingNickname);
UI.BUTTON_EXIT.addEventListener('click', exit)

function processingCode(){
	saveCodeToCookie(getCode(event));
	getHistoryOfChat(false);
}

function getCode(event){
	event.preventDefault();
	const code = UI.INPUT_CONFIRMATION.value;
	UI.INPUT_CONFIRMATION.value = '';
	return code;
}

function saveCodeToCookie(code){
	if (code === ''){
		return;
	} else {
		Cookies.set('Code', code, {expires: 3});
		UI.INPUT_CONFIRMATION.value = '';
	}
}

function sendMessageToServer(event){
	event.preventDefault();
	let message = UI.INPUT.value;
	socket.send(JSON.stringify({ text: message }));
}

socket.onmessage = function(event) {
	let token = Cookies.get('Code');
	if (checkToken(token) === true) return;
	const messages = JSON.parse(event.data);
	getHistoryOfChat(true)
};

function exit(){
	Cookies.remove('Code');
	Cookies.remove('name');
	location.reload();
}
