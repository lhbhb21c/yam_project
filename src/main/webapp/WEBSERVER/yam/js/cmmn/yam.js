//얌테이블MES 공통 utilities
_YAM = _yamUtils({});


/**
 * 얌테이블MES 관련 utilities
 * 
 * @param settings
 * @author	:	rum
 * @since	:	2021.09.06
 */
function _yamUtils  (settings) {
	///////////////////////////////////////////////////////
	// initialize
	///////////////////////////////////////////////////////
	var _init = function (settings) {
	}//end-_init
	
	//버전(팝업등의 수정시  캐시문제 처리)
	var _version = "1000";
	
	
	///////////////////////////////////////////////////////
	// public methods
	///////////////////////////////////////////////////////
	var _methods = {
		//-----------------------------------------------------
		// 코드명을 코드:코드명 형식으로 변환화여 반환
		//-----------------------------------------------------
		convertCdAndNmLabel	: function (list) {
			ret = [];
			$.each(list, function (idx, data) {
				ret.push({
					CODE_CD: data.CODE_CD,
					CODE_NM: data.CODE_CD + ":" + data.CODE_NM
				});
			});
			return ret
		},//convertCdAndNmLabel
		//-----------------------------------------------------
		// 단가계산: 금액/수량 (소수4자리)
		//-----------------------------------------------------
		calcPrc	: function (qty, am) {
			qty = XUTL.toNum(qty);
			am	= XUTL.toNum(am);
			return qty === 0 ? 0 : XUTL.round(am/qty, 2);
		},//calcPrc
		//-----------------------------------------------------
		// 시간코드 데이터
		//-----------------------------------------------------
		getHrCd	: function () {
			var list = [];
			for (var i=0; i<24; i++) {
				list.push({CODE_CD:(i<10?"0":"")+i, CODE_NM:i+""});
			}
			return list;
		},//getHrCd
		//-----------------------------------------------------
		// 분코드 데이터
		//-----------------------------------------------------
		getMtCd	: function () {
			var list = [];
			for (var i=0; i<60; i++) {
				list.push({CODE_CD:(i<10?"0":"")+i, CODE_NM:i+""});
			}
			return list;
		},//getMtCd
		//-----------------------------------------------------
		// 단위에 따른 수량 포맷 설정(KG/L:3, EA/BOX:0, 미설정:3)
		//		_YAM.addQtyFilter(app);
		//		cellFilter:'unqty:row.entity.WHIN_UN'
		//-----------------------------------------------------
		addQtyFilter		: function (app) {
			var _addDefinedFilter = function (app, name, fn) {
				app.filter(name, function () {
					return function () {
						return fn.apply(null, arguments);
					};
				});
			}//_addDefinedFilter

			_addDefinedFilter(app, "unqty", function (val, un) {
	    		if (!un) {
	    			return val;
	    		}
	    		if (!val && val !== 0) {
	    			return "";
	    		}
				var digit = 0;           
	    		if (!un || un === "KG" || un === "L") {
	    			digit = 3;
	    		}
	    		return XUTL.toNum(val).toLocaleString( undefined, {minimumFractionDigits: digit});
			});
		},//addQtyFilter
		/// 팝업 ////////////////////////////////////////////////
		//-----------------------------------------------------
		// 사용자선택 팝업
		//	-options
		//		multiple: true/false(default),	다중선택 여부
		//		noclose:true/false(default),	선택시 화면닫지않기
		//		FIX_USER_GUBUN: 해당 사용자 구분만 조회, 콤머로 연결된 코드 혹은 배열
		//-----------------------------------------------------
		popupUSER	: function (options, callback) {
			var opts = $.extend({multiple:false, noclose:false}, options);
			return XPOP.popup(
				{
					url:"/forward/yam/cmmn/popup/USER_POP.do?ver=" + _version, 
					name:"USER_POP", 
					specs:"width=800, height=600, left=100, top=100"
				}, 
				opts,
				callback
			);
		},//popupUSER
		//-----------------------------------------------------
		// 파트너선택 팝업
		//	-options
		//		multiple: true/false(default),	다중선택 여부
		//		noclose:true/false(default),	선택시 화면닫지않기
		//		FIX_PARTNR_GB: 해당 파트너구분만 조회, 콤머로 연결된 코드 혹은 배열
		//-----------------------------------------------------
		popupPARTNR	: function (options, callback) {
			return BS_UTL.popPartnrSel(options, callback);
//			var opts = $.extend({multiple:false, noclose:false}, options);
//			return XPOP.popup(
//				{
//					url:"/forward/yam/cmmn/popup/PARTNR_POP.do?ver=" + _version, 
//					name:"PARTNR_POP", 
//					specs:"width=800, height=600, left=100, top=100"
//				}, 
//				opts,
//				callback
//			);
		},//popupPARTNR
		//-----------------------------------------------------
		// 품목선택 팝업
		//	-options
		//		multiple: true/false(default),	다중선택 여부
		//		noclose:true/false(default),	선택시 화면닫지않기
		//		FIX_ITM_GB: 해당품목구분만 조회, 콤머로 연결된 코드 혹은 배열
		//-----------------------------------------------------
		popupItm	: function (options, callback) {
			var opts = $.extend({multiple:false, noclose:false}, options);
			return XPOP.popup(
				{
					url:"/forward/yam/cmmn/popup/ITM_POP.do?ver=" + _version, 
					name:"ITM_POP", 
					specs:"width=800, height=600, left=100, top=100"
				}, 
				opts,
				callback
			);
		},//popupItm
		//-----------------------------------------------------
		// 재고선택 팝업
		//	-options
		//		multiple: true/false(default),	다중선택 여부
		//		noclose:true/false(default),	선택시 화면닫지않기
		//		FIX_SIO_YYYY:재고수불년도(필수)
		//		FIX_SIO_MM:재고수불월(필수)
		//		FIX_WH_CD:창고코드(필수)
		//		FIX_ITM_GB: 해당품목구분만 조회, 콤머로 연결된 코드 혹은 배열
		//-----------------------------------------------------
		popupSioItm	: function (options, callback) {
			var opts = $.extend({multiple:false, noclose:false}, options);
			return XPOP.popup(
				{
					url:"/forward/yam/cmmn/popup/SIO_ITM_POP.do?ver=" + _version, 
					name:"SIO_ITM_POP", 
					specs:"width=1000, height=600, left=0, top=0"
				}, 
				opts,
				callback
			);
		},//popupSioItm
		//-----------------------------------------------------
		// 작업지시선택 팝업
		//	-options
		//		multiple: true/false(default),	다중선택 여부
		//		noclose:true/false(default),	선택시 화면닫지않기
		//		FIX_PWO_ST: 작업지시만 조회, 콤머로 연결된 코드 혹은 배열
		//		FIX_ITM_GB: 해당자재구분만 조회, 콤머로 연결된 코드 혹은 배열
		//-----------------------------------------------------
		popupPwo	: function (options, callback) {
			var opts = $.extend({multiple:false, noclose:false}, options);
			return XPOP.popup(
				{
					url:"/forward/yam/cmmn/popup/PWO_POP.do?ver=" + _version, 
					name:"PWO_POP", 
					specs:"width=800, height=600, left=100, top=100"
				}, 
				opts,
				callback
			);
		},//popupPwo
		//-----------------------------------------------------
		// 입출고 조회 팝업
		//	-options
		//
		// 재고수불원장, 재고마감
		//-----------------------------------------------------
		popupWhio	: function (options) {
			options.listenerNone = true;
			return XPOP.popup(
				{
					url:"/forward/yam/cmmn/popup/WHIO_POP.do?ver=" + _version,
					name:"WHIO_POP",
					specs:"width=1200, height=900, left=0, top=0"
				},
				options
			);
		},//popupWhio
		//-----------------------------------------------------
		// 공지내용 팝업
		//	-options
		//		WFW_BBS_SEQ: 게시번호
		//-----------------------------------------------------
		popupBbs	: function (options) {
			var opts = $.extend({}, options);
			opts.listenerNone = true;
			return XPOP.popup(
				{
					url:"/forward/we_std/popup/BBS_NOTI_POP.do?ver=" + _version, 
					name:"BBS_POP", 
					specs:"width=650, height=750, left=500, top=100"
				}, 
				opts
			);
		},//popupBbs
		// 팝업-end ////////////////////////////////////////////
		
		
		//-----------------------------------------------------
		// 유형별 상태 color map
		//-----------------------------------------------------
		getColorMap	: function (name) {
			var map = {};
			if (name === "PWO_ST") {
				map =
					{
						"10" : "white",		//임시저장
						"30" : "yellow",	//생산지시
						"39" : "red",		//생산지시취소
						"40" : "green"		//생산완료
					};

			}
			
			return map;

		},//getColorMap


		// //-----------------------------------------------------
		// // 생산지시서(다중지시서) PDF download
		// //		_YAM.reportPwo(entities);
		// //-----------------------------------------------------
		// reportPwg		: function (entities) {
		// 	var param = {
		// 		name		: entities[0].PWO_NO + ".pdf",
		// 		additions	: []
		// 	}
		//
		// 	for (var i=0; i<entities.length; i++) {
		// 		var queryParam = {PWO_NO:entities[i].PWO_NO}
		// 		var config1 = {
		// 				template: "/WEB-INF/template/jasper/pwo_1.jasper",
		// 				querySet	:
		// 					[
		// 	    			 {queryId: "yam.cmmn.report.PWO_RPT.selMstInfo",	queryType:"selOne",		dataType:"parameter",	dataName:"",		param:queryParam},
		// 	    			 {queryId: "yam.cmmn.report.PWO_RPT.selSubList",	queryType:"selList",	dataType:"dataset",		dataName:"dataset",	param:queryParam}
		// 					],
		// 				style		: {fontName:"나눔고딕"}
		// 			}
		//
		// 		var config2 = {
		// 				template: "/WEB-INF/template/jasper/pwo_2.jasper",
		// 				querySet	:
		// 					[
		// 	    			 {queryId: "yam.cmmn.report.PWO_RPT.selP2MstInfo",	queryType:"selOne",		dataType:"parameter",	dataName:"",				param:queryParam},
		// 	    			 {queryId: "yam.cmmn.report.PWO_RPT.selP2SubList",	queryType:"selList",	dataType:"dataset",		dataName:"dataset",			param:queryParam},
		// 	    			 {queryId: "yam.cmmn.report.PWO_RPT.selP2Sub2List",	queryType:"selList",	dataType:"parameter",	dataName:"SUBREPORT_DATA",	param:queryParam}
		// 					],
		// 				SUBREPORT_MAP: {SUBREPORT_PATH:"/WEB-INF/template/jasper/pwo_2_sub.jasper"},
		// 				style		: {fontName:"나눔고딕"}
		// 			}
		//
		// 		if (i === 0) {
		// 			$.extend(param, config1);
		// 			param.additions.push(config2);
		// 		} else {
		// 			param.additions.push(config1);
		// 			param.additions.push(config2);
		// 		}
		// 	}
		// 	XUTL.download("/std/cmmn/rpt/downloadPdf.do", {json:param});
		// },//reportPwg
		//-----------------------------------------------------
		// 작업지시서(다중지시서) PDF download
		//		_YAM.reportPwo(entities);
		//-----------------------------------------------------
		reportPwo		: function (entities) {
			var param = {
				name		: "작업지시서-" + entities[0].PWO_NO + ".pdf",
				additions	: []
			}
			
			for (var i=0; i<entities.length; i++) {
				var queryParam = {PWO_ID:entities[i].PWO_ID}
				var config1 = {
						template: "/WEB-INF/template/jasper/pwo_1.jasper",
						querySet	:
							[
			    			 {queryId: "yam.cmmn.report.PWO_RPT.selMstInfo",	queryType:"selOne",		dataType:"parameter",	dataName:"mst",		param:queryParam},
			    			 {queryId: "yam.cmmn.report.PWO_RPT.selSubList",	queryType:"selList",	dataType:"dataset",		dataName:"list",	param:queryParam}
							],
						style		: {fontName:"나눔고딕"}
					}

				if (i === 0) {
					$.extend(param, config1);
				} else {
					param.additions.push(config1);
				}
			}
			XFILE.download("/std/cmmn/rpt/downloadPdf.do", {json:param});
		},//reportPwo
		//-----------------------------------------------------
		// 메뉴텝 화면 열기
		//	-name:
		//		WHIN_REG:입고등록	-> param = {WHIN_NO:"입고번호"}
		//	-param: {}
		//	-opts: {}
		//-----------------------------------------------------
		openMdiTab	: function (name, param, opts) {
			param	= param||{};
			opts	= opts||{};
			
			var pid, pnm, url;
			if (name === "WHIN_REG") {	//입고등록
				pid	= "/yam/wm/WHIN_REG";
				pnm	= "입고등록";
				url	= "/forward/yam/wm/WHIN_REG.do?WHIN_ID=" + (param.WHIN_ID||"");
				
			} else if (name === "WHOUT_REG") {	//출고등록
				pid	= "/yam/wm/WHOUT_REG";
				pnm	= "출고등록";
				url	= "/forward/yam/wm/WHOUT_REG.do?WHOUT_ID=" + (param.WHOUT_ID||"");
				
			} else if (name === "PWO_REG") {	//작업지시등록
				pid	= "/yam/pc/PWO_REG";
				pnm	= "작업지시등록";
				url	= "/forward/yam/pc/PWO_REG.do?PWO_ID=" + (param.PWO_ID||"");
				if (param.TR_AGGR_DY && param.TR_AGGR_TM) {	//주문집계
					url += "&TR_AGGR_DY="	+ encodeURIComponent(param.TR_AGGR_DY);
					url += "&TR_AGGR_TM="	+ encodeURIComponent(param.TR_AGGR_TM);
					url += "&TR_AGGR_SN="	+ encodeURIComponent(param.TR_AGGR_SN);
					url += "&PWO_ITM_CD="	+ encodeURIComponent(param.PWO_ITM_CD);
					url += "&PWO_QTY="		+ encodeURIComponent(param.PWO_QTY);
					url += "&PWO_NO="		+ encodeURIComponent(param.PWO_NO);
				}

			} else if (name === "PWP_REG") {	//작업실적등록
				pid	= "/yam/pc/PWP_REG";
				pnm	= "작업실적등록";
				url = "/forward/yam/pc/PWP_REG.do?PWP_ID=" + (param.PWP_ID||"") + "&PWO_ID=" + (param.PWO_ID||"");

            } else if (name === "PO_MNG") {	//구매발주등록
                pid	= "/yam/pm/PO_MNG";
                pnm	= "구매발주등록";
                url = "/forward/yam/pm/PO_MNG.do?PO_ID=" + (param.PO_ID||"") ;

            } else if (name === "DO_MNG") {	//출하지시등록
                pid	= "/yam/sm/DO_MNG";
                pnm	= "출하지시등록";
                url = "/forward/yam/sm/DO_MNG.do?DO_ID=" + (param.DO_ID||"") ;

			} else if (name === "WSFR_REG") {	// 창고이동등록
				pid	= "/yam/wm/WSFR_REG";
				pnm	= "창고이동등록";
				url = "/forward/yam/wm/WSFR_REG.do?WSFR_ID=" + (param.WSFR_ID||"")

			} else {
				alert("unknown open name:"+name);
				return;
			}

			$.each(opts, function (key, val) {
				url += "&" + key + "=" + (val||"");
			});
	        top.MDI.openTab (pid, pnm, url, true);
		},//openMdiTab

	};//end-_methods
	
	_init(settings);
	return _methods;
}//end-__yamUtils
