//Reoccuring functions

var subpage = window.location.pathname.replace(/\/$/,'').split('/');
subpage = subpage[subpage.length-1]
var pageinfo = typeof dataPage!=='undefined'? pageinfos[dataPage]: null
// var subpageinfo = !pageinfo||!subpage||!(pageinfo instanceof Array)?pageinfo:pageinfo.find(function(subpageinfo){
// 	return subpageinfo.title.replace(/ /g,"-").toLowerCase().replace("å","a").replace("ä","a").replace('ö','o') == subpage
// })

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

function addToEmailList(email){
	//check if emaol
	var email = document.querySelectior('#email-list-input').value
	$.getJSON("http://freegeoip.net/json/", function (data) {
		var country = data.country_name
		var region = data.region_name

		firebase.database().ref('emailList/' + email.replace(/\./g, '%2E')).set({
			email: email,
			date: (new Date()).getTime(),
			country: country,
			region: region,
		})
		alert('Thenka yö')
	});
}
