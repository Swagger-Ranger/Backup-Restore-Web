var ztreeMenu;
function menuTreeOnCheck(event, treeId, treeNode){
	// console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
	$.fn.zTree.destroy("menuAuthTree");
	vm.reloadMenuAuthTree();
	cancelParentNodeChecked(treeNode);
}

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
			nocheckInherit:true,
			chkboxType : { "Y" : "","N" : ""}
		},
		callback: {
			onCheck: menuTreeOnCheck
		}
};

$(function () {
	hisbrowing();
	favorites();
});

var vm = new Vue({
	el : '#rrapp',
	data : {
		q : {
			username : null
		},
		showPassword : true,
		showList : true,
		showColumn : true,
		title : null,
		roleList : {},
		user : {
			orgId : 1,
			status : 1,
			orgShtNm : null,
			roleIdList : []
		}
	},
	methods : {

		
        getMenu: function(){
            //加载菜单树
        	
        
			
			$('.tab-content .middleIcon1').hide();
			//加载菜单树
			$.get(portalURL + "sys/menulog/menulist?name="+$("#queryname").val(), function(r){
				ztreeMenu = $.fn.zTree.init($("#menuTree"), menu_setting, r);
				//展开所有节点
				ztreeMenu.expandAll(false);

					vm.getMenuFs();
			
			});
	
        },
        getMenuFs: function(){
            $.post(portalURL + "sys/menulog/queryFavoritesMenu", function(r){
            	
                //勾选角色所拥有的菜单
    			var menuIds = r.page.list;
//    			console.log('ztreeMenu:'+JSON.stringify(ztreeMenu.getNodes()));
//    			console.log('menuIds:'+JSON.stringify(menuIds));
    			for(var i=0; i<menuIds.length; i++) {
    				var node = ztreeMenu.getNodeByParam("menuId", menuIds[i].menuId);
    				//选中父节点-----begin-----
    				if(node != null){
   /*     				var pNode1 = node.getParentNode();
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
        				}*/
        				ztreeMenu.checkNode(node, true, false);
    				}//选中父节点-----end-----
    			}
    			vm.reloadMenuAuthTree();
    		});
		},
		reloadMenuAuthTree: function(){
			var nodes = ztreeMenu.getCheckedNodes(true);
			//js必须这样extend，否则会影响原来的nodes
			var authNodes = $.extend(true,[],nodes);
			for ( var i = 0,l = authNodes.length; i < l; i++ ){
				//delete掉子孙children，因为getCheckedNodes已经把所有选中的子孙放到第一级
				// console.log(authNodes[i]);
				delete authNodes[i].children;
				// if(authNodes[i].isParent&&!authNodes[i].isLastNode){

				// }
			}
			$('.tab-content .middleIcon1').show();
			ztreeMenuAuth = $.fn.zTree.init($("#menuAuthTree"), menu_auth_setting, authNodes);
			ztreeMenuAuth.expandAll(true);
		}


	}
});
//点击查询菜单
function reloadMenuTree(){
	vm.getMenu();
}

//保存收藏
function saveFavoritesMenu(){
	confirm('确定收藏选择的菜单？', function(){
		//获取选择的菜单
		var menuIdList = new Array();
		if('undefined' != typeof(ztreeMenu)){
			var nodes = ztreeMenu.getCheckedNodes();
			for(var i=0; i<nodes.length; i++) {
				menuIdList.push(nodes[i].menuId);
			}
		}
		var data={menuIdList:menuIdList};
		
		$.ajax({
			type: "POST",
		    url: portalURL + "/sys/menulog/saveFavoritesMenu",
            contentType: "application/json",
		    data: JSON.stringify(data),
		    success: function(r){
		    	if(r.code === 0){
					alert('操作成功!<br><span style="color:orange;">注意：目录项将不会显示在便捷导航列表中</span>', function(){
						loadMenu("favorite","queryFavoritesMenu");
						layer.closeAll();
					});
				}else{
					alert(r.msg);
				}
			}
		});
	});
}

 function authorizedUserData() {

	vm.getMenu();
	layer
			.open({
				type : 1,
				offset : '50px',
				skin : 'layui-layer-molv',
				title : "添加收藏",
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



function getContent(url) {
    return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
}
//加载浏览记录
function hisbrowing(){
	    $.ajax({
	        type: "POST",
	        url: portalURL + "sys/menulog/queryBrowsingHistory",
	        dataType: "json",
	        contentType: "application/json",
	        success: function(data){
	        	var str = "";	
	        	var r=data.page.list;
	        $.each(r,function(i,item){  //遍历二维数组
	           str+='<div class="col-md-6"><div class="box">';
	           str+='<div class="header_bg"><span class="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image"><i class="' + item.icon + '"></i></span></div>';
	           str+='<div class="header_font"><a  data-url="' + item.url + '" data-id="' + item.menuId + '" data-parent=' + item.parentId + ' href="#"><span class="name">' + item.name + '</span></a></div>';
	           str+='</div></div>';
			});
	        $("#his").html(str);
	        //绑定点击事件。
	    	$('.header_font').on('click','a',function() {
	    		 var menuId = $(this).data('id');
	    	        var url = $(this).data('url');
	    			var parentId = $(this).data('parent');
	    	        var name = $(this).text();
	    	        if(url){
	    			//	先暂时定位这个范围内的菜单以新窗口的方式打开，后面改成配置型
	    				if(parentId == 20001||parentId == 20002){
	    					window.open(url);
	    					return;
	    				}
	    				parent.window.nthTabs.addTab({
	    	                id: menuId,
	    	                title: name,
	    	                content: getContent(url),
	    	            }).setActTab('#' + menuId);
	    	        }
	        	
	        });	
	        }
	    });
}

//加载收藏记录
function favorites(){
    $.ajax({
        type: "POST",
        url: portalURL + "sys/menulog/queryFavoritesMenu",
        dataType: "json",
        contentType: "application/json",
        success: function(data){
        	var str = "";	
        	var r=data.page.list;
	    $.each(r,function(i,item){  //遍历二维数组
           str+='<div class="col-md-6"><div class="box">';
           str+='<div class="header_bg"><span class="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image"><i class="' + item.icon + '"></i></span></div>';
           str+='<div class="header_font"><a  data-url="' + item.url + '" data-id="' + item.menuId + '" data-parent=' + item.parentId + ' href="#"><span class="name">' + item.name + '</span></a></div>';
           str+='</div></div>';
		});
        $("#favorite").html(str);
        //绑定点击事件。
    	$('.header_font').on('click','a',function() {
    		 var menuId = $(this).data('id');
    	        var url = $(this).data('url');
    			var parentId = $(this).data('parent');
    	        var name = $(this).text();
    	        if(url){
    			//	先暂时定位这个范围内的菜单以新窗口的方式打开，后面改成配置型
    				if(parentId == 20001||parentId == 20002){
    					window.open(url);
    					return;
    				}
    				parent.window.nthTabs.addTab({
    	                id: menuId,
    	                title: name,
    	                content: getContent(url),
    	            }).setActTab('#' + menuId);
    	        }
        	
        });	
        }
    });
}


function delhis(menuId){
	data={menuId:menuId}
    $.ajax({
        type: "POST",
        url: portalURL + "sys/menulog/deleteBrowsingHistory",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(r){
        	hisbrowing();
        }
    });
	
}

function delfsAll(){
	confirm('确定清空访问历史？', function(){
        $.ajax({
	        type: "POST",
	        url: portalURL + "sys/menulog/deleteFavoritesMenuAll",
	        dataType: "json",
	        contentType: "application/json",
	        success: function(r){
	        	$('#history').html('');
	        	hisbrowing();
	        	alert("操作成功");
	        }
	    });
    });
}

function delfs(menuId){
	data={menuId:menuId}
    $.ajax({
        type: "POST",
        url: portalURL + "sys/menulog/deleteFavoritesMenu",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(r){
        	favorites();
        }
    });
}

//递归去除父类节点的的选中
function cancelParentNodeChecked(node){
    zTree = $.fn.zTree.getZTreeObj("menuTree");
    if(node.getParentNode()){
    	var treeObj = $.fn.zTree.getZTreeObj("menuTree");
    	var nodes = treeObj.getCheckedNodes(true);
    	zTree.checkNode(node.getParentNode(),false,false);
        cancelParentNodeChecked(node.getParentNode());
    }
}