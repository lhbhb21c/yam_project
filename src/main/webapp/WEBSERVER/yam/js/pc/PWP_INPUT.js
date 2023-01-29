/**
 * 파일명	: PWP_INPUT.js
 * 설명	: 월소요량조회
 *
 * 수정일			수정자		수정내용
 * 2021.10.29	XXX		최초작성
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
	$scope.ds_code	= {}
	//조회 조건
	$scope.ds_cond	= {};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$scope.lfn_search();
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		$scope.subGrid.data = $scope.subGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
			$scope.ds_cond.YYYY	= moment().format('YYYY');
		}
		if (!name || name === "MST") {
        	XUTL.empty($scope.mstGrid.data);
        	$scope.lfn_dataset_init("SUB");
		} 
			
		if (name === "SUB") {
        	XUTL.empty($scope.subGrid.data);
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
			top.MDI.closeTab("/yam/pc/PWP_INPUT");

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
				 {queryId: "yam.pc.PWP_INPUT.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
	
    //마스터 선택시 해당 생산내역 조회
    $scope.lfn_search_sub = (entity) => {
    	$scope.lfn_dataset_init("SUB")

    	const param = {
    		querySet	:
    			[
    			 {queryId: "yam.pc.PWP_INPUT.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:entity}
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
    }//end-lfn_search_sub
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	

	///////////////////////////////////////////////////////////////////////////////////////////////
	// Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////
	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		rowTemplate		: NG_CELL.getRowTemplate({}),
		customStateId	: "/yam/pc/PWP_INPUT/mstGrid",
		columnDefs		:
			[
			 	{displayName:'품목코드',	field:'ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품명',		field:'ITM_NM',		width:'400',	type:'string',	cellClass:'align_lft'},
			 	{displayName:'단위',		field:'ITM_UN_NM',	width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'소요량',		field:'PWP_IN_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'01월',		field:'PWP_IN_QTY_01',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'02월',		field:'PWP_IN_QTY_02',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'03월',		field:'PWP_IN_QTY_03',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'04월',		field:'PWP_IN_QTY_04',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'05월',		field:'PWP_IN_QTY_05',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'06월',		field:'PWP_IN_QTY_06',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'07월',		field:'PWP_IN_QTY_07',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'08월',		field:'PWP_IN_QTY_08',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'09월',		field:'PWP_IN_QTY_09',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'10월',		field:'PWP_IN_QTY_10',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'11월',		field:'PWP_IN_QTY_11',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})			 		
			 	},
			 	{displayName:'12월',		field:'PWP_IN_QTY_12',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number",
			 		cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})		 		
			 	}
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "월별소요량");
	
    //sub Grid Options
    $scope.subGrid = NG_GRD.instanceGridOptions({
		rowTemplate		: NG_CELL.getRowTemplate({}),
		customStateId	: "/yam/pc/PWP_INPUT/subGrid",
		columnDefs		:
			[
				{displayName:'구분',		field:'PWO_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'생산일',		field:'PWP_DY',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'생산번호',	field:'PWP_NO',			width:'100',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				},
			 	{displayName:'품목코드',	field:'ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'단위',		field:'ITM_UN_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'지시수량',	field:'PWO_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'생산수량',	field:'PWP_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
				{displayName:'지시번호',	field:'PWO_NO',			width:'100',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				}
			]

	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "월생산내역");


	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			if (name.substring(0, 11) ===  "PWP_IN_QTY_") {
				let ym = entity.YYYY + "-" + name.substring(11,13);
				$scope.lfn_search_sub({ITM_ID:entity.ITM_ID, YM:ym});
			}
		} else if (grid.options === $scope.subGrid) {
			if (name === "PWO_NO") {	//작업지시번호 클릭시 등록화면으로 이동
				_YAM.openMdiTab("PWO_REG", entity, {CMD:"SEL"});
			} else if (name === "PWP_NO") {	//작업실적번호 클릭시 등록화면으로 이동
				_YAM.openMdiTab("PWP_REG", entity, {CMD:"SEL"});
			}
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
