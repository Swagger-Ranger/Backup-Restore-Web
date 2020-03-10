//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

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

//请求前缀/区分各个应用 --卓志诚 20191022
/*
192.168.1.45:8082/portal    每户应用
192.168.1.45:8083/dataApi   数据接口
192.168.1.45:8084/weChat    微信渠道管理
192.168.1.45:8085/vData     微数智
192.168.1.45:8088/riskAsist 风控助手

*/
var baseURL = "/portalURL/";
var vdataURL = "/vData/";
var portalURL = "/portal/";
var dataApiURL = "/portal/";//"/dataApi/";
var weChatURL = "/weChat/";
var riskAsistURL = "/riskAsist/";
var dataIptURL = "/dataIpt/";
var managerURL = "/manager/";

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
            // parent.location.href = 'login.html';
            ////parent.location.href = '/../../login.html';
            // layer.alert(
            //     xhr.responseJSON.msg,
            //     {closeBtn: 0},
            //     function () {parent.location.href = '/../../login.html';}
            // );
        }
    }
});

//jqgrid全局配置
$.extend($.jgrid.defaults, {
    ajaxGridOptions : {
        headers: {
            "token": token
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
            parent.layer.closeAll('loading'); //关掉
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

//选择一条记录
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    
    return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    return grid.getGridParam("selarrrow");
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

