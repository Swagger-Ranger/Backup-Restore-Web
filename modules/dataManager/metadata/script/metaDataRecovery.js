var token =window.localStorage.token;
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
		treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
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
		//目录
		menu: {
			ctgName:'',
			parentName: null,
			ctgParentId: 0,
			ctgType: 'ctg',
			tabId: '',	//时间戳
			orderNum: 0,
		},
        formLabelWidth: '100px',
		isScroll: false,
		logForm: {
			sourceName: '',
			outName: '',
			time: '',
		},
		formWidth: '150px',
		log: '',
	},
	//用于数据初始化
	created: function() {
		
	},
	mounted() {
		this.menuSearch();
		this.createTableData();
//		this.getNodeData("0");
	},
	computed: {
		
	},
	methods: {
		//归档信息日志查询
		createTableData() {
			var that = this;
			var tabId = that.selectNode.tabId;
			$.ajax({
				type: 'GET',
				url: baseURL + 'opt/record/queryList', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				beforeSend: function(request) {
					request.setRequestHeader("token", token);
				},
				data: {
					"pageSize": that.query.pageSize,
					"currPage":that.query. pageNum,
					"tableName": that.tableName
				},
				cache: false,
				async: false,
				success: function(data) {
					if(data.code == "0") {
						that.tableData=data.page.list;
					 	that.tableData.forEach(function(value,index,arr){
					 		that.tableData[index].createtime=commonUtil.getFormatDate2(that.tableData[index].createtime);
					 		that.tableData[index].finishtime=commonUtil.getFormatDate2(that.tableData[index].finishtime);
					 	});
						that.query.recordCount = data.totalCount;
						console.log('query-----------' + that.query);
					}
				}
			});
		},
		// 分页
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.query.pageSize = val;
			this.createTableData();
		},
		//点击页数
		handleCurrentChange(pageNum) {
			this.query.pageNum = pageNum;
			this.createTableData();
		},
		handleCheckChange(data, checked, indeterminate) {
			console.log(data.parentId, checked, indeterminate);
		},
		handleNodeClick(data) {
			console.log(data);
		},
		//搜索目录
		menuSearch(){
			var that  = this;
			var nodeParentId = '';
			that.treeData = [];
			var searchClickNode =[];
			//模拟数据
			var data=[
			]
			that.treeData=data;
			//模拟数据end
			$.ajax({
				type: 'GET',
				url: baseURL + 'opt/getMapperTree', // 接口 URL 地址
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				dataType: "json",
				beforeSend: function(request) {
					request.setRequestHeader("token", token);
				},
				data: {
					"tableName":that.searchInput
				},
				cache: false,
				async: false,
				success: function(r) {
					console.log(r);
					if(r.code == "0") {
						that.isSearch = true;
						that.treeData=r.mapperTree;
						console.log(
							"0=-------------------------------" + r.mapperTree.children
						);
					}
				}
			});
		},
		//节点被点击时回调
		nodeClick(node) {
			var that = this;
			this.selectNode = node;
			console.log('------------sdfadf' + node);
			 if (node.type == "node") {
				$.ajax({
					type: 'GET',
					url: baseURL + 'table/tableMapper/info/'+node.id, // 接口 URL 地址
					contentType: "application/x-www-form-urlencoded;charset=utf-8",
					dataType: "json",
					beforeSend: function(request) {
						request.setRequestHeader("token", token);
					},
					data: {
						
					},
					cache: false,
					async: false,
					success: function(data) {
						if(data.code == "0") {
							console.log('data---' + data);
							that.logForm.sourceName = data.backupRestore.sourceName;
							that.logForm.outName = data.backupRestore.outName;
						}
					}
				});
				console.log(that)
			}
			this.query.pageNum = 1;
			this.createTableData();
		},
		// 自定义树渲染
		renderTree: function (h, { node, data, store }) {
			var icon = ''
			if(data.type === 'tab') {
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
						innerHTML: data.label
					}
				})
			])
		},
		backUp(){
			//执行备份
			var that = this;
			var data ={
				"mapperId" : that.selectNode.id,
				"sourceName" : that.logForm.sourceName,
				"outName" : that.logForm.outName,
				"opt": 1,
				"startDay": that.logForm.time[0],
        		"endDay": that.logForm.time[1]
			}
			$.ajax({
	            type: 'POST',
	            url: baseURL + 'opt/backupRestore', // 接口 URL 地址
	            contentType: "application/json",
	            dataType: "json",
	            beforeSend: function(request) {
	                request.setRequestHeader("token", token);
	            },
	            data: JSON.stringify(data),
	            async: false,
	            success: function(r) {
	            	if(r.code == "0"){
	            		that.$message({
				          showClose: true,
				          message: '操作成功！',
				          type: 'error'
				        });
	            	}
	                // console.log(r);
	            }
	        });
		},
	}
});