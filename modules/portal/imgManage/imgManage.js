//调用
var tableInit = function(){
    var url = portalURL + 'sys/docManage/list'; // 接口 URL 地址
    var params = {
        fileName:$('#fileName').val(),
        fileName:$('#fileName').val(),
        alias:$('#alias').val(),
        type:"image/*",
    };
    var columns = [
        {radio:true},
        {
            field:"id",
            title:'id',
            visible:true
        },{
            field:'fileName',
            title:'文件名'
        },{
            field:'alias',
            title:'别名'
        },{
            field:'portLevel',
            title:'0表示根目录'
        },{
            field:'parentName',
            title:'父目录',
            //visible:false
        },{
            field:'parentPath',
            title:'父路径',
            //visible:false
        },{
            field:'allPath',
            title:'全路径',
            //visible:false
        },{
            field:'host',
            title:'主机',
           //visible:false
        },{
            field:'fileExtension',
            title:'文件后缀',
            //visible:false
        }
    ];

    var tableConfig = $.extend(baseTableConfig(url, params, columns),{
        //这里是其他的一些个性化的 bootstrap-table options
        //例如 覆盖一些公共的配置
        //例如 添加一些私有的配置
        //例如格式化数据
        responseHandler:function(res){
            console.log(res);
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
                fileName:$('#fileName').val(),
                alias:$('#alias').val(),
                type:"image/*",
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
            fileName: null
        },
        showList: true,
        title:null,
        actionModel:null,
        docManage:{
            id : null,
            fileName : '',
            alias : '',
            portLevel : '',
            parentId : 0,
            isDirectory : '',
            path : '',
            parentPath : '',
            allPath : '',
            host : '',
            fileExtension : '',
            type : ''
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
            vm.docManage = {
                /*fileName : '',
                alias : '',
                descrp : '',
                id : null*/
            };
        },
        update: function () {
            var id = getSelectedRow("#table","id");
            if(id == null){
                return ;
            }
            /*vm.showList = false;
            vm.title = "修改";
            vm.actionModel='update';
            vm.imgManage.id=id;
            vm.getimgManage(id);*/
        },
        reload: function () {
            vm.showList = true;
            refreshTable();
        },
        getdocManage : function(id) {
            $.get(portalURL + "sys/docManage/info/" + id, function(r) {
                console.log(r);
                vm.docManage = r.docManage;
            });
        },
        del: function () {
            var id = getSelectedRow("#table","id");
            if(id == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/docManage/delete",
                    contentType: "application/json",
                    data: JSON.stringify(id),
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
            var url = vm.actionModel == 'add' ? "sys/docManage/save" : "sys/docManage/update";
            $.ajax({
                type: "POST",
                url: portalURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.docManage),
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
            if(isBlank(vm.docManage.fileName)){
                msg+="文件名不能为空<br>";
            }
            if(isBlank(vm.docManage.alias)){
                msg+="别名不能为空<br>";
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
            fileName:$('#fileName').val(),
            alias:$('#alias').val(),
            type:"image/*",
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}

function dateFormatter(value, row, index){
    return commonUtil.getFormatDate2(value);
}