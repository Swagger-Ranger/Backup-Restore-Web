function change1(obj){
    if($('.data-info').hasClass("dn")){
        $(obj).text("收起");
        $('.data-info').removeClass("dn");
    }else{
        $(obj).text("展开");
        $('.data-info').addClass("dn");
    }
}

function change2(obj){
    if($('.inter-descr').hasClass("dn")){
        $(obj).text("收起");
        $('.inter-descr').removeClass("dn");
    }else{
        $(obj).text("展开");
        $('.inter-descr').addClass("dn");
    }
}


var bURL = '/dataApi/swagger/getApiData';

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            interName: null,
            system: null,
            module: null,
            level:null,
        	sqlDbtype:null
        },
        sqlDbtypeList:[
            {"id":"oracle","name":"ORACLE"},
            {"id":"MYSQL","name":"MYSQL"},
            {"id":"HIVE","name":"HIVE"},
        ],  //sqlDbtype的数组
        sqlDbSourceList:[
            {"id":"","name":"请选择"},
            // {"id":"191218102643649","name":"192.168.1.91"},
            // {"id":"191217161619745","name":"192.168.1.47"}
        ],  //viewiId的数组
        system:["请选择系统","全选"],
        module:["请选择模块","全选"],
        level:["请选择级别","全选"],
        sqlDbtype:["请选择数据库","全选"],
        showPassword: true,
        showList: true,
        revisionBox: false,
        showColumn:true,
        title:null,
        flag:false,
        exportFileTypeList: [{"id":"JSON","name":"JSON"},
                            {"id":"CSV","name":"CSV"},
                            {"id":"TXT","name":"TXT"},
                            {"id":"XLSX","name":"XLSX"},
                            {"id":"XML","name":"XML"}],
        isDimensionList:[{"id":"INDEX","name":"指标"},{"id":"DIMENSION","name":"维度"}],  //define select control  list
        itemSystemList:[],  //define select control  list
        itemModuleList:[],  //define select control  list
        itemLevelList:[],  //define select control  list
        ipt:{
        },
        info:{
        }
    },
    created(){
　　　　　　 //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
        this.ipt.sqlDbsource = this.sqlDbSourceList[0].id;
        this.ipt.sqlDbtype = this.sqlDbtypeList[0].id;
    },
    computed: {
        outputAttribute: function () {
            return "{\"sepchar\":\"" + this.ipt.sepchar + "\",\"filename\":\"" + this.ipt.filename + "\"}"
        }
    },
    mounted:function () {
    	//获取系统名称
        $.ajax({
            url:bURL,
            data:{rptId:'dsb_getSystemName'},
            type:'get',
            dataType:'json',
            success:function (rel) {
            	if(rel.code === '0000'){
            		data=rel.data.rows;
            		for(var i = 0;data.length>i;i++){
            			if(data[i] != null && data[i] != '' && typeof(data[i]) != undefined){
            				vm.system.push(data[i].apiSystem)
            			}
            		}
            	}
            },
            error:function (rel) {
                console.log(rel.msg)
            }
        })
        //获取模块名称
        $.ajax({
            url:bURL,
            data:{rptId:'dsb_getModuleName'},
            type:'get',
            dataType:'json',
            success:function (rel) {
            	if(rel.code === '0000'){
            		data=rel.data.rows;
            		for(var i = 0;data.length>i;i++){
            			if(data[i] != null && data[i] != '' && typeof(data[i]) != undefined){
            				vm.module.push(data[i].apiModule)
            			}
            		}
            	}
            },
            error:function (rel) {
                console.log(rel.msg)
            }
        })
        //获取级别
        $.ajax({
            url:bURL,
            data:{rptId:'dsb_getLevelName'},
            type:'get',
            dataType:'json',
            success:function (rel) {
            	if(rel.code === '0000'){
            		data=rel.data.rows;
            		for(var i = 0;data.length>i;i++){
            			if(data[i] != null && data[i] != '' && typeof(data[i]) != undefined){
            				vm.level.push(data[i].apiLevel)
            			}
            		}
            		
            	}
            },
            error:function (rel) {
                console.log(rel.msg)
            }
        })
        //获取数据库类别
        $.ajax({
            url:bURL,
            data:{rptId:'dsb_getSqlDbtypeName'},
            type:'get',
            dataType:'json',
            success:function (rel) {
            	if(rel.code === '0000'){
            		data=rel.data.rows;
            		for(var i = 0;data.length>i;i++){
            			if(data[i] != null && data[i] != '' && typeof(data[i]) != undefined){
            				vm.sqlDbtype.push(data[i].sqlDbtype)
            			}
            		}
            		
            	}
            },
            error:function (rel) {
                console.log(rel.msg)
            }
        })
        //获取数据源
        var url = portalURL + 'datasources/list-paging'; // 接口 URL 地址
        var params = {
            pageNumber:1,
            pageSize:10000
        };
        $.ajax({
            url:url,
            data:params,
            type:'get',
            dataType:'json',
            success:function (rel) {
                console.log(rel);
                if(rel.code === 0){
            		let datas = rel.data.totalList;
            		for(var i = 0;datas.length>i;i++){
            			if(datas[i] != null && datas[i] != '' && typeof(datas[i]) != undefined){
                            var option = {"id":datas[i].id, "name":datas[i].name+" -- "+datas[i].type}
                            vm.sqlDbSourceList.push(option)
            			}
            		}
            		
            	}
            },
            error:function (rel) {
                console.log(rel.msg)
            }
        });
    },
    methods: {
        query: function () {
            vm.reload();
        },
        sqlDbtypeSelected(){
            //获取选中的优惠券
            // console.log(this.couponSelected);
        },
        specifiName(e) {
            if(vm.ipt.paging==null ||vm.ipt.paging==""){
                alert("请选择是否需要分页");
            }else if(vm.ipt.paging=="结果"){
                Vue.set(vm.ipt,'sqlSummary',"");
                alert("如果是数据不需要汇总语句")
            }
        },
        add: function(){
            vm.showPassword=true;
            vm.showList = false;
            vm.showColumn = true;
            vm.title = "新增";
            vm.ipt.rptId =null;
            vm.ipt.analyId=null;
            vm.ipt.sqlText=null;
            vm.ipt.describe=null;
            // vm.ipt.sqlDbtype=null;
            vm.ipt.interName=null;

            vm.ipt.sqlSummary=null;    
            vm.ipt.apiSystem=null;   
            vm.ipt.apiModule=null;    
            vm.ipt.orderNum=null;     

            vm.ipt.fileType=null;
            vm.ipt.sepchar=null;
            vm.ipt.filename=null;
        },
        update: function () {
            var rptId = getSelectedRow('#table','rptId');
            if(rptId == null){
                return ;
            }
            vm.showPassword=false;
            vm.showList = false;
            vm.showColumn = true;
            vm.title = "修改";            
            vm.getIptMng(rptId);
        },
        del: function () {
            var rptId = getSelectedRows('#table','rptId');
            console.log(rptId);
            if(rptId == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: dataApiURL + "analysisSql/delete",
                    contentType: "application/json",
                    data: JSON.stringify(rptId),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function () {
            var x=0;
            if(vm.validator()){
                return ;
            }
            if(!vm.showPassword){
                //更新
                var url="analysisSql/update";
            }else{
                var url="analysisSql/save";
                var url1="analysisSql/info";
                var rptId=vm.ipt.rptId;
                console.log(vm.ipt);
                if(vm.ipt.rptId !=null){
                    $.ajax({
                        type: "GET",
                        async: false,
                        url: dataApiURL + "analysisSql/info",
                        contentType: "application/json",
                        data:{
                            rptId:rptId,
                        },
                        success: function(r){
                            if(r.ipt!=null){
                                x=x+1;
                                alert("接口id不能重复");
                            }  
                        }
                    });
                }
            }
           if(x>0){

            }else{
                var sqlText=vm.ipt.sqlText
                sqlText=sqlText.replace(/\>/g,"&gt;");
                sqlText=sqlText.replace(/\</g,"&lt;");
                var sqlSummary=vm.ipt.sqlSummary;
                if(sqlSummary!=null){
                    sqlSummary=sqlSummary.replace(/\>/g,"&gt;");
                    sqlSummary=sqlSummary.replace(/\</g,"&lt;");
                    Vue.set(vm.ipt,'sqlSummary',sqlSummary);
                }
                Vue.set(vm.ipt,'sqlText',sqlText);

                Vue.set(vm.ipt,'outputAttribute',vm.outputAttribute);
                console.log(vm.ipt);
                $.ajax({
                    type: "POST",
                    url: dataApiURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.ipt),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            }
        },
        //明细sql验证
        test: function (){
            if(vm.ipt.paging==null ||vm.ipt.paging==""){
                alert("请选择是否需要分页");
            }else if(vm.ipt.sqlText==null ||vm.ipt.sqlText==""){
                alert("请填写sql语句");
            }else{
                var s=$("#dd").val()+"|";
                s=s+vm.ipt.paging;
                layer.open({
                    type: 2,
                    title: 'sql测试',
                    area:['90%','90%'],
                    content: 'parameter.html?sql='+encodeURI(s)+'&type='+vm.ipt.sqlDbtype+'&source='+vm.ipt.sqlDbsource
                })        
            }
        },
        example: function (){
            layer.open({
                type: 2,
                title: 'Sql示例',
                area:['60%','60%'],
                content: 'example.html'
            })   
        },
        //汇总sql验证
        test1: function (){
            if(vm.ipt.paging=='结果'){
                alert("返回类型是结果的话，不需要汇总语句")
            }else if(vm.ipt.sqlSummary==null ||vm.ipt.sqlSummary==""){
                alert("请填写汇总语句");
            }else{
                var s=vm.ipt.sqlSummary+"|";
                s=s+vm.ipt.paging;
                layer.open({
                    type: 2,
                    title: 'sql测试',
                    area:['90%','90%'],
                    content: 'parameter.html?sql='+encodeURI(s)+'&type='+vm.ipt.sqlDbtype+'&source='+vm.ipt.sqlDbsource
                }) 
            }
            
        },
        getIptMng: function(rptId){
            $.get(dataApiURL + "analysisSql/info?rptId="+rptId, function(r){
                console.log(r.ipt);
                vm.ipt = r.ipt;
                vm.ipt.isDimension = r.ipt.isDimension.name;
                let output = JSON.parse(r.ipt.outputAttribute);
                vm.ipt.sepchar = output.sepchar;
                vm.ipt.filename = output.filename;
            });
        },
        reload : function() {
            vm.showList = true;
            $('#table').bootstrapTable("refresh");
        	render();
            
        },
        validator: function () {
            var regPos = /^\d+(\.\d+)?$/;
            if (!(regPos.test(vm.ipt.orderNum))&&!isBlank(vm.ipt.orderNum)) {
                alert("排序必须为数字");
                return true;
            }
            if(isBlank(vm.ipt.interName)){
                alert("接口名不能为空");
                return true;
            }
            // if(isBlank(vm.ipt.orderNum)){
            //     alert("排序不能为空");
            //     return true;
            // }
            if(isBlank(vm.ipt.rptId)){
                alert("接口id不能为空");
                return true;
            }
            if(isBlank(vm.ipt.paging)){
                alert("是否分页不能为空");
                return true;
            }
            if(isBlank(vm.ipt.sqlText)){
                alert("查询语句不能为空");
                return true;
            }

        },
        //切换排列方式
        changeShowWay : function(){
        	if(vm.flag == true){
				vm.flag= false;
        		$("#table").css("display","table");
        		$(".fixed-table-container").css("display","block");
        		$(".fixed-table-pagination").css("display","block");
        		$(".clearfix").css("display","block");
        		$("#quare").css("display","none");
        		$("#page").attr("style");
        		$("#page").css("display","none");
                $(".pull-right img:last-child").removeClass("active");
                $(".pull-right img:first-child").removeClass("nactive");
                $(".pull-right img:last-child").addClass("nactive");
                $(".pull-right img:first-child").addClass("active");
            }else{
				vm.flag = true;
        		$(".fixed-table-container").css("display","none");
        		$(".fixed-table-pagination").css("display","none");
        		$("#quare").css("display","flex");
        		$("#page").removeAttr("style");
                $(".pull-right img:first-child").removeClass("active");
                $(".pull-right img:last-child").removeClass("nactive");
                $(".pull-right img:first-child").addClass("nactive");
                $(".pull-right img:last-child").addClass("active");
        	}
        	
        },
        //获取选择的系统名称
        systemSelect(event){
        	vm.q.system=event.target.value;
        	$('#table').bootstrapTable("refresh");
        	render();
		},
		//获取选择的模块名称
        moduleSelect(event){
        	vm.q.module=event.target.value;
        	$('#table').bootstrapTable("refresh");
        	render();
		},
		//获取选择的级别
        levelSelect(event){
        	vm.q.level=event.target.value;
        	$('#table').bootstrapTable("refresh");
        	render();
		},
		//获取选择的数据库类别
        sqlDbtypeSelect(event){
        	vm.q.sqlDbtype=event.target.value;
        	$('#table').bootstrapTable("refresh");
        	render();
		}
    }
});