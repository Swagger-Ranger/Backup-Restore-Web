$(document).ready(function() {
    initPage();
    setTimeout(function(){
        window.onresize = function(){
            $("#table").bootstrapTable('refresh',{silent:true});
        }
    },200);
    
    //中文编码
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
    
    //初始化列表
    $('#table').bootstrapTable({
        url: portalURL + 'sys/user/list', // 接口 URL 地址
        method: 'get',
        contentType: "application/x-www-form-urlencoded",
        pagination: true, // 开启分页功能
        sidePagination : 'server',//服务端分页
        queryParamsType:'',
        responseHandler : function (res) {
            // console.log(res);
            return {
                "total": res.page.totalCount,//总数据条数
                "rows": res.page.list //数据集
            };
        },
        queryParams:function(params){
            var data = {};
            data.page=params.pageNumber;
            data.limit=params.pageSize;
            // data.sortName=params.sortName;
            // data.sortOrder=params.sortOrder;
            data.username=vm.q.username;
            data.status=vm.q.status;
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
        uniqueId: 'userId',  //定义主键
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
            field: 'userId',
            width:300,
            title: '用户Id',
            visible: false
        },{
            field: 'username',
            width:100,
            title: '登录名'
        },{
            field: 'nickname',
            width:100,            title: '用户名'
        },{
            field: 'orgShtNm',
            title: '公司简称',
            width: 200,
        },{
            field: 'roleName',
            title: '角色名',
            width: 200,
        },{
            field: 'gender',
            title: '性别',
            width: 60,
            formatter: function(value,row,index){
                return row.gender.txt;
            }
        },{
            field: 'email',
            title: '邮箱',
            width: 150,
            visible: false
        },{
            field: 'mobile',
            title: '手机号',
            width: 100,
            visible: false
        },{
            field: 'status',
            title: '状态',
            width: 80,
            align: 'center',
            formatter: function(value,row,index){
                return value === 0 ? '<span class="label label-success">正常</span>'
                : '<span class="label label-danger">禁用</span>';
            }
        },{
            field: 'createUserId',
            title: '创建人',
            width: 100,
            visible:false
        },{
            field: 'createTime',
            title: '创建时间',
            width: 180,
            // visible:false,
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