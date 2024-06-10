import moment from 'moment';

export default class Render {
	constructor(container) {
		this.container = container;
		this.page = {
			titleMatch: null,
			errorMessage: null,
			listEvents: null,
		}
		this.teams = {
			home: {
				team: null,
				name: null,
				score: null,
			},
			guest: {
				team: null,
				name: null,
				score: null,
			}
		}
		this.state = {
			error: {
				timer: null,
				active: null,
			} 
		}		
		this.init()
	}

	init() {
		this.renderPage()
	}

	renderPage() {
		const page = document.createElement('div');
		page.classList.add('container', 'container-main');

		const titleMatch = this.renderTitleMatch();
		const errorMessage = this.renderErrorMessage();
		const listEvents = this.renderListEvents();
		
		this.page.titleMatch = titleMatch;
		this.page.errorMessage = errorMessage;
		this.page.listEvents = listEvents;
		
		page.append(titleMatch, errorMessage, listEvents);

		this.saveElementsPage(page);
		this.container.append(page);
	}

	renderTitleMatch() {
		const title = document.createElement('div');
		title.classList.add('score');
		title.dataset.name = 'teams';
		title.innerHTML = `
			<div class="team team-home" data-name="home">
				<span class="team-name" data-name="home-name">
					Home
				</span>
				<span class="team-score" data-name="home-score">
					0
				</span>
			</div>
	
			<div class="space-interval">
				&ndash;
			</div>
	
			<div class="team team-guest" data-name="guest">
				<span class="team-score" data-name="guest-score">
					0
				</span>
				<span class="team-name" data-name="guest-name">
					Guest
				</span>
			</div>
		`
		return title;
	}

	renderErrorMessage() {
		const error = document.createElement('div');
		error.classList.add('error')
		return error;
	}

	renderListEvents() {
		const list = document.createElement('ul');
		list.classList.add('list-events');
		list.dataset.name = 'events';

		return list;
	}

	saveElementsPage(page) {
		this.teams.home.team = page.querySelector('[data-name="home"]');
		this.teams.home.name = page.querySelector('[data-name="home-name"]');
		this.teams.home.score = page.querySelector('[data-name="home-score"]');
	
		this.teams.guest.team = page.querySelector('[data-name="guest"]');
		this.teams.guest.name = page.querySelector('[data-name="guest-name"]');
		this.teams.guest.score = page.querySelector('[data-name="guest-score"]');
	}

	renderEvent(event) {
		const newEvent = document.createElement('li');
		const time = moment(event.time).locale('ru').format('HH:mm:ss DD.MM');
		newEvent.classList.add(`event`, `event-${event.name}`);
		newEvent.innerHTML = `
			<div class="event-time">
		 		${time}
		 	</div>
			<div class="event-descr event-descr__${event.name}">
		 		${event.text}
			</div>
		`
		return newEvent;
	}

	clearEventsList() {
		this.page.listEvents.innerHTML = '';
	}

	addEventToList(event) {
		const newEvent = this.renderEvent(event);
		this.page.listEvents.append(newEvent);
	}

	addHistoryEventToList(history) {
		const events = [];

		for(let event of history) {
			const newEvent = this.renderEvent(event);
			events.push(newEvent);
		}

		this.page.listEvents.prepend(...events)
		}

	addTeamsToTitle(teams) {
		this.teams.home.name.textContent = teams.home;
		this.teams.guest.name.textContent = teams.guest;
	}

	updateScoreToTitle(score) {
		this.teams.home.score.textContent = score.home;
		this.teams.guest.score.textContent = score.guest;
	}

	showError(message) {
		if(this.state.error.active) {
			setTimeout((message) => {
				this.showError(message)
			}, 3000)

			return;
		}
		this.page.errorMessage.textContent = message;
		this.state.error.active = null;
	}

	hideError(time = 0) {
		if(this.state.error.timer) {
			clearTimeout(this.state.error.timer);
			this.state.error.timer = null;
		}

		this.state.error.timer = setTimeout(() => { 
	 		this.page.errorMessage.textContent = '' 
	 	}, time);
	}
}