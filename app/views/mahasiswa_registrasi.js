define([
	"apps",
	"views/modules/mhs_search",
    "views/modules/dataProcessing"
], function(apps,search, handleProcessing){

function ruleRegTA(obj, common, value){
    if (obj.SMTMHS < 8)
        return "-";
    else{
        if (value == "1")
            return '<input class="webix_table_checkbox" type="checkbox" checked="true">';
        else
            return '<input class="webix_table_checkbox" type="checkbox">';
    }
}

function ruleRegKP(obj, common, value){
    if (obj.SMTMHS < 5)
        return "-";
    else{
        if (value == "1")
            return '<input class="webix_table_checkbox" type="checkbox" checked="true">';
        else
            return '<input class="webix_table_checkbox" type="checkbox">';
    }
}

function ruleRegKKL(obj, common, value){
    if (obj.SMTMHS < 6)
        return "-";
    else{
        if (value == "1")
            return '<input class="webix_table_checkbox" type="checkbox" checked="true">';
        else
            return '<input class="webix_table_checkbox" type="checkbox">';
    }
}

var grd_reg_mhs = {
	view:"datatable",
	id:"grd_reg_mhs",
	columns:[
    { id:"id_smt"},
    { id:"SMTMHS"},
    { id:"NIMHS"},
    { id:"REGSMS",  checkValue:'1', uncheckValue:'0', template:"{common.checkbox()}"},
    { id:"REGTA",   checkValue:'1', uncheckValue:'0', template: ruleRegTA },
    { id:"REGKP",   checkValue:'1', uncheckValue:'0', template: ruleRegKP },
    { id:"REGKKL",  checkValue:'1', uncheckValue:'0', template: ruleRegKKL },
    { id:"REGHER",  checkValue:'1', uncheckValue:'0', template:"{common.checkbox()}"},
    { id:"MAXKRS", editor:"text"},
    { id:"MAXKRSHER", editor:"text"},
    ],
	select:"row", editable:true, editaction:"dblclick",
	dataFeed : "./registrasi/data",
};

var btn_add ={
    paddingX:5,
    paddingY:5,
    height:40,
    cols:[
        {},
        { view: "button", type: "iconButton", icon: "plus", css:"button_success", label: "daftarkan", width: 150, click:function(obj){
            var id = $$("listmsmhs").getSelectedId();
            if (id) {
                var data = {
                    nipd: "",
					nm_jns_daftar: "",
					mulai_smt: "",
					tgl_masuk_sp: "",
					nm_jurusan: "",
                }
                webix.$$("grd_reg_mhs").add(data);
            }else{
                webix.message({ type:"error", text:"Please select one", expire:3000});
            }
        }}
    ]
};

var ui_scheme = {
	type: "line",
	id:"uimsmhs",
    rows:[
    {
    	margin:10,
    	type: "material",
    	cols:[
    		search,
    		{
                gravity: 2.2,
                rows:[
		    		grd_reg_mhs,
                ]
            }
    	]
    }
    ],
};

return {
    ui: function() {
    	apps.setUiScheme = ui_scheme;
    	apps.webix();
    },
    onInit: function(){
        $$("grd_reg_mhs").bind( $$("listmsmhs"), "c.id_reg_pd");

        var dp = new webix.DataProcessor({
            updateFromResponse:true,
            autoupdate:true,
            master: $$("grd_reg_mhs"),
            url: "connector->./registrasi/data",
            on: handleProcessing
        });
	}
};
});
