var vm = new Vue({
    el:'#rrapp',
    data:{
        // resType:{
        //     val:$('#resType').val(),
        //     txt:$('#resType').find("option:selected").text()
        // },
        showList: true,
        title:null,
        actionModel:null,
        res:{
            resourcesId : 1,
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
            layer.open({
                type: 2,
                title: '资源管理',
                area:['80%','80%'],
                content: 'resources-edit.html',
                end: function(){
                    console.log("新增关闭后回调-层销毁后触发的回调");
                    vm.reload();
                }
            });
        },

        update: function () {
            var resourcesId = getSelectedRow("#table","resourcesId");
            console.log(resourcesId);
            layer.open({
                type: 2,
                title: '资源管理',
                area:['80%','80%'],
                content: 'resources-edit.html?id='+resourcesId,
                end: function(){
                    console.log("修改关闭后回调-层销毁后触发的回调");
                    vm.reload();
                }
            });
        },
        del: function () {
            var resourcesIds = getSelectedRows("#table","resourcesId");
            if(resourcesIds == null){
                return ;
            }
            console.log(resourcesIds);
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: portalURL + "sys/resources/delete",
                    contentType: "application/json",
                    data: JSON.stringify(resourcesIds),
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
                url: portalURL + "sys/resources/save",
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
        getRes : function(resourcesId) {
            $.get(portalURL + "sys/resources/info/" + resourcesId, function(r) {
                vm.res = r.entity;
            });
        },
        reload: function () {
            vm.showList = true;
            refreshTable();
        },
        validator: function () {
            var msg="";
            if(isBlank(vm.res.resName)){
                msg+="资源名称不能为空<br>";
            }
            if(isBlank(vm.res.resType)){
                msg+="资源类型不能为空<br>";
            }
            if(msg!=""){
                alert(msg);
                return true;
            }
        }
    }
});