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
        $('#txtTreeSelect').val(treeNode.name);
        $('#idTreeSelect').val(treeNode.id);
        $('#pidTreeSelect').val(treeNode.pid);
        $('#dataListGrid').bootstrapTable('destroy');
        gettable();
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

    $(document).ready(function () {
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
        $('#searchStartDt').val(commonUtil.getFormatDate(new Date()));
        getZtree();
        gettable();

        $('#searchStartDt').datetimepicker().on('changeDate', function(ev){
            $('#dataListGrid').bootstrapTable('destroy');
            gettable();
        });
        addClickEventToTab();
       $("#rptData").css('height',$(window).height()-$("#table_toolbar").height()-15);

    });

    function myTable(){
        $('#dataListGrid').bootstrapTable('destroy');
        gettable();
    }
    function updateTable() {
        // body...
        btnOfExport();
    }
    function refreshTable(){
        $('#dataListGrid').bootstrapTable('destroy');
        gettable();
    }

    //初始化表格
    function gettable(){
    $('#dataListGrid').bootstrapTable({
        url: baseURL + 'dataChange/list', // 接口 URL 地址
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
            data.tblNm=$('#tblNm').val();
            data.id=$('#idTreeSelect').val();
            data.pid= $('#pidTreeSelect').val();
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
        columns: [{ // 列设置
            field: 'state',
            checkbox:true, // 使用复选框
            visible:false
        },{
            field: 'STAT_DT',//json
            title: '日期',//显示名
//          visible: false//隐藏列
            formatter: function (value, row, index) {
                    return value.slice(0, -8);
            }
        },{
            field: 'SYS_NM',
            title: '系统',
            sortable: false,
        },{
            field: 'SYS_ID',
            title: '系统ID',
            sortable: false,
        },{
            field: 'TBL_NM',
            title: '表名称',
            sortable: false,
        },{
            field: 'TBL_ID',
            title: '表英文名',
            sortable: false,
            /*formatter: function(value,row,index){
                console.log(value);
                return commonUtil.getFormatDate2(value);
            }*/
        },{
            field: 'MDF_DTL',
            title: '版本修改内容',
            sortable: false,
        },{
            field: 'VAL_1',
            title: '明细',
            sortable: false,
            align: 'center',
            formatter: function(value, row, index) {
                var actions = [];
                //actions.push('<a class="btn btn-success btn-xs ' + '" href="dildSubs.html" οnclick="$.operate.edit(\'' + row.id + '\')"><i class="fa fa-edit"></i>查看</a>  ');
                actions.push('<a class="text control-tab" data-uni-id="'+'TBL_ID='+row.TBL_ID+'&'+'SYS_ID='+row.SYS_ID+'&'+'TBL_NM='+row.US_DB+'&US_DB='+row.US_DB+'&FLD_ID='+row.US_DB+'" data-row-id="" data-val-id="" title="'+'数据变更详情'+'" dtl-tbl-url="modules/governance/detailChange.html?">'+value+'</a>');
                return actions.join('');
            }
        }

        ]
    });
}
    
function getZtree(){
    $.ajax({
        type: "GET",
        url: baseURL + "usrTbl/ztree",
        contentType: "application/json",
        data: {
        },
        success:function(r){
            $.fn.zTree.init($("#treeDemo"), setting,r);
        }
    })
};

//查看添加点击事件
function addClickEventToTab(){
    $('#dataListGrid').on('click','td .control-tab', function () {
        var thisObj = $(this);
        //获得该条数据的VAL_ID（主键）
        var rowId = thisObj.attr('data-row-id');
        var a=thisObj.attr('data-uni-id');
        //var rowData = tableData.rows[rowId];
        var startDt=$('#searchStartDt').val();
        var url = thisObj.attr('dtl-tbl-url')+a+"&startDt="+startDt;
        console.log(url);
        var tabId ='rpt1';
        openDetailRptTab(tabId,thisObj.attr('title'),url);
    });
}

function openDetailRptTab(tabId,tabName,url){
    url = encodeURI(url);
    //要先判断是否已经打开此页面，如果已经打开，要先清除那个页面，
    //再打开就不会出现数据不刷新的情况
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
    }).setActTab('#' + tabId);
}

function btnOfExport(){
    
    var id=$('#idTreeSelect').val();
    var pid=$('#pidTreeSelect').val();
    var startDt=$('#searchStartDt').val().replace('-','').replace('-','');
    var tblNm=$('#tblNm').val();
    var xurl=''
    xurl='&id='+id+'&pid='+pid;
    if(startDt!='' && startDt !=null){
        xurl=xurl+'&startDt='+startDt;
    }
    if(tblNm!='' && tblNm!=null){
        xurl=xurl+'&tblNm'+tblNm;
    }
    var fileName=['STAT_DT','SYS_NM','TBL_NM','TBL_ID','MDF_DTL'];
    var title=['日期','系统','表名称','表英文名','版本修改内容'];

    var url = baseURL + 'iptFunc/exportExcel?name=数据变更分析&title='+title+'&fileName='+fileName+xurl;

    submitUrlForm(url);
}