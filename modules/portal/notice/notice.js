//调用
var tableInit = function(){
    var url = portalURL + 'sys/notice/list'; // 接口 URL 地址
    var params = {
        vTitle:$('#title').val(),
        vState:$('#stateList').val(),
        searchStartDt:$('#searchStartDt').val(),
        searchEndDt:$('#searchEndDt').val()
    };
    var columns = [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:false
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
            field: 'vtitle',
            width:350,
            title: '消息标题',
            formatter: function(value,row,index){
                return '<a onclick="openNoticeTab('+JSON.stringify(row).replace(/\"/g,"'")+')" href="#">'+value+'</a>';
            }
        },{
            field: 'vcontent',
            width:300,
            title: '消息内容'
        },{
            field: 'vstateName',
            title: '消息状态',
            width: 100,
        },{
            field: 'dreadTime',
            title: '阅读时间',
            width: 200,
            formatter:dateFormatter
        },{
            field: 'dcreateTime',
            title: '消息时间',
            width: 200,
            formatter:dateFormatter
        }];

    var tableConfig = $.extend(baseTableConfig(url, params, columns),{
        //这里是其他的一些个性化的 bootstrap-table options
        //例如 覆盖一些公共的配置
        //例如 添加一些私有的配置
        //例如格式化数据
        responseHandler:function(res){
            console.log(res);
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
    setTimeout(function(){
        window.onresize = function(){
            $("#table").bootstrapTable('refresh',{silent:true});
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

    tableInit();

    $('#searchStartDt,#searchEndDt').datetimepicker().on('changeDate', function(ev){
        refreshTable();
    });
    
    $("#btnSearch,#btnRefresh").click(function(){
        refreshTable();
    });
});

function refreshTable(){
    var opt = {
        silent: true,
        query:{
            vTitle:$('#title').val(),
            vState:$('#stateList').val(),
            startDate:$('#searchStartDt').val(),
            endDate:$('#searchEndDt').val()
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}

function openNoticeTab(row){
    url = encodeURI(row.vurl);
    window.parent.nthTabs.addTab({
        id: row.vid,
        title: row.vtitle,
        content: getContent(url),
    }).setActTab('#' + row.vid);

    readNotice(row.vid);
}



function readNotice(vId){
    $.ajax({
        type : "POST",
        url: portalURL + 'sys/notice/save', // 接口 URL 地址
        contentType : "application/json",
        data : JSON.stringify({vId:vId}),
        success:function(data) {
            refreshTable();
        }
    });
}



