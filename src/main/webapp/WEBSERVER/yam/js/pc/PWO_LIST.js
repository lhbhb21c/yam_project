/**
 * 파일명	: PWO_LIST.js
 * 설명	: 작업지시조회
 *
 * 수정일			수정자		수정내용
 * 2021.11.04	염국선		최초작성
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
		PWO_GB	: [],	//작업지시구분
		PWO_ST	: []	//작업지시상태
	}
	//조회 조건
	$scope.ds_cond	= {
		PWO_GBS	: [],	//작업지시구분
		PWO_STS	: [],	//작업지시상태
	};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.PWO_GB	= XUTL.getCodeFactory().PWO_GB;	//작업지시구분
		$scope.ds_code.PWO_ST	= XUTL.getCodeFactory().PWO_ST;	//작업지시상태
						
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});
		
		//작업지시정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_PWO", "/yam/pc/PWO_LIST", (msg) => {
	    	$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());
	    });
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.PWO_GBS, XUTL.getValueMatrix($scope.ds_code.PWO_GB, "CODE_CD")[0]);	//작업지시구분
 			XUTL.addRows($scope.ds_cond.PWO_STS, XUTL.getValueMatrix($scope.ds_code.PWO_ST, "CODE_CD")[0]);	//작업지시상태
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
			top.MDI.closeTab("/yam/pc/PWO_LIST");

		} else if (name === "SEARCH") {
			$scope.lfn_search();

		} else if (name === "REG") {
			_YAM.openMdiTab("PWO_REG");
			
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

		const param = {
			querySet	:
				[
				 {queryId: "yam.pc.PWO_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "PWO_NO", XUTL.getValueMatrix(sels, "PWO_NO")[0]));
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
	//생산지시 상태컬러
	let  pwoStColorBox = NG_CELL.getColorRenderer({
		map			: _YAM.getColorMap("PWO_ST"),
		colorField	: "PWO_ST",
		labelVisible: true
	});

	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({toggleSelection:true}),
		customStateId	: "/yam/pc/PWO_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'구분',		field:'PWO_GB_NM',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'지시일',		field:'PWO_DY',				width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'차수',		field:'PROD_TM_NM',			width:'50',		type:'string',	cellClass:'align_cen'},
				{displayName:'지시번호',	field:'PWO_NO',				width:'120',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				},
			 	{displayName:'상태',		field:'PWO_ST_NM',			width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:pwoStColorBox},
			 	{displayName:'품목코드',	field:'PWO_ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품명',		field:'PWO_ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'구분',		field:'PWO_ITM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'단위',		field:'PWO_ITM_UN_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'창고',		field:'PWO_WHOUT_WH_CD_NM',	width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'지시수량',	field:'PWO_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'생산수량',	field:'PWP_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'생산번호',	field:'PWP_NO',				width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'emptyLabel:"등록"',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
			 	},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "작업지시목록");

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			//작업지시번호 클릭시 등록화면으로 이동
			if (name === "PWO_NO") {
				_YAM.openMdiTab("PWO_REG", entity);
			} else if (name === "PWP_NO") {
				_YAM.openMdiTab("PWP_REG", entity);
			}
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
