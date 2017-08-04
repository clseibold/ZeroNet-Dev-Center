Vue.component('route-not-found', {
	template: '<p v-once>Page Not Found</p>'
});

Vue.component('route-home', {
	props: ['tutorialsList', 'questionsList'],
	computed: {
		getLatestQuestions: function() {
			return this.questionsList.slice(0, 3);
		},
		getLatestTutorials: function() {
			return this.tutorialsList.slice(0, 3);
		}
	},
	methods: {
		questionClick: function(question) {
			Router.navigate('questions/' + question.cert_user_id + '/' + question.question_id);
		}
	},
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
						<h2>Recent Tutorials</h2>\
						<tutorial-list-item v-for="tutorial in getLatestTutorials" :key="tutorial.id" :title="tutorial.title" :authors="tutorial.author" :tags="tutorial.tags" :slug="tutorial.slug">\
							{{ tutorial.description }}\
						</tutorial-list-item>\
					</div>\
					<div class="column">\
						<h2>Recent Questions</h2>\
						<div v-for="question in getLatestQuestions">\
							<div style="margin-bottom: 10px;"><h3 style="margin-bottom: 0;" v-on:click="questionClick(question)"><a>{{ question.title }}</a></h3><small>by {{ question.cert_user_id }}</small></div>\
						</div>\
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

Vue.component('route-questions', {
	props: ['questionsList'],
	methods: {
		questionClick: function(question) {
			Router.navigate('questions/' + question.cert_user_id + '/' + question.question_id);
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<route-link to="questions/new" class="button is-primary">Create New Question</route-link>\
						<hr>\
						<div v-for="question in questionsList">\
							<h3 style="margin-bottom: 0;"><a v-on:click="questionClick(question)">{{ question.title }}</a></h3><small>by {{ question.cert_user_id }}</small>\
							<hr>\
						</div>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-questions-new', {
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<h2>Create New Question</h2>\
						<input id="questionTitle" type="text" class="input" placeholder="Question Title"></input>\
						<textarea id="questionBody" placeholder="Question Body..." style="margin-top: 10px; width: 100%; padding: 10px;"></textarea>\
						<button class="button is-primary" onclick="postQuestion();">Post</button>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-questions-certuserid-id', {
	props: ['tutorialContent', 'referenceId', 'questionTitle', 'questionSubtitle', 'questionComments', 'questionCertuserid', 'answersList', 'allComments'],
	methods: {
		postAnswerClick: function() {
			Router.navigate('questions/' + this.questionCertuserid + '/' + this.referenceId + '/answer');
		},
		toggleCommentBox: function() {
			this.isCommentBoxShown = !this.isCommentBoxShown;
		},
		innerPostComment: function() {
			postComment('q', this.referenceId,  this.questionCertuserid);
		}
	},
	data: function() {
		return {
			isCommentBoxShown: false
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<div class="box">\
							<h2>{{ questionTitle }} <small>{{ questionSubtitle }}</small></h2>\
							<div class="custom-content" v-html="tutorialContent"></div>\
							<nav class="level is-mobile">\
						        <div class="level-left">\
							        <a class="level-item" v-on:click="toggleCommentBox">\
							        	<span class="icon is-small"><i class="fa fa-reply"></i></span>\
							        </a>\
							        <a class="level-item">\
							        	<span class="icon is-small"><i class="fa fa-heart"></i></span>\
							        </a>\
						        </div>\
				      		</nav>\
				      		<div v-if="isCommentBoxShown" style="margin-bottom: 20px; border-top: 1px solid #EBEBEB; padding-top: 20px;">\
								<!--<span style="color: blue;" v-html="getCurrentUser"></span><br>-->\
								<textarea id="comment" style="width: 100%; padding: 7px;" placeholder="Comment..."></textarea>\
								<button class="button is-primary" v-on:click="innerPostComment">Comment</button>\
				      		</div>\
				      		<tutorial-comment v-for="comment in questionComments" :key="comment.id" :username="comment.cert_user_id" :body="comment.body" :date="comment.date_added">\
							</tutorial-comment>\
						</div>\
						<hr>\
						<h2>Answers <small style="margin-left: 5px; font-size: 0.6em;"><a v-on:click="postAnswerClick">Post An Answer</a></small></h2>\
						<question-answer v-for="answer in answersList" :key="answer.id" :referenceid="answer.answer_id" :username="answer.cert_user_id" :body="answer.body" :date="answer.date_added" :comments="allComments">\
						</question-answer>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-questions-certuserid-id-answer', {
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<h2>Create New Answer</h2>\
						<textarea id="answerBody" placeholder="Answer Body..." style="margin-top: 10px; width: 100%; padding: 10px;"></textarea>\
						<button class="button is-primary" onclick="postAnswer();">Post</button>\
					</div>\
				</div>\
			</section>\
		</div>'
});

Vue.component('route-tutorials-slug', {
	props: ['tutorialContent', 'tutorialComments', 'referenceId'],
	computed: {
		getCurrentUser: function() {
			return zeroframe.site_info.cert_user_id ? zeroframe.site_info.cert_user_id + ":" : "<a onclick='zeroframe.selectUser(); return false;'>Select User:</a>";
		},
		getCommentAmount: function() {
			return this.tutorialComments.length;
		}
	},
	methods: {
		innerPostComment: function() {
			postComment('t', this.referenceId);
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<div v-html="tutorialContent" class="custom-content"></div>\
						<hr>\
						<div style="margin-bottom: 20px;">\
							<h2>{{getCommentAmount}} Comments</h2>\
							<span style="color: blue;" v-html="getCurrentUser"></span><br>\
							<textarea id="comment" style="width: 100%; padding: 7px;" placeholder="Comment..."></textarea>\
							<button class="button is-primary" v-on:click="innerPostComment">Comment</button>\
						</div>\
						<tutorial-comment v-for="comment in tutorialComments" :key="comment.id" :username="comment.cert_user_id" :body="comment.body" :date="comment.date_added">\
						</tutorial-comment>\
					</div>\
				</div>\
			</section>\
		</div>'
});
