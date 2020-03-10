//调用
var tableInit = function(){
    var url = portalURL + 'sys/resources/list'; // 接口 URL 地址
    var params = {
            // resType:{
            //     val:$('#resType').val(),
            //     txt:$('#resType').find("option:selected").text()
            // },
            resType:$('#resType').val(),
            resName:$('#resName').val()
    };
    var columns = [{ // 列设置
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
            field: 'resourcesId',
            width:100,
            title: '资源编码'
        },{
            field: 'viewiId',
            width:100,
            title: '门户编码-viewiId',
            formatter: function(value,row,index){
                return value;
            }
        },{
            field: 'resType',
            width:100,
            title: '资源类型',
            formatter: function(value,row,index){
                return row.resType.txt;
            }
        },{
            field: 'resName',
            title: '资源名称',
            width: 100,
        },{
            field: 'resUrl',
            title: '资源URL',
            width: 60,
            formatter: function(value,row,index){
                if(value == ""||value == null||value ==undefined)
                    return '';
                else
                    return '<span class="label label-success pointer" onclick="preview('+JSON.stringify(row).replace(/\"/g,"'")+')" >预览</span>';
            }
            // formatter: function(value,row,index){
            //     return '<span class="label label-success pointer" onclick="preview(\''+row.resourcesId+'\',\''+row.resName+'\',\''+row.resUrl+'\')">预览</span>';
            // }
        },{
            field: 'createTime',
            title: '创建时间',
            width: 120,
            formatter: function(value,row,index){
                return commonUtil.getFormatDate2(value);
            }
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
    
    bindResType();

    tableInit();

    $("#btnSearch,#btnRefresh").click(function(){
        refreshTable();
    });
});

function bindResType(){
    $.get(portalURL + "sys/resources/getResType", function(r){
        var resType = document.getElementById("resType");
        $.each(r.list, function (index, item) {
            var op = new Option(item.dsp,item.val);
            resType.options.add(op);
        })
    })
}

function refreshTable(){
    var opt = {
        silent: true,
        query:{
            resType:$('#resType').val(),
            resName:$('#resName').val()
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}

function preview(row){
    url = encodeURI(row.resUrl);
    id = row.resourcesId;
    title =row.resName;
    window.parent.nthTabs.addTab({
        id: id,
        title: title,
        content: getContent(url),
    }).setActTab('#' + id);
}




