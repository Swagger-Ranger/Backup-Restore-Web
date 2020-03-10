var vm = new Vue({
	el:'#rrapp',
	data:{
		user:{},
		menuList:{},
		main:"welcome.html",
		form:{
			password:'',
			newPassword:''
		},
		navTitle:"欢迎页"
	},
	methods: {
		getUser: function(){
			$.getJSON(portalURL + "sys/user/info", function(r){
				console.log(r.user);
				vm.user = r.user;
				$("#user_info").text(r.user.username+'  ');
				$("#user_info").attr('title',r.user.username+'  ');
			});
		},
		updatePassword: function(){
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "修改密码",
				area: ['550px', '270px'],
				shadeClose: false,
				content: jQuery("#passwordLayer"),
				btn: ['修改','取消'],
				btn1: function (index) {
					$.ajax({
						type: "POST",
						url: portalURL + "sys/user/password",
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify(vm.form),
						success: function(r){
							if(r.code == 0){
								layer.close(index);
								layer.alert('修改成功', function(){
									location.reload();
								});
							}else{
								layer.alert(r.msg);
							}
						}
					});
				}
			});
		},
	},
	created: function(){
		// this.getMenuList();
		this.getUser();
	},
	updated: function(){
		//路由
		var router = new Router();
		routerList(router, vm.menuList);
		router.start();
	}
});



function routerList(router, menuList){
	for(var key in menuList){
		var menu = menuList[key];
		if(menu.type == 0){
			routerList(router, menu.list);
		}else if(menu.type == 1){
			if(menu.url == 'druid/sql.html'){
				menu.url = portalURL + 'druid/sql.html';
			}
			router.add('#'+menu.url, function() {
				var url = window.location.hash;
				
				//替换iframe的url
				vm.main = url.replace('#', '');

			    //导航菜单展开
			    $(".treeview-menu li").removeClass("active");
			    $(".sidebar-menu li").removeClass("active");
			    $("a[href='"+url+"']").parents("li").addClass("active");
			    
			    vm.navTitle = $("a[href='"+url+"']").text();
			});
		}
	}
}



var riskTabNm='';
var riskTabId='';
//保存访问菜单日志
function saveMenuLog(title, url){
	// $.ajax({
	// 	type:'post',
	// 	url:portalURL+"log/saveMenuLog",
 //        data: { 
 //    	 	 	 "title": title, 
 //        	 	 "url": url
 //        	 },
 //        contentType: "application/x-www-form-urlencoded; charset=utf-8", 
	// 	success:function(data) {
	// 	}
	// });
}
//打开tab菜单
function addMenuTab(id, title, url, icon, isClosed, isHomePage){
	saveMenuLog(title, url);
	var tabList = nthTabs.getTabList();
	var isExisted = false;// 是否已经打开的标志
	for(var i = 0; i < tabList.length; i++){
		if(tabList[i].id == ('#'+id)){
			//如果已经打开，刷新这个iframe
			$('#'+id+'.tab-pane').attr('src', $('#'+id+'.tab-pane').attr('src'));
			isExisted = true;
			break;
		}
	}
	//拼接BIEE自动登陆信息
	if(url.indexOf('/analytics') == 0){
		url +=  top.degUrl;
	}
	if(!isExisted){
		//之前没打开过的，要先打开；如果之前已经打开过的，不进这里add
		nthTabs.addTab({id:id,title:title,content:'',url:url,icon:icon,isClosed:isClosed,isHomePage:isHomePage});
		$('#tab_menu li a[href="#'+id+'"]').contextmenu(function(event){
			curRightCkTabId = $(this).attr('href').replace('#','');
			if(typeof($(this).find('.fa-close').html()) == 'undefined'){
				$('#rightMouseDrop .noCloseDom').hide();
			}else{
				$('#rightMouseDrop .noCloseDom').show();
			}
			//右键弹窗样式
			var top = $(this).parent().offset().top + $(this).parent().height();
			var left = $(this).parent().offset().left;
			$('#rightMouseDrop').css('top',top+'px').css('left',left+'px');
 	    	$('#rightMouseDrop').show();
 	    	//遮罩层样式
			$('#rightMouseBackdrop').css('top', '0').css('left', '0').css('width', $(window).width()+'px').css('height', $(window).height()+'px').css('position','absolute').css('z-index','990');
 	    	$('#rightMouseBackdrop').show();
			return false;
		});
	}
	//然后切换到这个tab
	nthTabs.setActTab(id);
	nthTabs.locationTab();

	//每次新增tab，如果有弹窗，自动隐藏它
	if($('.dropdown-menu').css('display') == 'block'){
		$('.dropdown-backdrop').click();
	}
	if($('#rightMouseDrop').css('display') == 'block'){
		$('#rightMouseBackdrop').click();
	}

	//右上角操作dropdown点击时间，用来判断隐藏“关闭当前标签页”，没有关闭按钮的不显示这个按钮
	$('.dropdown.roll-nav.right-nav-list').click(function(){
		if(typeof($('#tab_menu li.active').find('.fa-close').html()) == 'undefined'){
			$('.dropdown-menu .closeCurLi').hide();
		}else{
			$('.dropdown-menu .closeCurLi').show();
		}
	});
}

var nthTabs;
var curRightCkTabId;//当前右键点击的tab的id
$(function () {
	//基于bootstrap tab的自定义多标签的jquery实用插件，滚动条依赖jquery.scrollbar，图标依赖font-awesome
    nthTabs = $("#tab_menu").nthTabs();
	
    var defaultMenuUrl = $('#defaultMenuUrl', window.parent.document).val();
	var _url = "<%=basePath%>login_default.do";
	//如果是完整url地址，直接用此地址
	if(defaultMenuUrl != null && defaultMenuUrl.indexOf('http') == 0 || defaultMenuUrl.indexOf('www') == 0){
		_url = defaultMenuUrl;
	}else{
		//否则拼接本系统根路径
		_url = "<%=basePath%>"+defaultMenuUrl;
	}
	//打开默认的菜单
// 	addMenuTab($('#defaultMenuId', window.parent.document).val(),$('#defaultMenuName', window.parent.document).val(),_url,$('#defaultIcon', window.parent.document).val(),false,true);
	openDefautTabs();
	
	//自适应iframe高度、宽度
	cmainFrameT();

	//点击右键遮罩层，关闭弹窗
	$('#rightMouseBackdrop').click(function(){
		$('#rightMouseDrop').hide();
		$('#dropdownRightCtrl').hide();
		$('#rightMouseBackdrop').hide();
		$('#dropdownRightCtrl').css('top',top+'px').css('left','0');
	});
	
	//关闭当前tab点击事件
	$('#closeCurTab').click(function(){
		nthTabs.delTab(curRightCkTabId);
		$('#rightMouseDrop').hide();
		$('#rightMouseBackdrop').hide();
	});
	
	//关闭其它tab点击事件
	$('#closeOtherTab').click(function(){
		nthTabs.setActTab(curRightCkTabId);
		nthTabs.delOtherTab();
		$('#rightMouseDrop').hide();
		$('#rightMouseBackdrop').hide();
	});
	
	//关闭全部tab点击事件
	$('#closeAllTab').click(function(){
		nthTabs.delAllTab();
		$('#rightMouseDrop').hide();
		$('#rightMouseBackdrop').hide();
	});
	
	//右侧dropdown打开事件，显示遮罩层
	$('#dropdownNthTabDiv').on('shown.bs.dropdown', function () {	
		$('#rightMouseBackdrop').css('top', '0').css('left', '0').css('width', $(window).width()+'px').css('height', $(window).height()+'px').css('position','absolute').css('z-index','1');
    	$('#rightMouseBackdrop').show();
	});
	
	//右侧dropdown关闭事件，隐藏遮罩层
	$('#dropdownNthTabDiv').on('hidden.bs.dropdown', function () {	
    	$('#rightMouseBackdrop').hide();
	});
	
	//点击右上角操作按钮
	$('#tab_menu .user_info_clk').click(function(){
		var top = $('.roll-nav-right1').height();
		var left = $('#tab_menu').width() - $('#dropdownRightCtrl').width();
		$('#dropdownRightCtrl').show();
		$('#dropdownRightCtrl').css('top',top+'px').css('left',left+'px');
		$('#rightMouseBackdrop').css('top', '0').css('left', '0').css('width', $(window).width()+'px').css('height', $(window).height()+'px').css('position','absolute').css('z-index','1');
    	$('#rightMouseBackdrop').show();
	});

	$('#openLogImg').click(function(){
		
	});
	
	//左侧伸缩按钮点击事件
	$('#tab_menu .roll-nav-left-a1').click(function(){
		// 判断是否手机宽度
		var isPhoneWidth = false;
		if('relative' == $('div.page-sidebar.nav-collapse.collapse', window.parent.document).css('position')){
			isPhoneWidth = true;
		}
		if(isPhoneWidth){
			if($('.page-sidebar', window.parent.document).css('display') == 'none'){
				$('#phoneMenuBtn', window.parent.document).fadeIn(500);
				$('.page-sidebar', window.parent.document).fadeIn(500);
			}else{
				$('.page-sidebar', window.parent.document).fadeOut(500);
			}
		}else{
			if($('.page-container', window.parent.document).hasClass('sidebar-closed')){
				//展开
				$('.page-container', window.parent.document).removeClass('sidebar-closed');
				$('#closeLogImg', window.parent.document).hide();
				$('#openLogImg', window.parent.document).show();
				$('#leftMenus', window.parent.document).addClass('leftOverflow');
			}else{
				//收缩
				$('.page-container', window.parent.document).addClass('sidebar-closed');
				$('#openLogImg', window.parent.document).hide();
				$('#closeLogImg', window.parent.document).show();
				$('#leftMenus', window.parent.document).removeClass('leftOverflow');
			}
		}
	});
	
	//菜单收缩后，li悬浮事件
	$(".sidebar-closed #leftMenu li.has-sub").mouseover(function(){
		console.log($(this).find('.title').text());
	});

	//提交修改
	$('#updatePasswordSubmit').click(function(){
		if($("#updatePasswordForm").valid()){
			$.ajax({
				type:'post',
				url:portalURL+"user/updatePwd",
		        data: { "USER_ID":$('#USER_ID').val() , 
		        	 	 "USERNAME" : $('#USERNAME').val(),
		        	 	 "PASSWORD":$('#PASSWORD1').val()
		        },
	            contentType: "application/x-www-form-urlencoded; charset=utf-8", 
				success:function(data) {
					$('#tipResult').modal('show');
					$('#tipResultMess').text(data.msg);
					if(data.success){
						$('#updatePassword').modal('hide');
					}
				}
			})
		}
	});
	
	//提交修改默认菜单
	$('#updateDefaultOpenSubmit').click(function(){
		var deOpenArr = $("#defaultOpen").multipleSelect("getSelects","value");
		var deOpenArrStr = "";
		for(var k = 0; k < deOpenArr.length; k++){
			if(k > 0){
				deOpenArrStr += ',';
			}
			deOpenArrStr += deOpenArr[k];
		}		
		if($("#updateOpenForm").valid()){
            $.ajax({
            	type:'post',
				url: portalURL+"user/updateUserOpenmenu",
            	data:{"USER_ID" : $("#USER_ID2").val(),
            		  "OPEN_MENU" : deOpenArrStr},
            	contentType: "application/x-www-form-urlencoded; charset=utf-8", 
                success: function (data, status) {
                    if (data.success) {
                    	$('#updateOpen').modal('hide');
                    }else{
                    	$('#tipResult').modal('show');
						$('#tipResultMess').text(data.msg);
                    }
                    $('#tipResult').modal('show');
					$('#tipResultMess').text(data.msg);
                },
                error: function () {
                    alert("Error");
                },
                complete: function () {
 
                }
            });
			
			}
	});

	//加载默认打开选项
	var menuList2 = window.parent.menuList;
	var menuStr="";
	if(menuList2 != null){
		for(var i=0;i<menuList2.length;i++){
			if(menuList2[i].subMenu.length>0){
				for(var j=0;j<menuList2[i].subMenu.length;j++){
					menuStr += "<option value='"+menuList2[i].subMenu[j].MENU_ID+"'>"+menuList2[i].subMenu[j].MENU_NAME+"</option>";
				}
			}
		}
	}
	$("#defaultOpen").append(menuStr); 
	$('#defaultOpen').multipleSelect({
        width: '100%',
		selectAll:false,
		placeholder: "请选择"
    });
	var openList3 = window.parent.openList;
// 	如果用户还没有默认页面的设置，在session取到默认打开的页面作为初始的设置
	if(openList3 != null && !openList3.length){
		if(sessionStorage.getItem("openList") != null){
			openList3 = sessionStorage.getItem("openList").split(",");
		}else{
			openList3 = [];
		}
	}
	$("#defaultOpen").multipleSelect("uncheckAll");
	if(openList3 != null){
		$('#defaultOpen').multipleSelect("setSelects", openList3);
	}
});

	//javascript没有类似Thread中的sleep()方法，只能模拟一个这个方法实现。
	function sleep(n){
		 var start = new Date().getTime();//定义起始时间的毫秒数
		 while(true){
		     var time=new Date().getTime();//每次执行循环取得一次当前时间的毫秒数
		     if(time-start > n){//如果当前时间的毫秒数减去起始时间的毫秒数大于给定的毫秒数，即结束循环
		         break;
		     }
		 }
	}
	
	//打开默认的菜单
	function openDefautTabs(){
		var defaultMenuIds =  window.parent.defaultMenuIds;
		var defaultMenuNames = window.parent.defaultMenuNames;
		var defaultMenuUrls = window.parent.defaultMenuUrls;
		var defaultIcons = window.parent.defaultIcons;
		//通过点击的方式打开，如果直接for循环调用addMenuTab方法，在打开多个时不会自动登陆BIEE
		for(var i=0;i < defaultMenuIds.length;i++){
			var openidd = "#"+defaultMenuIds[i]+">a";
			$(openidd,window.parent.document).trigger("click");
		}
	}
	
	//修改密码
	function editUserH(){
		$('input').val('');
		// $("#USER_ID").val([[${session.sessionUser.USER_ID}]]);
		// $("#USERNAME").val([[${session.sessionUser.USERNAME}]]);
		$("#USERNAME").attr("readonly","readonly");
		
		$('#updatePassword').modal('show');
	}

	var upatePwdValite = $("#updatePasswordForm").validate({
		rules : {
			PASSWORD1: {
				required:true,
				isPwd: true
			},
			PASSWORD2: {
				required:true,
				isPwd: true,
				equalTo: "#PASSWORD1"
			}
		},
		messages: {
			PASSWORD1: {
				required:"请输入密码"
			},
			PASSWORD2: {
				required:"请确认密码",
				equalTo: "两次密码不一致"
			}
		} 
		
	});
	
	var upateDeoValite = $("#updateOpenForm").validate({
		rules : {
			defaultOpen: {
				required:true
			}
		},
		messages: {
			defaultOpen: {
				required:"请至少选择一个菜单"
			}
		} 
		
	});

	//修改默认打开
	function editOpen(){
		//$('input').val('');
		// $("#USER_ID2").val([[${session.sessionUser.USER_ID}]]);
		// $("#USERNAME2").val([[${session.sessionUser.USERNAME}]]);
		$("#USERNAME2").attr("readonly","readonly");
		if($('#updateOpen').val()==null){
			openList3 = sessionStorage.getItem("openList").split(",");
			$('#defaultOpen').multipleSelect("setSelects", openList3);
		}
		$('#updateOpen').modal('show');
	}

	//退出时清除biee的登陆状态
	function clearBiee(){
 		addMenuTab("1", "", "/analytics/saw.dll?Logoff", "", true, false);

 		$.ajax({
				type: "POST",
				url: portalURL + "sys/logout",
				dataType: "json",
				success: function(r){
                    //删除本地token
                    localStorage.removeItem("token");
                    //跳转到登录页面
                    location.href = '../../login.html';
                }
            });
	}
	
	function cmainFrameT(){
		var hmainT = document.getElementById("tab-content");
		var bheightT = document.documentElement.clientHeight;
		hmainT.style.width = '100%';
		//绝对iframe id="page"的高度
		hmainT.style.height = (bheightT  - 55) + 'px';

		var isPhoneWidth = false;
		if('relative' == $('div.page-sidebar.nav-collapse.collapse', window.parent.document).css('position')){
			isPhoneWidth = true;
		}
		if(isPhoneWidth){
			//手机端宽度
			$('#phoneMenuBtn', window.parent.document).fadeIn(10);
		}else{
			//PC端宽度
			$('div.page-sidebar.nav-collapse.collapse', window.parent.document).show();
			var leftMenuWidth = $('div.page-sidebar.nav-collapse.collapse', window.parent.document).width();
			if(leftMenuWidth == 280){
				$('.page-container', window.parent.document).removeClass('sidebar-closed');
				$('#closeLogImg', window.parent.document).hide();
				$('#openLogImg', window.parent.document).show();
			}
		}
	}
	window.onresize=function(){  
		cmainFrameT();
	};