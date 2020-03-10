var baseURL = "/portal/";
var vdataURL = "/vData/";
var portalURL = "/portal/";
var dataApiURL = "/dataApi/";
var weChatURL = "/weChatPush/";
var riskAsistURL = "/riskAsist/";
var dataIptURL = "/dataIpt/";
var managerURL = "/manager/";


//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

//请求前缀
var baseURL = portalURL;

//登录token
var token = localStorage.getItem("token");
// console.log(token);
if(token == 'null'){
    parent.location.href = 'login.html';
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
            console.log(xhr.responseJSON);
            if(typeof(xhr.responseJSON)=="undefined"){
                parent.layer.alert(
                    "操作异常，请联系管理员",
                    {closeBtn: 0}
                    // function () {
                    //     parent.location.href = '/../../login.html';
                    // }
                );
            }
            else{
                parent.layer.alert(
                    xhr.responseJSON.msg,
                    {closeBtn: 0},
                    function () {parent.location.href = '/../../login.html';}
                );
            }
        }
    }
});

//权限判断
function hasPermission(permission) {
    return true;
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

function closeCurrentLayer(){
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭   
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

layerMsgCountDown = function(msg, callback){
    layer.msg(msg, {
        time: 5000,
        shade: 0.6,
        success: function (layero, index) {
            var msg = layero.text();
            var i = 5;
            var timer = null;
            var fn = function () {
                layero.find(".layui-layer-content").text(msg + '(' + i + ')');
                if (!i) {
                    layer.close(index);
                    clearInterval(timer);
                }
                i--;
            };
            timer = setInterval(fn, 1000);
            fn();
        },
    }, function (index) {
    //这里写需要执行的
        callback("ok");
    });
}

//重写alert
openLayer = function(obj){
    layer.open({
        type : 1,
        offset : '50px',
        // skin : 'layui-layer-molv',
        title : "添加便捷导航菜单",
        area : [ '800px', '480px' ],
        shade : 0.5,
        shadeClose : false,
        content : $(obj),
        //btn : [ '确定' ],
        btn1 : function(index) {
            layer.close(index);
        }
    }); 
}

function getContent(url) {
    return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
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

//检查IE版本，如果是低于IE9的返回false，其他情况返回true
function checkIeVersion() {
    var version = IEVersion();
    if (version == 6 || version == 7 || version == 8) {
        return false;
    }
    return true;
}

//获取IE版本
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1
            && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1
    && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1;//不是ie浏览器
    }
}

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

function dateFormatter(value, row, index){
    return commonUtil.getFormatDate2(value);
}