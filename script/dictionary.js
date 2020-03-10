/*下拉树形图*/
    var setting = {
        view: {
            showIcon: true,//设置 zTree 是否显示节点的图标。默认值：true
            showLine: false//设置 zTree 是否显示节点之间的连线。默认值：true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid"
            }
        },
        callback: {
            onClick: onClick
        }
    };

    function onClick(e, treeId, treeNode) {
        console.log(treeNode.pid);
        console.log(treeNode.id);
        
        $('#txtTreeSelect').val(treeNode.name);
        $('#idTreeSelect').val(treeNode.id);
        $('#pidTreeSelect').val(treeNode.pid);
        console.log( $('#idTreeSelect').val());
        console.log($('#pidTreeSelect').val());
    }

    function showMenu() {
        var cityObj = $('#txtTreeSelect');
        var cityOffset = cityObj.offset();
        $("#menuContent").css({ left: cityOffset.left + "px", top: cityOffset.top + cityObj.outerHeight() + "px" }).slideDown("fast");
        $("body").bind("mousedown", onBodyDown);
    }

    function hideMenu() {
        $("#menuContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }
    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
            hideMenu();
        }
    }
    function updateTable() {
        // body...
        btnOfExport();
    }
    function select() {
        $('#reportTable').bootstrapTable("destroy"); 
        gettable();
        
    }
    $(document).ready(function () {
        getZtree();
        addClickEventToTab();
        gettable();
        addClickUpdateEventToTab();
    });

    function gettable(){
    $('#reportTable').bootstrapTable({
        url: managerURL + 'dataDictory/list', // 接口 URL 地址
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
            data.id= $('#idTreeSelect').val();
            data.pid=$('#pidTreeSelect').val();
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
        height:$(window).height()-36-8,
        /*responseHandler:function(res){
            console.log(res);
        },*/
        columns: [{
                field: 'no',
                title: '序号',
                align: "center",
                width: 50,
                formatter: function (value, row, index) {
                    //获取每页显示的数量
                    var pageSize=$('#reportTable').bootstrapTable('getOptions').pageSize;
                    //获取当前是第几页
                    var pageNumber=$('#reportTable').bootstrapTable('getOptions').pageNumber;
                    //返回序号，注意index是从0开始的，所以要加上1
                    return pageSize * (pageNumber - 1) + index + 1;
                }
            },{
            field: 'sysNm',//json
            title: '系统名称',//显示名
            align: "center",
        },{
            field:'sysId' ,
            title: '系统Id',
            sortable: false,
            align: 'center',
            visible:false
        },{
            field:'tblId' ,
            title: '表名',
            sortable: false,
            align: 'center',
        },{
            field:'uplTm' ,
            title: '上传时间',
            sortable: false,
            align: 'center',
            formatter: function(value,row,index){
                return commonUtil.getFormatDate2(value);
            }
        },{
            field:'mdfTm' ,
            title: '上次修改时间',
            sortable: false,
            align: 'center',
            formatter: function(value,row,index){
                return commonUtil.getFormatDate2(value);
            }
        },{
            field: 'usDb',
            title: '用户库',
            sortable: false,
            align: 'center',
            visible: false,
        },{
            field: 'fldId',
            title: '主键',
            sortable: false,
            align: 'center',
            visible: false,
        },{
            field: 'tblNm',
            title: '内容简介',
            sortable: false,
            align: 'center',

        }
        ,{
            field: 'val1',
            title: '明细',
            sortable: false,
            align: 'center',
            width:70,
            formatter: function(value, row, index) {
                var actions = [];
                //actions.push('<a class="btn btn-success btn-xs ' + '" href="dildSubs.html" οnclick="$.operate.edit(\'' + row.id + '\')"><i class="fa fa-edit"></i>查看</a>  ');
                actions.push('<a class="text control-tab" data-uni-id="'+'TBL_ID='+row.tblId+'&'+'TBL_NM='+row.tblNm+'&US_DB='+row.usDb+'&SYS_ID='+row.sysId+'&FLD_ID='+row.fldId+'" data-row-id="" data-val-id="" title="'+'字典明细'+'" dtl-tbl-url="modules/dataManager/metadata/fieldSubs.html?">'+value+'</a>');
                return actions.join('');
            }
        },{
            field: 'val2',
            title: '操作',
            sortable: false,
            align: 'center',
            width:150,
            formatter: function(value, row, index) {
                var actions = [];
                //actions.push('<a class="btn btn-success btn-xs ' + '" href="dildSubs.html" οnclick="$.operate.edit(\'' + row.id + '\')"><i class="fa fa-edit"></i>查看</a>  ');
                actions.push('<a class="text control-tab1" data-uni-id="'+row.tblId+'" data-row-id="" data-val-id="" title="'+'字典明细'+'" dtl-tbl-url="modules/dataManager/metadata/fieldSubs.html">'+value+'</a>');
                return actions.join('');
            }
        }],
        /*onClickCell:function(field, value, row, $element){//value当前点击列所在行的内容，可以直接理解为单元格的内容，row为当前点击列所在行的所有数据
            if(field =="prjfullnm"){
              layer.open({
                  type: 2,
                  title: '项目明细',
                  area:['90%','90%'],
                  content: 'test.html?id='+row.prjid+"|"+row.mon+"|"+row.prjfullnm
                });
            }
        }*/
    });
}

//下载
function btnOfExport(){
    
    var y=$('#idTreeSelect').val();
    var pid=$('#pidTreeSelect').val();
    var xurl=''

    xurl='&id='+y+'&pid='+pid;
    var fileName=['SYS_NM','TBL_ID','UPL_TM','MDF_TM','TBL_NM'];
    var title=['系统名称','表名','上传时间','上次修改时间','内容简介'];

    var url = managerURL + 'iptFunc/export?name=字典管理&title='+title+'&fileName='+fileName+xurl;

    submitUrlForm(url);
}

function openDetailRptTab(tabId,tabName,url){
    url = encodeURI(url);
    //console.log(nthTabs.getTabList());
    console.log(window.parent.nthTabs.getTabList());
    var list=window.parent.nthTabs.getTabList();
    for(var i=0;i<list.length;i++){
        console.log(list[i].title);
        if(list[i].title==tabName){
            console.log(tabName);
            window.parent.nthTabs.delTab(tabId);
        }
    }

    window.parent.nthTabs.addTab({
        id: tabId,
        title: tabName,
        content: getContent(url),
        active:true,
    }).setActTab('#' + tabId);
}

//查看添加点击事件
function addClickEventToTab(){
    $('#reportTable').on('click','td .control-tab', function () {
        var thisObj = $(this);

        //获得该条数据的VAL_ID（主键）
        var rowId = thisObj.attr('data-row-id');

        var a=thisObj.attr('data-uni-id');

        //var rowData = tableData.rows[rowId];
        var url = thisObj.attr('dtl-tbl-url')+a;
        console.log(url);
        var tabId ='rpt';
        console.log(thisObj.attr('title'));
        openDetailRptTab(tabId,thisObj.attr('title'),url);
    });
}
//下载添加点击事件
function addClickUpdateEventToTab(){
    $('#reportTable').on('click','td .control-tab1', function () {
        var thisObj = $(this);

        //获得该条数据的VAL_ID（主键）
        var rowId = thisObj.attr('data-row-id');
        var a=thisObj.attr('data-uni-id');

        //下载表明细
        var xurl='&tableId='+a;
        var fileName=['fldId','fldIdNm','datTypt','wthrNull','fldId','prcs','wthrNull'];
        var title=['字段名称','字段解释','类型','是否为空','字段长度','字段精度','是否主键'];

        var url = managerURL + 'iptFunc/exportExcel?name=字典明细&title='+title+'&fileName='+fileName+xurl;
    submitUrlForm(url);
    });
}

function getZtree(){
    $.ajax({
        type: "GET",
        url: managerURL + "dataDictory/ztree",
        contentType: "application/json",
        data: {
        },
        success:function(r){
            $.fn.zTree.init($("#treeDemo"), setting,r);
        }
    })
};
