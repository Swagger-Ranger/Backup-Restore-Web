var list=[];
$(function(){
    getOption();
    list=["MYSQL","SQL SERVER","ORACLE","SQLite"];
    addChangeEventToSelect();
    gettable(list);
    $("#dbType").change(function(){
        $('#dataListGrid').bootstrapTable("destroy"); 
        gettable(list);
    });
    $("#fldId").change(function(){
        $('#dataListGrid').bootstrapTable("destroy"); 
        gettable(list);
    });
})

function gettable(list){
    $('#dataListGrid').bootstrapTable({
        url: baseURL + 'dataSource/list', // 接口 URL 地址
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
            data.DB_TYP=$("#dbType option:selected").val();
            data.DAT_SRC_NM=$("#fldId").val();
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
        height:$(window).height()-$("#searchContainer").height()-8-$("#table_toolbar").height(),
        singleSelect: true,
        columns: [{ // 列设置
            checkbox:true,
            visible:true
        },{
            field: 'DAT_SRC_NM',
            title: '数据源名称',
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
            field: 'SYS_ID',
            title: '系统ID',
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
            field: 'DB_NM',
            title: '数据库名称',
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
            field: 'DB_IP_ADR',
            title: '机器地址',
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
            field: 'DB_TYP',
            title: '数据库类型',
            sortable: false,
            align: 'center',
            formatter:function(value,row,index){
                var _html = '<select style="display: block;" data-act-val="'+index+'"  data-old-val="'+index+'" data-fld-dsp-nm="" data-link-val-id="'+index+'" data-row-id="'+index+'" class="isSelect form-control actImportPlug actValSave dbNm" data-lbl-typ="select" >';
                _html += '<option value=""> </option>'; 
                for(var i=0;i<list.length;i++){
                    if(list[i]==value){
                        _html += '<option selected="selected" value='+list[i]+'>'+list[i]+'</option>';
                    }else{
                        _html += '<option value='+list[i]+'>'+list[i]+'</option>';
                    }
                }
                return _html;
            }
        },{
            field: 'DB_INST_NM',
            title: '数据库实例名',
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
            field: 'DB_INST_PORT_NBR',
            title: '端口号',
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
            field: 'USR_NM',
            title: '系统用户',
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
            field: 'PSW',
            title: '密码',
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
            field: 'START_IND',
            title: '启用标识',
            sortable: false,
            align: 'center',
            formatter: function (value, row, index) {
                return '<button type="button" data-row-id="'+value+'" value="'+value+'" class="btn '+ (value==1?"success":"danger") +' btn-xs" style="cursor:inherit;">'+ (value==1?"启用":"禁用") +'</button>';
            }
        },{
           field: 'DB_ID',
            title: '数据库ID',
            sortable: false,
            align: 'center', 
            visible:false,
        },{
           field: 'DB_INST_ID',
            title: '实例ID',
            sortable: false,
            align: 'center', 
            visible:false,
        },{
           field: 'USR_ID',
            title: '用户ID',
            sortable: false,
            align: 'center', 
            visible:false,
        }
        ],
        onLoadSuccess: function(data){  //加载成功时执行  
            //console.log(data);
            tableData = data;
            //时间的需要等表格单元格加载完再进行初始化
            //initTableCell();
        },
        onClickCell : function(field,value,row,$element){
            var upIndex = $element[0].parentElement.rowIndex -1;
            var dbId='';
            if(field=="DB_TYP"){
            }else if(field == "START_IND"){
                console.log("修改启用标志");
                $element[0].innerHTML="<input id='tt'  type='checkbox' checked class='checkbox'>";
                $(".checkbox").bootstrapSwitch({  
                    onText : "启用",      // 设置ON文本  
                    offText : "禁用",    // 设置OFF文本  
                    onColor : "success",// 设置ON文本颜色     (info/success/warning/danger/primary)  
                    offColor : "danger",  // 设置OFF文本颜色        (info/success/warning/danger/primary)  
                    size : "small",    // 设置控件大小,从小到大  (mini/small/normal/large)  
                    handleWidth:"35",//设置控件宽度
                    // 当开关状态改变时触发  
                    onSwitchChange : function(event, state) {
                        console.log(state);
                        console.log(event);  
                        var ProductId = event.target.defaultValue;
                        if(state==true){
                            $("#tt").val("1");
                        }else{
                            $("#tt").val("0");
                        }
                    }  
                });
                if(value == "1"){
                //启用
                    $('#tt').bootstrapSwitch('state',true,true);
                }else{
     
                    $('#tt').bootstrapSwitch('state',false,true);
                }
                    $("#tt").focus();
                    $("#tt").blur(function(){
                    //$("#targetUser").change(function(){
                        var newValue=$("#tt").val();
                        row[field] = newValue;
                        $(this).remove();
                        $('#dataListGrid').bootstrapTable('updateCell', {
                            index: upIndex,
                            field:field,
                            value: newValue
                        });
                        if(newValue ==value){
                        //修改前后值相等，不做后台修改
                        }else{
                        //后台修改操作
                        console.log(row);
                        var falg=getcheck(row);
                        if(falg){
                            addTables(row);
                        }else{
                            //数据不完整不修改
                        
                        }
                        }
                    })

            }else{
                if(value==null || value ==" "){
                    $element[0].innerHTML="<input  id='inputCell' class='form-control' type='text' name='inputCell'  value='"+''+"'>";
                }else{
                    $element[0].innerHTML="<input  id='inputCell' class='form-control' type='text' name='inputCell'  value='"+value+"'>";
                }
                
                $("#inputCell").focus();
                $("#inputCell").blur(function(){
                    var newValue =$("#inputCell").val();
                    row[field] = newValue;
                    $(this).remove();
                    $('#dataListGrid').bootstrapTable('updateCell', {
                        index: upIndex,
                        field:field,
                        value: newValue
                    });
                    //修改操作
                    var falg=getcheck(row);
                    console.log(falg);
                    if(falg){
                        if(newValue ==value){
                        }else{
                            addTables(row);
                        }
                    }
                    
                })
            }
        }
    });
}


function addTables(row){
    console.log(row);
    $.ajax({
        type: "POST",
        url: baseURL + "dataSource/saveorUpdate",
        contentType: "application/json",
        data: JSON.stringify(row),
        success: function(r){
           $('#dataListGrid').bootstrapTable('destroy');
           gettable(list);
        }
    });
}


function getOption(){
    $.ajax({
        type: "GET",
        url: baseURL + "dataSource/option",
        contentType: "application/json",
        data: {
        },
        success: function(r){
            $("#dbType").empty();
            $("#dbType").append('<option value="全部">'+"全部"+'</option>');
            for(var i=0;i<r.list.length;i++){
                $("#dbType").append('<option value="'+r.list[i].DB_TYP+'">'+r.list[i].DB_TYP+'</option>');
            }
        }
    })
}
//刷新
function refreshTable(){
    $('#dataListGrid').bootstrapTable('destroy');
    gettable(list);
}


function btnOfDelete(){
    var row= $("#dataListGrid").bootstrapTable('getSelections');
    if(row.length>=1){
        //做删除操作
        var valIds = "";
        for(var i=0;i<row.length;i++){
            valIds += (i!=0?",":"")+row[i].DAT_SRC_ID;
        }
        $.ajax({
            type:'post',
            url:baseURL + 'dataSource/deleteData',
            data: {
                DAT_SRC_ID:valIds
            },
            contentType: "application/x-www-form-urlencoded; charset=utf-8", 
            success:function(r) {
                $('#dataListGrid').bootstrapTable('destroy');
                gettable(list);
            }
        });
    }else{
        $('#tipResult').modal('show');
        $('#tipResultMess').text("请至少选择一条数据！");
    }
}

//删除
function deleteTable(){
    btnOfDelete();
}

function updateTable(){
    btnOfExport();
}

function btnOfExport(){
    
    var DB_TYP=$("#dbType option:selected").val();
    var DAT_SRC_NM=$('#fldId').val();
    var xurl='';
    if(DB_TYP!='' && DB_TYP!=null){
        xurl=xurl+'&DB_TYP='+DB_TYP;
    }
    if(DAT_SRC_NM!='' && DAT_SRC_NM!=null){
        xurl=xurl+'&MDF_DTL='+MDF_DTL;
    }
    var fileName=['DAT_SRC_NM','SYS_ID','DB_NM','DB_IP_ADR','DB_TYP','DB_INST_PORT_NBR','DB_INST_NM','USR_NM','PSW','START_IND'];
    var title=['数据源名称','系统ID','数据库名称','机器地址','数据库类型','端口号','数据库实例名','系统用户','密码','启用标识'];

    var url = baseURL + 'iptFunc/exportExcel?name=数据源配置&title='+title+'&fileName='+fileName+xurl;
    //var url=baseURL+'iptFunc/export';
    submitUrlForm(url);
}

function addRow(){
    var count = $('#dataListGrid').bootstrapTable('getData').length;
    // newFlag == 1的数据为新规的数据
    $('#dataListGrid').bootstrapTable('insertRow',{index:count,row:{newFlag:"1"}});
}


//新增或修改
//获取数据名称
function getDbNm(value,row,index){
    
    $.ajax({
        type: "GET",
        async: false, 
        url: baseURL + "dataSource/Dataoption",
        contentType: "application/json",
        data: {
        },
        success: function(r){
            valList=r.list;
        }
    })
    var _html = '<select style="display: block;"  data-fld-dsp-nm="'+index+'" data-old-val="'+value+'" data-row-id="'+index+'" class="isSelect form-control actImportPlug actValSave dbNm"  data-lbl-typ="select" >';
    _html += '<option value=""> </option>';
    for(var i=0;i<valList.length;i++){
        if(valList[i].DB_NM==value){
            _html += '<option selected="selected" value='+valList[i].DB_ID+'>'+valList[i].DB_NM+'</option>';
        }else{
            _html += '<option value='+valList[i].DB_ID+'>'+valList[i].DB_NM+'</option>';
        }
    }
    _html += '</select>';
    return _html;
}

//修改实例名称
function getDbInstNm(value,row,index){
    dbId=row.DB_ID;
    $.ajax({
        type: "GET",
        async: false, 
        url: baseURL + "dataSource/DataPort",
        contentType: "application/json",
        data: {
            dbId:dbId
        },
        success: function(r){
            dbInstList=r.list;
        }                  
    })
    var _html = '<select style="display: block;"  data-fld-dsp-nm="'+index+'" data-old-val="'+value+'" data-row-id="'+index+'" class="DbInstNm isSelect form-control actImportPlug actValSave "  data-lbl-typ="select" >';
    _html += '<option value=""> </option>';
    for(var i=0;i<dbInstList.length;i++){
        if(dbInstList[i].DB_INST_NM==value){
            _html += '<option selected="selected" value='+dbInstList[i].DB_INST_ID+'>'+dbInstList[i].DB_INST_NM+'</option>';
        }else{
            _html += '<option value='+dbInstList[i].DB_INST_ID+'>'+dbInstList[i].DB_INST_NM+'</option>';
        }
    }
    _html += '</select>';
    return _html;
}

//修改抽取目标用户

function getTargetUser(value,row,index){
    $.ajax({
        type: "GET",
        async: false, 
        url: baseURL + "dataSource/DataTargetUser",
        contentType: "application/json",
        data: {
            dbId:row.DB_ID,
            dbInstId:row.DB_INST_ID
        },
        success: function(r){
            targetUser=r.list
        }
    })
    var _html = '<select style="display: block;"  data-fld-dsp-nm="'+index+'" data-old-val="'+value+'" data-row-id="'+index+'" class="tarGetUsr isSelect form-control actImportPlug actValSave "  data-lbl-typ="select" >';
    _html += '<option value=""> </option>';
    for(var i=0;i<targetUser.length;i++){
        if(targetUser[i].USR_NM==value){
            _html += '<option selected="selected" value='+targetUser[i].USR_ID+'>'+targetUser[i].USR_NM+'</option>';
        }else{
            _html += '<option value='+targetUser[i].USR_ID+'>'+targetUser[i].USR_NM+'</option>';
        }
    }
    _html += '</select>';
    return _html;
}

function addChangeEventToSelect(){
    $('#dataListGrid').on('change','td .dbNm', function () {
        var index =  $(this).attr('data-act-val');
        var row= tableData.rows[index];
        console.log(row);
        var _val = $(this).val();
        row["DB_TYP"]=_val;
        for(var i=0;i<list.length;i++){
            if(list[i].DB_TYP==_val){
                row["DB_TYP"]=list[i];
            }
        }
        console.log(row);
        var flag=getcheck(row);
        if(flag){
            //修改
        }else{
            //数据不完全,不修改
            //$('#tipResult').modal('show');
        //$('#tipResultMess').text("请全部输入在做修改或新增");
        }
        //addTables(row);

    })
}


function getcheck(row){
    if(row["DAT_SRC_NM"]==null || row["DAT_SRC_NM"]==" "){
        return false;
    }
    if(row["DB_INST_NM"]==null || row["DB_INST_NM"]==" "){
        return false;
    }
    if(row["DB_INST_PORT_NBR"]==null || row["DB_INST_PORT_NBR"]==" "){
        return false;
    }
    if(row["DB_IP_ADR"]==null || row["DB_IP_ADR"]==" "){
        return false;
    }
    if(row["DB_NM"]==null || row["DB_NM"]==" "){
        return false;
    }
    if(row["DB_TYP"]==null || row["DB_TYP"]==" "){
        return false;
    }
    if(row["PSW"]==null || row["PSW"]==" "){
        return false;
    }
    if(row["USR_NM"]==null || row["USR_NM"]==" "){
        return false;
    }
    if(row["SYS_ID"]==null || row["SYS_ID"]==" "){
        return false;
    }
    return true;
}



//跑数据

function runSeveral(){
    var row= $("#dataListGrid").bootstrapTable('getSelections');
    console.log(row);
    if(row.length>=1){
        //做删除操作
        var valIds = "";
        for(var i=0;i<row.length;i++){
            valIds += (i!=0?",":"")+row[i].DAT_SRC_ID;
        }
        console.log(row[0]);
        $.ajax({
            type: "POST",
            url: baseURL + "dataSource/runSeveral",
            contentType: "application/json",
            data: JSON.stringify(row[0]),
            success: function(r){
               
            }
        });
    }else{
        $('#tipResult').modal('show');
        $('#tipResultMess').text("请至少选择一条数据！");
    }
}

