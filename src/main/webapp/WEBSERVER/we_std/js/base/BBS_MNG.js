/**
 * 파일명	: BBS_MNG.js
 * 설명	: 게시판관리
 *
 * 수정일			수정자		수정내용
 * 2022.03.18	염국선		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};
	//code set
	$scope.ds_code	= {
		BBS_GB			: [],	//게시판구분
		NOTI_SCOPE_GB	: [],	//게시범위구분
		//////////////////////////////////////////
		YN				: [{CODE_CD:"Y", CODE_NM:"허용"}, {CODE_CD:"N", CODE_NM:"불허"}]	//여부
	}
	//조회 조건
	$scope.ds_cond	= {};
	

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf					= conf||{};
		$scope.ds_conf.paramSet 		= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.BBS_GB			= XUTL.getCodeFactory().BBS_GB;			//게시판구분
		$scope.ds_code.NOTI_SCOPE_GB	= XUTL.getCodeFactory().NOTI_SCOPE_GB;	//게시범위구분
		
 		//콤보필터설정
 		NG_GRD.setSelectFilter($scope.mstGrid, "BBS_GB", $scope.ds_code.BBS_GB); 
 		NG_GRD.setSelectFilter($scope.mstGrid, "NOTI_SCOPE_GB", $scope.ds_code.NOTI_SCOPE_GB); 

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base().then(() => {
 			//조회
 			$timeout(() => {
 	 			$scope.lfn_search();
 			});
		});
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
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
		if (!$scope.lfn_btn_show(name)){
			return true;
		}

		if (XUTL.isIn(name, "SAVE", "DEL")) {
			return $scope.mstGrid.gridApi.selection.getSelectedRows().length === 0;
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/we_std/base/BBS_MNG");

		} else if (name === "SEARCH") {	//조회
			$scope.lfn_search();
			
		} else if (name === "NEW") {	//신규
			$scope.mstGrid.data.unshift($scope.lfn_instance_new_mst());
			$timeout(() => {
				$scope.mstGrid.gridApi.selection.selectRow($scope.mstGrid.data[0]);
			});
			
		} else if (name === "SAVE") {	//저장
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}

		} else if (name === "DEL") {	//삭제
			//삭제시 신규항목이면 그리드에서 제거
			const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			const sels_C = XUTL.findRows(sels, "ROW_CRUD", "C");
			XUTL.removeRows($scope.mstGrid.data, sels_C);
			if (sels.length > sels_C.length) {
				$timeout(() => {
					if ($scope.lfn_validate(name)) {
						$scope.lfn_run(name)
					}
				});
			}

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
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
		return new Promise((resolve) => {
			resolve();
		});
		
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = (sels) => {
		$scope.lfn_dataset_init("MST");

		const param = {queryId: "we.std.base.BBS_MNG.selMstList",	queryType:"selList",	param:$scope.ds_cond};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.mstGrid.data = response.success;

 			//row선택 설정
			if (sels) {
				$timeout(() => {
 					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "BBS_CD", XUTL.getValueMatrix(sels, "BBS_CD")[0]));
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search
	
	//검증
	$scope.lfn_validate = (name) => {
		if (name === "SAVE") {
			const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("저장 할 항목을 선택 하세요.");
				return false;
			} else if (!NG_GRD.validateGridData($scope.mstGrid.gridApi, {data:sels}).isValid) {
				return false;
			}

		} else if (name === "DEL") {
		} else {
			alert("unknown cmd:"+name)
			return false;
		}

		return true;
	}//end-lfn_validate

	//실행
	$scope.lfn_run = (name) => {
		let confirmMsg = "저장 하시겠습니까?";
		const successMsg = "정상적으로 처리완료 되었습니다.";
		if (name === "DEL") {
			confirmMsg = "삭제처리 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}
		
		const xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("list", $scope.mstGrid.gridApi.selection.getSelectedRows());
		const param = 
			{
				queryId	: "we.std.base.BBS_MNG.save",
				CMD		: name,
				XML_TEXT: xmlDoc.toXmlString()
			};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/sp.do",
			data: param 
		}).then((response) => {
			alert(successMsg);
			$timeout(() => {
				$scope.lfn_search();
			});

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
	//ROW_CRUD color box
	const rowCrudColorBox = NG_CELL.getColorRenderer({
		map			: {C:"white", R:"green", U:"yellow"},
		colorField	: "ROW_CRUD",
		labelVisible: false
	});
	//문자열
    const inputCell = NG_CELL.getEditCell({
    	permanent	: true,
    	ngIf		: "lfn_cell_show",
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange",
    	attributes	: ["kr-cell"]
    });
	//BBS구분 콤보
    const bbsGbCombo = NG_CELL.getComboCell("ds_code.BBS_GB", {
    	permanent	: true,
    	ngIf		: "lfn_cell_show",
   		ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange"
    });
	//게시범위구분 콤보
    const notiScopeGbCombo = NG_CELL.getComboCell("ds_code.NOTI_SCOPE_GB", {
    	permanent	: true,
    	ngIf		: "lfn_cell_show",
   		ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange"
    });
	//체크박스(Y/N)
	const chkCell = NG_CELL.getCheckboxCell({
    	permanent		: true,
    	ngIf			: "lfn_cell_show",
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange"
	});

	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		multiSelect		: true,
		customStateId	: "/we_std/base/BBS_MNG/mstGrid",
		columnDefs		:
			[
				{displayName:"상태",		field:"ROW_CRUD",		width:"50",		type:"string",	cellClass:"align_cen",
					enableFiltering	: false,
					cellTemplate	: rowCrudColorBox
				},
			 	{displayName:'BBS ID',	field:'BBS_ID',			width:'120',	type:'string',	cellClass:'align_cen'},
//  				{displayName:'소속',		field:'CO_CD',			width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
				{displayName:'BBS 코드',	field:'BBS_CD',			width:'120',	type:'string',	cellClass:'align_cen',
					cellTemplate: inputCell,
					validTypes	: "required"
 				},
				{displayName:'이름',		field:'BBS_NM',			width:'*',		type:'string',	cellClass:'align_lft',
					cellTemplate: inputCell,
					validTypes	: "required"
 				},
			 	{displayName:'BBS구분',	field:'BBS_GB',			width:'120',	type:'string',	cellClass:'align_cen',
					cellTemplate: bbsGbCombo,
					cellFilter	: "codeName:grid.appScope.ds_code.BBS_GB",
					validTypes	: "required"
				},
				{displayName:'범위구분',	field:'NOTI_SCOPE_GB',	width:'100',	type:'string',	cellClass:'align_cen',
					cellTemplate: notiScopeGbCombo,
 					cellFilter	: "codeName:grid.appScope.ds_code.NOTI_SCOPE_GB",
					validTypes	: "required"
				},
			 	{displayName:'첨부',		field:'AT_YN',			width:'70',		type:'string',	cellClass:'align_cen',
					cellTemplate: chkCell,
					cellFilter	: "codeName:grid.appScope.ds_code.YN",
					filter		: NG_GRD.getDispalyValueFilter($scope, "mstGrid"),
					validTypes	: "required"
				},
			 	{displayName:'댓글',		field:'REPLY_YN',		width:'70',		type:'string',	cellClass:'align_cen',
					cellTemplate: chkCell,
					cellFilter	: "codeName:grid.appScope.ds_code.YN",
					filter		: NG_GRD.getDispalyValueFilter($scope, "mstGrid"),
					validTypes	: "required"
				},
			 	{displayName:'사용',		field:'USE_YN',			width:'70',		type:'string',	cellClass:'align_cen',
					cellTemplate: chkCell,
					cellFilter	: "codeName:grid.appScope.ds_code.YN",
					filter		: NG_GRD.getDispalyValueFilter($scope, "mstGrid"),
					validTypes	: "required"
				},
				{displayName:'등록자',		field:'REG_NM',			width:'100',	type:'string',	cellClass:'align_cen'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "게시판목록");

	
	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
	}//end-lfn_cell_onClick
	
	//cell change event
	$scope.lfn_cell_onChange = (name, entity, grid) => {
		if (entity.ROW_CRUD === "R") {
			entity.ROW_CRUD = "U";
		}
	}//end-lfn_cell_onChange
	
	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		if (!$scope.lfn_cell_show(name, entity, grid)) {
			return true;
		}
		return false;
	}//end-lfn_cell_disabled

	//cell show
	$scope.lfn_cell_show = (name, entity, grid, row) => {
		if (row && !row.isSelected) {
			return false;
		}
		if (entity.ROW_CRUD === "C") {
			return true;
		} else {
			if (XUTL.isIn(name, "BBS_NM", "AT_YN", "REPLY_YN", "USE_YN")) {
				return true;
			}
		}
		return false;
	}//end-lfn_cell_show
	
	//cell data render
	$scope.lfn_cell_render = (name, entity, grid) => {
		return entity[name];
	}//end-lfn_cell_render
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

    
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기본 신규데이터
	$scope.lfn_instance_new_mst = () => {
		const mst = 
			{
				CO_CD			: SS_USER_INFO.CO_CD,
 				BBS_GB			: $scope.ds_code.BBS_GB.length === 1 ? $scope.ds_code.BBS_GB[0].CODE_CD : null,
 				NOTI_SCOPE_GB	: $scope.ds_code.NOTI_SCOPE_GB.length === 1 ? $scope.ds_code.NOTI_SCOPE_GB[0].CODE_CD : null,
				AT_YN			: "Y",
				REPLY_YN		: "N",
				USE_YN			: "Y",
				DEL_YN			: "N",
				ROW_CRUD		: "C"
			};
		return mst;
	}//end-lfn_instance_new_mst	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end