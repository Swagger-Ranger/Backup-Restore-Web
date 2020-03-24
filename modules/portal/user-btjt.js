var ztreeMenu;
var ztreeMenuAuth;
var roleAuthTabhref;//系统代码

$(function() {
  $('#password').showPassword('focus').showPassword(false)
  .on('hideShowPasswordInit', function(){
    console.log('plugin initialized');
  })
  .on('passwordVisibilityChange', function(){
    console.log('password shown or hidden');
  })
  .on('passwordShown', function(){
    console.log('password shown');
  })
  .on('passwordHidden', function(){
    console.log('password hidden');
  });

  $('#password').hideShowPassword(false); 
});

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
var data_setting = {
	data : {
		simpleData : {
			enable : true,
			idKey : "dataId",
			pIdKey : "parentId",
			rootPId : -1
		},
		key : {
			url : "nourl"
		}
	},
	check : {
		enable : true,
		nocheckInherit : true,
		chkboxType : { "Y" : "","N" : ""}
	},
	callback : {
		onCheck : menuTreeOnCheck
	}
};

var data_auth_setting = {
	data : {
		simpleData : {
			enable : true,
			idKey : "dataId",
			pIdKey : "parentId",
			rootPId : -1
		},
		key : {
			url : "nourl"
		}
	},
	check : {
		enable : true,
		nocheckInherit : true,
		chkboxType : { "Y" : "","N" : ""}
	}
};

function menuTreeOnCheck(event, treeId, treeNode) {
	//$.fn.zTree.destroy("menuAuthTree");
	//cancelParentNodeChecked(treeNode);
	//cancelChecked(treeNode);
	//vm.reloadDataAuthTree();
}

var setting = {
	data : {
		simpleData : {
			enable : true,
			idKey : "orgId",
			pIdKey : "parentId",
			rootPId : 0
		},
		key : {
			url : "nourl"
		}
	}
};
var ztree;
var vm = new Vue({
	el : '#rrapp',
	data : {
		q : {
			username : null,
			status:"all"
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
			gender : "male",
			roleId: '',  //默认未空,则选择框会自动默认为请选择
			roleIdList : [],
			departmentId: '',  //默认未空,则选择框会自动默认为请选择
			departmentIdList : []
		},
		org : {
			orgShtNm : null,
		}
	},
	created: function() {
        this.getRoleList(); 
        this.getDepartmentList(); 
	},
	methods : {
		initRoleMultipleSelect: function () {
			$('#roleId').multiselect({nonSelectedText: '请选择'});
			$('#roleId').val('');	
			$("#roleId").multiselect("refresh");
		},
		getRoleList: function() {
            $.getJSON(portalURL + "sys/role/list", null, function(data){
				vm.itemList  = data.page.list;
            });
        },
        // getDepartmentList: function() {
        //     $.getJSON(portalURL + "sys/department/list", null, function(data){
        //     	console.log(data);
        //     	vm.itemDeptList  = data.list;
        //     });
        // },
		query : function() {
			vm.reload();
		},
		getOrg : function() {
			//加载菜单树
			$.get(portalURL + "sys/org/select", function(r) {
				ztree = $.fn.zTree.init($("#orgTree"), setting, r.orgList);
				var node = ztree.getNodeByParam("orgId", vm.user.orgId);
				ztree.selectNode(node);
				if(node!=null){
					console.log(node.name);
					vm.org.orgShtNm = node.name;
				}
			});
		},
		add : function() {
			this.initRoleMultipleSelect();
			
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
				roleId:"0",
				departmentId:"",
				username:"",
				password:"",
				// password2:"",
				nickname:"",
				mobile:"",
				gender:"male"
			};
			vm.org = {
				orgShtNm : null,
			};
			vm.getOrg();
		},
		update : function() {
			this.initRoleMultipleSelect();
			var userId = getSelectedRow('#table','userId');
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
			var userIds = getSelectedRows('#table','userId');
			if (userIds == null) {
				return;
			}

			confirm('确定要删除选中的记录？', function() {
				$.ajax({
					type : "POST",
					url : portalURL + "sys/user/delete",
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
			var userId = getSelectedRow('#table','userId');
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
			vm.user.roleIdList = $("#roleId").val();
			console.log(vm.user);
			// if (vm.validator()) {
			// 	return;
			// }

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
		roleClick : function() {
			layer.open({
				type : 1,
				offset : '50px',
				title : "选择角色",
				area : [ '300px', '450px' ],
				shade : 0,
				shadeClose : false,
				content : $("#roleLayer"),
				btn : [ '确定', '取消' ],
				btn1 : function(index) {             
					vm.user.roleId = this.$refs.mybox.val();
					layer.close(index);
				}
			});
		},
		orgTree : function() {
			layer.open({
				type : 1,
				offset : '50px',
				title : "选择组织",
				area : [ '400px', '450px' ],
				shade : 0,
				shadeClose : false,
				content : $("#orgLayer"),
				btn : [ '确定', '取消' ],
				btn1 : function(index) {
					var node = ztree.getSelectedNodes();
					console.log(node);
					//选择上级菜单               
					vm.user.orgId = node[0].orgId;
					vm.org.orgShtNm = node[0].name;

					layer.close(index);
				}
			});
		},
		getUser : function(userId) {
			$.get(portalURL + "sys/user/info/" + userId, function(r) {
				console.log(r);
				$('#roleId').multiselect('select',r.user.roleIdList);
				
				vm.user = r.user;
				vm.user.password = null;
				vm.user.department = r.user.departmentid;
				vm.user.gender = r.user.gender.val;
				vm.getOrg();
			});
		},
		reload : function() {
			vm.showList = true;
			//$('#password').password('hide');
			$('#password').hideShowPassword(false);

			$('#table').bootstrapTable("refresh");
		},
		validator : function() {
			var msg="";
			console.log(vm.user);
			var me = /^[A-Za-z0-9]{0,8}$/,
                me1 = /^[\u4e00-\u9fa5]{0,8}$/,
                me2 = /^[A-Za-z0-9\u4e00-\u9fa5]{0,8}$/,
                me3 = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
            if(!me.test(vm.user.username) && !me1.test(vm.user.username) && !me2.test(vm.user.username)){
                msg+="登录账号不能太长<br>";
            }
            var m = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@&%#_])[a-zA-Z0-9~!@&%#_]{6,12}$/;
            if(!m.test(vm.user.password)){
            	msg+="请输入包含特殊字符+大小写字母+数字的6-12位密码<br>";
            }
            if(!me.test(vm.user.nickname) && !me1.test(vm.user.nickname) && !me2.test(vm.user.nickname)){
                msg+="用户名不能太长<br>";
            }
			//console.log("password:"+vm.user.password);
			//console.log("password2:"+vm.user.password2);
			/*if (isBlank(vm.user.username)) {
				msg+="登录账号不能为空<br>";
			}*/
			if (vm.user.userId == null && isBlank(vm.user.password)) {
				msg+="密码不能为空<br>";
			}
			// if (vm.user.password != null && vm.user.password!=vm.user.password2) {
			// 	msg+="两次输入密码不一致<br>";
			// }
			if (isBlank(vm.user.nickname)) {
				msg+="用户名不能为空<br>";
			}
			if (isBlank(vm.user.roleId)) {
				msg+="角色不能为空<br>";
			}
			// if (isBlank(vm.user.department)) {
			// 	msg+="部门不能为空<br>";
			// }
			if (isBlank(vm.org.orgShtNm)) {
				msg+="组织机构不能为空<br>";
			}
			if(vm.user.mobile == null && !me3.test(vm.user.mobile)){
				msg+="手机号码格式不对<br>";
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
	  //       if(isBlank(vm.user.email)){
	  //           alert("邮箱不能为空");
	  //           return true;
	  //       }
	  //       if(!validator.isEmail(vm.user.email)){
	  //           alert("邮箱格式不正确");
	  //           return true;
			// }
		},
		authorizedUser : function() {
			var roleId = getSelectedRow('#table','roleId');

			if (roleId == null || roleId == false) {
				return;
			}
			authorizedUserOperation(roleId);
			layer
			.open({
				type : 1,
				offset : '50px',
				skin : 'layui-layer-molv',
				title : "角色授权（当前被授权用户："
				+ getSelectedRowField("username") + "）",
				area : [ '650px', '550px' ],
				shade : 0.5,
				shadeClose : false,
				content : jQuery("#UserRoleLayer"),
				btn : [ '确定' ],
				btn1 : function(index) {
					layer.close(index);
				}
			});
		},
		getDataTree : function(vSysId,userId,name) {
			/*			if(vm.q.menuname==undefined){
							vm.q.menuname=null;
						}*/
						$('.tab-content .middleIcon1').hide();
			//加载菜单树
			$.post(portalURL + "sys/authData/queryDataTreeList",{vSysId:vSysId,name:name,duserId:userId}, function(r) {
				ztreeMenu = $.fn.zTree.init($("#menuTree"), data_setting, r);
				//展开所有节点
				ztreeMenu.expandAll(false);
		/*	if (userId != null) {
					vm.getAuthDataTree(vSysId,userId);
				}*/
			});
		},
		
		getAuthDataTree: function(vSysId,userId,name){

			$.post(portalURL + "sys/authData/queryCheckedDataTreeList",{vSysId:vSysId,userId:userId,name:name}, function(r){

				ztreeMenuAuth = $.fn.zTree.init($("#menuAuthTree"),
					data_auth_setting, r);
				ztreeMenuAuth.expandAll(true);
            	/*
          
                //勾选角色所拥有的菜单
    			var menuIds =r;
    			for(var i=0; i<menuIds.length; i++) {
    				var node = ztreeMenu.getNodeByParam("dataId", menuIds[i].dataId);
    				//选中父节点-----begin-----
    				if(node != null){
        				var pNode1 = node.getParentNode();
        				if(pNode1 != null){
        					//有些父节点没保存到数据库，这里返显
            				ztreeMenu.checkNode(pNode1, true, false);
            				var pNode2 = pNode1.getParentNode();
            				if(pNode2 != null){
                				ztreeMenu.checkNode(pNode2, true, false);
                				var pNode3 = pNode2.getParentNode();
                				if(pNode3 != null){
                    				ztreeMenu.checkNode(pNode3, true, false);
                    				var pNode4 = pNode3.getParentNode();
                    				if(pNode4 != null){
                        				ztreeMenu.checkNode(pNode4, true, false);
                        				var pNode5 = pNode4.getParentNode();
                        				if(pNode5 != null){
                            				ztreeMenu.checkNode(pNode5, true, false);
                        				}
                    				}
                				}
            				}
        				}
        				ztreeMenu.checkNode(node, true, false);
    				}//选中父节点-----end-----
    			}
    		$("#dataTree").mLoading("hide"); 
    			vm.reloadDataAuthTree();
    		*/});

		},
		
		getAuthSysAll: function(userId) {
			//$("#dataTree").mLoading("show");  
			//查询所有系统
			$.get(portalURL + "sys/authData/listByUserId", function(r) {
				$.fn.zTree.destroy("menuAuthTree");
				$("#roleAuthTab").find("li").remove();	
				$.each(r.list,function(i,item){  //遍历二维数组
					if(i==0){
						$("#roleAuthTab").append('<li class="active"><a href="'+item.vsysId+'" data-toggle="tab">'+item.vsysName+'</a></li>');

			
		}else{
			$("#roleAuthTab").append('<li class=""><a href="'+item.vsysId+'" data-toggle="tab">'+item.vsysName+'</a></li>');
		}



	});
				
				
				vm.getDataTree($('#roleAuthTab a').eq(0).attr("href"),userId,null);
				vm.getAuthDataTree($('#roleAuthTab a').eq(0).attr("href"),userId,null);
				$('#roleAuthTab a').click(function(e) {
					e.preventDefault();
					$(this).tab('show');
					roleAuthTabhref=$(this).attr("href");
					
					vm.getDataTree($(this).attr("href"),userId,null);
					vm.getAuthDataTree($(this).attr("href"),userId,null);
					

				});
			});
			//$("#dataTree").mLoading("hide"); 
		},
		reloadDataAuthTree : function() {
			var nodes = ztreeMenu.getCheckedNodes(true);
			//js必须这样extend，否则会影响原来的nodes
			var authNodes = $.extend(true, [], nodes);
			for (var i = 0, l = authNodes.length; i < l; i++) {
				//delete掉子孙children，因为getCheckedNodes已经把所有选中的子孙放到第一级
				delete authNodes[i].children;
				
			}
			$('.tab-content .middleIcon1').show();
			ztreeMenuAuth = $.fn.zTree.init($("#menuAuthTree"),
				data_auth_setting, authNodes);
			ztreeMenuAuth.expandAll(true);
			ztreeMenuAuth.checkAllNodes(false);
			ztreeMenuAuth.cancelSelectedNode();
		},
		authorizedUserData : function() {
			var UserId = getSelectedRow('#table','userId');

			if (UserId == null || UserId == false) {
				return;
			}
			vm.getAuthSysAll(UserId);
			layer
			.open({
				type : 1,
				offset : '50px',
				skin : 'layui-layer-molv',
				title : "数据授权（当前被授权用户："
				+ getSelectedRowField("username") + "）",
				area : [ '1100px', '550px' ],
				shade : 0.5,
				shadeClose : false,
				content : jQuery("#UserDataLayer"),
						//btn : [ '确定' ],
						btn1 : function(index) {
							layer.close(index);
						}
					});
		}

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

	var userId = getSelectedRow('#table','userId');
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
	var UserId = getSelectedRow('#table','userId');
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
	
	var userId = getSelectedRow('#table','userId');

	if(userId == null){
		return ;
	}
	vm.getDataTree(roleAuthTabhref,userId,$("#queryname").val());
}

function reloadDataAuthTree() {
	
	var userId = getSelectedRow('#table','userId');

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
	var userId = getSelectedRow('#table','userId');
	
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
	var userId = getSelectedRow('#table','userId');
	
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
	var userId = getSelectedRow('#table','userId');
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

