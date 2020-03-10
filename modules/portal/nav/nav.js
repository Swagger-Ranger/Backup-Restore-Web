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
            orderNum:0,

        },
        viewList:[],  //viewiId的数组
    },
    //用于数据初始化
    created:function(){
        this.getDistinctView();
    },
    methods: {
        getDistinctView: function() {
            $.get(portalURL + "vdata/views/getDistinctView", function(r){
                vm.viewList  = r.list;
            })
        },
		query: function () {
			vm.reload();
		},
        add: function(){
            layer.open({
                type: 2,
                title: '门户管理',
                area:['90%','90%'],
                content: 'nav-edit.html?action=add',
                end: function(){
                    vm.reload();
                }
            });
        },
        update: function () {
            var menuId = getMenuId();
            layer.open({
                type: 2,
                title: '门户管理',
                area:['90%','90%'],
                content: 'nav-edit.html?action=update&id='+menuId,
                end: function(){
                    console.log("修改关闭后回调-层销毁后触发的回调");
                    vm.reload();
                }
            });
        },
        aaa: function () {
            $.ajax({
                type: "POST",
                url: portalURL + "sys/navigation/listByResourcesId",
                contentType: "application/json",
                data: JSON.stringify({
                    resourcesId:"vdata_1"
                    // menuList:["m1","m2","m3"],
                    // roleId:"1"
                }),
                success: function(r){
                    console.log(r);
                    if(r.code == 0){
                        alert('操作成功', function(index){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        del: function () {
            var menuId = getMenuId();
            if(menuId == null||menuId == false){
                return ;
            }
            console.log(menuId);
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/navigation/delete/" + menuId,
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
        reload: function () {
			var name = vm.menu.name;
            var viewiId = vm.menu.viewiId;
			var creater = vm.menu.creater;
			var unit = vm.menu.createrUnit;
			if(typeof(name)=='undefined'||name==null){name = ''};
			if(typeof(creater)=='undefined'||creater==null){creater = ''};
			if(typeof(unit)=='undefined'||unit==null){unit = ''};
            if(typeof(viewiId)=='undefined'||viewiId==null){viewiId = ''};
			// console.log("name:"+name);
			// console.log("creater:"+creater);
			// console.log("unit:"+unit);
            // console.log("viewiId:"+viewiId);
            vm.showList = true;
			if(name!=''||creater!=''||unit!=''||viewiId!=''){
				this.$set(Menu.table,"url",portalURL + "sys/navigation/listByCondition?name="+name+"&creater="+creater+"&unit="+unit+"&viewiId="+viewiId);
				this.$set(Menu.table,"expandAll",true);
            }else {
				this.$set(Menu.table,"url",portalURL + "sys/navigation/list");
				this.$set(Menu.table,"expandAll",false);
			}
            Menu.table.init();
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
        {title: '门户菜单编号-menuId', field: 'menuId', width: '150px'},
        {title: '门户菜单名称-menuName', field: 'name',    width: '100px'},
        {title: '资源编号-resourcesId', field: 'resourcesId', width: '150px'},
        {title: '资源名称-resName', field: 'resName', width: '150px'},
        {title: '门户编号-viewiId', field: 'viewiId', width: '90px'},
        {title: '门户名称-viewiName', field: 'viewiName', width: '120px'},
        {title: '上级门户菜单', field: 'parentName',width: '100px'},
        {title: '资源类型', field: 'type', width: '60px', formatter: function(item, index){
            if(typeof(item.resType)=="undefined") return "";
            else return item.resType.txt;
        }},
        // {title: '图标', field: 'icon', width: '50px', formatter: function(item, index){
        //     return item.icon == null ? '' : '<i class="'+item.icon+' fa-lg"></i>';
        // }},
        // {title: '图片', field: 'img', width: '50px', formatter: function(item, index){
        //     return item.img;
        // }},
        // {title: '颜色', field: 'imgColor', width: '60px', formatter: function(item, index){
        //     return '<span class="label label-primary" style="width:40px;display:block;color:'+item.imgColor+'">&nbsp;</span>';
        // }},
        // {title: '类型', field: 'vType', width: '60px', formatter: function(item, index){
        //     if(item.vType === "0"){
        //         return '<span class="label label-primary">导航页</span>';
        //     }
        //     if(item.vType === "1"){
        //         return '<span class="label label-success">子菜单</span>';
        //     }
        // }},
        // {title: '排序号',classes:"t-r", field: 'orderNum', width: '70px'},
        {title: '预览', field: 'resUrl', width: '60px',formatter: function(item, index){ 
            if(item.resUrl == ""||item.resUrl == null||item.resUrl==undefined)
                return '';
            else
                return '<span class="label label-success pointer" onclick="preview(\''+item.menuId+'\',\''+item.name+'\',\''+item.resUrl+'\')">预览</span>';
        }},
		// {title: '创建人', field: 'creater', width: '100px'},
		// {title: '创建人所在单位', field: 'createrUnit', 
		// {title: '创建时间', field: 'createTime', width: '160px'},
        // {title: '授权标识', field: 'perms',}
        ]
    return columns;
};

function preview(id,name,url){
    /*
    *新建选项卡
    */
    window.parent.addMenuTab(id,name,url);
    /*
    *切换到指定选项卡
    */
    window.parent.nthTabs.setActTab(id);
}


function getMenuId () {
    var selected = $('#menuTable').bootstrapTreeTable('getSelections');
    console.log(selected);
    if (selected.length == 0) {
        alert("请选择一条记录");
        return false;
    } else {
        return selected[0].id;
    }
}

$(function () {
    var colunms = Menu.initColumn();
    var table = new TreeTable(Menu.id, portalURL + "sys/navigation/list", colunms);
    table.setExpandColumn(2);
    // table.setIdField("menuId");
    table.setIdField("menuId");
    table.setCodeField("menuId");
    table.setParentCodeField("parentId");
    table.setExpandAll(false);
    table.init();
    Menu.table = table;
});
