$(function () {
    $('#roleAuthTab a:first').tab('show');
    $('.middleIcon').hide();
    $('#roleAuthTab a').click(function (e) {
          e.preventDefault();
          $(this).tab('show');
    })   
    $("#jqGrid").jqGrid({
        url: dataApiURL + 'analysisSql/list',
        datatype: "json",
        colModel: [         
            { label: '接口名称', name: 'interName', index:'InterName', width: 45},
            { label: '接口id', name: 'rptId',  width:45,key: true},
            { label: '返回类型',name:'paging',width:45,formatter: function(value, options, row){
                return value === '1' ? 
                    '数据': 
                    '结果';
            }},
            { label: '明细语句', name: 'sqlText', width: 220},
            { label: '汇总语句', name: 'sqlSummary', width: 220},
            { label: '描述', name: 'describe',  width: 80}
        ],
        viewrecords: true,
        height: ($(window).height()-150),
        rowNum: 10,
        rowList : [10,30,50,100,500],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
    var str='select * from p_sql where 1=1 @{ and mon in $[p_mon] } @{ and year = $[p_year:2018] } and org = $[p_org:"财务部"] @{and username = "$[p_name]"} ';
    str=str+' \n '+"当$[]中有:时代表会给一个默认值如:没有传p_year参数时，会取一个默认值2018，传了p_year参数过来时，会取传过来的参数"
    str=str+' \n '+"当$[]中没有:如果没有传参数，则不取"
    $("#da").html(str);
});

var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "orgId",
                rootPId: 0
            },
            key: {
                url:"nourl"
            }
        }
    };
var ztree;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            interName: null
        },
        showPassword: true,
        showList: true,
        showColumn:true,
        title:null,
        roleList:{},
        user:{
            orgId:1,
            status:1,
            orgShtNm:null,
            roleIdList:[]
        },
        ipt:{
        }
    },
    methods: {
        query: function () {
            vm.reload();
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
            vm.roleList = {};
            vm.ipt.rptId =null;
            vm.ipt.analyId=null;
            vm.ipt.sqlText=null;
            vm.ipt.describe=null;
            vm.ipt.sqlDbtype=null;
            vm.ipt.interName=null;            
        },
        update: function () {
            var rptId = getSelectedRow();
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
            var rptId = getSelectedRows();
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
        reset: function () {
            var userId = getSelectedRow();
            if(userId == null){
                return ;
            }

            vm.showPassword=true;
            vm.showList = false;
            vm.showColumn = false;
            vm.title = "重置密码";
            vm.getUser(userId);
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
                
                $.ajax({
                    type: "POST",
                    url: dataApiURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(vm.ipt),
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload1();
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
                    content: 'parameter.html?sql='+encodeURI(s)
                })        
            }
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
                    content: 'parameter.html?sql='+encodeURI(s)
                }) 
            }
            
        },
        getIptMng: function(rptId){
            $.get(dataApiURL + "analysisSql/info?rptId="+rptId, function(r){
                vm.ipt = r.ipt;
            });
        },
        getRoleList: function(){
            $.get(dataApiURL + "sys/role/select", function(r){
                vm.roleList = r.list;
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{ 
                postData:{'InterName': $("#in").val()},
                page:1
            }).trigger("reloadGrid");
        },
        reload1: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{ 
                postData:{},
                page:1
            }).trigger("reloadGrid");
        },
        
        //保存绑定IP
        ipsaveOrUpdate: function () {
			confirm('确定保存【IP绑定】？', function(){
	            /*if(vm.validator()){
	                return ;
	            }*/
				
				var url = vm.actionModel == 'add' ? "pinter/save" : "pinter/update";
					var x=0;
					var id = getSelectedRow();
					console.log(vm.pint);
					if(url=="pinter/save"){
						$.ajax({
							type: "POST",
							async: false,
							url: dataApiURL + "pinter/select",
			                contentType: "application/json",
							data: JSON.stringify(vm.pint),
							success: function(r){
								console.log(r.pin.length);
								console.log(r.pin!=null);
								if(r.pin>0){
									alert("此接口已绑定此ip");
									x++;
									return ;
								}
							}
						})
					}else{

					}
					
					if(x>0){

					}else{
						$.ajax({
						type: "POST",
					    url: dataApiURL + url,
		                contentType: "application/json",
					    data: JSON.stringify(vm.pint),
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
				
			});
		},
        validator: function () {
            if(isBlank(vm.ipt.interName)){
                alert("接口名不能为空");
                return true;
            }
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

        }
        
    }
});