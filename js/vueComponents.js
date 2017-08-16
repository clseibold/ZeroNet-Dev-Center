Vue.component('my-hero', {
	props: ['title', 'subtitle'],
	template: '\
		<section class="hero is-dark is-bold">\
			<div class="hero-head" v-once>\
	    		<header class="nav">\
	    			<div class="container">\
	    				<div class="nav-left">\
	    					<!-- This "nav-toggle" hamburger menu is only visible on mobile -->\
	    					<!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->\
	    					<span id="nav-toggle" class="nav-toggle">\
	    						<span></span>\
	    						<span></span>\
	    						<span></span>\
	    					</span>\
	    					<route-link to="/" class="nav-item" style="font-weight: bold;">ZeroNet Dev Center</route-link>\
							<route-link to="/blog" class="nav-item is-hidden-mobile">Blog</route-link>\
							<route-link to="/tutorials" class="nav-item is-hidden-mobile">Tutorials</route-link>\
	    					<route-link to="/questions" class="nav-item is-hidden-mobile">Questions</route-link>\
	    				</div>\
\
	    				<!-- This "nav-menu" is hidden on mobile -->\
	    				<!-- Add the modifier "is-active" to display it on mobile -->\
	    				<div id="nav-menu" class="nav-right nav-menu">\
							<route-link to="/blog" class="nav-item is-hidden-tablet">Blog</route-link>\
							<route-link to="/tutorials" class="nav-item is-hidden-tablet">Tutorials</route-link>\
							<route-link to="/questions" class="nav-item is-hidden-tablet">Questions</route-link>\
	    					<!--<span class="nav-item"><a href="#Select+user" id="select_user" class="button is-info" onclick="return zeroframe.selectUser()"><span class="currentuser">Select User</span></a></span>-->\
							<span class="nav-item"><span class="currentuser"></span></span>\
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

Vue.component('blog-list-item', {
	props: ['title', 'slug', 'tags', 'dateAdded'],
	computed: {
		getSlug: function() {
			return 'blog/' + this.slug;
		},
		getPostDate: function() {
			return "Published on " + moment(this.dateAdded).format('MMMM Do, YYYY [at] h:mm:ss a');
		}
	},
	template: '\
		<div>\
			<span class="title is-5" style="margin-right: 20px;"><route-link :to="getSlug">{{ title }}</route-link></span><br>\
			<small>{{ getPostDate }}</small>\
			<small>{{tags}}</small>\
			<div style="clear: both;"></div>\
		<hr></div>'
});

Vue.component('tutorial-list-item', {
	props: ['title', 'authors', 'slug', 'tags'],
	computed: {
		getSlug: function() {
			return 'tutorials/' + this.slug;
		},
		getTagsList: function() {
			return this.tags.split(',');
		}
	},
	template: '\
		<div>\
			<span class="title is-5" style="margin-right: 20px;"><route-link :to="getSlug">{{ title }}</route-link></span><span class="subtitle is-6">{{ authors }}</span><br>\
			<small style="margin-top: 10px;"><slot></slot></small><br>\
			<div class="tags" style="margin-top: 10px;">\
				<small v-for="tag in getTagsList" class="tag">{{tag}}</small>\
			</div>\
			<div style="clear: both;"></div>\
		<hr></div>'
});

Vue.component('tutorial-comment', { // TODO: Change this to just comment
	props: ['currentAuthaddress', 'commentId', 'username', 'directory', 'body', 'date', 'referenceType', 'referenceAuthaddress'],
	computed: {
		getBody: function() {
			return md.render(this.body);
		},
		getPostDate: function() {
			return "― " + moment(this.date).fromNow();
		},
		getAuthAddress: function() {
			return this.directory.replace(/users\//, '').replace(/\//, '');
		},
		isEditLinkShown: function() {
			if (!this.currentAuthaddress) return false;
			return this.currentAuthaddress == this.getAuthAddress;
		},
		getTextareaId: function() {
			return "editCommentBody" + this.commentId + "From" + this.getAuthAddress;
		},
		getTextArea: function() {
			return document.getElementById(this.getTextareaId);
		}
	},
	methods: {
		editComment: function() {
			if (!this.showEdit) { // Clicked Edit
				this.showEdit = true;
				this.editText = "Save";
				// TODO: Instead of expanding on onfocus, do it when the textarea is shown.
			} else { // Clicked Save
				//var textarea = document.getElementById(this.getTextareaId);
				this.showEdit = false;
				this.editText = "Edit";
				editComment(this.commentId, this.getTextArea, this.getAuthAddress, this.referenceType, this.referenceAuthaddress);
			}
		},
		dontShowEdit: function() {
			return !this.showEdit;
		},
		showCancel: function() {
			return this.isEditLinkShown && this.showEdit;
		},
		cancelEdit: function() {
			this.showEdit = false;
			this.editText = "Edit";
			this.getTextArea.value = this.body;
			expandTextarea(this.getTextArea);
		}
	},
	data: function() {
		return {
			showEdit: false,
			editText: 'Edit'
		}
	},
	template: '\
		<div style="padding-top: 20px; padding-bottom: 20px; border-top: 1px solid #EBEBEB;">\
			<span style="color: blue;">{{ username }} <small style="color: #6a6a6a;" v-html="getPostDate"></small></span>\
			<small><a v-show="isEditLinkShown" v-on:click.prevent="editComment">{{ editText }}</a>\
	        <a v-show="showCancel()" v-on:click.prevent="cancelEdit">Cancel</a></small><br>\
			<div style="margin-top: 3px;" v-html="getBody" class="custom-content is-small" v-show="dontShowEdit()"></div>\
			<div style="margin-top: 3px;" v-if="showEdit" class="custom-content">\
				<textarea v-bind:id="getTextareaId" onfocus="expandTextarea(this);" oninput="expandTextarea(this);" class="textarea is-small" rows="2" style="width: 100%; padding: 7px;" style="height: auto;">{{ body }}</textarea>\
			</div>\
		</div>'
});

Vue.component('question-answer', {
	props: ['currentAuthaddress', 'referenceid', 'username', 'directory', 'body', 'date', 'voteAmount', 'currentUservoted', 'comments', 'questionid', 'questionAuthaddress', 'solutionid', 'solutionAuthaddress'],
	computed: {
		getBody: function() {
			return md.render(this.body);
		},
		getComments: function() {
			return result = this.comments.filter((comment) => {
				return comment.reference_type == "a" && comment.reference_id == this.referenceid && comment.reference_auth_address == this.getAuthAddress;
			});
		},
		getAuthAddress: function() {
			return this.directory.replace(/users\//, '').replace(/\//g, '');
		},
		getPostDate: function() {
			return "― " + moment(this.date).fromNow();
		},
		isEditLinkShown: function() {
			if (!this.currentAuthaddress) return false;
			return this.currentAuthaddress == this.getAuthAddress;
		},
		isMarkSolutionLinkShown: function() {
			// If creator of question is same as current user
			if (this.isSolution) return false;
			if (!this.currentAuthaddress) return false;
			return this.currentAuthaddress == this.questionAuthaddress;
		},
		getTextareaId: function() {
			return "editAnswerBody" + this.referenceid + "From" + this.getAuthAddress;
		},
		getTextArea: function() {
			return document.getElementById(this.getTextareaId);
		},
		isSolution: function() {
			if (!this.solutionid || !this.solutionAuthaddress) return false;
			return this.referenceid == this.solutionid && this.getAuthAddress == this.solutionAuthaddress;
		}
	},
	methods: {
		toggleCommentBox: function() {
			this.isCommentBoxShown = !this.isCommentBoxShown;
		},
		innerPostComment: function() {
			postComment('a', this.referenceid, this.getAuthAddress, false, function() {
				getAllComments();
			});
		},
		editAnswer: function() {
			if (!this.showEdit) { // Clicked Edit
				this.showEdit = true;
				this.editText = "Save";
				// TODO: Instead of expanding on onfocus, do it when the textarea is shown.
			} else { // Clicked Save
				//var textarea = document.getElementById(this.getTextareaId);
				this.showEdit = false;
				this.editText = "Edit";
				editAnswer(this.referenceid, this.getTextArea, this.getAuthAddress);
			}
		},
		dontShowEdit: function() {
			return !this.showEdit;
		},
		showCancel: function() {
			return this.isEditLinkShown && this.showEdit;
		},
		cancelEdit: function() {
			this.showEdit = false;
			this.editText = "Edit";
			this.getTextArea.value = this.body;
			expandTextarea(this.getTextArea);
		},
		markSolution: function() {
			questionMarkSolution(this.questionid, this.questionAuthaddress, this.referenceid, this.getAuthAddress);
		},
		upvote: function() {
			voteForAnswer(this.referenceid, this.getAuthAddress, false);
		},
		downvote: function() {
			voteForAnswer(this.referenceid, this.getAuthAddress, true);
		}
	},
	data: function() {
		return {
			isCommentBoxShown: false,
			showEdit: false,
			editText: "Edit"
		}
	},
	template: '\
		<div class="box" style="padding-top: 20px; padding-bottom: 20px;">\
			<span class="tag is-info" style="margin-right: 0px;">{{ voteAmount }}</span>\
			<span class="tag is-success is-small" v-if="isSolution" style="margin-right: 0px;">Solution</span>\
			<span style="color: blue; margin-left: 2px;">{{ username }} <small style="color: #6a6a6a;" v-html="getPostDate"></small></span><br>\
			<div style="margin-top: 3px;" v-html="getBody" class="custom-content" v-show="dontShowEdit()"></div>\
			<div style="margin-top: 3px;" v-show="showEdit" class="custom-content">\
				<textarea v-bind:id="getTextareaId" onfocus="expandTextarea(this);" oninput="expandTextarea(this);" class="textarea" rows="3" style="width: 100%; padding: 7px;" style="height: auto;">{{ body }}</textarea>\
			</div>\
			<nav class="level is-mobile">\
		        <div class="level-left">\
			        <a class="level-item" v-on:click="toggleCommentBox">\
			        	<span class="icon is-small"><i class="fa fa-reply"></i></span>\
			        </a>\
			        <a class="level-item" v-on:click="upvote">\
			        	<span class="icon is-small"><i class="fa fa-arrow-up"></i></span>\
			        </a>\
			        <!--<span class="level-item" v-if="voteAmount > 0">{{ voteAmount }}</span>-->\
			        <a class="level-item" v-on:click="downvote">\
			        	<span class="icon is-small"><i class="fa fa-arrow-down"></i></span>\
			        </a>\
			        <a class="level-item" v-show="isMarkSolutionLinkShown" v-on:click.prevent="markSolution">\
			        	<span class="icon is-small"><i class="fa fa-check"></i></span>\
			        </a>\
			        <a class="level-item" v-show="isEditLinkShown" v-on:click.prevent="editAnswer">{{ editText }}</a>\
			        <a class="level-item" v-show="showCancel()" v-on:click.prevent="cancelEdit">Cancel</a>\
		        </div>\
      		</nav>\
      		<div v-if="isCommentBoxShown" style="margin-bottom: 20px; border-top: 1px solid #EBEBEB; padding-top: 20px;">\
      			<!--<span style="color: blue;" class="currentuser"></span>:<br>-->\
				<textarea id="comment" oninput="expandTextarea(this);" class="textarea is-small" rows="2" style="width: 100%; padding: 7px;" placeholder="Comment..."></textarea>\
				<button class="button is-primary" v-on:click="innerPostComment" style="margin-top: 10px;">Comment</button>\
      		</div>\
      		<tutorial-comment v-for="comment in getComments" :key="comment.comment_id" :current-authaddress="currentAuthaddress" :comment-id="comment.comment_id" :username="comment.cert_user_id" :body="comment.body" :directory="comment.directory" :date="comment.date_added" reference-type="q" :reference-authaddress="questionAuthaddress">\
			</tutorial-comment>\
		</div>'
});
