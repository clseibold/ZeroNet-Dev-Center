Vue.component('my-hero', {
	props: ['title', 'subtitle'],
	template: '\
		<section class="hero is-dark is-bold">\
			<div class="hero-head" v-once>\
	    		<header class="nav">\
	    			<div class="container">\
	    				<div class="nav-left">\
	    					<a href="/13spciiqdBgsrhkWxghapiF1F4gNYDwgbS/" class="nav-item" style="font-weight: bold;">ZeroNet Dev Center</a>\
	    				</div>\
\
	    				<!-- This "nav-toggle" hamburger menu is only visible on mobile -->\
	    				<!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->\
	    				<span id="nav-toggle" class="nav-toggle">\
	    					<span></span>\
	    					<span></span>\
	    					<span></span>\
	    				</span>\
\
	    				<!-- This "nav-menu" is hidden on mobile -->\
	    				<!-- Add the modifier "is-active" to display it on mobile -->\
	    				<div id="nav-menu" class="nav-right nav-menu">\
	    					<a href="?Home" class="nav-item is-active">Home</a>\
	    					<a href="/13spciiqdBgsrhkWxghapiF1F4gNYDwgbS/tutorials/" class="nav-item">Tutorials</a>\
	    					<a href="?About" class="nav-item">About</a>\
	    					<!--<a class="nav-item">Questions</a>-->\
	    					<span class="nav-item"><a href="#Select+user" id="select_user" class="button is-info" onclick="return page.selectUser()">Select user</a></span>\
	    				</div>\
	    			</div>\
	    		</header>\
	    	</div>\
	    	<div class="hero-body">\
			    <div class="container has-text-centered">\
			      <h1 class="title">\
			        {{ title }}\
			      </h1>\
			      <h2 class="subtitle">\
			        {{ subtitle }}\
			      </h2>\
			      <slot></slot>\
			    </div>\
			</div>\
		</section>'
});

Vue.component('my-footer', {
	template: '\
		<footer class="footer" v-once>\
			<div class="container">\
				<span style="text-align: center">\
					<small>NOTE: This zite is still a work-in-progress.</small><br>\
					<small>Zite created on July 21st, 2017 by <a href="/Me.ZeroNetwork.bit/?Profile/12h51ug6CcntU2aiBjhP8Ns2e5VypbWWtv/12gAes6NzDS9E2q6Q1UXrpUdbPS6nvuBPu/krixano@zeroid.bit">krixano@zeroid.bit</a> (Christian Seibold)</small><br>\
					<small><a href="https://github.com/krixano/ZeroNet-Dev-Center">Github Link</a></small>\
				</span>\
			</div>\
		</footer>'
});

Vue.component('my-body', {
	computed: {
		ViewComponent () {
			for (r in routes) {
				if (r in urlParams) {
					// TODO(krixano): OnSwitch/Init function to setup ZeroNet stuff for the page (pass in the current route's name)
					return routes[r];
				}
			}
			return Home;
		}
	},
	render (h) { return h(this.ViewComponent) }
});