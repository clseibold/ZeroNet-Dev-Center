Vue.component('route-not-found', {
	template: '<p v-once>Page Not Found</p>'
});

Vue.component('route-home', {
	props: ['tutorialsList'],
	template: '\
		<div>\
			<section class="section" v-once>\
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
						<tutorial-list-item v-for="tutorial in tutorialsList" :key="tutorial.id" :title="tutorial.title" :authors="tutorial.author" :tags="tutorial.tags" :slug="tutorial.slug">\
							{{ tutorial.description }}\
						</tutorial-list-item>\
					</div>\
					<div class="column">\
						<h2>Top Questions</h2>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-tutorials', {
	props: ['tutorialsList'],
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<tutorial-list-item v-for="tutorial in tutorialsList" :key="tutorial.id" :title="tutorial.title" :authors="tutorial.author" :tags="tutorial.tags" :slug="tutorial.slug">\
							{{ tutorial.description }}\
						</tutorial-list-item>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-tutorials-:slug', {
	props: ['tutorialContent', 'tutorialComments'],
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<div v-html="tutorialContent" class="custom-content"></div>\
						<hr>\
						<div style="margin-bottom: 20px;">\
							<h2>Comments</h2>\
							<textarea id="comment" style="width: 100%; padding: 5px;" placeholder="Comment..."></textarea>\
							<button class="button is-primary" onclick="postComment();">Comment</button>\
						</div>\
						<tutorial-comment v-for="comment in tutorialComments" :key="comment.id" :username="comment.cert_user_id" :body="comment.body" :date="comment.date_added">\
						</tutorial-comment>\
					</div>\
				</div>\
			</section>\
		</div>'
});
