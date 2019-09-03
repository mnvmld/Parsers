app_client.structure.getJSON = Backbone.Model.extend({
	initialize: function(){
        this.inUpdateF = false;
        this.arrLastF = [];
        this.arrOldF = [];
        this.get_current_F();
        this.loadedF = false;
    },

	get_current_F: function() {
        var th = this
        if (!th.inUpdateF) {
            th.inUpdateF = true
             $.ajax({
                type: "GET",
                url: "I/getListCurentMF",
                dataType: "json",
                data: "",
                success: function (data) {
                    if (data) {
                        var data = JSON.parse(data);
                        th.updateF(data);
                        th.loadedF = true;
                        if (app_client.GUI.views.mainSideBar.SlBr.isVisible()) {
                            app_client.GUI.views.mainSideBar.InfoCurF();
                        };
                        th.inUpdateF = false;     
                    }
                    else {
                        console.log('Ошибка загрузки списка!');
                        console.log(e);
                        th.inUpdateF = false;
                    }          
                },
                error: function(e) {
                    console.log('Ошибка загрузки списка!');
                    console.log(e.responseText);
                    th.inUpdateF = false;
                }
            });		
        }
        else {
console.log('busy')
        }
    },
    updateF: function (newData) {
console.log('Update F')
        var th = this;
        th.arrLastF = [];
         $.each(newData.acList, function (key, val) {
            if (val) {
                if (val.M == true) {
                    //new F
                    if (app_client.GUI.collections.a.arrReg.indexOf(val.I) == -1) {
                        app_client.GUI.collections.a.arrReg.push(val.I)
                        var regNew = {};
                        regNew.I = val.I;
                        regNew.Mdl = val.Mdl;
                        regNew.Lat = val.Lat;
                        regNew.Long = val.Long;
                        th.arrLastF.push(regNew);
                        val.IC = 'a.png'
                        var fl = new app_client.structure.models.aa(val);  
                        $.each(val, function(key2, val2){
                            fl[key2] = val2;
                        }),
                        fl.AddMarker();   
                        app_client.GUI.collections.a.add(fl);
                    }
                    //current F
                    else {
                        app_client.GUI.collections.a.forEach(function (model) {
                            if (model.I == val.I) {
                                //Update angle marker F using old and new values of coordinates
                                if (val.Lat && val.Long && model.Lat && model.Long) {
                                    if ((val.Lat != model.Lat) && (val.Long != model.Long)) {
                                        model.Angle = app_client.functions.getAngleIcon(val.Lat, val.Long, model.Lat, model.Long)

                                    };
                                };
                                //Update longitude and latitude if new values aren't null
                                if (val.Lat && val.Long) {
                                    model.Lat = val.Lat;
                                    model.Long = val.Long;
                                };
                                //Update all keys (without Lat and Long)
                                $.each(val, function(key2, val2){
                                    if ((key2 != 'Lat') && (key2 != 'Long')) {
                                        model[key2] = val2;
                                    };
                                }),
                                model.UpdatePosition();
                            }
                        });

                    }
                }
            }
        });
        app_client.GUI.collections.a.ShowMMarkers(app_client.GUI.views.mainSideBar.textSort)
    }

});
 
