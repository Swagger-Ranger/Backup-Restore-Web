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
        showPass:false,
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
            interName:null,
            describe:null
        }
    },
    methods: {
        submit: function () {
            /*if(vm.validator()){
                return ;
            }*/
            var backUrl=vm.ipt.interName;
            var str=vm.ipt.describe;
            var obj=JSON.parse(str);
            console.log(obj);
            vm.showPass=true;
            $.ajax({
                type: "GET",
                url: backUrl,
                contentType: "application/json",
                data:obj,
                success: function(r){
                    console.log(r);
                    let btn = document.querySelector('#json');
                    btn.textContent = JSON.stringify(r, null, '  ');
                }
            });
        },
        validator: function () {
            if(isBlank(vm.ipt.interName)){
                alert("api地址不能为空");
                return true;
            }
        }
    }
});