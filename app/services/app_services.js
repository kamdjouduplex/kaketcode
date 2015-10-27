'use strict';

angular.module('dede.service', ['ngProgressLite'])


.factory('post_service', ['$firebase', 'URL', 'ngProgressLite', function($firebase, URL, ngProgressLite){
	
	var fbref = new Firebase(URL).child('posts');
	var postRef = $firebase(fbref.limitToFirst(15)).$asArray();
	
	var posts = {};
	ngProgressLite.start();
	postRef.$loaded().then(function(postRef) {
	   ngProgressLite.done();
	});
	posts.allPosts = postRef;
	
	posts.deletepost = function(post){
		return $firebaseArray(fbref).remove(post);
	}

	posts.getUrl = function (e, reader, file, fileList, fileOjects, fileObj) {
		var image = new Image();
		image.src = 'data:image/png;base64,'+fileObj.base64;
		return image.src;
	};

	posts.childAdded = function(){
		postRef.on('child_added', function(snapshort){
			return snapshort.name();
		})
	}

	posts.add = function(post){
		return postRef.$add(post);
	}

	return posts;
}])

.factory('authentication_service', ['$firebase', '$route', 'URL', function($firebase, $route, URL){
	var ref = new Firebase(URL);
	var usersRef = ref.child('users');
	var authen = {};

	var userStatus = {};
	function authDataCallback(authData) {
	  if (authData) {
	    getUser(authData, true);
	    //$route.reload();
	  } else {
	  	getUser(null, false);
	  	//$route.reload();
	  }
	}
	// Register the callback to be fired every time auth state changes
	var ref = new Firebase(URL);
	 ref.onAuth(authDataCallback);
	function getUser(user, state){
		authen.getuser = {User: user, State: state};
	}


	authen.login = function(){
		ref.authWithOAuthPopup("facebook", function(error, authData) {
		  if (error) {
		    alert('We are very sorry. something when wrong and we could not completly process the login. try later thanks');
		  } else {
		  	usersRef.once('value', function(snapshot) {
		  	  if (snapshot.hasChild(authData.uid)) {
		  	    
		  	  }else {
		  	  	usersRef.child(authData.uid).set(getName(authData));
		  	  }
		  	});
		  }
		}, {remember: "sessionOnly",  scope: "email,user_likes"});
	}

	authen.logout = function(){
		ref.unauth();
	}
	// find a suitable name based on the meta info given by each provider
	function getName(authData) {
	  switch(authData.provider) {
	     case 'password':
	       return authData.password.email.replace(/@.*/, '');
	     case 'twitter':
	       return authData.twitter.displayName;
	     case 'facebook':
	       return {
	       	provider:    authData.provider,
	       	accesstoken: authData.facebook.accessToken, 
	       	uid:         authData.facebook.cachedUserProfile.id,
	       	ufirstname:  authData.facebook.cachedUserProfile.first_name,
	       	ulastname:   authData.facebook.cachedUserProfile.last_name,
	       	uname:       authData.facebook.cachedUserProfile.name,
	       	uemail:      authData.facebook.cachedUserProfile.email,
	       	ugentder:    authData.facebook.cachedUserProfile.gender,
	       	ulanguage:   authData.facebook.cachedUserProfile.locale,
	       	utimezone:   authData.facebook.cachedUserProfile.timezone,
	       	upicture:    authData.facebook.cachedUserProfile.picture.data.url
	       }
	  }
	}

	return authen;
}])


