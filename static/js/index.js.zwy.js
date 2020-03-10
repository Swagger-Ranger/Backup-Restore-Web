window.nthTabs = $('#nth-tabs').nthTabs({
        entrustParent:'body',
        extDiv: { 
            //            enable: true, 
            width: 100,
            selector: '#user-info'
        },
    });

window.onload = function() {
    //假设这里每个五分钟执行一次test函数 
    // getNoticeCount();
    displayTime();
}

// window.onload = displayTime; //当onload事件发生时开始显示时间

$(function() {
	/*根据localStorage获取到的账号和明文密码去设置动态登录BIEE*/
	var account = localStorage.getItem("account");
	var password = localStorage.getItem("password");
	document.getElementById('biee').src="http://172.30.25.9:9704/analytics/saw.dll?Dashboard?NQUser="+account+"&NQPassword="+password;
	getUser();
	getMenuList();

    function getContent(url) {
        return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
    }

    $('.side-bar').on('click', 'li.basic>a', function() {
        var menuId = $(this).data('id');
        var url = $(this).data('url');
		var parentId = $(this).data('parent');
        var name = $(this).text();
        if(url){
			/*先暂时定位这个范围内的菜单以新窗口的方式打开，后面改成配置型*/
			if(parentId == 20001||parentId == 20002){
				window.open(url);
				return;
			}
            nthTabs.addTab({
                id: menuId,
                title: name,
                content: getContent(url),
            }).setActTab('#' + menuId);
        }
    });

    $("#btnNotice").click(function(){
  		var menuId='163';
    	nthTabs.addTab({
            id: menuId,
            title: '消息管理',
            content: getContent('modules/portal/notice.html'),
        }).setActTab('#' + menuId);
	});
})

function getNoticeCount(){
	// $.ajax({
 //        type: "GET",
 //        url: portalURL + "sys/notice/count",
 //        success: function(r){
 //        console.log(r);
 //        if(r.code === 0){
 //            $("#count").text(r.count);
 //            }else{
 //                alert(r.msg);
 //            }
 //        }
 //    });

	// setTimeout(getNoticeCount, 1000 * 60 * 2); //2分钟刷新一次
	
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
            newPassword:''
		},
        navTitle:"欢迎页"
	},
	methods: {
		getMenuList: function () {
			$.getJSON(portalURL + "sys/menu/nav", function(r){
				if(r.code==401){//错误码

				}
				else{
					 console.log(r.menuList);
					vm.menuList = r.menuList;
					$('.menu-list').html(menuProducer(r.menuList));
					//默认打开第一个
			        var done = false;
			        alert(111);
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
	},
	created: function(){
	},
	updated: function(){
		//路由
		var router = new Router();
		routerList(router, vm.menuList);
		router.start();
	}
});

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
			$("#currentUser").html(r.user.nickname);
			vm.user = r.user;
		}
	});
}

function getMenuList(){
	$.getJSON(portalURL + "sys/menu/nav", function(r){
		if(r.code==401){//错误码
			alter('nav error:'+r.code);
		}
		else{
			// console.log(r.menuList);
			vm.menuList = r.menuList;
			$('.menu-list').html(menuProducer(r.menuList));
			//默认打开第一个
	        var done = false;
	       // alert(555);
	        $('li.basic>a').each(function(index, item) {
	            if (!done) {
	                if ($(item).data('url') != null) {
	                   $(item).trigger('click');
	                    done = true;
	                }
	            }
	        });
	        //绑定点击事件。用来记录最新浏览记录
	        $('li.basic>a').click(function(){
	        	saveBrowsingHistory($(this).attr('data-id'));
	        	//alert($(this).attr('data-id'));
	        });
	        
            window.permissions = r.permissions;
        }
	});
}
//保存浏览记录
function saveBrowsingHistory(menuId){
	data={menuId:menuId}
    $.ajax({
        type: "POST",
        url: portalURL + "sys/menulog/saveBrowsingHistory",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(r){
        	// console.log("记录浏览记录成功");
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
