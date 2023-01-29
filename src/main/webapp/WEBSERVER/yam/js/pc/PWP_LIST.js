/**
 * 파일명	: PWP_LIST.js
 * 설명	: 작업실적조회
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
		PWO_GB	: []	//작업지시구분
	}
	//조회 조건
	$scope.ds_cond	= {
		PWO_GBS	: []	//작업지시구분
	};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.PWO_GB	= XUTL.getCodeFactory().PWO_GB;	//작업지시구분
						
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});
		
		//작업실적정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_PWP", "/yam/pc/PWP_LIST", () => {
	    	$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());
	    });
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.PWO_GBS, XUTL.getValueMatrix($scope.ds_code.PWO_GB, "CODE_CD")[0]);	//작업지시구분
			$scope.ds_cond.DY_FR		= moment().add(-1, 'months').format('YYYY-MM-DD');		//작업실적시작일 = 현재일 - 1달
			$scope.ds_cond.DY_TO		= moment().format('YYYY-MM-DD');						//작업실적종료일 = 현재일
			$scope.ds_cond.INC_CNC_YN	= "N";
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
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE") {
			top.MDI.closeTab("/yam/pc/PWP_LIST");

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
				 {queryId: "yam.pc.PWP_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "PWP_NO", XUTL.getValueMatrix(sels, "PWP_NO")[0]));
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
	let pwpStColorBox = NG_CELL.getColorRenderer({
		map			: {
						"10" : "white",		//임시저장
						"20" : "yellow",	//실적등록
						"30" : "green",		//생산완료
						"39" : "red",		//실적취소
					  },
		colorField	: "PWP_ST",
		labelVisible: true
	});

	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({toggleSelection:true}),
		customStateId	: "/yam/pc/PWP_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'구분',		field:'PWO_GB_NM',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'생산일',	field:'PWP_DY',				width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'생산번호',	field:'PWP_NO',				width:'100',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				},
			 	{displayName:'상태',		field:'PWP_ST_NM',			width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:pwpStColorBox},
			 	{displayName:'품목코드',	field:'PWP_ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'품명',		field:'PWP_ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 	{displayName:'구분',		field:'PWP_ITM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'단위',		field:'PWP_ITM_UN_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'생산창고',	field:'PWP_WHOUT_WH_CD_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'지시수량',	field:'PWO_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
			 	{displayName:'생산수량',	field:'PWP_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter: 'number',	exportType:"number"},
				{displayName:'지시일',	field:'PWO_DY',				width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'차수',		field:'PROD_TM_NM',			width:'50',		type:'string',	cellClass:'align_cen'},
				{displayName:'지시번호',	field:'PWO_NO',				width:'100',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				}
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "작업지시목록");

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			if (name === "PWO_NO") {	//작업지시번호 클릭시 등록화면으로 이동
				_YAM.openMdiTab("PWO_REG", entity);
			} else if (name === "PWP_NO") {	//작업실적번호 클릭시 등록화면으로 이동
				_YAM.openMdiTab("PWP_REG", entity);
			}
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
