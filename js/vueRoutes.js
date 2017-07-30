Vue.component('route-not-found', {
	template: '<p v-once>Page Not Found</p>'
});

Vue.component('route-home', {
	props: ['tutorialsList', 'tutorialContent'],
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-8 is-offset-2">\
						<h2>Our Goal</h2>\
						<p>\
							Our Goal is to provide useful information, tutorials, and help to those\
							who want to develop Zites in order to inspire more development on the\
							ZeroNet. This site will <em>not</em> teach the basics of front-end web\
							development. You can go <a href="#">here</a> for that. This site only\
							focuses on ZeroNet-specific development, including the ZeroFrame API. To\
							get started developing a Zite for the ZeroNet, follow\
							<route-link to="tutorials/the_basics">this tutorial</route-link> to start\
							learning to build basic zites. You can then move on to other tutorials on\
							the <route-link to="tutorials">tutorials page</route-link>.\
						</p>\
					</div>\
				</div>\
			</section>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-5 is-offset-2">\
						<h2>Tutorials</h2>\
						<div v-html="tutorialsList"></div>\
					</div>\
					<div class="column">\
						<h2>Tips &amp; Tricks</h2>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-about', {
	template: '<p v-once>About Page</p>'
});

Vue.component('route-tutorials', {
	props: ['tutorialsList', 'tutorialContent'],
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<div v-html="tutorialsList" class="custom-content"></div>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-tutorials-:slug', {
	props: ['tutorialsList', 'tutorialContent'],
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<div v-html="tutorialContent" class="custom-content"></div>\
					</div>\
				</div>\
			</section>\
		</div>'
});
