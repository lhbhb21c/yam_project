/**
 * 파일명	: DO_LIST.js
 * 설명		: 출하지시조회
 *
 * 수정일			수정자		수정내용
 * 2022.04.20		이진호		최초작성
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
		DO_GB	: [],	//출하지시구분
		DO_ST	: []	//출하지시상태
	}
	//조회 조건
	$scope.ds_cond	= {
		DO_GBS	: [],	//출하지시구분
		DO_STS	: [],	//출하지시상태
	};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();

		//공통코드
		$scope.ds_code.DO_GB	= XUTL.getCodeFactory().DO_GB;	//출하지시구분
		$scope.ds_code.DO_ST	= XUTL.getCodeFactory().DO_ST;	//출하지시상태

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});

		//출하지시정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_DO", "/yam/sm/DO_LIST", (msg) => {
			$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());
		});
		XUTL.listenTopMessage("CHANGE_WHOUT", "/yam/sm/DO_LIST", (msg) => {
			$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());
		});

	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.DO_GBS, XUTL.getValueMatrix($scope.ds_code.DO_GB, "CODE_CD")[0]);	//출하지시구분
 			XUTL.addRows($scope.ds_cond.DO_STS, XUTL.getValueMatrix($scope.ds_code.DO_ST, "CODE_CD")[0]);	//출하지시상태
			$scope.ds_cond.DY_FR	= moment().add(-1, 'months').format('YYYY-MM-DD');		//출하지시시작일 = 현재일 - 1달
			$scope.ds_cond.DY_TO	= moment().format('YYYY-MM-DD');						//출하지시종료일 = 현재일
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
			top.MDI.closeTab("/yam/sm/DO_LIST");

		} else if (name === "SEARCH") {
			$scope.lfn_search();

		} else if (name === "REG") {
			_YAM.openMdiTab("DO_MNG");

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
				 {queryId: "yam.sm.DO_LIST.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "DO_ID", XUTL.getValueMatrix(sels, "DO_ID")[0]));
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
			"40" : "navy",		//출고
		},
		colorField	: "DO_ST",
		labelVisible: true
	});


	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({toggleSelection:true}),
		customStateId	: "/yam/sm/DO_LIST/mstGrid",
		columnDefs		:
			[
				{displayName:'출하지시번호',	field:'DO_NO',		width:'150',	type:'string',	cellClass:'align_cen', cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})},
                {displayName:'상태',			field:'DO_ST_NM',	width:'130',	type:'string',	cellClass:'align_cen', cellTemplate: stColorBox},
                {displayName:'구분',			field:'DO_GB_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'출하지시일자',	field:'DO_DY',		width:'150',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'파트너',		field:'PARTNR_NM',	width:'200',	type:'string',	cellClass:'align_cen',},
			 	{displayName:'출고창고',		field:'WH_NM',	    width:'150',	type:'string',	cellClass:'align_lft'},
				{displayName:'비고',			field:'DO_REMARKS',	width:'*',		type:'string',	cellClass:'align_lft'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "출하지시목록");

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			//출하지시번호 클릭시 등록화면으로 이동
			if (name === "DO_NO") {
				_YAM.openMdiTab("DO_MNG", entity);
			}
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
