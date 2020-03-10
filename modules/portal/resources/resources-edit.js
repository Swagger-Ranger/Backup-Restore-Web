var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            name: null
        },
        showList: true,
        showSelect: false,
        itemList:[],  //resType的数组
        vDataList:[], //微数智的数组，resourceId
        tempResourceId:T.p("id"), //resourceId的中间变量，改变该变量触发改变resourceId
        title:(T.p("id")!=""&&T.p("id")!=null)?"修改":"新增",
        actionModel:(T.p("id")!=""&&T.p("id")!=null)?"update":"add",
        res:{
            resType:"",
            resourcesId : T.p("id"),
            resName: "",
            resUrl: ""
        }
    },
    //用于数据初始化
    created:function(){
        this.getResTypeList(); 
        this.getResourcesInfo();
    	this.getVDataList();
    },
    methods: {
        getResourcesInfo: function() {
            if(T.p("id")!=""&&T.p("id")!=null){
                $.get(portalURL + "sys/resources/info/" + T.p("id"), function(r) {
					vm.res=r.entity;
                });
            }
        },
        
        getResTypeList: function() {
            $.get(portalURL + "sys/resources/getResType", function(r){
                vm.itemList  = r.list;
            })
        },
        getVDataList: function () {
            var getResourceList;
            var vdataTask=[];
            var resultList;

            $.ajax({
                type:'GET',
                url: dataApiURL+ 'swagger/getApiData', // 接口 URL 地址
                contentType:"application/x-www-form-urlencoded;charset=utf-8",
                dataType:"json",
                data:{
                    "rptId":"vdata_getResourceId",
                    "pagerow":10000
                },
                cache:false,
                async:false,
                success:function(data){
                	console.log(data)
                    if(data.code == "0000"){
                        getResourceList=data.data.rows;
                    }
                }
            });
        
            $.ajax({
                type:'GET',
                url: dataApiURL + 'swagger/getApiData',
                contentType:"application/x-www-form-urlencoded;charset=utf-8",
                dataType:"json",
                data:{
                    "rptId":"dsb_getPageId",
                    "pagerow":10000
                },
                cache:false,
                async:false,
                success:function(data){
                    if(data.code == "0000"){
                        var data=data.data.rows;    // 所有pageId集合
                        data = Array.from(data);
						console.log(getResourceList)
                        for(var j=0;j<getResourceList.length;j++){
                            var str=getResourceList[j].resourcesId;
                            if(str.indexOf('vdata_') !=-1){
                                str = str.slice(6);
                                vdataTask.push(str);    // 已推送资源 pageId集合
                            }
                        }

                        // for (var i=0;i<data.length;i++) {

                        //     data[i].pageId+data[i].pageNm;
                        // }

                        var arr = data.filter(function (page) {
                            if (vdataTask.indexOf(page.pageId) == -1 ) {
                                page.resourcesId = 'vdata_' + page.pageId;
                                return page; 
                            }
                        })
                        resultList = arr
                    }
                }
            })

            this.vDataList = resultList;
        },
        close: function () {
            closeCurrentLayer();
        },
        saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }
            var url = vm.actionModel == 'add' ? "sys/resources/save" : "sys/resources/update";
            $.ajax({
                type: "POST",
                url: portalURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.res),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功',function(){
                            closeCurrentLayer();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
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
        },
        clearData: function () {
            this.res.resourcesId="";
            this.res.resName= "";
            this.res.resUrl= "";
            
        },
        setThirdPartyData: function () {
            this.res.resourcesId = "other_"+new Date().getTime()+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
        }
    },
    computed: {
        newResType() {
            return this.res.resType
        },
        newResourceId() {
            return this.res.resourcesId
        }
    },
    watch: {
        newResType(val) {
            if (val === 'VDATA') { // 微数智
                // $("#resourceId").attr('disabled','disabled');
                this.showSelect = true;
                this.clearData();
            } 
            if (val === 'THIRD_PARTY'){
                this.showSelect = false;
                this.clearData();
                this.setThirdPartyData();
            }
            if (val === 'SYSTEM') {
                this.showSelect = false;
                this.clearData();
            }
        },
        newResourceId(val) {
            this.vDataList.forEach(function (el, index) {
                if (el.resourcesId === val) {
                    vm.res.resName = el.pageNm
                    vm.res.resUrl = '/modules/vData/pages/pages.html?pageId='+el.pageId
                }
            });
        },
        tempResourceId(val) {
            this.res.resourcesId = val;
        }
    },
});

