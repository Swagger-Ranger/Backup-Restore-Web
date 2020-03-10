//调用
var tableInit = function(){
    var url = portalURL + 'sys/tenant/list'; // 接口 URL 地址
    var params = {
        tenantName:$('#tenantName').val(),
        tenantName:$('#tenantName').val(),
        tenantCode:$('#tenantCode').val(),
    };
    var columns = [
        {radio:true},
        {
            field:"id",
            title:'编号',
            visible:true
        },{
            field:'tenantCode',
            title:'租户编码'
        },{
            field:'tenantName',
            title:'租户名称'
        },{
            field:'descrp',
            title:'描述'
        },{
            field:'queueId',
            title:'队列ID',
            visible:false
        },{
            field:'createTime',
            title:'创建时间',
            width: 180,
            formatter: dateFormatter
        },{
            field:'updateTime',
            title:'修改时间',
            width: 180,
            formatter: dateFormatter
        },{
            field:'orderNum',
            title:'排序',
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
                "total": res.page.total,//总数据条数
                "rows": res.page.list //数据集
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
                tenantName:$('#tenantName').val(),
                tenantCode:$('#tenantCode').val(),
            }
        };

        $('#table').bootstrapTable("refresh",opt);
    });
})

var setting = {
    data : {
        simpleData : {
            enable : true,
            idKey : "parentId",
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
            tenantName: null
        },
        showList: true,
        title:null,
        actionModel:null,
        tenant:{
            id : null,
            tenantCode : '',
            tenantName : '',
            descrp : '',
            queue_id : '',
            orderNum : 0
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
            vm.tenant = {
                tenantCode : '',
                tenantName : '',
                descrp : '',
                id : null
            };
        },
        update: function () {
            var id = getSelectedRow("#table","id");
            if(id == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.actionModel='update';
            vm.tenant.id=id;
            vm.getTenant(id);
        },
        reload: function () {
            vm.showList = true;
            refreshTable();
        },
        getTenant : function(id) {
            $.get(portalURL + "sys/tenant/info/" + id, function(r) {
                console.log(r);
                vm.tenant = r.tenant;
            });
        },
        del: function () {
            var id = getSelectedRow("#table","id");
            if(id == 0){
                alert('禁止删除此租户');
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/tenant/delete/" + id ,
                    contentType: "application/json",
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
            if(vm.validator()){
                return ;
            }
            var url = vm.actionModel == 'add' ? "sys/tenant/save" : "sys/tenant/update";
            $.ajax({
                type: "POST",
                url: portalURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.tenant),
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
        validator: function () {
            var msg="";
            var t = /^[A-Za-z0-9]{0,12}$/;
            if(!t.test(vm.tenant.tenantCode)){
                msg+="租户编码不能太长<br>";
            }
            if(isBlank(vm.tenant.tenantCode)){
                msg+="租户编码不能为空<br>";
            }
            var t1 = /^[A-Za-z0-9]{0,12}$/,
                t2 = /^[\u4e00-\u9fa5]{0,12}$/,
                t3 = /^[A-Za-z0-9\u4e00-\u9fa5]{0,12}$/;
            if(!t1.test(vm.tenant.tenantName) && !t2.test(vm.tenant.tenantName) && !t3.test(vm.tenant.tenantName)){
                msg+="租户名称不能太长<br>";
            }
            if(isBlank(vm.tenant.tenantName)){
                msg+="租户名称不能为空<br>";
            }
            if(!t1.test(vm.tenant.descrp) && !t2.test(vm.tenant.descrp) && !t3.test(vm.tenant.descrp)){
                msg+="描述不能太长<br>";
            }
            if(msg!=""){
                alert(msg);
                return true;
            }
        }
       
    }
});

function refreshTable(){
    var opt = {
        silent: true,
        query:{
            tenantName:$('#tenantName').val(),
            tenantCode:$('#tenantCode').val(),
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}

// function dateFormatter(value, row, index){
//     return commonUtil.getFormatDate2(value);
// }