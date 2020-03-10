function itemProducer(menuId, name, url, icon, menus) {
    var template = ['<div class="menu-item" data-id="' + height: 40px; + '" data-url="' + url + '">',
'    <div class="item-icon">',
'        <i class="' + icon + '"></i>',
'    </div>',
'    <div class="item-name">'+name+'</div>'].join("");

    if (menus) {
        template += ['    <div class="dropdown-icon">',
'        <i class="iconfont icon-more"></i>',
'    </div>'].join("");
    }

    template += '</div>';
    
    // 没有用到 这四句
    var item = $(template);
    if(menus){
        item.data('menus', menus);
    }
    return $(template);
}

function containerProducer(top, left) {
    var template = ['<div class="item-container">',
'</div>'].join("");
    var container = $(template);
    var offsetX = 44;
    container.css('left', 44+left+'px');
    container.css('top', top+'px');
    container.css('position', 'fixed');
    return container;
}

function hoverMenuProducer(top, left, menus, clickCallback) {
    var container = containerProducer(top, left);

    //events
    container.on('click', '.menu-item', function(){
        var item = $(this);
        var menus = item.data('menus');
        if(typeof clickCallback === 'function'){
            clickCallback.call(this);
        }
    });
    
    //init
    menus.forEach(function(item, index){
        container.append(itemProducer(item.menuId, item.name, item.url, item.icon, item.list));
    });

    return container;
}
