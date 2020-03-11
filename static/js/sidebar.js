function basicLiProducer(id, name, url, icon,parentId,genre) {
    if(parentId==0){
        if(genre == 'N') {
            return ['<li class="basic">',
                '    <a data-id="' + id + '" href=javascript:openNewWindow("'+name+'","'+url+'");><i class="' + icon + '"></i><span class="name f-s-16">' + name + '</span></a>',
                '</li>'].join("");
        }
        return ['<li class="basic">',
            '    <a data-url="' + url + '" data-id="' + id + '" href=javascript:menuLog("'+name+'")><i class="' + icon + '"></i><span class="name f-s-16">' + name + '</span></a>',
            '</li>'].join("");
    }
    else{
        if(genre == 'N') {
            return ['<li class="basic">',
                '    <a data-id="' + id + '" href=javascript:openNewWindow("'+name+'","'+url+'") ><i class="' + icon + '"></i><span class="name">' + name + '</span></a>',
                '</li>'].join("");
        }
        return ['<li class="basic">',
        '    <a data-url="' + url + '" data-id="' + id + '" href=javascript:menuLog("'+name+'")><i class="' + icon + '"></i><span class="name">' + name + '</span></a>',
        '</li>'].join("");
    }
}

function dropdownLiProducer(id, name, icon, menus,parentId) {
    //前半部分
    var nameHtml='    <a href="#"><i class="'+icon+'"></i><span class="name">'+name+'</span></a>';
    if(parentId==0){
        nameHtml='    <a href="#"><i class="'+icon+'"></i><span class="name f-s-16">'+name+'</span></a>';
    }
    var front = ['<li class="dropdown">',
//'    <span class="dropdown-icon"><i class="fa fa-chevron-right"></i></span>',
'    <span class="dropdown-icon"><i class="iconfont icon-more"></i></span>',
    nameHtml,
'    <div class="menu-dropdown">',
'<div class="btn-dropdown btn-dropdown-next"><i class="fa fa-chevron-down"></i></div>',
'<div class="btn-dropdown btn-dropdown-prev"><i class="fa fa-chevron-up"></i></div>',
'        <ul class="menu-list">'].join("");
    var middle = menuProducer(menus);
    var end = ['        </ul>',
'    </div>',
'</li>'].join("");

    return front + middle + end;
}

/*返回lis的字符串*/
/*
    {
    id:string
    name:string
    url:string
    icon:string
    dropdown:boolean
    menus:array
    }
*/
function menuProducer(menus) {
    var lis = '';
    menus.forEach(function (menu, index) {
        if (menu.list&&menu.list.length>0) {
            lis += dropdownLiProducer(menu.menuId, menu.name, menu.icon, menu.list, menu.parentId);
        } else {
            lis += basicLiProducer(menu.menuId, menu.name, menu.url, menu.icon, menu.parentId, menu.genre);
        }
    });
    return lis;
}

//这里的dom是a标签
function dropdown(dom) {
    // console.log('adding');
    $(dom).parent().addClass('active');
    $(dom).siblings('.menu-dropdown').slideDown(300);

    // focus到 对应的位置
    setTimeout(function () {
        $('.menus').mCustomScrollbar("scrollTo", $(dom), {
            scrollEasing: "easeOut"
        });
    }, 250);
}

function restore(dom) {
    // console.log('restoring');
    $(dom).parent().removeClass('active');
    $(dom).siblings('.menu-dropdown').slideUp(300, function () {
        //防止 内嵌的style样式影响 外联的css class style
        $(this).attr('style', '');
    });
}

function toggle(dom) {
    // console.log('toggling');
    if ($(dom).parent().hasClass('active')) {
        restore(dom);
    } else {
        dropdown(dom);
    }
}

function cancelBasicActive() {
    $('li.basic.active').removeClass('active');
}

function cancelActiveDropdown() {
    $('li.dropdown.active').removeClass('active').children('.menu-dropdown').slideUp(300, function () {
        //防止 内嵌的style样式影响 外联的css class style
        $(this).attr('style', '');
    });
}

function cancelActiveAll() {
    cancelBasicActive();
    cancelActiveDropdown();
}

function aIsActive(a) {
    return aGetLi(a).hasClass('active');
}

function aGetLi(a) {
    return $(a).parent();
}

function iconGetLi(icon) {
    return $(icon).parent().parent();
}

function onClickADropdownHandler() {
    var _this = this;//a
    //循环判断父亲是否有active的，如果有则不取消焦点直接toggle然后退出
    var done = false;
    aGetLi(this).parents('li.dropdown').each(function (index, li) {
        done = !!$(li).hasClass('active');
    });
    if  (done) {
        toggle(_this);
    return;
}

    //父亲无active
    //active是否为自己
    else if (!aIsActive(this)) {
        //不是，需要cancel所有的active
        cancelActiveAll();
    }
    // console.log('t2');
    toggle(_this);
}

function onClickLiBasicHandler() {
    //如果不是自己,取消激活别的节点
    if (!$(this).hasClass('active')) {
        $('li.basic.active').removeClass('active');
    } else {
        return;
    }
    $(this).addClass('active');
}


$(function () {



    $('.side-bar').on('click', 'li.dropdown>a', function () {
        onClickADropdownHandler.call(this);
    });

    //basic
    $('.side-bar').on('click', 'li.basic', function () {
        onClickLiBasicHandler.call(this);
    });

    enableScrollbar();

    $('.side-bar').on('click', '.btn-next', function () {
        //翻页
        var target = $('.menus> .menu-list');
        var originTranslate = target.data('origin');
        var menusHeight = $(this).parent().find('.menus').prop('offsetHeight');
        translate = originTranslate ? (+originTranslate) - menusHeight / 2 : -menusHeight / 2;

        console.log($(this).parent().find('.menus>.menu-list').prop('offsetHeight'));
        //是否超过limit
        var limit = $(this).parent().find('.menus>.menu-list').prop('offsetHeight') - menusHeight;
        console.log(limit);
        if (Math.abs(translate) > limit) {
            translate = -limit;
            $(this).css('display', 'none');
        }

        $('.menus>.menu-list').css('transform', 'translate(0, ' + (translate) + 'px)');
        target.data('origin', translate);


        //
        //        if (target.prop('offsetHeight') + translate / 100 * target.prop('offsetHeight') <= $('.menus').prop('offsetHeight') / 1.5) {
        //            $(this).css('display', 'none');
        //        }

        setTimeout(function () {
            if (translate > 0.03 || translate < -0.03) {
                $('.btn-prev').css('display', 'block');
            }
        }, 1000);
    });

    $('.side-bar').on('click', '.btn-prev', function () {
        //前翻
        var target = $('.menus> .menu-list');
        var originTranslate = target.data('origin');
        var menusHeight = $(this).parent().find('.menus').prop('offsetHeight');
        translate = originTranslate ? (+originTranslate) + menusHeight / 2 : +menusHeight / 2;
        translate = translate > 0 ? 0 : translate;
        if (translate == 0) {
            $(this).css('display', 'none');
        }
        $('.menus>.menu-list').css('transform', 'translate(0, ' + (translate) + 'px)');
        target.data('origin', translate);

        if (target.prop('offsetHeight') + translate / 100 * target.prop('offsetHeight') <= $('.menus').prop('offsetHeight') / 1.5) {
            $('.btn-next').css('display', 'none');
        } else {
            $('.btn-next').css('display', 'block');
        }
    })

    $('.side-bar').on('click', '.btn-dropdown-next', function () {
        //子菜单下翻
        var prev = $(this).siblings('.btn-dropdown-prev');
        var ul = $(this).siblings('.menu-list');
        var height = ul.prop('offsetHeight');
        var dropdownHeight = ul.parent().prop('offsetHeight');

        var origin = $(this).parent().data('origin');
        if (!origin) {
            origin = 0;
        }
        var target = +origin - dropdownHeight / 2;

        //获得边界 0-limit
        var limit = height - ul.parent().prop('offsetHeight');
        //判断target是否越出边界
        if (Math.abs(target) > Math.abs(limit)) {
            target = -limit;
            $(this).css('display', 'none');
        }


        ul.css('transform', 'translate(0, ' + target + 'px' + ')');
        prev.css('display', 'block');

        //回写
        $(this).parent().data('origin', target);
    });

    $('.side-bar').on('click', '.btn-dropdown-prev', function () {
        //子菜单上翻
        var next = $(this).siblings('.btn-dropdown-next');
        var ul = $(this).siblings('.menu-list');
        var height = ul.prop('offsetHeight');

        var origin = $(this).parent().data('origin');
        if (!origin) {
            origin = 0;
        }
        var dropdownHeight = ul.parent().prop('offsetHeight');
        var target = origin + dropdownHeight / 2;

        //边界判断 0-- limit
        if (target > 0) {
            target = 0;
            $(this).css('display', 'none');
        }

        ul.css('transform', 'translate(0, ' + target + 'px' + ')');
        next.css('display', 'block');

        $(this).parent().data('origin', target);
    });

    $('.side-bar').on('click', '.brand-nav', function () {
        if ($('.side-bar').hasClass('shrink')) {
            enlarge();
            $('#content').css('padding-left', '220px');
            $('.brand-icon').children("img").attr("src", "static/img/myccb.png");
            $('.brand-icon').children("img").css({
                width:'200px',
                height:'50px',
                'padding-top':'0',
                'padding-left':'0'
            });
            $(this).css({
                position:'relative',
                left:'0px'
            });
        } else {
            shrink();
            $(this).css({
                position:'absolute',
                left:'50px'
            });
            $('.brand-icon').children("img").css({
                width:'38px',
                height:'50px',
                'padding-top':'6px',
                'padding-left':'5px',
                'padding-bottom':'6px',
            });
            $('.brand-icon').children("img").attr("src", "favicon.ico");
            $('#content').css('padding-left', '45px');
        }
    });
});

function enableScrollbar() {
    //        scrollbar
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        if ($('.menus').mCustomScrollbar) {
            $('.menus').mCustomScrollbar('destroy');
            $(".menus").mCustomScrollbar({
                axis: "y",
                autoHideScrollbar: true,
                scrollInertia: 300
            });
        }
    }
}

function enlarge() {
    enableScrollbar();

    //取消绑定 mouseenter leave事件
    $('.side-bar').off('mouseenter', 'li');
    $('.side-bar').off('mouseleave', 'li');

    //绑定click事件
    $('.side-bar').on('click', 'li.dropdown>a', function () {
        onClickADropdownHandler.call(this);
    });
    //basic
    $('.side-bar').on('click', 'li.basic', function () {
        onClickLiBasicHandler.call(this);
    });

    //remove shrink class
    $('.side-bar').removeClass('shrink');

    //hide btn next prev
    $('.content-btn').css('display', 'none');
}

//缩小
function shrink() {

    //取消所有active
    cancelActiveAll();
setTimeout(function(){
    $('.menus').mCustomScrollbar('destroy');

    $('.side-bar').addClass('shrink');
    //取消onclick监听
    $('.side-bar').off('click', 'li.dropdown>a');
    $('.side-bar').off('click', 'li.basic');

    $('.side-bar').on('mouseenter', 'li', function () {

        $(this).addClass('enter')


        function getRect(elem) {
            var r = elem.getBoundingClientRect()
            return r;
        };
        var r = getRect(this);
        var top = r.top;

        var sHeight = document.documentElement.clientHeight;
        //当top大于屏幕的一半，且子菜单高度加top大于屏幕则添加reverse
        var perHeight = 45;
        if (top > sHeight / 2) {
            var liAmount = $(this).children('div.menu-dropdown').children('.menu-list').children('li').length;
            if ((top + perHeight * liAmount) > sHeight) {
                $(this).addClass('enter-reverse');
                $(this).children('div.menu-dropdown').css('max-height', top + 'px');
                $(this).children('div.menu-dropdown').css('overflow-y', 'hidden');
                $(this).children('div.menu-dropdown').css('overflow-x', 'hidden');
                //假如高度超过maxheight则显示按钮
                if ($(this).children('div.menu-dropdown').children('ul.menu-list').prop('offsetHeight') > top) {
                    $(this).children('div.menu-dropdown').children('.btn-dropdown-next').css('display', 'block');
                }
            }
        } else {
            //当top小于屏幕的一半，则不添加reverse
            //添加最大高度至屏幕底部

            $(this).children('div.menu-dropdown').css('max-height', (+sHeight - top) + 'px');
            var liAmount = $(this).children('div.menu-dropdown').children('.menu-list').children('li').length;
            if ((top + perHeight * liAmount) > sHeight) {
                //                添加按钮
                //                $(this).children('div.menu-dropdown').css('overflow-x', 'visible');
                $(this).children('div.menu-dropdown').css('overflow', 'hidden');
                $(this).children('div.menu-dropdown').children('.btn-dropdown-next').css('display', 'block');  
            }
        }

    });
    $('.side-bar').on('mouseleave', 'li', function () {
        $(this).removeClass('enter');
        $(this).removeClass('enter-reverse');
        $(this).children('div').attr('style', '');
        //div.menu-dropdown
        $(this).children('div').children('div').attr('style', '');
        //div.
        $(this).children('div').children('ul').attr('style', '');
    });

    //假如高度超过content， 显示按钮
    if ($('.menus>.menu-list').prop('offsetHeight') > $('.menus').prop('offsetHeight')) {
        //
        $('.btn-next').css('display', 'block');
    }}, 300);
};

function openNewWindow(operation,url) {
    if(operation.indexOf("日志") > -1){
        window.open(url, 'newwindow');
        return;
    }
    $.post(portalURL+"/sys/log/menuLog",{"operation":operation},function(r){
        window.open(url, 'newwindow');
    })
}

function menuLog(operation) {
    if(operation.indexOf("日志") > -1){
        return;
    }
    $.post(portalURL+"/sys/log/menuLog",{"operation":operation},function(r){});
}
