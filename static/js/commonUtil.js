var colors=["#E94F25","#00B0EC","#FDD100","#4b5066","#baafa5","#FF69B4","#BA55D3","#f14412","#cd5cc5","#32cd32","#d7b28c"];		

var commonUtil = {
		getCurTimeLong:function(){
			return new Date().getTime();
		},
		getCurTimeLong2:function(beginIndex){
			var timeLong = new Date().getTime().toString();
			return timeLong.substring(beginIndex);
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
            if(hh < 10){
            	hh = "0"+hh;
            }
            if(mm < 10){
            	mm = "0"+mm;
            }
            return year+"-"+month+"-"+day+" "+hh+":"+mm;
		},
		getFormatDate3:function(d){
			if('undefined' == typeof(d) || null == d || '' == d){
				return '';
			}
			var date = new Date(d);
			var year = date.getFullYear();
			var month = (""+(date.getMonth()+1)).length<2?"0"+(date.getMonth()+1):(date.getMonth()+1);
            var day = (""+(date.getDate())).length<2?"0"+(date.getDate()):(date.getDate());;
            var hh = date.getHours(); //获取当前小时数(0-23)
            var mm = date.getMinutes(); //获取当前分钟数(0-59)
            var ss = date.getSeconds(); //获取当前分钟数(0-59)
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
		getDateByNum:function(num){
			var date = new Date(); 
			date.setDate(date.getDate()+num);//获取num天后的日期 (num为正数是后num天，为负数是前num天)
			var year = date.getFullYear();
			var month= (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期，不足10补0
			var day = date.getDate()<10?"0"+date.getDate():date.getDate(); //获取当前几号，不足10补0
			return year+"-"+month+"-"+day;
		},
		getDateByNum2:function(num){
			var date = new Date(); 
			date.setDate(date.getDate()+num);//获取num天后的日期 (num为正数是后num天，为负数是前num天)
			var year = date.getFullYear();
			var month= (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期，不足10补0
			var day = date.getDate()<10?"0"+date.getDate():date.getDate(); //获取当前几号，不足10补0
			var hh = date.getHours(); //获取当前小时数(0-23)
            var mm = date.getMinutes(); //获取当前分钟数(0-59)
            if(hh < 10){
            	hh = "0"+hh;
            }
            if(mm < 10){
            	mm = "0"+mm;
            }
			return year+"-"+month+"-"+day+" "+hh+":"+mm;
		},
		getDateByNum3:function(num){
			var date = new Date(); 
			date.setDate(date.getDate()+num);//获取num天后的日期 (num为正数是后num天，为负数是前num天)
			var year = date.getFullYear();
			var month= (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期，不足10补0
			var day = date.getDate()<10?"0"+date.getDate():date.getDate(); //获取当前几号，不足10补0
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
		 getPreMonth: function(date) {
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
//            var day2 = day;
//            var days2 = new Date(year2, month2, 0);
//            days2 = days2.getDate();
//            if (day2 > days2) {
//                day2 = days2;
//            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 ;
            return t2;
         },      
		 getNextMonth: function(date) {
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
//            var day2 = day;
//            var days2 = new Date(year2, month2, 0);
//            days2 = days2.getDate();
//            if (day2 > days2) {
//                day2 = days2;
//            }
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
			}
			if(value.length > distNum){
		        return false
			}
		    var patrn = /^(-)?\d+(\.\d+)?$/;
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
		getThousandNum: function(value){
			//返回千分位数字字符
			if(typeof(value) == 'undefined' || value == null){
				return '';
			}
			value = value + '';
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
			return value;
		},
		removeThousandNum: function(value){
			//去除千分位
			return value.replace(/,/g,'');
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
		pushFormVal: function(obj, selector, type, attrNm){
			//遍历对象，往指定选择器里以对象的属性名为name来赋值
			for(var p in obj){
			    if('val' == type){
					$(selector+' [name="'+p+'"]').val(obj[p]);
				}
			    else if('text' == type){
					$(selector+' [name="'+p+'"]').text(obj[p]);
				}
			    else if('html' == type){
					$(selector+' [name="'+p+'"]').html(obj[p]);
				}
			    if(attrNm != null && attrNm != ''){
			    	$(selector+' [name="'+p+'"]').attr(attrNm, obj[p]);
			    }
			}
		},
		getTabIdByIndexOf: function(str){
			var tabId = '';
			$('#leftMenus li', window.parent.parent.document).not('has-sub').each(function(){
				if($(this).html().indexOf(str) > -1){
					tabId = $(this).attr('id');
					return tabId;
				}
			});
			return tabId;
		},
		getTabNmByIndexOf: function(str){
			var tabNm = '';
			$('#leftMenus li', window.parent.parent.document).not('has-sub').each(function(){
				if($(this).html().indexOf(str) > -1){
					tabNm = $(this).find('span.title').text();
					return tabNm;
				}
			});
			return tabNm;
		},
		activeTabByIndexOf: function(str){
			$('#leftMenus li', window.parent.parent.document).not('has-sub').each(function(){
				if($(this).html().indexOf(str) > -1){
					$(this).addClass('active');
					$(this).parent().parent().addClass('open');
					return;
				}
			});
		},
		arrToSplit: function(arr,splitStr){
			var rs = '';
			for(var i = 0; i < arr.length; i++){
				if(rs != '' && arr[i] != ''){
					rs += splitStr;
				}
				rs += arr[i];
			}
			return rs;
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

 function compareDate(d1,d2) { 
       var arrayD1 = d1.split("-"); 
       var date1 = new Date(arrayD1[0],arrayD1[1],arrayD1[2]); 
       var arrayD2 = d2.split("-"); 
       var date2 = new Date(arrayD2[0],arrayD2[1],arrayD2[2]); 
       if(date1 > date2) return false;             
       return true; 
} 