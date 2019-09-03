app = app || {};

//*****************Функция конвертирования координат из шаблонов template 2-9 в шаблон template 1*************************
app.WorkFunction.ConvertCoordinates = function(txt) {
		//Поиск  символов N or S or E or W
		txt = txt.replace('C','с');
		txt = txt.replace('С','с');
		txt = txt.replace('c','с');
		txt = txt.replace('Ю','ю');
		txt = txt.replace('Ш','ш');
		txt = txt.replace('З','з');
		txt = txt.replace('В','в');
		txt = txt.replace('B','в');
		txt = txt.replace('Д','д');
		txt = txt.replace('с.ш.','N');txt = txt.replace('с.ш','N');txt = txt.replace('сш','N');
		txt = txt.replace('ю.ш.','S');txt = txt.replace('ю.ш','S');txt = txt.replace('юш','S');
		txt = txt.replace('в.д.','E');txt = txt.replace('в.д','E');txt = txt.replace('вд','E');
		txt = txt.replace('з.д.','W');txt = txt.replace('з.д','W');txt = txt.replace('зд','W');
		txt = txt.replace('Е','E');
	
		var regexp=/N/ig;
		var fnd_N = regexp.exec(txt);
		var regexp=/S/ig;
		var fnd_S = regexp.exec(txt);
		var regexp=/E/ig;
		var fnd_E = regexp.exec(txt);
		var regexp=/W/ig;
		var fnd_W = regexp.exec(txt);

		//Поиск знака - в начале
		var find_minus = '';
		if (txt[0] == '-') {
			find_minus = '-';
		};

		var addMinus = '';
		if ((fnd_S != null) || (fnd_W != null)) {addMinus = '-'}


		txt = txt.replace(',','.');
		txt = txt.replace('"','\'\'');
		txt = txt.replace(/ /g,'');

		//поиск всех нечисел с очисткой . , N S E W -
		var tmp_txt = txt.toUpperCase();
		txt = txt.replace(/Е/g,'E');		//rus Е -> eng E
		tmp_txt = tmp_txt.replace('N','');
		tmp_txt = tmp_txt.replace('S','');
		tmp_txt = tmp_txt.replace('E','');
		tmp_txt = tmp_txt.replace('W','');
		var fnd_ChWithDot = tmp_txt.match(/\D+/g);
		tmp_txt = tmp_txt.replace('.','');
		var fnd_Ch = tmp_txt.match(/\D+/g);
		tmp_txt = tmp_txt.replace('-','');
		var fnd_ChMinus =  tmp_txt.match(/\D+/g);
		tmp_txt = tmp_txt.replace('°','');
		tmp_txt = tmp_txt.replace(/'/g,'');
		var fnd_ChGrad = tmp_txt.match(/\D+/g);

		//Поиск шаблонов template 3 и template 11
		var find_3tmpl = txt.match(/\d{2,3}\-\d{2}/g);

		//Поиск шаблона template 4
		var find_4tmpl = txt.match(/\d\d\d\d\d?/g);

		//Поиск шаблона template 5
		var find_5tmpl = txt.match(/\d\d\d\d\d\d\d?\.?\d*/g);

		//Поиск шаблонов template 6 и template 8
		var find_6tmpl = txt.match(/\d?\d?\d\°\d?\d\.?\d*\'/g);

		//Поиск шаблонов template 7 и template 9
		var find_7tmpl = txt.match(/\d?\d?\d\°\d\d?\'\d\d?\.?\d*\'\'/g);



		//Поиск всех чисел
		var Nummers = txt.match(/\d{1,}/g);

		//Поиск всех real-чисел
		var NumFloat = txt.match(/\d+\.\d+/g);


		//Возвращаемый объект
		var res = {
			type: -1,
			value: ''
		};

		
		//template 1
		if ( (fnd_ChMinus == null) &&
			 ((NumFloat != null) || (Nummers != null)) ) {
			if (Nummers.length < 3) {
				res.type = 1;
				if (NumFloat != null) {
					res.value = find_minus + NumFloat[0];
				}
				else {
					if (Nummers.length == 1)
					res.value = find_minus + Nummers[0];
				}
			}

		};

		//template 2
		if ( ((fnd_N != null)||(fnd_S != null)||(fnd_E != null)||(fnd_W != null)) &&
			 ((NumFloat != null) || (Nummers != null)) &&
			 (fnd_ChWithDot == null) ) {
			if ((Nummers.length < 3) && (Nummers[0].length < 4)) {
				res.type = 2;
				if (NumFloat != null) {
					res.value = addMinus + NumFloat[0];
				}
				else {
					if (Nummers.length == 1)
					res.value = addMinus + Nummers[0];
				}
			}

		};

		//template 3 и 11
		if ((find_3tmpl != null) && 
			(fnd_ChMinus == null) && 
			(((Nummers.length == 2) && (NumFloat == null)) || ((Nummers.length == 3) && (NumFloat != null))) ) {
				//template 3
				res.type = 3;
				var Sec = Nummers[1];
				//template 11
				if (Nummers.length == 3) {
					res.type = 11;
					Sec = NumFloat[0];
				};
				res.value = addMinus + Math.floor(Nummers[0] * 100000 +  ((+Sec * 100) / 60)*1000) / 100000;
		};

		//template 4
		if ( (find_4tmpl != null) &&
			(fnd_ChWithDot == null) &&
			(Nummers.length == 1) &&
			(Nummers[0].length > 3) && 
			(Nummers[0].length < 6)) {
				res.type = 4;
				var Deg = '';
				var min = ''
				if (Nummers[0].length == 4) {
					Deg = '' + Nummers[0][0] + Nummers[0][1];
					Min = '' + Nummers[0][2] + Nummers[0][3];
				}
				else {
					Deg = '' + Nummers[0][0] + Nummers[0][1] + Nummers[0][2];
					Min = '' + Nummers[0][3] + Nummers[0][4];
				};
				res.value =  addMinus + (Math.floor(+Deg * 100000 + (+(Min) * 100 / 60)*1000)) / 100000;
		};

		//template 5 и 10
		if ( (find_5tmpl != null) &&
			(fnd_Ch == null) && 
			((Nummers.length == 1) ||
			(Nummers.length == 2) && (NumFloat != null)) &&
			(Nummers[0].length > 5) && (Nummers[0].length < 8) ) {
				//template 5
				res.type = 5;
				var Deg = '';
				var Min = '';
				var Sec = '';
				if (Nummers[0].length == 6) {
					Deg = '' + Nummers[0][0] + Nummers[0][1];
					Min = '' + Nummers[0][2] + Nummers[0][3];
					Sec = '' + Nummers[0][4] + Nummers[0][5];
				}
				else {
					Deg = '' + Nummers[0][0] + Nummers[0][1] + Nummers[0][2];
					Min = '' + Nummers[0][3] + Nummers[0][4];
					Sec = '' + Nummers[0][4] + Nummers[0][6];
				};
				//template 10
				if (Nummers.length == 2) {
					res.type = 10;
					Sec = '' + Sec + '.' + Nummers[1];
				};
				res.value = addMinus + (Math.floor(+Deg * 100000 + (+(Min) * 100 / 60 + +(Sec) * 100 / 3600)*1000)) / 100000;
		};

		//template 6 и 8
		if ( (find_6tmpl != null) &&
			(((Nummers.length == 2) && (NumFloat == null)) ||
			((Nummers.length == 3) && (NumFloat != null))) &&
			(fnd_ChGrad == null) ) {
			var Deg = '';
			var Min = '';
			if (Nummers.length == 3) {
				Min = NumFloat[0];
			}
			else {
				Min = Nummers[1];
			}
			//var AftDot = Math.floor((+(minN * 100) / 60)*1000);
			Deg = Nummers[0];
			res.type = 6;
			res.value =  addMinus + (Math.floor(+Deg * 100000 + (+(Min) * 100 / 60)*1000)) / 100000;
			//res.value = addMinus + Nummers[0] + '.' + AftDot;

		};

		//template 7 и 9
		if ( (find_7tmpl != null) &&
			(((Nummers.length == 3) && (NumFloat == null)) ||
			((Nummers.length == 4) && (NumFloat != null))) &&
			(fnd_ChGrad == null) ) {
			var Deg = '';
			var Min = '';
			var Sec = '';
			if (Nummers.length == 4) {
				Min = Nummers[1]
				Sec = NumFloat[0];
			}
			else {
				Min = Nummers[1];
				Sec = Nummers[2]						
			}
			Deg = Nummers[0];
			//var AftDot = Math.floor((minN * 100 / 60) * 1000  + secN * 100 / 3600 * 1000);
			res.type = 7;
			//res.value = addMinus + Nummers[0] + '.' + AftDot;
			res.value = addMinus + (Math.floor(+Deg * 100000 + (+(Min) * 100 / 60 + +(Sec) * 100 / 3600)*1000)) / 100000;

		};
		if ((+res.value > 180) || (+res.value < -180)) {
			res.type = -1;
			res.value = '';
		}
	return res.value;
};
//*******************************************************************************************************

//*********************************Поиск всех координат в тексте*****************************************
app.ParseTextCoordinates = function(txt) {
	//Подготовка текстка
//	txt = txt.replace(/ град. /, '°');txt = txt.replace(/град. /, '°');txt = txt.replace(/град. /, '°');txt = txt.replace(/град./, '°');
//	txt = txt.replace(/ мин. /, '\'');txt = txt.replace(/мин. /, '\'');txt = txt.replace(/ мин./, '\'');txt = txt.replace(/мин./, '\'');
//	txt = txt.replace(/ сек. /, '\'\'');txt = txt.replace(/сек. /, '\'\'');txt = txt.replace(/ сек./, '\'\'');txt = txt.replace(/сек./, '\'\'');
	txt = txt.replace(/’/g, '\'');
	txt = txt.replace(/‘/g, '\'');
	txt = txt.replace(/"/g, '\'\'');
	

//	txt = txt.replace('с.ш.','N');txt = txt.replace('с.ш','N');txt = txt.replace('сш','N');
//	txt = txt.replace('ю.ш.','S');txt = txt.replace('ю.ш','S');txt = txt.replace('юш','S');
//	txt = txt.replace('в.д.','E');txt = txt.replace('в.д','E');txt = txt.replace('вд','E');
//	txt = txt.replace('з.д.','W');txt = txt.replace('з.д','W');txt = txt.replace('зд','W');
//	txt = txt.replace('Е','E');


	var find_6_7_8_9_tmpl = txt.match(/\d?\d?\d\°\s*\d\d?\'\s*\d?\d?\.?\d*\'?\'?\s*[NnSsEeWwЕесювзСЮВЗ]\.?[шШдД]?\.?/g);
	if (find_6_7_8_9_tmpl != null) {
		find_6_7_8_9_tmpl.forEach(function(tx) {
			txt = txt.replace(tx, '!');
		});
	}

	var find_3_11_tmpl = txt.match(/\d?\d?\d\-\d\d\.?\d*[NnSsEeWwЕе]/g);
	if (find_3_11_tmpl != null) {
		find_3_11_tmpl.forEach(function(tx) {
			txt = txt.replace(tx, '!');
		});
	}

	var find_1_2_4_5_10_tmpl_end = txt.match(/\d+\.?\d*[NnSsEeWwЕе]/g);

	var find_1_2_4_5_10_tmpl_beg = txt.match(/[NnSsEeWwЕе]\d+\.?\d*/g);

	if (find_1_2_4_5_10_tmpl_end != null) {
		find_1_2_4_5_10_tmpl_end.forEach(function(tx) {
			txt = txt.replace(tx, '!');
		});
	}		

	if (find_1_2_4_5_10_tmpl_beg != null) {
		find_1_2_4_5_10_tmpl_beg.forEach(function(tx) {
			txt = txt.replace(tx, '!');
		});
	}


	var find_1_2_4_5_10_tmpl_min = txt.match(/\-\d+\.?\d*/g);

	//var find_1_2_4_5_10_tmpl = txt.match(/\-?N?n?S?s?E?e?W?w?\d+\.?\d*N?n?S?s?E?e?W?w?/g);

	//var find_1_2_4_5_10_tmpl_all = txt.match(/\-?N?n?S?s?E?e?W?w?\d+\.?\d*N?n?S?s?E?e?W?w?/g);

	var ListCoord = [];

	if (find_6_7_8_9_tmpl != null) {
		var frst = '';
		var scnd = '';
		find_6_7_8_9_tmpl.forEach(function(fnd) {
			var res = fnd.match(/[NnSsсюСЮ]\.?[шШ]\.?/g);
			if (res != null) {
				frst = fnd;
			};
			if (frst != '') {
				res = fnd.match(/[EeWwЕевзВЗ]\.?[дД]\.?/g);
				if (res != null) {
					scnd = fnd;
					ListCoord.push([frst, scnd]);
					frst = '';
					scnd = '';
				};
			};
		});
	};

	if (find_3_11_tmpl != null) {
		var frst = '';
		var scnd = '';
		find_3_11_tmpl.forEach(function(fnd) {
			var res = fnd.match(/[NnSs]/g);
			if (res != null) {
				frst = fnd;
				scnd = '';
			};
			if (frst != '') {
				res = fnd.match(/[EeWwЕе]/g);
				if (res != null) {
					scnd = fnd;
					ListCoord.push([frst, scnd]);
					frst = '';
					scnd = '';
				};
			};
		});
	}

	if (find_1_2_4_5_10_tmpl_end != null) {
		var frst = '';
		var scnd = '';
		find_1_2_4_5_10_tmpl_end.forEach(function(fnd) {
			var res = fnd.match(/[NnSs]/g);
			if (res != null) {
				frst = fnd;
				scnd = '';						
			};
			if (frst != '') {
				res = fnd.match(/[EeWwЕе]/g);
				if (res != null) {
					scnd = fnd;
					ListCoord.push([frst, scnd]);
					frst = '';
					scnd = '';
				};
			};
		});
	};

	if (find_1_2_4_5_10_tmpl_beg != null) {
		var frst = '';
		var scnd = '';
		find_1_2_4_5_10_tmpl_beg.forEach(function(fnd) {
			var res = fnd.match(/[NnSs]/g);
			if (res != null) {
				frst = fnd;
				scnd = '';
			};
			if (frst != '') {
				res = fnd.match(/[EeWwЕе]/g);
				if (res != null) {
					scnd = fnd;
					ListCoord.push([frst, scnd]);
					frst = '';
					scnd = '';
				};
			};
		});
	};
	return ListCoord;
};
//*******************************************************************************************************






//Рисование используя координаты, радиус и стиль
app.WorkFunction.DrawE = function(th_lat, th_lng, sizeInKm, styleLine, patternLine) {
	// th_lat широта
	// th_lng долгота
	// sizeInMeters радиус в км


	var sizeInMeters = sizeInKm * 1000;

	var Track = [];

	var firstP = [];

	var res1 = null;
	var res2 = null;
	var patr1 = null;
	var patr2 = null;

	var bool_left = false;
	var bool_right = false;

	var bottom2 =null;
	var top2 = null;
	var point = L.latLng([th_lat, th_lng])
	for (var i = -85; i <= 85; i++) {
		var pnt = point.distanceTo(L.latLng([+i, th_lng]));
		if ((+pnt <= +sizeInMeters) && (bottom2 == null)) {
			bottom2 = +i;
		};
		if ((+pnt <= +sizeInMeters) && (bottom2 != null)) {
			top2 = +i;
		}
	};
	if (bottom2 > -85) {
		for (var i = (+bottom2 - 1); i <= bottom2; i = i + 0.01) {
			var pnt = point.distanceTo(L.latLng([+i, th_lng]));
			if (+pnt <= +sizeInMeters) {
				bottom2 = +i;
			};
		};
	};
	if (top2 < 85) {
		for (var i = (+top2 + 1); i >= +top2; i = i - 0.01) {
			var pnt = point.distanceTo(L.latLng([+i, th_lng]));
			if (+pnt <= +sizeInMeters) {
				top2 = +i;
			}
		};
	};
	var step = (+top2 - +bottom2) / 500;
	var step2 = +step;

	var bool_end = false;
	for (var i = bottom2; i < top2; i = i + +step) {
		var right2 = 0;
		var pnt = 0;
		var new_lng = 0;
		if (bool_end == false) {
			while  ((+pnt < +sizeInMeters)&&(new_lng < 360)) {
				new_lng = +th_lng + +right2;
				pnt = point.distanceTo(L.latLng([i, new_lng]));
				right2 = +right2 + +step2;
			};
			if (new_lng >= 360) {
				bool_end = true;
			};
		};
		if (bool_end == false) {
			if (+i == +bottom2) {
				firstP = [i, new_lng];
			}
			if (+new_lng >= 180) {bool_right = true};
			if (+new_lng <= -180) {bool_left = true};
			Track.push([i, new_lng]);
		};
	};


	if (bool_end == true) {
		Track = [];
		var bool_nord = true;
		//Добавление доп точек для рисовния  области если не заданы доп элементы линии
		if (patternLine == undefined) {
			if (th_lat > 0) {
				Track.push([85,-180]);
			}
			else {
				Track.push([-85,-180]);
				bool_nord = false;
			};
		};
		for (var i = -180; i < 180; i = i + 1) {

			var pos2 = bottom2;
			var pnt = sizeInMeters + 1;
			var new_lat = bottom2;
			if (bool_nord == true) {
				while  ((+pnt > +sizeInMeters)&&(new_lat <= top2)) {
					new_lat = pos2;
					pnt = point.distanceTo(L.latLng([new_lat, i]));
					pos2 = +pos2 + +step2;
				};
			}
			else {
				pos2 = top2;
				new_lat = top2;
				while  ((+pnt > +sizeInMeters)&&(new_lat >= bottom2)) {
					new_lat = pos2;
					pnt = point.distanceTo(L.latLng([new_lat, i]));
					pos2 = +pos2 - +step2;
				};
			};
			Track.push([new_lat, i]);
		}
		//Добавление доп точек для рисовния  области если не заданы доп элементы линии
		if (patternLine == undefined) {
			if (th_lat > 0) {
				Track.push([85,180]);
			}
			else {
				Track.push([-85,180]);
			};
		};
		res1 = L.polyline(Track,styleLine).addTo(MAP_MK);
	}
	else {
		for (var i = top2; i > bottom2; i = i - +step) {
			var left2 = 0;
			var pnt = 0;
			var new_lng = 0;
			while  ((+pnt < +sizeInMeters)&&(new_lng > -180)) {
				new_lng = +th_lng + +left2;
				pnt = point.distanceTo(L.latLng([i, new_lng]));
				left2 = +left2 - +step2;		
			};
			if (+new_lng >= 180) {bool_right = true};
			if (+new_lng <= -180) {bool_left = true};

			Track.push([i, new_lng]);
		};

		Track.push(firstP);

		res1 = L.polyline(Track,styleLine).addTo(MAP_MK);

		var Track2 = Track;
		if (bool_left == true) {
			Track2.forEach(function(el) {
				el[1] = el[1] + 360;
			});
			res2 = L.polyline(Track,styleLine).addTo(MAP_MK);
		};
		if (bool_right == true) {
			Track2.forEach(function(el) {
				el[1] = el[1] - 360;
			});
			res2 = L.polyline(Track2,styleLine).addTo(MAP_MK);
		};

	}

	if (patternLine != undefined) {
		//if (bool_end == true) {
			//Удаление крайних точек если не окружность
			//Track.shift();
			//Track.pop();
		//};
	    patr1 = L.polylineDecorator(
	        Track,
	        {
	            patterns: patternLine
	        }
	    ).addTo(MAP_MK);
		if (res2 != null) {
		    patr2 = L.polylineDecorator(
		        res2,
		        {
		            patterns: patternLine
		        }
		    ).addTo(MAP_MK);
		};
	};




	var res = [res1, res2, patr1, patr2];
	return res;

};

//определение окончания слов в зависимости от числа txtd Пример: (10, 'дней', 'день', 'дня')
app.WorkFunction.GetCurrectWord = function(txtd, txt1, txt2, txt3) {
	var res = txt1;
	if ((txtd == 1) ||
		((txtd % 10 == 1) && (txtd != 11)) ) {
		res = txt2;
	};
	if ( ((txtd >= 2) && (txtd <= 4)) ||
		((txtd % 10 >= 2) && (txtd % 10 <= 4) &&
		 (txtd != 12) && (txtd != 13) && (txtd != 14)) ) {
		res = txt3;
	};
	return res;
};

//Получение текста В по id
app.WorkFunction.getTextV = function(id_V, funct, mX, mY) {
	var res = '';
	$.ajax({
		type: 'POST',
		url: 'V/GetTextV',
		data: {	
			id_V: id_V
		}
	}).success(function (data2, status) {
		res =  data2;
		if (funct != null) {
			funct(id_V, res, mX, mY);
		};
		return res;
	}).error(function(err){
		res = 'Ошибка получения текста В';
		if (funct != null) {
			funct(id_V, res, mX, mY);
		};
		return res;
	});

};
