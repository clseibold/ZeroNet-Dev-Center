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
	    				</div>\
\
	    				<!-- This "nav-menu" is hidden on mobile -->\
	    				<!-- Add the modifier "is-active" to display it on mobile -->\
	    				<div id="nav-menu" class="nav-right nav-menu">\
	    					<route-link to="/" class="nav-item is-active">Home</route-link>\
	    					<route-link to="/tutorials" class="nav-item">Tutorials</route-link>\
	    					<route-link to="/questions" class="nav-item">Questions</route-link>\
	    					<!--<a class="nav-item">Questions</a>-->\
	    					<span class="nav-item"><a href="#Select+user" id="select_user" class="button is-info" onclick="return zeroframe.selectUser()"><span class="currentuser">Select User</span></a></span>\
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

Vue.component('tutorial-list-item', {
	props: ['title', 'authors', 'slug', 'tags'],
	computed: {
		getSlug: function() {
			return 'tutorials/' + this.slug;
		}
	},
	template: '\
		<div>\
			<span class="title is-5" style="margin-right: 20px;"><route-link :to="getSlug">{{ title }}</route-link></span><span class="subtitle is-6">{{ authors }}</span><br>\
			<small style="margin-top: 10px;"><slot></slot></small><br>\
			<small style="float: right;">{{tags}}</small>\
			<div style="clear: both;"></div>\
		<hr></div>'
});

Vue.component('tutorial-comment', {
	props: ['username', 'body', 'date'],
	computed: {
		getBody: function() {
			return md.render(this.body);
		}
	},
	template: '\
		<div style="padding-top: 20px; padding-bottom: 20px; border-top: 1px solid #EBEBEB;">\
			<span style="color: blue;">{{ username }}:</span><br>\
			<div style="margin-top: 3px;" v-html="getBody" class="custom-content is-small"></div>\
		</div>'
});

Vue.component('question-answer', {
	props: ['referenceid', 'username', 'directory', 'body', 'date', 'comments'],
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
			//this.getComments();
			// TODO: Refresh Comments
		}
	},
	data: function() {
		return {
			isCommentBoxShown: false
		}
	},
	template: '\
		<div class="box" style="padding-top: 20px; padding-bottom: 20px;">\
			<span style="color: blue;">{{ username }}:</span><br>\
			<div style="margin-top: 3px;" v-html="getBody" class="custom-content"></div>\
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
      			<!--<span style="color: blue;" class="currentuser"></span>:<br>-->\
				<textarea id="comment" class="textarea is-small" rows="3" style="width: 100%; padding: 7px;" placeholder="Comment..."></textarea>\
				<button class="button is-primary" v-on:click="innerPostComment" style="margin-top: 10px;">Comment</button>\
      		</div>\
      		<tutorial-comment v-for="comment in getComments" :key="comment.id" :username="comment.cert_user_id" :body="comment.body" :date="comment.date_added">\
			</tutorial-comment>\
		</div>'
});
