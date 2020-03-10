$(function () {
	$('#groupAuthTab a:first').tab('show');
	$('.middleIcon').hide();
	$('#groupAuthTab a').click(function (e) {
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
		onCheck: userTreeOnCheck
	}
};
var user_auth_setting = {
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
var ztreeMenu;
var ztreeMenuAuth;
var ztreeUser;
var ztreeUserAuth;
var ztreeData;
var ztreeDataAuth;

function menuTreeOnCheck(event, treeId, treeNode){
//	console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
	$.fn.zTree.destroy("menuAuthTree");
	vm.reloadMenuAuthTree();
}
function userTreeOnCheck(event, treeId, treeNode){
//	console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
	$.fn.zTree.destroy("userAuthTree");
	vm.reloadUserAuthTree();
}
function dataTreeOnCheck(event, treeId, treeNode){
//	console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
	$.fn.zTree.destroy("dataAuthTree");
	vm.reloadDataAuthTree();
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

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			groupName: null
		},
		showList: true,
		title:null,
		actionModel:null,
		group:{}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.actionModel='add';
			vm.group = {};
			vm.clearAllTree();
			vm.getUserTree(null);
		},
		update: function () {
			var groupId = getSelectedRow("#table","groupId");
			if(groupId == null){
				return ;
			}
			vm.clearAllTree();
			vm.showList = false;
            vm.title = "修改";
            vm.actionModel='update';
            vm.getUserTree(groupId);
		},
		editMenu: function () {
			var groupId = getSelectedRow("#table","groupId");
			if(groupId == null){
				return ;
			}
			vm.clearAllTree();
			vm.showList = false;
            vm.title = "修改";
            vm.actionModel='editMenu';
            vm.getUserTree(groupId);
		},
		
		del: function () {
			var groupIds = getSelectedRows("#table","groupId");
			if(groupIds == null){
				return ;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: portalURL + "sys/group/delete",
                    contentType: "application/json",
				    data: JSON.stringify(groupIds),
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
		editmenu: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.actionModel='add';
			vm.group = {};
			vm.clearAllTree();
			vm.getUserTree(null);

		},
		clearAllTree: function(){
			$.fn.zTree.destroy("userTree");
			$.fn.zTree.destroy("userAuthTree");
		},
		getUserGroup: function(groupId){
            $.get(portalURL + "sys/group/userIdList/"+groupId, function(r){
            	vm.group = r.group;
            	vm.group.groupId = groupId;
                
                //勾选角色所拥有的菜单
    			var userIds = vm.group.userIdList;
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
		getCurCheckedData: function (){
			var dataIdList = new Array();
			var dataTpyList = new Array();
			var allCheckedStr = '';
			if('undefined' != typeof(ztreeData)){
				var nodesData = ztreeData.getCheckedNodes();
				for(var i=0; i<nodesData.length; i++) {
					if(nodesData[i].check_Child_State == -1 && allCheckedStr.indexOf('nId'+nodesData[i].parentId+'nId') == -1){
						//最底层节点，且它的父节点不是选中状态的才要
						dataIdList.push(nodesData[i].dataId);
						dataTpyList.push(nodesData[i].dataTpy);
					}

					if(nodesData[i].check_Child_State == 2){
						if(allCheckedStr.indexOf('nId'+nodesData[i].parentId+'nId') == -1){
							//非最底层全选节点，且它的父节点不是选中状态的才要（即取全选的最高级节点）
							dataIdList.push(nodesData[i].dataId);
							dataTpyList.push(nodesData[i].dataTpy);
						}
						//把每个全选的节点id拼接存起来到allCheckedStr里
						allCheckedStr += 'nId' + nodesData[i].dataId + 'nId';
					}
				}
			}
			var rs = {};
			rs.dataIdList = dataIdList;
			rs.dataTpyList = dataTpyList;
			return rs;
		},
		saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }

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
			vm.group.userIdList = userIdList;
			console.log(vm.group);
			var url = vm.actionModel == 'add' ? "sys/group/save" : "sys/group/update";
			$.ajax({
				type: "POST",
			    url: portalURL + "sys/group/save",
                contentType: "application/json",
			    data: JSON.stringify(vm.group),
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
			
		},
	    getUserTree: function(groupId) {
			$('.tab-content .middleIcon2').hide();
			//加载用户树
			$.get(portalURL + "sys/user/tree", function(r){
				// console.log(r);
				ztreeUser = $.fn.zTree.init($("#userTree"), user_setting, r);
				//展开所有节点
				ztreeUser.expandAll(false);
				
				if(groupId != null){
					vm.getUserGroup(groupId);
				}
			});
	    },
	    reload: function () {
	    	vm.showList = true;
	    	refreshTable(vm.q.groupName);
		},
        validator: function () {
            if(isBlank(vm.group.groupName)){
                alert("组名不能为空");
                return true;
            }
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
		}
	}
});

function refreshTable(groupName){
    var opt = {
        silent: true,
        query:{
            groupName:$('#title').val(),
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}