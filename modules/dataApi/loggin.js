$(document).ready(function() {
    setTimeout(function(){
        window.onresize = function(){
            $("#reportTable").bootstrapTable('refresh',{silent:true});
        }
    },200);
    //初始化查询时间
    var format = "yyyy-mm-dd";
    var startView = 'month';
    var minView = "month";
    $('#searchStartDt').datetimepicker({
        language: 'zh-CN',
        format: format,
        startView: startView,//日期时间选择器打开之后首先显示的视图
        minView: minView,//设置只显示到月份
        todayBtn: true, //今天按钮
        clearBtn: true,// 自定义属性,true 显示 清空按钮 false 隐藏 默认:true
        autoclose: true//自动关闭
    });
    
    $('#searchEndDt').datetimepicker({
        language: 'zh-CN',
        format: format,
        startView: startView,//日期时间选择器打开之后首先显示的视图
        minView: minView,//设置只显示到月份
        todayBtn: true, //今天按钮
        clearBtn: true,// 自定义属性,true 显示 清空按钮 false 隐藏 默认:true
        autoclose: true//自动关闭
    });
    $('#searchEndDt').val(commonUtil.getFormatDate(new Date()));
    gettable();
    $('#searchStartDt,#searchEndDt').datetimepicker().on('changeDate', function(ev){
        //$("#reportTable").bootstrapTable('refresh',{silent:true});
        $('#reportTable').bootstrapTable('destroy');
        gettable();
    });
    
    //中文编码
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
    
    //初始化列表

    
    
   /* $("#reportTable").on("click",".isTextarea", function() {
        $('#textareaModal').modal('show');
        $('#textareaTitle').text($(this).attr('data-modal-title'));
        $('#textareaCommon').val($(this).attr('title'));
    });*/

    $("#searchBtnRpt").click(function(){
        //$('#reportTable').bootstrapTable("refresh");
        $('#reportTable').bootstrapTable('destroy');
        gettable();
    });

});


function gettable(){
    $('#reportTable').bootstrapTable({
        url: dataApiURL + 'swagger/getRptData', // 接口 URL 地址
        method: 'post',
        contentType: "application/x-www-form-urlencoded",
        pagination: true, // 开启分页功能
        sidePagination : 'server',//服务端分页
        queryParamsType:'',
        queryParams:function(params){
            var data = {};
            data.page=params.pageNumber;  //当前页数
            data.rows=params.pageSize;      //当前页数的条数
            data.sortName=params.sortName;
            data.sortOrder=params.sortOrder;
            //data.key=$('#searchText').val();
            //data.filedVal1=$('#searchStartDt').val();
            //data.filedVal2=$('#searchEndDt').val()+" 23:59:59";
            data.rptId="plog";
            return data;
        },
        pageNumber: 1,
        height: ($(window).height()-30),
        pageSize: 2, // 设置默认分页为 10
        pageList: [10, 20, 30, 40,100,500,1000], // 自定义分页列表
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
        //dataField:rows,
        detailView: false,
        responseHandler : function (res) {
            console.log(res.list);
            return {
                "total": res.list.total,//总页数
                "rows": res.list.rows //数据
            };
            //return res.list;
        },
        columns: [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:false
        },{
            field: 'OPERATION',//json
            width:100,
            title: '用户名'//显示名
//          visible: false//隐藏列
        },{
            field: 'USERNAME',
            title: '操作内容',
            width: 150,
            sortable: false,
        },{
            field: 'IP',
            title: '操作时间',
            width: 200,
            sortable: false,
        }]
       
    });
}