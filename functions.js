if (typeof app_client == "undefined"){
    app_client = {};    
    app_client.functions = {};
};

//------------------------------Start timer------------------------------------------
app_client.functions.startTimer = function(del) {
	console.log('Start timer')
	app_client.functions.timer = setInterval(function() {
		app_client.functions.APositionUpdate()

	}, del);
}
//-----------------------------------------------------------------------------------

//--------------------------Update position of As-----------------------------
app_client.functions.APositionUpdate = function() {
	app_client.functions.getJSON.get_current_F()


;}
//-----------------------------------------------------------------------------------

//------------------------Calculate angle of marker----------------------------------
app_client.functions.getAngleIcon = function(XX1, YY1, XX2, YY2) {
	Angl = Math.atan2(YY1-YY2, XX1 -XX2) / Math.PI *180;
	//if (+XX1 < +XX2) {Angl = Angl + 180};			 
	return Angl;
};
//-----------------------------------------------------------------------------------

//--------------------------Show searched object on map------------------------------
app_client.functions.ShowFindObject = function(mdl) {
	if (mdl.Mrk != undefined) {
		app_client.variables.bool_In_F = true;
		if (app_client.functions.TimerMM !=null) {
			clearInterval(app_client.functions.TimerMM);
			app_client.variables.CurFindEl.setOpacity(1);
		};
		app_client.map.setZoom(6);	
		var iii = 1;
		mdl.Mrk.openPopup();
		app_client.functions.TimerMM = setInterval(function() {	
			if (iii == 1) {app_client.map.flyTo([mdl.Lat,mdl.Long]);};
			iii = +iii +1;
			app_client.variables.CurFindEl = mdl.Mrk;
			mdl.Mrk.setOpacity(1 - Math.sin(+iii / 10 * Math.PI));
			mdl.Mrk.update();
			if (iii == 150) {
				clearInterval(app_client.functions.TimerMM);
				app_client.functions.TimerMM = null;
				app_client.variables.bool_In_F.bool_In_F = false;
			};
		}, 50);
	};
};
//-----------------------------------------------------------------------------------

//----------------------Get list of dates from raw html text-------------------------
app_client.functions.getListDateOfF = function(htmlText) {
	if (htmlText.indexOf('no r found') != -1) {
		console.log('I r is not found')
		return null;
	}
	else {
		const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
		var elmt = document.createElement('html');
		elmt.innerHTML = htmlText;

		try {
			var ulDates = elmt.getElementsByTagName('ul')[1].getElementsByTagName('a');
		}
		catch {
			console.log('Uncorrect HTML for date');
			console.log(htmlText);
			return null;
		}
		var ListDates = [];
		for (let el_a of ulDates) {
			var txtDate = el_a.firstChild.data;
			var arDt = txtDate.split(' ');
			var dateMonth = +(monthNames.indexOf(arDt[0])) + 1;				
			txtDate = txtDate.replace(/st/g, '');
			txtDate = txtDate.replace(/nd/g, '');
			txtDate = txtDate.replace(/rd/g, '');
			txtDate = txtDate.replace(/th/g, '');
			arDt = txtDate.split(' ');

			var dateDay = arDt[1];
			var dateYear = arDt[2];
			var adDate = dateYear+'-'+dateMonth+'-'+dateDay;
			adDate = adDate.replace(/--/g, '-');
			ListDates.push(adDate);
		};
		return(ListDates)
	};
};
//-----------------------------------------------------------------------------------

//----------------Format date to yyyy-mm-dd (like '2019-7-12')-----------------------
app_client.functions.FormatDateToGetS = function (dateToFormat) {
	//2019-7-12
	var curr_date = dateToFormat.getDate();
	var curr_month = dateToFormat.getMonth() + 1;
	var curr_year = dateToFormat.getFullYear();
	var formated_date = curr_year+'-'+curr_month+'-'+curr_date;
	return(formated_date);	
};
//-----------------------------------------------------------------------------------



//----------------------Get list of dates from raw html text-------------------------
app_client.functions.getTFFromHTML = function(htmlText) {
	if (htmlText.indexOf('Query Error') != -1) {
		return null;
	}
	else {	
		var getT = [];
		var re = /var positions = \[\{[^]*?\}\]/;
		var res = htmlText.match(re);
		if (res) {
			res = res[0].substring(16);
			getT = JSON.parse(res)
		}
		return(getT)
	};
};

