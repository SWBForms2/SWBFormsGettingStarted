/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//Header
//Scripts de para importar la libreria
/*
        <script src="/platform/js/eng.js" type="text/javascript"></script>
        <script type="text/javascript">
            eng.initPlatform("/test/datasources.js");
            eng.initPlatform(["/test/datasources.js"],false); //multiple js, sin cache
        </script> 
*/


//Tipos de propiedades o Fields
type: string, int, date, float, double, long, text            //primitivos
stype: grid, gridSelect, select, time, file             //extendidos

//Tipos de links, objetos vinculados a formas
stype: subForm, tab

//data stores
eng.dataStores["mongodb"]={
    host:"localhost",
    port:27017,
    class: "org.semanticwb.forms.datastore.DataStoreMongo",
};

//Agregate
eng.getDataSource("Estado").aggregate({data:[{$group:{_id:"$nombre"}}]})


//Definir un datasource
eng.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    dataStore: "mongodb",      
    displayField: "titulo",
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string"},
        {name: "cp", title: "CP", required: true, type: "int"},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", dataSource:"Personal"},
        {name: "direccion", title:"Dirección", removeDependence_:true, stype:"grid", dataSource:"Direccion", winEdit:false}
    ],
    links: [
        {name: "direccion", title:"Dirección", stype:"subForm", dataSource:"Direccion"}
    ],               
    security:{
        roles:{
            admin:["fetch","add","remove","update"],  //OR
            member:["fetch"],
        },        //and
        groups:{
            GDNPS:["fetch","add","remove","update"],
            DAC:["fetch"],
        },        
        users:[{sex:"male"}]    //OR
    }
};

//Crear un grid
eng.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Personal");

eng.createGrid(
{
    left:"-10", margin:"10px", width: "100%", height: 200,

    fields:[{name:"nombre"}],

    recordDoubleClick: function(grid, record)
    {
        window.location = "detail.jsp?dsName=ReportesVIN&_id=" + record._id;
        return false;
    },
    addButtonClick: function(event)
    {
        window.location = "detail.jsp?dsName=ReportesVIN";
        return false;
    },
    //initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},

    autoFetchTextMatchStyle:"exact",                    
}, "ReportesVIN");

//Crear una Forma
eng.createForm({title:"Forma", width: "99%", height:"70%"}, id, dataSource);                

eng.createForm({title:"Forma", width: "99%", height:"70%", fields:[{name:"nombre"}]}, id, dataSource);                

eng.createForm({title:"Forma", width: "99%", height: "70%",
    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ]}
    ]
},id, dataSource);


eng.createForm({title: "Forma", width: "99%", height: "70%",
    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp", validators:[{type:"integerRange", min:5, max:15}]},
                //{name: "estado"},
            ]}
    ],
    links: [
        {name: "direccion2", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ]}
    ]
},id, dataSource);


eng.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit:false,   //deshabilitar winEdit del padre
            fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ]
        }
    ]
                    
},id, dataSource);

eng.createForm({title: "Forma", width: "99%", height: "50%",

    fields: [
        {name: "titulo"},
        {name: "area"},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit: {title:"Hola", //propiedades de la ventana
            fields: [
                {name: "calle"},
                {name: "numero"},
                //{name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                {name: "estado"},
            ]}, 
            fields: [                       //propiedades del grid
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ]
        }
    ]                    
},id, dataSource);



eng.validators["email"] = {type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"};
eng.validators["zipcode"] = {type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"El codigo postal debe tener el formato ##### o #####-####."};

/*
validators:[{type:"integerRange", min:1, max:20}]
validators:[{type:"regexp", expression:"^([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4}$",errorMessage:"No es un correo electrónico válido"}]
validators:[{type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"Zip Codes should be in the format ##### or #####-####."}]
validators:[{type:"mask", mask:"^\\s*(1?)\\s*\\(?\\s*(\\d{3})\\s*\\)?\\s*-?\\s*(\\d{3})\\s*-?\\s*(\\d{4})\\s*$",transformTo:"$1($2) $3 - $4"}]
validators:[{type:"matchesField", otherField:"password", errorMessage:"Passwords do not match"}]
validators:[{type:"custom", condition:"return value == true", errorMessage:"You must accept the terms of use to continue"}]
validators:[{type:"regexp", expression:"^\\d{5}(-\\d{4})?$", errorMessage:"Zip Codes should be in the format ##### or #####-####."}]
*/

//Propuedades de diseño de elementos de forma 
query=
{
    endRow:true, 
    startRow:true
};


//*************************************** server ************************//

//dataService
eng.dataServices["PaisService"] = {
    dataSources: ["Pais"],
    actions:["add","remove","update"],
    service: function(request, response, dataSource, action)
    {
        //print("request:"+request);
        //print("response:"+response);
        print("user:"+this.user);
        print("name:"+this.getDataSource("Pais").fetchObjById("_suri:VINDB:Pais:53ca73153004aec988f550e2").nombre);
        //print(this.getDataSource("Pais").fetch("{data:{abre : 'MX'}}"));
        //print(this.getDataSource("Pais").fetch());
        //print(this.getDataSource("Pais").fetch().response.data[0].nombre);
    }
};

//dataProcessor
eng.dataProcessors["PaisProcessor"] = {
    dataSources: ["Pais"],
    actions:["add","update"],
    request: function(request, dataSource, action)
    {
        print("action:"+action);
        print("request1:"+request);
        //print("user:"+this.getUser());
        //request.data.created=new java.util.Date();
        if(request.data.nombre)
        {
            request.data.habitantes=request.data.nombre.length()*1000+request.data.habitantes;
        }else if(request.oldValues.nombre)
        {
            request.data.habitantes=request.oldValues.nombre.length()*1000+request.data.habitantes;
        }
            
        print("request2:"+request);
        return request;
    },
    response: function(response, dataSource, action)
    {
        print("response:"+response);
        //print("user:"+this.getUser());
        print(response.response.data.created);
        return response;
    }
};


//serverCustom validators
eng.dataSources["ReportesVIN"] = {
    scls: "ReportesVIN",
    modelid: "VINDB",
    displayField: "titulo",
    dataStore: "mongodb",      
    fields: [
        {name: "titulo", title: "Título", required: true, type: "string", validators: [{type:"isUnique"}]},  //validacion de unicidad del lado del servidor
        {name: "area", title: "Area", required: true, type: "string",validators: [
            {
                type:"serverCustom",                                    //serverCustom del lado del servidor
                serverCondition:function(name,value,request){                    
                    return value=="jei";
                },
                errorMessage:"Error desde el servidor, el valor debe de ser jei"
            }
        ]},
        {name: "fecha", title: "Fecha", type: "date"},
        {name: "autor", title: "Autor", stype: "select", width_:300, selectWidth:300, displayFormat: "value+' ('+record.lugarNacimiento+')'",
            displayFormat_:function(value, record){
                return record.nombre+" ("+record.lugarNacimiento+")";
            }, 
            canFilter:false, selectFields:[{name:"nombre"},{name:"lugarNacimiento"}], showFilter:true, dataSource:"Personal"},
        {name: "revisor", title: "Revisor", stype: "select", dataSource:"Personal"},
        {name: "direccion", title:"Dirección", stype:"grid", dataSource:"Direccion", width_:"90%", winEdit:{title:"Dirección"}},
    ],
    links: [
        {name: "direccion1", title:"Dirección 1", stype:"tab", dataSource:"Direccion"},
        {name: "direccion2", title:"Dirección 2", stype:"subForm", dataSource:"Direccion"},
    ]
}; 

//*****************************************************************//
//dependentSelect 

//dependentSelect:"estado"
// o
//dependentSelect: {filterProp:"pais", dependentField:"estado"}

eng.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "VINDB",
    dataStore: "mongodb",      
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "numero", title: "Numero", type: "string"},
        {name: "colonia", title: "Colonia", type: "string"},
        {name: "municipio", title: "Municipio", type: "string"},
        {name: "cp", title: "CP", type: "int", validators_:[{stype:"zipcode"}]},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais", dependentSelect:"estado", dependentSelect_: {filterProp:"pais", dependentField:"estado"}},
        {name: "estado", title: "Estado", required: true, stype: "select", dataSource:"Estado", canFilter:false, initialCriteria_ : {} },
    ]
};


//GridView
field=
{name: "view", title:"Vista", stype:"gridView", fields: [
        {name: "name", title:"Nombre", type:"string"},
        {name: "number", title:"Número", type:"int"},
    ], data:[{name:"Javier",number:34},{name:"Carlos",number:24}]
}


//*****************************************************************//
//default values

eng.createForm({title: "Forma", width: "99%", height: "50%", onLoad:function(form){alert(form)},

    fields: [
        {name: "titulo"},
        {name: "area", canEdit:true},
        {name: "fecha"},
        {name: "autor"},
        {name: "revisor"},
        {name: "direccion", winEdit_: {title:"Hola",onLoad:function(form){alert(form)},        //Propiedades de la ventana
            fields: [
                {name: "calle"},
                {name: "numero"},
                //{name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode", errorMessage:"hola error..."}]},
                {name: "pais"},
                {name: "estado"}
            ],
            values:{calle:"calle3"},                        //valores de la ventana
        }, winEdit:false,   //deshabilitar winEdit del padre
            fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp",validators:[{stype:"zipcode"}]},
                //{name: "estado"},
            ],
            values:[{calle:"calle1"},{calle:"calle2"}],     //valores de la propiedad, grid
        }
    ],

    values:{                                                //valores de la forma
        titulo:"Titulo por defecto",                        
    },

    links: [
        {name: "direccion1"},
        {name: "direccion2", fields: [
                {name: "calle"},
                {name: "numero"},
                {name: "colonia"},
                {name: "municipio"},
                {name: "cp"},
                //{name: "estado"},
            ],
            values:{                                        //valores de objeto ligados
                calle:"Benito Juarez",
            }
        }
    ],


},null, "DataSourceName");


//*****************************************************************//
//initialCriteria
eng.createGrid({left:"-10", margin:"10px", width: "100%", height: 200, initialCriteria:{abre:"MX"},}, "Pais");



//Botones

form.submitButton.setTitle("Enviar");


    form.submitButton.setTitle("Siguiente");
    form.submitButton.click = function(p1)
    {
        eng.submit(p1.target.form, this, function()
        {
            window.location = "?p=<%=(p+1)%>&id=" + form.getData()._id;    
        });
        //window.location = "/es/imicam/resultados?&id=<%=id%>";
        //return false;
    };
    
    form.buttons.addMember(isc.IButton.create(
            {
                title: "Resultados",
                padding: "10px",
                click: function(p1) {
                    window.location = "/es/imicam/resultados?id=<%=id%>";
                    return false;
                }
            }));


//Secciones en formas
[
{defaultValue:"1. MERCADOTECNIA", disabled:false, type:"section", sectionExpanded:true, itemIds: ["1","1_1", "1_2", "1_3", "1_4", "1_5","1_6"] },
{name: "1", defaultValue:"1.1 Modernizacion del punto de venta: (1:Mal / Nunca,  2:Regular / Algunas Veces,  3:Bien / Casi Siempre,  4:Muy Bien / Siempre)", type:"Header"},
]



//******************************
//STYPES
//
//Select
[
    //{name: "autor", title: "Autor", stype: "select", dataSource:{dsName:"Personal",dsId:"ds_Personal_1"},
        
    {name: "autor", title: "Autor", stype: "select", dataSource:"Personal",
        multiple:true, 
        canFilter:true,
        //Formato en linea 
        displayFormat:"value+' ('+record.lugarNacimiento+')'",
        //Formato como funcion 
        displayFormat:function(value, record){
                return record.nombre+" ("+record.lugarNacimiento+")";
        },
        //Tamaño del select una vez desplegado
        selectWidth:250,
        //Campos a mostrar en el despliegue del select (en forma de grid dentro del combo)
        selectFields: [
              { name:"itemName", width:125 },
              { name:"units" },
              { name:"unitCost" }
        ],
        initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},
        //Dependencia de Seleccion
        dependentSelect:"estado",                                       //nombre de propiedad a filtrar si solo hay una propiedad dentro de estado de tipo pais
        // o
        dependentSelect: {filterProp:"pais", dependentField:"estado"}   //si ha mas de una propiedad dentro de estado de tipo pais se define cual es con filterProp
        //formatEditorValue:
    }
]


/************************************* LOG ***********************************************/

eng.dataSources["Log"] = {
    scls: "Log",
    modelid: "Forms",
    dataStore: "mongodb",
    displayField: "user",
    fields: [
        {name: "source", title: "Source", type: "string"},
        {name: "user", title: "Usuario", type: "string"},
        {name: "dataSource", title: "DataSource", type: "string"},
        {name: "action", title: "Acción", type: "string"},
        {name: "data", title: "Datos", type: "boolean"},			//Se define como boolean para que internamente se interprete como objeto
        {name: "timestamp", title: "TimeStamp", type: "long"},
    ],
};


eng.dataServices["LogsService"] = {
    dataSources: ["*"],
    actions:["add","remove","update"],
    service: function(request, response, dataSource, action)
    {
        //print("user:"+this.user+" dataSource:"+dataSource+" action:"+action+" request:"+request.data);
        if(dataSource!=="Log")
        {
            
            var data={
                source:this.source,
                //user:this.user.login,
                dataSource:dataSource,
                action:action,
              	data:[request.data],
                timestamp:new java.util.Date().getTime(),
            };
            if(this.user)
            {
              data.user=this.user.login;
              data.userIp=this.user.ip;
            }
            //print("saveLog:"+data);
            this.getDataSource("Log").addObj(data);
        }
    }
};


//            <script type="text/javascript">
            
                eng.createGrid(
                {
                    width: "98%", height: 300,
                    showFilter: true,
                    
                    fields: [
        		{name: "source"},
        		{name: "user"},
        		{name: "dataSource"},
        		{name: "client"},
        		{name: "contract"},
        		{name: "project"},
        		{name: "action"},
        		{name: "timestamp", formatCellValue: function (value, record, rowNum, colNum, grid){
        		    return new Date(value);
        		}},
        		{name:"data", type:"string", title:"Data",formatCellValue: function (value, record, rowNum, colNum, grid){
        		    return JSON.stringify(value);
        		}}
    		    ],
    		    showRollOverCanvas:true,
		    showRollUnderCanvas:false, // disable the rollUnderCanvas because we're not using it
		    rollOverCanvasConstructor:isc.HLayout,
		    rollOverCanvasProperties:{
		        snapTo:"TR", height:20, width:20,
		        members:[
		            {_constructor:"Button", title:"+", 
		             click:"isc.say('Data:<pre>' + JSON.stringify(this.parentElement.record.data,null,' ')+'</pre>'+((this.parentElement.record.oldValues!=null)?('<br>OldValues:<pre>' + JSON.stringify(this.parentElement.record.oldValues,null,' ')+'</pre>'):''),{title:'Detalle del registro', width:750, height:450})", 
		             height:20, width:20},
		        ]
		    },                    
                    autoFetchTextMatchStyle:"exact",                    
                }, "Log");

//            </script>  


/***************************************************************************************/


//******* DataExtractors ************
eng.dataExtractors["SWBSocial1"]={
    dataSource:"SWBSocial",
    class:"org.semanticwb.bigdata.engine.extractors.SWBSocialExtr",
    timer: {time:10,unit:"s"},
    url:"http://swbsocial.infotec.com.mx",
    brand:"infotec",
    stream:"conacyt",
};

eng.dataExtractors["SWBSocial2"]={
    dataSource:"SWBSocial",
    class:"org.semanticwb.bigdata.engine.extractors.SWBSocialExtr",
    
    url:"http://swbsocial.infotec.com.mx",
    brand:"infotec",
    stream:"Sep",
};


//dataProcessor arrojando exceptions
eng.dataProcessors["MagicTownProcessor"] = {
    dataSources: ["MagicTown"],
    actions:["add","update"],
    request: function(request, dataSource, action)
    {
        print("request:"+request);
        print("dataSource:"+dataSource);
        print("action:"+action);
        print("user:"+this.user);
      	if(request.data.name=="Jei")throw "No se puede llamar Jei";
      	request.data.name+=" Hola";
        
    }
};

//DEPENDENCE SELECT
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "colonia", title: "Colonia", required: true, type: "string"},
        {name: "delegacion", title: "Delegacion/Municipio", type: "text"},
        {name: "pais", title: "Pais", stype: "select", dataSource:"Paises", changed:"form.clearValue('estado');", dependentSelect_:"estado"},
        {name: "estado", title: "Estado", stype: "select", dataSource:"Estados", getPickListFilterCriteria : function () {
            var pais = this.form.getValue("pais");
            return {pais:pais};
         }},
        {name: "cp", title: "Codigo Postal", type: "int"},
    ]
    

//invoke java Class
var MyJavaClass = Java.type('my.package.MyJavaClass');


//Tabs
form.tabs.getTab(0).title
form.tabs.getTab(1).disable()
form.tabs.getTab(1).enable()


//Date formulas:  formula: { text: "DateAdd(new Date(),'d',shipDays)"} 


//textMatchStyle
//  exact
//  substring
// startsWith
/*
var ds=eng.getDataSource("Variables");
undefined
ds.fetch()
Object {startRow: 0, data: Array[100001], endRow: 100001, totalRows: 100001, status: 0}data: Array[100001][0 … 9999][10000 … 19999][20000 … 29999][30000 … 39999][40000 … 49999][50000 … 59999][60000 … 69999][70000 … 79999][80000 … 89999][90000 … 99999]100000: Objectlength: 100001__proto__: Array[0]endRow: 100001startRow: 0status: 0totalRows: 100001__proto__: Object
ds.fetch({starRow:0,endRow:1000})
Object {startRow: 0, data: Array[1000], endRow: 1000, totalRows: 100001, status: 0}
ds.fetch({starRow:0,endRow:1000,data:{"nombre":"var5000"}})
Object {startRow: 0, data: Array[1], endRow: 1, totalRows: 1, status: 0}
ds.fetch({starRow:0,endRow:1000,textMatchStyle:"substring",data:{"nombre":"var5000"}})
Object {startRow: 0, data: Array[11], endRow: 11, totalRows: 11, status: 0}data: Array[11]0: Object_id: "_suri:SWBF2:Variables:5876c48e77c86679292a0aa8"nombre: "var5000"valor: "5000"__proto__: Object1: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba70"nombre: "var50000"valor: "50000"__proto__: Object2: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba71"nombre: "var50001"valor: "50001"__proto__: Object3: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba72"nombre: "var50002"valor: "50002"__proto__: Object4: Object5: Object6: Object7: Object8: Object9: Object10: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba79"nombre: "var50009"valor: "50009"__proto__: Objectlength: 11__proto__: Array[0]endRow: 11startRow: 0status: 0totalRows: 11__proto__: Object
ds.fetch({starRow:0,endRow:1000,textMatchStyle:"startsWith",data:{"nombre":"var5000"}})
Object {startRow: 0, data: Array[11], endRow: 11, totalRows: 11, status: 0}data: Array[11]0: Object_id: "_suri:SWBF2:Variables:5876c48e77c86679292a0aa8"nombre: "var5000"valor: "5000"__proto__: Object1: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba70"nombre: "var50000"valor: "50000"__proto__: Object2: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba71"nombre: "var50001"valor: "50001"__proto__: Object3: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba72"nombre: "var50002"valor: "50002"__proto__: Object4: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba73"nombre: "var50003"valor: "50003"__proto__: Object5: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba74"nombre: "var50004"valor: "50004"__proto__: Object6: Object7: Object8: Object9: Object10: Objectlength: 11__proto__: Array[0]endRow: 11startRow: 0status: 0totalRows: 11__proto__: Object
ds.fetch({sortBy:["nombre"],starRow:0,endRow:1000,textMatchStyle:"startsWith",data:{"nombre":"var5000"}})
Object {startRow: 0, data: Array[11], endRow: 11, totalRows: 11, status: 0}data: Array[11]0: Object_id: "_suri:SWBF2:Variables:5876c48e77c86679292a0aa8"nombre: "var5000"valor: "5000"__proto__: Object1: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba70"nombre: "var50000"valor: "50000"__proto__: Object2: Object_id: "_suri:SWBF2:Variables:5876c49277c86679292aba71"nombre: "var50001"valor: "50001"__proto__: Object3: Object4: Object5: Object6: Object7: Object8: Object9: Object10: Objectlength: 11__proto__: Array[0]endRow: 11startRow: 0status: 0totalRows: 11__proto__: Object
ds.fetch({sortBy:["-nombre"],starRow:0,endRow:1000,textMatchStyle:"startsWith",data:{"nombre":"var5000"}})
Object {startRow: 0, data: Array[11], endRow: 11, totalRows: 11, status: 0}



ds.fetch({"sortBy":["nombre"],data:{edad:{ "$lt" : 40 , "$gt" : 20}}})
Object {startRow: 0, data: Array[2], endRow: 2, totalRows: 2, status: 0}
ds.fetch({"sortBy":["nombre"],data:{nacimiento:{ "$lt" : "1990" , "$gt" : "1980"}}})
Object {startRow: 0, data: Array[2], endRow: 2, totalRows: 2, status: 0}
ds.fetch({"sortBy":["nombre"],data:{nacimiento:{ "$lt" : "1985" , "$gt" : "1980"}}})
Object {startRow: 0, data: Array[1], endRow: 1, totalRows: 1, status: 0}
ds.fetch({"sortBy":["nombre"],data:{nacimiento:{ "$lt" : "1985" , "$gt" : "1970"}}})
Object {startRow: 0, data: Array[2], endRow: 2, totalRows: 2, status: 0}data: Array[2]0: Object_id: "_suri:User1:Clientes:582ca7e48d6a46a9ee86a419"direccion: "asdf"edad: 35email: "softjei@gmail.com"nacimiento: "1984-11-13"nombre: "Aldo"password: "jsolis"rfc: "asdf"__proto__: Object1: Object_id: "_suri:User1:Clientes:582ca1a88d6a46a9ee86a40e"_selection_1: truedireccion: "ssfasf"edad: 42email: "asdfaf@sdaf.com"nacimiento: "1974-11-13"nombre: "Javier"pais_code: "mx"rfc: "asdfafds"telefono: "321412"__proto__: Objectlength: 2__proto__: Array[0]endRow: 2startRow: 0status: 0totalRows: 2__proto__: Object
ds.fetch({"sortBy":["nacimiento"]})
Object {startRow: 0, data: Array[3], endRow: 3, totalRows: 3, status: 0}data: Array[3]0: Object_id: "_suri:User1:Clientes:582ca1a88d6a46a9ee86a40e"_selection_1: truedireccion: "ssfasf"edad: 42email: "asdfaf@sdaf.com"nacimiento: "1974-11-13"nombre: "Javier"pais_code: "mx"rfc: "asdfafds"telefono: "321412"__proto__: Object1: Object_id: "_suri:User1:Clientes:582ca7e48d6a46a9ee86a419"direccion: "asdf"edad: 35email: "softjei@gmail.com"nacimiento: "1984-11-13"nombre: "Aldo"password: "jsolis"rfc: "asdf"__proto__: Object2: Object_id: "_suri:User1:Clientes:582ca7db8d6a46a9ee86a418"direccion: "asdf"edad: 28email: "asdasd"nacimiento: "1988-11-15"nombre: "Vanne"rfc: "asfd"telefono: "234234"__proto__: Objectlength: 3__proto__: Array[0]endRow: 3startRow: 0status: 0totalRows: 3__proto__: Object
ds.fetch({"sortBy":["-nacimiento"]})

 **/


//LINKS y Grids

var g=requisitionFrm.linkToForms[0].form.getField("item").grid;
g.getTotalRows()
g.getRecord(0)

var g2=requisitionFrm.linkToForms[4].form.getField("focon").grid;
g2.addData({noPartida:5})


eng.getDataSource("TiposVialidad").toValueMap("identificador","nombre");        //regresa objeto con mapeo de valores
eng.getDataSource("TiposVialidad").toValueMap("identificador")                  //regresa arreglo de valores






var data={query:{data:{sexo:"HOMBRE","estado":"15"}},fields:{"nombre":"Nombre","email":"Email","nacimiento":"Nacimiento","sexo":"Sexo","cp":"CP","rfc":"RFC"}};
eng.utils.getSynchData("/ex?dssp=/admin/datasources.js&ds=Consultores",JSON.stringify(data)).response

var data={query:{data:{"estado":"15"}},fields:["identificador","programa.convocatoria","hombres","mujeres"]};
eng.utils.getSynchData("/ex?dssp=/admin/datasources.js&ds=Folios",JSON.stringify(data)).response

var data={query:{data:{"estado":"15"}}};
eng.utils.getSynchData("/ex?dssp=/admin/datasources.js&ds=Folios&ext=xls",JSON.stringify(data)).response
eng.utils.getSynchData("/ex?dssp=/admin/datasources.js&ds=Folios&ext=csv",JSON.stringify(data)).response

eng.utils.getSynchData('/ex?dssp=/admin/datasources.js&ds=Folios&ext=xls&data={query:{data:{"estado":"15"}},fields:["identificador","programa.convocatoria","hombres","mujeres"]}').response


//http://localhost:8080/ex?dssp=/admin/datasources.js&ds=Folios&ext=xls&data={query:{data:{%22estado%22:%2215%22}}}




//Sort DataObject
/*
    report.sort(new Comparator<Map.Entry<String,Object>>(){
         @Override
         public int compare(Map.Entry<String,Object> o1, Map.Entry<String,Object> o2) {
             //System.out.println("compare");
             return ((DataList)o1.getValue()).getString(0).compareToIgnoreCase(((DataList)o2.getValue()).getString(0));
         }        
    });
    
    
//sort DataList    
    report.sort(new Comparator<Object>(){
         @Override
         public int compare(Object o1, Object o2) {
             return ((DataList)o1).getString(1).compareToIgnoreCase(((DataList)o2).getString(1));
         }        
    });     
    
*/    
//Mover los botones arriba
form.layout.members.reverse();





//contextdata
eng.dataSources["Direccion"] = {
    scls: "Direccion",
    modelid: "{contextData.model}",
    dataStore: "mongodb",      
    displayField: "calle",
    fields: [
        {name: "calle", title: "Calle", required: true, type: "string"},
        {name: "numero", title: "Numero", type: "string"},
        {name: "colonia", title: "Colonia", type: "string"},
        {name: "municipio", title: "Municipio", type: "string"},
        {name: "cp", title: "CP", type: "int", validators_:[{stype:"zipcode"}]},
        {name: "pais", title: "Pais", required: true, stype: "select", dataSource:"Pais", dependentSelect:"estado", dependentSelect_: {filterProp:"pais", dependentField:"estado"}},
        {name: "estado", title: "Estado", required: true, stype: "select", dataSource:"Estado", canFilter:false, initialCriteria_ : {} },
    ]
};

//verificar si el script esta corriendo del lado del servidor o del cliente
if(eng.isServerSide)
{
    
}












//Debug
/*
        <script src="/platform/js/eng.js" type="text/javascript"></script>
            
        <script src="/platform/isomorphic/system/modules-debug/ISC_Core.js"></script>
        <script src="/platform/isomorphic/system/modules-debug/ISC_Foundation.js"></script>
        <script src="/platform/isomorphic/system/modules-debug/ISC_Containers.js"></script>
        <script src="/platform/isomorphic/system/modules-debug/ISC_Grids.js"></script>
        <script src="/platform/isomorphic/system/modules-debug/ISC_Forms.js"></script>
        <script src="/platform/isomorphic/system/modules-debug/ISC_DataBinding.js"></script>
        <script src="/platform/isomorphic/skins/Tahoe/load_skin.js"></script>      
        <script src="/platform/isomorphic/locales/frameworkMessages_es.properties"></script>
        <script src="/platform/plupload/js/plupload.full.min.js"></script>

        <link href="/admin/css/sc_admin.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        <h1>Hola Mundo</h1>
        <div>
            <script type="text/javascript">
                var cache=false;                
                eng.initPlatform("/admin/ds/admin.js", {cache:false,isc:false});
                
                eng.utils.loadJS(isomorphicDir+"system/modules-debug/ISC_Core.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"system/modules-debug/ISC_Foundation.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"system/modules-debug/ISC_Containers.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"system/modules-debug/ISC_Grids.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"system/modules-debug/ISC_Forms.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"system/modules-debug/ISC_DataBinding.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"skins/Tahoe/load_skin.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"skins/Tahoe/load_skin.js",false,cache);
                eng.utils.loadJS(isomorphicDir+"locales/frameworkMessages_es.properties",false,cache);
                eng.utils.loadJS("/platform/plupload/js/plupload.full.min.js",false,cache);          
                
                isc.DateItem.DEFAULT_START_DATE.setYear(1900);            
                isc.Canvas.resizeControls(10);                            
                Time.setDefaultDisplayTimezone("-06:00");
                Time.adjustForDST=false;
                NumberUtil.decimalSymbol=".";
                NumberUtil.groupingSymbol=",";                          
                eng.utils.loadJS("/platform/js/eng_lang.js",false,cache);                

            </script>
*/            