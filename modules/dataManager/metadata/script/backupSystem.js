// const baseURL = "/portal/";
var token =window.localStorage.token;
console.log('------' + token + '--------');

new Vue({
    el: '#app',
    data: function() {
    	var validata_password = (rule, value, callback) => {
			if(this.form.hdssysPwd2){
				if(!value){
					callback(new Error('请输入您的密码'))
				}else if(!(value === this.form.hdssysPwd2)){
					callback(new Error('两次输入的密码不一致'))
				}else{
					callback()
				}
			}else{
				if(!value){
					callback(new Error('密码不能为空'))
				}else{
					callback()
				}
			}
		};
		var validataComfirmpwd = (rule, value, callback) => {
			if(this.form.hdssysPwd2){
				if(!value){
					callback(new Error('请确认您的密码'))
				}else if(!(value === this.form.hdssysPwd)){
					callback(new Error('两次输入的密码不一致'))
				}else{
					callback()
				}
			}else{
				if(!value){
					callback(new Error('密码不能为空'))
				}else{
					callback()
				}
			}
		};
        return {
            formInline: {
                hdssysCname: ''
            },
            tableData: [
            ],
            currentPage: 1,
            pageSizes:[10, 20, 30, 40],
            pageSize:10,
            total:0,
            dialogFormVisible: false,
            title: '',
            form: {
                hdssysCname: '',
                hdssysName: '',
                dbname: '',
                hdssysUser: '',
                hdssysPwd: '',
                hdssysPwd2: '',
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
                hdssysUser: [
                    { required: true, message: '请输入系统用户', trigger: 'blur' }
                ],
                hdssysPwd: [
                    { required: true, trigger: 'blur', validator: validata_password }
                ],
                hdssysPwd2: [
                    { required: true, trigger: 'blur', validator: validataComfirmpwd }
                ],
            },
            formLabelWidth: '150px'
        }
    },
    mounted() {
        this.getTableData();
    },
    computed:{
    	 
    },
    methods: {
        addFile(){
            //新增按钮
            var that=this;
            that.title = '新增归档配置';
            that.form.hdssysCname='';
            that.form.hdssysName= '';
            that.form.dbname= '';
            that.form.hdssysUser= '';
            that.form.hdssysPwd= '';
            that.form.hdssysPwd2= '';
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
                that.form.hdssysUser= selectRow[0].hdssysUser;
                that.form.hdssysPwd= selectRow[0].hdssysPwd;
                that.form.hdssysPwd2= selectRow[0].hdssysPwd;
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
                let selectRow = that.$refs.multipleTable.selection[0].myccbid;
                that.form.myccbid= selectRow;
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
                            that.getTableData();
                        }
                    });
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
        deleteSys() {
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
			                url: baseURL + 'sys/edwhds/delete', // 接口 URL 地址
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
        getTableData(){
            //获取表格数据
            var that = this;
            $.ajax({
                type: 'GET',
                url: baseURL + 'sys/edwhds/queryList', // 接口 URL 地址
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                dataType: "json",
                beforeSend: function(request) {
                    request.setRequestHeader("token", token);
                },
                data: {
                    "hdssysCname":that.formInline.hdssysCname,
                    // "hdssysName":that.hdssysName,
                    "limit":that.pageSize,
                    "page":that.currentPage
                },
                cache: false,
                async: false,
                success: function(r) {
                    that.total=	r.page.totalCount;				//总条数
                    that.tableData=r.page.list;
                    for (key in that.tableData) {
                        that.tableData[key].createtime = commonUtil.getFormatDate2(that.tableData[key].createtime);
                    }
                }
            });
        },
        
    }
})