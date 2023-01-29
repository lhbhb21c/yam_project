/** /WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/inspinia.js 호출에 대응 */
function lfn_reSizeIframePage () {
	MDI.resizeTabPage();
}

/**
 * Main 페이지 로딩
 */
$(document).ready(function() {

	// 메뉴생성/공통코드 생성/relogin

    try {
		var querySet = 
    		[
    		 {queryId: "we.std.main.MDI_MAIN.selMenuList",		queryType:"selList",	dataName:"MENU",	param:{}},
    		 {queryId: "we.std.main.MDI_MAIN.selCmmnCd2List",	queryType:"selList",	dataName:"CD2",		param:{}},
    		 {queryId: "we.std.main.MDI_MAIN.selCmmnCd3List",	queryType:"selList",	dataName:"CD3",		param:{}},
			]

    	MDI.load(querySet).then(data => data.success).then((data) => {
        	//메뉴작성
        	MDI.drawMenu($("#side-menu"), data.MENU);
        	//이벤트 바인드
        	MDI.bind();
    		//공통코드 sessionStorage에 저장
        	MDI.storeCmmnCd(data.CD2, data.CD3);
    		//대시보드열기
        	MDI.openDashboard(); 
    	});

        //Tab간 데이터 변경 listener 선언
        XUTL.listenTopMessage("CHANGE_PWO");	//생산지시 관련 변경,	{PWO_NO:"", CMD:""}
        XUTL.listenTopMessage("CHANGE_PWP");	//생산실적 관련 변경,	{PWP_NO:"", CMD:""}
        XUTL.listenTopMessage("CHANGE_WHIN");	//입고관련 변경,		{WHIN_NO:"", CMD:""}
        XUTL.listenTopMessage("CHANGE_WHOUT");	//출고 관련 변경,	{WHOUT_NO:"", CMD:""}
        XUTL.listenTopMessage("CHANGE_SIO");	//재고 관련 변경,	{ITM_CD:"", CMD:""}

    } catch (e) {
        alert(e);
    }

});
