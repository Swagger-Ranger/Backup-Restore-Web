//调用
var tableInit = function(){
    var url = portalURL + 'sys/org/list'; // 接口 URL 地址
    var params = {
        name:$('#name').val(),
        orgName:$('#name').val(),
        shortname:$('#shortname').val()
    };
    var columns = [
        {checkbox:true},
        {
            field:"orgId",
            title:'机构ID',
            visible:true
        },{
            field:'name',
            title:'机构名称'
        },{
            field:'shortname',
            title:'机构简称'
        },{
            field:'parentName',
            title:'父级机构名称'
        },{
            field:'parentId',
            title:'父机构ID',
            visible:false
        },{
            field:'icon',
            title:'图标',
            visible:false
        },{
            field:'orderNum',
            title:'排序',
            visible:true
        },{
            field:'type',
            title:'类型',
            visible:false
        },{
            field:'source',
            title:'来源',
            visible:false
        }
    ];

    var tableConfig = $.extend(baseTableConfig(url, params, columns),{
        //这里是其他的一些个性化的 bootstrap-table options
        //例如 覆盖一些公共的配置
        //例如 添加一些私有的配置
        //例如格式化数据
        responseHandler:function(res){
            return {
                "total": res.total,//总数据条数
                "rows": res.list //数据集
            }
        }
    });
    //调用实例化
    $('#table').bootstrapTable(tableConfig);
};

$(function(){
    //Bingo
    tableInit();

    $("#btnSearch,#btnRefresh").click(function(){
        // refreshTable();
        var opt = {
            silent: true,
            query:{
                name:$('#name').val(),
                orgName:$('#name').val(),
                shortname:$('#shortname').val()
            }
        };

        $('#table').bootstrapTable("refresh",opt);
    });
})

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
    el:'#rrapp',
    data:{
        q:{
            orgName: null
        },
        showList: true,
        title:null,
        actionModel:null,
        org:{
            orgId : null,
            status : 1,
            parentId: 0,
            shortname: '',
            parentName : null
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
            vm.org = {
                status : 0,
                lockStatus : '0',
                source : '0',
                roleIdList : [],
                orgId : null,
                parentId: 0,
                shortname: '',
                parentName : null
            };
            vm.getOrgTree();
        },
        update: function () {
            var orgId = getSelectedRow("#table","orgId");
            if(orgId == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.actionModel='update';
            vm.org.orgId=orgId;
            vm.org.parentId=0;
            vm.getOrg(orgId);
        },
        del: function () {
            var orgIds = getSelectedRows("#table","orgId");
            if(orgIds == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/org/delete",
                    contentType: "application/json",
                    data: JSON.stringify(orgIds),
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
            console.log(vm.org);
            if(vm.validator()){
                return ;
            }
            var url = vm.actionModel == 'add' ? "sys/org/save" : "sys/org/update";
            $.ajax({
                type: "POST",
                url: portalURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.org),
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
        orgTree : function() {
            layer.open({
                type : 1,
                offset : '50px',
                title : "选择机构",
                area : [ '300px', '450px' ],
                shade : 0,
                shadeClose : false,
                content : $("#orgLayer"),
                btn : [ '确定', '取消' ],
                btn1 : function(index) {
                    var node = ztree.getSelectedNodes();
                    console.log(node);
                    //选择上级菜单                   
                    vm.org.parentId = node[0].orgId;
                    vm.org.parentName = node[0].name;
                    layer.close(index);
                }
            });
        },
        getOrgTree : function() {
            //加载菜单树
            $.get(portalURL + "sys/org/select", function(r) {
                ztree = $.fn.zTree.init($("#orgTree"), setting, r.orgList);
                var node = ztree.getNodeByParam("orgId", vm.org.parentId);
                ztree.selectNode(node);
            })
        },
        getOrg : function(orgId) {
            $.get(portalURL + "sys/org/formatter/" + orgId, function(r) {
                console.log(r);
                vm.org = r.org;
                vm.getOrgTree();
            });
        },
        reload: function () {
            vm.showList = true;
            refreshTable(vm.q.orgName);
        },
        validator: function () {
            var msg="";
            var rg = /^[A-Za-z0-9]{0,50}$/,
                rg1 = /^[\u4e00-\u9fa5]{0,50}$/,
                rg2 = /^[A-Za-z0-9\u4e00-\u9fa5]{0,50}$/;
            if(!rg.test(vm.org.name) && !rg1.test(vm.org.name) && !rg2.test(vm.org.name)){
                msg+="机构名称不能太长<br>";
            }
            if(isBlank(vm.org.name)){
                msg+="机构名称不能为空<br>";
            }
            if(!rg.test(vm.org.shortname) && !rg1.test(vm.org.shortname) && !rg2.test(vm.org.shortname)){
                msg+="机构简称不能太长<br>";
            }
            //排序号
            var re = /^[1-9][0-9]{0,5}$/;
            var re2 = /^[0]{1}$/;
            if(!re2.test(vm.org.orderNum) && !re.test(vm.org.orderNum)){
                msg+="排序号错误,请输入6位数以下的正整数<br>";
            }
            // if(isBlank(vm.org.shortname)){
            //     msg+="机构简称不能为空<br>";
            // }
            // if(isBlank(vm.org.parentName)){
            //     msg+="父级机构不能为空<br>";
            // }
            if(msg!=""){
                alert(msg);
                return true;
            }
        }
    }
});

function refreshTable(orgName){
    var opt = {
        silent: true,
        query:{
            orgName:$('#title').val(),
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}