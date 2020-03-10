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
        q:{
            name: null
        },
        resourcesList:[],  //resType的数组
        viewList:[],  //viewiId的数组
        title:"新增",
        actionModel:"add",
        isReadOnly:(T.p("pageId")!=""&&T.p("pageId")!=null)?true:false,
        isReadOnly2:(T.p("pageId")!=""&&T.p("pageId")!=null)?true:false,
        isAble:(T.p("pageId")!=""&&T.p("pageId")!=null)?true:false,
        nav:{
            menuId : '',
            resUrl:(T.p("pageId")!=""&&T.p("pageId")!=null)?'/modules/vData/pages/pages.html?pageId='+T.p("pageId"):'',
            parentName:null,
            parentId:0,
            vType:1,
            orderNum:0,
            resType:T.p("resType"),
            viewiId:"",
            menuId:T.p("id"),
            imgColor:'#51A0FF'
        },
        cities:["iconfont  icon-data", "iconfont  icon-iconfontmoney", "iconfont  icon-iconfontxinwen1", "iconfont  icon-shuju", "iconfont  icon-shuju1", "iconfont  icon-shuju2", "iconfont  icon-tubiaozhizuomoban", "iconfont  icon-data1", "iconfont  icon-shuju3", "iconfont  icon-shuju4", "iconfont  icon-shuju5", "iconfont  icon-data-copy", "iconfont  icon-shuju6", "iconfont  icon-shujuku", "iconfont  icon-shuju7", "iconfont  icon-shujuhuizong", "iconfont  icon-shuju8", "iconfont  icon-shangwuguanli", "iconfont  icon-shuju9", "iconfont  icon-shuju10", "iconfont  icon-shujuan", "iconfont  icon-icon-test11"],
	    value: '',
	    input3: ''
    },
    //用于数据初始化
    created:function(){
        // this.getResTypeList(); 
        this.getResourcesList(); 
        this.getMenu();
        this.getViewList();

    },
    mounted:function(){
        this.getNavigationInfo();
    },
    methods: {
    	selectIcon: function(city) {
	      this.input3 = city;
	      this.nav.img=this.input3;
	    },
        getNavigationInfo: function() {
        	var _this = this;
            console.log(T.p("resType"));
            if(T.p("id")!=""&&T.p("id")!=null){
                $.get(portalURL + "sys/navigation/info/" + T.p("id"), function(r) {
                    if(r.menu!=null&&typeof(r.menu)!="undefined"){
                        vm.nav = r.menu;
                        // vm.nav.resType=r.menu.resType.val;
                        vm.title="修改";
                        vm.isReadOnly=true;
                        vm.actionModel="update";
                        _this.input3=vm.nav.img;
                    }
                });
            }
        },
        getViewList: function() {
            $.get(portalURL + "vdata/views/getDistinctView", function(r){
                console.log(r.list);
                vm.viewList  = r.list;
            })
        },
        getResourcesList: function() {
            $.get(portalURL + "sys/resources/getDistinctResources", function(r){
                vm.resourcesList  = r.list;
            })
        },
        getResTypeList: function() {
            $.get(portalURL + "sys/resources/getResType", function(r){
                vm.itemList  = r.list;
            })
        },
        close: function () {
            closeCurrentLayer();
        },
        getMenu: function(){
            //加载菜单树
            $.get(portalURL + "sys/navigation/select", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.menuList);
                var node = ztree.getNodeByParam("menuId", vm.nav.parentId);
                if(node!=null){
                    ztree.selectNode(node);
                    vm.nav.parentName = node.name;
                }
            })
        },
        menuTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择菜单",
                area: ['300px', '350px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.nav.parentId = node[0].menuId;
                    vm.nav.parentName = node[0].name;

                    layer.close(index);
                }
            });
        },
        saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }
            var url = vm.actionModel == 'add' ? "sys/navigation/save" : "sys/navigation/update";

            console.log(vm);
            $.ajax({
                type: "POST",
                url: portalURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.nav),
                success: function(r){
                    if(r.code === 0){
                        layer.alert('操作成功',function(){
                            closeCurrentLayer();
                        });
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
        validator: function () {
            var msg="";
            if(isBlank(vm.nav.name)){
                msg+="门户菜单名称不能为空！<br>";
            }
            if(isBlank(vm.nav.viewiId)){
                msg+="请选择门户！<br>";
            }
            if(vm.nav.vType === 1 && isBlank(vm.nav.parentName)){
                msg+="父级门户菜单不能为空!<br>";
            }
            //父级门户菜单不能为空
            if(vm.nav.vType === 1 && isBlank(vm.nav.resourcesId)){
                msg+="请选择资源！<br>";
            }
            // if(isBlank(vm.nav.resType)){
            //     msg+="资源类型不能为空！<br>";
            // }
            // if(isBlank(vm.nav.resourcesId)){
            //     msg+="资源编号不能为空！<br>";
            // }
            if(msg!=""){
                layer.alert(msg);
                return true;
            }
        }
    }
});

