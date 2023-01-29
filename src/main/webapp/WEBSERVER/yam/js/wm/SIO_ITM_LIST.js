/**
 * 파일명	: SIO_ITM_LIST.js
 * 설명	    : 재고수불원장
 *
 * 수정일			수정자		수정내용
 * 2021.10.26	    zno		    최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf  = {};

	//code set
	$scope.ds_code  = {
		WH_CD	    : [],	//창고코드
		ITM_GB	    : []	//품목구분
	}

	//조회 조건
	$scope.ds_cond  = {
		WH_CDS	    : [],	//창고코드목록
		ITM_GBS	    : []	//품목구분목록
	};

	//재고월
	$scope.ds_sio   = [];

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf          = conf || {};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();

		$scope.ds_code.WH_CD    = XUTL.getCodeFactory().WH_CD;		//창고코드
		$scope.ds_code.ITM_GB   = XUTL.getCodeFactory().ITM_GB;		//품목구분
		$scope.ds_code.QTY_UN	= XUTL.getCodeFactory().QTY_UN;		//수량단위

		//데이터 초기화
		$scope.lfn_dataset_init();
		$scope.lfn_load_base();
	}

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {

		$scope.mstGrid.data     = $scope.mstGrid.data || [];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.WH_CDS, XUTL.getValueMatrix($scope.ds_code.WH_CD, "CODE_CD")[0]);	//창고코드목록
 			XUTL.addRows($scope.ds_cond.ITM_GBS, XUTL.getValueMatrix($scope.ds_code.ITM_GB, "CODE_CD")[0]);	//품목구분목록
			$scope.ds_cond.SIO_YM = moment().format('YYYY-MM');
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.mstGrid.data);
			XUTL.empty($scope.ds_sio);
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
		if (name === "CLOSE") {
			top.MDI.closeTab("/yam/wm/SIO_ITM_LIST");

		} else if (name === "SEARCH") {
			if (!$scope.ds_cond.SIO_YM) {
				alert('조회하려는 재고월을 입력해주세요.');
				return;
			}
			$scope.lfn_search();
		}
	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		return false;
	}//end-lfn_input_disabled
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
	$scope.lfn_search = (sels, cond) => {
		$scope.lfn_dataset_init("MST")

		const param = {
			querySet    :
				[
					{
						queryId     : "yam.wm.SIO_ITM_LIST.selMstList",
						queryType   : "selList",
						dataName    : "mstGrid.data",
						param       : cond || $scope.ds_cond
					}
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
	//link cell
	let linkCell = NG_CELL.getAnchorRenderer({ngClick: "lfn_cell_onClick"});

	//Mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection    : false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		noUnselect                  : true,
		showColumnFooter            : true,
		rowTemplate                 : NG_CELL.getRowTemplate({ngClick: "lfn_row_onClick"}),
		customStateId               : "/yam/wm/SIO_ITM_LIST/mstGrid",
		headerTemplate              : '/WEBSERVER/wevefw/js/angular/ui/uigrid/template/header-template.html',
		category:
			[
				{name: "cat0", displayName: "품목", visible: true, showCatName: true},
				{name: "cat1", displayName: "수량", visible: true, showCatName: true},
				{name: "cat2", displayName: "입고", visible: true, showCatName: true},
				{name: "cat3", displayName: "출고", visible: true, showCatName: true}
			],
		columnDefs:
			[
				{category: "cat0", displayName: "창고",			field: "WH_NM",				width: "120", 	type: "string", cellClass: "align_lft", cellTemplate: linkCell},
				{category: "cat0", displayName: "품목코드",		field: "ITM_CD",        	width: "120",  	type: "string", cellClass: "align_cen", cellTemplate: linkCell},
				{category: "cat0", displayName: "품명",			field: "ITM_NM",        	width: "250", 	type: "string", cellClass: "align_lft", cellTemplate: linkCell},
				{category: "cat0", displayName: "품목구분",		field: "ITM_GB_NM",     	width: "80",  	type: "string", cellClass: "align_cen"},
				{category: "cat0", displayName: "단위",			field: "SIO_UN",        	width: "70",  	type: "string", cellClass: "align_cen", cellFilter:'codeName:grid.appScope.ds_code.QTY_UN', footerCellTemplate: "<div style=\"text-align:center\">합계</div>"},
				{category: "cat1", displayName: "재고수량", 		field: "STOCK_QTY",     	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum},
				{category: "cat1", displayName: "기초수량",		field: "BS_QTY",        	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum},
				{category: "cat1", displayName: "입고수량",		field: "WHIN_QTY",      	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum},
				{category: "cat1", displayName: "출고수량",		field: "WHOUT_QTY",     	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum},
				{category: "cat2", displayName: "구매입고",		field: "TRD_WHIN_QTY",  	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum},
				{category: "cat2", displayName: "제품입고",		field: "PROD_WHIN_QTY", 	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat2", displayName: "창고이동입고",	field: "WSF_WHIN_QTY",  	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat2", displayName: "재고실사입고",	field: "SC_WHIN_QTY",   	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat2", displayName: "기타입고",		field: "ETC_WHIN_QTY",  	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat3", displayName: "납품출고",		field: "TRD_WHOUT_QTY", 	width: "100",	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat3", displayName: "생산출고",		field: "PROD_WHOUT_QTY",	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat3", displayName: "창고이동출고",	field: "WSF_WHOUT_QTY",		width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat3", displayName: "재고실사출고",	field: "SC_WHOUT_QTY",  	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
				{category: "cat3", displayName: "기타출고",		field: "ETC_WHOUT_QTY", 	width: "100", 	type: "string", cellClass: "align_rgt", cellFilter: "number", footerCellTemplate: NG_CELL.getFooterSumRenderer(), aggregationType: uiGridConstants.aggregationTypes.sum },
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "재고수불원장");

	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		grid.api.selection.selectRow(entity);
	}//end-lfn_row_onClick

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		//품목코드/명 클릭시 입출고 내역 팝업
		if (XUTL.isIn(name, "ITM_CD", "ITM_NM")) {
			_YAM.popupWhio({
				SIO_YM  : $scope.ds_cond.SIO_YM,
				ITM_ID  : entity.ITM_ID,
				ITM_CD  : entity.ITM_CD,
				ITM_NM  : entity.ITM_NM});
		}
		//창고 클릭시 입출고 내역 팝업
		if (XUTL.isIn(name, "WH_NM")) {
			_YAM.popupWhio({
				SIO_YM  : $scope.ds_cond.SIO_YM,
				ITM_ID  : entity.ITM_ID,
				ITM_CD  : entity.ITM_CD,
				ITM_NM  : entity.ITM_NM,
				WH_CD   : entity.WH_CD
			});
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
