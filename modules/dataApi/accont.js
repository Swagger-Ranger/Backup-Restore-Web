$(function () {
	$('#roleAuthTab a:first').tab('show');
	$('.middleIcon').hide();
	$('#roleAuthTab a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
	})
		
//	$('.tree-div').height($(window).height() - 230);
    $("#jqGrid").jqGrid({
        url: dataApiURL + 'pinter/list2',
        datatype: "json",
        colModel: [
        	{ label: 'id', name: 'id', width: 45,key: true,hidden:true},
        	{ label:'接口id',name:'rptId',width:45},
			{ label: '接口名', name: 'interName',  width: 45},
			{ label: '允许访问ip', name: 'ip', width: 75 },
			{ label: '密钥', name: 'theKey', width: 100 },
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
            page: "page.pageNum",
            total: "page.pages",
            records: "page.total"
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
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			interName: null
		},
		showList: true,
		inputBox: false,
		title:null,
		actionModel:null,
		pint:{}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = true;
			vm.inputBox = true;
			vm.title = "新增";
			vm.actionModel='add';
			vm.pint = {};
			var list=[];
			vm.pint.interName=null;
			vm.pint.rptId=null;
			vm.pint.ip=null;
			vm.pint.ip=null;
			$.ajax({
				type: "GET",
				async: false,
				url: dataApiURL + "analysisSql/list1",
                contentType: "application/json",
				data:{
                },
				success: function(r){
					if(r.code==0){
						$("#se").empty();
						list=r.ipt;
						for(var i=0;i<list.length;i++){
                        	$("#se").append('<option>'+list[i].interName+'</option>');
                    	}
					}
				}
			});
			$("#se").change(function(){
         		var interName=$('#se option:selected') .val();
         		$("#sid").empty();
				for(var i=0;i<list.length;i++){
						if(interName==list[i].interName){
							vm.pint.rptId=list[i].rptId;
							$('#sid').val(list[i].rptId);
						}
                        
                    } 
        	});
		},
		update: function () {
			var id = getSelectedRow();
			console.log(id);
			if(id == null){
				return ;
			}
			vm.showList = true;
			vm.inputBox = true;
            vm.title = "修改";
            vm.actionModel='update';
            vm.getIptMng(id);
            $('.panel').css('z-index','100');
            $('.panel').css('position','absolute');
			$('.panel').css('margin-left','20%');
			$('.panel').css('width','50%');
            $('.test').css('z-index','-100');
            $('.test').css('position','absolute');
			$('.test').css('opacity','0.3');
		},
		del: function () {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: dataApiURL + "pinter/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
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
	    reload: function () {
	    	vm.showList = true;
			vm.inputBox = false;
			$('.test').css('z-index','0');
			$('.test').css('position','absolute');
			$('.test').css('opacity','1');
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                postData:{'interName': vm.q.interName},
                page:1
                // page:page
            }).trigger("reloadGrid");
		},
		getIptMng: function(id){
           var list1=new Array();
            $.ajax({
				type: "GET",
				async: false,
				url: dataApiURL + "pinter/info",
                contentType: "application/json",
				data:{
						id:id,
                },
				success: function(r){
					if(r.code==0){
						//$("#se").empty();
						vm.pint=r.pin;
                		//$("#se").append('<option>'+r.pin.interName+'</option>');
					}else{
						alert(r.msg)
					}
					
				}
			});
            $.ajax({
				type: "GET",
				async: false,
				url: dataApiURL + "pinter/list1",
                contentType: "application/json",
				data:{
                },
				success: function(r){
					if(r.code==0){
						var interName=$('#se option:selected') .val();
						list1=r.ipt;
						for(var i=0;i<list1.length;i++){
							if(list1[i].interName!=interName){
								$("#se").append('<option>'+list1[i].interName+'</option>');
							}
						}
					}
				}
			});
			$("#se").change(function(){
         		var interName=$('#se option:selected') .val();
         		$("#sid").empty();
				for(var i=0;i<list1.length;i++){
						if(interName==list1[i].interName){
							console.log("1234");
							console.log(list1[i]);
							vm.pint.rptId=list1[i].rptId;
							$('#sid').val(list1[i].rptId);
						}
                        
                    } 
        	});

        },
        validator: function () {
            if(isBlank(vm.role.roleName)){
                alert("角色名不能为空");
                return true;
            }
        }
    }
});