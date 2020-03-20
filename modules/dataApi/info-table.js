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
        // url: portalURL + 'sys/user/list', // 接口 URL 地址
        url: dataApiURL + 'info/list',
        method: 'get',
        contentType: "application/x-www-form-urlencoded",
        pagination: true, // 开启分页功能
        sidePagination : 'server',//服务端分页
        queryParamsType:'',
        responseHandler : function (res) {
            console.log(res);
            return {
                "total": res.page.total,//总数据条数
                "rows": res.page.list //数据集
            };
        },
        queryParams:function(params){
            var data = {};
            data.page=params.pageNumber;
            data.limit=params.pageSize;
            // data.sortName=params.sortName;
            // data.sortOrder=params.sortOrder;
            data.fldnm=vm.q.fldnm;
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
        uniqueId: 'id',  //定义主键
        columns: [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:true,
            width:150,
        },{
            title: '序号',
            align: 'center',
            halign: 'center',
            width:150,
            formatter: function (value, row, index) {
                var options = $('#table').bootstrapTable('getOptions');
                return options.pageSize * (options.pageNumber - 1) + index + 1;
            }
        },{
            field: 'id',
            width:150,
            title: 'id',
            visible: false
        },{
            field: 'system',
            width:400,
            title: '系统'
        },{
            field: 'module',
            width:400,
            title: '模块'
        },{
            field: 'module',
            width:400,
            title: '级别'
        },{
            field: 'fldnm',
            width:400,
            title: '字段名'
        },{
            field: 'fldtyp',
            width:100,
            title: '字段类型'
        },{
            field: 'fldlbltyp',
            title: '字段标签类型',
            width: 200,
        },{
            field: 'dspnm',
            title: '显示名',
            width: 250,
        },{
            field: 'dspnmii',
            title: '支持三级表头，第二级',
            width: 150,
        },{
            field: 'dspnmiii',
            title: '支持三级表头，第一级',
            width: 100,
        },{
            field: 'dspfmt',
            title: '显示格式',
            width: 80,
            align: 'center',
        },{
            field: 'dsppst',
            title: '显示位置',
            width: 100,
        },{
            field: 'wthrpk',
            title: '是否主键',
            width: 180,
        },{
            field: 'seqnbr',
            title: '排序字段',
            width: 100,
        },{
            field: 'valtyp',
            title: '字段类型',
            width: 100,
        },{
            field: 'dtlurl',
            title: '明细表URL',
            width: 100,
        },{
            field: 'namespace',
            title: '取值位置，命名空间',
            width: 100,
        },{
            field: 'totalsql',
            title: '执行查汇总的sql',
            width: 100,
            visible:false
        },{
            field: 'rowsql',
            title: '执行查明细的sql',
            width: 100,
            visible:false
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

/*
 *做一些初始化的动作
 */
function initPage(){

}