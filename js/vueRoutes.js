Vue.component('route-not-found', {
	template: '<p v-once>Page Not Found</p>'
});


var Home = {
	props: ['tutorialsList', 'questionsList'],
	init: function() {
		var subtitle = "Tutorials, Questions, Collaboration";
		var content = generateRouteLinkHTML('tutorials/the_basics', 'The Basics', 'button is-info') +
						generateRouteLinkHTML('tutorials', 'All Tutorials', '', 'margin-top: 10px; margin-left: 10px;');

		setupHero(true, "ZeroNet Dev Center", subtitle, content);
		checkTutorialsList();
		getQuestionsList();
	},
	computed: {
		getLatestQuestions: function() {
			return this.questionsList.slice(0, 4);
		},
		getLatestTutorials: function() {
			return this.tutorialsList.slice(0, 3);
		}
	},
	methods: {
		questionClick: function(question) {
			Router.navigate('questions/' + this.getQuestionAuthAddress(question) + '/' + question.question_id);
		},
		getQuestionHref: function(question) {
			return "./?/questions/" + this.getQuestionAuthAddress(question) + '/' + question.question_id;
		},
		getQuestionAuthAddress: function(question) {
			return question.directory.replace(/users\//, '').replace(/\//g, ''); // Return's auth address
		},
		getPostDate: function(date) {
			return "― " + moment(date).fromNow();
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
							development. This site only\
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
						<div style="margin-bottom: 1.5rem;"><span class="title is-4" style="margin-right: 5px;">Recent Questions</span> <small><route-link to="questions/new">Post New Question</route-link></small></div>\
						<div v-for="question in getLatestQuestions">\
							<div style="margin-bottom: 10px;"><h3 style="margin-bottom: 0;"><a v-bind:href="getQuestionHref(question)" v-on:click.prevent="questionClick(question)">{{ question.title }}</a></h3><small style="color: #6a6a6a;">by <a style="color: #A987E5;">{{ question.cert_user_id }}</a> <span v-html="getPostDate(question.date_added)"></span></small></div>\
						</div>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var Blog = {
	props: ['blogPosts'],
	init: function() {
		setupHero(false, "Blog", "");
		getBlogPosts();
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<blog-list-item v-for="post in blogPosts" :key="post.post_id" :title="post.title" :tags="post.tags" :slug="post.slug" :date-added="post.date_added">\
						</blog-list-item>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var BlogSlug = {
	props: ['currentAuthaddress', 'tutorialContent', 'tutorialComments', 'referenceId'],
	init: function() {
		setupHero(false, "", "");
		app.comments = [];
		app.tutorialContent = "";
		getBlogPost(this.params.slug, fillInCurrentUser);
	},
	computed: {
		getCommentAmount: function() {
			return this.tutorialComments.length;
		}
	},
	methods: {
		innerPostComment: function() {
			postComment('b', this.referenceId);
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
							<span style="color: blue;" class="currentuser"></span>:<br>\
							<textarea id="comment" oninput="expandTextarea(this);" class="textarea is-small" rows="2" style="width: 100%; max-width: 100%; padding: 7px;" placeholder="Comment..."></textarea>\
							<button class="button is-primary" v-on:click="innerPostComment" style="margin-top: 10px;">Comment</button>\
						</div>\
						<tutorial-comment v-for="comment in tutorialComments" :key="comment.comment_id" :current-authaddress="currentAuthaddress" :comment-id="comment.comment_id" :username="comment.cert_user_id" :body="comment.body" :directory="comment.directory" :date="comment.date_added" reference-type="b">\
						</tutorial-comment>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var Tutorials = {
	props: ['tutorialsList'],
	init: function() {
		setupHero(false, "Tutorials", "");
		checkTutorialsList();
	},
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
};

var TutorialsSlug = {
	props: ['currentAuthaddress', 'tutorialContent', 'tutorialComments', 'referenceId', 'tableofcontents'],
	init: function() {
		setupHero(false, "", "");
		app.tableofcontents = "";
		app.comments = [];
		app.tutorialContent = "";
		var that = this;
		getTutorial(that.params.slug, function() {
			fillInCurrentUser();

			// Get hash links working (for endnotes, etc.)
			var elements = document.querySelectorAll('a[href^="#"]');
			for (var i = 0; i < elements.length; i++) {
				var hash = elements[i].hash;
				elements[i].href = './?/tutorials/' + that.params.slug + hash;
			}

			// Add id's to headings
			var headings = document.querySelectorAll('.custom-content > h2');
			for (var i = 0; i < headings.length; i++) {
				headings[i].id = "h" + i;
			}

			//console.log(app.comments);
		});
	},
	computed: {
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
						<h2>Table Of Contents</h2>\
						<div v-html="tableofcontents" class="custom-content"></div><br>\
						<div v-html="tutorialContent" class="custom-content"></div>\
						<hr>\
						<div style="margin-bottom: 20px;">\
							<h2>{{getCommentAmount}} Comments</h2>\
							<span style="color: blue;" class="currentuser"></span>:<br>\
							<textarea id="comment" oninput="expandTextarea(this);" class="textarea is-small" rows="2" style="width: 100%; max-width: 100%; padding: 7px;" placeholder="Comment..."></textarea>\
							<button class="button is-primary" v-on:click="innerPostComment" style="margin-top: 10px;">Comment</button>\
						</div>\
						<tutorial-comment v-for="comment in tutorialComments" :key="comment.comment_id" :current-authaddress="currentAuthaddress" :comment-id="comment.comment_id" :username="comment.cert_user_id" :body="comment.body" :directory="comment.directory" :date="comment.date_added" reference-type="t">\
						</tutorial-comment>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var Questions = {
	props: ['questionsList'],
	init: function() {
		setupHero(false, "Questions", "");
		getQuestionsList(fillInCurrentUser);
	},
	methods: {
		questionClick: function(question) {
			Router.navigate('questions/' + this.getQuestionAuthAddress(question) + '/' + question.question_id);
		},
		getQuestionHref: function(question) {
			return "./?/questions/" + this.getQuestionAuthAddress(question) + '/' + question.question_id;
		},
		getQuestionAuthAddress: function(question) {
			return question.directory.replace(/users\//, '').replace(/\//g, '');
		},
		getPostDate: function(date) {
			return "― " + moment(date).fromNow();
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
							<h3 style="margin-bottom: 0;"><a v-bind:href="getQuestionHref(question)" v-on:click.prevent="questionClick(question)">{{ question.title }}</a></h3><small style="color: #6a6a6a;">by <a style="color: #A987E5;">{{ question.cert_user_id }}</a> <span v-html="getPostDate(question.date_added)"></span></small>\
							<hr>\
						</div>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var QuestionsNew = {
	init: function() {
		setupHero(false, "Questions", "");
		getQuestionsList(fillInCurrentUser);
	},
	methods: {
		cancel: function() {
			Router.navigate('questions');
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<h2>Create New Question</h2>\
						<span style="color: blue;" class="currentuser"></span>:<br>\
						<input id="questionTitle" type="text" class="input" placeholder="Question Title"></input>\
						<textarea oninput="expandTextarea(this);" class="textarea" rows="3" id="questionBody" placeholder="Question Body..." style="margin-top: 10px; width: 100%; padding: 10px;"></textarea>\
						<button class="button is-primary" onclick="postQuestion();" style="margin-top: 10px;">Post</button>\
						<button class="button is-link" v-on:click="cancel" style="margin-top: 10px;">Cancel</button>\
					</div>\
				</div>\
			</section>\
		</div>'
}

var QuestionsCertuseridId = {
	props: ['currentAuthaddress', 'tutorialContent', 'referenceId', 'questionTitle', 'questionSubtitle', 'questionComments', 'questionAuthaddress', 'answersList', 'allComments', 'dateAdded', 'solutionid', 'solutionAuthaddress'],
	init: function() {
		setupHero(false, "Questions", "");
		app.comments = [];
		app.answersList = [];
		app.allComments = [];
		getQuestion(this.params.id, this.params.certuserid, false, function() {
			getAllComments(fillInCurrentUser);
		});
	},
	methods: {
		postAnswerClick: function() {
			Router.navigate('questions/' + this.questionAuthaddress + '/' + this.referenceId + '/answer');
		},
		toggleCommentBox: function() {
			this.isCommentBoxShown = !this.isCommentBoxShown;
		},
		innerPostComment: function() {
			postComment('q', this.referenceId,  this.questionAuthaddress);
		},
		postAnswerHref: function() {
			return './?/questions/' + this.questionAuthaddress + '/' + this.referenceId + '/answer';
		},
		getPostDate: function() {
			return "― " + moment(this.dateAdded).fromNow();
		},
		editQuestion: function() {
			Router.navigate('questions/' + this.questionAuthaddress + '/' + this.referenceId + '/edit');
		}
	},
	computed: {
		isEditLinkShown: function() {
			if (!this.currentAuthaddress) return false;
			return this.currentAuthaddress == this.questionAuthaddress;
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
							<div style="margin-bottom: 5px;"><span class="title is-4" style="margin-right: 20px;">{{ questionTitle }}</span> <span class="subtitle is-6">{{ questionSubtitle }} <span v-html="getPostDate()"></span></span></div>\
							<div class="custom-content" v-html="tutorialContent"></div>\
							<nav class="level is-mobile">\
						        <div class="level-left">\
							        <a class="level-item" v-on:click="toggleCommentBox">\
							        	<span class="icon is-small"><i class="fa fa-reply"></i></span>\
							        </a>\
							        <a class="level-item">\
							        	<span class="icon is-small"><i class="fa fa-heart"></i></span>\
							        </a>\
							        <a class="level-item" v-if="isEditLinkShown" v-on:click.prevent="editQuestion">Edit</a>\
						        </div>\
				      		</nav>\
				      		<div v-if="isCommentBoxShown" style="margin-bottom: 20px; border-top: 1px solid #EBEBEB; padding-top: 20px;">\
								<textarea id="comment" oninput="expandTextarea(this);" class="textarea is-small" rows="2" style="width: 100%; padding: 7px;" placeholder="Comment..."></textarea>\
								<button class="button is-primary" v-on:click="innerPostComment" style="margin-top: 10px;">Comment</button>\
				      		</div>\
				      		<tutorial-comment v-for="comment in questionComments" :key="comment.comment_id" :current-authaddress="currentAuthaddress" :comment-id="comment.comment_id" :username="comment.cert_user_id" :body="comment.body" :directory="comment.directory" :date="comment.date_added" reference-type="q" :reference-authaddress="questionAuthaddress">\
							</tutorial-comment>\
						</div>\
						<hr>\
						<h2>Answers <small style="margin-left: 5px; font-size: 0.6em;"><a v-bind:href="postAnswerHref()" v-on:click.prevent="postAnswerClick">Post An Answer</a></small></h2>\
						<question-answer v-for="answer in answersList" :key="answer.id" :current-authaddress="currentAuthaddress" :referenceid="answer.answer_id" :username="answer.cert_user_id" :directory="answer.directory" :body="answer.body" :date="answer.date_added" :comments="allComments" :questionid="referenceId" :question-authaddress="questionAuthaddress" :solutionid="solutionid" :solution-authaddress="solutionAuthaddress">\
						</question-answer>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var QuestionsCertuseridIdEdit = {
	props: ['tutorialContent', 'referenceId', 'questionTitle', 'questionAuthaddress'],
	before: function() {
		// TODO: BUG, site_info isn't set yet because it happens async.
		if (!zeroframe.site_info || zeroframe.site_info.auth_address != this.params.certuserid) {
			console.log("You cannot edit this question. It doesn't belong to you! (or site_info isn't set yet - this is a know bug. You should use the edit button from the question's page instead.)");
			return false;
		}
		return true;
	},
	init: function() {
		setupHero(false, "Questions", "");
		getQuestion(this.params.id, this.params.certuserid, true, fillInCurrentUser);
	},
	methods: {
		editClick: function() {
			editQuestion(this.referenceId, this.questionAuthaddress);
		},
		cancel: function() {
			Router.navigate('questions/' + this.questionAuthaddress + "/" + this.referenceId);
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<h2>Edit Question</h2>\
						<span style="color: blue;" class="currentuser"></span>:<br>\
						<input id="editQuestionTitle" type="text" class="input" placeholder="Question Title" v-bind:value="questionTitle"></input>\
						<textarea onfocus="expandTextarea(this);" oninput="expandTextarea(this);" class="textarea" rows="3" id="editQuestionBody" placeholder="Question Body..." style="margin-top: 10px; width: 100%; padding: 10px;">{{ tutorialContent }}</textarea>\
						<button class="button is-primary" v-on:click="editClick" style="margin-top: 10px;">Edit</button>\
						<button class="button is-link" v-on:click="cancel" style="margin-top: 10px;">Cancel</button>\
					</div>\
				</div>\
			</section>\
		</div>'
}

var QuestionsCertuseridIdAnswer = {
	init: function() {
		setupHero(false, "Questions", "");
		app.allAnswersList = [];
		getAllAnswers();
		getQuestion(this.params.id, this.params.certuserid, false, fillInCurrentUser); // NOTE that this will set the app.questionAuthaddress, which is used by the postAnswer() function
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns">\
					<div class="column is-6 is-offset-3">\
						<h2>Create New Answer</h2>\
						<span style="color: blue;" class="currentuser"></span>:<br>\
						<textarea oninput="expandTextarea(this);" id="answerBody" class="textarea" rows="3" placeholder="Answer Body..." style="margin-top: 10px; width: 100%; padding: 10px;"></textarea>\
						<button class="button is-primary" onclick="postAnswer();" style="margin-top: 10px;">Post</button>\
					</div>\
				</div>\
			</section>\
		</div>'
};
