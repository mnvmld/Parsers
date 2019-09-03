//***************************************************************************************
//**********************Module with functions for work with database*********************
//***************************************************************************************

const pgp = require('pg-promise')();

//Settings of connection to database
const connection = ({
    user: 'tuser',
    host: 'localhost',
    database: 'db',
    password: 'pass'
});
//Connection
const dbS = pgp(connection);

//***************Functions: connect/disconect and get object of connection***************
exports.get = function() {
    return dbS;
};
  
exports.connect = function() {
    dbS.connect()
    .then(function (obj) {
        console.log('Successful connected to database');
        obj.done();
    })
    .catch(function (error) {
        console.log('Could not connect to database:');
        console.log('    '+err.message);
    });
};

exports.close = function() {
    if (dbS) {
        dbS.end();
        console.log('Connect to database successful closed ');
    };
};
//***************************************************************************************



//******************************Work with database***************************************
//---------Find and return ID of I from  using stored procedure SP_FIND_I----------------
exports.findI = async function(IF) {
    if (!IF) {
        console.log('Error in finding I. I is empty');
        return null;
    };
    console.log('Try to find I = ' + IF)
    var ret = null;
    await dbS.proc('SP_FIND_I', [IF])
    .then(async function (data) {
        if (data) {
            console.log('Successfully find I = '+IF+'. It ID is: '+data['sp_find_I']);
            ret =  data['sp_find_I'];
        }
        else {
            console.log('I = '+IF+' is not exist.');
            ret =  null;
        }
    })
    .catch(async function (err) {
        console.log('Error with SP_FIND_I:');
        console.log('    '+err.message);
        ret =  null;
    });
    return ret;
};
//---------------------------------------------------------------------------------------

//--------------Add new I to SLV_I using stored procedure SP_ADD_I-----------------------
//-----------------boolEx = true if before adding was execute findI----------------------
exports.AddI = async function(IF, boolEx = false) {
    if (!IF) {
        console.log('Error in adding I. I is empty');
        return null;
    };
    var ret = null;
    var boolA = false;
    if (boolEx) {
        boolA = false;
    }
    else {
        if (await exports.findI(IF)) {
            boolA = true
        }
    };
    if (!boolA) {
        await dbS.proc('SP_ADD_I', [IF])
        .then(async function (data) {
            if (data) {
                ret =  data['sp_add_I'];
                console.log('Successfully add new I = '+IF+'. Its ID = '+ret);
            }
            else {
                console.log('Some error with add new I ='+IF);
                ret =  null;
            }
        })
        .catch(async function (err) {
            console.log('Error with SP_ADD_I:');
            console.log('    '+err.message);
            ret =  null;
        });
    }
    else {
        console.log('Error adding new I = ' + IF+ '. It already exist!')
    };
    return ret;
};
//---------------------------------------------------------------------------------------

//--------------------Find and return ID of F from TABLE_JSON_FROM_A---------------------
//--------------------------using stored procedure SP_FIND_F_A---------------------------
exports.findFA = async function(IF, idI, dateF) {
    if (!IF || !idI || !dateF) {
        console.log('Error in finding F. I or(and) date is(are) empty');
        return null;
    };
    console.log('Try to find F ' + IF+' for date = '+dateF);
    var ret = null;
    await dbS.proc('SP_FIND_F_A', [idI, dateF])
    .then(async function (data) {
        if (data) {
            ret =  data['sp_find_F_A'];
            console.log('Successfully find F: '+IF+' for date = '+dateF+'. It ID = '+ret);
        }
        else {
            console.log('F '+IF+' for date = '+dateF+' is not exist.');
            ret =  null;
        }
    })
    .catch(async function (err) {
        console.log('Error with SP_FIND_F_A:');
        console.log('    '+err.message);
        ret =  null;
    });
    return ret;
};
//---------------------------------------------------------------------------------------

//-----------Add new F to TABLE_JSON_FROM_A using stored procedure SP_ADD_F_A------------
//---------------boolEx = true if before adding was execute findFA-----------------------
exports.AddFA = async function(IF, idI, dateF, trackF, boolEx = false) {
    if (!IF || !idI || !dateF || !trackF) {
        console.log('Error in finding F. I or(and) date or(and) track is(are) empty');
        return null;

    };    
    var ret = null;
    var boolA = false;
    if (boolEx) {
        boolA = false;
    }
    else {
        idI = await exports.findFA(IF, idI, dateF);
        if (idI) {
            boolA = true;
        };
    };
    if (!boolA) {
        await dbS.proc('SP_ADD_F_A', [idI, dateF, trackF])
        .then(async function (data) {
            if (data) {
                ret =  data['sp_add_F_A'];
                console.log('Successfully add new F '+IF+' for date = '+dateF+'. Its ID = '+ret);
            }
            else {
                console.log('Some error with add new F '+IF+' for date = '+dateF);
                ret =  null;
            }
        })
        .catch(async function (err) {
            console.log('Error with SP_ADD_F_A:');
            console.log('    '+err.message);
            ret =  null;
        });
    }
    else {
        console.log('Error adding new F '+IF+' for date = '+dateF+'. It already exist!')
    };
    return ret;
};
//---------------------------------------------------------------------------------------

//-----------------------Save JSON from T to database------------------------- 
exports.saveFJSON = async function(IF, dateF, trackF) {
    var ret = false;
    console.log('---------get new data----------')
    //Check I in SLV_I
    var idI = await exports.findI(IF);
    //If I is not exist then add it in SLV_I
    if (!idI) {
        idI = await exports.AddI(IF, true);
    };
    if (idI) {
        if (! await exports.findFA(IF, idI, dateF)) {
            if (await exports.AddFA(IF, idI, dateF, trackF, true)) {
                ret = true;
            };
        }
    }
    console.log('----------------')
    return ret;
};
//---------------------------------------------------------------------------------------





//***************************************************************************************

