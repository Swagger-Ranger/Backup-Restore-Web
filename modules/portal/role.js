$(function () {
	$('#roleAuthTab a:first').tab('show');
	$('.middleIcon').hide();
	$('#roleAuthTab a').click(function (e) {
		  e.preventDefault();
		  $(this).tab('show');
	})
});

var menu_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "menuId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:true,
		nocheckInherit:true
	},
	callback: {
		onCheck: menuTreeOnCheck
	}
};
var menu_auth_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "menuId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:false,
		nocheckInherit:true
	}
};
var user_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:true,
		nocheckInherit:true
	},
	callback: {
		onCheck: userTreeOnCheck
	}
};
var user_auth_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "pId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:false,
		nocheckInherit:true
	}
};

var data_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "dataId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:true,
		nocheckInherit:true
	},
	callback: {
		onCheck: dataTreeOnCheck
	}
};
var data_auth_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "dataId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:false,
		nocheckInherit:true
	}
};
var nav_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "menuId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:true,
		nocheckInherit:true
	},
	callback: {
		onCheck: navTreeOnCheck
	}
};
var nav_auth_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "menuId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:false,
		nocheckInherit:true
	}
};
var res_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "pid",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:true,
		nocheckInherit:true
	},
	callback: {
		onCheck: resTreeOnCheck
	}
};
var res_auth_setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "pid",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:false,
		nocheckInherit:true
	}
};
var ztreeMenu;
var ztreeMenuAuth;
var ztreeUser;
var ztreeUserAuth;
var ztreeData;
var ztreeDataAuth;
var ztreeNav;
var ztreeNavAuth;
var ztreeRes;
var ztreeResAuth;

function menuTreeOnCheck(event, treeId, treeNode){
//	console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
	$.fn.zTree.destroy("menuAuthTree");
	vm.reloadMenuAuthTree();
}
function userTreeOnCheck(event, treeId, treeNode){
	$.fn.zTree.destroy("userAuthTree");
	vm.reloadUserAuthTree();
}
function dataTreeOnCheck(event, treeId, treeNode){
	$.fn.zTree.destroy("dataAuthTree");
	vm.reloadDataAuthTree();
}
function navTreeOnCheck(event, treeId, treeNode){
	$.fn.zTree.destroy("ztreeNavAuth");
	vm.reloadNavAuthTree();
}
function resTreeOnCheck(event, treeId, treeNode){
	$.fn.zTree.destroy("ztreeResAuth");
	vm.reloadResAuthTree();
}

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			roleName: null
		},
		showList: true,
		title:null,
		actionModel:null,
		role:{
			remark: ''
		}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.actionModel='add';
			vm.role = {
				remark: ''
			};
			vm.clearAllTree();
			vm.getMenuTree(null);
			vm.getUserTree(null);
			vm.getDataTree(null);
			vm.getNavTree(null);
			vm.getResTree(null);
		},
		update: function () {
			var roleId = getSelectedRow("#table","roleId");
			if(roleId == null){
				return ;
			}
			vm.clearAllTree();
			vm.showList = false;
            vm.title = "修改";
            vm.actionModel='update';
            vm.getMenuTree(roleId);
            vm.getUserTree(roleId);
            vm.getDataTree(roleId);
            vm.getNavTree(roleId);
            vm.getResTree(roleId);
		},
		editMenu: function () {
			var roleId = getSelectedRow("#table","roleId");
			if(roleId == null){
				return ;
			}
			vm.clearAllTree();
			vm.showList = false;
            vm.title = "修改";
            vm.actionModel='editMenu';
            vm.getMenuTree(roleId);
            vm.getUserTree(roleId);
            vm.getDataTree(roleId);
            vm.getNavTree(roleId);
            vm.getResTree(roleId);
		},
		del: function () {
			var roleIds = getSelectedRows("#table","roleId");
			if(roleIds == null){
				return ;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: portalURL + "sys/role/delete",
                    contentType: "application/json",
				    data: JSON.stringify(roleIds),
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
		// editmenu: function(){
		// 	vm.showList = false;
		// 	vm.title = "新增";
		// 	vm.actionModel='add';
		// 	vm.role = {};
		// 	vm.clearAllTree();
		// 	vm.getMenuTree(null);
		// 	vm.getUserTree(null);
		// 	vm.getDataTree(null);
		// 	vm.getNavTree(null);
		// 	vm.getResTree(null);
		// },
		
		clearAllTree: function(){
			$.fn.zTree.destroy("menuTree");
			$.fn.zTree.destroy("userTree");
			$.fn.zTree.destroy("dataTree");
			$.fn.zTree.destroy("navTree");
			$.fn.zTree.destroy("resTree");
			$.fn.zTree.destroy("menuAuthTree");
			$.fn.zTree.destroy("userAuthTree");
			$.fn.zTree.destroy("dataAuthTree");
			$.fn.zTree.destroy("navAuthTree");
			$.fn.zTree.destroy("resAuthTree");
		},
		getNavRole: function(roleId){
			$.ajax({
		        type : "GET",
		        url: portalURL + 'sys/role/powerIdList', // 接口 URL 地址
		        contentType : "application/json",
		        data : {roleId:roleId,type:"sys_navigation"},
		        success:function(r) {
		        console.log(r);
            	vm.role = r.role;
            	
                //勾选角色所拥有的菜单
    			var menuIds = vm.role.menuIdList;
    			for(var i=0; i<menuIds.length; i++) {
    				var node = ztreeNav.getNodeByParam("menuId", menuIds[i]);
    				//选中父节点-----begin-----
    				if(node != null){
        				var pNode1 = node.getParentNode();
        				if(pNode1 != null){
        					//有些父节点没保存到数据库，这里返显
            				ztreeNav.checkNode(pNode1, true, false);
            				var pNode2 = pNode1.getParentNode();
            				if(pNode2 != null){
                				ztreeNav.checkNode(pNode2, true, false);
                				var pNode3 = pNode2.getParentNode();
                				if(pNode3 != null){
                    				ztreeNav.checkNode(pNode3, true, false);
                    				var pNode4 = pNode3.getParentNode();
                    				if(pNode4 != null){
                        				ztreeNav.checkNode(pNode4, true, false);
                        				var pNode5 = pNode4.getParentNode();
                        				if(pNode5 != null){
                            				ztreeNav.checkNode(pNode5, true, false);
                        				}
                    				}
                				}
            				}
        				}
        				ztreeNav.checkNode(node, true, false);
    				}//选中父节点-----end-----
    			}
    			vm.reloadNavAuthTree();
    			}
    		});
		},
		getResRole: function(roleId){
			$.ajax({
		        type : "GET",
		        url: portalURL + 'sys/role/powerIdList', // 接口 URL 地址
		        contentType : "application/json",
		        data : {roleId:roleId,type:"sys_resources"},
		        success:function(r) {
		        console.log(r);
            	vm.role = r.role;
            	
                //勾选角色所拥有的菜单
    			var menuIds = vm.role.menuIdList;
    			for(var i=0; i<menuIds.length; i++) {
    				var node = ztreeRes.getNodeByParam("id", menuIds[i]);
    				console.log(node);
    				//选中父节点-----begin-----
    				if(node != null){
        				var pNode1 = node.getParentNode();
        				if(pNode1 != null){
        					//有些父节点没保存到数据库，这里返显
            				ztreeRes.checkNode(pNode1, true, false);
            				var pNode2 = pNode1.getParentNode();
            				if(pNode2 != null){
                				ztreeRes.checkNode(pNode2, true, false);
                				var pNode3 = pNode2.getParentNode();
                				if(pNode3 != null){
                    				ztreeRes.checkNode(pNode3, true, false);
                    				var pNode4 = pNode3.getParentNode();
                    				if(pNode4 != null){
                        				ztreeRes.checkNode(pNode4, true, false);
                        				var pNode5 = pNode4.getParentNode();
                        				if(pNode5 != null){
                            				ztreeRes.checkNode(pNode5, true, false);
                        				}
                    				}
                				}
            				}
        				}
        				ztreeRes.checkNode(node, true, false);
    				}//选中父节点-----end-----
    			}
    			vm.reloadResAuthTree();
    			}
    		});
		},
		getMenuRole: function(roleId){
            $.get(portalURL + "sys/role/info/"+roleId, function(r){
            	console.log(r);
            	vm.role = r.role;
            	
                //勾选角色所拥有的菜单
    			var menuIds = vm.role.menuIdList;
//    			console.log('ztreeMenu:'+JSON.stringify(ztreeMenu.getNodes()));
//    			console.log('menuIds:'+JSON.stringify(menuIds));
    			for(var i=0; i<menuIds.length; i++) {
    				var node = ztreeMenu.getNodeByParam("menuId", menuIds[i]);
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
    			vm.reloadMenuAuthTree();
    		});
		},
		getUserRole: function(roleId){
            $.get(portalURL + "sys/role/userIdList/"+roleId, function(r){
            	vm.role = r.role;
                
                //勾选角色所拥有的菜单
    			var userIds = vm.role.userIdList;
    			for(var i=0; i<userIds.length; i++) {
    				var node = ztreeUser.getNodeByParam("id", userIds[i]);
    				//选中父节点-----begin-----
    				if(node != null){
        				var pNode1 = node.getParentNode();
        				if(pNode1 != null){
        					//有些父节点没保存到数据库，这里返显
            				ztreeUser.checkNode(pNode1, true, false);
            				var pNode2 = pNode1.getParentNode();
            				if(pNode2 != null){
                				ztreeUser.checkNode(pNode2, true, false);
                				var pNode3 = pNode2.getParentNode();
                				if(pNode3 != null){
                    				ztreeUser.checkNode(pNode3, true, false);
                    				var pNode4 = pNode3.getParentNode();
                    				if(pNode4 != null){
                        				ztreeUser.checkNode(pNode4, true, false);
                        				var pNode5 = pNode4.getParentNode();
                        				if(pNode5 != null){
                            				ztreeUser.checkNode(pNode5, true, false);
                        				}
                    				}
                				}
            				}
        				}
        				ztreeUser.checkNode(node, true, false);
    				}//选中父节点-----end-----
    			}
    			vm.reloadUserAuthTree();
    		});
		},
		getDataRole: function(roleId){
            $.get(portalURL + "sys/role/dataIdList/"+roleId, function(r){
            	vm.role = r.role;
                
                //勾选角色所拥有的
    			var roleDataList = vm.role.roleDataList;
    			for(var i=0; i<roleDataList.length; i++) {
    				var node = ztreeData.getNodeByParam("dataId", roleDataList[i].dataId);
    				if(roleDataList[i].dataTpy == 'PRJ'){
    					ztreeData.checkNode(node, true, false);
    				}else{
    					ztreeData.checkNode(node, true, true);
    				}
    				var pNode1 = node.getParentNode();
    				if(pNode1 != null){
    					//有些父节点没保存到数据库，这里返显
    					ztreeData.checkNode(pNode1, true, false);
        				var pNode2 = pNode1.getParentNode();
        				if(pNode2 != null){
        					ztreeData.checkNode(pNode2, true, false);
        				}
    				}
    			}
    			vm.reloadDataAuthTree();
    		});
		},
		// getCurCheckedData: function (){
		// 	var dataIdList = new Array();
		// 	var dataTpyList = new Array();
		// 	var allCheckedStr = '';
		// 	if('undefined' != typeof(ztreeData)){
		// 		var nodesData = ztreeData.getCheckedNodes();
		// 		for(var i=0; i<nodesData.length; i++) {
		// 			if(nodesData[i].check_Child_State == -1 && allCheckedStr.indexOf('nId'+nodesData[i].parentId+'nId') == -1){
		// 				//最底层节点，且它的父节点不是选中状态的才要
		// 				dataIdList.push(nodesData[i].dataId);
		// 				dataTpyList.push(nodesData[i].dataTpy);
		// 			}

		// 			if(nodesData[i].check_Child_State == 2){
		// 				if(allCheckedStr.indexOf('nId'+nodesData[i].parentId+'nId') == -1){
		// 					//非最底层全选节点，且它的父节点不是选中状态的才要（即取全选的最高级节点）
		// 					dataIdList.push(nodesData[i].dataId);
		// 					dataTpyList.push(nodesData[i].dataTpy);
		// 				}
		// 				//把每个全选的节点id拼接存起来到allCheckedStr里
		// 				allCheckedStr += 'nId' + nodesData[i].dataId + 'nId';
		// 			}
		// 		}
		// 	}
		// 	var rs = {};
		// 	rs.dataIdList = dataIdList;
		// 	rs.dataTpyList = dataTpyList;
		// 	return rs;
		// },
		saveOrUpdate: function () {
			confirm('确定保存【授权】操作？', function(){
	            if(vm.validator()){
	                return ;
	            }

				//获取选择的菜单
				var menuIdList = new Array();
				if('undefined' != typeof(ztreeMenu)){
					var nodes = ztreeMenu.getCheckedNodes();
					for(var i=0; i<nodes.length; i++) {
						menuIdList.push(nodes[i].menuId);
					}
				}
				vm.role.menuIdList = menuIdList;

				//获取选择的门户
				var navIdList = new Array();
				if('undefined' != typeof(ztreeNav)){
					var nodes = ztreeNav.getCheckedNodes();
					for(var i=0; i<nodes.length; i++) {
						navIdList.push(nodes[i].menuId);
					}
				}
				vm.role.navIdList = navIdList;

				//获取选择的资源
				var resIdList = new Array();
				if('undefined' != typeof(ztreeRes)){
					var nodes = ztreeRes.getCheckedNodes();
					for(var i=0; i<nodes.length; i++) {
						resIdList.push(nodes[i].id);
					}
				}
				vm.role.resIdList = resIdList;

				//获取选择的用户
				var userIdList = new Array();
				if('undefined' != typeof(ztreeUser)){
					var nodesUser = ztreeUser.getCheckedNodes();
					for(var i=0; i<nodesUser.length; i++) {
						if(nodesUser[i].isUser == 'true'){
							userIdList.push(nodesUser[i].id);
						}
					}
				}
				vm.role.userIdList = userIdList;
				
				//获取选择的数据
				// var curCheckedDataObj = vm.getCurCheckedData();
				// vm.role.dataIdList = curCheckedDataObj.dataIdList;
				// vm.role.dataTpyList = curCheckedDataObj.dataTpyList;

				var url = vm.actionModel == 'add' ? "sys/role/save" : "sys/role/update";
				$.ajax({
					type: "POST",
				    url: portalURL + url,
	                contentType: "application/json",
				    data: JSON.stringify(vm.role),
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
			});
		},
		getMenuTree: function(roleId) {
/*			if(vm.q.menuname==undefined){
				vm.q.menuname=null;
			}*/
			
			$('.tab-content .middleIcon1').hide();
			//加载菜单树
			$.get(portalURL + "sys/menu/list", function(r){
				ztreeMenu = $.fn.zTree.init($("#menuTree"), menu_setting, r);
				//展开所有节点
				ztreeMenu.expandAll(false);
				
				if(roleId != null){
					vm.getMenuRole(roleId);
				}
			});
	    },
	    getNavTree: function(roleId) {
			$('.tab-content .middleIcon1').hide();
			//加载菜单树
			$.get(portalURL + "sys/navigation/list", function(r){
				ztreeNav = $.fn.zTree.init($("#navTree"), nav_setting, r);
				//展开所有节点
				ztreeNav.expandAll(false);
				
				if(roleId != null){
					vm.getNavRole(roleId);
				}
			});
	    },
	    getResTree: function(roleId) {
			$('.tab-content .middleIcon1').hide();
			//加载菜单树
			$.get(portalURL + "sys/resources/tree", function(r){
				console.log(r);
				ztreeRes = $.fn.zTree.init($("#resTree"), res_setting, r.list);
				//展开所有节点
				ztreeRes.expandAll(false);
				
				if(roleId != null){
					vm.getResRole(roleId);
				}
			});
	    },
	    getUserTree: function(roleId) {
			$('.tab-content .middleIcon2').hide();
			//加载用户树
			$.get(portalURL + "sys/user/tree", function(r){
				console.log(r);
				ztreeUser = $.fn.zTree.init($("#userTree"), user_setting, r);
				//展开所有节点
				ztreeUser.expandAll(false);
				
				if(roleId != null){
					vm.getUserRole(roleId);
				}
			});
	    },
	    getDataTree: function(roleId) {/*
	    	$('#dataTreeInitTip').show();
			$('.tab-content .middleIcon3').hide();
			//加载数据树
			$.get(portalURL + "sys/role/datalist", function(r){
		    	$('#dataTreeInitTip').hide();
				ztreeData = $.fn.zTree.init($("#dataTree"), data_setting, r);
				//展开所有节点
			 	ztreeData.expandAll(false);
			 	
			 	if(roleId != null){
			 	    vm.getDataRole(roleId);
			    }
			});
	    */},
	    reload: function () {
	    	vm.showList = true;
	    	refreshTable(vm.q.roleName);
		},
        validator: function () {
        	var msg="";

        	var me = /^[A-Za-z0-9]{0,20}$/,
                me1 = /^[\u4e00-\u9fa5]{0,20}$/,
                me2 = /^[A-Za-z0-9\u4e00-\u9fa5]{0,20}$/;
            if(!me.test(vm.role.roleName) && !me1.test(vm.role.roleName) && !me2.test(vm.role.roleName)){
                msg+="角色名不能太长<br>";
            }
            if(isBlank(vm.role.roleName)){
                alert("角色名不能为空");
                return true;
            }
            var be = /^[A-Za-z0-9]{0,40}$/,
                be1 = /^[\u4e00-\u9fa5]{0,40}$/,
                be2 = /^[A-Za-z0-9\u4e00-\u9fa5]{0,40}$/;
            if(!be.test(vm.role.remark) && !be1.test(vm.role.remark) && !be2.test(vm.role.remark)){
                msg+="备注不能太长<br>";
            }
            if(msg!=""){
                alert(msg);
                return true;
            }
        },
		reloadMenuAuthTree: function(){
			var nodes = ztreeMenu.getCheckedNodes(true);
			//js必须这样extend，否则会影响原来的nodes
			var authNodes = $.extend(true,[],nodes);
			for ( var i = 0,l = authNodes.length; i < l; i++ ){
				//delete掉子孙children，因为getCheckedNodes已经把所有选中的子孙放到第一级
				delete authNodes[i].children;
			}
			$('.tab-content .middleIcon1').show();
			ztreeMenuAuth = $.fn.zTree.init($("#menuAuthTree"), menu_auth_setting, authNodes);
			ztreeMenuAuth.expandAll(true);
		},
		reloadNavAuthTree: function(){
			var nodes = ztreeNav.getCheckedNodes(true);
			//js必须这样extend，否则会影响原来的nodes
			var authNodes = $.extend(true,[],nodes);
			for ( var i = 0,l = authNodes.length; i < l; i++ ){
				//delete掉子孙children，因为getCheckedNodes已经把所有选中的子孙放到第一级
				delete authNodes[i].children;
			}
			$('.tab-content .middleIcon1').show();
			ztreeNavAuth = $.fn.zTree.init($("#navAuthTree"), nav_auth_setting, authNodes);
			ztreeNavAuth.expandAll(true);
		},
		reloadResAuthTree: function(){
			var nodes = ztreeRes.getCheckedNodes(true);
			//js必须这样extend，否则会影响原来的nodes
			var authNodes = $.extend(true,[],nodes);
			for ( var i = 0,l = authNodes.length; i < l; i++ ){
				//delete掉子孙children，因为getCheckedNodes已经把所有选中的子孙放到第一级
				delete authNodes[i].children;
			}
			$('.tab-content .middleIcon1').show();
			ztreeResAuth = $.fn.zTree.init($("#resAuthTree"), res_auth_setting, authNodes);
			ztreeResAuth.expandAll(true);
		},
		reloadUserAuthTree: function(){
			var nodes = ztreeUser.getCheckedNodes(true);
			//js必须这样extend，否则会影响原来的nodes
			var authNodes = $.extend(true,[],nodes);
			for ( var i = 0,l = authNodes.length; i < l; i++ ){
				//delete掉子孙children，因为getCheckedNodes已经把所有选中的子孙放到第一级
				delete authNodes[i].children;
			}
			$('.tab-content .middleIcon2').show();
			ztreeUserAuth = $.fn.zTree.init($("#userAuthTree"), user_auth_setting, authNodes);
			ztreeUserAuth.expandAll(true);
		},
		reloadDataAuthTree: function(){
			var nodes = ztreeData.getCheckedNodes(true);
			//js必须这样extend，否则会影响原来的nodes
			var authNodes = $.extend(true,[],nodes);
			for ( var i = 0,l = authNodes.length; i < l; i++ ){
				//delete掉子孙children，因为getCheckedNodes已经把所有选中的子孙放到第一级
				delete authNodes[i].children;
			}
			$('.tab-content .middleIcon3').show();
			ztreeDataAuth = $.fn.zTree.init($("#dataAuthTree"), data_auth_setting, authNodes);
			ztreeDataAuth.expandAll(false);

			//展开第一个根节点
		    var nodeList = ztreeDataAuth.getNodes();
		    ztreeDataAuth.expandNode(nodeList[0], true);
		},
		authorizedUser: function(){
			var roleId = getSelectedRow("#table","roleId");
			if(roleId == null||roleId == false){
                return ;
            }
			getAuthorizedUser(roleId);
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "已授权用户",
                area: ['600px', '550px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#userLayer"),
                btn: ['确定'],
                btn1: function (index) {
                    layer.close(index);
                }
            });
        },
		authorizedBiee: function(){
			var roleId = getSelectedRow("#table","roleId");
		
			if(roleId == null||roleId == false){
                return ;
            }
			authorizedBieeOperation(roleId);
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "BIEE授权（当前被授权角色："+getSelectedRowField("roleName")+"）",
                area: ['650px', '550px'],
                shade: 0.5,
                shadeClose: false,
                content: jQuery("#BieeRoleLayer"),
                btn: ['确定'],
                btn1: function (index) {
                    layer.close(index);
                }
            });
        },
		queryMenuByCondition: function() {
			// console.log("menuName："+vm.q.menuname);
			//$('.tab-content .middleIcon1').hide();
			//加载菜单树
			$.get(portalURL + "sys/menu/listByCondition?menuName="+vm.q.menuname, function(r){
				ztreeMenu = $.fn.zTree.init($("#menuTree"), menu_setting, r);
				//展开所有节点
				ztreeMenu.expandAll(true);
			});
	    }
	}
});

function refreshTable(roleName){
    var opt = {
        silent: true,
        query:{
            roleName:$('#title').val(),
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}



function getAuthorizedUser(roleId){
	var currentUrl = $("#userJqGrid").getGridParam("url");
	if(currentUrl == null){
		$("#userJqGrid").jqGrid({
			url: portalURL + 'sys/user/queryListByRole',
			datatype: "json",
			colModel: [			
				{ label: '单位', name: 'orgId', index: "org_id", width: 150 , formatter:orgIdFormatter},
				{ label: '姓名', name: 'nickname', index: "nickname", width: 150 },
				{ label: '登录名', name: 'username', index: "username", width: 100 },
				{ label: '职位', name: 'duty', width: 150 }
			],
			viewrecords: true,
			height: 385,
			rowNum: 10,
			rowList : [10,30,50],
			rownumbers: true, 
			rownumWidth: 25, 
			autowidth:true,
			pager: "#userJqGridPager",
			jsonReader : {
				root: "page.list",
				page: "page.currPage",
				total: "page.totalPage",
				records: "page.totalCount"
			},
			postData:{
				roleId:roleId
			},
			prmNames : {
				page:"page", 
				rows:"limit", 
				order: "order"
			},
			gridComplete:function(){
				//隐藏grid底部滚动条
				$("#userJqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
			}
		});
	}else{
		$("#userJqGrid").setGridParam({
			postData:{
				roleId:roleId
			}
		}).trigger("reloadGrid");
	}
}
function authorizedBieeOperation(roleId){
	var currentUrl = $("#bieeRoleJqGrid").getGridParam("url");
	
	if(currentUrl == null){
		$("#bieeRoleJqGrid").jqGrid({
			url: portalURL + 'sys/biee/queryListByRole',
			datatype: "json",
			colModel: [			
				{ label: '目录主键', name: 'nid', index: "n_id", width: 45, key: true,hidden :true },
				{ label: 'BIEE组名', name: 'vwebgroupsDesc', width: 550 }
			],
			viewrecords: true,
			height: 385,
			rowNum: 10,
			rowList : [10,30,50],
			rownumbers: true, 
			rownumWidth: 40, 
			autowidth:true,
			toolbar:[true,"top"],
			multiselect: true,
			pager: "#bieeRoleJqGridPager",
			jsonReader : {
				root: "page.list",
				page: "page.currPage",
				total: "page.totalPage",
				records: "page.totalCount"
			},
			postData:{
				roleId:roleId
			},
			prmNames : {
				roleId:roleId,
				page:"page", 
				rows:"limit", 
				order: "order"
			},
			gridComplete:function(){
				//隐藏grid底部滚动条
				$("#bieeRoleJqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
			}
		});
		$("#t_bieeRoleJqGrid").append("&nbsp;<a v-if=\"hasPermission('sys:role:save')\" class=\"btn btn-primary\" onClick=\"queryAuthoriedBiee();\"><i class=\"fa fa-eye\"></i>&nbsp;查询</a>");
		$("#t_bieeRoleJqGrid").append("&nbsp;<a v-if=\"hasPermission('sys:role:save')\" class=\"btn btn-primary\" onClick=\"addAuthoriedBiee();\"><i class=\"fa fa-plus\"></i>&nbsp;新增</a>");
		$("#t_bieeRoleJqGrid").append("&nbsp;<a v-if=\"hasPermission('sys:role:delete')\" class=\"btn btn-primary\" onClick=\"deleteAuthriedBiee();\"><i class=\"fa fa-trash-o\"></i>&nbsp;删除</a>");
		$("#bieeRoleJqGrid").jqGrid("filterToolbar","autosearch");
	}else{
		$("#bieeRoleJqGrid").setGridParam({
			postData:{
				roleId:roleId
			}
		}).trigger("reloadGrid");	
		}
}
function addBieeOperation(roleId){
	var currentUrl = $("#addBieeJqGrid").getGridParam("url");
	if(currentUrl == null){
		$("#addBieeJqGrid").jqGrid({
			url: portalURL + 'sys/biee/queryUnauthorizedListByRole',
			datatype: "json",
			colModel: [			
				{ label: '目录主键', name: 'nid', index: "n_id", width: 45, key: true,hidden :true },
				{ label: 'BIEE组名', name: 'vwebgroupsDesc', width: 550 }
			],
			viewrecords: true,
			height: 385,
			rowNum: 10,
			rowList : [10,30,50],
			toolbar:[true,"top"],
			rownumbers: true, 
			rownumWidth: 40, 
			autowidth:true,
			//toolbar:[true,"top"],
			multiselect: true,
			pager: "#addBieeJqGridPager",
			jsonReader : {
				root: "page.list",
				page: "page.currPage",
				total: "page.totalPage",
				records: "page.totalCount"
			},
			postData:{
				roleId:roleId
			},
			prmNames : {
				page:"page", 
				rows:"limit", 
				order: "order"
			},
			gridComplete:function(){
				//隐藏grid底部滚动条
				$("#addBieeJqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
			}
		});
		$("#t_addBieeJqGrid").append("&nbsp;<a v-if=\"hasPermission('sys:role:save')\" class=\"btn btn-primary\" onClick=\"queryAddAuthoriedBiee();\"><i class=\"fa fa-eye\"></i>&nbsp;查询</a>");

		$("#addBieeJqGrid").jqGrid("filterToolbar","autosearch");
	}else{

		$("#addBieeJqGrid").setGridParam({
			postData:{
				roleId:roleId
			}
		}).trigger("reloadGrid");
		}
}

function orgIdFormatter (value, options, row){
	var result = "Exception";
	$.ajax({
		type:"get",
		async:false,
		url: portalURL + "sys/org/formatter/"+value,
		contentType: "application/json",
		data:value,
		success: function(r){
			if(r.code == 0){
				result = r.org.name;
			}else{
				console.log(r.msg);
			}
		}
	});
	return result;
}

function queryAuthoriedBiee(){
	$("#bieeRoleJqGrid")[0].triggerToolbar();
}

function queryAddAuthoriedBiee(){
	$("#addBieeJqGrid")[0].triggerToolbar();
}

function addAuthoriedBiee(){
	var roleId = getSelectedRow("#table","roleId");
	if(roleId == null||roleId == false){
		return ;
	}
	addBieeOperation(roleId);
	layer.open({
		type: 1,
		offset: '50px',
		skin: 'layui-layer-molv',
		title: "可选BIEE组",
		area: ['650px', '550px'],
		shade: 0.5,
		shadeClose: false,
		content: jQuery("#addBieeLayer"),
		btn: ['确定','取消'],
		btn1: function (index) {
			saveUnauthorizBiee(roleId,layer,index);
		},
		btn2: function (index) {
			layer.close(index);
		},
	});
}

function saveUnauthorizBiee(roleId,layer,index){
	var catalogIds = $("#addBieeJqGrid").jqGrid('getGridParam','selarrrow');
	if(catalogIds == null){
		return ;
	}

	confirm('确定要添加选中的目录吗？', function(){
		$.ajax({
			type: "POST",
			url: portalURL + "sys/biee/saveUnauthoriz/"+roleId,
			contentType: "application/json",
			data: JSON.stringify(catalogIds),
			success: function(r){
				if(r.code == 0){
					alert('操作成功', function(){
						//vm.reload();
						$("#bieeRoleJqGrid").trigger("reloadGrid");
						layer.close(index);
					});
				}else{
					alert(r.msg);
				}
			}
		});
	});
}

//选择一条记录
function getSelectedRowByBiee() {
    var grid = $("#bieeRoleJqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	return false;
    }
}

function deleteAuthriedBiee(){
	if(getSelectedRowByBiee()==false){
		alert("请选择一条记录");
		return;
	};	
	var roleId = getSelectedRow("#table","roleId");
	if(roleId == null||roleId == false){
		return ;
	}
	var catalogIds = $("#bieeRoleJqGrid").jqGrid('getGridParam','selarrrow');
	if(catalogIds == null){
		return ;
	}
	
	confirm('确定要删除选中的记录？', function(){
		$.ajax({
			type: "POST",
			url: portalURL + "sys/biee/deleteRoleAuthorized/"+roleId,
			contentType: "application/json",
			data: JSON.stringify(catalogIds),
			success: function(r){
				if(r.code == 0){
					alert('操作成功', function(){
						//vm.reload();
						$("#bieeRoleJqGrid").trigger("reloadGrid");
					});
				}else{
					alert(r.msg);
				}
			}
		});
	});
}