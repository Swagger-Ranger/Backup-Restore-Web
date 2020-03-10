var vm = new Vue({
	el: '#rrapp',
	data: {
		props: {
			label: 'name',
			children: 'zones'
		},
		//目录数据
		treeData:{
			rootNodeData: [{
				name: '数据仓库',
				id: '0',
				type: 'ctg'
			}], //根节点目录
			childNodeData: [],
			defaultShowNodes:[]	//默认展开节点
		},
		rootNode: [{
				name: '根目录',
				id: '0'
			}], //根节点目录
		searchInput:'', //目录查询
		selectNode: {}, //选择节点的根节点
		showTree:true,  //高亮显示  不让背景消失
		tableData: [], //查询日志的信息
		query: {
			pageNum: 1, //当前页数
			pageSize: 10, //每页最大展示数
			recordCount: 0 //总条数
		},
		checkedKeys: [],
		count: 1,
		title: null,
		//目录
		menu: {
			name:'',
			parentName: null,
			parentId: 0,
			type: 'ctg',
			orderNum: 0,
		},
		dialogFormVisible: false,
        formLabelWidth: '100px',
		centerDialogVisible: false,
		menuDialogFormVisible: false,
		isScroll: false,
		form: {
			tabName:'',
			tabComment: '',	//表的中文名
			tabType: '',
			key: '',
			tabId: '',
			orderNum: 0,
			bkFileDir: '',
			recvrFileDir: '',
			formData: {
				tableData: [],
			}
		},
		formWidth: '120px',
		logForm: {
			name: '',
			tabType: '',
			key: '',
			bkFileDir: '',
			recvrFileDir: ''
		},
		log: '',
        pickerOptions: {
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
        },
        startDate:'',
        endDate:'',
		date:'',
		isDim: false,
		dimDate:'',
	},
	//用于数据初始化
	created: function() {
		this.createTableData();
	},
	mounted() {
		
	},
	methods: {
		//搜索目录
		menuSearch(){
			var that  = this;
			var nodeParentId = '';
			that.treeData.childNodeData = [];
			var searchClickNode =[];
			$.ajax({
				type: 'GET',
				url: dataApiURL + 'metadata/Api/getcatalog', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				data: {
					"rptId": "metad_getcatalog",
		            "pagerow":10000,
					"ctgName":that.searchInput
				},
				cache: false,
				async: false,
				success: function(r) {
					console.log(r);
					if(r.code === "0000") {
						that.isSearch = true;
						that.treeData.rootNodeData = [];
					    Array.from(r.data.rows).forEach(function(value,index,array){
				    		that.treeData.childNodeData.push({
								name: value.ctgName,
								id: value.ctgId,
								tabId: value.tabId,
								parentId: value.ctgParentId,
								type: value.ctgType,
								leaf: value.ctgType == 'tab'
							})
						
						});
//						that.node_had = [];//把存起来的node的子节点清空，不然会界面会出现重复树！
//    					that.loadNode(that.node_had, that.resolve_had);//再次执行懒加载的方法
					}
				}
			});
		},
		onDataRecve() {
            var that = this;
            console.log(that);
            that.$confirm('此操作将对表进行数据恢复, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	$.ajax({
					type: 'POST',
					url: portalURL + 'metadata/bkRecvrCatalog/recvrData', // 接口 URL 地址
					contentType: "application/x-www-form-urlencoded;charset=utf-8",
					dataType: "json",
					data: {
						"tabId" : this.selectNode.tabId,
	                    "startDate" : that.startDate,
						"endDate" : that.endDate,
						"dimDate" : that.dimDate,
	                    "path" : that.logForm.recvrFileDir
					},
					cache: false,
					async: false,
					success: function(data) {
						if(data.code == "0") {
						 	that.$message({
					            type: 'success',
					            message: '恢复成功!'
					        });
	                    }else{
	                    	that.$message.error('恢复失败！');
	                    }
					}
				});
	        }).catch(() => {
	          that.$message({
	            type: 'info',
	            message: '已取消恢复数据'
	          });          
	        });
            
        },
		//归档信息日志查询
		onSearch() {
			this.query.pageNum = 1;
			var that = this;
			$.ajax({
				type: 'GET',
				url: dataApiURL + 'metadata/Api/sysGetLog', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				data: {
					"rptId": "sys_getLog",
					// "pagerow":10000,
					"currpage": 1,
					"wd": that.log,
					"startWith": "recvr-"
				},
				cache: false,
				async: false,
				success: function(data) {
					if(data.code === "0000") {
						if(data.data.rows.length > 0) {
							console.log(data.data.rows);
							that.tableData = data.data.rows;
							that.tableData.forEach(function(value,index,arr){
								that.tableData[index].createDate=commonUtil.getFormatDate2(that.tableData[index].createDate);
							})
						}
						//		        		that.logForm=data.data.rows
					}
				}
			});
		},
		//操作每页显示的数据
		createTableData(pageSize, pageNum) {
			var that = this;
			var tabId = that.selectNode.tabId;
			if (tabId == undefined || tabId == '') {
				tabId = '';
			} else {
				$.ajax({
					type: 'GET',
					url: dataApiURL + 'metadata/Api/sysGetLog', // 接口 URL 地址
					contentType: "application/x-www-form-urlencoded;charset=utf-8",
					dataType: "json",
					data: {
						"rptId": "sys_getLog",
						"pagerow": pageSize,
						"currpage": pageNum,
						"wd": that.log,
						"startWith": "recvr-" + tabId
					},
					cache: false,
					async: false,
					success: function(data) {
						if(data.code === "0000") {
							if(data.data.rows.length > 0) {
								that.tableData = data.data.rows; //总信息条数从数据库获取;
								that.query.recordCount = data.data.total.totalcount;
								that.tableData.forEach(function(value,index,arr){
									that.tableData[index].createDate=commonUtil.getFormatDate2(that.tableData[index].createDate);
								})
							} else {
								that.tableData = [];
	
								that.query.recordCount = 0;
							}
						}
					}
				});
			}
		},
		// 分页
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		//点击页数
		handleCurrentChange(pageNum) {
			this.query.pageNum = pageNum;
			this.createTableData(10, this.query.pageNum);
		},
		handleCheckChange(data, checked, indeterminate) {
			console.log(data.parentId, checked, indeterminate);
//			if(checked){
//				if(data.parentId == undefined || data.parentId == null || data.parentId == ""){
//					this.selectNode.push(data.parentId);
//				}
//			}else{
//				if(data.parentId == undefined || data.parentId == null || data.parentId == ""){
//					var index = this.selectNode.indexOf(data.parentId);
//					if(index>-1){//大于0 代表存在，
//					    this.selectNode.splice(index,1);//存在就删除
//					}
//				}
//				
//			}
		},
		handleNodeClick(data) {
			console.log(data);
		},
		//点击新建归档
		creatTableBut() {
			if(this.selectNode.id == "" || this.selectNode.id == undefined || this.selectNode.id == null) {
				this.centerDialogVisible = false; //关闭对话框
				this.$message({
					showClose: true,
					message: '请选择一个文档！',
					type: 'error'
				});
			} else {
				this.centerDialogVisible = true;	//打开对话框
			}
		},
		//对话框右上角关闭按钮
		handleDialogClose(){
			this.$refs['form'].resetFields();
			this.$refs['form.formData'].resetFields();
			this.centerDialogVisible = false;
		},
		// 对话框取消事件
	 	closeForm(formName) {
	 		this.$refs[formName].resetFields(); //置空表单
	 		this.centerDialogVisible = false;
	 	},
	 	// 保存事件
// 		submitForm(formName){
// 			var that = this;
// 			console.log(that);
			
// 			$.ajax({
// 				type: 'POST',
// 				url: managerURL + 'metadata/bkRecvrCatalog/saveorUpdateCtg', // 接口 URL 地址
// //				contentType: "application/x-www-form-urlencoded;charset=utf-8",
// 				dataType: "json",
// 				data: JSON.stringify({
// 					"ctgId": "",
// 					"ctgName":that.form.name,
// 					"ctgParentId": that.selectNode.id,
// 					"ctgType":that.form.type,
// 					"ordNum":that.form.orderNum,
// 					"bkFileDir":that.form.bkFileDir,
// 					"recvrFileDir":that.form.recvrFileDir
// 				}),
// 				cache: false,
// 				async: false,
// 				success: function(r) {
// 					console.log(r)
// 				}
// 			});
// 			this.$refs[formName].validate((valid) => {
// 	          if (valid) {
// 	            this.centerDialogVisible = false;	//关闭对话框
// 	            this.$refs[formName].resetFields(); //置空表单
// 	          } else {
// 	          	this.centerDialogVisible = true;
// 	            return false;
// 	          }
// 	        });
			
// 			//保存归档信息
// 		},
//获取节点数据
		getNodeData(pId){
			var that = this;
			$.ajax({
				type: 'GET',
				url: dataApiURL + 'metadata/Api/getcatalog', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				data: {
					"rptId": "metad_getcatalog",
		            "pagerow":10000,
					"p_id": pId
				},
				cache: false,
				async: false,
				success: function(r) {
					console.log(r);
					var data=r.data;
					
					if (!data.rows){
			          return;
			        }
					
					if(r.code === "0000") {
					    that.treeData.childNodeData = [];
					    Array.from(data.rows).forEach(function(value,index,array){
				    		that.treeData.childNodeData.push({
								name: value.ctgName,
								id: value.ctgId,
								tabId: value.tabId,
								parentId: value.ctgParentId,
								type: value.ctgType,
								leaf: value.ctgType == 'tab'
							})
						});
					}
				}
			});
		},
		//展开节点
		loadNode(node, resolve) {
			console.log(node)
			var that = this;
			this.node_had = node;//这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
        	this.resolve_had = resolve;//同上，把node.level == 0的resolve也存起来
	        if (node.level === 0) {
	        	return resolve(that.treeData.rootNodeData);
	        }
	        //一级节点
	        if(that.isSearch){
        		return resolve(that.treeData.childNodeData);
        	}else{
        		this.getNodeData(node.data.id)
				return resolve(that.treeData.childNodeData);
        	}
		},
		// 自定义树渲染
		renderTree: function (h, { node, data, store }) {
			var icon = ''
			if(data.type === 'ctg') {
				icon = 'el-icon-folder'
			} else {
				icon = 'el-icon-document'
			}
			return h('span',{},[
				h('i',{
					class: icon,
				}),
				h('span',{
					class: "el-tree-node__label",
					style: "margin-left: 10px;",
					domProps:{
						innerHTML: data.name
					}
				})
			])
		},
//		loadNode(node, resolve) {
//			console.log(node)
//			var that = this;
//			var firstNode = [];
//			//写死根节点
//			if(node.level === 0) {
//				return resolve(that.rootNode);
//			}
//			//一级节点
//			if(node.level === 1) {
//				$.ajax({
//					type: 'GET',
//					url: dataApiURL + 'swagger/getApiData', // 接口 URL 地址
//					contentType: "application/x-www-form-urlencoded;charset=utf-8",
//					dataType: "json",
//					data: {
//						"rptId": "metad_getcatalog",
//			            "pagerow":10000,
//						"p_id": "0"
//					},
//					cache: false,
//					async: false,
//					success: function(data) {
//						console.log(data);
//						if(data.code === "0000") {
//							data.data.rows.forEach(function(currentValue, index, arr) {
//								firstNode.push({
//									name: currentValue.ctgName,
//									id: currentValue.ctgId,
//									tabId: currentValue.tabId,
//									parentId:0
//								})
//							})
//						}
//					}
//				});
//				return resolve(firstNode);
//			} else {
//				var childData = [];
//				$.ajax({
//					type: 'GET',
//					url: dataApiURL + 'swagger/getApiData', // 接口 URL 地址
//					contentType: "application/x-www-form-urlencoded;charset=utf-8",
//					dataType: "json",
//					data: {
//						"rptId": "metad_getcatalog",
//			            "pagerow":10000,
//						"p_id": node.data.id
//					},
//					cache: false,
//					async: false,
//					success: function(data) {
//						console.log(data);
//						if(data.code === "0000") {
//							data.data.rows.forEach(function(currentValue, index, arr) {
//								childData.push({
//									name: currentValue.ctgName,
//									id: currentValue.ctgId,
//									parentId: currentValue.ctgParentId,
//									tabId: currentValue.tabId
//								})
//							})
//						}
//					}
//				});
//				return resolve(childData);
//			}
//		},
		//节点被点击时回调
		nodeClick(node) {
			var that = this;
			this.selectNode = node;
			$.ajax({
				type: 'GET',
				url: dataApiURL + 'metadata/Api/getTabInfoByTabID', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				data: {
					"rptId": "metad_getTabInfoByTabID",
					//		            "pagerow":10000,
					"tabId": node.tabId
				},
				cache: false,
				async: false,
				success: function(data) {
					if(data.code === "0000") {
						console.log(data.data.rows)
						if(data.data.rows.length > 0) {
							that.logForm = data.data.rows[0];
							that.isDim = data.data.rows[0].tabType === 'dim'
							that.logForm.name = node.name;
						}else{
							that.logForm={};
						}
					}
				}
			});
			console.log(that)
			this.createTableData(10, 1);
		},
		/*
		 新增目录
		 * */
// 		creatMenu(){
// 			var that = this;
// 			this.menu.parentName = this.selectNode.name;
// 			if(this.selectNode.id == "" || this.selectNode.id == undefined || this.selectNode.id == null) {
// 				this.dialogFormVisible = false; //关闭对话框
// 				this.$message({
// 					showClose: true,
// 					message: '请选择一个文档！',
// 					type: 'error'
// 				});
// 			} else {
// 				this.dialogFormVisible = true;	//打开对话框
// 			}
// //			保存或更新目录：metadata/bkRecvrCatalog/saveorUpdateCtg
// //			参数为this.menu
// 		},
		/*
		 新增归档
		 * */
		//表结构
		//添加
		// addData() {
		// 	this.form.formData.tableData.push({
		// 		edit: true,
		// 	});
		// },
		//确认添加
		// confirmAdd(row, formName) {
		// 	this.$refs[formName].validate((valid) => {
		// 		if(valid) {
		// 			row.edit = false;
		// 		}
		// 	})
		// },
		//修改
		// editData(row) {
		// 	row.edit = true;
		// },
		//删除
		// deleteData(row, index) {
		// 	this.form.formData.tableData.splice(index, 1);
		// },
	}
});