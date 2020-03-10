window.nthTabs = $('#nth-tabs').nthTabs({
    entrustParent:'body',
    extDiv: { 
        //            enable: true, 
        width: 100,
        selector: '#user-info'
    },
});

var currentUserNickName = '';
$(function() {
	getUser();
	getMenuList();

    function getContent(url) {
        return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
    }

	$("#help").mouseover(function(){
		layer.tips('使用文档', '#btnHelp', {
		  tips: 3
		});
	});

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
        parent.location.href = '../../boss.html';
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
						function () {parent.location.href = '../../boss.html';}
					);
				}
				// console.log(r.code);
				// console.log(r.msg);
				else{
					// console.log(r.user);
					vm.user = r.user;
					$('#sysUserOrg').val(r.user.orgNm);
				}
			});
		},
		
		updatePassword: function(){
			layer.open({
				type: 1,
				// skin: 'layui-layer-molv',
				// skin:'demo-class',
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
                    location.href = '../../boss.html';
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
	r.user={nickname:"bugbug",orgNm:""};
	$("#currentUser").html(r.user.nickname);
	$('#sysUserOrg').text(r.user.orgNm);
	currentUserNickName = r.user.nickname;
	vm.user = r.user;
}

function getMenuList(){
	$.getJSON(portalURL + "sys/menu/nav", function(r){
		if(r.code==401){//错误码
			alter('未登录错误:'+r.code);
		}
		else{
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
	        //绑定点击事件。用来记录最新浏览记录
	        $('li.basic>a').click(function(){
	        	saveBrowsingHistory($(this).attr('data-id'));
	        	// getNoticeCount();
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

function closeTab(){
	var tabid = nthTabs.getActiveId();
	nthTabs.delTab(tabid);
}