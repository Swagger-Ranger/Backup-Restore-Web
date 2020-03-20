var vm = new Vue({
	el: '#rrapp',
	data: {
		ruleForm: {
          interName: '',
          rptId: '',
          type: '',
          IP: '',
          pwd:'',
          sqlDbSourceList: [],
          sqlDbsource: '',
          sqlDbtype:'',
          paging: '',
          pagingObj: '',
          apiSystem: '',
          apiModule: '',
          isDimension: '',
          orderNum: '',
          checkSql: '',
      	  sqlText: '',
      	  sqlSummary: '',
      	  dataType: 'JSON',
      	  sepchar:'',	//分隔符
      	  filename: '',	//导出文件名称
      	  outputAttribute: {},
          sql:{
	      	  name: '',
	      	  sqlListFlag: false,
	      	  list:[],
	      	  sqlTestBtn:false,
	      	  sqlContent: ''
          },
          outputOptions: [{
	          value: 'CSV',
	          label: 'CSV'
	        }, {
	          value: 'TXT',
	          label: 'TXT'
	        }],
	      outputType: ''
        },
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
        },
        rules: {
          interName: [
            { required: true, message: '请输入接口名称', trigger: 'blur' }
          ],
          rptId: [
            { required: true, message: '请数据接口Id', trigger: 'blur' }
          ],
          sqlDbsource: [
            { required: true, message: '请选择数据源', trigger: 'change' }
          ],
          paging: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          apiSystem: [
            { required: true, message: '请输入系统名称', trigger: 'blur' }
          ],
          apiModule: [
            { required: true, message: '请输入模块名称', trigger: 'blur' }
          ],
          isDimension: [
            { required: true, message: '请选择指标或者维度', trigger: 'change' }
          ],
          sqlText: [
	        { required: true, message: '请输入明细语句', trigger: 'blur' }
          ],
          dataName: [
        	{ required: true, message: '请输入接口名称', trigger: 'blur' }
          ],
        },
        ruleForm2: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        activeName: 'dataSet',	//tab默认打开
        activeName2: 'first',	//默认打开sql语句
        dialogFormVisible: false,//结果集对话框默认关闭
        dataTitle: '汇总语句验证',
        form: {
        	name:'',
          	sqltext: ''
        },
        tableData: [],
	},
	created: function() {
		
	},
	mounted: function() {
		//获取数据源
		var that=this;
        var url = portalURL + 'datasources/list-paging'; // 接口 URL 地址
        var params = {
            pageNumber:1,
            pageSize:10000
        };
        $.ajax({
            url:url,
            data:params,
            type:'get',
            dataType:'json',
            success:function (rel) {
                console.log(rel);
                if(rel.code === 0){
            		let datas = rel.data.totalList;
            		for(var i = 0;datas.length>i;i++){
            			if(datas[i] != null && datas[i] != '' && typeof(datas[i]) != undefined){
                            var option = {"id":datas[i].id, "name":datas[i].name+" -- "+datas[i].type, "type":datas[i].type}
                            that.ruleForm.sqlDbSourceList.push(option)
            			}
            		}
            		
            	}
            },
            error:function (rel) {
                console.log(rel.msg)
            }
        });		
	},
	methods: {
		submitForm(formName) {
			var url='analysisSql/save';
			var that = this;
			that.ruleForm.outputAttribute=JSON.stringify({"sepchar":that.ruleForm.sepchar,"filename":that.ruleForm.filename});
			console.log(that.ruleForm);
        	this.$refs[formName].validate((valid) => {
		        if (valid) {
		        	//保存接口
		            $.ajax({
	                    type: "POST",
	                    url: dataApiURL + url,
	                    contentType: "application/json",
	                    data: JSON.stringify(that.ruleForm),
	                    success: function(r){
	                        if(r.code === 0){
	                        	that.$message({
						          message: '创建接口成功！',
						          type: 'success'
						        });
	                        }else{
	                            that.$message.error('创建失败');
	                        }
	                    }
	                });
		       	} else {
		            console.log('error submit!!');
		            return false;
		        }
	        });
      	},
      	resetForm(formName) {
	        this.$refs[formName].resetFields();
	    },
	    //验证结果集按钮
	    checkSql(dataTitle){
	    	var that = this;
	    	this.dataTitle = dataTitle;
	    	if(dataTitle == '汇总sql验证'){
	    		that.ruleForm.checkSql = that.ruleForm.sqlSummary;
	    	}else{
	    		that.ruleForm.checkSql = that.ruleForm.sqlText;
	    	}
	    	if(that.ruleForm.checkSql == ""){
	    		that.dialogFormVisible = false;
	    		that.$message('请输入语句再验证');
	    	}else{
	    		that.dialogFormVisible = true;
		    	that.ruleForm.sql.list = [];
		    	that.ruleForm.sql.sqlListFlag = false;
		    	that.ruleForm.sql.sqlTestBtn = false;
	    	}
	    	
	    },
	    //编辑结果集对话框确定按钮事件
	    creatData(){
	    	this.dialogFormVisible = false;
	    },
	    cancelSave(formName){
	    	this.dialogFormVisible = false;
	    },
	    //点击tab菜单
	    handleClick(tab, event) {
	    	var that = this;
//	    	that.ruleForm.sql.sqlContent = "";
//	    	if(tab.name == "outputType"){
//	    		if(that.ruleForm.sqlText == ""){
//	    			that.ruleForm.sql.sqlContent = "您还没填写明细语句"
//	    		}else{
//	    			that.parmeter();
//	    		}
//	    	}
	    },
	    //sql验证
	    parmeter(){
	    	var that = this;
	    	this.ruleForm.sql.list = [];
            $.ajax({
	        	type: "GET",
		        url: dataApiURL +"analysisSql/sql",
		        contentType: "application/json",
		        async:false,
		        data: {
		            sql:that.ruleForm.sqlText,
		        },
		        success: function(r){
		            console.log(r);
		            if(r.list.length > 0){
		            	r.list.map(v => {
				            that.ruleForm.sql.list.push({value: '', key:v})
				        })
		            }else{
		            	that.validataSql();
		            }
		        }
	    	})
	    },
	    //sql提交
	    validataSql(){
	    	var that = this;
	    	var obj=this.ruleForm.sqlDbsource;
	    	that.ruleForm.sql.sqlTestBtn = true;
	    	for(let i in that.ruleForm.sqlDbSourceList){
	    		if(that.ruleForm.sqlDbSourceList[i].id == obj){
	    			that.ruleForm.sqlDbtype = that.ruleForm.sqlDbSourceList[i].type;
	    		}
	    	}
	    	that.ruleForm.pagingObj=that.ruleForm.paging+'&type='+that.ruleForm.sqlDbtype+'&source='+obj;
	    	let obj1={"paging":that.ruleForm.pagingObj,"source":that.ruleForm.sqlDbsource,"sql":that.ruleForm.sqlText,"type":that.ruleForm.sqlDbtype}
	    	$.ajax({
                type: "POST",
                url: dataApiURL +"analysisSql/validation",
                async: false,
                contentType: "application/json",
                data:JSON.stringify(obj1),
                success: function(r){
                    if(r.code==0){
						that.ruleForm.sql.sqlContent = JSON.stringify(r.list, null, 4);
                   	}else{
                   		that.ruleForm.sql.sqlListFlag = true;
                   		that.ruleForm.sql.sqlContent = JSON.stringify(r.msg, null, 4);
                	}
                }
            }); 
	    },
	    // 导出配置
		exportData(){
			var obj={};
			var that = this;
			that.parmeter();
			obj.rptId = that.ruleForm.rptId;
			obj.currpage = "1";
			obj.pagerow = "10";
			that.ruleForm.sql.list.map(v => {
	            var key=v.key;
		    	var co=v.value;
		    	obj[key] = co; 	
	       })
			obj.token = token;
			options = {
				url: "/dataApi/interface/downloadData",
				data:obj,
			};
			var config = $.extend(true, {
				method: 'post'
			}, options);
			var $iframe = $('<iframe id="down-file-iframe" />');
			var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
			$form.attr('action', config.url);
			for(var key in config.data) {
				$form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
			}
			$iframe.append($form);
			$(document.body).append($iframe);
			$form[0].submit();
			$iframe.remove();
		},
		//权限设置
		setIp(){
			var that=this;
			var url="pinter/info/"+that.ruleForm.rptId;
			var url2="pinter/update"+that.ruleForm.rptId;
			var id="";
			var ipMsg={};
			$.ajax({
		        type: "get",
		        url: dataApiURL + url,
		        contentType: "application/json",
		        success: function(r){
		            if(r.code == 0){
						if(r.entity != null && r.entity != '' && typeof(r.entity) != undefined){
							id=r.entity.id;
							var ipMsg=r.entity;
						}else{
							id="";
							ipMsg={};
						}
		            }else{
		                alert(r.msg);
		            }
		        }
		    });
		    $.ajax({
		        type: "POST",
		        url: dataApiURL + url2,
		        data:JSON.stringify(ipMsg),
		        contentType: "application/json",
		        success: function(r){
		           	if(r.code == 0){
	                    alert('操作成功');
	                }else{
	                    alert(r.msg);
	                }
		        }
		    });
		}
	}
})