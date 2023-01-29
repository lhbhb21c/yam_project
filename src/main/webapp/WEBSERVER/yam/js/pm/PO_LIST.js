/**
 * 파일명	: PO_LIST.js
 * 설명		: 구매발주조회
 *
 * 수정일			수정자		수정내용
 * 2022.04.11		이진호		최초작성
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
		PO_GB	: [],	//작업지시구분
		PO_ST	: []	//작업지시상태
	}
	//조회 조건
	$scope.ds_cond	= {
		PO_GBS	: [],	//작업지시구분
		PO_STS	: [],	//작업지시상태
	};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.PO_GB	= XUTL.getCodeFactory().PO_GB;	//작업지시구분
		$scope.ds_code.PO_ST	= XUTL.getCodeFactory().PO_ST;	//작업지시상태
						
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});
		
		//작업지시정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_PO", "/yam/pm/PO_LIST", (msg) => {
	    	$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());
	    });
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.PO_GBS, XUTL.getValueMatrix($scope.ds_code.PO_GB, "CODE_CD")[0]);	//작업지시구분
 			XUTL.addRows($scope.ds_cond.PO_STS, XUTL.getValueMatrix($scope.ds_code.PO_ST, "CODE_CD")[0]);	//작업지시상태
			$scope.ds_cond.DY_FR	= moment().add(-1, 'months').format('YYYY-MM-DD');		//작업지시시작일 = 현재일 - 1달
			$scope.ds_cond.DY_TO	= moment().format('YYYY-MM-DD');						//작업지시종료일 = 현재일
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
    	
    	if (name === "REPORT") {
    		return $scope.mstGrid.gridApi.selection.getSelectedRows().length === 0;
    	}
    	
		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE") {
			top.MDI.closeTab("/yam/pm/PO_LIST");

		} else if (name === "SEARCH") {
			$scope.lfn_search();

		} else if (name === "REG") {
			_YAM.openMdiTab("PO_MNG");
			
		} else if (name === "REPORT") {
			_YAM.reportPwo($scope.mstGrid.gridApi.selection.getSelectedRows());
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

		const PARAM = {
			querySet	:
				[
				 {queryId: "yam.pm.PO_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
				]
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: PARAM
		}).then((response) => {
			$.each(response.success, (name, data) => {
				XUTL.setWithPath($scope, name, data);
			});

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "PO_NO", XUTL.getValueMatrix(sels, "PO_NO")[0]));
				});
			}

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
	let stColorBox = NG_CELL.getColorRenderer({
		map			: {
			"10" : "white",		//임시저장
			"20" : "yellow",	//등록
			"30" : "green",		//확정
			"39" : "red",		//취소
			"50" : "navy",		//입고
		},
		colorField	: "PO_ST",
		labelVisible: true
	});


	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({toggleSelection:true}),
		customStateId	: "/yam/pc/PO_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'발주번호',		field:'PO_NO',			width:'120',	type:'string',	cellClass:'align_cen', cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})},
				{displayName:'상태',			field:'PO_ST_NM',		width:'80',		type:'string',	cellClass:'align_cen', cellTemplate: stColorBox},
				{displayName:'발주일자',		field:'PO_DY',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'납기일자',		field:'DUE_DY',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'납품일자',		field:'DOG_DY',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'담당자',		field:'PO_CP_NM',		width:'120',	type:'string',	cellClass:'align_cen',},
			 	{displayName:'파트너',		field:'PARTNR_NM',		width:'120',	type:'string',	cellClass:'align_cen',},
			 	{displayName:'입고창고',		field:'WHIN_WH_NM',	    width:'120',	type:'string',	cellClass:'align_lft'},
			 	{displayName:'통화',			field:'CUR_CD_NM',		width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'세금',			field:'TX_CD_NM',		width:'70',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'총 공급금액',	field:'TOT_PO_SPL_AM',	width:'110',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'총 부가세',	field:'TOT_PO_VAT',		width:'110',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
				{displayName:'총 발주금액',	field:'TOT_PO_SUM_AM',	width:'110',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
				{displayName:'비고',			field:'PO_BRIEFS',		width:'*',		type:'string',	cellClass:'align_cen'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "구매발주목록");

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			//작업지시번호 클릭시 등록화면으로 이동
			if (name === "PO_NO") {
				_YAM.openMdiTab("PO_MNG", entity);
			}
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
