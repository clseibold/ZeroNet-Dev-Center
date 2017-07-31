Vue.component('route-link', {
	props: ['to'],
	template: '<a v-on:click="goto" v-bind:class="{ \'is-active\': active }"><slot></slot></a>',
	methods: {
		goto: function() {
			//console.log(typeof this.to);
			Router.navigate(this.to);
		}
	},
	computed: {
		active: function() {
			if (Router.currentRoute === this.to) {
				return true;
			}
			return false;
		}
	}
});