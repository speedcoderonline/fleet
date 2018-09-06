function updateChat(myChatId){
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
		clearTimeout(updateLastRead)
		updateLastRead = setTimeout(function(){
			firebase.database().ref('users/creators/' + user.uid + '/chats/' + myChatId).set( (new Date()).getTime() );console.log('updated')
			if(_(myChatId)){_(myChatId).classList.remove('notafication')}
		},1000)

		var messageInfo = snapshot.val()

		var wrapper = document.createElement('div')
		wrapper.classList.add('message')
		if(messageInfo.sender == user.uid){
			wrapper.classList.add('mine')
		}
		document.querySelector('#messagesField').appendChild(wrapper)

		var content = document.createElement('div')
		content.classList.add('content')
		wrapper.appendChild(content)

		var sender = document.createElement('p')
		sender.classList.add('sender')
		sender.innerText = userNames[messageInfo.sender]
		content.appendChild(sender)

		var message = document.createElement('p')
		message.classList.add('text')
		message.innerText = replaceNbsps(messageInfo.message)
		content.appendChild(message)

		var date = document.createElement('p')
		date.classList.add('date')
		date.innerText = timeString(messageInfo.date)
		content.appendChild(date)

		updateScroll()
	}

	var messageRef = firebase.database().ref('chats/' + myChatId + '/messages')

	if(firstChat) {
		messageRef.orderByChild('date').on("child_added", currentMessagePull)
		firstChat = false
	}else{
		messageRef.off("child_added", currentMessagePull)
		messageRef.orderByChild('date').on("child_added", currentMessagePull)
	}
	
}

function sendMessage(){
	var message = document.querySelector('#writtenmessage').innerText
	var messageId = (new Date()).getTime()
	firebase.database().ref('chats/' + currentChat + '/messages/' + messageId).set({
		date: messageId,
		message: message,
		sender: user.uid
	}).then(function(){
		firebase.database().ref('chats/' + currentChat + '/latestAction').set((new Date()).getTime())
		document.querySelector('.message-input').innerText = ''
	})
}

function updateScroll(){
	var element = document.getElementById("chatField");
	element.scrollTop = element.scrollHeight - element.clientHeight

	window.scrollTo(0,document.body.scrollHeight)
}