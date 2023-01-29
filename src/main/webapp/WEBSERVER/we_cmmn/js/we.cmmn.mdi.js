/**
 * MdiUtil class(메인화면 MDI 관련)
 *	ex) 
	MDI = new MdiUtil({name:"MDI", URL_DASHBOARD:"forward/yam/cmmn/main/Dashboard.do", URL_VALIDATION:"/std/cmmn/validSession.do", debug:true});   	
	var querySet = 
		[
		 {queryId: "we.std.main.MDI_MAIN.selMenuList",		queryType:"selList",	dataName:"MENU",	param:{}},
		 {queryId: "we.std.main.MDI_MAIN.selCmmnCd2List",	queryType:"selList",	dataName:"CD2",		param:{}},
		 {queryId: "we.std.main.MDI_MAIN.selCmmnCd3List",	queryType:"selList",	dataName:"CD3",		param:{}},
		]

	MDI.load(querySet).then((data) => {
    	//메뉴작성
    	MDI.drawMenu($("#side-menu"), data.MENU);
    	//이벤트 바인드
    	MDI.bind();
		//공통코드 sessionStorage에 저장
    	MDI.storeCmmnCd(data.CD2, data.CD3);
		//대시보드열기
    	MDI.openDashboard();

        //Tab간 데이터 변경 listener 선언
        XUTL.listenTopMessage("CHANGE_TR");	//주문 관련 변경,	{TR_NO:"", CMD:""}
        ...
	});
	
 *
 * @param settings
 * @author	:	염국선
 * @since	:	2021.12.02
 */
class MdiUtil extends BaseUtil {

	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//active tab history(tab close시 이전 tab active)
	_activeTabHist = [];
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자 - {name:"MDI", URL_DASHBOARD:"forward/pjt/cmmn/main/Dashboard.do", URL_VALIDATION:"/std/cmmn/validSession.do", debug:true}
	//-------------------------------------------------------------------------
	constructor(settings) {
 		super({name:"MDI", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	///////////////////////////////////////////////////////////////////////////
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// load - [공통데이터, 메뉴데이터 등]
	//-----------------------------------------------------
	load = (querySet) => {
		return this.fetch({url:"/std/cmmn/mquery.do", data:{querySet:querySet}});
	}//end-load
	///////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////
	// menu(MetsiMenu) 작성
	//-----------------------------------------------------
	drawMenu = ($container, data) => {
		const menuList	= this.findRows(data, "MENU_LVL", 1);	//1레벨 메뉴목록
		for (let i=0; i<menuList.length; i++) {
			menuList[i].children = this.findRows(data, "PARENT_MENU_ID", menuList[i].MENU_ID);
		}

		//메뉴화면작성
		for (let i=0; i<menuList.length; i++) {
			const menu = menuList[i];
			//미조회메뉴 및 프로그램목록이 없으면 작성안함
			if (menu.HID_YN === "Y" || menu.children.length === 0) {
				continue;
			}

			const $menu = $('<li></li>').appendTo($container);
			$menu.append('<a href="#"><i class="fa '+menu.MENU_ICON+'"></i><span class="nav-label">'+menu.MENU_NM+'</span><span class="fa arrow"></span></a>');
			const $children = $('<ul class="nav nav-second-level collapse"></ul>').appendTo($menu);
			for (let j=0; j<menu.children.length; j++) {
				const pgm = menu.children[j];
				const $pgm = $('<a href="#">'+pgm.MENU_NM+'</a>').click(() => {
					this._onClickMenu(pgm);
				});
				$('<li></li>').append($pgm).appendTo($children);
			}
		}
		
	    $container.metisMenu("dispose");
	    $container.metisMenu();
	}//end-drawMenu
	///////////////////////////////////////////////////////
	
	
	///////////////////////////////////////////////////////
	// MDI 관련 이벤트 bind
	//-----------------------------------------------------
	bind = () => {
		//mdi_logout:로그아웃
    	$(".mdi_logout").click(() => {
    		if (confirm("로그아웃 하시겠습니까?")) {
    			this._clearSessionStorage();
    		    this._svrLog({CMD:"LOGGING", PGM_ID:"LOGOUT", LOG_CN:"/logout.do"}).then((data) => {
        			location.replace("/logout.do");
    		    });
    		}
    	});
		//mdi_dashboard:대쉬보드 open&refresh
    	$(".mdi_dashboard").click(() => {
    		this.openDashboard();
    	});
    	//mdi_closeTabAll: 텝모두닫기
    	$(".mdi_closeTabAll").click(() => {
			this._closeTabAll();
    	});
    	//window resize
    	$(window).resize(() => {
    		this.resizeTabPage();
    	});
    	
	}//end-bind
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// sessionStorage 공통코드 저장
	//-----------------------------------------------------
	storeCmmnCd = (codeList2, codeList3) => {
		//공통코드 중분류
    	const codeSet2 = {};
		for (let i=0; i<codeList2.length; i++) {
			const entity = codeList2[i];
    		if (!codeSet2[entity.CODE_CD_L]) {
    			codeSet2[entity.CODE_CD_L] = [];
    		}
    		codeSet2[entity.CODE_CD_L].push({CODE_CD:entity.CODE_CD_M, CODE_NM:entity.CODE_NM_M, USRDF_1:entity.USRDF_1});
		}
    	sessionStorage.setItem("G_CMMN_CODE_LIST", JSON.stringify(codeSet2));
		
		//공통코드 소분류
    	const codeSet3 = {};
		for (let i=0; i<codeList3.length; i++) {
			const entity = codeList3[i];
    		if (!codeSet3[entity.CODE_CD]) {
    			codeSet3[entity.CODE_CD] = [];
    		}
    		codeSet3[entity.CODE_CD].push({CODE_CD:entity.CODE_CD_M, CODE_NM:entity.CODE_NM_M, CODE_CD_L:entity.CODE_CD_L});
		}
    	sessionStorage.setItem("G_CMMN_CODE_LIST_L3", JSON.stringify(codeSet3));
	}//end-storeCmmnCd
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// tab open - 생성 혹은 활성화
	//-----------------------------------------------------
	openTab = (tabId, tabNm, url, refresh, opts) => {
		this._debug("openTab:"+tabId+"-"+tabNm+"->"+url+","+refresh);
		url = url.substring(0,1) === "/" ? url : "/" + url;
		const $tabBtn = this._getTabBtn(tabId);
		if ($tabBtn.length === 0) {
		    this._appendTab(tabId, tabNm, url);
		}
	    this._activeTab(tabId, url, refresh);
	    
	    //화면사용 로그작성
	    this._svrLog({CMD:"MENU", PGM_ID:tabId, LOG_CN:tabNm + ":" + url});
	}//end-openTab
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// open Dashboard
	//-----------------------------------------------------
	openDashboard = () => {
		if (this._settings.URL_DASHBOARD) {
			this.openTab("Dashboard", "메인", this._settings.URL_DASHBOARD, true);
		}
	}//end-openDashboard
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// closeTab
	//-----------------------------------------------------
	closeTab = (tabId) => {
		//iframe에서 호출되므로 호출쪽 프로세스 끝난 후에 remove
		setTimeout(() => {
			this._closeTab(tabId);
		});
	}//end-closeTab
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// resize iframe
	//-----------------------------------------------------
	resizeTabPage = () => {
		this._debug("_resizeTabPage");
		const $con = $('#div_iframe_box'); 
		const w = $con.width()-1;
		const h = $('.footer').offset().top - $con.offset().top - 4; 
		$('#div_iframe_box .mdi_page').width(w).height(h);
	}//end-resizePage
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// get tab button element
	//-----------------------------------------------------
	_getTabBtn = (tabId) => {
		if (tabId === "all") {
			return $('#div_tabList ul li').not('[id="li_closeTabAll"]');
		} else if (tabId === "active") {
			return $('#div_tabList ul li.active');
		} else {
			return $('#div_tabList ul li[id="'+tabId+'"]');
		}
	}//end-_getTabBtn
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// get page button element
	//-----------------------------------------------------
	_getTabPage = (tabId) => {
		if (tabId === "all") {
			return $('#div_iframe_box iframe');
		} else {
			return $('#div_iframe_box iframe[name="'+tabId+'"]');
		}
	}//end-_getTabPage
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// append tab
	//-----------------------------------------------------
	_appendTab = (tabId, tabNm, url) => {
		//tab button 작성
		const $li = $('<li>').attr("id", tabId).appendTo($('#div_tabList ul'));
		const $a = $('<a href="#">' + tabNm + '</a>').click(() => {
			this._activeTab(tabId);
		}).appendTo($li);
		const $i = $('<i class="fa fa-window-close"></i>').click(() => {
			this._closeTab(tabId);
		}).appendTo($a);
		
		//tab page 작성
		$('<iframe class="border-top-bottom border-left-right mdi_page"></iframe>').attr("name", tabId).attr("src", url).appendTo($('#div_iframe_box')).show();
		this.resizeTabPage();
	}//end-_appendTab
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// tab 활성화
	//-----------------------------------------------------
	_activeTab = (tabId, url, refresh) => {
		if (tabId) {	//활성탭 설정
			if (this._activeTabHist.length === 0 || this._activeTabHist[this._activeTabHist.length-1] !== tabId) {
				this._activeTabHist.push(tabId);
			}
			this._debug("_activeTabHist:"+this._activeTabHist);
			const $activeIframe = $('#div_iframe_box iframe[name="'+tabId+'"]');
			$('#div_tabList ul li').removeClass("active");
			$('#div_iframe_box iframe').hide();
			if (refresh && url !== '') { // refresh 면 url 재설정
				$activeIframe.attr("src", url);
			}
			$activeIframe.show();
			return $('#div_tabList ul li[id="'+tabId+'"]').addClass("active");
		}
	}//end-_activeTab
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// remove active tab history
	//-----------------------------------------------------
	_removeActiveTabHist = (tabId) => {
		//활성탭이력에서 tabId 제거
		for (let i=this._activeTabHist.length-1; i>=0; i--) {
			if (this._activeTabHist[i] === tabId) {
				this._activeTabHist.splice(i, 1);
			}
		}
		//활성텝이력이 존재하면서도 활성탭이 없을 경우 마지막 이력으로 활성화 
		if (this._getTabBtn("active").length === 0 && this._activeTabHist.length > 0) {
			this._activeTab(this._activeTabHist[this._activeTabHist.length - 1]);
		}
	}//end-_removeActiveTabHist
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// tab close
	//-----------------------------------------------------
	_closeTab = (tabId) => {
		this._debug("_closeTab:"+tabId);
		this._getTabBtn(tabId).remove();
		this._getTabPage(tabId).remove();
		this._removeActiveTabHist(tabId);
	}//end-_closeTab
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// tab close
	//-----------------------------------------------------
	_closeTabAll = () => {
		this._debug("_closeTabAll");
		this._getTabBtn("all").not('[id="Dashboard"]').remove();
		this._getTabPage("all").not('[name="Dashboard"]').remove();
		this._activeTabHist.splice(0);
		if (this._getTabBtn("Dashboard").length > 0) {
			this._activeTab("Dashboard");
		}
	}//end-_closeTabAll
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// sessionStorage clear
	//-----------------------------------------------------
	_clearSessionStorage = function () {
		sessionStorage.removeItem("G_CMMN_CODE_LIST");
		sessionStorage.removeItem("G_CMMN_CODE_LIST_L3");
	}//end-_clearSessionStorage
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// server log
	//	param: {CMD:"MENU", PGM_ID:"", LOG_CN:""}
	//-----------------------------------------------------
	_svrLog = (param) => {
		//NO_RESPONSE_JSON_FILTER: 응답에 대한 오류메세지처리 하지않고 바로 넘김
		param = this.extend({queryId:"we.std.main.MDI_MAIN.pgmUseLog"}, param);
		return this.fetch({url:"/std/cmmn/sp.do", data:param, settings:{NO_RESPONSE_HANDLE: true}});
	}//end-_svrLog
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// menu(MetsiMenu) 작성
	//-----------------------------------------------------
	_onClickMenu = (pgm) => {
		if (this._settings.URL_VALIDATION) {
			this.fetch({
				url	: this._settings.URL_VALIDATION,
				data: pgm
			})
			.then((response) => {
				this.openTab(pgm.PGM_CD, pgm.MENU_NM, pgm.PGM_CMD, false);
			});
		} else {
			this.openTab(pgm.PGM_CD, pgm.MENU_NM, pgm.PGM_CMD, false);
		}

	}//end-_openTab
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================	

}//end-class MdiUtil
