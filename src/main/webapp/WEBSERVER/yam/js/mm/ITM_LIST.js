/**
파일명	: ITM_LIST.xml
설명	: 품목 조회
수정일		 	수정자		수정내용
2021.11.03	정래훈		최초작성
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
		USE_YN		: [],	//사용구분
		ITM_GB		: [],	//품목구분
		ITM_GRP		: []	//품목그룹
	}
	//조회 조건
	$scope.ds_cond	= {
		ITM_GBS		: [],	//품목구분
		ITM_GRPS	: []	//품목그룹
	};
	//마스터
	$scope.ds_mst	= {};
	
	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
			
		//공통코드
		$scope.ds_code.USE_YN		= XUTL.getCodeFactory().USE_YN;	 //사용구분
		$scope.ds_code.ITM_GB		= XUTL.getCodeFactory().ITM_GB;	 //품목구분
		$scope.ds_code.ITM_GRP		= XUTL.getCodeFactory().ITM_GRP;	 //품목그룹
			
		//데이터 초기화
		$scope.lfn_dataset_init();
	}//end-load

    //데이터 초기화
    $scope.lfn_dataset_init = (name) => {
    	$scope.mstGrid.data = $scope.mstGrid.data||[]
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.ITM_GBS, XUTL.getValueMatrix($scope.ds_code.ITM_GB, "CODE_CD")[0]);	//품목구분목록
 			XUTL.addRows($scope.ds_cond.ITM_GRPS, XUTL.getValueMatrix($scope.ds_code.ITM_GRP, "CODE_CD")[0]);	//품목그룹목록
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
    		top.MDI.closeTab("/yam/mm/ITM_LIST");
    		
    	} else if (name === "SEARCH") {
           	$scope.lfn_search();
    	} 
    	
    }//end-lfn_btn_onClick
    
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = (name) => {
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
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
    //조회
    $scope.lfn_search = () => {
    	$scope.lfn_dataset_init("MST")
    	
    	const param = {
    		querySet	:
    			[
    			 {queryId: "yam.mm.ITM_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
    //마스터 Grid Options
    $scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/mm/ITM_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'품목코드',		field:'ITM_CD',			width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목명',			field:'ITM_NM',		 	width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'구분',			field:'ITM_GB_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
				{displayName:'단위',			field:'ITM_UN_NM',		width:'70',		type:'string',	cellClass:'align_cen'},
				{displayName:'그룹',			field:'ITM_GRP_NM',		width:'90',		type:'string',	cellClass:'align_cen'},
				{displayName:'중량',			field:'ITM_WT',			width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'용량',			field:'ITM_VOL',		width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'안전재고',		field:'SAF_STOCK_QTY',	width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'유통기한',		field:'EXPRDY',			width:'80',		type:'string',	cellClass:'align_rgt'},
				{displayName:'공정',			field:'PROC_CD_NM',		width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'비고',			field:'REMARKS',		width:'200',	type:'string',	cellClass:'align_lft'},
				{displayName:'MES',			field:'MES_YN',			width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate: NG_CELL.getCheckboxRenderer()},
				{displayName:'사용',			field:'USE_YN',			width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate: NG_CELL.getCheckboxRenderer()}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "품목목록");
    
    //row click event
    $scope.lfn_row_onClick = (name, entity, grid) => {
    }//end-lfn_row_onClick
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

}); // control end
