//调用
$(function(){

     $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
    $('#table').bootstrapTable({
        url: portalURL + 'btjt/dict/list', // 接口 URL 地址
        method: 'get',
        contentType: "application/x-www-form-urlencoded",
        pagination: true, // 开启分页功能
        sidePagination : 'server',//服务端分页
        queryParamsType:'',
        responseHandler : function (res) {
            console.log(res);
            return {
                "total": res.page.totalCount,//总页数
                "rows": res.page.list //数据
            };
        },
        queryParams:function(params){
            var data = {};
            data.page=params.pageNumber;
            data.limit=params.pageSize;
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
        columns: [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:true
        },{
            field: 'tblId',
            width:150,
            title: '表名'
        },{
            field: 'tblNm',
            width:150,
            title: '表名称'
        },{
            field: 'fldCtgId',
            width:150,
            title: '分类ID'
        },{
            field: 'fldCtgNm',
            width:150,
            title: '分类名称 '
        },{
            field: 'fldSeq',
            width:150,
            title: '排序号'
        },{
            field: 'fldId',
            width:150,
            title: '字典代码'
        },{
            field: 'fldNm',
            width:150,
            title: '字典名称'
        }]
    });

    $('#importBtn').click(function(){
        $('#importDict').modal('show');
    })
    
    $('#exportBtn').click(function(){
    	var url = portalURL + "/btjt/dict/export";
		submitUrlForm(url);
    })
    
    $('#uploadDict').click(function(){
		if($('#uploadFile').val().length <= 0 ){
			 alert('请先上传excel文件');
			 return;
		 }else{
			 	if($('#uploadFile').val().length > 0 ){
					    	    var file = $('#uploadFile').val();
								 var fileExt=file.replace(/.+\./,"").toLowerCase();
								 if( ! (fileExt == 'xls' || fileExt == 'xlsx') ){
									 alert('请上传文件扩展名为xls或xlsx')
									 return;
								 }
				};
				$.ajax({
		                type: 'post',
		                url: portalURL +'btjt/dict/import',
		                data: new FormData($('#upformRpt')[0]),
		                cache: false,
		                processData: false,
		                contentType: false,
		                dataType:'json'
		            }).success(function (data) {
		                if(data.code == 0){
		                	alert('上传成功');
		                	vm.reload();
		                }
		            });
		 }
	})
    
    $("#downExcel").click(function(){
		var url = portalURL + "/btjt/dict/downExcel";
		submitUrlForm(url);
	});
    


})



