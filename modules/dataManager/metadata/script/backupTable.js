// const baseURL = "/portal/";
var token =window.localStorage.token;
new Vue({
    el: '#app',
    data: function() {
	    return {
			multipleTable:[],
			formInline: {
	          sourceTable: '',
			  hdsTableCname: '',
			  sourceTableCname: ''
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
	          outTableCname: '',
	          outTable: '',
				sourceTable: '',
				sourceTableCname: ''
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
	        formLabelWidth: '180px',
			uploadWithToken: {token: token}
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
      		that.form.sourcesysId='';
          	that.form.outsysId= '';
          	that.form.sourceTableCname= '';
          	that.form.sourceTable= '';
          	that.form.outTable= '';
          	that.form.outTableCname= '';
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
      			that.form.sourcesysId=selectRow[0].sourceId;
				console.log(JSON.stringify(selectRow[0]));
				that.form.outsysId= selectRow[0].hdsId;
	          	that.form.sourceTableCname= selectRow[0].sourceTableCname;
	          	that.form.sourceTable= selectRow[0].sourceTable;
	          	that.form.outTable= selectRow[0].hdsTable;
	          	that.form.outTableCname= selectRow[0].hdsTableCname;
      			that.title = '修改归档配置';
				that.multipleTable = selectRow[0];
      		}
      	},
      	sub(){
      		//对话框确定按钮
      		var that = this;
      		var url='';
      		if(that.title == "新增归档配置"){
      			url = baseURL + 'table/tableMapper/save';
      		}else{
				// that.form = that.$refs.multipleTable.selection[0];
				that.form.myccbid = that.multipleTable.mapperId;
				// console.log("000000000000" + that.form.$refs.multipleTable.selection[0]);
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
						// that.$message({
				        //   showClose: true,
				        //   message: '操作成功！',
				        //   type: 'success'
				        // });
						if(r.code == "0"){
							that.$message({
								showClose: true,
								message: '操作成功！',
								type: 'success'
							});
						}else{
							that.$message({
								showClose: true,
								message: r.msg,
								type: 'error'
							});
						}
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
					JSON.stringify({
						"currPage":that.currentPage,
						"limit":that.pageSize,
						"sourceTable":that.formInline.sourceTable,
						"hdsTableCname":that.formInline.hdsTableCname,
						"sourceTableCname":that.formInline.sourceTableCname
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
	   	},
		downloadTemplate(){
			var url = baseURL + "downloadFile/template.xlsx";
			console.log("------------------------------------" + baseURL);
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
			xhr.responseType = "blob";  // 返回类型blob
			xhr.setRequestHeader('token',token);
			// 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
			xhr.onload = function () {
				// 请求完成
				if (this.status === 200) {
					// 返回200
					var blob = this.response;
					var reader = new FileReader();
					reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
					reader.onload = function (e) {
						// 转换完成，创建一个a标签用于下载
						var a = document.createElement('a');
						a.download = 'template.xlsx';
						a.href = e.target.result;
						$("body").append(a);  // 修复firefox中无法触发click
						a.click();
						$(a).remove();
					}
				}
			};
			// 发送ajax请求
			xhr.send()
		},
		handleExeed(files){
			this.$message.warning('当前限制选择 1 个文件，请重新选择');
		}
  	}
})