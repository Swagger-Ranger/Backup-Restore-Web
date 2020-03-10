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
//var iconImg=["company.png"];
//var iconFliter=[];
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            name: null
        },
        itemList:[],  //resType的数组
        viewList:[],  //viewiId的数组
        // showList:(T.p("id")!=""&&T.p("id")!=null)?false:true,
        title:"新增",
        actionModel:"add",
        isReadOnly:(T.p("pageId")!=""&&T.p("pageId")!=null)?true:false,
        isReadOnly2:(T.p("pageId")!=""&&T.p("pageId")!=null)?true:false,
        isAble:(T.p("pageId")!=""&&T.p("pageId")!=null)?true:false,
        nav:{
            menuId:T.p("menuId"),
            resUrl:(T.p("pageId")!=""&&T.p("pageId")!=null)?'/modules/vData/pages/pages.html?pageId='+T.p("pageId"):'',
            parentName:null,
            parentId:0,
            vType:1,
            orderNum:0,
            resType:T.p("resType"),
            viewiId:"",
            resourcesId:T.p("id"),
            imgColor:'#51A0FF'
        },
        cities:["iconfont  icon-data", "iconfont  icon-iconfontmoney", "iconfont  icon-iconfontxinwen1", "iconfont  icon-shuju", "iconfont  icon-shuju1", "iconfont  icon-shuju2", "iconfont  icon-tubiaozhizuomoban", "iconfont  icon-data1", "iconfont  icon-shuju3", "iconfont  icon-shuju4", "iconfont  icon-shuju5", "iconfont  icon-data-copy", "iconfont  icon-shuju6", "iconfont  icon-shujuku", "iconfont  icon-shuju7", "iconfont  icon-shujuhuizong", "iconfont  icon-shuju8", "iconfont  icon-shangwuguanli", "iconfont  icon-shuju9", "iconfont  icon-shuju10", "iconfont  icon-shujuan", "iconfont  icon-icon-test11"],
//	    oldCities:["iconfont  icon-icon-test", "iconfont  icon-icon-test1", "iconfont  icon-icon-test2", "iconfont  icon-icon-test3", "iconfont  icon-icon-test4", "iconfont  icon-icon-test5", "iconfont  icon-icon-test6", "iconfont  icon-icon-test7", "iconfont  icon-icon-test8", "iconfont  icon-icon-test9", "iconfont  icon-icon-test10", "iconfont  icon-icon-test11", "iconfont  icon-icon-test12", "iconfont  icon-icon-test13", "iconfont  icon-icon-test14", "iconfont  icon-icon-test15", "iconfont  icon-icon-test16", "iconfont  icon-icon-test17", "iconfont  icon-icon-test18", "iconfont  icon-icon-test19", "iconfont  icon-icon-test20", "iconfont  icon-icon-test21", "iconfont  icon-icon-test22", "iconfont  icon-icon-test23", "iconfont  icon-icon-test24", "iconfont  icon-icon-test25", "iconfont  icon-icon-test26", "iconfont  icon-icon-test27"],
//	    bgImg:[],
	    value: '',
	    input3: ''
    },
    //用于数据初始化
    created:function(){
        // this.getResTypeList(); 
        this.getMenu();
        this.getViewList();
    },
    mounted:function(){
        this.getNavigationInfo();
    },
//  computed: {
//    citiesNew() {
//      return this.cities
//    }
//  },
//	watch: {
//		cities(val){
//			var _this = this;
//			console.log('我变化了', val, this.oldCities);
//	        let filtered = val.filter(val => this.oldCities.indexOf(val) == -1);
//	        filtered.forEach(function(item,index,arr){
//	       		iconFliter.push({"icon":item,"bgImg":iconImg[index]});
//	       		_this.bgImg=iconFliter;
////	       		this.bgImg.bgImg=iconImg[index];
//	       	})
//	       	console.log(_this.bgImg)
//		}
//	},
    methods: {
    	selectIcon: function(city) {
	      this.input3 = city;
	      this.nav.img=this.input3;
	    },
        getNavigationInfo: function() {
        	var _this = this;
            if(T.p("menuId")!=""&&T.p("menuId")!=null){
                $.get(portalURL + "sys/navigation/info/" + T.p("menuId"), function(r) {
                    console.log(r);
                    if(r.menu!=null&&typeof(r.menu)!="undefined"){
                        console.log("RrADFADADS");
                        vm.nav = r.menu;
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
                msg+="菜单名称不能为空！<br>";
            }
            if(isBlank(vm.nav.viewiId)){
                msg+="请选择门户！<br>";
            }
            // if(isBlank(vm.nav.resType)){
            //     msg+="资源类型不能为空！<br>";
            // }
            if(isBlank(vm.nav.resourcesId)){
                msg+="资源编号不能为空！<br>";
            }
            if(msg!=""){
                layer.alert(msg);
                return true;
            }
        },
//		addIcon: function (){
//      	var _this = this;
//      	var citiesLength=this.cities.length;
//      	iconImg.forEach(function(item,index,arr){
//          	var icon="iconfont icon-icon-test"+(index+citiesLength);
//          	var imgIcon="icon-icon-test"+(index+citiesLength);
//          	_this.cities.push(icon);
//          })
//		}
    }
});

