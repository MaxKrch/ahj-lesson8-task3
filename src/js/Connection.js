export default class Connection {
	constructor(url) {
		this.urlHtml = `https://${url}`;
		this.urlSse = `https://${url}/sse`;
		this.contentTypeHeader = {
   		'Content-Type': 'application/json;charset=utf-8'
  	}
	}

	async get(path) {
		try {
			const response = await fetch(`${this.urlHtml}${path}`);

			const data = await response.json();
			return data;
			
		} catch (error) {
			return false;
		}
	}
}