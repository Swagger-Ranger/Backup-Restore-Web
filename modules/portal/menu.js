var setting = {
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
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        showList: true,
        title: null,
        actionModel:null,
        menu:{
            parentName:null,
            parentId:0,
            type:1,
            orderNum:0
        },
        q:{
            searchStr:null,
            genre:"ALL"
        }
    },
    methods: {
		query: function () {
			vm.reload();
		},
        getMenu: function(){
            //加载菜单树
        	
            $.get(portalURL + "sys/menu/select", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.menuList);
                var node = ztree.getNodeByParam("menuId", vm.menu.parentId);
                ztree.selectNode(node);

                vm.menu.parentName = node.name;
            })
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.actionModel='add';
            vm.menu = {parentName:null,parentId:0,type:1,orderNum:0,icon:"fa fa-pie-chart"};
            vm.getMenu();
        },
        update: function () {
            var menuId = getMenuId();
            if(menuId == null||menuId == false){
                return ;
            }

            $.get(portalURL + "sys/menu/info/"+menuId, function(r){
                vm.showList = false;
                vm.title = "修改";
                vm.menu = r.menu;
                vm.actionModel='update';
                vm.menu.parentName=r.menu.name;
                vm.getMenu();
            });
        },
        del: function () {
            var menuId = getMenuId();
            if(menuId == null||menuId == false){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/menu/delete/" + menuId,
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
        saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }

            var url = vm.actionModel == 'add' ?  "sys/menu/save" : "sys/menu/update";
            $.ajax({
                type: "POST",
                url: portalURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.menu),
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
        menuTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择菜单",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.menu.parentId = node[0].menuId;
                    vm.menu.parentName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
			var searchStr = vm.menu.searchStr;
			if(typeof(searchStr)=='undefined'||searchStr==null){searchStr = ''};
			console.log("searchStr"+searchStr);
            vm.showList = true;
			if(searchStr!=''){
				this.$set(Menu.table,"url",portalURL + "sys/menu/listByCondition?searchStr="+searchStr);
				this.$set(Menu.table,"expandAll",true);
            }else {
				this.$set(Menu.table,"url",portalURL + "sys/menu/list");
				this.$set(Menu.table,"expandAll",false);
			}
            Menu.table.init();
        },
        validator: function () {
            var msg="";

            var me = /^[A-Za-z0-9]{0,8}$/,
                me1 = /^[\u4e00-\u9fa5]{0,8}$/,
                me2 = /^[A-Za-z0-9\u4e00-\u9fa5]{0,8}$/;
            if(!me.test(vm.menu.name) && !me1.test(vm.menu.name) && !me2.test(vm.menu.name)){
                msg+="菜单名称不能太长<br>";
            }
            // if(isBlank(vm.menu.name)){
            //     msg+="菜单名称不能为空<br>";
            // }
            //菜单
            var ur = /^[A-Za-z0-9]{0,100}$/;
            var ur2 = /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]{0,100}$/im;
            var ur3 = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]{0,100}$/;
            if(!ur.test(vm.menu.url) && !ur2.test(vm.menu.url) && !ur3.test(vm.menu.url)){
                msg+="请输入长度为100以内的正确url<br>";
            }
            if(vm.menu.type === 1 && isBlank(vm.menu.url)){
                msg+="菜单URL不能为空<br>";
            }
            //排序号
            var re = /^[1-9][0-9]{0,6}$/;
            var re2 = /^[0]{1}$/;
            if(!re2.test(vm.menu.orderNum) && !re.test(vm.menu.orderNum)){
                msg+="排序号错误,请输入7位数以下的正整数<br>";
            }
            if(msg!=""){
                alert(msg);
                return true;
            }
        },
		authorizedRole: function(){
			var menuId = getMenuId();
			if(menuId == null||menuId == false){
                return ;
            }
			getAuthorizedRole(menuId);
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "已授权角色",
                area: ['600px', '600px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#roleLayer"),
                btn: ['确定'],
                btn1: function (index) {
                    layer.close(index);
                }
            });
        }
    }
});


var Menu = {
    id: "menuTable",
    table: null,
    layerIndex: -1
};

/**
 * 初始化表格的列
 */
Menu.initColumn = function () {
    var columns = [
        {field: 'selectItem', radio: true},
        {title: '编号', field: 'menuId', width: '60px'},
        {title: '菜单名称', field: 'name',    width: '180px'},
        //{title: '上级菜单代码', field: 'parentName', visible: false,    width: '100px'},
        {title: '图标', field: 'icon', width: '50px', formatter: function(item, index){
            if(item.type === 0){
                return '<i class="'+item.icon+' fa-lg"></i>';
            }
            if(item.type === 1){
                return '<i class="'+item.icon+' fa-lg"></i>';
            }
            if(item.type === 2){
                return '';
            }
        }},
        {title: '类型', field: 'type', width: '60px', formatter: function(item, index){
            if(item.type === 0){
                return '<span class="label label-primary">目录</span>';
            }
            if(item.type === 1){
                return '<span class="label label-success">菜单</span>';
            }
            if(item.type === 2){
                return '<span class="label label-warning">按钮</span>';
            }
        }},
        {title: '排序号',classes:"t-r", field: 'orderNum', width: '70px'},
        {title: '菜单URL', field: 'url', width: '160px',formatter: function(item, index){
            if(item.type === 0){
                return '';
            }
            if(item.type === 1){
                return item.url;
            }
            if(item.type === 2){
                return ' ';
            }
        }},
		// {title: '创建人', field: 'creater', width: '100px'},
		// {title: '创建人所在单位', field: 'createrUnit',    width: '160px'},
		// {title: '创建时间', field: 'createTime', width: '160px'},
        // {title: '授权标识', field: 'perms',}
        ]
    return columns;
};


function getMenuId () {
    var selected = $('#menuTable').bootstrapTreeTable('getSelections');
    if (selected.length == 0) {
        alert("请选择一条记录");
        return false;
    } else {
        return selected[0].id;
    }
}

function getAuthorizedRole(menuId){
	var currentUrl = $("#roleJqGrid").getGridParam("url");
	if(currentUrl == null){
		$("#roleJqGrid").jqGrid({
			url: portalURL + 'sys/role/queryListByMenu',
			datatype: "json",
			colModel: [			
				{ label: '角色名称', name: 'roleName', index: "role_name", width: 545 }
			
			],
			viewrecords: true,
			height: 385,
			rowNum: 10,
			rowList : [10,30,50],
			rownumbers: true, 
			rownumWidth: 25, 
			autowidth:true,
			pager: "#roleJqGridPager",
			jsonReader : {
				root: "page.list",
				page: "page.currPage",
				total: "page.totalPage",
				records: "page.totalCount"
			},
			postData:{
				menuId:menuId
			},
			prmNames : {
				page:"page", 
				rows:"limit", 
				order: "order"
			},
			gridComplete:function(){
				//隐藏grid底部滚动条
				$("#roleJqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
			}
		});
	}else{
		$("#roleJqGrid").setGridParam({
			postData:{
				menuId:menuId
			}
		}).trigger("reloadGrid");
	}
}


$(function () {
    var colunms = Menu.initColumn();
    var table = new TreeTable(Menu.id, portalURL + "sys/menu/list", colunms);
    table.setExpandColumn(2);
    table.setIdField("menuId");
    table.setCodeField("menuId");
    table.setParentCodeField("parentId");
    table.setExpandAll(false);
    table.init();
    Menu.table = table;
});
