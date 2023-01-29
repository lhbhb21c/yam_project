/**
 * 파일명	: SC_LIST.js
 * 설명		: 재고실사조회
 * 
 * 수정일		 	수정자		수정내용
 * 2021.11.02	zno		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {}
	//code set
	$scope.ds_code	= {
		WH_CD 		: [],	//창고코드
		SC_GB  		: [],	//실사구분
	}
	//조회 조건
	$scope.ds_cond	= {
		WH_CDS	    : [],	//창고코드목록
	};
	
	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.WH_CD	= XUTL.getCodeFactory().WH_CD;	//창고코드	
		$scope.ds_code.SC_GB	= XUTL.getCodeFactory().SC_GB;	//실사구분
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		
		//요청일자 넣기(디폴트 현재일)
		$scope.ds_cond.SC_DY_FR	= moment().add(-1, 'months').format('YYYY-MM-DD');		//요청시작일 = 현재일 - 1달
		$scope.ds_cond.SC_DY_TO	= moment().format('YYYY-MM-DD');						//요청종료일 = 현재일
		
		//유저 구분에 따라 조회조건 창고코드 disabled
		// if (!XUTL.isIn(SS_USER_INFO.USER_GUBUN,'10')) {
		// 	$scope.ds_cond.WH_CD = SS_USER_INFO.WH_CD;
		// }
		
		$scope.lfn_load_base();
	}	

    //데이터 초기화
    $scope.lfn_dataset_init = (name) => {
    	$scope.mstGrid.data = $scope.mstGrid.data||[];
    	$scope.subGrid.data = $scope.subGrid.data||[];
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.WH_CDS, XUTL.getValueMatrix($scope.ds_code.WH_CD, "CODE_CD")[0]);	//창고코드목록
    	}
    	if (!name || name === "MST") {
            XUTL.empty($scope.mstGrid.data);
        	$scope.lfn_dataset_init("SUB");
    	}
    	if (!name || name === "SUB") {
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
    $scope.lfn_btn_onClick = (name, arg1) => {
    	if (name === "CLOSE") {
    		top.MDI.closeTab("/yam/wm/SC_LIST");
    		
    	} else if (name === "SEARCH") {
			//요청일자 입력 여부 확인
			if (XUTL.isEmpty($scope.ds_cond.SC_DY_FR) || XUTL.isEmpty($scope.ds_cond.SC_DY_TO)){
				alert('조회하려는 실자일자를 입력해주세요.');
				return;
			}
			
           	$scope.lfn_search();
           	
    	} else if (name === "edit.CLOSE") {
    		$("#editModal").modal("hide");
        	
    	}
    	
    }//end-lfn_btn_onClick
    
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = (name) => {
		// if (name.indexOf("ds_cond.WH_CD") === 0) {
		// 	if (!XUTL.isIn(SS_USER_INFO.USER_GUBUN,'10')) {
		// 		return true;
		// 	}
		// }
		
    	return false;
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange = (name) => {
		if (name.indexOf("ds_cond.") === 0) {
			return;
		}
		
		//ds_mst 계열
		if ($scope.ds_mst.ROW_CRUD === "R") {
			$scope.ds_mst.ROW_CRUD = "U";
		}
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
    	$scope.lfn_dataset_init("MST")
    	
    	const param = {
    		querySet	:
    			[
    			 {queryId: "yam.wm.SC_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",		param:$scope.ds_cond}
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
					NG_GRD.selectRow($scope.mstApi, XUTL.findRows($scope.mstGrid.data, "SC_NO", XUTL.getValueMatrix(sels, "SC_NO")[0]));
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
    }//end-lfn_search
    
    //마스터 선택시 서브리스트 조회
    $scope.lfn_search_sub = (entity) => {
    	
    	$scope.lfn_dataset_init("SUB")
    	
    	const param = {
    		querySet	:
    			[
    			 	{queryId: "yam.wm.SC_LIST.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:{SC_ID:entity.SC_ID}}
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
    //마스터 Grid Options
    $scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	noUnselect		: true,
    	enableFiltering	: false,
    	// enableGridMenu	: false,
		customStateId	: "/yam/wm/SC_LIST/mstGrid",
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.lfn_search_sub(row.entity);
				});
			},
		columnDefs		:
			[
				{displayName:'구분',		field:'SC_GB_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'실사일',		field:'SC_DY',			width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'실사번호',	field:'SC_NO',			width:'200',	type:'string',	cellClass:'align_cen', cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"}) },
				{displayName:'실사상태',	field:'SC_ST_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'창고',		field:'WH_NM',			width:'250',	type:'string',	cellClass:'align_lft'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "재고실사목록");
    
    //디테일 Grid Options
    $scope.subGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	noUnselect		: true,
    	enableGridMenu	: true,
		customStateId	: "/yam/wm/SC_LIST/subGrid",
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
				{displayName:'품목코드',	field:'ITM_CD',			width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'품명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'단위',		field:'SC_UN',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'실사수량',	field:'SC_QTY',			width:'150',	type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'전산재고',	field:'STOCK_QTY',		width:'150',	type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'차이수량',	field:'DIFF_QTY',		width:'150',	type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'단가',		field:'SC_PRC',			width:'100',	type:'string',	cellClass:'align_rgt'},
				{displayName:'재고구분',	field:'SC_STOCK_GB_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			]
	});    
	NG_GRD.addExcelExportMenu($scope.subGrid, "재고실사 상세목록");

    //row click event
    $scope.lfn_row_onClick = (name, entity, grid) => {
    	if (grid.options === $scope.mstGrid || grid.options === $scope.subGrid) {
    		grid.api.selection.selectRow(entity);
    	}
    	
    }//end-lfn_row_onClick
    
    //cell disabled define
    $scope.lfn_cell_disabled = (name, entity, grid) => {
    	return false;
    }//end-lfn_cell_disabled    
    
	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		
		//출고번호가 클릭되면, 상세/수정 화면(WHOUT_REG)로 이동한다.
		if (name==="SC_NO") {

            let p_tabId 		= '/yam/wm/SC_REG';
            let p_tabName 		= '재고실사등록';
            let p_tabUrl 		= '/forward/yam/wm/SC_REG.do?CMD=UPD&SC_ID=' + entity.SC_ID;
            let lb_isRefresh 	= true; 											// 화면 새로고침

	        top.MDI.openTab ( p_tabId , p_tabName , p_tabUrl , lb_isRefresh ); // 화면
	        
		}
		
	}//end-lfn_cell_onClick 
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

}); // control end
