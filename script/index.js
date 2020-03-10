const baseURL = "/portal/";
new Vue({
    el: '#app',
    data: function() {
	    return { 
			formInline: {
	          hdssysCname: ''
	       },
	       tableData: [{
	       	  myccbid: '1',
	          hdssysCname: '归档1',
	          hdssysName: 'file1',
	          dbname: 'db1',
	          createtime: '2020-03-04'
	        }, {
	       	  myccbid: '2',
	          hdssysCname: '归档2',
	          hdssysName: 'file2',
	          dbname: 'db2',
	          createtime: '2020-03-04'
	        }],
	        currentPage: 1,
	        pageSizes:[100, 200, 300, 400],
	        pageSize:100,
	        total:400,
	        dialogFormVisible: false,
	        title: '',
	        form: {
	          hdssysCname: '',
	          nameOptions: [{
		          value: '',
		          label: ''
		        }],
	          hdssysName: '',
	          dbname: '',
	          hdssysPwd: '',
	        },
	        rules: {  //表单校验
	          hdssysCname: [
	            { required: true, message: '请输入归档系统中文名', trigger: 'blur' }
	          ],
	          hdssysName: [
	            { required: true, message: '请输入归档系统英文名', trigger: 'blur' }
	          ],
	          dbname: [
	            { required: true, message: '请输入系统库名', trigger: 'blur' }
	          ],
	          hdssysPwd: [
	            { required: true, message: '请输入系统密码', trigger: 'blur' }
	          ],
	        },
	        formLabelWidth: '150px'
	    }
    },
  	methods: {
      	query(){
      	//源系统名查询
      		var that = this;
			$.ajax({
				type: 'GET',
				url: baseURL + 'sys/edwhds/info', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				data: {
					"pageSize":that.pageSize,
					"pageNumber":1,
					"hdssysCname": that.hdssysCname
				},
				cache: false,
				async: false,
				success: function(r) {
//					that.total=					//总条数
//					that.tableData=r.data.rows;
//					console.log(that.tableData);
				}
			});
      	},
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
      			url = baseURL + 'sys/edwhds/save';
      		}else{
      			url = baseURL + 'sys/edwhds/update';
      		}
	        this.$refs['form'].validate((valid) => {
	          if (valid) {
      			this.dialogFormVisible = false;
      			$.ajax({
					type: 'POST',
					url: url,
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(that.form),
					async: false,
					success: function(r) {
						// console.log(r);
					}
				});
				that.query();
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
      			deleteId.push(selectRow[key].myccbid)
      		}
      		if(selectRow.length == 0){
      			that.$message({
		          showClose: true,
		          message: '请选择数据',
		          type: 'error'
		        });
      		}else{
      			$.ajax({
					type: 'POST',
					url: baseURL + 'sys/edwhds/delete', // 接口 URL 地址
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(deleteId),
					async: false,
					success: function(r) {
						// console.log(r);
					}
				});
				that.query();
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
				type: 'GET',
				url: baseURL + 'sys/edwhds/queryList', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				data: {
					"pageSize":that.pageSize,
					"pageNumber":that.currentPage
				},
				cache: false,
				async: false,
				success: function(r) {
//					that.total=					//总条数
//					that.tableData=r.data.rows;
//					console.log(that.tableData);
				}
			});
	   	}
  	}
})