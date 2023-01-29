/**
 * 파일명	: PWP_CLOSE.js
 * 설명	: 생산마감
 *
 * 수정일			수정자		수정내용
 * 2021.10.29	염국선		최초작성
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
			$scope.ds_cond.YM	= moment().format('YYYY-MM');	//현재월
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
    	if (name === "CONFIRM") {
			if ($scope.mstGrid.gridApi.selection.getSelectedRows().length === 0) {
				return true;
			}
    	}
		return false;
	}//end-lfn_btn_disabled

	//버튼 관련 click event 처리
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE") {
			top.MDI.closeTab("/yam/pc/PWP_CLOSE");

		} else if (name === "SEARCH") {
			$scope.lfn_search();

		} else if (name === "CONFIRM") {
			if ($scope.lfn_validate(name)){
				$scope.lfn_run(name)
			}
		}
	}//end-lfn_btn_onClick
	
    //입력필드 관련 ng-disabled 처리
    $scope.lfn_input_disabled = (name) => {
		return false;
    }//end-lfn_input_disabled
    
	//입력필드 관련 change event 처리
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
				 {queryId: "yam.pc.PWP_CLOSE.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "PWP_ID", XUTL.getValueMatrix(sels, "PWP_ID")[0]));
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search
	
    //마스터 선택시 투입실적 조회
    $scope.lfn_search_sub = (entity) => {
    	$scope.lfn_dataset_init("SUB")

		const queryParam = {
			PWP_ID		: entity.PWP_ID,
			SECTR_ID	: entity.SECTR_ID
		};

    	const param = {
    		querySet	:
    			[
    			 {queryId: "yam.pc.PWP_CLOSE.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:queryParam}
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
    
    //검증
	$scope.lfn_validate = (name) => {
		if (name === "CONFIRM") {
    		let sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
    		
			if(sels.length === 0) {
				alert("생산항목을 선택해주세요.");
				return false;
			} else if (sels[0].ROW_CRUD === "R" && XUTL.findRows($scope.subGrid.data, "ROW_CRUD", "U").length === 0) {
				alert("변경내역이 없습니다.");
				return false;
			} else if (!NG_GRD.validateGridData($scope.mstGrid.gridApi, {data:sels}).isValid) {
				return false;
			} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
				return false;
			}
			
		} else {
			alert("unknown cmd:"+name)
			return false;
		}
		return true;
	}//end-lfn_validate
	
	//실행
	$scope.lfn_run = (name) => {
		let confirmMsg = "저장 하시겠습니까?";
		let successMsg = "정상적으로 처리완료 되었습니다.";
		
		if (name === "CONFIRM") {
			confirmMsg = "생산마감 처리 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return
		}
		
		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.mstGrid.gridApi.selection.getSelectedRows()[0]);
		xmlDoc.appendXml("sub", $scope.subGrid.data);

		console.log("----->", xmlDoc.toXmlString())
		// return;

		const param = {
			queryId	: "yam.pc.PWP_CLOSE.save",
			CMD		: name,
			XML_TEXT: xmlDoc.toXmlString()
		};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/sp.do",
			data: param 
		}).then((response) => {
			alert(successMsg);
			$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_run
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	

	///////////////////////////////////////////////////////////////////////////////////////////////
	// Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////
	//숫자(포맷)
    let numfCell = NG_CELL.getNumFormatCell({
    	permanent		: true,
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange",
    	selectOnFocus	: true,
    	digit			: 2,
    	sign			: true
    });


	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		customGridName	: "생산마감",
		noUnselect		: true,
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.lfn_search_sub(row.entity);
				});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/pc/PWP_CLOSE/mstGrid",
		columnDefs		:
			[
				{displayName:'상태',		field:'PWP_ST_NM',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'생산번호',	field:'PWP_NO',				width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'생산일자',	field:'PWP_DY',				width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품목코드',	field:'PWP_ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품명',		field:'PWP_ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'단위',		field:'PWP_ITM_UN_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'지시수량',	field:'PWO_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'생산수량',	field:'PWP_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'변경수량',	field:'CHG_PWP_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell,	validTypes:"required"},
			 	{displayName:'생산창고',	field:'PWP_WHIN_WH_CD_NM',	width:'100',	type:'string',	cellClass:'align_cen',	visible: false},
			 	{displayName:'재료창고',	field:'PWP_WHOUT_WH_CD_NM',	width:'100',	type:'string',	cellClass:'align_cen',	visible: false},
			 	{displayName:'담당자',	field:'PWP_CP_NM',			width:'100',	type:'string',	cellClass:'align_cen',	visible: false},
			 	{displayName:'지시번호',	field:'PWO_NO',				width:'120',	type:'string',	cellClass:'align_cen',	visible: false},
			 	{displayName:'지시일자',	field:'PWO_DY',				width:'100',	type:'string',	cellClass:'align_cen',	visible: false},
			 	{displayName:'주문차수',	field:'TR_AGGR_TM',			width:'80',		type:'string',	cellClass:'align_cen',	visible: false}
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "생산마감");
	
    //sub Grid Options
    $scope.subGrid = NG_GRD.instanceGridOptions({
		customGridName	: "투입내역",
    	enableFiltering	: false,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/pc/PWP_CLOSE/subGrid",
		columnDefs		:
			[
			 {displayName:'No.',		field:'PWP_SN',				width:'70',		type:'string',	cellClass:'align_cen'},
			 {displayName:'품목코드',	field:'PWP_IN_ITM_CD',		width:'120',	type:'string',	cellClass:'align_cen'},
			 {displayName:'품명',		field:'PWP_IN_ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
			 {displayName:'단위',		field:'PWP_IN_ITM_UN_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'구분',		field:'PWP_IN_ITM_GB_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'지시수량',	field:'PWO_IN_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'number'},
			 {displayName:'투입수량',	field:'PWP_IN_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'number'},
			 {displayName:'변경수량',	field:'CHG_PWP_IN_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell,	validTypes:"required"},
			]
	});

	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
	}//end-lfn_row_onClick
	
	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		return $scope.lfn_btn_disabled("CONFIRM");
	}//end-lfn_cell_disabled

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
	}//end-lfn_cell_onClick
	
    //cell change event
    $scope.lfn_cell_onChange = (name, entity, grid) => {
    	if (entity.ROW_CRUD === "R") {
    		entity.ROW_CRUD = "U"
    	}
    }//end-lfn_cell_onChange 
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
