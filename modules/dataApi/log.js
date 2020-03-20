$(function () {
    $('#roleAuthTab a:first').tab('show');
    $('.middleIcon').hide();
    $('#roleAuthTab a').click(function (e) {
          e.preventDefault();
          $(this).tab('show');
    })
        
    $("#jqGrid").jqGrid({
        url: dataApiURL + 'plog/list2',
        datatype: "json",
        colModel: [         
            { label: '接口名称', name: 'operation'},
            { label: '用户', name: 'username'},
            { label: '访问次数', name: 'method'},
            { label: '用时', name: 'time'},
            { label: 'ip', name: 'ip'},
            { label: '访问时间', name: 'createDate'},
            {label: '结果', name: 'resultats'}
        ],
        viewrecords: true,
        height: ($(window).height()-150),
        rowNum: 10,
        rowList : [10,30,50,100,500],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "orgId",
                rootPId: 0
            },
            key: {
                url:"nourl"
            }
        }
    };
var ztree;
var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            interName: null
        },
        showPassword: true,
        showList: true,
        showColumn:true,
        title:null,
        roleList:{},
        user:{
            orgId:1,
            status:1,
            orgShtNm:null,
            roleIdList:[]
        },
        ipt:{
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{ 
                postData:{'OPERATION': $("#in").val()},
                page:1
            }).trigger("reloadGrid");
        }
    }
});