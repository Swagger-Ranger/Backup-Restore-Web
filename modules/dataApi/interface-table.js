$(document).ready(function() {
    initPage();
    render();
    $("#system option:first-child").attr("disabled",true)
    $("#module option:first-child").attr("disabled",true)
    $("#level option:first-child").attr("disabled",true)
    $("#sqlDbtype option:first-child").attr("disabled",true)
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
//      url: dataApiURL + 'analysisSql/list',
		url:bURL,
        method: 'get',
        contentType: "application/x-www-form-urlencoded",
        pagination: true, // 开启分页功能
        sidePagination : 'server',//服务端分页
        queryParamsType:'',
        responseHandler : function (res) {
            return {
                "total": res.data.total.totalcount,//总数据条数
                "rows": res.data.rows //数据集
            };
        },
        queryParams:function(params){
            var data = {};
            data.currpage=params.pageNumber;
            data.pagerow=params.pageSize;
            // data.sortName=params.sortName;
            // data.sortOrder=params.sortOrder;
            data.rptId="dsb_getInterName";
            if(vm.q.interName != null && vm.q.interName != '' && typeof(vm.q.interName) != undefined){
            	data.p_inter_name=vm.q.interName;
            }
            if(vm.q.system != '全选' && vm.q.system != null && vm.q.system != '' && typeof(vm.q.system) != undefined){
            	data.p_system=vm.q.system;
            }
            if(vm.q.module != '全选' && vm.q.module != null && vm.q.module != '' && typeof(vm.q.module) != undefined){
            	data.p_module=vm.q.module;
            }
            if(vm.q.level != '全选' && vm.q.level != null && vm.q.level != '' && typeof(vm.q.level) != undefined){
            	data.p_level=vm.q.level;
            }
            if(vm.q.sqlDbtype != '全选' && vm.q.sqlDbtype != null && vm.q.sqlDbtype != '' && typeof(vm.q.sqlDbtype) != undefined){
            	data.p_sqlDbtype=vm.q.sqlDbtype;
            }
            // data.vTitle=$('#title').val();
            // data.vState=$('#stateList').val();
            // data.searchStartDt=$('#searchStartDt').val();
            // data.searchEndDt=$('#searchEndDt').val();
            return data;
        },
        onLoadSuccess: function(data){  //加载成功时执行  
          //时间的需要等表格单元格加载完再进行初始化
          initTableCell();
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
        uniqueId: 'rptId',  //定义主键
        columns: [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:true,
            // width:150,
        },{
            title: '序号',
            align: 'center',
            halign: 'center',
            // width:150,
            formatter: function (value, row, index) {
                var options = $('#table').bootstrapTable('getOptions');
                return options.pageSize * (options.pageNumber - 1) + index + 1;
            }
        },{
            field: 'operate',
            title: '操作',
            width: 80,
            formatter: function(value,row,index) {
                var a = '<i class="glyphicon glyphicon-search preview" title="预览数据" style="margin-right:8px" onclick="preview(\''+row.rptId+'\',\''+row.outputType+'\')"></i>'+
                		'<i class="glyphicon glyphicon-send" title="权限控制" style="margin-right:10px" onclick="revision(\''+row.rptId+'\')"></i>'+
                		'<i class="glyphicon glyphicon-trash" title="删除接口" onclick="deletRow(\''+row.rptId+'\')" ></i>';
                return a;  
            },
            align:'center'
        },{
            field: 'interName',
            // width:150,
            title: '接口名称',
            // visible:false,
            formatter: function (value, row, index) {
                return '<a href="javascript:;" onclick="editRow(\''+row.rptId+'\')">'+value+'</a>';
            }
        },{
            field: 'isDimension',
            // width:150,
            title: '指标/维度',
            formatter: function (value, row, index) {
            	return row.isdimension === 'INDEX' ? 
                    '指标': 
                    '维度';
            }
        },{
            field: 'rptId',
            // width:150,
            title: 'rptId',
        },{
            field: 'apiSystem',
            // width:150,
            title: '系统',
            // visible:false
        },{
            field: 'apiModule',
            // width:150,
            title: '模块',
            // visible:false
        },{
            field: 'apiLevel',
            // width:150,
            title: '级别',
            // visible:false
        },{
            field: 'orderNum',
            // width:150,
            title: '排序',
            visible:false
        },{
            field: 'sqlDbsource',
            title: '数据源',
        },{
            field: 'outputType',
            // width:150,
            title: '输出类型',
//          formatter: function(value, options, row){
//              return value === '1' ? 
//                  '数据': 
//                  '结果';
//          }
        },{
            field: 'sqlText',
            width: 200,
            title: '明细语句',
            visible:false,
            formatter: function(value, options, row){
                if(value==null) value="";
                var dspVal = value.substring(0,50) + '<span title="'+value+'" class="isOpenText"  >...展开</span>';
                if(value.length > 50){
                    _html = '<label class="text readMore  control-label"  title="'+value+'">'+dspVal+'</label>';
                }else{
                    _html = '<label class="text control-label" title="'+value+'">'+dspVal+'</label>';
                }
                return _html;
            }
        },{
            field: 'sqlSummary',
            title: '汇总语句',
            width: 100,
            visible:false,
            formatter: function(value, options, row){
                if(value==null) value="";
                var dspVal = value.substring(0,50) + '<span title="'+value+'" class="isOpenText"  >...展开</span>';
                if(value.length > 50){
                    _html = '<label class="text readMore  control-label"  title="'+value+'">'+dspVal+'</label>';
                }else{
                    _html = '<label class="text control-label" title="'+value+'">'+dspVal+'</label>';
                }
                return _html;
            }
        },{
            field: 'descr',
            title: '描述',
            // width: 250,
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
        render();
        if(vm.flag == true){
            	$(".fixed-table-container").css("display","none");
            }else{
            	$(".fixed-table-container").css("display","block");
            }
    });
});

function editRow(rptId){
    vm.showPassword=false;
    vm.showList = false;
    vm.showColumn = true;
    vm.title = "修改";            
    vm.getIptMng(rptId);
}

//保存绑定IP
function revision(rptId){
    vm.revisionBox = true;
    var url="analysisSql/info";
    var url2="pinter/info/"+rptId;
    $.ajax({
        type: "get",
        url: dataApiURL + url,
        contentType: "application/json",
        data: {rptId:rptId},
        success: function(r){
            if(r.code == 0){
                $("#se").val(r.ipt.interName);
                $("#sid").val(r.ipt.rptId)
            }else{
                console.log(r);
            }

        }
    });
    $.ajax({
        type: "get",
        url: dataApiURL + url2,
        contentType: "application/json",
        success: function(r){
            if(r.code == 0){
				if(r.entity != null && r.entity != '' && typeof(r.entity) != undefined){
					var ip=r.entity.ip;
	            	vm.ipMsg=r.entity;
				}else{
					var ip="";
	            	vm.ipMsg={};
				}
            	
	            $("#ip").val(ip);
            }else{
                alert(r.msg);
            }
        }
    });
    
    $('#mymodal-data1').modal();
}

//保存绑定IP
function updateIp(){
	var url = "pinter/update";
	var ipText = $("#ip").val();
	vm.ipMsg.ip=ipText;
	confirm('确定保存【IP绑定】？', function(){
		$.ajax({
	        type: "POST",
	        url: dataApiURL + url,
	        data:JSON.stringify(vm.ipMsg),
	        contentType: "application/json",
	        success: function(r){
	           if(r.code == 0){
	                    alert('操作成功', function(){
	                    	$("#mymodal-data1").modal("hide")
	                        vm.reload();
	                    });
	                }else{
	                    alert(r.msg);
	                }
	        }
	    });
    });
}

//预览

var obj = {};
var sqlList = [];
var outputType = '';
function preview(rptId,outputType){
    var url="analysisSql/info";
    var sqlTest = '';
    var sqlInput = '';
    var filedName = [];
	obj={};
	obj.rptId = rptId;
    $("#text").text("");
	$(".modal .modal-body p").text("");
	$(".modal .modal-title").text("接口名称：");
	$("#sqlInput").html("");
	var pathHost=window.location.host;
	$("#text").text("接口地址：http://"+pathHost+bURL+"?rptId="+rptId);
    $("#input").text("http://"+pathHost+bURL+"?rptId="+rptId);
	//输出类型为JSON
    $.ajax({
        type: "get",
        url: dataApiURL + url,
        contentType: "application/json",
        data: {rptId:rptId},
        success: function(r){
        	if(r.code == 0){
				$(".modal .modal-title").text("接口名称："+r.ipt.interName);
				sqlTest = r.ipt.sqlText;
				$.ajax({
			    	type: "GET",
			        url: dataApiURL +"analysisSql/sql",
			        contentType: "application/json",
			        async:false,
			        data: {
			            sql:sqlTest,
			        },
			        success: function(r){
			            if(r.code == 0){
			            	sqlList = r.list;
			            	filedName=[];
			            	r.list.map(v => {
			            		filedName.push(v);
					            sqlInput=sqlInput+'<div class="form-group" style="float: left; width: 100%;">'+
					            '<div class="col-sm-2 control-label" style="text-align:right;margin-top: 7px;">'+v+'</div>'+
					            '<div class="col-sm-10"><input type="text" id="'+v+'" class="form-control" placeholder="'+v+'">'+
					            '</div></div>'
					        })
			            }
			        }
				});
				filedName=filedName.toString();
			    $("#sqlInput").append('<div style="float:left;"><span>当前为第</span><input type="text" value="1" class="form-control" id="pageNum"><span>页，每页</span><input type="text" value="10" class="form-control" id="pageSize"><span>条数据，</span><span>显示'+filedName+'的数据</span></div>');
			    $("#sqlInput").append(sqlInput);
				$("#sqlInput").append('<input style="width:70px" type="button" value="测试提交" class="btn btn-primary pull-right" onclick="sqlQuery(\''+outputType+'\')"/>');
				console.log(JSON.stringify(obj))
        	}else{
				$(".modal .modal-title").text("接口名称：");
        	}
        }
    }); 
	$('#mymodal-data').modal();
};
//SQL提交事件
function sqlQuery(outputType){
	for(var i=0;i<sqlList.length;i++){
    	var key=sqlList[i];
    	var co=$("#"+sqlList[i]).val();
    	obj[key] = co; 	
    }
	obj.currpage = $("#pageNum").val();
	obj.pagerow = $("#pageSize").val();
	if(outputType == "JSON"){
		//输出类型为JSON
		$.ajax({
	        type: "get",
	        url: dataApiURL +"interface/getData",
	        async: false,
	        contentType: "application/x-www-form-urlencoded",
//	      	contentType: "application/json",
	        data:obj,
	        success: function(r){
	        	console.log(r);
	            if(r.code=="0000"){
					let btn = document.querySelector('#json');
	                btn.textContent = JSON.stringify(r.rows, null, '  ');
	           	}else{
	                let btn = document.querySelector('#json');
	                btn.textContent=JSON.stringify(r.msg, null, '  ')
	        	}
	                
	        }
	    });
	}else{
		//输出类型为txt
		obj.token = token;
		options = {
			url: "/dataApi/interface/downloadData",
			data:obj,
		};
		var config = $.extend(true, {
			method: 'post'
		}, options);
		var $iframe = $('<iframe id="down-file-iframe" />');
		var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
		$form.attr('action', config.url);
		for(var key in config.data) {
			$form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
		}
		$iframe.append($form);
		$(document.body).append($iframe);
		$form[0].submit();
		$iframe.remove();
	}
}


//复制按钮事件绑定
 function copyText() {
   var input = document.getElementById("input");
   input.select(); // 选中文本
   document.execCommand("copy"); // 执行浏览器复制命令
   alert("复制成功");
  }

//删除接口
function deletRow(rptId){
    var rptId=rptId.split(",")
    console.log(rptId);
	vm.title = "删除"; 
    confirm('确定要删除选中的记录？', function(){
        $.ajax({
            type: "POST",
            url: dataApiURL + "analysisSql/delete",
            contentType: "application/json",
            data: JSON.stringify(rptId),
            success: function(r){
                console.log(r);
                if(r.code == 0){
                    alert('操作成功', function(){
                        vm.reload();
                    });
                }else{
                    alert(r.msg);
                }
            }
        });
    });
}

//修改接口名称
function newInterName(rptId,obj){
	var url="analysisSql/update";
    var url1="analysisSql/info";
	var $ele=$(obj).prev();
    var oldName=$(obj).prev().val();
     //点击事件
    $ele.attr("disabled",false);
	$.ajax({
        type: "get",
        url: dataApiURL + url1,
        contentType: "application/json",
        data: {rptId:rptId},
        success: function(r){
        	if(r.code == 0){
        		vm.ipt.apiModule=r.ipt.apiModule;
        		vm.ipt.apiSystem=r.ipt.apiSystem;
        		vm.ipt.interName=r.ipt.interName;
        		vm.ipt.isDimension=r.ipt.isDimension.name;
        		vm.ipt.orderNum=r.ipt.orderNum;
        		vm.ipt.paging=r.ipt.paging;
        		vm.ipt.rptId=r.ipt.rptId;
        		vm.ipt.sqlDbtype=r.ipt.sqlDbtype;
        		vm.ipt.sqlSummary=r.ipt.sqlSummary;
        		vm.ipt.sqlText=r.ipt.sqlText;
        	}
            
        }
    }); 
    //文本框获得焦点，将光标定位到文本框input最后
	$ele.val("").focus().val(oldName);
    //失去焦点，保存接口名
    $ele.blur(function () {
    	$ele.attr("disabled",true);
        vm.ipt.interName=$ele.val();
        if(oldName == vm.ipt.interName){
        	alert("您没有修改名称！")
        }else{
        	$.ajax({
	            type: "POST",
	            url: dataApiURL + url,
	            contentType: "application/json",
	            data: JSON.stringify(vm.ipt),
	            success: function(r){
	                if(r.code === 0){
	                    alert('修改接口名称成功', function(){
	                        vm.reload();
	                    });
	                }else{
	                    alert(r.msg);
	                }
	            }
	        }); 
        }
        
    });
}
var currentPage = 1;
var pageSize = 9;
function render() {
	var queryData = {};
	queryData.currpage=currentPage;
    queryData.pagerow=pageSize;
    queryData.rptId="dsb_getInterName";
	if(vm.q.interName != null && vm.q.interName != '' && typeof(vm.q.interName) != undefined){
    	queryData.p_inter_name=vm.q.interName;
    }
    if(vm.q.system != '全选' && vm.q.system != null && vm.q.system != '' && typeof(vm.q.system) != undefined){
    	queryData.p_system=vm.q.system;
    }
    if(vm.q.module != '全选' && vm.q.module != null && vm.q.module != '' && typeof(vm.q.module) != undefined){
    	queryData.p_module=vm.q.module;
    }
    if(vm.q.level != '全选' && vm.q.level != null && vm.q.level != '' && typeof(vm.q.level) != undefined){
    	queryData.p_level=vm.q.level;
    }
    if(vm.q.sqlDbtype != '全选' && vm.q.sqlDbtype != null && vm.q.sqlDbtype != '' && typeof(vm.q.sqlDbtype) != undefined){
    	queryData.p_sqlDbtype=vm.q.sqlDbtype;
    }
    $.ajax({
        url:bURL,
        data:queryData,
        dataType: "json",
        success: function (result) {
			var quareHtml="";
			$("#quare").html(quareHtml);
            if(result.code == 0){
//          	$(".fixed-table-pagination").css("display","none");
            	var data = result.data.rows;
            	console.log(data)
            	if(data.length>0){
            		if(vm.flag == true){
            			$("#page").removeAttr("style");
            			$(".fixed-table-pagination").css("display","none");
            		}else{
            			$("#page").attr("style");
            			$("#page").css("display","none");
            			$(".fixed-table-pagination").css("display","block");
            		}
            		for(var i = 0;data.length>i;i++){
	            		quareHtml +='<div class="dataList">'+
	            						'<ul>'+
	            							//鼠标上移遮罩层
	            							'<li style="display:none">'+
	            								'<label><i class="glyphicon glyphicon-search preview" style="margin-right: 10px;" title="预览" onclick="preview(\''+data[i].rptId+'\')"></i>'+
	            									'<i class="glyphicon glyphicon-send" title="修改" onclick="revision(\''+data[i].rptId+'\')"></i></label>'+
	            								'<span onclick="editRow(\''+data[i].rptId+'\')">编辑</span>'+
	            								'<label><img src="../../static/img/copy.png" title="复制链接"><i class="glyphicon glyphicon-trash" onclick="deletRow(\''+data[i].rptId+'\')" title="删除"></i></label>'+
	            								'</li>'+
	            							'<li><table>'+
	            								'<tr><td>编码：</td><td title="'+data[i].rptId+'">'+data[i].rptId+'</td></tr>'
	            								//系统
	            								if(data[i].apiSystem != undefined && data[i].apiSystem != null && data[i].apiSystem != ""){
	            									quareHtml+='<tr><td>系统：</td><td title="'+data[i].apiSystem+'">'+data[i].apiSystem+'</td></tr>'
	            								}else{
	            									quareHtml+='<tr><td>系统：</td><td>-</td></tr>'
	            								}
	            								//模块
	            								if(data[i].apiModule != undefined && data[i].apiModule != null && data[i].apiModule != ""){
	            									quareHtml+='<tr><td>模块：</td><td title="'+data[i].apiModule+'">'+data[i].apiModule+'</td></tr>'
	            								}else{
	            									quareHtml+='<tr><td>模块：</td><td>-</td></tr>'
	            								}
	            								//级别
	            								if(data[i].apiLevel != undefined && data[i].apiLevel != null && data[i].apiLevel != ""){
	            									quareHtml+='<tr><td>级别：</td><td title="'+data[i].apiLevel+'">'+data[i].apiLevel+'</td></tr>'
	            								}else{
	            									quareHtml+='<tr><td>级别：</td><td>-</td></tr>'
	            								}
	            								quareHtml+='<tr><td>数据库：</td><td title="'+data[i].sqlDbtype+'">'+data[i].sqlDbtype+'</td></tr>'
	            							quareHtml+='</table></li>'+
	            							'<li><input type="text" disabled="disabled" title="'+data[i].interName+'" value="'+data[i].interName+'"><i class="glyphicon glyphicon-edit editInterName" title="修改接口名称" onclick="newInterName(\''+data[i].rptId+'\',this)"></i></li>'+
	            						'</ul>'+
	            					'</div>'
	            	}
            	}else{
            		$("#page").attr("style");
            		$('#page').css("display","none");
            		quareHtml="<div style='width:100%;text-align:center;background:#fff'>没有找到匹配的记录</div>"
            	}
            	$("#quare").append(quareHtml);
            	
	            // 调用分页函数.参数:当前所在页, 总页数(用总条数 除以 每页显示多少条,在向上取整), ajax函数
	            setPage(currentPage, result.data.total.totalpage, render);
	            
			    $(".dataList li").each(function(index){
			         //移入事件
					$(this).mouseover(function(obj) {
				        $(this).parents(".dataList").find("ul li:first-child").css("display","flex");
				    });
				    //移出事件
				    $(this).mouseout(function(obj) {
				        $(this).parents(".dataList").find("ul li:first-child").css("display","none");
				    });
				});
				
            }else{
                alert(result.msg);
            }
        }
    })
}
	
	
/**
 *
 * @param pageCurrent 当前所在页
 * @param pageSum 总页数
 * @param callback 调用ajax
 */
function setPage(pageCurrent, pageSum, callback) {
	if(pageSum===0){
		pageSum=1;
	}else{
		var options={
		    bootstrapMajorVersion:1, //版本
		    currentPage:pageCurrent, //当前页数
		    numberOfPages:5, //最多显示Page页
		    totalPages:pageSum, //所有数据可以显示的页数
		    itemTexts: function (type, page, current) { //修改显示文字
		        switch (type) {
		            case "first":
		                return "第一页";
		            case "prev":
		                return "上一页";
		            case "next":
		                return "下一页";
		            case "last":
		                return "最后一页";
		            case "page":
		                return page;
		        }
		    },
		    onPageClicked:function (event,originalEvent,type,page) {
		            // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
		            currentPage = page
		            render();
	//		            callback && callback()
		    }
	    }
		$("#page").bootstrapPaginator(options);
	}
	
}
/*
 *做一些初始化的动作
 */
function initPage(){

}