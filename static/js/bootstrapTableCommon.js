//中文编码
$.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
    
//因为后面很多重复应用此配置 所以简单做了处理提取到了公共文件。
var baseTableConfig = function(url, params, columns){   
    return {
        url: url,
        queryParams: function (page) {
            return $.extend(params, {
                // pageSize: page.limit,
                // pageNumber: page.offset / page.limit + 1
                pageSize: page.pageSize,
                pageNumber: page.pageNumber,
            });
        },
        toolbarAlign: 'left',//工具条位置
        toolbar: '#toolbar',//工具栏  √
        detailView: false,//  √
        columns: columns,//列  √
        //showJumpTo:true,//跳转页 此为拓展功能
        // queryParamsType: 'limit',
        // showColumns: false,//列显示隐藏操作按钮
        queryParamsType: '',//  √
        method: 'get',//请求方式  √
        pageNumber: 1,//  √
        pageSize: 10, // 设置默认分页为 10  √
        pageList: [10, 20, 30, 40], // 自定义分页列表  √
        paginationPreText: '上一页',//  √
        paginationNextText: '下一页',//  √
        paginationFirstText: '首页',//  √
        paginationLastText: '尾页',//  √
        clickToSelect: true,//点击行选中  √
        contentType: "application/x-www-form-urlencoded",//  √
        showRefresh: false,//显示刷新按钮  √
        showExport: false, //开启导出功能  √
        pagination: true,//分页  √
        sidePagination: 'server',//分页 server为后端分页 client为前端分页  √
        striped: true,//斑马纹  √
        minimumCountColumns: 2, // 设置最少显示列个数  √
        // cache: false,//缓存
        // smartDisplay: false,//
        // paginationLoop: false,//循环分页
        // onlyInfoPagination: false,//
        // height: tableHeight(),
        onLoadSuccess: function (res) {
            // console.log('加载成功');
        }
    }
}

/*
 *选择一条记录
 */
function getSelectedRow(obj,idField) {
    if(typeof(obj)=="undefined"||obj==null)
        obj="#table";
    var selected = $(obj).bootstrapTable('getSelections');

    if(selected.length>1||selected.length==0){
        alert("请选择一条记录");
        return ;
    }
    var ids = new Array();
    for(var i=0;i<selected.length;i++){
        ids[i]=selected[i][idField];
    }
    return ids[0];
}

//选择多条记录
function getSelectedRows(obj,idField) {
    if(typeof(obj)=="undefined"||obj==null)
        obj="#table";
    if(typeof(idField)=="undefined"||idField==null)
        obj="id";
	var selected = $(obj).bootstrapTable('getSelections');
	console.log(selected);
    if(selected.length==0){
    	alert("请选择一条记录");
    	return ;
    }
    
    var ids = new Array();
    for(var i=0;i<selected.length;i++){
        ids[i]=selected[i][idField];
    }
    return ids;
}

function initTableCell(){
    $('#table').on('click','td  .isOpenText', function () {
            var value = $(this).attr('title');
            var htmlObj = $(this).parents('.readMore');
            htmlObj.html(value.substring(0) +  '<span title="'+value+'" class="noOpenText "  >...收缩</span>');
    });

    $('#table').on('click','td  .noOpenText', function () {
            var value = $(this).attr('title');
            var htmlObj = $(this).parents('.readMore');
            htmlObj.html(value.substring(0,50) +  '<span title="'+value+'" class="isOpenText "  >...展开</span>');
    });
}

