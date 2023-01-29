/**
 * 파일명	: USER_POP.js
 * 설명	: 사용자선택 팝업
 * 
 * 수정일		 	수정자		수정내용
 *	2021.10.20 	정래훈		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration data set
	$scope.ds_conf	= {}
	//code data set
	$scope.ds_code	= {}
	//조회조건 data set
	$scope.ds_cond	= {}
	

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		let paramSet = XUTL.getRequestParamSet();
		$scope.ds_conf.POPUP_ID = paramSet.ID;
		$scope.ds_conf.POPUP_OPTIONS = JSON.parse(decodeURIComponent(paramSet.OPTIONS));
		//파라메터에 의한 싱글/다중선택 설정
		if ($scope.ds_conf.POPUP_OPTIONS.multiple) {
			$scope.mstGrid.multiSelect				= true;
			$scope.mstGrid.enableRowHeaderSelection	= true;
			$scope.mstGrid.noUnselect				= false;
			$scope.mstGrid.rowTemplate				= NG_CELL.getRowTemplate({toggleSelection: true});			
		} else {
			$scope.mstGrid.noUnselect				= true;
		}
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기본데이터 로드
		$scope.lfn_load_base();
	}//end-load

    //데이터 초기화
    $scope.lfn_dataset_init = (name) => {
    	$scope.mstGrid.data = $scope.mstGrid.data||[]
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond);
        	
        	//고정 조회 조건(품목구분) 설정
        	if (Array.isArray($scope.ds_conf.POPUP_OPTIONS.FIX_MEM_GB)) {
            	$scope.ds_cond.FIX_MEM_GB	= $scope.ds_conf.POPUP_OPTIONS.FIX_MEM_GB;
        	} else if ($scope.ds_conf.POPUP_OPTIONS.FIX_MEM_GB) {
            	$scope.ds_cond.FIX_MEM_GB	= $scope.ds_conf.POPUP_OPTIONS.FIX_MEM_GB.split(",");
        	}
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
    //버튼 관련 ng-disabled 처리
    $scope.lfn_btn_disabled = (name) => {
    	if (name === "SEL") {
    		return $scope.mstGrid.gridApi.selection.getSelectedRows().length === 0;
    	}
    	return false;
    }//end-lfn_btn_disabled

    //버튼클릭이벤트
    $scope.lfn_btn_onClick = (name) => {
    	if (name === "CLOSE") {
    		$window.close();
    		
    	} else if (name === "SEARCH") {
           	$scope.lfn_search();
           	
    	} else if (name === "SEL") {
    		$scope.lfn_send_selection($scope.ds_conf.POPUP_OPTIONS.noclose);
        	
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
    // opener에 선택한 결과값 전송
    $scope.lfn_send_selection = (noclose) => {
    	let sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
    	if (sels.length > 0 && $window.opener && $window.opener.XPOP) {
    		//noclose:팝업유지
			$window.opener.XPOP.setResult($scope.ds_conf.POPUP_ID, sels, noclose);
			if (noclose) {
				$scope.mstGrid.gridApi.selection.clearSelectedRows();
			} else {
				$window.close();
			}
    	}
    }//end-lfn_send_selection
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
    		queryId: "yam.cmmn.popup.USER_POP.selMstList",
    		queryType:"selList",
    		param:$scope.ds_cond
    	}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.mstGrid.data = response.success;

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
    //연봉협상 대상 Grid Options
    $scope.mstGrid = NG_GRD.instanceGridOptions({
		rowTemplate		: NG_CELL.getRowTemplate({ngDblclick:"lfn_row_onDblClick"}),
		customStateId	: "/yam/cmmn/popup/USER_POP/mstGrid",
		columnDefs		:
			[
				{displayName:'사용자ID',		field:'USER_ID',	width:'100',	type:'string',	cellClass:'align_lft'},
				{displayName:'사용자명',		field:'USER_NM',	width:'*',		type:'string',	cellClass:'align_lft'},
				// {displayName:'직책',			field:'POSITION',		width:'100',	type:'string',	cellClass:'align_lft'},
				// {displayName:'부서',			field:'DEPT_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
				// {displayName:'회사명',			field:'COMPANY_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
                {displayName:'구분',	        field:'MEM_GB_NM',	width:'150',	type:'string',	cellClass:'align_cen'},
                {displayName:'유형',			field:'MEM_TY_NM',	width:'150',	type:'string',	cellClass:'align_lft'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "사용자목록");
    
    //grid row double click
    $scope.lfn_row_onDblClick = (name, entity, grid) => {
		$scope.lfn_send_selection($scope.ds_conf.POPUP_OPTIONS.noclose);
    }//end-lfn_row_onDblClick
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

});//end-app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
