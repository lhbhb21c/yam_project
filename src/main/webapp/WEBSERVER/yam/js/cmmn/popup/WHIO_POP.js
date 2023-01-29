/**
 * 파일명	: WHIO_POP.js
 * 설명		: 품목입출고내역 조회 팝업
 *
 * 수정일           수정자        수정내용
 * 2021.10.26		zno
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf 	= {}
	//code set
	$scope.ds_code 	= {
		WH_CD   	: []	//창고코드
	}
	//조회 조건
	$scope.ds_cond 	= {}


	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf 					= conf || {};
		let paramSet 					= XUTL.getRequestParamSet();
		$scope.ds_conf.POPUP_ID 		= paramSet.ID;
		$scope.ds_conf.POPUP_OPTIONS 	= JSON.parse(decodeURIComponent(paramSet.OPTIONS));

		$scope.ds_code.WH_CD = XUTL.getCodeFactory().WH_CD;		//창고코드

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기본정보조회
		$scope.lfn_load_base();
		$scope.lfn_search();
	}

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.whinGrid.data 	= $scope.whinGrid.data || []
		$scope.whoutGrid.data 	= $scope.whoutGrid.data || []
		// $scope.lotGrid.data		= $scope.lotGrid.data||[]

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
			$scope.ds_cond.SIO_YM 	= $scope.ds_conf.POPUP_OPTIONS.SIO_YM || moment().format('YYYY-MM');
			$scope.ds_cond.WH_CD 	= $scope.ds_conf.POPUP_OPTIONS.WH_CD;
			$scope.ds_cond.ITM_ID 	= $scope.ds_conf.POPUP_OPTIONS.ITM_ID;
			$scope.ds_cond.ITM_CD 	= $scope.ds_conf.POPUP_OPTIONS.ITM_CD;
			$scope.ds_cond.ITM_NM 	= $scope.ds_conf.POPUP_OPTIONS.ITM_NM;
			$scope.ds_cond.LOT_NO 	= $scope.ds_conf.POPUP_OPTIONS.LOT_NO;
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.whinGrid.data);
			XUTL.empty($scope.whoutGrid.data);
		}
	}//end-lfn_dataset_init
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////////////////////////
	// UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////
	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		return false;
	}//end-lfn_btn_disabled

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
	}//end-lfn_input_onChange

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE") {
			$window.close();
		} else if (name === "SEARCH") {
			$scope.lfn_search();
		} else if (name === "ds_cond.ITM_CD") {
			_YAM.popupItm({})
			.then((result) => {
				$timeout(() => {
					$scope.ds_cond.ITM_CD = result.ITM_CD
					$scope.ds_cond.ITM_NM = result.ITM_NM
				})
			});
		}
	}//end-lfn_btn_onClick
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
	//기본정보 조회
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST")

		const param = {
			querySet:
				[
					{
						queryId		: "yam.cmmn.popup.WHIO_POP.selWhioInList",
						queryType	: "selList",
						dataName	: "whinGrid.data",
						param		: $scope.ds_cond
					},
					{
						queryId		: "yam.cmmn.popup.WHIO_POP.selWhioOutList",
						queryType	: "selList",
						dataName	: "whoutGrid.data",
						param		: $scope.ds_cond
					},
				]
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param 
		}).then((response) => {
			$.each(response.success, (name, data) => {
				XUTL.setWithPath($scope, name, data);
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
	//입고내역 Grid Options
	$scope.whinGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection	: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering				: false,
		showColumnFooter			: true,
		customStateId: "yam/cmmn/popup/WHIO_POP/whinGrid",
		columnDefs:
			[
				{ displayName: '입고번호', 	field: 'WHIN_NO', 		width: '100', 	type: 'string', cellClass: 'align_cen', visible: false },
				{ displayName: '입고순번', 	field: 'WHIN_SN', 		width: '70', 	type: 'string', cellClass: 'align_cen', visible: false },
				{ displayName: '입고일', 	field: 'WHIN_DY', 		width: '100', 	type: 'string', cellClass: 'align_cen' },
				{ displayName: '구분', 		field: 'WHIN_GB_NM',	width: '100', 	type: 'string', cellClass: 'align_lft' },
				{ displayName: '창고', 		field: 'WH_NM', 		width: '*', 	type: 'string', cellClass: 'align_cen' },
				{ displayName: '단위', 		field: 'WHIN_UN', 		width: '70', 	type: 'string', cellClass: 'align_cen', visible: true },
				{ displayName: '수량', 		field: 'WHIN_QTY', 		width: '100', 	type: 'string', cellClass: 'align_rgt', exportType: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{ displayName: '지시번호', 	field: 'OD_NO', 		width: '100', 	type: 'string', cellClass: 'align_cen', visible: false },
				{ displayName: '지시순번', 	field: 'OD_SN', 		width: '70', 	type: 'string', cellClass: 'align_cen', visible: false }
			]
	});
	NG_GRD.addExcelExportMenu($scope.whinGrid, "입고이력");

	//출고내역 Grid Options
	$scope.whoutGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection	: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering				: false,
		showColumnFooter			: true,
		customStateId: "yam/cmmn/popup/WHIO_POP/whoutGrid",
		columnDefs:
			[
				{ displayName: '출고번호',  field: 'WHOUT_NO',		width: '100',	type: 'string', cellClass: 'align_cen', visible: false },
				{ displayName: '출고순번',  field: 'WHOUT_SN',  	width: '70', 	type: 'string', cellClass: 'align_cen', visible: false },
				{ displayName: '거래처',    field: 'PARTNR_NM', 	width: '100', 	type: 'string', cellClass: 'align_cen', visible: false },
				{ displayName: '출고일',    field: 'WHOUT_DY',  	width: '100', 	type: 'string', cellClass: 'align_cen' },
				{ displayName: '구분', 		field: 'WHOUT_GB_NM',	width: '90', 	type: 'string', cellClass: 'align_lft'},
				{ displayName: '창고',      field: 'WH_NM',     	width: '*', 	type: 'string', cellClass: 'align_cen'},
				{ displayName: '단위',      field: 'WHOUT_UN',  	width: '70', 	type: 'string', cellClass: 'align_cen',   },
				{ displayName: '수량',      field: 'WHOUT_QTY',		width: '100', 	type: 'string', cellClass: 'align_rgt',  exportType: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{ displayName: '지시번호',  field: 'OD_NO', 		width: '100', 	type: 'string', cellClass: 'align_cen', visible: false },
				{ displayName: '지시순번',  field: 'OD_SN', 		width: '70', 	type: 'string', cellClass: 'align_cen', visible: false }
			]
	});
	NG_GRD.addExcelExportMenu($scope.whoutGrid, "출고이력");
});//end-app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
