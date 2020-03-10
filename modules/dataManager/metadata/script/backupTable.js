// const baseURL = "/portal/";
var token =window.localStorage.token;
new Vue({
    el: '#app',
    data: function() {
	    return {
			formInline: {
	          hdssysCname: '',
	          sourceTabl: '',
	          outTable: ''
	       },
	       tableData: [],
	        currentPage: 1,
	        pageSizes:[10, 20, 30, 40],
	        pageSize:10,
	        total:0,
	        dialogFormVisible: false,
	        title: '',
	        form: {
	          sourcesysOpiton:[],
	          sourcesysId: '',
	          outsysOpiton:[],
	          outsysId: '',
	          hdsTableCname: '',
	          hdsTableName: '',
	          outTable: '',
	          outTableCname: ''
	        },
	        rules: {  //表单校验
	          sourcesysId: [
	            { required: true, message: '请选择归档系统与库名', trigger: 'change' }
	          ],
	          outsysId: [
	            { required: true, message: '请选择数据平台库名', trigger: 'change' }
	          ],
	          sourceTableCname: [
	            { required: true, message: '归档表中文名', trigger: 'blur' }
	          ],
	          sourceTable: [
	            { required: true, message: '归档表英文名', trigger: 'blur' }
	          ],
	          outTableCname: [
	            { required: true, message: '数据平台对应表中文名', trigger: 'blur' }
	          ],
	          outTable: [
	            { required: true, message: '数据平台对应表英文名', trigger: 'blur' }
	          ],
	        },
	        formLabelWidth: '180px'
	    }
    },
	mounted() {
		this.getTableData();
		this.getOption();
	},
  	methods: {
      	addFile(){
      		//新增按钮
      		var that=this;
      		that.title = '新增归档配置';
      		that.form.hdssysCname='';
          	that.form.hdssysName= '';
          	that.form.dbname= '';
          	that.form.hdssysPwd= '';
      		that.dialogFormVisible = true;
      	},
      	editFile(){
      		//修改按钮
      		var that = this;
      		let selectRow = that.$refs.multipleTable.selection;
      		if(selectRow.length != 1){
      			that.$message({
		          showClose: true,
		          message: '请选择一条数据',
		          type: 'error'
		        });
      		}else{
      			that.dialogFormVisible = true;
      			that.form.hdssysCname=selectRow[0].hdssysCname;
	          	that.form.hdssysName= selectRow[0].hdssysName;
	          	that.form.dbname= selectRow[0].dbname;
	          	that.form.hdssysPwd= selectRow[0].hdssysPwd;
      			that.title = '修改归档配置';
      		}
      	},
      	sub(){
      		//对话框确定按钮
      		var that = this;
      		var url='';
      		if(that.title == "新增归档配置"){
      			url = baseURL + 'table/tableMapper/save';
      		}else{
				that.form = that.$refs.multipleTable.selection[0];
				that.form.myccbid = that.form.mapperId;
				console.log("000000000000" + that.form);
      			url = baseURL + 'table/tableMapper/update';
      		}
	        this.$refs['form'].validate((valid) => {
	          if (valid) {
      			this.dialogFormVisible = false;
      			$.ajax({
					type: 'POST',
					url: url,
					contentType: "application/json",
					dataType: "json",
					beforeSend: function(request) {
						request.setRequestHeader("token", token);
					},
					data: JSON.stringify(that.form),
					async: false,
					success: function(r) {
						// console.log(r);
						that.$message({
				          showClose: true,
				          message: '操作成功！',
				          type: 'success'
				        });
					}
				});
				that.getTableData();
	          } else {
	            return false;
	          }
	        });
      	},
      	cancle(){
      		//对话框取消按钮
      		this.dialogFormVisible = false;
      		this.$refs['form'].resetFields();
      	},
      	deleteSys(){
      		//删除数据
      		var that = this;
      		let selectRow = that.$refs.multipleTable.selection;
      		let deleteId = [];
      		for (key in selectRow) {
      			deleteId.push(selectRow[key].mapperId)
      		}
      		if(selectRow.length == 0){
      			that.$message({
		          showClose: true,
		          message: '请选择数据',
		          type: 'error'
		        });
      		}else{
      			const h = this.$createElement;
		        this.$msgbox({
		          title: '提示',
		          message: h('p', null, [
		            h('span', null, '您确定要删除此源系统信息吗？ ')
		          ]),
		          showCancelButton: true,
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          beforeClose: (action, instance, done) => {
		            if (action === 'confirm') {
		              instance.confirmButtonLoading = true;
		              instance.confirmButtonText = '执行中...';
		              setTimeout(() => {
		                done();
		                setTimeout(() => {
		                 $.ajax({
							type: 'POST',
								url: baseURL + 'table/tableMapper/delete', // 接口 URL 地址
								contentType: "application/json",
								dataType: "json",
								beforeSend: function(request) {
									request.setRequestHeader("token", token);
								},
								data: JSON.stringify(deleteId),
								async: false,
								success: function(r) {
									// console.log(r);
									that.getTableData();
								}
							});
		                  instance.confirmButtonLoading = false;
		                }, 300);
		              }, 1000);
		            } else {
		              done();
		            }
		          }
		        }).then(action => {
		          this.$message({
		            type: 'info',
		            message: '删除成功！'
		          });
		        });
      		}
      	},
		closeDialog(){
      		//关闭对话框事件
			this.$refs['form'].resetFields(); //置空表单
			this.dialogFormVisible = false;
		},
		handleSizeChange(val) {
			this.pageSize=val;
			this.getTableData();
//	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	    	this.currentPage=val;
	    	this.getTableData();
//	        console.log(`当前页: ${val}`);
	    },
	   	getTableData(){
	   		//获取表格数据
	   		var that = this;
			$.ajax({
				type: 'POST',
				url: baseURL + 'table/tableMapper/queryFullMapperPage', // 接口 URL 地址
				contentType: "application/json",
				dataType: "json",
				beforeSend: function(request) {
					request.setRequestHeader("token", token);
				},
				data:
					JSON.stringify({"currPage":that.currentPage,
						"limit":that.pageSize,
						"sourceTable":that.formInline.sourceTabl,
						"hdsTable":that.formInline.hdssysCname
				}),
				cache: false,
				async: false,
				success: function(r) {
					that.total=	r.page.totalCount;				//总条数
					that.tableData=r.page.list;
//					console.log(that.tableData);
				}
			});
	   	},
	   	getOption(){
	   		//获取对话框下拉表信息
	   		var that = this;
	   		$.ajax({
				type: 'get',
				url: baseURL + 'sys/edwhds/queryList', // 接口 URL 地址
				contentType: "application/json",
				dataType: "json",
				beforeSend: function(request) {
                    request.setRequestHeader("token", token);
                },
				data: {},
				async: false,
				success: function(r) {
					if(r.code == "0"){
						for(key in r.page.list){
							console.log("value-------------"+ r.page.list[key].myccbid)
							that.form.sourcesysOpiton.push({"value": r.page.list[key].myccbid,"label": r.page.list[key].sysDesc})
							// that.form.outsysOpiton.push({"value": r.page.list[key].myccbid,"label": r.page.list[key].hdssysCname})
						}
					}
				}
			});
	   	}
  	}
})