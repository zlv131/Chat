import {UI} from "./UI.js";

let statusSending = false;
let historyOfChat;

const URL = {
	POST: 'https://edu.strada.one/api/user',
	PATCH: 'https://edu.strada.one/api/user',
	GET: 'https://edu.strada.one/api/user/me',
	GET_HISTORY: 'https://edu.strada.one/api/messages/'
};

export function checkToken(token){
	if (token === undefined){
		return true;
	}
}

export function processingEmail(){
	sendCodeToEmail(getEmail(event));
}

export function getEmail(event){
	event.preventDefault();
	const email = UI.INPUT_AUTHORIZATION.value;
	UI.INPUT_AUTHORIZATION.value = '';
	return email;
}

export async function sendCodeToEmail(email){
	if (email === ''){
		return;
	} else {
		try {
			const response = await fetch(URL.POST, {
				method: 'POST',
				headers: {'Content-Type': 'application/json;charset=utf-8'},
				body: JSON.stringify({email: email})
			});
			
			if (response.ok) {
				const json = await response.json();
			}
		} catch (err) {
			alert(err);
		}
	}
}

export function processingNickname(){
	changeNickname(getNickname(event));
}

export function getNickname(event){
	event.preventDefault();
	const nickname = UI.INPUT_SETTINGS.value;
	Cookies.set('name', nickname, {expires: 100});
	return nickname;
}

export async function changeNickname(nickname){
	const token = Cookies.get('Code');
	if (nickname === '') {
		return;
	} else {
		try{
			if (checkToken(token) === true) return;
			
			let response = await fetch(URL.PATCH, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({name: nickname})
			});
			if (response.ok) {
				const json = await response.json();
			}
		} catch (err){
			alert(err);
		}
		try{
			if (checkToken(token) === true) return;
			
			let response = await fetch(URL.GET, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			if (response.ok){
				let json = await response.json();
			}
		}  catch (err) {
			alert(err);
		}
	}
	location.reload();
}

export async function getHistoryOfChat(status = true){
	try{
		const token = Cookies.get('Code');
		if (checkToken(token) === true) return;
		
		let response = await fetch(URL.GET_HISTORY, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		if (response.ok) {
			let json = await response.json();
			if (status === true) {
				generateSMS(json.messages[0].text, json.messages[0].user.name, json.messages[0].createdAt, false);
				scrollToBottom();
			} else {
				saveHistoryOfChat(json.messages);
				printMessage(historyOfChat);
			}
		}
	}
	catch(err) {
		alert(err);
	}
}

export function printMessage(arr){
	let newHistory = historyOfChat.splice(0, 20);
	if (statusSending === false) {
		for (let i = newHistory.length - 1; i >= 0; i--) {
			generateSMS(newHistory[i].text, newHistory[i].user.name, newHistory[i].createdAt, statusSending);
			scrollSavePosition()
		}
	} else {
		for (let i = 0; i < 19; i++) {
			generateSMS(newHistory[i].text, newHistory[i].user.name, newHistory[i].createdAt, statusSending);
			scrollSavePosition()
		}
	}
	if (historyOfChat.length === 0) {
		createLastBlockMessage();
	}
	statusSending = true;
}


export function generateSMS(message, name, date, statusSending){
	if (message === '') {
		return;
	}
	let newDate = date.slice(11, 16);
	
	const nodeMessage = UI.TEMPLATE.content.cloneNode(true);
	const blockMessage = nodeMessage.querySelector('div');
	blockMessage.className = 'chat__cardSMS';
	blockMessage.textContent = message;
	
	const nodeDate = UI.TEMPLATE_DATE.content.cloneNode(true);
	const blockDate = nodeDate.querySelector('div');
	blockDate.textContent = newDate;
	blockDate.className = 'chat__date';
	
	const nodeName = UI.TEMPLATE_NAME.content.cloneNode(true);
	const blockName = nodeName.querySelector('div');
	blockName.textContent = name;
	blockName.className = 'chat__name';
	
	if (name === Cookies.get('name')){
		blockMessage.className = 'chat__myCardSMS';
		blockName.className = 'chat__myName';
		blockDate.className = 'chat__myDate';
	}
	
	if (statusSending === false) {
		UI.CHAT.append(blockMessage);
	} else {
		UI.CHAT.prepend(blockMessage);
	}
	
	blockMessage.append(blockDate);
	blockMessage.prepend(blockName);
	
	UI.INPUT.value = '';
}

function scrollToBottom(){
	UI.CHAT.scrollTop = UI.CHAT.scrollHeight;
}

function scrollSavePosition(){
	UI.CHAT.scrollTo(0, 1490)
}

function saveHistoryOfChat(objMessage){
	historyOfChat = objMessage;
	console.log(historyOfChat);
}

UI.CHAT.addEventListener('scroll', () => {
	if (UI.CHAT.scrollTop === 0) {
		printMessage(historyOfChat)
	}
})

function createLastBlockMessage(){
	const lastBlockMessage = document.createElement('div');
	lastBlockMessage.textContent = 'Вся история чата загружена';
	lastBlockMessage.className = 'lastBlockMessage';
	UI.CHAT.prepend(lastBlockMessage);
}