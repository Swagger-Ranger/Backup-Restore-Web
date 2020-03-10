//返回传递给他的任意对象的类
function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}

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