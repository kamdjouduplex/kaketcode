'use strict';

angular.module('dede.home', ['ngRoute', 'ngProgressLite'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home_page/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', function($scope, authentication_service) {

}])

.controller('UserCtrl', ['$scope', function($scope, authentication_service) {

}])

.controller('AuthenCtrl', ['$scope', 'authentication_service', '$route', function($scope, authentication_service, $route) {
	$scope.login = function(){
		authentication_service.login();
		//$route.reload();
	}

	$scope.logout = function(){
		
		authentication_service.logout();
		//$scope.isLoggedIn = authentication_service.loggedstate;
	}

	function authDataCallback(authData) {
	  if (authData) {
	    getUser(authData, true);
	    $route.reload();
	  } else {
	  	getUser(null, false);
	  	$route.reload();
	  }
	}
	// Register the callback to be fired every time auth state changes
	var ref = new Firebase("https://dede.firebaseio.com");
	ref.onAuth(authDataCallback);
	//console.log($scope.isLoggedIn);
	function getUser(user, state){
		$scope.mydata = {User: user, State: state};
		//console.log($scope.mydata);
	}
}])

.controller('PostsCtrl', ['$scope', 'post_service', '$firebase', 'authentication_service', 'ngProgressLite', '$timeout', function($scope, post_service, $firebase, authentication_service, ngProgressLite, $timeout) {

	$scope.posts = post_service.allPosts;
	var poster = authentication_service.getuser.User;
	$scope.mydata = authentication_service.getuser;
	$scope.addcomment = function(id) {
		var Id = id;
		var comments = new Firebase("https://dede.firebaseio.com/posts/"+Id+"/comments");
		var commentNum = new Firebase("https://dede.firebaseio.com/posts/"+Id+"/commentCount");
		var current;
		commentNum.on('value', function(data){
			current = data.val();
		});
		var countupdate = current+1;
		commentNum.set(countupdate);
	    comments.push({text: $scope.post_comment, user: poster});
	    $scope.post_comment = null;
	}

	$scope.modaladdpost = function(){
		$('#myModal2').modal('toggle');
	}

	$scope.modaladdask = function(){
		$('#myModal3').modal('toggle');
	}

	$scope.logout = function(){
		authentication_service.logout();
		$scope.mydata = authentication_service.getuser;
	}

	$scope.login = function(){
		authentication_service.login();
		$('#myModal').modal('toggle');
		$scope.mydata = authentication_service.getuser;
	}

	$scope.connect = function(){
		$('#myModal').modal('toggle');
	}

	$scope.like  = function(Id, likerName){
		var Likes = Id;
		var Name  = likerName;
		var likesRef = new Firebase("https://dede.firebaseio.com/posts/"+Likes+"/likes");
		var arrayRef = $firebase(likesRef).$asArray()
		console.log(arrayRef.length);
		likesRef.push(Name);
		//var display = new Firebase("https://dede.firebaseio.com/posts/"+Likes+"/displayLike");
		/*var currentlike;
		prevlikes.on('value', function(data){
			currentlike = data.val();
		});*/
		
		//var likeupdate = currentlike+1;

		//display.set(false);
	};

	$scope.unlike  = function(Id, unlikerName){
		var Unlikes = Id;
		var Name = unlikerName;
		var prevUnlikes = new Firebase("https://dede.firebaseio.com/posts/"+Unlikes+"/likes");
		var display = new Firebase("https://dede.firebaseio.com/posts/"+Unlikes+"/displayLike");
		var currentUnlike;
		prevUnlikes.on('value', function(data){
			currentUnlike = data.val();
		});

		var unlikeupdate = currentUnlike-1;
		prevUnlikes.set(unlikeupdate);
		display.set(true);
	};

}])



.controller('newPost', ['$scope', 'post_service', '$window', 'authentication_service', 'ngProgressLite', function($scope, post_service, $window, authentication_service, ngProgressLite){
	
	$scope.countries = ["from which country", "Algeria (+213)", "Andorra (+376)", "Angola (+244)", "Anguilla (+1264)", "Antigua & Barbuda (+1268)", "Argentina (+54)", "Armenia (+374)", "Aruba (+297)", "Australia (+61)", "Austria (+43)", "Azerbaijan (+994)", "Bahamas (+1242)", "Bahrain (+973)", "Bangladesh (+880)", "Barbados (+1246)", "Belarus (+375)", "Belgium (+32)", "Belize (+501)", "Benin (+229)", "Bermuda (+1441)", "Bhutan (+975)", "Bolivia (+591)", "Bosnia Herzegovina (+387)", "Botswana (+267)", "Brazil (+55)", "Brunei (+673)", "Bulgaria (+359)", "Burkina Faso (+226)", "Burundi (+257)", "Cambodia (+855)", "Cameroon (+237)", "Canada (+1)", "Cape Verde Islands (+238)", "Cayman Islands (+1345)", "Central African Republic (+236)", "Chile (+56)", "China (+86)", "Colombia (+57)", "Comoros (+269)", "Congo (+242)", "Cook Islands (+682)", "Costa Rica (+506)", "Croatia (+385)", "Cuba (+53)", "Cyprus North (+90392)", "Cyprus South (+357)", "Czech Republic (+42)", "Denmark (+45)", "Djibouti (+253)", "Dominica (+1809)", "Dominican Republic (+1809)", "Ecuador (+593)", "Egypt (+20)", "El Salvador (+503)", "Equatorial Guinea (+240)", "Eritrea (+291)", "Estonia (+372)", "Ethiopia (+251)", "Falkland Islands (+500)", "Faroe Islands (+298)", "Fiji (+679)", "Finland (+358)", "France (+33)", "French Guiana (+594)", "French Polynesia (+689)", "Gabon (+241)", "Gambia (+220)", "Georgia (+7880)", "Germany (+49)", "Ghana (+233)", "Gibraltar (+350)", "Greece (+30)", "Greenland (+299)", "Grenada (+1473)", "Guadeloupe (+590)", "Guam (+671)", "Guatemala (+502)", "Guinea (+224)", "Guinea - Bissau (+245)", "Guyana (+592)", "Haiti (+509)", "Honduras (+504)", "Hong Kong (+852)", "Hungary (+36)", "Iceland (+354)", "India (+91)", "Indonesia (+62)", "Iran (+98)", "Iraq (+964)", "Ireland (+353)", "Israel (+972)", "Italy (+39)", "Jamaica (+1876)", "Japan (+81)", "Jordan (+962)", "Kazakhstan (+7)", "Kenya (+254)", "Kiribati (+686)", "Korea North (+850)", "Korea South (+82)", "Kuwait (+965)", "Kyrgyzstan (+996)", "Laos (+856)", "Latvia (+371)", "Lebanon (+961)", "Lesotho (+266)", "Liberia (+231)", "Libya (+218)", "Liechtenstein (+417)", "Lithuania (+370)", "Luxembourg (+352)", "Macao (+853)", "Macedonia (+389)", "Madagascar (+261)", "Malawi (+265)", "Malaysia (+60)", "Maldives (+960)", "Mali (+223)", "Malta (+356)", "Marshall Islands (+692)", "Martinique (+596)", "Mauritania (+222)", "Mayotte (+269)", "Mexico (+52)", "Micronesia (+691)", "Moldova (+373)", "Monaco (+377)", "Mongolia (+976)", "Montserrat (+1664)", "Morocco (+212)", "Mozambique (+258)", "Myanmar (+95)", "Namibia (+264)", "Nauru (+674)", "Nepal (+977)", "Netherlands (+31)", "New Caledonia (+687)", "New Zealand (+64)", "Nicaragua (+505)", "Niger (+227)", "Nigeria (+234)", "Niue (+683)", "Norfolk Islands (+672)", "Northern Marianas (+670)", "Norway (+47)", "Oman (+968)", "Palau (+680)", "Panama (+507)", "Papua New Guinea (+675)", "Paraguay (+595)", "Peru (+51)", "Philippines (+63)", "Poland (+48)", "Portugal (+351)", "Puerto Rico (+1787)", "Qatar (+974)", "Reunion (+262)", "Romania (+40)", "Russia (+7)", "Rwanda (+250)", "San Marino (+378)", "Sao Tome & Principe (+239)", "Saudi Arabia (+966)", "Senegal (+221)", "Serbia (+381)", "Seychelles (+248)", "Sierra Leone (+232)", "Singapore (+65)", "Slovak Republic (+421)", "Slovenia (+386)", "Solomon Islands (+677)", "Somalia (+252)", "South Africa (+27)", "Spain (+34)", "Sri Lanka (+94)", "St. Helena (+290)", "St. Kitts (+1869)", "St. Lucia (+1758)", "Sudan (+249)", "Suriname (+597)", "Swaziland (+268)", "Sweden (+46)", "Switzerland (+41)", "Syria (+963)", "Taiwan (+886)", "Tajikstan (+7)", "Thailand (+66)", "Togo (+228)", "Tonga (+676)", "Trinidad & Tobago (+1868)", "Tunisia (+216)", "Turkey (+90)", "Turkmenistan (+7)", "Turkmenistan (+993)", "Turks & Caicos Islands (+1649)", "Tuvalu (+688)", "Uganda (+256)", "UK (+44)", "Ukraine (+380)", "United Arab Emirates (+971)", "Uruguay (+598)", "USA (+1)", "Uzbekistan (+7)", "Vanuatu (+678)", "Vatican City (+379)", "Venezuela (+58)", "Vietnam (+84)", "Virgin Islands - British (+1284)", "Virgin Islands - US (+1340)", "Wallis & Futuna (+681)","Yemen (North)(+969)", "Yemen (South)(+967)", "Zambia (+260)", "Zimbabwe (+263)"];
	$scope.post_country = $scope.countries[0];

	$scope.categories = ["Select a category", "For Sell", "For Rent", "Services", "Tickets", "Hotels"];
	$scope.post_category = $scope.categories[0];

	$scope.currencies = ["XAF", "$", "€"];
	$scope.post_currency = $scope.currencies[0];
	$scope.mydata = authentication_service.getuser;
	var User = authentication_service.getuser.User;
	if(User != null){
		var poster = {name: User.facebook.displayName, email: User.facebook.email, url: User.facebook.cachedUserProfile.picture.data.url};
	}
	
	$scope.login1 = function(){
		authentication_service.login();
		$('#myModal1').modal('toggle');
		$scope.mydata = authentication_service.getuser;
	}
	
	$scope.connect1 = function(){
		$('#myModal1').modal('toggle');
	}

	$scope.deletePost = function (post) {
	  post_service.deletepost(post);
	}; 

	$scope.addPost = function(){

		if ($scope.post_free === true) {
			var price = "FREE";
			$scope.post_currency = null;
		}else{
			if($scope.post_price == undefined){
				price = null;
				$scope.post_currency = null;
				$scope.post_category = null;
			}else{
				price = $scope.post_price;
			}
		}

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 

		if(mm<10) {
		    mm='0'+mm
		} 

		today = dd+'/'+mm+'/'+yyyy;
		
		var newpost = 
		{
			title        : $scope.post_title,
			description  : $scope.post_description,
			category     : $scope.post_category,
			currency     : $scope.post_currency,
			prix         : price,
			country      : $scope.post_country,
			city         : $scope.post_city,
			pictues      : "data:image/png;base64,"+$scope.post_files.base64,
			likes        : 0,
			phone        : $scope.post_phone,
			displayLike  : true,
			comments     : '',
			commentCount : 0,
			date_posted  : today,
			user         : poster
		}
		
		var promise = post_service.add(newpost);
		
		ngProgressLite.start();
		promise.then( function(data){
			
			if (data) {
				if(price == null){
					$('#myModal3').modal('toggle');
				}else{
					$('#myModal2').modal('toggle');
				}
				ngProgressLite.done();
			};
			$scope.postsuccess = 'posted successful!';
			console.log("posted successful");
		});
		//console.log(newpost);
		$scope.post_title = null;
		$scope.post_description = null;
		$scope.post_country = $scope.countries[0];
		$scope.post_category = $scope.categories[0];
		$scope.post_currency = $scope.currencies[0];
		$scope.post_city = null;
		$scope.post_price = null;
		$scope.post_free = null;
		$scope.post_phone = null;
		$scope.post_files.name = null;
	}

}])