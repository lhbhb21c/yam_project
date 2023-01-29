/**
 * 파일명	: USER_ENV_MNG.js
 * 설명	: 사용자설정
 *
 * 수정일			수정자		수정내용
 * 2021.11.05	이경수		최초작성
 */
//angular module instance
var app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", function ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};
	//code dataset
	$scope.ds_code	= {
		USER_TYPE	: [],	//사용자유형
		USER_GUBUN	: [],	//사용자구분
		USE_YN		: []	//사용여부
	};
	//조회조건 dataset
	$scope.ds_cond	= {};
	//마스터 dataset
	$scope.ds_mst	= {};

	//초기화
	$scope.load = function (conf) {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		$scope.ds_conf.paramSet.CMD	= $scope.ds_conf.paramSet.CMD||"REG";

		//공통코드
		$scope.ds_code.USER_TYPE	= XUTL.getCodeFactory().USER_TYPE;		//사용자유형
		$scope.ds_code.USER_GUBUN	= XUTL.getCodeFactory().USER_GUBUN;	//사용자구분
		$scope.ds_code.USE_YN		= XUTL.getCodeFactory().USE_YN;		//사용여부

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$scope.lfn_search();
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = function (name) {
		$scope.mstGrid.data = $scope.mstGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.ds_mst);
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
		if (!$scope.lfn_btn_show(name)){
			return true;
		}

		if (name === "SEARCH") {
			return false;
		}
		
		if (name === "SAVE" &&  XUTL.findRows($scope.mstGrid.gridApi.selection.getSelectedRows(), "ROW_CRUD", ["U"]).length === 0) {
			return true;
		}
		
		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = function(name) {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/bs/USER_ENV_MNG");

		} else if (name === "SEARCH") {
			$scope.lfn_search();
			
		} else if (XUTL.isIn(name, "SAVE")) {	//저장
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
		}

	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = function (name) {
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = function (name) {
		if (name.indexOf("ds_mst.") === 0) {
			
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			
			//수정된 행 선택
			if(XUTL.findRows($scope.mstGrid.data, "USER_ID", [$scope.ds_mst.USER_ID]).length > 0) {
				NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "USER_ID", [$scope.ds_mst.USER_ID]));
			}
			
//			if (name === "ds_mst.USER_TYPE") {
//				var str_USER_TYPE = '';
//	        	
//				for(var i=0; i<$scope.ds_mst.USER_TYPE.length; i++) {
//					if($scope.ds_mst.USER_TYPE[i] != null) {
//						for(var j=0; j<$scope.ds_code.USER_TYPE.length; j++) {
//							if($scope.ds_code.USER_TYPE[j].CODE_CD == $scope.ds_mst.USER_TYPE[i]) {
//								
//								var strComma = '';
//								if(str_USER_TYPE != '') {
//									strComma = ',';
//								}
//								str_USER_TYPE += strComma + $scope.ds_mst.USER_TYPE[i];
//							}
//						}
//					} 
//				}
//				
//				$scope.ds_mst.USER_TYPE = str_USER_TYPE;
//			}
		}
	}//end-lfn_input_onChange

	//입력필드 ng-enter 처리
	$scope.lfn_input_onEnter = function (name) {
	}//end-lfn_input_onEnter
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
	$scope.lfn_search = function () {
		$scope.lfn_dataset_init("MST")

		var param = {
			querySet	:
				[
				 {queryId: "yam.bs.USER_ENV_MNG.selMstList",	queryType:"selList",		dataName:"mstGrid.data",			param:$scope.ds_cond}
				]
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param 
		}).then(function (response) {
			$.each(response.success, function (name, data) {
				XUTL.setWithPath($scope, name, data);
			});

		}).finally(function (data) {
			$timeout(function () {
				blockUI.stop();
			});
		});
	}//end-lfn_search

	//검증
	$scope.lfn_validate = function (name) {
		if (name === "SAVE") {
			//그리드 체크
    		if ( XUTL.findRows($scope.mstGrid.gridApi.selection.getSelectedRows(), "ROW_CRUD", ["U"]).length == 0 ) {
    			alert("저장할 내용이 없습니다.");
    			return false;
    		} else if (!NG_GRD.validateGridData($scope.mstGrid.gridApi).isValid) {
    			return false;
    		}
		} else {
			alert("unknown cmd:"+name)
			return false;
		}

		return true;
	}//end-lfn_validate

	//실행
	$scope.lfn_run = function (name) {
		var confirmMsg = "저장 하시겠습니까?";
		var successMsg = "정상적으로 처리완료 되었습니다.";
		
		if (!confirm(confirmMsg)) {
			return;
		}

		var rows = XUTL.findRows($scope.mstGrid.gridApi.selection.getSelectedRows(), "ROW_CRUD", ["C", "U"])
		
		$.each(rows, function (x, data) {
			data.USER_TYPE = data.USER_TYPE.join();
		});
		
		var xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("list", rows);
		
		var param = 
			{
				queryId	: "yam.bs.USER_ENV_MNG.save",
				CMD		: name,
				XML_TEXT: xmlDoc.toXmlString()
			};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/sp.do",
			data: param 
		}).then(function (response) {
			alert(successMsg);
			$timeout(function () {
				$scope.ds_cond.MEM_ID = response.RS_MESSAGE;
				$scope.lfn_search();
			});

		}).finally(function (data) {
			$timeout(function () {
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
	//문자열
    var inputCell = NG_CELL.getEditCell({
    	permanent	: true,
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange",
    	attributes	: ["kr-cell"]
    });

	//숫자(포맷)
    var numfCell = NG_CELL.getNumFormatCell({
    	permanent		: true,
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange",
    	selectOnFocus	: true,
    	digit			: 0,
    	sign			: true
    });

    //사용자유형 콤보
    var USER_TYPE_ComboCellTemplate = NG_CELL.getComboCell("ds_code.USER_TYPE", {
    	permanent	: true,
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange"
    });
    
    
    //사용자구분 콤보
    var USER_GUBUN_ComboCellTemplate = NG_CELL.getComboCell("ds_code.USER_GUBUN", {
    	permanent	: true,
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange"
    });
    
    //사용여부 콤보
    var USE_YN_ComboCellTemplate = NG_CELL.getComboCell("ds_code.USE_YN", {
    	permanent	: true,
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange"
    });

    //sub Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering	: false,
		enableGridMenu	: false,
		multiSelect		: true,
		onRegisterApi	:
			function (gridApi) {
				gridApi.selection.on.rowSelectionChanged($scope, function(rows) {
		    		// 선택데이터 바인딩
		    		$scope.ds_mst = rows.entity; // gridApi.selection.getSelectedRows();
		    		
		    		if($scope.ds_mst.USER_TYPE instanceof Array == false && $scope.ds_mst.USER_TYPE != undefined && $scope.ds_mst.USER_TYPE.length > 0) {
						$scope.ds_mst.USER_TYPE = $scope.ds_mst.USER_TYPE.split(','); 
					}
		    	});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
			 {displayName:'사용자ID',		field:'USER_ID',		width:'150',	type:'string',	cellClass:'align_lft'},
			 {displayName:'사용자명',		field:'USER_NM',		width:'*',		type:'string',	cellClass:'align_cen'},
			 {displayName:'사용자구분',	field:'USER_GUBUN',		width:'100',	type:'string',	cellClass:'align_cen',
				 cellFilter:'codeName:grid.appScope.ds_code.USER_GUBUN',
				 cellTemplate:USER_GUBUN_ComboCellTemplate
			 },
			 {displayName:'사용여부',		field:'USE_YN',			width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'등록일',		field:'REG_DTTM',		width:'100',	type:'string',	cellClass:'align_cen'}
			]
	});

	//row click event
	$scope.lfn_row_onClick = function (name, entity, grid) {
		//행추가 가능할 경우 입력필드외 클릭시 toggleRowSelection
//		grid.api.selection.toggleRowSelection(entity);
	}//end-lfn_row_onClick

	//cell ng-disabled
	$scope.lfn_cell_disabled = function (name, entity, grid) {
		return true;
	}//end-lfn_cell_disabled

	//cell click event
    $scope.lfn_cell_onClick = function (name, entity, grid) {
    }//end-lfn_cell_onClick
    
	//data change event
	$scope.lfn_cell_onChange = function (name, entity, grid) {
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

});// control end
