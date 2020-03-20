$(function () {
    console.log(T.p("source"));
    console.log(T.p("type"));
    var type=T.p("type");
    var source=T.p("source");
	var aa=location.search.concat();
    console.log(aa);
    var a=decodeURI(aa);
    console.log(a);
    var x=a.length;
	var c=a.substring(5,x);
	var b=c.split("|");	var x1=b.length-1;
    console.log(b[0]);
    var str=b[0];
    str=str.replace(/\>/g,"&gt;").replace(/\</g,"&lt;")
	var list=new Array();
	var map=new Map();
	$.ajax({
        type: "GET",
        url: dataApiURL +"analysisSql/sql",
        contentType: "application/json",
        async:false,
        data: {
            sql:str,
        },
        success: function(r){
            console.log(r);
            list=r.list.distinct();
            map=r.map;  
        }
    })
	

	var sql='<div class="form-group" v-show="showColumn">'+
			   	'<div class="col-sm-2 control-label">'+"验证sql"+'</div>'+
			   	'<div class="col-sm-10">'+
			      '<textarea id="dd" class="form-control" rows="5" cols="200" disabled="isAble" v-model="ipt.sqlText" placeholder="sql">'+'</textarea>'
			    +'</div>'
			+'</div>';
	
	var obj={};
	var vm = new Vue({
    el:'#rrapp',
    data:{
        showPassword: true,
        showList: true,
        showColumn:false,
        title:null,
        isAble:false,
        ipt:obj,
    },
    methods: {
        validataSql: function () {
        	var obj1={};
            obj1.type=type;
            obj1.source=source;
        	obj1.sql=b[0];
            var sql=obj1.sql;
            obj1.sql=obj1.sql.replace(/\>/g,"&gt;");
            console.log(obj1.sql);
            obj1.sql=obj1.sql.replace(/\</g,"&lt;");
            console.log(obj1.sql);
            for(var i=0;i<list.length;i++){
            	var key=list[i];
            	var co=$("#"+list[i]).val();
            	obj1[key] = co; 	
            }
            obj1.paging=b[x1];
            vm.showColumn=true;
            console.log(obj1.sql);
            $.ajax({
                type: "POST",
                url: dataApiURL +"analysisSql/validation",
                async: false,
                contentType: "application/json",
                data:JSON.stringify(obj1),
                success: function(r){
                	console.log(r);
                    if(r.code==0){
                        alert('sql可用', function(){
                            var index = parent.layer.getFrameIndex(window.name); 
    						//parent.layer.close(index);
						});
						let btn = document.querySelector('#json');
                         console.log(r.list.rows)
                        if(obj1.paging=="分页"){
                            btn.textContent = JSON.stringify(r.list.rows, null, '  ');
                        }else{
                            btn.textContent = JSON.stringify(r.list, null, '  ');
                        }
                   	}else{
                		alert('sql不可用', function(){
                   			var index = parent.layer.getFrameIndex(window.name);
    						//parent.layer.close(index);
						});
                        let btn = document.querySelector('#json');
                        btn.textContent=JSON.stringify(r.msg, null, '  ')
                	}
                        
                }
            }); 
            
        },

        validator: function () {
            
        }
    }
});
    for(var i=0;i<list.length;i++){
        var ss='<div class="form-group" v-show="showColumn">'+
                '<div class="col-sm-2 control-label">'+list[i]+':'+'</div>'+
                '<div class="col-sm-10">'+
                   '<input type="text" id="'+list[i]+'" class="form-control" v-model="ipt.'+list[i]+'" placeholder="'+list[i]+'"/>'+
                '</div>'+
            '</div>';
        $("#tt").prepend(ss);
    }
	$("#tt").prepend(sql);
	$("#dd").html(b[0]);
	for(var key in map){
  		for(var i=0;i<list.length;i++){
  			if(key==list[i]){
  				$("#"+list[i]).val(map[key]);
  			}
  		}
	}
});

