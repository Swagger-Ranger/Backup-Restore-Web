
// var color=['b-f14412','b-43465e','b-baafa5'];
var color=["b-E94F25","b-00b0ec","b-FDD100","b-888BA2","b-F8CABD","b-2C3361","b-F08519","b-FDD100"    ,"b-32cd32","b-d7b28c","b-E94F25","b-2B2B43","b-D0D0F4","b-C1C945","b-38C980"];
var colors=["#E94F25","#00b0ec","#FDD100","#888BA2","#F8CABD","#2C3361","#F08519","#FDD100",    "#cd5cc5","#32cd32","#d7b28c"]; 

//深度克隆
function deepClone(obj){
    var result,oClass=isClass(obj);
        //确定result的类型
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(key in obj){
        var copy=obj[key];
        if(isClass(copy)=="Object"){
            result[key]=arguments.callee(copy);//递归调用
        }else if(isClass(copy)=="Array"){
            result[key]=arguments.callee(copy);
        }else{
            result[key]=obj[key];
        }
    }
    return result;
}
//返回传递给他的任意对象的类
function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}
var oPerson={
    oName:"rookiebob",
    oAge:"18",
    oAddress:{
        province:"beijing"
    },    
    ofavorite:[
        "swimming",
        {reading:"history book"}
    ],
    skill:function(){
        // console.log("bob is coding");
    }
};
//深度克隆一个对象
var oNew=deepClone(oPerson);
 
oNew.ofavorite[1].reading="picture";
// console.log(oNew.ofavorite[1].reading);//picture
// console.log(oPerson.ofavorite[1].reading);//history book
 
oNew.oAddress.province="shanghai";
// console.log(oPerson.oAddress.province);//beijing
// console.log(oNew.oAddress.province);//shanghai


// 获取请求参数
// 使用示例
// T.p('id','http://localhost/index.html?id=123') --> 123;
function getUrlMap(name,url) {
	if(typeof(url) == 'undefined'){
		return null;
	}
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = url.substr(1).match(reg);
	// console.log(r);
	if(r!=null)return  unescape(r[2]); return null;
};

//声明----如果有此 contains 直接用最好
Array.prototype.contains = function ( needle ) {
  for (i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}

 /**
 * 右补位，左对齐
 * @param oriStr 原字符串
 * @param len 目标字符串长度
 * @param alexin 补位字符
 * @return 目标字符串
 */
 function padRight(oriStr,len,alexin){
 var strlen = oriStr.length;
  var str="";
 if(strlen < len){
  for(var i=0;i<len-strlen;i++){
  str = str+alexin;
  }
 }
 str = str + oriStr;
 return str;
 }
  
 /**
 * 左补位，右对齐
 * @param oriStr 原字符串
 * @param len 目标字符串长度
 * @param alexin 补位字符
 * @return 目标字符串
 */
function padLeft(oriStr, len, alexin){
 var strlen = oriStr.length;
 var str="";
 if(strlen < len){
  for(var i=0;i<len-strlen;i++){
  str = str+alexin;
  }
 }
 str = oriStr + str;
 return str;
 }

/**
 * 数组去重
 */
 Array.prototype.distinct = function (){
 var arr = this,
  result = [],
  len = arr.length;
 arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
  var bool = arr.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
  if(bool === -1){
   result.push(v);
  }
 })
 return result;
};

function more(url,name){
    var menuId = guid();
    // var url = 'modules/html/gszcfz.html';
    // var name = "信托业务收入贡献排名-明细";

    if(!name)
    	var name = "明细";
    addTab(menuId,url,name);
}

function more2(url,name){
    var menuId = guid();
    // var url = 'modules/html/gszcfz.html';
    // var name = "信托业务收入贡献排名-明细";
    
    url+="&year_month="+$("#year_month").val();
    if(!name)
    	var name = "明细";
    addTab(menuId,url,name);
}

function resizeEcharts(){
    for(var i = 0; i < charts.length; i++) {  
        charts[i].resize();  
    }  
}

function addTab(menuId,url,name){
    if(url){
        window.parent.nthTabs.addTab({
            id: menuId,
            title: name,
            content: getContent(url),
        }).setActTab('#' + menuId);
    }
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function getContent(url) {
    return '<iframe style="border:none" width="100%" height="100%" src="' + url + '"></iframe>';
}

/*获取上个11月的具体月份 接收参数yyyy-MM返回yyyyMM*/
function getStartMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = parseInt(arr[1]); //获取当前日期的月份
	var lastYear=parseInt(year)-1;
	if(month==12)
		return year+"01";
	else{
		if(month+1<10)
			return lastYear+"0"+(month+1).toString();
		else
			return lastYear+(month+1).toString();
	}
}

/*获取当前年的最后一个月 接收参数yyyy-MM返回yyyy12*/
function getEndMonth(date) {
	return date.substring(0,4)+"12";
}

function dealTableChart(arr1,arr2,date){
	var numMonth=parseInt(date.substring(5));
	//声明2*12的数组
	var kk=2;
	// data=new Object();
    dataZZZ = new Array();  //先声明一维
    for(var k=0;k<kk;k++){    //一维长度为i,i为变量，可以根据实际情况改变
        dataZZZ[k]=new Array();  //声明二维，每一个一维数组里面的一个元素都是一个数组；
        for(var j=0;j<numMonth;j++){   //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；
            dataZZZ[k][j]="";    //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值
        }
    }

    var firstMonth=parseInt(arr1[0].substring(4));
	if(firstMonth!=1){
		// console.log("处理表格有数据项为空的特殊情况");
		dataZZZ[0]=getCurrentMonthArray(date);
		for(var i=0;i<numMonth;i++){
			dataZZZ[1][i]=0;
		}
		for(var i=0;i<arr1.length;i++){
			var currentMonth=parseInt(arr1[i].substring(4));
			var currentValue=parseInt(arr2[i]);
			if(!isNaN(currentMonth)){
				dataZZZ[1][currentMonth-1]=arr2[i];
			}
		}
	}else{
		// dataZZZ[0]=arr1;
		dataZZZ[0]=getCurrentMonthArray(date);
		dataZZZ[1]=arr2;
	}
	
	return dataZZZ;
}

/*获取当前年的最后一个月 接收参数yyyy-MM返回yyyy12*/
function getWholeYearMonthArray(date) {
	// var monthArray=[201801,201802,201803,201804,201805,201806,201807,201808,201809,201810,201811,201812];
	// return monthArray;
	var monthArray=new Array();
	for(var i=1;i<=12;i++){
		if(i<=9)
			monthArray.push(date.substring(0,4)+"0"+i);
		else
			monthArray.push(date.substring(0,4)+i);
	}

	return monthArray;
}

/*获取当前年的最后一个月 接收参数yyyy-MM返回yyyy12*/
function getCurrentMonthArray(date) {
	// var monthArray=[201801,201802,201803,201804,201805,201806,201807,201808,201809,201810,201811,201812];
	// return monthArray;
	var month=parseInt(date.substring(5));

	var monthArray=new Array();
	for(var i=1;i<=month;i++){
		if(i<=9)
			monthArray.push(date.substring(0,4)+"0"+i);
		else
			monthArray.push(date.substring(0,4)+i);
	}
	// console.log(monthArray);
	return monthArray;
}

/*获取当前年的最后一个月 接收参数yyyy-MM返回yyyy12*/
function getMonthDataArray(date) {
	var monthDataArray=[0,0,0,0,0,0,0,0,0,0,0,0];
	return monthDataArray;
}

/*获取当前年的最后一日 接收参数yyyy-MM返回yyyy-12-31*/
function getEndDay(date) {
	return date.substring(0,4)+"-12-31";
}

/*获取当前年的第一个月 接收参数yyyy-MM返回yyyy12*/
function getFirstMonth(date) {
	return date.substring(0,4)+"01";
}

// console.log("getMonth():"+getMonthMinus('2018-09',27));

/*获取上个11月的具体月份 
param1:yyyy-MM,
param2:前N个月   数字类型
返回yyyyMM 
by jiangyin
例如 2019-09,27 return 201706
*/
function getMonthMinus(date,num) {
	//前27个月
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var date1 = new Date(year, month, 0);

	date1.setMonth(date1.getMonth()-num);
	var year1=date1.getFullYear(); 
	var month1=date1.getMonth()+1;
	month1 =(month1<10 ? "0"+month1:month1); 
	sDate = (year1.toString()+month1.toString());
	return sDate;
}

function getMonZone(date){
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var date1 = new Date(year, month, 0);

	var month1=date1.getMonth()+1;
	if (month1 < 10) {
		month1 = '0' + month1;
	}
	return (date1.getFullYear()-2)+''+month1+','+
	(date1.getFullYear()-1)+''+month1+','+
	date1.getFullYear()+''+month1;
}

//获取该月所在季度三个月数字
function getMonZoneQuart(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var quarterMonArr1 = ['01','02','03'];
	var quarterMonArr2 = ['04','05','06'];
	var quarterMonArr3 = ['07','08','09'];
	var quarterMonArr4 = ['10','11','12'];
	
	var thisQuarterMonArr = quarterMonArr1;
	var thisMonth = parseInt(month);
	if(thisMonth > 0 && thisMonth <= 3){
		thisQuarterMonArr = quarterMonArr1;
	}else if(thisMonth > 3 && thisMonth <= 6){
		thisQuarterMonArr = quarterMonArr2;
	}else if(thisMonth > 6 && thisMonth <= 9){
		thisQuarterMonArr = quarterMonArr3;
	}else if(thisMonth > 9 && thisMonth <= 12){
		thisQuarterMonArr = quarterMonArr4;
	}
	
	return year+''+thisQuarterMonArr[0]+','+
	year+''+thisQuarterMonArr[1]+','+
	year+''+thisQuarterMonArr[2];
}

// console.log("getLast5YearMonth:"+getLast5YearMonth('2018-09'));

function getLast5YearMonth(date){
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var date1 = new Date(year, month, 0);
	var month1=date1.getMonth()+1;
	if (month1 < 10) {
		month1 = '0' + month1;
	}
	return (date1.getFullYear()-4)+''+month1+','+
	(date1.getFullYear()-3)+''+month1+','+
	(date1.getFullYear()-2)+''+month1+','+
	(date1.getFullYear()-1)+''+month1+','+
	date1.getFullYear()+''+month1;
}

/*获取下个月*/
function getNextMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中的月的天数
	var year2 = year;
	var month2 = parseInt(month) + 1;
	if (month2 == 13) {
		year2 = parseInt(year2) + 1;
		month2 = 1;
	}
	var day2 = day;
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if (day2 > days2) {
		day2 = days2;
	}
	if (month2 < 10) {
		month2 = '0' + month2;
	}
	var t2 = year2 + '-' + month2 + '-' + day2;
	return t2;
}



/**
 * 扩展Array方法, 去除数组中空白数据
 */
Array.prototype.notempty = function() {
    var arr = [];
    this.map(function(val, index) {
        //过滤规则为，不为空串、不为null、不为undefined，也可自行修改
        if (val !== "" && val != undefined) {
            arr.push(val);
        }
    });
    return arr;
}

var commonUtil = {
		//去掉字符串前后所有空格
		trim_s: function(str){
			return str.replace(/(^\s*)|(\s*$)/g, ""); 
		},
		/**数组根据数组对象中的某个属性值进行排序的方法 
		 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
		 * @param attr 排序的属性 如number属性
		 * @param rev true表示升序排列，false降序排序
		 * */
		sortBy: function(attr,rev){
		    //第二个参数没有传递 默认升序排列
		    if(rev ==  undefined){
		        rev = 1;
		    }else{
		        rev = (rev) ? 1 : -1;
		    }
		    
		    return function(a,b){
		        a = a[attr];
		        b = b[attr];
		        if(a < b){
		            return rev * -1;
		        }
		        if(a > b){
		            return rev * 1;
		        }
		        return 0;
		    }
		},
		strDDD:function(val,num){
			if(typeof(val) != 'undefined'&&val!=null){
				return val.length>num?val.substring(0,num)+"...":val;
			}
		},
		numberFormat:function(val){
			if(val=="")
		    	val=0;
		    if(val=="-")
		    	val="-0";
		    return val;
		},
		yyyy_MM_Last:function(){
		    var today=new Date();
		    var h=today.getFullYear();
		    var m=today.getMonth();
		    if(m==0){m=12;h=h-1;}
		    var d=today.getDate();
		    m= m<10?"0"+m:m;   //  这里判断月份是否<10,如果是在月份前面加'0'
		    d= d<10?"0"+d:d;        //  这里判断日期是否<10,如果是在日期前面加'0'
		    // return h+"-"+m+"-"+d;
		    return h+"-"+m;
		},
		yyyy_MM:function(){
		    var today=new Date();
		    var h=today.getFullYear();
		    var m=today.getMonth()+1;
		    var d=today.getDate();
		    m= m<10?"0"+m:m;   //  这里判断月份是否<10,如果是在月份前面加'0'
		    d= d<10?"0"+d:d;        //  这里判断日期是否<10,如果是在日期前面加'0'
		    // return h+"-"+m+"-"+d;
		    return h+"-"+m;
		},
		getThisYearDate:function(){
			var date = new Date();
			var year = date.getFullYear();
            return year;
		},
		getThisYearMonthDate:function(){
			var date = new Date();
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            return year+"-"+month;
		},
		getThisYearMonthDate2:function(num){
			var date = new Date();
			date.setDate(date.getMonth()+num*1);
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            return year+"-"+month;
		},
		getTodayDate:function(){
			var date = new Date();
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            var day = (""+(date.getDate())).length<2?"0"+(date.getDate()):(date.getDate());;
            return year+"-"+month+"-"+day;
		},
		getTendaysAfterDate:function(){
			var date = new Date();
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            var day = (""+(date.getDate()+10)).length<2?"0"+(date.getDate()+10):(date.getDate()+10);;
            return year+"-"+month+"-"+day;
		},
		getFormatDate:function(d){
			if('undefined' == typeof(d) || null == d || '' == d){
				return '';
			}
			var date = new Date(d);
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            var day = (""+(date.getDate())).length<2?"0"+(date.getDate()):(date.getDate());;
            return year+"-"+month+"-"+day;
		},
		getFormatDate2:function(d){
			if('undefined' == typeof(d) || null == d || '' == d){
				return '';
			}
			var date = new Date(d);
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            var day = (""+(date.getDate())).length<2?"0"+(date.getDate()):(date.getDate());;
            var hh = date.getHours(); //获取当前小时数(0-23)
            var mm = date.getMinutes(); //获取当前分钟数(0-59)
            var ss = date.getSeconds();     //获取当前秒数(0-59)
            if(hh < 10){
            	hh = "0"+hh;
            }
            if(mm < 10){
            	mm = "0"+mm;
            }
            if(ss < 10){
            	ss = "0"+ss;
            }
            return year+"-"+month+"-"+day+" "+hh+":"+mm+":"+ss;
		},
		getFormatDate4:function(f){
			if('undefined' == typeof(f) || null == f){
				f = false;
			}
			var date = new Date();
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            var day = (""+(date.getDate())).length<2?"0"+(date.getDate()):(date.getDate());;
            var hh = date.getHours(); //获取当前小时数(0-23)
            var mm = date.getMinutes(); //获取当前分钟数(0-59)
            var ss = date.getSeconds();     //获取当前秒数(0-59)
            var sss = date.getMilliseconds();     //获取当前秒数(0-999)
            if(hh < 10){
            	hh = "0"+hh;
            }
            if(mm < 10){
            	mm = "0"+mm;
            }
            if(ss < 10){
            	ss = "0"+ss;
            }
            if(sss <10){
            	sss = "00" + sss;
            }else if(sss >10 && sss<100){
            	sss = "0" + sss;
            }
            if(f == true){
            	return year+month+day+hh+mm+ss+sss;
            }else{
            	return  year+"-"+month+"-"+day+" "+hh+":"+mm+":"+ss+":"+sss;
            }
		},
		getFormatDate3:function(d){
			var res = "";
			//yyyymmddhhiiss转化为yyyy-mm-dd hh:ii:ss
			if(d.length==14){
				//yyyymmddhhiiss
				res = d.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6");
			}else if(d.length==8){
				//yyyymmdd
				res = d.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
			}else if(d.length==6){
				//yyyymm
				res = d.replace(/^(\d{4})(\d{2})$/, "$1-$2");
			}else if(d.length==4){
				//yyyy
				res = d;
			}
			return res;
		},
		getDateByNum:function(num){
			var date = new Date(); 
			date.setDate(date.getDate()+num*1);//获取num天后的日期 (num为正数是后num天，为负数是前num天)
			var year = date.getFullYear();
			var month= (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期，不足10补0
			var day = date.getDate()<10?"0"+date.getDate():date.getDate(); //获取当前几号，不足10补0
			return year+"-"+month+"-"+day;
		},
		getDateByNum2:function(num){
			var date = new Date(); 
			date.setDate(date.getDate()+num*3*30);//获取num天后的日期 (num为正数是后num天，为负数是前num天)
			var year = date.getFullYear();
			return year;
		},
		isDate:function(dateString){
			  if(dateString.trim()=="")return true;
			  var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
			  if(r==null){
//			   alert("请输入格式正确的日期\n\r日期格式：yyyy-mm-dd\n\r例  如：2017-06-20\n\r");
				  return false;
			  }
			  var d=new Date(r[1],r[3]-1,r[4]);  
			  var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
			  if(num==0){
//			   alert("请输入格式正确的日期\n\r日期格式：yyyy-mm-dd\n\r例  如：2017-06-20\n\r");
			  }
			  return (num!=0);
		 },
		 getFormatByTime:function(nS) {     
		     return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
		 },
		 isFormatDate:function(value) {  
			 if(value == "")return true;
			 value = value + "";
		     var patrn = /^(\d{4})-(\d{2})-(\d{2})$/;
		     if (patrn.exec(value) == null || value == "") {
		         return false
		     } else {
		         return true
		     }
		 },
		 getDaysInMonth: function(year,month){
				month = parseInt(month,10);  //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
				var temp = new Date(year,month,0);
				return temp.getDate();
		},
		isInteger:function(value){
			if(typeof(value) == 'undefined' || value == null || "" == value || value.indexOf("-") == 0){
				return false;
			}
			return value%1 === 0
		},
		isUndefined: function(value) {
			if (typeof (value) == "undefined") {
				return true;
			}
			return false;
		},
		dealBoolean: function(value) {
			if ("true" == value) {
				return true;
			}
			if ("false" == value) {
				return false;
			}
			return value;
		},
		isEmpty: function(value) {
			if ("" == value || null == value || typeof (value) == "undefined") {
				return true;
			}
			return false;
		},
		isInt: function(value) {
			value = value + "";
		    var patrn = /^(-)?\d+$/;
		    if (patrn.exec(value) == null || value == "") {
		        return false
		    } else {
		        return true
		    }
		},
		isNum: function(value) {
			value = value + "";
		    var patrn = /^(-)?\d+(\.\d+)?$/;
		    if (patrn.exec(value) == null || value == "") {
		        return false
		    } else {
		        return true
		    }
		},
		isNum2: function(value,distNum,decimalNum) {
			value = value + "";
			if(decimalNum > 0 && value.indexOf(".") > -1){
				var valueArr = value.split(".");
				if(valueArr[0].length > distNum){
					//小数个数超过decimalNum
			        return false
				}
				if(valueArr[1].length > decimalNum){
					//小数个数超过decimalNum
			        return false
				}
			}else{
				//这里的减1是要去掉小数位，前面可以刚好满足，这个时候就多了小数位    by lsr
				if(value.length  > distNum){
			        return false
				}
			}
			
//			if(value.length - 1 > distNum){
//		        return false
//			}
			
//		    var patrn = /^(-)?\d+(\.\d+)?$/;
			var patrn = /^(-)?\d+(\.\d+)?$/;
			if(decimalNum==0){
				patrn = /^(-)?\d+$/;
			}
		    if (patrn.exec(value) == null || value == "") {
		        return false
		    } else {
		        return true
		    }
		},
		getNumByStr: function(value){
			 var re1=/(-)?[0-9]\.?[0-9]*/g;
			 return value.match(re1);
		},
		getPoint: function(value){//by 蒋寅 获取整数位后的字符
			if(value)
				return value.toString().split('.').length>1?"."+value.toString().split('.')[1]:'';
			else
				return "";
		},
		getPointNum: function(value){//by 蒋寅 仅仅获取整数位后的数字
			if(value)
				return value.toString().split('.').length>1?value.toString().split('.')[1]:'';
			else
				return "";
		},
		getK3Int: function(value){//by 蒋寅 只需要返回整数
			//返回千分位数字字符
			if(typeof(value) == 'undefined' || value == null){
				return '';
			}
			value += '';//可能传进来的是数字类型，这全部转为字符串类型，否则下面indexOf报错
			var prePart = "";//整数部分
			var sufPart = "";//小数部分
			if(value.indexOf('.') > -1){
				//如果有小数，截取整数部分
				prePart = value.substring(0,value.indexOf('.'));
				sufPart = value.substring(value.indexOf('.')+1);
			}else{
				prePart = value;
			}
			prePart = prePart.replace(/\d+?(?=(?:\d{3})+$)/g, function(s){
				return s +',';
	        });
			if(prePart == ''){
				prePart = '0';//整数部分是空字符的情况，赋为0
			}
			if(prePart == '-'){
				prePart = '-0';//整数部分是空字符的情况，赋为0
			}
			if(sufPart.length > 0){
				//有小数的情况
				value = prePart+'.'+sufPart;
				if(sufPart.length == 1){
					//小数位=1时，补上0凑成两位小数
					value += '0';
				}
			}else{
				if(prePart.length > 1){
					//没有小数的补上两位小数
					value = prePart+'.00';
				}else{
					value = prePart;
				}
			}
			if('' != value && '-' != value && value.indexOf('.') == -1){
				//没有小数的补上
				value += '.00';
			}
			return value.toString().split(".")[0];
		},
		getThousandNum: function(value){
			//返回千分位数字字符
			if(typeof(value) == 'undefined' || value == null){
				return '';
			}
			if(value == ''){
				return '0';
			}
			value += '';//可能传进来的是数字类型，这全部转为字符串类型，否则下面indexOf报错
			var prePart = "";//整数部分
			var sufPart = "";//小数部分
			if(value.indexOf('.') > -1){
				//如果有小数，截取整数部分
				prePart = value.substring(0,value.indexOf('.'));
				sufPart = value.substring(value.indexOf('.')+1);
			}else{
				prePart = value;
			}
			prePart = prePart.replace(/\d+?(?=(?:\d{3})+$)/g, function(s){
				return s +',';
	        });
			if(sufPart.length > 0){
				//有小数的情况
				value = prePart+'.'+sufPart;
				if(sufPart.length == 1){
					//小数位=1时，补上0凑成两位小数
					value += '0';
				}
			}else{
				if(prePart.length > 1){
					//没有小数的补上两位小数
					value = prePart+'.00';
				}else{
					value = prePart;
				}
			}
			if('' != value && '-' != value && value.indexOf('.') == -1){
				//没有小数的补上
				value += '.00';
			}
			if('' != value && '-' != value && value.indexOf('.') == 0){
				//没有小数的补上
				value = '0'+value;
			}
			if('' != value && '-' != value && value.indexOf('-.') == 0){
				//没有小数的补上
				value = '-0'+value.substring(1);
			}
			return value;
		},
		getThousandNumOnly1Point: function(value){
			//返回千分位数字字符
			if(typeof(value) == 'undefined' || value == null){
				return '';
			}
			if(value == ''){
				return '0';
			}
			value += '';//可能传进来的是数字类型，这全部转为字符串类型，否则下面indexOf报错
			var prePart = "";//整数部分
			var sufPart = "";//小数部分
			if(value.indexOf('.') > -1){
				//如果有小数，截取整数部分
				prePart = value.substring(0,value.indexOf('.'));
				sufPart = value.substring(value.indexOf('.')+1);
			}else{
				prePart = value;
			}
			prePart = prePart.replace(/\d+?(?=(?:\d{3})+$)/g, function(s){
				return s +',';
	        });
			if(sufPart.length > 0){
				//有小数的情况
				value = prePart+'.'+sufPart;
				if(sufPart.length == 1){
					//小数位=1时，补上0凑成两位小数
					value += '0';
				}
			}else{
				if(prePart.length > 1){
					//没有小数的补上两位小数
					value = prePart+'.00';
				}else{
					value = prePart;
				}
			}
			if('' != value && '-' != value && value.indexOf('.') == -1){
				//没有小数的补上
				value += '.00';
			}
			if('' != value && '-' != value && value.indexOf('.') == 0){
				//没有小数的补上
				value = '0'+value;
			}
			if('' != value && '-' != value && value.indexOf('-.') == 0){
				//没有小数的补上
				value = '-0'+value.substring(1);
			}
			return value.substring(0,value.length-1);
		},
		getThousandNumK: function(value,num){
			//返回千分位数字字符
			if(typeof(value) == 'undefined' || value == null){
				return '';
			}
			value += '';//可能传进来的是数字类型，这全部转为字符串类型，否则下面indexOf报错
			var prePart = "";//整数部分
			var sufPart = "";//小数部分
			if(value.indexOf('.') > -1){
				//如果有小数，截取整数部分
				prePart = value.substring(0,value.indexOf('.'));
				sufPart = value.substring(value.indexOf('.')+1);
			}else{
				prePart = value;
			}
			prePart = prePart.replace(/\d+?(?=(?:\d{3})+$)/g, function(s){
				return s +',';
	        });
			if(sufPart.length > 0){
				//有小数的情况
				value = prePart+'.'+sufPart;
				//小数位数不够的情况,补上0凑成num为小数
				if(sufPart.length < num){
					for(var i = (sufPart.length+1); i <= num; i++){
						value += '0';
					}
				}
			}else{
				if(prePart.length > 1){
					//没有小数的补上两位小数
					value = prePart+'.';
					//小数位数不够的情况,补上0凑成num为小数
					for(var i = 1; i <= num; i++){
						value += '0';
					}
				}else{
					value = prePart;
				}
			}
			if('' != value && '-' != value && value.indexOf('.') == -1){
				//没有小数的补上
				value += '.';
				//小数位数不够的情况,补上0凑成num为小数
				for(var i = 1; i <= num; i++){
					value += '0';
				}
			}
			return value;
		},
		removeThousandNum: function(value){
			//去除千分位
			return value.replace(/,/g,'');
		},
		getThousandNum6:function(value){
			if(typeof(value) == 'undefined' || value == null){
				return '';
			}
			if(value == ''){
				return '0';
			}
			if( (value + '').indexOf('.') > 0){
				value += '';
				var prePart = value.substring(0,value.indexOf('.'));
				var sufPart = value.substring(value.indexOf('.')+1);
				if(sufPart.length > 7)
					 sufPart = sufPart.substr(0, 6);
				return commonUtil.getThousandNumK(prePart, 0) + sufPart;
			}else{
				return commonUtil.getThousandNumK(value, 0).replace('.','');
			}
		},
		getByteLengthTwo: function(value){
			//计算字节长度(中文字符算2个字节)
			return value.replace(/[^\x00-\xff]/g, "**").length;
		},
		getByteLengthThree: function(value){
			//计算字节长度(中文字符算3个字节)
			return value.replace(/[^\x00-\xff]/g, "***").length;
		},
		getPreSpaceCount: function(value){
			if('undefined' == typeof(value) || value == null){
				return 0;
			}
			var count = 0;
			//计算字符串前缀空格个数
			for(var i = 0; i < value.length; i++){
				if(' ' ==value[i]){
					count++;
				}else{
					break;
				}
			}
			return count;
		},
		clearForm: function(formId){
			$('#'+formId+' .form-control').each(function(){
				$(this).text('');
				$(this).val('');
			});
		},
		getPreMonth: function(date){
			//获取上一个月
           var arr = date.split('-');
           var year = arr[0]; //获取当前日期的年份
           var month = arr[1]; //获取当前日期的月份
           var day = arr[2]; //获取当前日期的日
           var days = new Date(year, month, 0);
           days = days.getDate(); //获取当前日期中月的天数
           var year2 = year;
           var month2 = parseInt(month) - 1;
           if (month2 == 0) {
               year2 = parseInt(year2) - 1;
               month2 = 12;
           }
//           var day2 = day;
//           var days2 = new Date(year2, month2, 0);
//           days2 = days2.getDate();
//           if (day2 > days2) {
//               day2 = days2;
//           }
           if (month2 < 10) {
               month2 = '0' + month2;
           }
           var t2 = year2 + '-' + month2 ;
           return t2;
        },      
		getNextMonth: function(date){
		 //获取下一个月
           var arr = date.split('-');
           var year = arr[0]; //获取当前日期的年份
           var month = arr[1]; //获取当前日期的月份
           var day = arr[2]; //获取当前日期的日
           var days = new Date(year, month, 0);
           days = days.getDate(); //获取当前日期中的月的天数
           var year2 = year;
           var month2 = parseInt(month) + 1;
           if (month2 == 13) {
               year2 = parseInt(year2) + 1;
               month2 = 1;
           }
//           var day2 = day;
//           var days2 = new Date(year2, month2, 0);
//           days2 = days2.getDate();
//           if (day2 > days2) {
//               day2 = days2;
//           }
           if (month2 < 10) {
               month2 = '0' + month2;
           }
       
           var t2 = year2 + '-' + month2;
           return t2;
       },
       getFormatDateStr: function(dateStr){
	       //yyyyMMdd转成yyyy-MM-dd格式
	       var reslut = '';
	       reslut += dateStr.substr(0,4);
	       reslut += '-'+dateStr.substr(5,2);
	       reslut += '-'+dateStr.substr(7,2);
	       return result;
       }
}
var bootsrapTableUtil = {
		reloadHeadWidth:function(tableSelector, domSelector, filed){
			$(tableSelector+' tr th[tabindex="0"]').each(function (i){
				if(filed == $(this).data('field')){
					//数据列宽
					var widthValBody = parseInt($(this).find('.fht-cell').css('width').replace("px",""));
					//把表头列宽同步改为为何数据列宽一样
					$(domSelector+' > div.bootstrap-table > div.fixed-table-container th[data-field="'+filed+'"] .fht-cell').css('width',widthValBody);
					return false; //跳出循环
				}
			})
		}
}