function renderAllSkills(profileSkills, profileType, profileId){
	firebase.database().ref('skills').once("value", function(snapshot){

		[document.getElementById('profile-skills').querySelector('.my-wrapper'), document.getElementById('profile-skills').querySelector('.potential-wrapper').querySelector('.content')].forEach(function(el){
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		})

		var allSkills = snapshot.val()

		Object.values(allSkills).forEach(function(mainSkill, idx){
			var mainSkillId = Object.keys(allSkills)[idx]
			if(profileSkills){
				var profileMainSkill = profileSkills[mainSkillId]
			}else{
				var profileMainSkill = false
			}
			renderSkill(Object.values(allSkills)[idx].name, mainSkillId, profileMainSkill, true)

			if(profileMainSkill){
				Object.values(mainSkill.subSkills).forEach(function(subSkill, idx2){
					var subSkillId = Object.keys(mainSkill.subSkills)[idx2]
					if(profileMainSkill){
						var profileSubSkill = profileSkills[mainSkillId][subSkillId]
					}else{
						var profileSubSkill = false
					}
					
					renderSkill(subSkill.name, subSkillId, profileSubSkill, false, mainSkillId)
				})
			}
			
		})
	})
	//render skills

	function renderSkill(title, id, checked, isMainSkill, mainSkillId){
		var skillDiv = document.createElement('label')
		skillDiv.classList.add('skill')
		if(isMainSkill){skillDiv.classList.add('main-skill')}
		document.getElementById('profile-skills').querySelector('.potential-wrapper').querySelector('.content').appendChild(skillDiv)

		var checkmark = document.createElement('input')
		checkmark.type = 'checkbox'
		checkmark.dataset.skillId = id
		checkmark.id = id
		checkmark.dataset.isMainSkill = isMainSkill
		checkmark.dataset.mainSkillId = mainSkillId
		checkmark.classList.add('checkmark')
		checkmark.checked = checked
		if(!isMainSkill){checkmark.classList.add('main-' + mainSkillId)}
		skillDiv.appendChild(checkmark)

		checkmark.onclick = function(el){

			//- if(el.target.dataset.isMainSkill == 'true'){
			//- 	if(!el.target.checked) document.querySelectorAll('.main-' + el.target.dataset.skillId).forEach(function(el2){
			//- 		el2.checked = false
			//- 	})
			//- 	profileSkills[el.target.dataset.skillId] = el.target.checked || null
			//- }else{
			//- 	if(!_(el.target.dataset.mainSkillId).checked){
			//- 		el.target.checked = false
			//- 		return
			//- 	}

			//- 	if(typeof(profileSkills[el.target.dataset.mainSkillId]) == "boolean"){
			//- 		profileSkills[el.target.dataset.mainSkillId] = {}
			//- 	}
			//- 	profileSkills[el.target.dataset.mainSkillId][el.target.dataset.skillId] = el.target.checked || null

			//- 	if(typeof(profileSkills[el.target.dataset.mainSkillId]) !== "boolean"){

			//- 		var onlyNull = true

			//- 		Object.values(profileSkills[el.target.dataset.mainSkillId]).forEach(function(val){
			//- 			if(val !== null){onlyNull = false}
			//- 		})

			//- 		if(onlyNull){
			//- 			profileSkills[el.target.dataset.mainSkillId] = true
			//- 		}
			//- 	}
			//- }
			//- console.log(profileSkills)

			if(el.target.dataset.isMainSkill == 'true'){
				var skillPath = el.target.dataset.skillId
			}else{
				var skillPath = el.target.dataset.mainSkillId + '/' + el.target.dataset.skillId
			}

			if(profileType == 'creator'){
				var firebasePath = 'users/creators/' + profileId + '/skills/' + skillPath
			}else if(profileType == 'team'){
				var firebasePath = 'teams/' + profileId + '/skills/' + skillPath
			}


			firebase.database().ref(firebasePath).set(el.target.checked).then(function(){
				reRenderAllSkills()
				if(profileType == 'team'){
					if(noNameSaved){newTeamSave()}
				}
			})
			
		}	

		var titleP = document.createElement('p')
		titleP.innerText = title
		titleP.classList.add('title')
		if(isMainSkill){titleP.style.fontWeight = "500"}
		skillDiv.appendChild(titleP)

		if(checked){
			var enabledSkillDiv = skillDiv.cloneNode(true)
			document.getElementById('profile-skills').querySelector('.my-wrapper').appendChild(enabledSkillDiv)
			enabledSkillDiv.querySelector('.checkmark').onclick = checkmark.onclick
		}
	}
}