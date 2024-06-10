import Connection from './Connection';
import State from './State';
import Render from './Render';
import SSE from './SSE';

export default class App {
	constructor(container, url) {
		this.container = document.querySelector(container);
		this.connect = new Connection(url);
		this.state = new State();
		this.render = new Render(this.container);
		this.stream = new SSE(this.connect.urlSse);

		this.init()
	}

	init() {
		this.addSseEventListener();
	}

	addSseEventListener() {
		this.stream.addSseEventListener('open', this.onSseOpen.bind(this))
		this.stream.addSseEventListener('message', this.onSseMessage.bind(this))
		this.stream.addSseEventListener('error', this.onSseError.bind(this))
	}

	onSseOpen(event) {
		if(!this.state.history.loaded) {
			this.loadHistory();
		}

		if(!this.state.titleMatch.loaded) {
			this.loadTitleMatch();
		}

		this.stream.clearReconnect();
	}

	onSseMessage(event) { 
		if(event.data) {
			this.parsingMessage(event.data);
			this.scrollToEnd()
		}
	}

	onSseError(event) {
		this.stream.reconnect()
	}

	async loadTitleMatch() {
		const data = await this.connect.get('/title');
		if(!data?.success) {
			this.render.showError('Заголовок матча не загрузился, пробую обновить');
			setTimeout(() => {
				this.render.hideError(4000);
				this.loadTitleMatch();
			}, 3000);
			return;
		}
		this.render.addTeamsToTitle(data.teams);	
		this.render.updateScoreToTitle(data.score)
	}

	async loadHistory() {
		const data = await this.connect.get('/history');
		if(!data) {
			this.render.showError('История матча не загрузилась, попробуйте обновить страницу');
			this.render.hideError(3000);
			return;
		}
		this.state.history.loaded = true;
		this.render.addHistoryEventToList(data);
	}

	parsingMessage(message) {
		const mess = JSON.parse(message);
		if(mess.options?.match === 'start') {
			this.render.clearEventsList();
			this.render.updateScoreToTitle({
				home: 0,
				huest: 0,
			})
		}

		if(mess.name === "goal") {
			this.render.updateScoreToTitle(mess.options.score)
		}
		this.render.addEventToList(mess);
	}

	scrollToEnd() {
		const listEvents = this.render.page.listEvents;
		const scroll = listEvents.scrollHeight - listEvents.clientHeight;

		listEvents.scrollTop = scroll;
	}
}