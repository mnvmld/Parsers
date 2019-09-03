var spiderA = {};
spiderA.listFs = [];
spiderA.numElm = 0;              // Count of elements <p> on the site


//-----------------------------------------------------------------------------------
//-----------------------Add new element with text on site---------------------------
spiderA.addNewElem = function(txtElem) {
    spiderA.numElm += 1;
    let start_p = document.getElementById('start_p');
    let htmlTxt = '<p id="p_'+spiderA.numElm+'">'+txtElem+'</p>'
    start_p.insertAdjacentHTML('beforeend', htmlTxt);
    $('#start_p').animate({scrollTop: $('#start_p').prop("scrollHeight")}, 500);
};
//-----------------------------------------------------------------------------------

//--------------------------Update text in element on site---------------------------
spiderA.updateTextElem  = function(txtElem, numEl) { 
    let pElm = document.getElementById('p_'+numEl);
    pElm.innerHTML = txtElem;
};
//-----------------------------------------------------------------------------------

//------------------Update text in end(current) element on site----------------------
spiderA.updateTextEndElem  = function(txtElem) { 
    spiderA.updateTextElem(txtElem, spiderA.numElm);
};
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------
//------------------------Get t (json) i for date-----------------------------
spiderA.SavetToDB = async function(iF, dateF, tF) {
    console.log('****--> in SavetToDB');  
    await $.ajax({
        type: "POST",
        url: "db/saveF",//?i="+iF+"&date="+dateF+"&t="+tF,
        dataType: "text",
        data: { 
            "i": iF, 
            "date": dateF, 
            "t": tF
        },
        success: function (data) {
            console.log('Y успешно сохранен в БД, Q = '+iF+' за '+dateF+'!');
        },
        error: function(err) {
            console.log('Ошибка сохранения Yа в БД Q = '+iF+' за '+dateF+'!');
            console.log('     '+err.responseText);
            console.log(err);
            console.log('****<-- out of SavetToDB'); 
        }
    });
    return true;
};
//-----------------------------------------------------------------------------------

//------------------------Get t (json) i for date-----------------------------
spiderA.GettiForDate = async function(iF, dateF) {
    console.log('***--> in GettiForDate');  
    return await $.ajax({
        type: "GET",
        url: "i/getFInDate?i="+iF+"&date="+dateF,
        dataType: "text",
        data: "",
        success: function (reqDt) {
            console.log('***<-- out of GettiForDate');  
        },
        error: function(err) {
            if (err.responseText) {
                console.log('Ошибка загрузки ff Q = '+iF+' за '+dateF+'!'); 
                console.log('     '+err.responseText);
                console.log('***<-- out of GettiForDate');  
            };
        }
    });
 
};
//-----------------------------------------------------------------------------------

//--------------------------Get list date of Fs i----------------------------
spiderA.getListDatei = async function(F) {
    console.log('**--> in getListDatei'); 
    return await $.ajax({
        type: "GET",
        url: "i/getListF?i="+F.i,
        dataType: "text",
        data: "",
        success: function (reqDates) {
            console.log('**<-- out of getListDatei');  
        },
        error: function(err) {
            if (err.responseText) {
                console.log('Ошибка загрузки списка ff Q = '+F.i+'!'); 
                console.log('     '+err.responseText);
                console.log('**<-- out of getListDatei'); 
            };
        }
    });
};
//-----------------------------------------------------------------------------------

//-----------------------------Get list of W i----------------------------------
spiderA.GetListWi = async function() {
    console.log('*--> in GetListWi');
    return await $.ajax({
        type: "GET",
        url: "i/getListCurentWFs?first=true",
        dataType: "json",
        data: "",
        success: function (reqData) {
            console.log('*<-- out of GetListWi');   
        },
        error: function(err) {
                console.log('Ошибка получения списка ff!') 
                console.log('     '+err.responseText);
                console.log('*<-- out of GetListWi');   
        }
    });

};
//-----------------------------------------------------------------------------------

//-----------------------------Get list of W i----------------------------------
spiderA.GetListWiFromList = async function(fileN) {
    console.log('*--> in GetListWiFromList');

    return await $.ajax({
        type: "GET",
        url: "i/getListiFromFile",
        dataType: "json",
        data: "",
        success: function (reqData) {
            console.log('*<-- out of GetListWiFromList');   
        },
        error: function(err) {
                console.log('Ошибка получения списка i!') 
                console.log('     '+err.responseText);
                console.log('*<-- out of GetListWiFromList');   
        }
    });
};
//-----------------------------------------------------------------------------------

//----------------------------------check i---------------------------------------
spiderA.checki = async function(iF) {
    console.log('+--> in checki');
    return await $.ajax({
        type: "GET",
        url: "db/findi?i="+iF,
        dataType: "text",
        data: "",
        success: function (reqData) {
            console.log('+<-- out of checki');   
        },
        error: function(err) {
                console.log('Ошибка проверки наличия Q в БД!') 
                console.log('     '+err.responseText);
                console.log('+<-- out of checki');   
        }
    });

};
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------
//-------------------------------async runners---------------------------------------
spiderA.run3 = async function (reqDt, iF, dateF) {
    console.log('in async3')
    if (reqDt) {
        gett = app_client.functions.gettFsFromHTML(reqDt);
        if (gett) {
            if (gett.length > 0) {
                if (iF && dateF) {
                    await spiderA.SavetToDB(iF, dateF, JSON.stringify(gett));
                };
            };
        };
    };
    return true;
};

spiderA.run2 = async function (newFl) {
    console.log('in async2')
    if (newFl.listDates)  {
        if (newFl.listDates.length > 0)  {
            let lngLst = newFl.listDates.length;
            let cntLst = 0;            
            spiderA.addNewElem('--> Обработка даты = '+'. ('+cntLst+'/'+lngLst+')');            
            for (date of newFl.listDates) {
                cntLst += 1;
                spiderA.updateTextEndElem('--> Обработка даты = '+date+'. ('+cntLst+'/'+lngLst+')')                
                let reqDates = await spiderA.GettiForDate(newFl.i, date);
                if (reqDates) {
                   await spiderA.run3(reqDates, newFl.i, date);
                };
            };
            return true;
        } 
        else {
            spiderA.addNewElem('--> данные отсутствуют');
        }
    };
    return true;
};

spiderA.run1 = async function (gJSON) {
    console.log('in async1')
    let cntL = gJSON.acList.filter(x => x.W == true).length;
    let numF = 0;
    for (const dtF of gJSON.acList) {
        if (dtF) {
            if (dtF.W == true) {
                numF += 1;
                let chi = await spiderA.checki(dtF.i);
                if (chi == 'i is not exist') {
                    spiderA.addNewElem('Обработка Q = '+dtF.i+'. ('+numF+'/'+cntL+')');
                    let newF = {};
                    newF.i = dtF.i;
                    newF.json = dtF;       
                    newF.listDates = [];
                    let  lstDates = await spiderA.getListDatei(newF)
                    if (lstDates) {
                        newF.listDates = app_client.functions.getListDateOfFs(lstDates);
                    } 
                    await spiderA.run2(newF); 
                    spiderA.listFs.push(newF);
                }
                else {
                    console.log('i is exist in database already');
                };
            };
        };
    };
    return true;
};

spiderA.run = async function(fromList = false) {
    spiderA.addNewElem('Загрузка информации...');
    console.log('***------Spider run----------***')
    let gtJ = null;
    if (!fromList) {
        gtJ = await spiderA.GetListWi();
    }
    else {
        gtJ = await spiderA.GetListWiFromList();
    };
    let getJSON = JSON.parse(gtJ);
    if (getJSON) {
        spiderA.addNewElem('Получен список Q. Количество записей = '+getJSON.acList.filter(x => x.W == true).length)
        await spiderA.run1(getJSON);
    }
    console.log('***------Spider stop----------***')
};
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------



spiderA.run(true);
