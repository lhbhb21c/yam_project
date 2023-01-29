/**
 * 파일명	: WSFR_LIST.js
 * 설명	: 창고이동관리
 *
 * 수정일			수정자		수정내용
 * 2021.10.26	염국선		최초작성
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
		ITM_GB		: [],	//품목구분
		WH_CD		: [],	//창고코드
		QTY_UN		: [],	//수량단위
		WSFR_ST		: []	//창고이동요청상태
	}
	//조회 조건
	$scope.ds_cond	= {
		ITM_GBS		: [],	//품목구분
		WHOUT_WH_CDS: [],	//출고창고구분
		WHIN_WH_CDS	: []	//입고창고구분
	};
	//에디터마스터
	$scope.ds_editMst	= {};
	
	
	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.ITM_GB	= XUTL.getCodeFactory().ITM_GB;	//품목구분
		$scope.ds_code.WH_CD	= XUTL.getCodeFactory().WH_CD;		//창고코드
		$scope.ds_code.QTY_UN	= XUTL.getCodeFactory().QTY_UN;	//수량단위
		$scope.ds_code.WSFR_ST	= XUTL.getCodeFactory().WSFR_ST;	//창고이동요청상태
						
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});

		//정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_WSFR", "/yam/wm/WSFR_LIST", (msg) => {
			$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());
		});
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data 	= $scope.mstGrid.data||[];
		$scope.subGrid.data 	= $scope.subGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.ITM_GBS, XUTL.getValueMatrix($scope.ds_code.ITM_GB, "CODE_CD")[0]);	//품목구분목록
 			XUTL.addRows($scope.ds_cond.WHOUT_WH_CDS, XUTL.getValueMatrix($scope.ds_code.WH_CD, "CODE_CD")[0]);	//출고창고구분목록
 			XUTL.addRows($scope.ds_cond.WHIN_WH_CDS, XUTL.getValueMatrix($scope.ds_code.WH_CD, "CODE_CD")[0]);	//입고창고구분목록
			$scope.ds_cond.DY_FR	= moment().add(-1, "months").format("YYYY-MM-DD");		//창고이동시작일 = 현재일 - 1달
			$scope.ds_cond.DY_TO	= moment().format("YYYY-MM-DD");						//창고이동종료일 = 현재일
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
			top.MDI.closeTab("/yam/wm/WSFR_LIST");

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
	$scope.lfn_search = (sels) => {
		$scope.lfn_dataset_init("MST");

		const param = {
			querySet	:
				[
				 {queryId: "yam.wm.WSFR_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "WHOUT_ID", XUTL.getValueMatrix(sels, "WHOUT_ID")[0]));
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search
	
    //마스터 선택시 해당 출고항목 조회
    $scope.lfn_search_sub = (entity) => {
    	$scope.lfn_dataset_init("SUB")

    	const param = {
    		querySet	:
    			[
    			 {queryId: "yam.wm.WSFR_LIST.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:{WSFR_ID:entity.WSFR_ID}}
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
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.lfn_search_sub(row.entity);
				});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/wm/WSFR_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'창고이동일',	field:'WSFR_DY',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'창고이동번호',	field:'WSFR_NO',		width:'100',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				},
				{displayName:'순번',		field:'WSFR_SN',		width:'50',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'출고창고',	field:'WHOUT_WH_CD_NM',	width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'입고창고',	field:'WHIN_WH_CD_NM',	width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목코드',	field:'ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'품목구분',	field:'ITM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'단위',		field:'WSFR_UN_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'수량',		field:'WSFR_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'상태',		field:'WSFR_ST_NM',		width:'70',		type:'string',	cellClass:'align_cen'}
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "창고이동목록");
	
    //sub Grid Options
    $scope.subGrid = NG_GRD.instanceGridOptions({
    	enableFiltering	: false,
    	showColumnFooter: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/wm/WSFR_LIST/subGrid",
		columnDefs		:
			[
				{displayName:'순번',		field:'WSFR_SN',		width:'50',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'출고창고',	field:'WHOUT_WH_CD_NM',	width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'입고창고',	field:'WHIN_WH_CD_NM',	width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목코드',	field:'ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'품목구분',	field:'ITM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen',
					 footerCellTemplate:'<div style="text-align:center">합계</div>'
			 	},
			 	{displayName:'단위',		field:'WSFR_UN_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'수량',		field:'WSFR_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',
					 footerCellFilter:'number',
					 footerCellClass:'align_rgt',
		             aggregationType:uiGridConstants.aggregationTypes.sum
			 	}
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "창고이동품목목록");

    
	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
	}//end-lfn_row_onClick

	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		return false;
	}//end-lfn_cell_disabled

	//cell click event
    $scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			//창고이동번호 클릭시 등록화면으로 이동
			if (name === "WSFR_NO") {
				_YAM.openMdiTab("WSFR_REG", {WSFR_ID: entity.WSFR_ID});
			}
		}
    }//end-lfn_cell_onClick
    
	//data change event
	$scope.lfn_cell_onChange = (name, entity, grid) => {
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
