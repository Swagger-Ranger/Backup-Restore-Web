//调用
var tableInit = function(){
    var url = portalURL + 'sys/tenant/list'; // 接口 URL 地址
    var params = {
        tenantName:$('#tenantName').val(),
        tenantName:$('#tenantName').val()
    };
    var columns = [
        {checkbox:true},
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
            
        },{
            field:'createTime',
            title:'创建时间',
            width: 180,
            formatter: function(value,row,index){
                return commonUtil.getFormatDate2(value);
            }
        },{
            field:'updateTime',
            title:'修改时间',
            
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
                tenantName:$('#tenantName').val()
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

        },
        reload: function () {
            vm.showList = true;
            refreshTable(vm.q.tenantName);
        },
        del: function () {
            var ids = getSelectedRows("#table","id");
            if(ids == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/tenant/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
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
            $.ajax({
                type: "POST",
                url: portalURL + "sys/tenant/save",
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
            if(isBlank(vm.tenant.tenantCode)){
                msg+="机构名称不能为空<br>";
            }
            if(isBlank(vm.tenant.tenantName)){
                msg+="机构简称不能为空<br>";
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
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}