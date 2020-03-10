$(function(){
   // console.log(decodeURI(window.location.href));
	var TBL_NM = T.p('TBL_NM');
	var TBL_ID=T.p('TBL_ID');
	var US_DB=T.p('US_DB');
	var FLD_ID=T.p('FLD_ID');
    var SYS_ID=T.p('SYS_ID');
    //console.log(SYS_ID);
	$("#kuaijiText").text(US_DB);
	$("#chunaText").text(FLD_ID);
	$("#prjNmText").text(TBL_ID);
	$("#productCodeText").text(TBL_NM);
    $("#sysId").text(SYS_ID);
	var height=$("#searchContainer").height();
    $('#reportTable').bootstrapTable("destroy"); 
	gettable(TBL_ID,SYS_ID);
	$("#fldId").change(function(){
		$('#reportTable').bootstrapTable("destroy"); 
		gettable(TBL_ID,SYS_ID);
	});
});

function gettable(TBL_ID,SYS_ID){
    $('#reportTable').bootstrapTable({
        url: managerURL + 'dataDictory/filLdlist', // 接口 URL 地址
        method: 'post',
        contentType: "application/x-www-form-urlencoded",
        pagination: true, // 开启分页功能
        sidePagination : 'server',//服务端分页
        queryParamsType:'',
        queryParams:function(params){
            var data = {};
            data.page=params.pageNumber;
            data.rows=params.pageSize;
            data.sortName=params.sortName;
            data.FLD_ID=$('#fldId').val();
            data.TableId=TBL_ID;
            data.sysId=SYS_ID;
            return data;
        },
        pageNumber: 1,
        pageSize: 20, // 设置默认分页为 10
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
        height:$(window).height()-$("#searchContainer").height()-8-$("#table_toolbar").height(),
        columns: [{
            	field: 'fldId',//json
            	title: '字段名称',//显示名
            	align: "center",
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                        var html_='<label class="text control-label"  title="'+value+'">'+' '+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }
        	},{
                field: 'fldNm',
                title: '字段解释',
                sortable: false,
                align: 'center',
                formatter:function(value,row,index){
                    var html_= '<input class="isInput form-control actValSave actImportPlug"  placeholder="请输入"/>'
                    if(value==" " || value ==null){
                    html_+='<label class="control-label showImportText noValueText" >请输入</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }

        },{
            	field:'datTyp' ,
            	title: '类型',
            	sortable: false,
            	align: 'center',
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                        var html_= '<input class="isInput form-control actValSave actImportPlug"  placeholder="请输入"/>'
                        html_+='<label class="text control-label"  title="'+value+'">'+' '+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }
        	},{
            	field:'wthrNull' ,
            	title: '是否为空',
            	sortable: false,
            	align: 'center',
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                       var html_= '<input class="isInput form-control actValSave actImportPlug"  placeholder="请输入"/>'
                        html_+='<label class="text control-label"  title="'+value+'">'+' '+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }
        	},{
            	field: 'fldLen',
            	title: '字段长度',
            	sortable: false,
            	align: 'center',
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                        var html_= '<input class="isInput form-control actValSave actImportPlug"  placeholder="请输入"/>'
                    html_+='<label class="control-label showImportText noValueText" >'+''+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }
        	},{
                field: 'prcs',
                title: '字段精度',
                sortable: false,
                align: 'center',
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                        var html_= '<input class="isInput form-control actValSave actImportPlug"  placeholder="请输入"/>'
                    html_+='<label class="control-label showImportText noValueText" >'+''+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }
            },{
            	field: 'wthrPrmKey',
            	title: '是否主键',
            	sortable: false,
            	align: 'center',
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                        var html_='<label class="text control-label"  title="'+value+'">'+' '+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }
        	},{
            	field: 'mdfTm',
            	title: '字段修改时间',
            	sortable: false,
            	align: 'center',
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                        var html_='<label class="text control-label"  title="'+value+'">'+' '+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }

        },{
                field: 'tblId',//json
                title: '字段名称',//显示名
                align: "center",
                visible:false,
                formatter:function(value,row,index){
                    if(value==" " || value ==null){
                        var html_='<label class="text control-label"  title="'+value+'">'+' '+'</label>';
                    }else{
                        var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                    }
                    return html_; 
                }
            }],
        onClickCell : function(field,value,row,$element){
            var upIndex = $element[0].parentElement.rowIndex -1;
            if(field == "fldNm"){
                //修改字段精度
                if(value==null || value ==" "){
                    $element[0].innerHTML="<input  id='inputCell' class='form-control' type='text' name='inputCell'  value='"+''+"'>";
                }else{
                    $element[0].innerHTML="<input  id='inputCell' class='form-control' type='text' name='inputCell'  value='"+value+"'>";
                }
                $("#inputCell").focus();
                $("#inputCell").blur(function(){
                    var newValue = $("#inputCell").val();
                    console.log(newValue);
                        $(this).remove();
                        $('#reportTable').bootstrapTable('updateCell', {
                            index: upIndex,
                            field:field,
                            value: newValue
                        });
                        if(newValue == value){
                            //两次值相等不修改
                            refreshTable();
                        }else{
                            //做后台修改操作
                            console.log(row);
                            updateTable(row);
                        }
                })
                
            }
        }
    });
}


function btnOfExport(TBL_ID){
    
    var y=$('#fldId').val();
    var xurl='&tableId='+$("#prjNmText").text();
    if(y!='' && y!=null){
        xurl+='&fldId='+y
    }
    var fileName=['fldId','fldIdNm','datTypt','wthrNull','fldId','prcs','wthrNull'];
    var title=['字段名称','字段解释','类型','是否为空','字段长度','字段精度','是否主键'];

    var url = managerURL + 'iptFunc/exportExcel?name=字典明细&title='+title+'&fileName='+fileName+xurl;
    submitUrlForm(url);
}

function ExportTable() {
        //console.log($('#sysId').val());
        btnOfExport($("#prjNmText").text());
    }

function refreshTable(){
    console.log($('#sysId').text());
    var SYS_ID=$('#sysId').text();
    var TBL_ID=$("#prjNmText").text();
    $('#reportTable').bootstrapTable("destroy"); 
    gettable(TBL_ID,SYS_ID)
}

function checkRate(s){//是否为正整数
    var re = /^[0-9]*[1-9][0-9]*$/ ;
    return re.test(s)
}

function updateTable(row){
    $.ajax({
        type: "POST",
        url: managerURL + "dataDictory/update",
        contentType: "application/json",
        data: JSON.stringify(row),
        success: function(r){
            
        }
    });
}


function submitUrlForm(url){
    url = encodeURI(url);
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('target', '');
    form.attr('method', 'post');
    form.attr('action',  url);
    
    var input2 = $('<input>');
    input2.attr('type', 'hidden');
    input2.attr('name', 'token');
    input2.attr('value', token);
    
    $('body').append(form);
    form.append(input2);
    form.submit();
    form.remove();
}
