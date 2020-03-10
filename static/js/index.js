window.nthTabs = $('#nth-tabs').nthTabs({
        entrustParent:'body',
        extDiv: { 
            //            enable: true, 
            width: 100,
            selector: '#user-info'
        },
    });

    $(function() {
    	getUser();
		getMenuList();

        $('.side-bar').on('click', 'li.basic>a', function() {
            var menuId = $(this).data('id');
            var url = $(this).data('url');
            var newwindow = $(this).data('newwindow');
            // var newwindow = $(this).attr('data-newwindow');
            var name = $(this).text();
            if(url&&newwindow!="1"){
                nthTabs.addTab({
                    id: menuId,
                    title: name,
                    content: getContent(url),
                }).setActTab('#' + menuId);
            }else if(url&&newwindow=="1"){
            	window.open(url);
            }

        });
	});
	
	function getContent(url) {
        return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
    }
    
	function addMenuTab(id,title,url){
		nthTabs.addTab({
	        id: id,
	        title: title,
	        content: getContent(url),
	  });
	}
	
	function addActiveMenuTab(id,title,url){
		nthTabs.addTab({
	        id: id,
	        title: title,
	        content: getContent(url),
	        active: true
	  	});
	}

    function displayTime() {
    var weekday = "  星期" + "日一二三四五六".charAt(new Date().getDay()); 
    var elt = document.getElementById("clock"); // 通过id= "clock"找到元素
    var now = new Date(),hour = now.getHours();
    elt.innerHTML = now.Format("MM/dd hh:mm")+weekday; //让elt来显示它

    // now = new Date().Format("yyyy-MM-dd hh:mm:ss"); // 得到当前时间
    // elt.innerHTML = now.toLocaleTimeString(); //让elt来显示它

	if(hour < 6){$("#goodmorning").text("凌晨好！");} 
	else if (hour < 9){$("#goodmorning").text("早上好！")} 
	else if (hour < 12){$("#goodmorning").text("上午好！")} 
	else if (hour < 14){$("#goodmorning").text("中午好！")} 
	else if (hour < 17){$("#goodmorning").text("下午好！")} 
	else if (hour < 19){$("#goodmorning").text("傍晚好！")} 
	else if (hour < 22){$("#goodmorning").text("晚上好！")}
	else {$("#goodmorning").text("夜里好！")} 



    setTimeout(displayTime,1000); //在1秒后再次执行
   }
   window.onload = displayTime; //当onload事件发生时开始显示时间

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18

Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
}

//生成菜单
var menuItem = Vue.extend({
    name: 'menu-item',
    props:{item:{},index:0},
    template:[
        '<li :class="{active: (item.type===0 && index === 0)}">',
        '<a v-if="item.type === 0" href="javascript:;">',
        '<i v-if="item.icon != null" :class="item.icon"></i>',
        '<span>{{item.name}}</span>',
        '<i class="fa fa-angle-left pull-right"></i>',
        '</a>',
        '<ul v-if="item.type === 0" class="treeview-menu">',
        '<menu-item :item="item" :index="index" v-for="(item, index) in item.list"></menu-item>',
        '</ul>',
        '<a v-if="item.type === 1" :href="\'#\'+item.url">' +
        '<i v-if="item.icon != null" :class="item.icon"></i>' +
        '<i v-else class="fa fa-circle-o"></i> <span>{{item.name}}</span>' +
        '</a>',
        '</li>'
    ].join('')
});

//iframe自适应
$(window).on('resize', function() {
	$('body').addClass('loaded');
    $('#loader-wrapper .load_title').remove();

    //登录token
    var token = localStorage.getItem("token");
    if(token == 'null'||token==null){
        parent.location.href = '../../login.html';
    }
}).resize();

//注册菜单组件
Vue.component('menuItem',menuItem);

var vm = new Vue({
	el:'#rrapp',
	data:{
		user:{},
		menuList:{},
		main:"welcome.html",
        form:{
            password:'',
            newPassword:'',
            username: ''
		},
        navTitle:"欢迎页"
	},
	methods: {
		getMenuList: function () {
			$.getJSON(portalURL + "sys/menu/nav", function(r){
				console.log(r.menuList);
				if(r.code==401){//错误码

				}
				else{
					// console.log(r.menuList);
					vm.menuList = r.menuList;
					$('.menu-list').html(menuProducer(r.menuList));
					//默认打开第一个
			        var done = false;
			        $('li.basic>a').each(function(index, item) {
			            if (!done) {
			                if ($(item).data('url') != null) {
			                    $(item).trigger('click');
			                    done = true;
			                }
			            }
			        });
	                window.permissions = r.permissions;
                }
			});
		},

		getUser: function(){
			$.getJSON(portalURL + "sys/user/info", function(r){
				if(r.code==401){
					layer.alert(
						r.msg,
						{closeBtn: 0},
						function () {parent.location.href = '../../login.html';}
					);
				}
				// console.log(r.code);
				// console.log(r.msg);
				else{
					// console.log(r.user);
					vm.user = r.user;
				}
			});
		},
		
		updatePassword: function(){
			layer.open({
				type: 1,
				// skin: 'layui-layer-molv',
				skin:'demo-class',
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
								layer.alert('修改成功');
							}else{
								layer.alert(r.msg);
							}
						}
					});
	            }
			});
		},
		ssccs: function () {
			// window.location.href = "http://www.ssccs.net/f";
		},
		logout: function () {
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
        },

        // logout: function () {
        // 	localStorage.removeItem("token");
        // 	window.location.href = "../../login.html";
   //      	var userAgent = navigator.userAgent;
			// if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
			// 	window.location.href = "about:blank";
			// }else {
			// 	window.opener = null;
			// 	window.open("about:blank", "_self");
			// 	window.close();
			// }
        // },
	},
	created: function(){
		// this.getUser();
		// this.getMenuList();
		// this.displayTime();
		// this.goodmorning();
	},
	updated: function(){
		//路由
		var router = new Router();
		routerList(router, vm.menuList);
		router.start();
	}
});

function closeWindow(){
	localStorage.removeItem("token");
	// 重置window.opener用来获取打开当前窗口的窗口引用
　　	// 这里置为null,避免IE下弹出关闭页面确认框
    window.opener = null;
    // JS重写当前页面
    // window.open(" ", "_self");
    window.location.href="about:blank";
  	window.close();
    // 顺理成章的关闭当前被重写的窗口
    window.close();
}

function closeWindows() {
         var browserName = navigator.appName;
         var browserVer = parseInt(navigator.appVersion);
         //alert(browserName + " : "+browserVer);
 
         //document.getElementById("flashContent").innerHTML = "<br>&nbsp;<font face='Arial' color='blue' size='2'><b> You have been logged out of the Game. Please Close Your Browser Window.</b></font>";
 
         if(browserName == "Microsoft Internet Explorer"){
             var ie7 = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;  
             if (ie7)
             {  
               //This method is required to close a window without any prompt for IE7 & greater versions.
               window.open('','_parent','');
               window.close();
             }
            else
             {
               //This method is required to close a window without any prompt for IE6
               this.focus();
               self.opener = this;
               self.close();
             }
        }else{  
            //For NON-IE Browsers except Firefox which doesnt support Auto Close
            try{
                this.focus();
                self.opener = this;
                self.close();
            }
            catch(e){
 
            }
 
            try{
                window.open('','_self','');
                window.close();
            }
            catch(e){
 
            }
        }
    }

function getUser(){
	$.getJSON(portalURL + "sys/user/info", function(r){
		if(r.code==401){
			layer.alert(
				r.msg,
				{closeBtn: 0},
				function () {parent.location.href = '../../login.html';}
			);
		}
		// console.log(r.code);
		// console.log(r.msg);
		else{
			// console.log(r.user);
			vm.user = r.user;
		}
	});
}

function getMenuList(){//这个才是获取menu的方法，目前调用的是这个
	$.getJSON(portalURL + "sys/menu/nav", function(r){
		if(r.code==401){//错误码

		}
		else{
			// console.log(r.menuList);
			vm.menuList = r.menuList;
			$('.menu-list').html(menuProducer(r.menuList));

			//默认打开第一个
	        var done = false;
	        $('li.basic>a').each(function(index, item) {
	            if (!done) {
	                if ($(item).data('url') != null) {
	                    $(item).trigger('click');
	                    done = true;
	                }
	            }
	        });

            window.permissions = r.permissions;
        }
	});
}

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
