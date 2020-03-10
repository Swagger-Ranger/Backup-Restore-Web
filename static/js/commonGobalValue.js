var baseURL = "/portal/";
var vdataURL = "/vData/";
var portalURL = "/portal/";
var dataApiURL = "/portal/";//"/dataApi/";
var weChatURL = "/wechatPush/";
var riskAsistURL = "/riskAsist/";
var dataIptURL = "/dataIpt/";
var dingTalkURL = "/dingPush/"
var managerURL = "/manager/";

// var systemPath = "http://km.highjet.com.cn:7003/";
var systemPath = "";

function getSystemPath() {
    if (systemPath == '') {
        systemPath = getHostName();
    }
    return systemPath;
}

function getHostName() {
    var hostname;
    $.ajax({
        type: "GET",
        url: weChatURL + "hostname/getSystemPath",
        cache:false, 
        async:false,
        success:function(data){
            console.log(data);
            hostname = data;
        }
    });
    return hostname;
}

//判断是否已经登陆，如果没有，则跳转到登陆界面
var token = localStorage.getItem("token");
// console.log(token);
if (token == undefined || token == null || token ==''){
	//token = getURLParameter("token");

    token=getCookie("token");
}
if(token == 'null'){
    //parent.location.href = 'login.html';
    console.log("token = 'null'");
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
    complete: function(xhr,textStatus) {
        //通过XMLHttpRequest取得响应头，sessionstatus，
         var sessionstatus=xhr.getResponseHeader("sessionstatus");
         if(sessionstatus=="timeout"){
             //如果超时就处理 ，指定要跳转的页面(比如登陆页)
             // window.location.replace("/login/index.php");
             window.alert("请求超时");
             return false;
         }

        //token过期，则跳转到登录页面
        if(xhr.responseJSON == null || xhr.responseJSON.code == 401){
            alert(xhr.responseJSON);
            return false;
            parent.location.href = '/../../login.html';
        }
    }
});

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

//权限判断
function hasPermission(permission) {
    return true;


    if (window.parent.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

//获取参数
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}


//设置Cookie，兼容微信


//设置cookie
function setCookie(v_name,value,expiredays)
{
var exdate=new Date()
 var c_name= v_name;
exdate.setDate(exdate.getDate()+expiredays)
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString());

// alert("设置客户端设置cookie:"+c_name+";value:"+value);
}
 
//取回cookie
function getCookie(v_name)
{
    var c_name= v_name;
    if (document.cookie.length>0)
      {
      c_start=document.cookie.indexOf(c_name + "=")
      if (c_start!=-1)
        { 
        c_start=c_start + c_name.length+1 
        c_end=document.cookie.indexOf(";",c_start)
        if (c_end==-1) c_end=document.cookie.length;
        // alert("获取客户端设置cookie:"+c_name+";value:"+unescape(document.cookie.substring(c_start,c_end)));
        return unescape(document.cookie.substring(c_start,c_end))
        } 
      }
    return ""
}