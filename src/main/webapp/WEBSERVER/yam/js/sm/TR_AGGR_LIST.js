/**
 * 파일명	: TR_AGGR_LIST.js
 * 설명	: 주문집계현황
 *
 * 수정일			수정자		수정내용
 * 2021.11.02	염국선		최초작성
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
	$scope.ds_code	= {
		TR_AGGR_TM	: []	//주문집계차수
	}
	//조회 조건
	$scope.ds_cond	= {
		TR_AGGR_TMS	: []	//주문집계차수
	};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.TR_AGGR_TM	= XUTL.getCodeFactory().TR_AGGR_TM;	//주문집계차수
						
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.TR_AGGR_TMS, XUTL.getValueMatrix($scope.ds_code.TR_AGGR_TM, "CODE_CD")[0]);	//작업지시구분
			$scope.ds_cond.DY_FR	= moment().add(-1, 'months').format('YYYY-MM-DD');		//주문집계시작일 = 현재일 - 1달
			$scope.ds_cond.DY_TO	= moment().format('YYYY-MM-DD');						//주문집계종료일 = 현재일
		}
		if (!name || name === "MST") {
        	XUTL.empty($scope.mstGrid.data);
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
			top.MDI.closeTab("/yam/sm/TR_AGGR_LIST");
		} else if (name === "SEARCH") {
			$scope.lfn_search();
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
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST");

		const param = {
			querySet	:
				[
				 {queryId: "yam.sm.TR_AGGR_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		rowTemplate		: NG_CELL.getRowTemplate({toggleSelection:true}),
		customStateId	: "/yam/sm/TR_AGGR_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'주문집계일자',	field:'TR_AGGR_DY',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'차수',		field:'TR_AGGR_TM_NM',	width:'50',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목코드',	field:'ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'단위',		field:'TR_UN_NM',		width:'50',		type:'string',	cellClass:'align_cen',	visible:false},
			 	{displayName:'재고수량',	field:'STOCK_QTY',		width:'100',		type:'string',	cellClass:'align_rgt',	cellFilter:'number',	exportType:"number"},
			 	{displayName:'주문수량',	field:'TR_QTY',			width:'100',		type:'string',	cellClass:'align_rgt',	cellFilter:'number',	exportType:"number"},
			 	{displayName:'지시수량',	field:'PWO_QTY',		width:'100',		type:'string',	cellClass:'align_rgt',	cellFilter:'number',	exportType:"number"},
			 	{displayName:'생산수량',	field:'PWP_QTY',		width:'100',		type:'string',	cellClass:'align_rgt',	cellFilter:'number',	exportType:"number"},
			 		]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "주문집계현황");

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
