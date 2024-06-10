export default class SSE {
	constructor(url) {
		this.url = url;
		this.sse = null;
		this.sseEventListeners = {
			open: [],
			message: [],
			error: [],
		}

		this.state = {
			reconnect: {
				idTimer: null,
			}
		}

		this.init();
	}

	init() {
		this.createSse()
	}

	registerSseEvents() {
		this.sse.addEventListener('open', (event) => {
			this.sseEventListeners.open.forEach(item => item(event))
		})
		this.sse.addEventListener('message', (event) => {
			this.sseEventListeners.message.forEach(item => item(event))
		})
		this.sse.addEventListener('error', (event) => {
			this.sseEventListeners.error.forEach(item => item(event))
		})
	}

	createSse() {
		this.sse = new EventSource(this.url);
		this.registerSseEvents();
	}

	reconnect() {
		if(this.sse && this.sse.readyState === 1) {
			this.clearReconnect();
		}
		
		if(this.state.reconnect.idTimer) {
				return;
		}
		
		const timer = this.state.reconnect.idTimer;

		this.state.reconnect.idTimer = setInterval((timer) => {
			this.clearSse();
			this.createSse();
		}, 5000, timer)
	}

	addSseEventListener(event, callback) {
		this.sseEventListeners[event].push(callback);
	}

	clearReconnect() {
		if(this.state.reconnect.idTimer) {
			clearTimeout(this.state.reconnect.idTimer);
			this.state.reconnect.idTimer = null;
		}
	}

	clearSse() {
		if(this.sse) {
			this.sse.close();
			this.sse = null;
		}
	}
}