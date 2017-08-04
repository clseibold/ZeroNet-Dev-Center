Vue.component('route-link', {
	props: ['to'],
	template: '<a v-bind:href="getHref" v-on:click.prevent="goto" v-bind:class="{ \'is-active\': active }"><slot></slot></a>',
	methods: {
		goto: function() {
			Router.navigate(this.to);
		}
	},
	computed: {
		active: function() {
			if (Router.currentRoute === this.to) {
				return true;
			}
			return false;
		},
		getHref: function() { // Middle Click - open in new tab
			console.log("/" + this.to);
			return "./?/" + this.to;
			//zeroframe.cmd("wrapperOpenWindow", ["/" + to, "_blank"])
		}
	}
});