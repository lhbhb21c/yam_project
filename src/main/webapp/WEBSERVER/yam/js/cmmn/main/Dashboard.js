/**
 * 파일명	: Dashboard.js
 * 설명	: 대시보드
 *
 * 수정일			수정자		수정내용
 * 2021.11.02	이경수		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};
	//code set
	$scope.ds_code	= {};
	//조회 조건
	$scope.ds_cond	= {};	
	
	//초기화
    $scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
    	
    	//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});
    }    
    
    //데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.pwpGrid.data = $scope.pwpGrid.data||[];
		$scope.trGrid.data = $scope.trGrid.data||[];
		$scope.bbsGrid.data = $scope.bbsGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
		}
		if (!name || name === "MST") {
        	XUTL.empty($scope.pwpGrid.data);
        	XUTL.empty($scope.trGrid.data);
        	XUTL.empty($scope.bbsGrid.data);
		} 
	}//end-lfn_dataset_init
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////
	//버튼 관련 ng-show 처리
	$scope.lfn_btn_show = (name) => {
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
    	if (!$scope.lfn_btn_show(name)) {
    		return true;
    	}
		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (XUTL.isIn(name, "SEARCH", "pwpGrid.REFRESH", "trGrid.REFRESH", "bbsGrid.REFRESH")) {
			$scope.lfn_search(name);
		}
	}//end-lfn_btn_onClick
	
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = (name) => {
		return false;
    }//end-lfn_input_disabled
    
	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
	}//end-lfn_input_onChange
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = (name) => {
		name = name||"SEARCH";
		let param = {querySet: []};
		if (name === "pwpGrid.REFRESH") {
        	XUTL.empty($scope.pwpGrid.data);
        	param.querySet.push({queryId: "yam.cmmn.main.Dashboard.selPwpList", queryType:"selList", dataName:"pwpGrid.data", param:$scope.ds_cond});
        	
		} else if (name === "trGrid.REFRESH") {
        	XUTL.empty($scope.trGrid.data);
        	param.querySet.push({queryId: "yam.cmmn.main.Dashboard.selTrList", queryType:"selList", dataName:"trGrid.data", param:$scope.ds_cond});
		} else if (name === "bbsGrid.REFRESH") {
        	XUTL.empty($scope.bbsGrid.data);
        	param.querySet.push({queryId: "yam.cmmn.main.Dashboard.selNoticeList", queryType:"selList", dataName:"bbsGrid.data", param:{BBS_NO:"NOTICE"}});
		} else {
			$scope.lfn_dataset_init("MST");
			param.querySet = 
				[
				 {queryId: "yam.cmmn.main.Dashboard.selPwpList",	queryType:"selList",	dataName:"pwpGrid.data",	param:$scope.ds_cond},
				 {queryId: "yam.cmmn.main.Dashboard.selTrList",		queryType:"selList",	dataName:"trGrid.data",		param:$scope.ds_cond},
				 {queryId: "yam.cmmn.main.Dashboard.selNoticeList",	queryType:"selList",	dataName:"bbsGrid.data",	param:{BBS_NO:"NOTICE"}}
				]
		}

		blockUI.start();
		XUTL.fetch({
			url:"/std/cmmn/mquery.do",
			data:param
		}).then((response) => {
			$.each(response.success, (path, data) => {
				XUTL.setWithPath($scope, path, data);
			});
		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	

	///////////////////////////////////////////////////////////////////////////////////////////////
	// Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////
	//pwp Grid Options
	$scope.pwpGrid = NG_GRD.instanceGridOptions({
		enableGridMenu	: false,
		enableFiltering : false,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/main/Dashboard/pwpGrid",
		columnDefs		:
			[
				{displayName:'생산일',		field:'PWP_DY',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'실적번호',	field:'PWP_NO',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목코드',	field:'PWP_ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품명',		field:'PWP_ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'단위',		field:'PWP_ITM_UN',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'생산량',		field:'PWP_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"}
			]
	});
	NG_GRD.addExcelExportMenu($scope.pwpGrid, "생산현황");

	
	//tr Grid Options
	$scope.trGrid = NG_GRD.instanceGridOptions({
		enableGridMenu	: false,
		enableFiltering : false,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/main/Dashboard/trGrid",
		columnDefs		:
			[
				{displayName:'주문집계일자',		field:'TR_AGGR_DY',		width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목코드',		field:'ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품명',			field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'단위',			field:'TR_UN_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'주문수량',		field:'TR_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"}
			]
	});
	NG_GRD.addExcelExportMenu($scope.trGrid, "주문집계현황");
	
	
	//notice Grid Options
	$scope.bbsGrid = NG_GRD.instanceGridOptions({
		enableGridMenu	: false,
		enableFiltering : false,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/main/Dashboard/bbsGrid",
		columnDefs		:
			[
			 	{displayName:"범위",		field:"NOTI_SCOPE",		width:"150",	type:"string",	cellClass:"align_cen"},
			 	{displayName:"제목",		field:"SUBJCT",			width:"*",		type:"string",	cellClass:"align_lft"},
			 	{displayName:"게시자",		field:"NOTI_CP_NM",		width:"100",	type:"string",	cellClass:"align_cen"},
			 	{displayName:"게시시작",	field:"NOTI_S_DY",		width:"100",	type:"string",	cellClass:"align_cen"},
			 	{displayName:"게시종료",	field:"NOTI_E_DY",		width:"100",	type:"string",	cellClass:"align_cen"},
//			 	{displayName:"등록일시",	field:"REG_DT",			width:"150",	type:"string",	cellClass:"align_cen"}
			]
	});
	NG_GRD.addExcelExportMenu($scope.bbsGrid, "공지사항");

	
	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		if (grid.options === $scope.bbsGrid) {
			_YAM.popupBbs({NOTI_ID:entity.NOTI_ID});
		}
	}//end-lfn_row_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

});