$(document).ready(function() {
    initPage();
    setTimeout(function(){
        window.onresize = function(){
            $("#table").bootstrapTable('refresh',{silent:true});
        }
    },200);
    
    //初始化列表
    $('#table').bootstrapTable({
        url: portalURL + 'sys/role/list', // 接口 URL 地址
        method: 'get',
        contentType: "application/x-www-form-urlencoded",
        pagination: true, // 开启分页功能
        sidePagination : 'server',//服务端分页
        queryParamsType:'',
        responseHandler : function (res) {
            // console.log(res);
            return {
                "total": res.page.totalPage,//总页数
                "rows": res.page.list //数据
            };
        },
        queryParams:function(params){
            var data = {};
            data.pageNumber=params.pageNumber;
            data.pageSize=params.pageSize;
            data.sortName=params.sortName;
            data.sortOrder=params.sortOrder;

            data.roleName=vm.q.roleName;

            // data.vTitle=$('#title').val();
            // data.vState=$('#stateList').val();
            // data.searchStartDt=$('#searchStartDt').val();
            // data.searchEndDt=$('#searchEndDt').val();
            return data;
        },
        pageNumber: 1,
        pageSize: 10, // 设置默认分页为 10
        pageList: [10, 20, 30, 40], // 自定义分页列表
        paginationPreText: '上一页',
        paginationNextText: '下一页',
        paginationFirstText: '首页',
        paginationLastText: '尾页',
        showRefresh: false, // 开启刷新功能
        showExport: false, //开启导出功能
        striped: true, //是否显示行间隔色
        minimumCountColumns: 2, // 设置最少显示列个数
        clickToSelect: true, // 单击行即可以选中
        toolbar: '#toolbar',//工具栏
        detailView: false,
        uniqueId: 'roleId',  //定义主键
        columns: [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:true
        },{
            title: '序号',
            align: 'center',
            halign: 'center',
            width:50,
            formatter: function (value, row, index) {
                var options = $('#table').bootstrapTable('getOptions');
                return options.pageSize * (options.pageNumber - 1) + index + 1;
            }
        },{
            field: 'roleId',
            width:150,
            title: '角色代码',
            visible: false
        },{
            field: 'roleName',
            width:400,
            title: '角色名'
        },{
            field: 'strategy',
            width:100,
            title: '数据权限策略'
        },{
            field: 'remark',
            width:200,
            title: '备注'
        },{
            field: 'createTime',
            title: '创建时间',
            width: 180,
            formatter: dateFormatter
        }]
    });
    
    $("#table").on("click",".isTextarea", function() {
        // $('#textareaModal').modal('show');
        // $('#textareaTitle').text($(this).attr('data-modal-title'));
        // $('#textareaCommon').val($(this).attr('title'));
    });

    $("#btnSearch,#btnRefresh").click(function(){
        $('#table').bootstrapTable("refresh");
    });
});

function initPage(){
    // $.ajax({
    //     type: "GET",
    //     url: portalURL + "check/dcRule/toRuleConfig",
    //     success: function(r){
    //     if(r.code === 0){
    //         initRuleList(r.ruleList);
    //         }else{
    //             alert(r.msg);
    //         }
    //     }
    // });
}