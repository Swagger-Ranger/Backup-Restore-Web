// vue
var vm = new Vue({
	el: '#rrapp',
	data: {
		isShowParentName: true,
		searchInput:'',	//搜索目录
		props: {
			label: 'name',
			children: 'zones',
			isLeaf: 'leaf'
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
		node_had:[],
		resolve_had:[],
		tempNode:[],
		isClickNode: 0,
		isSearch:false,
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
			ctgName:'',
			parentName: null,
			ctgParentId: 0,
			ctgType: 'ctg',
			tabId: '',	//时间戳
			orderNum: 0,
		},
		title:'新建归档',
		menuTitle:'',
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
		logForm: {
			tabComment: '',
			tabType: '',
			key: '',
			bkFileDir: '',
			recvrFileDir: ''
		},
		formWidth: '120px',
		
		log: '',
		//新增归档信息校验
		rules: {
			tabComment: {
				required: true,
				message: '请输入归档表中文名',
			},
			tabName: [
				{
					required: true,
					message: '请输入归档表名',
				},{
					pattern: /^\w+$/,
					message: '仅允许输入英文及下划线'
				}
			],
			tabType: {
				required: true,
				message: '请选择归档类型',
				trigger: 'change'
			},
			bkFileDir: {
				required: true,
				message: '请输入归档地址',
			},
			recvrFileDir: {
				required: true,
				message: '请输入恢复地址',
			},
			fieldName: {
				required: true,
				message: '请输入字段名',
			},
			fieldType: {
				required: true,
				message: '请输入类型',
			},
			fieldComment: {
				required: true,
				message: '请输入描述',
			},
			fieldDesc: {
				required: true,
				message: '请输入备注',
			},
		},
	},
	//用于数据初始化
	created: function() {
		this.createTableData();
	},
	mounted() {
//		this.getNodeData("0");
	},
	computed: {
		
	},
	methods: {
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
					"startWith": "backup-"
				},
				cache: false,
				async: false,
				success: function(data) {
					if(data.code === "0000") {
						if(data.data.rows.length > 0) {
							that.tableData = data.data.rows;
							that.tableData.forEach(function(value,index,arr){
								that.tableData[index].createDate=commonUtil.getFormatDate2(that.tableData[index].createDate);
							})
						}
						console.log(that.tableData);
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
						"startWith": "backup-" + tabId
					},
					cache: false,
					async: false,
					success: function(data) {
						if(data.code === "0000") {
							if(data.data.rows.length > 0) {
								that.tableData = data.data.rows; //总信息条数从数据库获取;
								that.tableData.forEach(function(value,index,arr){
									that.tableData[index].createDate=commonUtil.getFormatDate2(that.tableData[index].createDate);
								});
								that.query.recordCount = data.data.total.totalcount;
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
		creatTableBut(dialogTitle) {
			this.title = dialogTitle;
			if(this.selectNode.id == "" || this.selectNode.id == undefined || this.selectNode.id == null) {
				this.centerDialogVisible = false; //关闭对话框
				this.$message({
					showClose: true,
					message: '请选择一个文档！',
					type: 'error'
				});
			} else {
				if (dialogTitle === "修改归档") {
					if (this.selectNode.type === "ctg") {
						this.centerDialogVisible = false; //关闭对话框
						this.$message({
							showClose: true,
							message: '请选择目录下的文档！',
							type: 'error'
						});
					} else {
						this.form.ctgId = this.selectNode.id;
						this.form.tabId = this.selectNode.tabId;
						this.form.ctgParentId = this.selectNode.parentId;
						
						var that = this;
						$.ajax({
							type: 'GET',
							url: dataApiURL + 'metadata/Api/getTabColByTabID', // 接口 URL 地址
							contentType: "application/x-www-form-urlencoded;charset=utf-8",
							dataType: "json",
							data: {
								"rptId": "metad_getTabColByTabID",
								"pagerow":10000,
								"tabId":that.selectNode.tabId
							},
							cache: false,
							async: false,
							success: function(r) {
								that.form.formData.tableData=r.data.rows.map(data => {
									data.edit = false;
									var colType = data.tabColType;
									if(data.tabColLength > 0) {
										colType += '(' + data.tabColLength
										if (data.tabColPrecision > 0) {
											colType += ',' + data.tabColPrecision+')';
										} else {
											colType += ')'
										}
									}
									data.tabColType = colType
									return data;
								});
								console.log(that.form.formData.tableData);
							}
						});

						this.centerDialogVisible = true;	//打开对话框
					}
				} else {
					var tempForm = {
						ctgId: '',
						tabName:'',
						tabComment: '',	//表的中文名
						tabType: '',
						key: '',
						tabId: timestamp.toString(),
						ctgParentId: that.selectNode.id,
						orderNum: 0,
						bkFileDir: '',
						recvrFileDir: '',
						formData: {
							tableData: [],
						}
					};
					this.form = tempForm;
					this.centerDialogVisible = true;	//打开对话框
				}
			}
		},
		//对话框右上角关闭按钮
		handleDialogClose(){
			this.$refs['form'].resetFields();
			this.$refs['form.formData'].resetFields();
			this.form.formData.tableData=[];
			this.centerDialogVisible = false;
		},
		// 对话框取消事件
	 	closeForm(formName) {
	 		this.$refs['form.formData'].resetFields();
	 		this.form.formData.tableData=[];
	 		this.$refs[formName].resetFields(); //置空表单
	 		this.centerDialogVisible = false;
	 	},
	 	// 对话框保存事件
		submitForm(formName){
			var that = this;
			console.log(that);
			var tabData=[];
			var reg = /(?:\()\w+(?:\))/g;
			// var timestamp=new Date().getTime();
			// that.form.tabId = timestamp.toString();
			for(var i = 0;that.form.formData.tableData.length>i;i++){
				var coldata=that.form.formData.tableData[i].tabColType;
				var colLength=coldata.substring( coldata.indexOf("(") + 1, coldata.indexOf(")"));
				var type=coldata.split("(")[0]
//				var colLength=that.form.formData.tableData[i].type.match(reg);
				console.log(colLength)
				if(colLength.indexOf(",")>-1){
					var length= 0;
					length=colLength.split(",")[0];
					var precision= 0;
					precision=colLength.split(",")[1];

				} else {
					var length=colLength
				}
				
				tabData.push(
					{"tabId":that.form.tabId,  //归档表的tableID
					 "tabColName":that.form.formData.tableData[i].tabColName,
					 "tabColComment":that.form.formData.tableData[i].tabColComment,
					 "tabColType":type,
					 "tabColDesc":that.form.formData.tableData[i].tabColDesc,
					 "tabColLength":length,
					 "tabColPrecision":precision,
					 "tabPkFlag":that.form.formData.tableData[i].tabPkFlag})
			}
		
			$.ajax({
				type: 'POST',
				url: portalURL + 'metadata/bkRecvrCatalog/saveOrUpdateVo', // 接口 URL 地址
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify({
					"ctgId": that.form.ctgId,
					"ctgName":that.form.tabComment,
					"ctgParentId": that.form.ctgParentId,
					"ctgType": 'tab',
					"tabId":that.form.tabId,
					"ordNum":that.form.orderNum,
					"bkFileDir":that.form.bkFileDir,
					"recvrFileDir":that.form.recvrFileDir,
					"sysId":'101',
					"sysSchema": 'user',
					"tabName":that.form.tabName,
					"tabComment":that.form.tabComment,
					"tabType": that.form.tabType,
					"tabDesc": '',
					"cols":tabData
					
				}),
				cache: false,
				async: false,
				success: function(r) {
					console.log(r)
					var metadTree = that.$refs.tree;
					let node = metadTree.getNode('0'); // 通过节点id找到对应树节点对象
					node.loaded = false;
					node.expand();
					that.dialogFormVisible = false;
					that.$message({
						message: '操作成功',
						type: 'success'
					});
				}
			});
			var formDataFalg = true;
			this.$refs['form.formData'].validate((valid) => {
	          if (valid) {
	            formDataFalg = true;
	          } else {
	            formDataFalg = false;
	          }
	        });
			this.$refs[formName].validate((valid) => {
	          if (valid && formDataFalg) {
	            this.centerDialogVisible = false;	//关闭对话框
	            this.$refs[formName].resetFields(); //置空表单
	          } else {
	          	this.centerDialogVisible = true;
	            return false;
	          }
	        });
			
			//保存归档信息
		},
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
		//获取节点数据
		getNodeData(pId){
			var that = this;
			$.ajax({
				type: 'GET',
				//url: dataApiURL + 'swagger/getApiData', // 接口 URL 地址
				url: dataApiURL + 'metadata/Api/getcatalog', 
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
		//节点被点击时回调
		nodeClick(node) {
			var that = this;
			this.selectNode = node;
			console.log(node)
			if (node.type === "tab") {

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
							if(that.selectNode.type == "tab") {
								that.logForm = data.data.rows[0];
								if(that.dialogTitle == "新建归档"){
									that.form={}
								}else{
									that.form.ctgId = node.id
									that.form.tabName = data.data.rows[0].tabName;
									that.form.tabComment = data.data.rows[0].tabComment;
									that.form.tabType = data.data.rows[0].tabType;
									that.form.key = data.data.rows[0].tabColName;
									that.form.bkFileDir = data.data.rows[0].bkFileDir;
									that.form.recvrFileDir = data.data.rows[0].recvrFileDir;
								}
								console.log(that.form)
	//							that.logForm.name = node.name;
							}else{
								that.logForm={};
							}
						}
					}
				});
				console.log(that)
			}

			this.createTableData(10, 1);
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
//		nodeClick(node) {
//			var that = this;
//			this.selectNode = node;
//			console.log(this.selectNode);
//			$.ajax({
//				type: 'GET',
//				url: dataApiURL + 'swagger/getApiData', // 接口 URL 地址
//				contentType: "application/x-www-form-urlencoded;charset=utf-8",
//				dataType: "json",
//				data: {
//					"rptId": "metad_getTabInfoByTabID",
//					//		            "pagerow":10000,
//					"tabId": node.tabId
//				},
//				cache: false,
//				async: false,
//				success: function(data) {
//					if(data.code === "0000") {
//						if(that.selectNode.type == "tab"){
//							that.form = data.data.rows[0];
//						}else{
//							that.form={};
//						}
////						if(data.data.rows.length>0 && that.selectNode.type == "tab"){
////							that.form = data.data.rows[0];
////						}else{
////							that.form={};
////						}
//					}
//					console.log(that.form)
//				}
//			});
//		},
		/*
		 新增目录
		 * */
		creatMenuIcon(title){
			var that = this;
			this.menuTitle = title
			
			if(this.selectNode.id == "" || this.selectNode.id == undefined || this.selectNode.id == null) {
				this.dialogFormVisible = false; //关闭对话框
				this.$message({
					showClose: true,
					message: '请选择一个文档！',
					type: 'error'
				});
			} 
			else {
				if (title === '修改目录') {
					this.menu.ctgName = this.selectNode.name;
					this.isShowParentName = false;
					this.menu.ctgId = this.selectNode.id;
					this.menu.ctgParentId = this.selectNode.parentId;
				} else {
					this.isShowParentName = true;
					this.menu.parentName = this.selectNode.name;
					this.menu.ctgName = '';
					if(this.selectNode.type === 'ctg') {
						this.menu.ctgParentId = this.selectNode.id
						
					} else {
						this.menu.ctgParentId = this.selectNode.parentId
					}
				}
				this.dialogFormVisible = true;	//打开对话框
			}
		},
		creatMenu(){
			var timestamp=new Date().getTime();
//			this.menu.tabId = timestamp.toString();
			var that = this;
			$.ajax({
				type: 'POST',
				url: portalURL + 'metadata/bkRecvrCatalog/saveorUpdateCtg', // 接口 URL 地址
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(that.menu),
				cache: false,
				async: false,
				success: function(data) {
					console.log(data)
					if(data.code === 0) {
						var metadTree = that.$refs.tree;
						let node = metadTree.getNode('0'); // 通过节点id找到对应树节点对象
						node.loaded = false;
						node.expand();
						that.dialogFormVisible = false;
					}else{
						that.$message.error({
							message: '新增目录失败！请联系管理员'
						});
					}
				}
			});
		},
		//关闭对话框事件
		closeDialog(formName){
			this.$refs[formName].resetFields(); //置空表单
			this.dialogFormVisible = false;
		},
		/*
		 新增归档
		 * */
		//表结构
		//添加
		addData() {
			this.form.formData.tableData.push({
				edit: true,
			});
		},
		//确认添加
		confirmAdd(row, formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
					row.edit = false;
				}
			})
		},
		//修改
		editData(row) {
			row.edit = true;
		},
		//删除
		deleteData(row, index) {
			this.form.formData.tableData.splice(index, 1);
		},
		// 导出配置
		exportData() {
		// POST: /dataApi/interface/downloadData
		// Params：rptId=metad_getTableInfoByTableId
		// 		   TabId=
			var config = $.extend(true, {method: 'post'}, {url: dataApiURL + 'metadata/Api/getTableInfoByTableId', rptId : "metad_getTableInfoByTableId"})
			var $iframe = $('<iframe style="display: none;" id="down-file-iframe" />');
			var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
			$form.attr('action', config.url);
			$form.append('<input type="hidden" name="rptId" value="' + config.rptId + '" />');
			$form.append('<input type="hidden" name="token" value="' + token + '" />');
			
			$iframe.append($form);
			$(document.body).append($iframe);
			$form[0].submit();
			$iframe.remove();
		},
		// 删除树节点。需要目录下无文件才可删除目录
		deleteCtgOrTab() {
			var that = this;
			var metadTree = this.$refs.tree;
			var arr = metadTree.getCheckedNodes()
			var ids = [];
			console.log(this.$refs.tree);
			
			Array.from(arr).forEach(node => {
				// console.log(node);
				if (node.type === "ctg") {
					$.ajax({
						type: 'GET',
						//url: dataApiURL + 'swagger/getApiData', // 接口 URL 地址
						url: dataApiURL + 'metadata/Api/getcatalog', 
						contentType: "application/x-www-form-urlencoded;charset=utf-8",
						dataType: "json",
						data: {
							"rptId": "metad_getcatalog",
							// "pagerow":10000,
							"p_id": node.id
						},
						cache: false,
						async: false,
						success: function(r) {
							console.log(r);
							if (r.data.total.totalcount === 0) {
								ids.push(node.id);
							}
						}
					});
				} else {
					ids.push(node.id);
				}
			})

			// console.log(ids);
			if (ids.length > 0) {
				//删除
				$.ajax({
					type: 'POST',
					url: portalURL + 'metadata/bkRecvrCatalog/deleteByBatchId',
					contentType: "application/json",
					dataType: "json",
					data: JSON.stringify(ids),
					async: false,
					success: function(r) {
						// console.log(r);
						let node = metadTree.getNode('0'); // 通过节点id找到对应树节点对象
						node.loaded = false;
						node.expand();
						if (r.code === 0) {
							that.$message({
								message: '成功删除'+r.deleteCount+'条归档',
								type: 'success'
							});
						} else {
							that.$message.error({
								message: '发生未知异常'
							});
						}
					}
				});
				
			} else {
				that.$message({
					message: '无可删除的节点',
					type: 'info'
				});
			}

		}
	}
});