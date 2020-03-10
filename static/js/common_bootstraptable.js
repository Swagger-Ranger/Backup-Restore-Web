//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return  decodeURI(r[2]); 
	}
	return null;
};
T.p = url;

//请求前缀
var baseURL = portalURL;

//登录token
var token = localStorage.getItem("token");
if(token == 'null'){
    //parent.location.href = '../../login.html';
}

//jquery全局配置
$.ajaxSetup({
	dataType: "json",
	cache: false,
    headers: {
        "token": token
    },
    xhrFields: {
	    withCredentials: true
    },
    complete: function(xhr) {
        //token过期，则跳转到登录页面
        if(xhr.responseJSON == null || xhr.responseJSON.code == 401){
            //parent.location.href = '../../login.html';
        }
    }
});

//权限判断
function hasPermission(permission) {
    if (window.parent.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

//重写alert
window.alert = function(msg, callback){
	parent.layer.alert(msg, function(index){
		parent.layer.closeAll('loading');//把confirm的load关掉
		parent.layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//重写confirm式样框
window.confirm = function(msg, callback){
	parent.layer.confirm(msg, {btn: ['确定','取消']},
	function(index){//确定事件
		if(typeof(callback) === "function"){
			//关闭确认按钮
			parent.layer.close(index);
            //转圈遮罩层
            var index = parent.layer.load(0,{shade: [0.4, '#999']}, {shadeClose: true}); //0代表加载的风格，支持0-2
			callback("ok");
		}
	});
}

/*
 *选择一条记录
 */
function getSelectedRow() {
    var selected = $('#jqGrid').bootstrapTable('getSelections');

    if(selected.length>1||selected.length==0){
        alert("请选择一条记录");
        return ;
    }
    var ids = new Array();
    for(var i=0;i<selected.length;i++){
        ids[i]=selected[i].id;
    }
    return ids[0];
}

//选择多条记录
function getSelectedRows() {
	var selected = $('#jqGrid').bootstrapTable('getSelections');
	console.log(selected);
    if(selected.length==0){
    	alert("请选择一条记录");
    	return ;
    }
    
    var ids = new Array();
    for(var i=0;i<selected.length;i++){
        ids[i]=selected[i].id;
    }
    return ids;
}

//判断是否为空
function isBlank(value) {
    return !value || !/\S/.test(value)
}

function getUUID() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; 
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
														
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}

//模拟提交表单url
function submitUrlForm(url){
	url = encodeURI(url);
	var form = $("<form>");
	form.attr('style', 'display:none');
	form.attr('target', '');
	form.attr('method', 'post');
	form.attr('action',  url);
	
	var input2 = $('<input>');
	input2.attr('type', 'hidden');
	input2.attr('name', 'token');
	input2.attr('value', token);
	
	$('body').append(form);
	form.append(input2);
	form.submit();
	form.remove();
}

function getContent(url) {
    return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
}

