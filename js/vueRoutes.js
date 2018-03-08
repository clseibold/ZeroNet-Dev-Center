//Vue.component('route-not-found', {
//	template: '<p v-once>Page Not Found</p>'
//});


var Home = {
	props: ['tutorialsList', 'questionsList'],
	init: function() {
		var subtitle = "Tutorials, Questions, Collaboration";
		var content = generateRouteLinkHTML('tutorials/the_basics', 'The Basics', 'button is-info') +
						generateRouteLinkHTML('questions', 'Search Questions', '', 'margin-top: 10px; margin-left: 10px;');

		setupHero(true, "ZeroNet Dev Center", subtitle, content);
		checkTutorialsList(false, true);
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
						<div style="margin-bottom: 1.5rem;"><span class="title is-4" style="margin-right: 5px;">Questions</span></div>\
						You can ask questions regarding ZeroNet Zite Development<br>on the Development topic on <a href="/ZeroExchange.bit">ZeroExchange</a>\
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
	mounted: function() {
		zeroframe.cmd("feedListFollow", [], (followList) => {
			if (followList["Blogposts"]) {
				this.buttonText = "Following";
			} else {
				this.buttonText = "Follow";
			}
		});
	},
	computed: {
		getBlogPosts: function() {
			var list = this.blogPosts;
			if (this.searchInput == "" || !this.searchInput) return list;
			var searchInputWords = this.searchInput.split(' ');
			list = list.filter(function(post) {
				post.order = 0;
				var matches = 0;
				for (var i = 0; i < searchInputWords.length; i++) {
					var word = searchInputWords[i].trim().toLowerCase();
					if (post.tags && parseTagIds(post.tags.toLowerCase()).join(',').includes(word)) {
						post.order += 3;
						matches++;
						continue;
					}
					if (post.title.toLowerCase().includes(word)) {
						post.order += 2;
						matches++;
						continue;
					}
					if (post.body.toLowerCase().includes(word)) {
						matches++;
						continue;
					}
					post.order--;
				}
				if (matches == 0) return false;
				else return true;
			});
			list.sort(function(a, b) {
				return b.order - a.order;
			});
			return list;
		}
	},
	methods: {
		followBlog() {
			zeroframe.cmd("feedListFollow", [], (followList) => {
				var query = "SELECT blogposts.post_id AS event_uri, 'post' AS type, blogposts.date_added AS date_added, blogposts.title AS title, blogposts.body AS body, '?/blog/' || blogposts.slug AS url FROM blogposts LEFT JOIN json USING (json_id)";
				var params = "";
				var newList = followList;
				if (followList["Blogposts"]) {
					delete newList["Blogposts"];
					zeroframe.cmd("feedFollow", [newList]);
					this.buttonText = "Follow";
				} else {
					newList["Blogposts"] = [query, params];
					zeroframe.cmd("feedFollow", [newList]);
					this.buttonText = "Following";
				}
			});
		}
	},
	data: function() {
		return {
			searchInput: "",
			buttonText: "Follow"
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<div class="field has-addons">\
							 <p class="control has-icons-left is-expanded">\
								<input type="search" class="input" v-model="searchInput" style="display: inline; margin-bottom: 10px;" placeholder="Search ...">\
								<span class="icon is-small is-left">\
									<i class="fa fa-search"></i>\
								</span>\
							</p>\
							<div class="control">\
								<!--<button class="button">+</button>-->\
								<button class="button is-primary" v-on:click="followBlog()">{{ buttonText }}</button>\
							</div>\
						</div>\
						<hr>\
						<blog-list-item v-for="post in getBlogPosts" :key="post.post_id" :title="post.title" :tags="post.tags" :slug="post.slug" :date-added="post.date_added">\
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
	mounted: function() {
		zeroframe.cmd("feedListFollow", [], (followList) => {
			if (followList["Blogcomments"]) {
				this.buttonText = "Following";
			} else {
				this.buttonText = "Follow";
			}
		});
	},
	computed: {
		getCommentAmount: function() {
			return this.tutorialComments.length;
		}
	},
	methods: {
		innerPostComment: function() {
			postComment('b', this.referenceId);
		},
		followComments: function() {
			zeroframe.cmd("feedListFollow", [], (followList) => {
				var query = "SELECT comments.comment_id AS event_uri, 'comment' AS type, comments.date_added AS date_added, blogposts.title AS title, json.cert_user_id || ': ' || comments.body AS body, '?/blog/' || blogposts.slug AS url FROM comments LEFT JOIN json ON (comments.json_id = json.json_id) LEFT JOIN blogposts ON (comments.reference_id = blogposts.post_id) WHERE reference_type='b'";
				var params;
				var newList = followList;
				if (followList["Blogcomments"]) {
					delete newList["Blogcomments"];
					zeroframe.cmd("feedFollow", [newList]);
					this.buttonText = "Follow";
				} else {
					newList["Blogcomments"] = [query, params];
					zeroframe.cmd("feedFollow", [newList]);
					this.buttonText = "Following";
				}
			});
		}
	},
	data: function() {
		return {
			buttonText: "Follow"
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<div v-html="tutorialContent" class="custom-content"></div>\
						<hr>\
						<div style="margin-bottom: 20px;">\
							<h2>{{getCommentAmount}} Comments</h2><button class="button is-link" style="float: right;" v-on:click="followComments()">{{ buttonText }} Blog Comments</button>\
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
		checkTutorialsList(true, true);
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
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
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
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
	mounted: function() {
		zeroframe.cmd("feedListFollow", [], (followList) => {
			if (followList["Questions"]) {
				this.allQuestionsFollowed = true;
			}
			if (followList["QuestionAnswers"]) {
				this.questionAnswersFollowed = true;
			}
			if (followList["Your Questions Answers"]) {
				this.usersQuestionsFollowed = true;
			}
			this.updateFollowButtonText();
		});
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
		},
		tagClick: function(tag) {
			//Router.navigate('questions/tags/' + tag);
			if (this.searchInput[this.searchInput.length - 1] != ' ' && this.searchInput.length != 0){
				this.searchInput += ' ' + tag;
			} else {
				this.searchInput += tag;
			}
		},
		userIdClick: function(userId) {
			if (this.searchInput[this.searchInput.length - 1] != ' ' && this.searchInput.length != 0){
				this.searchInput += ' ' + userId;
			} else {
				this.searchInput += userId;
			}
		},
		getTagNames: function(tags) {
			if (!tags || app.allTags.length == 0) return null;
			return parseTagIds(tags);
		},
		isQuestionSolved: function(question) {
			return question.solution_id != null && question.solution_auth_address;
		},
		updateFollowButtonText: function() {
			if (this.allQuestionsFollowed || this.questionAnswersFollowed || this.usersQuestionsFollowed || this.usersAnswersFollowed) {
				this.followButtonText = "Following";
			} else {
				this.followButtonText = "Follow";
			}
		},
		followAllQuestions: function() {
			zeroframe.cmd("feedListFollow", [], (followList) => {
				var query = "SELECT questions.question_id AS event_uri, 'article' AS type, questions.date_added AS date_added, 'Question: ' || questions.title AS title, json.cert_user_id || ': ' || questions.body AS body, '?/questions/' || REPLACE(json.directory, 'users/', '') || '/' || questions.question_id AS url FROM questions LEFT JOIN json ON (questions.json_id = json.json_id)";
				var params;
				var newList = followList;
				if (followList["Questions"]) {
					delete newList["Questions"];
					zeroframe.cmd("feedFollow", [newList]);
					this.allQuestionsFollowed = false;
				} else {
					newList["Questions"] = [query, params];
					zeroframe.cmd("feedFollow", [newList]);
					this.allQuestionsFollowed = true;
				}
				this.updateFollowButtonText();
			});
		},
		followQuestionAnswers: function() {
			zeroframe.cmd("feedListFollow", [], (followList) => {
				var query = "SELECT answers.answer_id AS event_uri, 'article' AS type, answers.date_added AS date_added, 'Answer on: ' || questions.title AS title, json.cert_user_id || ': ' || answers.body AS body, '?/questions/' || answers.question_auth_address || '/' || answers.question_id AS url FROM answers LEFT JOIN questions ON (answers.question_id = questions.question_id) LEFT JOIN json ON (questions.json_id = json.json_id) WHERE answers.question_auth_address = REPLACE(json.directory, 'users/', '')";
				var params;
				var newList = followList;
				if (followList["QuestionAnswers"]) {
					delete newList["QuestionAnswers"];
					zeroframe.cmd("feedFollow", [newList]);
					this.questionAnswersFollowed = false;
				} else {
					newList["QuestionAnswers"] = [query, params];
					zeroframe.cmd("feedFollow", [newList]);
					this.questionAnswersFollowed = true;
					console.log(newList);
				}
				this.updateFollowButtonText();
			});
		},
		followUsersQuestions: function() {
			zeroframe.cmd("feedListFollow", [], (followList) => {
				var query = "SELECT answers.answer_id AS event_uri, 'article' AS type, answers.date_added AS date_added, 'Answer on: ' || questions.title AS title, json.cert_user_id || ': ' || answers.body AS body, '?/questions/' || answers.question_auth_address || '/' || answers.question_id AS url FROM answers LEFT JOIN json ON (answers.json_id = json.json_id) LEFT JOIN questions ON (answers.question_id = questions.question_id) WHERE answers.question_auth_address='" + zeroframe.site_info.auth_address + "'";
				var params;
				var newList = followList;
				if (followList["Your Questions Answers"]) {
					delete newList["Your Questions Answers"];
					zeroframe.cmd("feedFollow", [newList]);
					this.usersQuestionsFollowed = false;
				} else {
					newList["Your Questions Answers"] = [query, params];
					zeroframe.cmd("feedFollow", [newList]);
					this.usersQuestionsFollowed = true;
				}
				this.updateFollowButtonText();
			});
		},
		toggleStrictness: function() {
			this.isSearchStrict = !this.isSearchStrict;
		}
	},
	computed: {
		getQuestionsList: function() {
			var list = this.questionsList;
			if (this.searchInput == "" || !this.searchInput) return list;
			var searchInputWords = this.searchInput.trim().split(' '); // TODO
			var that = this;
			list = list.filter(function(question) {
				question.order = 0;
				var matches = 0;
				for (var i = 0; i < searchInputWords.length; i++) {
					var word = searchInputWords[i].trim().toLowerCase();
					if (word == "solved" && question.solution_id != null && question.solution_auth_address) {
						question.order += 3;
						matches++;
						continue;
					}
					if (question.tags && parseTagIds(question.tags.toLowerCase()).join(',').includes(word)) {
						question.order += 3;
						matches++;
						continue;
					}
					if (question.title.toLowerCase().includes(word)) {
						question.order += 2;
						matches++;
						continue;
					}
					if (word[0] == "@") {
						var wordId = word.substring(1, word.length);
						if (question.cert_user_id.replace(/@.*\.bit/, '').toLowerCase().includes(wordId)) {
							question.order += 1;
							matches++;
							continue;
						}
					}
					if (question.cert_user_id.toLowerCase().includes(word)) {
						question.order += 1;
						matches++;
						continue;
					}
					if (question.body.toLowerCase().includes(word)) {
						matches++;
						continue;
					}
					if (that.isSearchStrict) {
						return false;
					} else {
						question.order--;
					}
				}
				//console.log(that.isSearchStrict);
				if (!that.isSearchStrict) {
					if (matches == 0) return false;
					else return true;
				} else {
					return true;
				}
			});
			list.sort(function(a, b) {
				return b.order - a.order;
			});
			return list;
		},
		getStrictText: function() {
			if (this.isSearchStrict) return "Inclusive";
			else return "Strict";
		}
	},
	data: function() {
		return {
			searchInput: "",
			followButtonText: "Follow",
			allQuestionsFollowed: false,
			questionAnswersFollowed: false,
			usersQuestionsFollowed: false,
			usersAnswersFollowed: false,
			isSearchStrict: false,
			searchList: []
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<div class="field has-addons">\
							 <p class="control has-icons-left is-expanded">\
								<input type="search" class="input" v-model="searchInput" style="display: inline; margin-bottom: 10px;" placeholder="Search ...">\
								<span class="icon is-small is-left">\
									<i class="fa fa-search"></i>\
								</span>\
							</p>\
							<div class="control">\
								<!--<button class="button">+</button>-->\
								<route-link to="questions/new" class="button is-primary">Create</route-link>\
							</div>\
						</div>\
						<!--<a class="button is-link" v-on:click.prevent="followQuestions()">{{ followButtonText }}</a>-->\
						<div class="dropdown is-hoverable">\
						  <div class="dropdown-trigger">\
							<button class="button is-link" aria-haspopup="true" aria-controls="dropdown-menu">\
							  <span>{{followButtonText}}</span>\
							  <span class="icon is-small">\
								<i class="fa fa-angle-down" aria-hidden="true"></i>\
							  </span>\
							</button>\
						  </div>\
				  			<div class="dropdown-menu" id="dropdown-menu" role="menu">\
								<div class="dropdown-content">\
								  <a href="#" class="dropdown-item" v-on:click.prevent="followAllQuestions()">\
								  	<span class="icon is-small" v-if="allQuestionsFollowed">\
							  			<i class="fa fa-check"></i>\
							  		</span>\
									Questions\
								  </a>\
								  <a class="dropdown-item" v-on:click.prevent="followQuestionAnswers()">\
								  	<span class="icon is-small" v-if="questionAnswersFollowed">\
							  			<i class="fa fa-check"></i>\
							  		</span>\
									Question Answers\
								  </a>\
								  <hr class="dropdown-divider">\
								  <a href="#" class="dropdown-item" v-on:click.prevent="followUsersQuestions()">\
							  		<span class="icon is-small" v-if="usersQuestionsFollowed">\
							  			<i class="fa fa-check"></i>\
							  		</span>\
									Your Questions\
								  </a>\
								  <!--<a href="#" class="dropdown-item">\
								  	<span class="icon is-small" v-if="usersAnswersFollowed">\
							  			<i class="fa fa-check"></i>\
							  		</span>\
									Your Answers\
								  </a>-->\
								</div>\
							  </div>\
						</div>\
						<a class="button is-link" v-on:click.prevent="toggleStrictness()">Use {{ getStrictText }}</a>\
						<!--<route-link to="questions/new" class="button is-primary">Create New Question</route-link>-->\
						<hr>\
						<div v-for="question in getQuestionsList">\
							<h3 style="margin-bottom: 0;"><a v-bind:href="getQuestionHref(question)" v-on:click.prevent="questionClick(question)">{{ question.title }}</a></h3><small style="color: #6a6a6a;">by <a v-on:click.prevent="userIdClick(question.cert_user_id)" style="color: #A987E5;">{{ question.cert_user_id }}</a> <span v-html="getPostDate(question.date_added)"></span></small>\
							<div class="tags" style="margin-top: 10px; margin-bottom: 0px; padding-bottom: 0; display: block;">\
								<a class="tag is-success" v-if="isQuestionSolved(question)" v-on:click.prevent="tagClick(\'solved\')">Solved</a>\
								<a v-for="tag in getTagNames(question.tags)" :href="\'questions/tags/\' + tag" v-on:click.prevent="tagClick(tag)" class="tag">{{ tag }}</a>\
							</div>\
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
		},
		addTag: function(tagName) {
			if (this.tagInput.includes(tagName)) return;
			if (this.tagInput == "") this.tagInput += tagName;
			else if (this.tagInput[this.tagInput.length - 1] == ',') this.tagInput += tagName;
			else this.tagInput += ',' + tagName;
		}
	},
	data: function() {
		return {
			tagInput: ""
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<h2>Create New Question</h2>\
						<span style="color: blue;" class="currentuser"></span>:<br>\
						<input id="questionTitle" type="text" class="input" placeholder="Question Title">\
						<textarea oninput="expandTextarea(this);" class="textarea" rows="3" id="questionBody" placeholder="Question Body..." style="margin-top: 10px; width: 100%; padding: 10px;"></textarea>\
						<input id="questionTags" type="text" class="input" placeholder="Question Tags (separated by commas) ..." style="margin-top: 10px; width: 100%;" v-model="tagInput">\
						<button class="button is-primary" onclick="postQuestion();" style="margin-top: 10px;">Post</button>\
						<button class="button is-link" v-on:click="cancel" style="margin-top: 10px;">Cancel</button><br><br>\
						<h3>Common Tags</h3>\
						<div class="tags">\
							<a v-for="tag in app.allTags" v-on:click="addTag(tag.name)" class="tag">{{tag.name}}</a>\
						</div>\
					</div>\
				</div>\
			</section>\
		</div>'
}

var QuestionsCertuseridId = {
	props: ['currentAuthaddress', 'tutorialContent', 'referenceId', 'questionTitle', 'questionSubtitle', 'questionComments', 'questionAuthaddress', 'tags', 'answersList', 'allComments', 'dateAdded', 'solutionid', 'solutionAuthaddress', 'questionsList'],
	init: function() {
		setupHero(false, "Questions", "");
		app.referenceId = null;
		app.questionsList = [];
		app.questionTitle = "";
		app.questionSubtitle = "";
		app.questionAuthaddress = "";
		app.tutorialContent = "";
		app.tags = [];
		app.dateAdded = null;
		app.comments = [];
		app.answersList = [];
		app.allComments = [];
		getQuestionsList();
		getQuestion(this.params.id, this.params.certuserid, true, false, function() {
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
		},
		clickTag: function(tagName) {
			Router.navigate('questions/tags/' + tagName);
		},
		getTagNames: function(tags) {
			if (!tags || app.allTags.length == 0) return null;
			return parseTagIds(tags);
		},
		questionClick: function(question) {
			Router.navigate('questions/' + this.getQuestionAuthAddressFromQuestion(question) + '/' + question.question_id);
		},
		getQuestionHref: function(question) {
			return "./?/questions/" + this.getQuestionAuthAddressFromQuestion(question) + '/' + question.question_id;
		},
		getQuestionAuthAddressFromQuestion: function(question) {
			return question.directory.replace(/users\//, '').replace(/\//g, '');
		},
		getPostDateFromDate: function(date) {
			return "― " + moment(date).fromNow();
		},
	},
	computed: {
		isEditLinkShown: function() {
			if (!this.currentAuthaddress) return false;
			return this.currentAuthaddress == this.questionAuthaddress;
		},
		getCurrentTagNames: function() {
			if (!this.tags || app.allTags.length == 0) return null;
			return parseTagIds(this.tags);
		},
		getRelatedQuestionsList: function() {
			var tagNames = this.getCurrentTagNames;
			if (!tagNames || !this.questionTitle || !this.referenceId || !this.questionAuthaddress) return null;
			if (!this.questionsList) {
				//getQuestionsList();
				return null;
			}
			var that = this;
			var list = this.questionsList.filter(function(question) {
				// Don't show itself
				if (question.question_id == that.referenceId && question.directory.replace(/users\//, '').replace(/\//g, '') == that.questionAuthaddress) {
					return false;
				}

				var include = false;
				question.order = 0;
				for (var i = 0; i < tagNames.length; i++) {
					if (!question.tags) break;
					if (parseTagIds(question.tags).includes(tagNames[i])) {
						question.order += 1;
						include = true;
					}
				}
				var titleSplit = that.questionTitle.toLowerCase().split(' ');
				for (var i = 0; i < titleSplit.length; i++) {
					if (question.title.toLowerCase().includes(titleSplit[i])) {
						question.order += 1;
						include = true;
					}
				}
				return include;
			});
			list.sort(function(a, b) {
				return b.order - a.order;
			});
			return list.slice(0, 4);
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
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<div class="box">\
							<div style="margin-bottom: 5px;"><span class="title is-4" style="margin-right: 20px;">{{ questionTitle }}</span> <span class="subtitle is-6">{{ questionSubtitle }} <span v-html="getPostDate()"></span></span></div>\
							<div class="custom-content" v-html="tutorialContent"></div>\
							<div class="tags" v-if="getCurrentTagNames && tags">\
								<a v-for="tag in getCurrentTagNames" :href="\'./?/\' + tag" v-on:click.prevent="clickTag(tag)" class="tag">{{tag}}</a>\
							</div>\
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
						<question-answer v-for="answer in answersList" :key="answer.id" :current-authaddress="currentAuthaddress" :referenceid="answer.answer_id" :username="answer.cert_user_id" :directory="answer.directory" :body="answer.body" :vote-amount="answer.vote_amount" :current-uservoted="answer.current_user_voted" :date="answer.date_added" :comments="allComments" :questionid="referenceId" :question-authaddress="questionAuthaddress" :solutionid="solutionid" :solution-authaddress="solutionAuthaddress">\
						</question-answer>\
						<div v-show="answersList.length == 0">There are no answers! <a v-bind:href="postAnswerHref()" v-on:click.prevent="postAnswerClick">Create An Answer</a></div>\
						<hr>\
						<h2>Related Questions</h2>\
						<div v-for="question in getRelatedQuestionsList">\
							<h4 style="margin-bottom: 0;"><a v-bind:href="getQuestionHref(question)" v-on:click.prevent="questionClick(question)">{{ question.title }}</a></h4><small style="color: #6a6a6a;">by <a style="color: #A987E5;">{{ question.cert_user_id }}</a> <span v-html="getPostDateFromDate(question.date_added)"></span></small>\
							<div class="tags" style="margin-top: 10px; margin-bottom: 0px; padding-bottom: 0; display: block;">\
								<a v-for="tag in getTagNames(question.tags)" :href="\'./?/questions/tags/\' + tag" class="tag" v-on:click.prevent="clickTag(tag)">{{ tag }}</a>\
							</div>\
							<br>\
						</div>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var QuestionsCertuseridIdEdit = {
	props: ['tutorialContent', 'referenceId', 'questionTitle', 'questionAuthaddress', 'tags'],
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
		getQuestion(this.params.id, this.params.certuserid, false, true, fillInCurrentUser);
	},
	mounted: function() {
		this.tagInput = this.getTagNames();
		fillInCurrentUser();
	},
	methods: {
		editClick: function() {
			editQuestion(this.referenceId, this.questionAuthaddress);
		},
		cancel: function() {
			Router.navigate('questions/' + this.questionAuthaddress + "/" + this.referenceId);
		},
		getTagNames: function() {
			if (!this.tags || app.allTags.length == 0) return "";
			var tagNames = parseTagIds(this.tags).join(',');
			return tagNames;
		},
		addTag: function(tagName) {
			if (this.tagInput.includes(tagName)) return;
			if (this.tagInput == "") this.tagInput += tagName;
			else if (this.tagInput[this.tagInput.length - 1] == ',') this.tagInput += tagName;
			else this.tagInput += ',' + tagName;
		}
	},
	data: function() {
		return {
			tagInput: ""
		}
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<h2>Edit Question</h2>\
						<span style="color: blue;" class="currentuser"></span>:<br>\
						<input id="editQuestionTitle" type="text" class="input" placeholder="Question Title" v-bind:value="questionTitle"></input>\
						<textarea onfocus="expandTextarea(this);" oninput="expandTextarea(this);" class="textarea" rows="3" id="editQuestionBody" placeholder="Question Body..." style="margin-top: 10px; width: 100%; padding: 10px;">{{ tutorialContent }}</textarea>\
						<input id="editQuestionTags" type="text" class="input" placeholder="Question Tags (separated by commas) ..." style="margin-top: 10px; width: 100%;" v-model="tagInput">\
						<button class="button is-primary" v-on:click="editClick" style="margin-top: 10px;">Edit</button>\
						<button class="button is-link" v-on:click="cancel" style="margin-top: 10px;">Cancel</button><br><br>\
						<h3>Common Tags</h3>\
						<div class="tags">\
							<a v-for="tag in app.allTags" v-on:click="addTag(tag.name)" class="tag">{{tag.name}}</a>\
						</div>\
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
		getQuestion(this.params.id, this.params.certuserid, false, false, fillInCurrentUser); // NOTE that this will set the app.questionAuthaddress, which is used by the postAnswer() function
	},
	methods: {
		cancel() {
			Router.navigate('questions/' + app.questionAuthaddress + '/' + app.referenceID);
		}
	},
	mounted: function() {
		fillInCurrentUser();
	},
	template: '\
		<div>\
			<section class="section">\
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<h2>Create New Answer</h2>\
						<span style="color: blue;" class="currentuser"></span>:<br>\
						<textarea oninput="expandTextarea(this);" id="answerBody" class="textarea" rows="3" placeholder="Answer Body..." style="margin-top: 10px; width: 100%; padding: 10px;"></textarea>\
						<button class="button is-primary" onclick="postAnswer();" style="margin-top: 10px;">Post</button>\
						<button class="button is-link" v-on:click="cancel()" style="margin-top: 10px;">Cancel</button>\
					</div>\
				</div>\
			</section>\
		</div>'
};

var QuestionsTagsTag = {
	props: ['questionsList'],
	init: function() {
		var that = this;
		setupHero(false, "Questions", "Tag: " + that.params.tag);
		getTags(true, function() {
			getQuestionsToTag(that.params.tag);
		});
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
				<div class="columns is-centered">\
					<div class="column is-three-quarters-tablet is-half-desktop">\
						<!--<route-link to="questions/new" class="button is-primary">Create New Question</route-link>-->\
						<hr>\
						<div v-for="question in questionsList">\
							<h3 style="margin-bottom: 0;"><a v-bind:href="getQuestionHref(question)" v-on:click.prevent="questionClick(question)">{{ question.title }}</a></h3><small style="color: #6a6a6a;">by <a style="color: #A987E5;">{{ question.cert_user_id }}</a> <span v-html="getPostDate(question.date_added)"></span></small>\
							<hr>\
						</div>\
					</div>\
				</div>\
			</section>\
		</div>'
}
