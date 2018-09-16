var lastSentMessage = 0
var loadedMessages = {}

function updateChat(myChatId){
	var firstPull = true
	loadedMessages = {}
	
	_('chatField').classList.remove('display-none')
	if(_(myChatId)){
		_(myChatId).classList.remove('notafication')
	}
	
	currentChat = myChatId
	var latestRead

	var myNode = document.getElementById("messagesField");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}

	var updateLastRead

	currentMessagePull = function(snapshot){
		if(loadedMessages[snapshot.key]){console.log('gotcha!');return}
		loadedMessages[snapshot.key] = true
		clearTimeout(updateLastRead)
		updateLastRead = setTimeout(function(){
			firebase.database().ref('users/creators/' + user.uid + '/chats/' + myChatId).set( (new Date()).getTime() );console.log('updated')
			if(_(myChatId)){_(myChatId).classList.remove('notafication')}
		},1000)

		var messageInfo = snapshot.val()

		var wrapper = document.createElement('div')
		wrapper.classList.add('message')
		wrapper.id = snapshot.key
		if(messageInfo.sender == user.uid){
			wrapper.classList.add('mine')
		}

		var laterMessage = 0

		Object.keys(loadedMessages).forEach(function(messageTime){
			if(messageTime > snapshot.key && (messageTime < laterMessage || laterMessage == 0)){laterMessage = messageTime}
		})

		if(laterMessage){
			document.querySelector('#messagesField').insertBefore(wrapper, _(laterMessage))
		}else{
			document.querySelector('#messagesField').appendChild(wrapper)
		}

		var content = document.createElement('div')
		content.classList.add('content')
		wrapper.appendChild(content)

		var sender = document.createElement('p')
		sender.classList.add('sender')
		sender.onclick = function(){
			window.location = '/users/creator-' + messageInfo.sender
		}
		if(userNames[messageInfo.sender]){
			sender.innerText = userNames[messageInfo.sender]
		}else{
			firebase.database().ref('users/creators/' + messageInfo.sender + '/firstname').once("value", function(snapshotFirst){
				sender.innerText = ''
				sender.innerText += snapshotFirst.val()

				console.log('ye')
			})
			firebase.database().ref('users/creators/' + messageInfo.sender + '/lastname').once("value", function(snapshotLast){
				sender.innerText = ''
				sender.innerText += snapshotLast.val()

				userNames[messageInfo.sender] = sender.innerText
			})
		}
		
		content.appendChild(sender)

		var message = document.createElement('p')
		message.classList.add('text')
		message.innerText = replaceNbsps(messageInfo.message)
		content.appendChild(message)

		var date = document.createElement('p')
		date.classList.add('date')
		date.innerText = timeString(messageInfo.date)
		content.appendChild(date)

		if(firstPull){updateScroll()}
	}

	var messageRef = firebase.database().ref('chats/' + myChatId + '/messages')
	setTimeout(function(){firebase.database().ref('users/creators/' + user.uid + '/chats/' + myChatId).set( (new Date()).getTime() )},500)

	var loadBtn = document.createElement('div')
	loadBtn.classList.add('load-btn')
	loadBtn.innerText = 'Load more'
	loadBtn.onclick = function(){
		firstPull = false
		var endAtKey = Math.min(...Object.keys(loadedMessages)).toString()
		messageRef.orderByChild('date').limitToLast(Object.keys(loadedMessages).length + 3).endAt(endAtKey).once("value", function(snapshot){
			snapshot.forEach(function(message){
				currentMessagePull(message)
			})
		})
	}
	document.querySelector('#messagesField').appendChild(loadBtn)

	if(firstChat) {
		messageRef.orderByChild('date').limitToLast(3).on("child_added", currentMessagePull)
		firstChat = false
	}else{
		messageRef.off("child_added", currentMessagePull)
		messageRef.orderByChild('date').limitToLast(3).on("child_added", currentMessagePull)
	}

}

function sendMessage(){
	if((lastSentMessage + 200)>(new Date()).getTime()){console.log('hindered');return}
	lastSentMessage = (new Date()).getTime()

	var message = document.querySelector('#writtenmessage').innerText
	var messageId = (new Date()).getTime()
	firebase.database().ref('chats/' + currentChat + '/messages/' + messageId).set({
		date: messageId,
		message: message,
		sender: user.uid
	}).then(function(){
		
		firebase.database().ref('chats/' + currentChat + '/latestAction').set((new Date()).getTime())
		document.querySelector('.message-input').innerText = ''
		firebase.database().ref('chats/' + currentChat + '/latestAction').once("value", function(snapshotLatestAction){
			firebase.database().ref('chats/' + currentChat + '/members/').once("value", function(snapshotMembers){
				Object.values(snapshotMembers.val()).forEach(function(memberActive, idx){
					if(Object.keys(snapshotMembers.val())[idx] == user.uid){return}
					firebase.database().ref('chats/' + currentChat + '/latestNotafication/' + Object.keys(snapshotMembers.val())[idx]).once("value", function(snapshotLatestNotif){
						if(((memberActive + 1000*60*60*24*2)<snapshotLatestAction.val())&&(((snapshotLatestNotif.val()||0) + 1000*60*60*24*2)<snapshotLatestAction.val())){
							
							firebase.database().ref('users/creators/' + Object.keys(snapshotMembers.val())[idx] + '/email').once("value", function(snapshotEmail){
								firebase.database().ref('chats/' + currentChat + '/latestNotafication/' + Object.keys(snapshotMembers.val())[idx]).set((new Date()).getTime())
								sendEmail(snapshotEmail.val(), 'You have new messages from ' + currentChatName, 'Hi!<br><br>You have new messages from ' + currentChatName + ', check them out and respond!')
							})
						}
					})
				})
			})
		})
		//Kolla hur länge sedan det var alla såg efter en timeout. Om det var mer än två dagar sedan det var innte, skicka notification
	})
}

function updateScroll(){
	var element = document.getElementById("chatField");
	element.scrollTop = element.scrollHeight - element.clientHeight

	window.scrollTo(0,document.body.scrollHeight)
}