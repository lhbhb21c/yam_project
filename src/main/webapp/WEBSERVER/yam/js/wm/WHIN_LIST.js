/**
 * 파일명	: WHIN_LIST.js
 * 설명	: 입고조회
 *
 * 수정일			수정자		수정내용
 * 2021.10.14	염국선		최초작성
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
		WHIN_GB		: [],	//입고구분
		WH_CD		: [],	//창고코드
		ITM_GB		: [],	//품목구분
		QTY_UN		: []	//수량단위
	}
	//조회 조건
	$scope.ds_cond	= {
		WHIN_GBS	: [],	//입고구분
		WH_CDS		: [],	//창고구분
		ITM_GBS		: []	//품목구분
	};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.WHIN_GB	= XUTL.getCodeFactory().WHIN_GB;	//입고구분
		$scope.ds_code.WH_CD	= XUTL.getCodeFactory().WH_CD;		//창고코드
		$scope.ds_code.ITM_GB	= XUTL.getCodeFactory().ITM_GB;	//품목구분
		$scope.ds_code.QTY_UN	= XUTL.getCodeFactory().QTY_UN;	//수량단위
						
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});
		
		//입고정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_WHIN", "/yam/wm/WHIN_LIST", (msg) => {
	    	$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());
	    });
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		$scope.subGrid.data = $scope.subGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.WHIN_GBS, XUTL.getValueMatrix($scope.ds_code.WHIN_GB, "CODE_CD")[0]);	//입고구분목록
 			XUTL.addRows($scope.ds_cond.WH_CDS, XUTL.getValueMatrix($scope.ds_code.WH_CD, "CODE_CD")[0]);	//창고코드목록
 			XUTL.addRows($scope.ds_cond.ITM_GBS, XUTL.getValueMatrix($scope.ds_code.ITM_GB, "CODE_CD")[0]);	//품목구분목록
			$scope.ds_cond.DY_FR	= moment().add(-1, 'months').format('YYYY-MM-DD');		//입고시작일 = 현재일 - 1달
			$scope.ds_cond.DY_TO	= moment().format('YYYY-MM-DD');						//입고종료일 = 현재일
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
			top.MDI.closeTab("/yam/wm/WHIN_LIST");

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
				 {queryId: "yam.wm.WHIN_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "WHIN_NO", XUTL.getValueMatrix(sels, "WHIN_NO")[0]));
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search
	
    //마스터 선택시 해당 입고항목 조회
    $scope.lfn_search_sub = (entity) => {
    	$scope.lfn_dataset_init("SUB")

    	const param = {
    		querySet	:
    			[
    			 {queryId: "yam.wm.WHIN_LIST.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:{WHIN_ID:entity.WHIN_ID}}
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
		customStateId	: "/yam/wm/WHIN_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'구분',		field:'WHIN_GB_NM',		width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'입고일',		field:'WHIN_DY',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'입고번호',	field:'WHIN_NO',		width:'120',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				},
				{displayName:'순번',		field:'WHIN_SN',		width:'70',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'창고',		field:'WH_CD_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'거래처',		field:'PARTNR_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목코드',	field:'ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'품목구분',	field:'ITM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'단위',		field:'WHIN_UN',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'수량',		field:'WHIN_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'지시번호',	field:'OD_NO',			width:'100',	type:'string',	cellClass:'align_cen',	visible: false},
			 	{displayName:'상태',		field:'WHIN_ST_NM',		width:'70',		type:'string',	cellClass:'align_cen'}
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "입고목록");
	
    //sub Grid Options
    $scope.subGrid = NG_GRD.instanceGridOptions({
    	enableFiltering	: false,
    	showColumnFooter: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/wm/WHIN_LIST/subGrid",
		columnDefs		:
			[
			 {displayName:'No.',		field:'WHIN_SN',	width:'70',		type:'string',	cellClass:'align_cen'},
			 {displayName:'품목코드',		field:'ITM_CD',		width:'150',	type:'string',	cellClass:'align_cen'},
			 {displayName:'품목명',		field:'ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
			 {displayName:'품목구분',		field:'ITM_GB_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'단위',			field:'WHIN_UN',	width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN',
				 footerCellTemplate:'<div style="text-align:center">합계</div>'
			 },
			 {displayName:'수량',			field:'WHIN_QTY',	width:'150',	type:'string',	cellClass:'align_rgt',	cellFilter:'number',
				 footerCellFilter:'number',
				 footerCellClass:'align_rgt',
	             aggregationType:uiGridConstants.aggregationTypes.sum
			 },
			 {displayName:'단가',			field:'WHIN_PRC',	width:'150',	type:'string',	cellClass:'align_rgt',	cellFilter:'number',
				 footerCellFilter:'number',
				 footerCellClass:'align_rgt',
	             aggregationType:uiGridConstants.aggregationTypes.sum
			 },
			 {displayName:'공급가',		field:'WHIN_SPL_AM',width:'150',	type:'string',	cellClass:'align_rgt',	cellFilter:'number',
				 footerCellFilter:'number',
				 footerCellClass:'align_rgt',
	             aggregationType:uiGridConstants.aggregationTypes.sum
			 },
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "입고상세목록");

	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		grid.api.selection.selectRow(entity);
	}//end-lfn_row_onClick
	
	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			//입고번호 클릭시 등록화면으로 이동
			if (name === "WHIN_NO") {
				_YAM.openMdiTab("WHIN_REG", entity);
			}
		}
		
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
