/**
 * 파일명	: CMMN_CD_MNG.js
 * 설명	: 공통코드관리
 *
 * 수정일			수정자		수정내용
 * 2021.12.20	WEVE	최초작성
 */
//angular module instance
let app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};
	//code set
	$scope.ds_code	= {
			SECTR_ID	: [],	//섹터목록
			CD_TY		: [
				{CODE_CD : "10", CODE_NM : "일반공통"},
				{CODE_CD : "90", CODE_NM : "시스템"}
			]
	}
	//query condition
	$scope.ds_cond	= {};
	
	//코드에디터 1/2/3레벨 데이터
	$scope.ds_mst1	= {};
	$scope.ds_mst2	= {};
	$scope.ds_mst3	= {};


	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf					= conf||{};
		$scope.ds_conf.paramSet 		= XUTL.getRequestParamSet();
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base()
		.then(() => {
			$scope.lfn_search1();
		});
		//조회
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mst1Grid.data = $scope.mst1Grid.data||[];
		$scope.mst2Grid.data = $scope.mst2Grid.data||[];
		$scope.mst3Grid.data = $scope.mst3Grid.data||[];
		
		if (!name || name === "mst1Grid") {
			$scope.lfn_dataset_init("mst2Grid");
			$scope.ds_mst1 = {};
			XUTL.empty($scope.mst1Grid.data);

		} else if (name === "mst2Grid") {
			$scope.lfn_dataset_init("mst3Grid");
			$scope.ds_mst2 = {};
			XUTL.empty($scope.mst2Grid.data);
			
		} else if (name === "mst3Grid") {
			$scope.ds_mst3 = {};
			XUTL.empty($scope.mst3Grid.data);
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
		if (!$scope.lfn_btn_show(name)){
			return true;
		}

		//일반유저의 경우 본인섹터 코드만 조정
		if (!BS_UTL.isSu() && $scope.ds_cond.SECTR_ID !== SS_USER_INFO.SECTR_ID) {
			return true;
		}
		
		if (name === "ds_mst1.NEW") {
		} else if (name === "ds_mst2.NEW") {
			return !XUTL.isIn($scope.ds_mst1.ROW_CRUD, "R", "U");
		} else if (name === "ds_mst3.NEW") {
			return !XUTL.isIn($scope.ds_mst2.ROW_CRUD, "R", "U");
		} else if (name === "ds_mst1.SAVE") {
			return (!$scope.ds_mst1.ROW_CRUD || $scope.ds_mst1.ORIGNL_CD_TY === "90");
		} else if (name === "ds_mst2.SAVE") {
			return (!$scope.ds_mst2.ROW_CRUD || ($scope.ds_mst2.ROW_CRUD !== "C" && $scope.ds_mst1.ORIGNL_CD_TY === "90"))
		} else if (name === "ds_mst3.SAVE") {
			return (!$scope.ds_mst3.ROW_CRUD || ($scope.ds_mst3.ROW_CRUD !== "C" && $scope.ds_mst1.ORIGNL_CD_TY === "90"))
		} else if (name === "ds_mst1.DEL") {
			return ($scope.mst1Grid.gridApi.selection.getSelectedRows().length === 0 || $scope.ds_mst1.ORIGNL_CD_TY === "90");
		} else if (name === "ds_mst2.DEL") {
			return ($scope.mst2Grid.gridApi.selection.getSelectedRows().length === 0 || ($scope.ds_mst2.ROW_CRUD !== "C" && $scope.ds_mst1.ORIGNL_CD_TY === "90"));
		} else if (name === "ds_mst3.DEL") {
			return ($scope.mst3Grid.gridApi.selection.getSelectedRows().length === 0 || ($scope.ds_mst3.ROW_CRUD !== "C" && $scope.ds_mst1.ORIGNL_CD_TY === "90"));
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/we_std/base/CODE_MNG");

		} else if (name === "SEARCH") {	//조회
			$scope.lfn_search1($scope.mst1Grid.gridApi.selection.getSelectedRows());
			
		} else if (name === "ds_mst1.NEW") {
			$scope.mst1Grid.data.unshift({ROW_CRUD:"C", CD_TY:"10", CD_SN:0, CD_LVL:1, USE_YN:"Y", SECTR_ID:(BS_UTL.isSu()?$scope.ds_cond.SECTR_ID:SS_USER_INFO.SECTR_ID)});
			$scope.lfn_dataset_init("mst2Grid");
			$timeout(() => {
				$scope.mst1Grid.gridApi.selection.selectRow($scope.mst1Grid.data[0]);
			});            		

		} else if (name === "ds_mst2.NEW") {
			$scope.mst2Grid.data.unshift({ROW_CRUD:"C", CD_TY:$scope.ds_mst1.ORIGNL_CD_TY||$scope.ds_mst1.CD_TY, CD_SN:0, CD_LVL:2, PARENT_CD_ID:$scope.ds_mst1.CD_ID, USE_YN:"Y"});
			$scope.lfn_dataset_init("mst3Grid");
			$timeout(() => {
				$scope.mst2Grid.gridApi.selection.selectRow($scope.mst2Grid.data[0]);
			});            		

		} else if (name === "ds_mst3.NEW") {
			$scope.mst3Grid.data.unshift({ROW_CRUD:"C", CD_TY:$scope.ds_mst1.ORIGNL_CD_TY||$scope.ds_mst1.CD_TY, CD_SN:0, CD_LVL:3, PARENT_CD_ID:$scope.ds_mst2.CD_ID, USE_YN:"Y"});
			$timeout(() => {
				$scope.mst3Grid.gridApi.selection.selectRow($scope.mst3Grid.data[0]);
			});            		

			
		} else if (XUTL.isIn(name, "ds_mst1.DEL", "ds_mst1.SAVE", "ds_mst2.DEL", "ds_mst2.SAVE", "ds_mst3.DEL", "ds_mst3.SAVE")) {
			if (name === "ds_mst1.DEL" && $scope.ds_mst1.ROW_CRUD === "C") {
				XUTL.removeRows($scope.mst1Grid.data, $scope.ds_mst1);
				$scope.ds_mst1 = {};
				$scope.lfn_dataset_init("mst2Grid");
								
			} else if (name === "ds_mst2.DEL" && $scope.ds_mst2.ROW_CRUD === "C") {
				XUTL.removeRows($scope.mst2Grid.data, $scope.ds_mst2);
				$scope.ds_mst2 = {};
				$scope.lfn_dataset_init("mst3Grid");
				
			} else  if (name === "ds_mst3.DEL" && $scope.ds_mst3.ROW_CRUD === "C") {
				XUTL.removeRows($scope.mst3Grid.data, $scope.ds_mst3);
				$scope.ds_mst3 = {};
				
			} else {
				if ($scope.lfn_validate(name)) {
					$scope.lfn_run(name)
				}
			}
			
		} else {
			alert("unknown commnad:"+name);
		}

	}//end-lfn_btn_onClick
	
	//입력관련 ng-show 처리
	$scope.lfn_input_show = (name) => {
		if (name === "ds_cond.SECTR") {
//			return BS_UTL.isSu();
		}
		return true;		
	}//end-lfn_input_show
	
	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		if (name.indexOf("ds_mst1.") === 0) {
			if ($scope.lfn_btn_disabled("ds_mst1.SAVE")) {
				return true;
			}
			
			if (name==="ds_mst1.CD_TY") {
				return !($scope.ds_mst1.ROW_CRUD==="C" || $scope.ds_mst1.ORIGNL_CD_TY!=="90")
			}
			
		} else if (name.indexOf("ds_mst2.") === 0) {
			if ($scope.lfn_btn_disabled("ds_mst2.SAVE")) {
				return true;
			}
			
		} else if (name.indexOf("ds_mst3.") === 0) {
			if ($scope.lfn_btn_disabled("ds_mst3.SAVE")) {
				return true;
			}
			
		}
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		if (name==="ds_cond.SECTR_ID") {
			$scope.lfn_search1();
		} else if (name.indexOf("ds_mst1.") === 0) {
			if ($scope.ds_mst1.ROW_CRUD === "R") {
				$scope.ds_mst1.ROW_CRUD = "U";
			}
			
		} else if (name.indexOf("ds_mst2.") === 0) {
			if ($scope.ds_mst2.ROW_CRUD === "R") {
				$scope.ds_mst2.ROW_CRUD = "U";
			}
			
		} else if (name.indexOf("ds_mst3.") === 0) {
			if ($scope.ds_mst3.ROW_CRUD === "R") {
				$scope.ds_mst3.ROW_CRUD = "U";
			}
			
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
		return new Promise((resolve) => {

			let param = {queryId: "we.std.base.CODE_MNG.selSectrComboList", queryType:"selList", param:{
				SECTR_ID:SS_USER_INFO.SECTR_ID
			}};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/query.do",
				data: param 
			}).then((response) => {
				$scope.ds_code.SECTR_ID	= response.success;
			}).finally((data) => {
				$timeout(() => {
					blockUI.stop();
					resolve();
				});
			});
		});
	}//end-lfn_load_base

	//조회(1레벨)
	$scope.lfn_search1 = (sels) => {
		$scope.lfn_dataset_init("mst1Grid");
		
		let param = {queryId: "we.std.base.CODE_MNG.selMstList", queryType:"selList", param:{
			CD_LVL:1,
//			SECTR_ID:(BS_UTL.isSu()?$scope.ds_cond.SECTR_ID:SS_USER_INFO.SECTR_ID)
			SECTR_ID:$scope.ds_cond.SECTR_ID
		}};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.mst1Grid.data = response.success;

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mst1Grid.gridApi, XUTL.findRows($scope.mst1Grid.data, "CD_KEY", XUTL.getValueMatrix(sels, "CD_KEY")[0]));
				});
			} else {
				$timeout(() => {
					NG_GRD.selectRow($scope.mst1Grid.gridApi, "first");
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search1
	
	//조회(2레벨)
	$scope.lfn_search2 = (sels) => {
		$scope.lfn_dataset_init("mst2Grid");
		
		let param = {queryId: "we.std.base.CODE_MNG.selMstList", queryType:"selList", param:{CD_LVL:2, PARENT_CD_ID:$scope.ds_mst1.CD_ID}};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.mst2Grid.data = response.success;

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mst2Grid.gridApi, XUTL.findRows($scope.mst2Grid.data, "CD_KEY", XUTL.getValueMatrix(sels, "CD_KEY")[0]));
				});
			} else {
				$timeout(() => {
					NG_GRD.selectRow($scope.mst2Grid.gridApi, "first");
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search2
	
	//조회(3레벨)
	$scope.lfn_search3 = (sels) => {
		$scope.lfn_dataset_init("mst3Grid");
		
		let param = {queryId: "we.std.base.CODE_MNG.selMstList", queryType:"selList", param:{CD_LVL:3, PARENT_CD_ID:$scope.ds_mst2.CD_ID}};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.mst3Grid.data = response.success;

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mst3Grid.gridApi, XUTL.findRows($scope.mst3Grid.data, "CD_KEY", XUTL.getValueMatrix(sels, "CD_KEY")[0]));
				});
			} else {
				$timeout(() => {
					NG_GRD.selectRow($scope.mst3Grid.gridApi, "first");
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search3
	
	//검증
	$scope.lfn_validate = (name) => {
		if (name === "ds_mst1.SAVE") {
			if ($scope.ds_mst1.ROW_CRUD === "R") {
				alert("수정 한 내용이 없습니다.");
				return false;
			} else if (!XUTL.validateInput($("#ds_mst1")).isValid) {
				return false;
			}

		} else if (name === "ds_mst2.SAVE") {
			if ($scope.ds_mst2.ROW_CRUD === "R") {
				alert("수정 한 내용이 없습니다.");
				return false;
			} else if (!XUTL.validateInput($("#ds_mst2")).isValid) {
				return false;
			} else if ($scope.ds_mst2.ROW_CRUD !== "C" && $scope.ds_mst1.ORIGNL_CD_TY === "90") {
				alert("시스템유형의 코드는 수정할 수 없습니다.");
				return false;
			}

		} else if (name === "ds_mst3.SAVE") {
			if ($scope.ds_mst3.ROW_CRUD === "R") {
				alert("수정 한 내용이 없습니다.");
				return false;
			} else if (!XUTL.validateInput($("#ds_mst3")).isValid){
				return false;
			} else if ($scope.ds_mst3.ROW_CRUD !== "C" && $scope.ds_mst1.ORIGNL_CD_TY === "90") {
				alert("시스템유형의 코드는 수정할 수 없습니다.");
				return false;
			}

		} else if (XUTL.isIn(name, "ds_mst1.DEL", "ds_mst2.DEL", "ds_mst3.DEL")) {
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
		if (XUTL.isIn(name, "ds_mst1.DEL", "ds_mst2.DEL", "ds_mst3.DEL")) {
			confirmMsg = "삭제처리 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}
				
		let runConfig = {param:{}, success:null};
		if (name === "ds_mst1.SAVE") {
			if ($scope.ds_mst1.ROW_CRUD === "C") {
				runConfig.param = {queryId:"we.std.base.CODE_MNG.insMst", queryType:"ins", param:$scope.ds_mst1};
			} else {
				runConfig.param = {queryId:"we.std.base.CODE_MNG.updMst", queryType:"upd", param:$scope.ds_mst1};
			}
			runConfig.success = (response) => {
				$scope.lfn_search1([runConfig.param.param]);
			};

		} else if (name === "ds_mst2.SAVE") {
			if ($scope.ds_mst2.ROW_CRUD === "C") {
				runConfig.param = {queryId:"we.std.base.CODE_MNG.insMst", queryType:"ins", param:$scope.ds_mst2};
			} else {
				runConfig.param = {queryId:"we.std.base.CODE_MNG.updMst", queryType:"upd", param:$scope.ds_mst2};
			}
			runConfig.success = (response) => {
				$scope.lfn_search2([runConfig.param.param]);
			};

		} else if (name === "ds_mst3.SAVE") {
			if ($scope.ds_mst3.ROW_CRUD === "C") {
				runConfig.param = {queryId:"we.std.base.CODE_MNG.insMst", queryType:"ins", param:$scope.ds_mst3};
			} else {
				runConfig.param = {queryId:"we.std.base.CODE_MNG.updMst", queryType:"upd", param:$scope.ds_mst3};
			}
			runConfig.success = (response) => {
				$scope.lfn_search3([runConfig.param.param]);
			};

		} else if (name === "ds_mst1.DEL") {
			runConfig.param = {queryId:"we.std.base.CODE_MNG.delMst", queryType:"del", param:$scope.ds_mst1};
			runConfig.success = (response) => {
				$scope.lfn_search1();
			};
			
		} else if (name === "ds_mst2.DEL") {
			runConfig.param = {queryId:"we.std.base.CODE_MNG.delMst", queryType:"del", param:$scope.ds_mst2};
			runConfig.success = (response) => {
				$scope.lfn_search2();
			};
			
		} else if (name === "ds_mst3.DEL") {
			runConfig.param = {queryId:"we.std.base.CODE_MNG.delMst", queryType:"del", param:$scope.ds_mst3};
			runConfig.success = (response) => {
				$scope.lfn_search3();
			};
			
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: runConfig.param 
		}).then((response) => {
			alert(successMsg+"("+response.success+"건)");
			runConfig.success(response);

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
	//레벨1코드 Grid Options
	$scope.mst1Grid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		noUnselect		: true,
		enableGridMenu	: false,
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.ds_mst1 = row.entity;
					$timeout(() => {
						$scope.lfn_search2();
					});
				});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
				{displayName:"공통코드",		field:"CD_KEY",		width:"120",	type:"string",	cellClass:"align_lft"},
				{displayName:"공통코드명",	field:"CD_NM",		width:"*",		type:"string",	cellClass:"align_lft"},
				{displayName:"순서",			field:"CD_SN",		width:"60",		type:"string",	cellClass:"align_cen"},
				{displayName:"사용",			field:"USE_YN",		width:"60",		type:"string",	cellClass:"align_cen"}
			]
	});

	//레벨2코드 Grid Options
	$scope.mst2Grid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		noUnselect		: true,
		enableGridMenu	: false,
		enableFiltering	: false,
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.ds_mst2 = row.entity;
					$timeout(() => {
						$scope.lfn_search3();
					});
				});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
				{displayName:"공통코드",		field:"CD_KEY",		width:"120",	type:"string",	cellClass:"align_lft"},
				{displayName:"공통코드명",	field:"CD_NM",		width:"*",		type:"string",	cellClass:"align_lft"},
				{displayName:"순서",			field:"CD_SN",		width:"60",		type:"string",	cellClass:"align_cen"},
				{displayName:"사용",			field:"USE_YN",		width:"60",		type:"string",	cellClass:"align_cen"}
			]
	});

	//레벨3코드 Grid Options
	$scope.mst3Grid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		noUnselect		: true,
		enableGridMenu	: false,
		enableFiltering	: false,
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.ds_mst3 = row.entity;
				});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
				{displayName:"공통코드",		field:"CD_KEY",		width:"120",	type:"string",	cellClass:"align_lft"},
				{displayName:"공통코드명",	field:"CD_NM",		width:"*",		type:"string",	cellClass:"align_lft"},
				{displayName:"순서",			field:"CD_SN",		width:"60",		type:"string",	cellClass:"align_cen"},
				{displayName:"사용",			field:"USE_YN",		width:"60",		type:"string",	cellClass:"align_cen"}
			]
	});

	
	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		grid.api.selection.selectRow(entity);
	}//end-lfn_row_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end