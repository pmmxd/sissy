var _arc = _arc || [];
var userAgent = navigator.userAgent.toLowerCase();

var PvUtils = {
   checkVersion : function(keyWord,exp,version){
		if(!keyWord || !exp || !version){
			return false;
    	}
    	if(PvUtils.getVersion(keyWord,exp) >= version){
    		return true;
    	}else{
    		return false;
    	}

    },

   getVersion : function(keyWord,exp){
		var ua = navigator.userAgent.toLowerCase();
    	if(ua.indexOf(keyWord) >= 0){
    		ua = ua.split(keyWord);
    		ua = ua[1];
    		try {
    			var version = ua.match(new RegExp(exp));
    			if (version) {
    				return version;
    			}		
    		} catch (e) {
    		}
    	}
    	return "";
	},

	getQueryString : function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return r[2];
        }else {
            return "";
        }
    },
	
	setDefualValue : function(str){
		if(!str){
			str = "";
		}
		return str;
	},
	
	pageUrlList : ['/index.html','/mobile/touch/index.jhtml','/mobile/search.jhtml?searchType=category','/mobile/search.jhtml','/mobile/mobileProduct/','/channels/mobile/operation','/mobile/promotion/promotion.jhtml','/mobile/promotion/newSeckillPromotionH5.jhtml','/mobile/touch/eMsgList.jhtml'],
	
	pageUrlObj : {
	        "/index.html" : "002",
	        "/mobile/touch/index.jhtml" : "002",
	        "/mobile/search.jhtml" : "004",
	        "/mobile/search.jhtml?searchType=category" : "006",
	        "/mobile/mobileProduct/" : "008",
	        "/channels/mobile/operation" : "010",
	        "/oaasChannels/mobile/operation" : "010",
	        "/mobile/promotion/promotion.jhtml" : "012",
	    	"/mobile/promotion/newSeckillPromotionH5.jhtml" : "013",
			"/mobile/touch/eMsgList.jhtml" : "014"
	    }
};

jQuery.getScriptForIcbc = function(url, callback, cache) {
jQuery.ajax({type: 'GET', url: url, success: callback, dataType: 'script', ifModified: true, cache: cache});
};

function ajaxPv() {
	var pvURL="https://pv.mall.icbc.com.cn/js/tongji.js";
	jQuery.getScriptForIcbc(pvURL,function(){
    	jQuery.ajax({
			type : "GET",
			url :"https://m.mall.icbc.com.cn/utils/pvInfoNew.jhtml",
			data : "",
			dataType:"jsonp",
			jsonp:"callback",
			success : function(json) {
    			try{
    				pushArc(json);
    				if(userAgent.indexOf("f-wapb")>-1 && PvUtils.checkVersion("newversion",'\\d+\.\\d+\.\\d+\.\\d+\.\\d+',"5.0.1.1.0")){
     				   getPvClientInfo();
     				}else if((userAgent.indexOf("icbcandroid") > -1 || userAgent.indexOf("icbciphone") > -1) && userAgent.indexOf("newemallversion") > -1 && PvUtils.checkVersion("mobileversion",'\\d+\.\\d+\.\\d+\.\\d+\.\\d+',"2.0.1.1.0")){
 					   getPvClientInfo();
 					}else{
     				   getPvClientInfoCallBack();
     				}
				}catch(e){}
			}
    	});
	},true);
}

function getPvClientInfo(){
	try {
		ICBCUtilTools4Partner.callNative("Native","getPvClientInfo",{"callBackFunctionName":"getPvClientInfoCallBack"});
	} catch (e) {
		getPvClientInfoCallBack();
	}
}

var ICBCUtilTools4Partner = {
	callNative : function(className, methordName, data, callback) {
			try {
				if (ICBCUtilTools4Partner.isAndroid()) {
					var result = prompt(className+'.'+methordName,JSON.stringify(data));
					callback(result);
				}else if (ICBCUtilTools4Partner.isiPhone()) {
					ICBCBridge.callHandler(className+'.'+methordName, data, callback);
				}
			} catch (e) {	
				getPvClientInfoCallBack();
			}
		},
	sUserAgent : navigator.userAgent.toLowerCase(),
	isiPhone : function() {
			if((this.sUserAgent.match(/iphone os/i) == "iphone os")||(this.sUserAgent.match(/ipad/i) == "ipad"))
				return true;
			else
				return false;
		},
	isAndroid : function() {
			return (this.sUserAgent.match(/android/i) == "android");
		}
};

(function() {
	if (ICBCUtilTools4Partner.isiPhone()){
	    function connectWebViewJavascriptBridge(callback) {
	        if (window.WebViewJavascriptBridge) {
	            callback(WebViewJavascriptBridge);
	        } else {
	            document.addEventListener('WebViewJavascriptBridgeReady', function() {
	                callback(WebViewJavascriptBridge);
	            }, false);
	        }
	    }
	    connectWebViewJavascriptBridge(function(bridge) {
	        bridge.init();
	    });
	    var ICBCBridge = {
	        callHandler: function(name, params, callback) {
	            connectWebViewJavascriptBridge(function(bridge) {
	                bridge.callHandler(name, params, callback);
	            });
	        },
	        send: function(params, callback) {
	            connectWebViewJavascriptBridge(function(bridge) {
	                bridge.send(params, callback);
	            });
	        }
	    };
	    window.ICBCBridge = ICBCBridge;
	}
})();

function getPvClientInfoCallBack(data){
	if(data){
		_arc.push(['appversioncode',PvUtils.setDefualValue(data.appversioncode)]);
        _arc.push(['appversionname',PvUtils.setDefualValue(data.appversionname)]);
        _arc.push(['appstarttime',PvUtils.setDefualValue(data.appstarttime)]);
        _arc.push(['appinstallationtime',PvUtils.setDefualValue(data.appinstallationtime)]);
        _arc.push(['sdkversioncode',PvUtils.setDefualValue(data.sdkversioncode)]);
        _arc.push(['sdkversionname',PvUtils.setDefualValue(data.sdkversionname)]);
        _arc.push(['carrier',PvUtils.setDefualValue(data.carrier)]);
        _arc.push(['mobilenetworkchannel',PvUtils.setDefualValue(data.mobilenetworkchannel)]);
        _arc.push(['mobilenetworkmode',PvUtils.setDefualValue(data.mobilenetworkmode)]);
        //_arc.push(['gps',setDefualValue(data.gps)]);
        _arc.push(['deviceid',PvUtils.setDefualValue(data.deviceid)]);
        _arc.push(['imei',PvUtils.setDefualValue(data.imei)]);
        _arc.push(['mac',PvUtils.setDefualValue(data.mac)]);
        _arc.push(['phonebrand',PvUtils.setDefualValue(data.phonebrand)]);
        _arc.push(['mobilemodel',PvUtils.setDefualValue(data.mobilemodel)]);
        _arc.push(['cpumode',PvUtils.setDefualValue(data.cpumode)]);
        _arc.push(['pixelmetric',PvUtils.setDefualValue(data.pixelmetric)]);
        _arc.push(['country_sdk',PvUtils.setDefualValue(data.country)]);
        _arc.push(['language',PvUtils.setDefualValue(data.language)]);
        _arc.push(['timezone',PvUtils.setDefualValue(data.timezone)]);
        _arc.push(['mobilesystem',PvUtils.setDefualValue(data.mobilesystem)]);
        _arc.push(['isroot',PvUtils.setDefualValue(data.isroot)]);
	}else{
		_arc.push(['appversioncode','']);
        _arc.push(['appversionname','']);
        _arc.push(['appstarttime','']);
        _arc.push(['appinstallationtime','']);
        _arc.push(['sdkversioncode','']);
        _arc.push(['sdkversionname','']);
        _arc.push(['carrier','']);
        _arc.push(['mobilenetworkchannel','']);
        _arc.push(['mobilenetworkmode','']);
        //_arc.push(['gps','']);
        _arc.push(['deviceid','']);
        _arc.push(['imei','']);
        _arc.push(['mac','']);
        _arc.push(['phonebrand','']);
        _arc.push(['mobilemodel','']);
        _arc.push(['cpumode','']);
        _arc.push(['pixelmetric','']);
        _arc.push(['country_sdk','']);
        _arc.push(['language','']);
        _arc.push(['timezone','']);
        _arc.push(['mobilesystem','']);
        _arc.push(['isroot','']);
	}
	var srcchannel = PvUtils.getQueryString("srcchannel");
	var srcpageurl = PvUtils.getQueryString("srcpageurl");
	var transitionid = PvUtils.getQueryString("transitionid");
	_arc.push(['userid','']);
    _arc.push(['maincis','']);
    _arc.push(['lastuserid','']);
    _arc.push(['curchannel','F-MALLC']);
    _arc.push(['srcchannel',srcchannel]);
    _arc.push(['srcpageurl',srcpageurl]);
    _arc.push(['transitionid',transitionid]);
    ar_main();
}

function pushArc(json) {
	var page_type = "";
    var url = window.location.pathname + window.location.search;
    
    for(var i in PvUtils.pageUrlList){
        var pageUrl = PvUtils.pageUrlList[i];
        if(url.indexOf(pageUrl) == 0){
            page_type = PvUtils.pageUrlObj[pageUrl];
            break;
        }
    }
    var ad_id = PvUtils.getQueryString("ad_id");
	_arc.push(['cust_id', json.cust_id]);
	_arc.push(['seaval', '']);
	_arc.push(['mchid', '']);
	_arc.push(['plevl1', '']);
	_arc.push(['plevl2', '']);
	_arc.push(['plevl3', '']);
	_arc.push(['chlid', '']);
	_arc.push(['prdname', '']);
	_arc.push(['prdid', '']);
	_arc.push(['prdcatid1', '']);
	_arc.push(['prdcatid2', '']);
	_arc.push(['prdcatid3', '']);
	_arc.push(['pageId', '']);
	_arc.push(['columnId', '']);
	_arc.push(['columnCatId', '']);
	_arc.push(['sessionId', json.sessionId]);
	_arc.push(['moduleId', '']);
	_arc.push(['vendorid', '']);
	_arc.push(['searchResultNumber','']);
	_arc.push(['searchCurrentPageNumber','']);
	_arc.push(['leadSourceCode', json.leadSourceCode]);
	_arc.push(['leadOrgCode', json.leadOrgCode]);
	_arc.push(['leadSaleCode', json.leadSaleCode]);
	_arc.push(['leadReferer', json.leadReferer]);
	_arc.push(['leadField1', json.leadField1]);
	_arc.push(['leadField2', json.leadField2]);
	_arc.push(['leadField3', json.leadField3]);
	_arc.push(['createOrder', '']);
	_arc.push(['orderId', '']);
	_arc.push(['buttonno','']);
    _arc.push(['buttonname','']);
    _arc.push(['buttonpara','']);
    _arc.push(['page_type',page_type]);
    _arc.push(['ad_id',ad_id]);
    _arc.push(['pvtype','0']);
}