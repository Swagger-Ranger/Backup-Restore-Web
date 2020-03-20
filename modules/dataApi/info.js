
$(function() {
	$('#roleAuthTab a').click(function(e) {
		e.preventDefault();
		$(this).tab('show');
	});
	
	$('#import').click(function(){
        $('#importUserBtjt').modal('show');
    })
    
    $('#export').click(function(){
    	var url = portalURL + "/sys/user/export";
		submitUrlForm(url);
    })
	
    $('#uploadUserBtjt').click(function(){
		if($('#uploadFile').val().length <= 0 ){
			 alert('请先上传excel文件');
			 return;
		 }else{
			 	if($('#uploadFile').val().length > 0 ){
					    	    var file = $('#uploadFile').val();
								 var fileExt=file.replace(/.+\./,"").toLowerCase();
								 if( ! (fileExt == 'xls' || fileExt == 'xlsx') ){
									 alert('请上传文件扩展名为xls或xlsx')
									 return;
								 }
				};
				$.ajax({
		                type: 'post',
		                url: portalURL +'sys/user/import',
		                data: new FormData($('#upformRpt')[0]),
		                cache: false,
		                processData: false,
		                contentType: false,
		                dataType:'json'
		            }).success(function (data) {
		                if(data.code == 0){
		                	alert('上传成功');
		                	vm.reload();
		                }
		            });
		 }
	})
    
    $("#downExcel").click(function(){
		var url = portalURL + "/sys/user/downExcel";
		submitUrlForm(url);
	});
	function useridFormatter(value, options, row) {
		var result = "Exception";
		$.ajax({
			type : "get",
			async : false,
			url : portalURL + "sys/user/info/" + value,
			contentType : "application/json",
			data : value,
			success : function(r) {
				if (r.code == 0) {
					result = r.user.nickname;
				} else {

				}
			}
		});
		return result;
	}
});

var vm = new Vue({
	el : '#rrapp',
	data : {
		q : {
			fldnm : null
		},
		showPassword : true,
		showList : true,
		showColumn : true,
		title : null,
		roleList : {},
		departmentList : {},
		itemList:[],  //define select control  list
		itemDeptList:[],  //define select control  list
		user : {
			orgId : 1,
			status : 1,
			orgShtNm : null,
			roleId: '',  //默认未空,则选择框会自动默认为请选择
			roleIdList : [],
			departmentId: '',  //默认未空,则选择框会自动默认为请选择
			departmentIdList : []
		}
	},
	created: function() {
        this.getRoleList(); 
        this.getDepartmentList(); 
    },
	methods : {
		getRoleList: function() {
            $.getJSON(portalURL + "sys/role/list", null, function(data){
            	vm.itemList  = data.page.list;
            });
        },
        getDepartmentList: function() {
            $.getJSON(portalURL + "sys/department/list", null, function(data){
            	vm.itemDeptList  = data.list;
            });
        },
		query : function() {
			vm.reload();
		},
		add : function() {
			vm.showPassword = true;
			vm.showList = false;
			vm.showColumn = true;
			vm.title = "新增";
			vm.roleList = {};
			vm.departmentList = {};
			vm.user = {
				status : 0,
				lockStatus : '0',
				source : '0',
				roleIdList : [],
				departmentIdList : [],
				orgId : null,
				orgShtNm : null,
				roleId:"0",
				departmentId:"",
				username:"",
				password:"",
				password2:"",
				nickname:"",
				mobile:""
			};
			vm.getOrg();
		},
		update : function() {
			var userId = getSelectedRow('#table');
			if (userId == null) {
				return;
			}
			vm.showPassword = false;
			vm.showList = false;
			vm.showColumn = true;
			vm.title = "修改";
			vm.getUser(userId);
		},
		del : function() {
			var userIds = getSelectedRows('#table');
			if (userIds == null) {
				return;
			}

			confirm('确定要删除选中的记录？', function() {
				$.ajax({
					type : "POST",
					url : portalURL + "info/delete",
					contentType : "application/json",
					data : JSON.stringify(userIds),
					success : function(r) {
						if (r.code == 0) {
							alert('操作成功', function() {
								vm.reload();
							});
						} else {
							alert(r.msg);
						}
					}
				});
			});
		},
		reset : function() {
			var userId = getSelectedRow('#table');
			if (userId == null) {
				return;
			}

			vm.showPassword = true;
			vm.showList = false;
			vm.showColumn = false;
			vm.title = "重置密码";

			vm.getUser(userId);
		},
		saveOrUpdate : function() {
			console.log(vm.user);
			if (vm.validator()) {
				return;
			}

			var url = "sys/user/save";
			if (vm.user.userId == null) {
				url = "sys/user/save";
			} else if (vm.user.userId != null && !vm.showPassword) {
				url = "sys/user/update";
			} else if (vm.user.userId != null && vm.showPassword) {
				url = "sys/user/reset";
			}
			
			$.ajax({
				type : "POST",
				url : portalURL + url,
				contentType : "application/json",
				data : JSON.stringify(vm.user),
				success : function(r) {
					if (r.code === 0) {
						alert('操作成功', function() {
							vm.reload();
						});
					} else {
						alert(r.msg);
					}
				}
			});
		},
		
		getUser : function(userId) {
			$.get(portalURL + "sys/user/info/" + userId, function(r) {
				console.log(r);
				vm.user = r.user;
				vm.user.password = null;
				vm.user.department = r.user.departmentid;
				vm.getOrg();
			});
		},
		reload : function() {
			vm.showList = true;
			$('#table').bootstrapTable("refresh");
		},
		validator : function() {
			var msg="";
			console.log(vm.user);
			if (isBlank(vm.user.fldnm)) {
				msg+="登录账号不能为空<br>";
			}
			if (vm.user.userId == null && isBlank(vm.user.password)) {
				msg+="密码不能为空<br>";
			}
			if (vm.user.password != null && vm.user.password!=vm.user.password2) {
				msg+="两次输入密码不一致<br>";
			}
			if (isBlank(vm.user.nickname)) {
				msg+="用户名不能为空<br>";
			}
			if (isBlank(vm.user.roleId)) {
				msg+="角色不能为空<br>";
			}
			if (isBlank(vm.user.department)) {
				msg+="部门不能为空<br>";
			}
			if (isBlank(vm.user.orgShtNm)) {
				msg+="公司不能为空<br>";
			}
			if(vm.user.username != null && !isBlank(vm.user.username) ){
				$.ajax({
			    	url: portalURL + '/sys/user/validator',
			        type: "GET",
			        async: false,
			        data:{
			        	username : vm.user.username.toLowerCase(),
			        	userId : vm.user.userId
			        },
			        success: function(r) {
			        	console.log(r);
			        	if(r.code != 0 ){
			        		msg += '该登录帐号已存在！';
			        	}
			        }
			    });
			}
			
			if(msg!=""){
				alert(msg);
				return true;
			}
		},
	}
});

function authorizedUserOperation(userId) {
	var currentUrl = $("#UserRoleJqGrid").getGridParam("url");
	if (currentUrl == null) {
		$("#UserRoleJqGrid").jqGrid({
			url : portalURL + 'sys/role/queryAuthorizedListByRole',
			datatype : "json",
			colModel : [ {
				label : '目录主键',
				name : 'roleId',
				index : "roleId",
				width : 45,
				key : true,
				hidden : true
			}, {
				label : '角色名',
				name : 'roleName',
				width : 550
			} ],
			viewrecords : true,
			height : 385,
			rowNum : 10,
			rowList : [ 10, 30, 50 ],
			rownumbers : true,
			rownumWidth : 40,
			autowidth : true,
			toolbar : [ true, "top" ],
			multiselect : true,
			pager : "#UserRoleJqGridPager",
			jsonReader : {
				root : "page.list",
				page : "page.currPage",
				total : "page.totalPage",
				records : "page.totalCount"
			},
			postData : {
				userId : userId
			},
			prmNames : {
				page : "page",
				rows : "limit",
				order : "order"
			},
			gridComplete : function() {
				//隐藏grid底部滚动条
				$("#UserRoleJqGrid").closest(".ui-jqgrid-bdiv").css({
					"overflow-x" : "hidden"
				});
			}
		});

		$("#t_UserRoleJqGrid")
		.append(
			"&nbsp;<a v-if=\"hasPermission('sys:role:save')\" class=\"btn btn-primary\" onClick=\"queryAuthoriedUser();\"><i class=\"fa fa-eye\"></i>&nbsp;查询</a>");
		$("#t_UserRoleJqGrid")
		.append(
			"&nbsp;<a v-if=\"hasPermission('sys:role:save')\" class=\"btn btn-primary\" onClick=\"addAuthoriedUser();\"><i class=\"fa fa-plus\"></i>&nbsp;新增</a>");
		$("#t_UserRoleJqGrid")
		.append(
			"&nbsp;<a v-if=\"hasPermission('sys:role:delete')\" class=\"btn btn-primary\" onClick=\"deleteAuthriedUser();\"><i class=\"fa fa-trash-o\"></i>&nbsp;删除</a>");
		$("#UserRoleJqGrid").jqGrid("filterToolbar", "autosearch");
	} else {

		$("#UserRoleJqGrid").setGridParam({
			postData : {
				userId : userId
			}
		}).trigger("reloadGrid");
	}
}

function queryAuthoriedUser() {

	$("#UserRoleJqGrid")[0].triggerToolbar();
}

function deleteAuthriedUser() {
	if (getSelectedRowByUserRole() == false) {
		alert("请选择一条记录");
		return;
	}
	;

	var userId = getSelectedRow('#table');
	if (userId == null || userId == false) {
		return;
	}
	var roleId = $("#UserRoleJqGrid").jqGrid('getGridParam', 'selarrrow');
	if (roleId == null) {
		return;
	}

	confirm('确定要删除选中的记录？', function() {
		$.ajax({
			type : "POST",
			url : portalURL + "sys/role/deleteRoleByUser/" + userId,
			contentType : "application/json",
			data : JSON.stringify(roleId),
			success : function(r) {
				if (r.code == 0) {
					alert('操作成功', function() {
						//vm.reload();
						$("#UserRoleJqGrid").trigger("reloadGrid");
					});
				} else {
					alert(r.msg);
				}
			}
		});
	});
}

//选择一条记录
function getSelectedRowByUserRole() {
	var grid = $("#UserRoleJqGrid");
	var rowKey = grid.getGridParam("selrow");
	if (!rowKey) {

		return false;
	}
}

function addAuthoriedUser() {
	var UserId = getSelectedRow('#table');
	if (UserId == null || UserId == false) {
		return;
	}
	addUserOperation(UserId);
	layer.open({
		type : 1,
		offset : '50px',
		skin : 'layui-layer-molv',
		title : "可选角色组",
		area : [ '650', '550px' ],
		shade : 0.5,
		shadeClose : false,
		content : jQuery("#addUserRoleLayer"),
		btn : [ '确定', '取消' ],
		btn1 : function(index) {
			saveUnauthorizUser(UserId, layer, index);
		},
		btn2 : function(index) {
			layer.close(index);
		},
	});
}

function addUserOperation(userId) {
	var currentUrl = $("#addUserRoleJqGrid").getGridParam("url");
	if (currentUrl == null) {
		$("#addUserRoleJqGrid").jqGrid({
			url : portalURL + 'sys/role/queryListByUserUnCatalog',
			datatype : "json",
			colModel : [ {
				label : '目录主键',
				name : 'roleId',
				index : "roleId",
				width : 45,
				key : true,
				hidden : true
			}, {
				label : '角色名',
				name : 'roleName',
				width : 550
			} ],
			viewrecords : true,
			height : 385,
			rowNum : 10,
			rowList : [ 10, 30, 50 ],
			toolbar : [ true, "top" ],
			rownumbers : true,
			rownumWidth : 40,
			autowidth : true,
			//toolbar:[true,"top"],
			multiselect : true,
			pager : "#addUserRoleJqGridPager",
			jsonReader : {
				root : "page.list",
				page : "page.currPage",
				total : "page.totalPage",
				records : "page.totalCount"
			},
			postData : {
				userId : userId
			},
			prmNames : {
				page : "page",
				rows : "limit",
				order : "order"
			},
			gridComplete : function() {
				//隐藏grid底部滚动条
				$("#addUserRoleJqGrid").closest(".ui-jqgrid-bdiv").css({
					"overflow-x" : "hidden"
				});
			}
		});
		//$("#t_addUserJqGrid").append("&nbsp;<a v-if=\"hasPermission('sys:role:save')\" class=\"btn btn-primary\" onClick=\"saveAuthriedUser();\"><i class=\"fa fa-check\"></i>&nbsp;确定</a>");

		$("#t_addUserRoleJqGrid")
		.append(
			"&nbsp;<a v-if=\"hasPermission('sys:role:save')\" class=\"btn btn-primary\" onClick=\"queryAddAuthoriedUserRole();\"><i class=\"fa fa-eye\"></i>&nbsp;查询</a>");

		$("#addUserRoleJqGrid").jqGrid("filterToolbar", "autosearch");
	} else {

		$("#addUserRoleJqGrid").setGridParam({
			postData : {
				userId : userId
			}
		}).trigger("reloadGrid");
	}
}

function queryAddAuthoriedUserRole() {

	$("#addUserRoleJqGrid")[0].triggerToolbar();
}

function saveUnauthorizUser(userId, layer, index) {
	var roleIds = $("#addUserRoleJqGrid").jqGrid('getGridParam', 'selarrrow');
	if (roleIds == null) {
		return;
	}

	confirm('确定要添加选中的角色吗？', function() {
		$.ajax({
			type : "POST",
			url : portalURL + "sys/role/saveRoleByUser/" + userId,
			contentType : "application/json",
			data : JSON.stringify(roleIds),
			success : function(r) {
				if (r.code == 0) {
					alert('操作成功', function() {
						//vm.reload();
						$("#UserRoleJqGrid").trigger("reloadGrid");
						layer.close(index);
					});
				} else {
					alert(r.msg);
				}
			}
		});
	});
}


function reloadDataTree() {
	
	var userId = getSelectedRow('#table');

	if(userId == null){
		return ;
	}
	vm.getDataTree(roleAuthTabhref,userId,$("#queryname").val());
}

function reloadDataAuthTree() {
	
	var userId = getSelectedRow('#table');

	if(userId == null){
		return ;
	}
	vm.getAuthDataTree(roleAuthTabhref,userId,$("#querydname").val());
}

//递归去除选中节点的子类节点(除了已经被选中的)
function cancelChecked(node){

    if(node.isParent){//判断是否为父节点
        if(node.zAsync){//判断该节点是否异步加载过子节点（有木有展开）

        	zTree = $.fn.zTree.getZTreeObj("menuTree");
        	var childs = node.children;    
        	for(var i=0;i<childs.length;i++){
                zTree.checkNode(childs[i],false,false);//取消子节点的选中
                cancelChecked(childs[i]);
            }
        }
    }
}
//递归去除父类节点的的选中(除了已经被选中的)
function cancelParentNodeChecked(node){
	
	var bo=true;
	zTree = $.fn.zTree.getZTreeObj("menuTree");
	if(node.getParentNode()){
		var treeObj = $.fn.zTree.getZTreeObj("menuTree");
		var nodes = treeObj.getCheckedNodes(true);

		for(var i=0;i<nodes.length;i++){
			if(nodes[i].tId==node.getParentNode().tId){
				bo= false;
			}
		}
		if(bo){

			zTree.checkNode(node.getParentNode(),false,false);
		}

		cancelParentNodeChecked(node.getParentNode());
	}
}
//新增授权
function saveAuthData(){
	var userId = getSelectedRow('#table');
	
	var nodesData = ztreeMenu.getCheckedNodes();
	var dataIdList = new Array();
	for(var i=0; i<nodesData.length; i++) {
			//最底层节点，且它的父节点不是选中状态的才要
			dataIdList.push(nodesData[i].dataId);
		}
		data={userId:userId,v_sys_id:roleAuthTabhref,dataIdList:dataIdList};
		if(dataIdList.length<1){
			alert("请选择一条未授权权限");
			return;
		}
		confirm('确定要新增选中的权限？', function() {
			$.ajax({
				type : "POST",
				url : portalURL + "/sys/authData/saveAuthData",
				contentType : "application/json",
				data : JSON.stringify(data),
				success : function(r) {
					if (r.code == 0) {
						alert('操作成功', function() {
						//vm.reload();
						
						vm.getDataTree(roleAuthTabhref,userId,null);
						vm.getAuthDataTree(roleAuthTabhref,userId,null);
					});
					} else {
						alert(r.msg);
					}
				}
			});
		});

	}



//删除授权
function deleteAuthData(){
	var userId = getSelectedRow('#table');
	
	var nodesData = ztreeMenuAuth.getCheckedNodes();
	var catalogIds = new Array();
	for(var i=0; i<nodesData.length; i++) {
			//最底层节点，且它的父节点不是选中状态的才要
			catalogIds.push(nodesData[i].dataId);
		}
		data={n_user_id:userId,v_sys_id:roleAuthTabhref,catalogIds:catalogIds};
		if(catalogIds.length<1){
			alert("请选择一条已授权权限");
			return;
		}
		confirm('确定移除选中的权限？', function() {
			$.ajax({
				type : "POST",
				url : portalURL + "/sys/authData/deleteAuthData",
				contentType : "application/json",
				data : JSON.stringify(data),
				success : function(r) {
					if (r.code == 0) {
						alert('操作成功', function() {
						//vm.reload();
						
						vm.getDataTree(roleAuthTabhref,userId,null);
						vm.getAuthDataTree(roleAuthTabhref,userId,null);
					});
					} else {
						alert(r.msg);
					}
				}
			});
		});

	}



//设置默认授权
function saveDefaultAuthData(){
	var userId = getSelectedRow('#table');
	var nodesData = ztreeMenuAuth.getCheckedNodes();

	if(nodesData.length<1){
		alert("请选择一条已授权权限");
		return;
	}

	if(nodesData.length>1){
		alert("只能选择一条已授权权限");
		return;
	}
	var v_org_id= nodesData[0].dataId
	data={n_user_id:userId,v_sys_id:roleAuthTabhref,v_org_id:v_org_id};
	confirm('确定设置选中的权限为默认？', function() {
		$.ajax({
			type : "POST",
			url : portalURL + "/sys/authData/saveDefaultAuthData",
			contentType : "application/json",
			data : JSON.stringify(data),
			success : function(r) {
				if (r.code == 0) {
					alert('操作成功', function() {
						//vm.reload();
						vm.getDataTree(roleAuthTabhref,userId,null);
						vm.getAuthDataTree(roleAuthTabhref,userId,null);
					});
				} else {
					alert(r.msg);
				}
			}
		});
	});
	
}

