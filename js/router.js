var Router = {
	routes: [],
	currentRoute: '',
	root: '/',
	notFoundFunction: null,
	hookFunctions: {}, // hooks that are called for each route, functions for 'before' and 'after'.
	config: function(options) {
		this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
		return this;
	},
	getURL: function() { // get's current query string/hash & clears slashes from beginning and end, Note: only for initial load
		var url = '';
		url = window.location.search.replace(/&wrapper_nonce=([A-Za-z0-9]+)/, "").replace(/\?\//, '');
		return this.clearSlashes(url);
	},
	clearSlashes: function(path) {
		return path.toString().replace(/\/$/, '').replace(/^\//, '');
	},
	add: function(path, controller) {
		if (typeof path == 'function') {
			controller = path;
			path = '';
		}
		this.routes.push({ path: path, controller: controller });
		return this;
	},
	remove: function(param) {
		for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
			if (r.controller === param || r.path.toString() === param.toString()) {
				this.routes.splice(i, 1);
				return this;
			}
		}
		return this;
	},
	flush: function() {
		this.routes = [];
		this.root = '/';
		return this;
	},
	check: function(hash) {
		var reg, keys, match, routeParams;
		for (var i = 0, max = this.routes.length; i < max; i++ ) {
			routeParams = {}
			keys = this.routes[i].path.match(/:([^\/]+)/g);
			match = hash.match(new RegExp(this.routes[i].path.replace(/:([^\/]+)/g, "([^\/]*)").replace(/\*/g, '(?:.*)') + '(?:\/|$)'));
			if (match) {
				match.shift();
				match.forEach(function (value, i) {
					routeParams[keys[i].replace(":", "")] = value;
				});
				if (this.hookFunctions) { // TODO: Move this into navigate function?
					if (this.hookFunctions["before"] && !this.hookFunctions["before"].call({}, this.routes[i].path, routeParams)) {
						page.cmd('wrapperPushState', [{"route": this.currentRoute}, null, this.root + this.clearSlashes(this.currentRoute)]);
						return this;
					}
				}
				this.currentRoute = this.routes[i].path;
				window.scroll(window.pageXOffset, 0);
				this.routes[i].controller.call({}, routeParams);
				if (this.hookFunctions) {
					if (this.hookFunctions["after"]) {
						this.hookFunctions["after"].call({}, this.currentRoute, routeParams);
					}
				}
				return this;
			}
		}
		// TODO: Call Not Found route
		/*console.log(this.notFoundFunction);
		if (this.notFoundFunction) {
			this.notFoundFunction.call({}, routeParams);
		}*/
		return this;
	},
	refresh: function() { // Refreshes the current route - reruns the route's controller function
		this.check(this.currentRoute);
		return this;
	},
	listenForBack: function(cmd, message) { // Note: Call in the OnRequest function in ZeroFrame class.
		if (!cmd) console.log("[Router] Please pass in cmd and message into Router.listenForBack function");
		if (cmd == "wrapperPopState") {
			if (message.params.state) {
				if (!message.params.state.url) {
					message.params.state.url = message.params.href.replace(/.*\?/, "");
				}
				this.navigate(message.params.state.url.replace(/^\//, ''));
			}
		}
	},
	navigate: function(path) {
		var previousRoute = this.currentRoute;
		if (this.hookFunctions) {
			if (this.hookFunctions["leave"]) {
				this.hookFunctions["leave"].call({}, previousRoute);
			}
		}

		path = path ? path : '';
		page.cmd('wrapperPushState', [{"route": path}, null, this.root + this.clearSlashes(path)]);
		this.check(path);
		return this;
	},
	hooks: function(hookFunctions) { // TODO: Check if using correct format?
		this.hookFunctions = hookFunctions;
		return this;
	},
	notFound: function(f) {
		if (f && typeof f === 'function') {
			this.notFoundFunction = f;
		}
		return this;
	}
}

// Note: Call right after creating all of your routes.
Router.init = function() {
	Router.check(Router.getURL());
}

// Returns a string with the html for a link that will call the Router.navigate function when clicked.
// Example:
//   content += generateRouteLinkHTML('tutorials/' + tutorial.slug, tutorial.name, 'button is-info', 'margin-left: 30px;') + "<br>";
function generateRouteLinkHTML(to, display, tagClass = "", tagStyle = "") {
	var link = '<a href="./?/' + to + '" onclick="Router.navigate(\'' + to + '\'); event.preventDefault();"';
	if (tagClass && tagClass != "") {
		link += ' class="' + tagClass + '"';
	}
	if (tagStyle && tagStyle != "") {
		link += ' style="' + tagStyle + '"';
	}
	link += '>' + display + '</a>';
	return link;
}

function test() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
   	//loadTutorial(urlParams['t']);
}