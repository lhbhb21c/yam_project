/**
 * 파일명	: CO_MNG.js
 * 설명	: 회사코드관리
 *
 * 수정일			수정자		수정내용
 * 2022.03.28	염국선		최초작성
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
	$scope.ds_code	= {};
	//query condition
	$scope.ds_cond	= {};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf			= conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
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
		} else if (name === "SAVE") {
			return $scope.mstGrid.gridApi.selection.getSelectedRows().length === 0;
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/we_std/base/CO_MNG");

		} else if (name === "SEARCH") {	//조회
			$scope.lfn_search();
			
		} else if (name === "SAVE") {
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
			
		} else if (name === "mst.ADD") {
			$scope.mstGrid.data.unshift({ROW_CRUD:"C", DEL_YN:"N", USE_YN:"Y"});
			$timeout(() => {
				$scope.mstGrid.gridApi.selection.selectRow($scope.mstGrid.data[0]);
			});            		

		} else {
			alert("unknown commnad:"+name);
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
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = (sels) => {
		$scope.lfn_dataset_init("MST");
		
		const param = {queryId: "we.std.base.CO_MNG.selMstList", queryType:"selList", param:$scope.ds_cond};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.mstGrid.data = response.success;

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "CO_CD", XUTL.getValueMatrix(sels, "CO_CD")[0]));
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

		} else {
			alert("unknown cmd:"+name)
			return false;
		}

		return true;
	}//end-lfn_validate

	//실행
	$scope.lfn_run = (name) => {
		const confirmMsg = "저장 하시겠습니까?";
		const successMsg = "정상적으로 처리완료 되었습니다.";

		if (!confirm(confirmMsg)) {
			return;
		}

		const sels		= $scope.mstGrid.gridApi.selection.getSelectedRows();
		const xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("list", sels);

		const param = 
			{
				queryId	: "we.std.base.CO_MNG.save",
				CMD		: name,
				XML_TEXT: xmlDoc.toXmlString()
			};
		
		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/sp.do",
			data: param 
		}).then((response) => {
			alert(successMsg+"\n"+response.RS_MESSAGE);
			$timeout(() => {
				$scope.lfn_search(sels);
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
	//체크박스(Y/N)
	const chkCell = NG_CELL.getCheckboxCell({
    	permanent		: true,
    	ngIf			: "lfn_cell_show",
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange"
	});
	
	//마스터 Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,
		multiSelect		: true,
		customStateId	: "/we_std/base/PGM_MNG/mstGrid",
		columnDefs		:
			[
				{displayName:"상태",			field:"ROW_CRUD",	width:"50",		type:"string",	cellClass:"align_cen",
					enableFiltering	: false,
					cellTemplate	: rowCrudColorBox
				},
				{displayName:"회사코드",		field:"CO_CD",		width:"100",	type:"string",	cellClass:"align_lft",
					cellTemplate	: inputCell,
					validTypes		: "required"
				},
				{displayName:"회사명",			field:"CO_NM",		width:"*",		type:"string",	cellClass:"align_lft",
					cellTemplate	: inputCell,
					validTypes		: "required"
				},
				{displayName:"사용",			field:"USE_YN",		width:"50",		type:"string",	cellClass:"align_cen",
					cellTemplate	: chkCell,
					validTypes		: "required"
				},
				{displayName:"삭제",			field:"DEL_YN",		width:"50",		type:"string",	cellClass:"align_cen",
					cellTemplate	: chkCell,
					validTypes		: "required"
				},
				{displayName:"수정일시",		field:"UPD_DT",		width:"150",	type:"date",	cellClass:"align_cen"}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "프로그램목록");
	

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
		if ($scope.lfn_btn_disabled("SAVE")) {
			return true;
		}
		if (name === "CO_CD") {
			return !(entity.ROW_CRUD === "C");
		} else if (XUTL.isIn(name, "USE_YN", "DEL_YN")) {
			return entity.ROW_CRUD === "C";
		}
		return false;
	}//end-lfn_cell_disabled

	//cell show
	$scope.lfn_cell_show = (name, entity, grid, row) => {
		if (row && !row.isSelected) {
			return false;
		}
		return true;
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
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
