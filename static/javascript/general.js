//Reoccuring functions


//Get subpage
var subpage = window.location.pathname.replace(/\/$/,'').split('/');
subpage = subpage[subpage.length-1]
var pageinfo = typeof dataPage!=='undefined'? pageinfos[dataPage]: null
// var subpageinfo = !pageinfo||!subpage||!(pageinfo instanceof Array)?pageinfo:pageinfo.find(function(subpageinfo){
// 	return subpageinfo.title.replace(/ /g,"-").toLowerCase().replace("å","a").replace("ä","a").replace('ö','o') == subpage
// })

//Get id
function _(id){
	return document.getElementById(id)
}

//Get class
function __(eClass){
	return document.querySelectorAll('.' + eClass)
}
//Current Firebase user
function currentUser(){
	var user = firebase.auth().currentUser
	if(user){
		var userId = firebase.auth().currentUser.uid
	}
	return user
}

function db(path){
	return firebase.database().ref(path)
}

function dbPull(path, func){
	return firebase.database().ref(path).once('value', func)
}

function timeString(date) {
	var monthNames = ["January", "February", "March", "April", "March", "June", "July", "August", "September", "October", "November", "December"]

	if((new Date()).getTime() > (date + 1000*60*60*24)){
		return((new Date(date)).getDate() + ' of ' + monthNames[(new Date(date)).getMonth()])
	}else{
		return((new Date(date)).getHours() + ':' + (new Date(date)).getMinutes())
	}
}

//Get requests
function serverData(path, success, error){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(JSON.parse(xhr.responseText));
			} else {
				if (error)
					error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

//Validate email
function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}




// Get nearby fitting people

// var uid

// firebase.database().ref('creators/' + uid).once(function(snapshot){
// 	var currentUser = snapshot.val()
// 	var currentUserLocation = currentUser.location

// 	firebase.database().ref('location/' + currentUserLocation.country + '/cities/' + currentUserLocation.country).orderByChild('skills/' + currentUser.skills.topSkills).startAt('').once(function(snapshot){
// 		var currentUserLocation = snapshot.val()
		

// 	})

// })



function popUp(content){
	var pageOverlay = document.createElement('div')
	pageOverlay.classList.add('page-overlay')
	document.body.appendChild(pageOverlay)

	var popUpBox = document.createElement('div')
	var text = document.createElement('p')
	var confirm = document.createElement('div')

	popUpBox.classList.add('pop-up-box')
	text.classList.add('text')
	confirm.classList.add('confirm')

	confirm.setAttribute('onclick', 'closePopUp()')
	popUpBox.appendChild(text)
	popUpBox.appendChild(confirm)

	text.innerHTML = content
	confirm.innerText = 'Close'
	pageOverlay.appendChild(popUpBox)
}

function closePopUp(){
	var pageOverlay = document.querySelector('.page-overlay')

	pageOverlay.remove()
}

function replaceNbsps(str) {
  var re = new RegExp(String.fromCharCode(160), "g");
  return str.replace(re, " ");
}
