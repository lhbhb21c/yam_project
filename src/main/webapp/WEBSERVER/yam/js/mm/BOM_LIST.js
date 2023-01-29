/**
 * 파일명	: BOM_LIST.js
 * 설명	: BOM 조회
 * 
 * 수정일		 	수정자		수정내용
 * 2020.12.09	심정민		최초작성
 */
//angular module instance
var app = NG_UTL.instanceBasicModule("mstApp", ["ui.grid.grouping"]);
_YAM.addQtyFilter(app);
//controller 설정
app.controller("mstCtl", function ($scope, $timeout, $filter, $window, uiGridConstants, blockUI, uiGridGroupingConstants,uiGridTreeBaseService ) {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {}
	//code set
	$scope.ds_code	= {
		QTY_UN		: [],	//수량단위
		PROC_CD		: []
	}
	//조회 조건
	$scope.ds_cond	= {};

	
	//초기화
	$scope.load = function(conf) {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.QTY_UN	= XUTL.getCodeFactory().QTY_UN;	//수량단위
		$scope.ds_code.PROC_CD	= XUTL.getCodeFactory().PROC_CD;	//공정코드
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		$scope.lfn_load_base();
	}	

    //데이터 초기화
    $scope.lfn_dataset_init = function (name) {
    	$scope.mstGrid.data = $scope.mstGrid.data||[]
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond);
			$scope.ds_cond.USE_YN = 'Y';
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
    $scope.lfn_btn_show = function (name) {
    	return true;
    }//end-lfn_btn_show

    //버튼 관련 ng-disabled 처리
    $scope.lfn_btn_disabled = function (name) {
    	if (!$scope.lfn_btn_show(name)) {
    		return true;
    	}
    	return false;
    }//end-lfn_btn_disabled

    //버튼클릭이벤트
    $scope.lfn_btn_onClick = function(name, arg1) {
    	if (name === "CLOSE") {
    		top.MDI.closeTab("/yam/mm/BOM_LIST");
    	} else if (name === "SEARCH") {
           	$scope.lfn_search();
           	
    	} else if (name === "ds_cond.POP_ITM") {	//품목팝업
    		_yam.popupItm({})	//{FIX_ITM_GB:"GFRT,GHWA,GSUB,GHLB"} 제품/상품/임가공/반제품
    		.then(function (result) {
				$timeout(function () {
					$scope.ds_cond.ITM_CD	= result.ITM_CD;
					$scope.ds_cond.ITM_NM	= result.ITM_NM;
				});
			}); 
    	}
    	
    }//end-lfn_btn_onClick
    
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = function (name) {
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange = function (name) {
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
    $scope.lfn_load_base = function () {	
    }//end-lfn_load_base
    
    //조회
    $scope.lfn_search = function (sels) {    	
    	var param = {
    		querySet	:
    			[
    			 {queryId: "yam.mm.BOM_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",		param:$scope.ds_cond}
    			]
    	}
    	
    	blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		}).then(function (response) {
    		$.each(response.success, function(name, data) {
    			XUTL.setWithPath($scope, name, data);
    		});
		}).finally(function (data) {
			$timeout(function () {
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
	//마스터 Grid Options
    $scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	enableSorting: false,
    	multiSelect: false,
	    // enableGroupHeaderSelection: true,
	    treeRowHeaderAlwaysVisible: false,

		rowTemplate		: NG_CELL.getRowTemplate({}),
		onRegisterApi	:
			function(gridApi) {
				gridApi.selection.on.rowSelectionChanged($scope, function (rows) {
					//$scope.proceedParentSelection(rows);
					// gridApi.toggleRowTreeState
					$scope.toggleRow(rows);
				});	                   
			},
		customStateId	: "/yam/mm/BOM_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'BOM번호',	field:'BOM_NO',			width:'100',	type:'string',	cellClass:'align_cen',	visible:false,	grouping:{ groupPriority: 0 }},
				{displayName:'품목코드',	field:'H_ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen',	},
				{displayName:'품목',		field:'H_ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft',	},
				{displayName:'수량단위',	field:'H_QTY_UN',		width:'80',		type:'string',	cellClass:'align_cen',	},
				{displayName:'자재수량',	field:'H_ITM_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: "number"},
				{displayName:'공정',  	field:'H_PROC_CD_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목코드',	field:'L_ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목',		field:'L_ITM_NM',		width:'350',	type:'string',	cellClass:'align_lft'},
				{displayName:'소요단위',	field:'L_QTY_UN',		width:'80',		type:'string',	cellClass:'align_cen'},
 				{displayName:'소요수량',	field:'L_CONSM_QTY',	width:'100',	type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'공정',  	field:'L_PROC_CD_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, {title:"BOM목록", type:"simple"});
        

    //row click event
    $scope.lfn_row_onClick = function (name, entity, grid) {
    	grid.api.selection.selectRow(entity);
    }//end-lfn_row_onClick
    
    // //cell disabled define
    // $scope.lfn_cell_disabled = function (name, entity, grid) {
    // 	return false;
    // }//end-lfn_cell_disabled
    
    // //cell click event
    // $scope.lfn_cell_onClick = function (name, entity, grid) {
    // }//end-lfn_cell_onClick
    
    $scope.toggleRow = function(row, evt){
        uiGridTreeBaseService.toggleRowTreeState($scope.mstGrid.gridApi.grid, row, evt);
     };
     
	// $scope.proceedParentSelection = function(rows) {
        // var children = rows.treeNode.parentRow.treeNode.children;
        // var cnt = 0;
        //
        // $.each(children, function (idx, row) {
        //    if (row.row.isSelected) {
        //       cnt ++;
        //    }
        // })
        // if (cnt == children.length) {
        //    rows.treeNode.parentRow.setSelected(true);
        // } else {
        //    rows.treeNode.parentRow.setSelected(false);
        // }
    // }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

}); // control end
