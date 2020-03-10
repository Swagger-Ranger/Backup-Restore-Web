var SYS_ID;
var TBL_ID;
    //初始化表格
    function gettable(SYS_ID,TBL_ID){
    $('#dataListGrid').bootstrapTable({
        url: baseURL + 'dataChange/detail/list', // 接口 URL 地址
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
            data.startDt=$('#searchStartDt').val().replace('-','').replace('-','');
            data.sysId=SYS_ID;
            data.tblId=TBL_ID;
            data.FLD_NM=$('#tblNm').val();
            data.FLD_ID=$('#fldId').val();
            data.MDF_DTL=$('#testSelect option:selected') .val();
            return data;
        },
        pageNumber: 1,
        height: ($(window).height()-30),
        pageSize: 20, // 设置默认分页为 10
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
        detailView: false,
        height:$(window).height()-18-$("#table_toolbar").height(),
        columns: [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:false
        },{
            field: 'FLD_ID',//json
            title: '字段名称',//显示名
            align: 'center',
            formatter:function(value,row,index){
                if(value==" " || value ==null){
                    var html_='<label class="text control-label"  title="'+value+'">'+' '+'</label>';
                }else{
                    var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                }
                
                return html_; 
            }
//          visible: false//隐藏列
        },{
            field: 'FLD_NM',
            title: '字段描述',
            sortable: false,
            align: 'center',
            formatter:function(value,row,index){
                if(value==" " || value ==null){
                    var html_='<label class="text control-label"  title="'+value+'"></label>';
                }else{
                    var html_='<label class="text control-label"  title="'+value+'">'+value+'</label>';
                }
                return html_; 
            }
        },{
            field: 'DAT_TYP',
            title: '字段类型',
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
            field: 'WTHR_NULL',
            title: '是否可为空',
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
            field: 'FLD_LEN',
            title: '字段长度',
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
            field: 'PRCS',
            title: '字段精度',
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
        }

        ,{
            field: 'MDF_DTL',
            title: '变化类型',
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
        }]
    });
}

$(function(){
    SYS_ID=T.p('SYS_ID');
    TBL_ID=T.p('TBL_ID');
    console.log(TBL_ID);
    console.log(SYS_ID);
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
    var startDt=T.p('startDt');
    $("#rptData").css('height',$(window).height()-$("#table_toolbar").height());
    //$("#rptData").style.height=$(window).height()-18-$("#table_toolbar").height();
    $('#searchStartDt').val(startDt);
    gettable(SYS_ID,TBL_ID);
    $('#searchStartDt').datetimepicker().on('changeDate', function(ev){
        $('#dataListGrid').bootstrapTable('destroy');
        gettable(SYS_ID);
    });
    $("#tblNm").change(function(){
        $('#dataListGrid').bootstrapTable("destroy"); 
        gettable(SYS_ID,TBL_ID);
    });
    $("#fldId").change(function(){
        $('#dataListGrid').bootstrapTable("destroy"); 
        gettable(SYS_ID,TBL_ID);
    });

    $("#testSelect").change(function(){
        console.log(""+$('#testSelect option:selected') .val()); 
        $('#dataListGrid').bootstrapTable("destroy"); 
        gettable(SYS_ID,TBL_ID);
    });
})

function refreashTable(){
        $('#dataListGrid').bootstrapTable('destroy');
        gettable(SYS_ID,TBL_ID);
}

function updateTable() {
        // body...
        btnOfExport();
}

function btnOfExport(){
    
    var startDt=$('#searchStartDt').val().replace('-','').replace('-','');
    var FLD_NM=$('#tblNm').val();
    var FLD_ID=$('#fldId').val();
    var MDF_DTL=$('#testSelect option:selected') .val();
    var xurl='&sysId='+SYS_ID+'&tblId='+TBL_ID;
    if(FLD_ID!='' && FLD_ID!=null){
        xurl=xurl+'&FLD_ID='+FLD_ID;
    }
    if(MDF_DTL!='' && MDF_DTL!=null){
        xurl=xurl+'&MDF_DTL='+MDF_DTL;
    }
    if(startDt!='' && startDt !=null){
        xurl=xurl+'&startDt='+startDt;
    }
    if(FLD_NM!='' && FLD_NM!=null){
        xurl=xurl+'&tblNm'+FLD_NM;
    }
    var fileName=['FLD_ID','FLD_NM','DAT_TYP','WTHR_NULL','FLD_LEN','PRCS','MDF_DTL'];
    var title=['字段名称','字段描述','字段类型','是否为空','字段长度','字段精度','变化类型'];

    var url = baseURL + 'iptFunc/exportExcel?name=数据变更详情&title='+title+'&fileName='+fileName+xurl;

    submitUrlForm(url);
}