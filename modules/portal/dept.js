//调用
var tableInit = function(){
    var url = portalURL + 'sys/department/list'; // 接口 URL 地址
    var params = {
        name:$('#name').val(),
        name:$('#name').val(),
        shortname:$('#shortname').val()
    };
    var columns = [
        {checkbox:true},
        {
            field:"deptId",
            title:'部门ID',
            visible:true
        },{
            field:'name',
            title:'部门名称',
        },{
            field:'shortname',
            title:'部门简称',
        },{
            field:'parentName',
            title:'父级部门名称',
            visible:false
        },{
            field:'parentId',
            title:'父部门ID',
            visible:false
        },{
            field:'icon',
            title:'图标',
            visible:false
        },{
            field:'orderNum',
            title:'排序',
            visible:false
        },{
            field:'type',
            title:'类型',
            visible:false
        },{
            field:'source',
            title:'来源',
            visible:false
        },{
            field: 'createUserId',
            title: '创建人',
            width: 100,
        },{
            field: 'createTime',
            title: '创建时间',
            width: 180,
            formatter: function(value,row,index){
                return commonUtil.getFormatDate2(value);
            }
        }
    ];

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
    //Bingo
    tableInit();

    $("#btnSearch,#btnRefresh").click(function(){
        // refreshTable();
        var opt = {
            silent: true,
            query:{
                name:$('#name').val(),
                shortname:$('#shortname').val()
            }
        };

        $('#table').bootstrapTable("refresh",opt);
    });
    
    $('#importBtn').click(function(){
        $('#importSysDepartment').modal('show');
    })
    
    $('#exportBtn').click(function(){
    	var url = portalURL + "sys/department/export";
		submitUrlForm(url);
    })
    
    $('#uploadDept').click(function(){
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
		                url: portalURL +'sys/department/import',
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
		var url = portalURL + "sys/department/downExcel";
		submitUrlForm(url);
	});
})

var setting = {
    data : {
        simpleData : {
            enable : true,
            idKey : "id",
            pIdKey : "parentId",
            rootPId : 0
        },
        key : {
            url : "nourl"
        }
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            name: null
        },
        showList: true,
        title:null,
        actionModel:null,
        dept:{
            deptId : null,
            status : 1,
            parentId: 0,
            parentName : null
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.actionModel='add';
            vm.dept = {
                status : 0,
                lockStatus : '0',
                source : '0',
                roleIdList : [],
                deptId : null,
                parentId: 0,
                parentName : null
            };
            vm.getdeptTree();
        },
        update: function () {
            var deptId = getSelectedRow("#table","deptId");
            if(deptId == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.actionModel='update';
            vm.dept.deptId=deptId;
            vm.getdept(deptId);
            // vm.getdeptTree();
        },
        del: function () {
            var deptIds = getSelectedRows("#table","deptId");
            if(deptIds == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/department/delete",
                    contentType: "application/json",
                    data: JSON.stringify(deptIds),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(index){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }
            $.ajax({
                type: "POST",
                url: portalURL + "sys/department/save",
                contentType: "application/json",
                data: JSON.stringify(vm.dept),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        deptTree : function() {
            layer.open({
                type : 1,
                offset : '50px',
                title : "选择部门",
                area : [ '300px', '450px' ],
                shade : 0,
                shadeClose : false,
                content : $("#deptLayer"),
                btn : [ '确定', '取消' ],
                btn1 : function(index) {
                    var node = ztree.getSelectedNodes();
                    console.log(node);
                    //选择上级菜单                   
                    vm.dept.parentId = node[0].id;
                    vm.dept.parentName = node[0].name;
                    layer.close(index);
                }
            });
        },
        getdeptTree : function() {
            //加载菜单树
            $.get(portalURL + "sys/department/select", function(r) {
                ztree = $.fn.zTree.init($("#deptTree"), setting, r.deptList);
                var node = ztree.getNodeByParam("id", vm.dept.parentId);
                console.log(vm.dept.parentId);
                ztree.selectNode(node);
                if(node!=null)
                    vm.dept.parentName = node.name;
            })
        },
        getdept : function(deptId) {
            $.get(portalURL + "sys/department/formatter/" + deptId, function(r) {
                vm.dept = r.department;
            });
        },
        reload: function () {
            vm.showList = true;
            refreshTable(vm.q.name);
        },
        validator: function () {
            var msg="";
            if(isBlank(vm.dept.name)){
                msg+="部门名称不能为空<br>";
            }
            if(isBlank(vm.dept.shortname)){
                msg+="部门简称不能为空<br>";
            }
            if(msg!=""){
                alert(msg);
                return true;
            }
        }
    }
});

function refreshTable(name){
    var opt = {
        silent: true,
        query:{
            name:$('#title').val(),
        }
    };

    $('#table').bootstrapTable("refresh",opt);
}