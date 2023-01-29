/**
 * 파일명	: MENU_MNG.js
 * 설명	: 메뉴관리
 *
 * 수정일			수정자		수정내용
 * 2022.03.02	염국선		최초작성
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
		MEM_ROLE_CD		: [],	//멤버롤코드
		MENU_ICON		: [],	//메뉴아이콘
		//공통코드 외 //////////////////////
		SECTR_ID		: [],	//섹터ID 콤보용
		ROOT_MENU_ID	: []	//루트메뉴ID 콤보용
	};
	//query condition
	$scope.ds_cond	= {};
	//루트메뉴정보
	$scope.ds_base	= {};
	//루트메뉴 에디터
	$scope.ds_root	= {}

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf			= conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.MEM_ROLE_CD	= XUTL.getCodeFactory().MEM_ROLE_CD;//멤버롤코드
		$scope.ds_code.MENU_ICON	= XUTL.getCodeFactory().MENU_ICON;	//메뉴아이콘

		const iconTemplate = NG_CELL.getIconRenderer({list:XUTL.getValueMatrix($scope.ds_code.MENU_ICON, "CODE_CD")[0], iconField:"MENU_ICON"});
		XUTL.applyRows(XUTL.findRows($scope.mstGrid.columnDefs, "field", "ICON"), "cellTemplate", iconTemplate);
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base()
		.then(() => {
			//첫번째 자동선택 조회
			if ($scope.ds_code.ROOT_MENU_ID.length > 0) {
				$scope.ds_cond.ROOT_MENU_ID = $scope.ds_code.ROOT_MENU_ID[0].CODE_CD;
 				$scope.lfn_search();
			}
		});
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		$scope.subGrid.data = $scope.subGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
		}

		if (!name || name === "MST") {
			XUTL.empty($scope.mstGrid.data);
			$scope.lfn_dataset_init("SUB");
		}
		
		if (name === "SUB") {
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
		if (!BS_UTL.isSu()) {
			if (XUTL.isIn(name, "SAVE", "DEL", "mst.ADD", "sub.ADD", "sub.DEL")) {
				return ($scope.ds_base.SECTR_APLY_YN === "Y" && $scope.ds_base.SECTR_ID === SS_USER_INFO.SECTR_ID);
			} else if (name === "root.SAVE") {
				return ($scope.ds_root.SECTR_APLY_YN === "Y" && $scope.ds_root.SECTR_ID === SS_USER_INFO.SECTR_ID);
			}
		}
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		if (!$scope.lfn_btn_show(name)){
			return true;
		}
		
		//루트메뉴관련 처리
		if (name.indexOf("root.") === 0) {
			if (name === "root.EDIT") {
				return !$scope.ds_cond.ROOT_MENU_ID;
			} else if (name === "root.SAVE") {
				if (!$scope.ds_root.ROW_CRUD) {
					return true;
				}
			}
			return false;
		}
		
		if (name === "SEARCH") {
			return !$scope.ds_cond.ROOT_MENU_ID;
		}

		//루트메뉴가 조회되기전 컨트롤 버튼 사용 불가
		if (!$scope.ds_base.ROOT_MENU_ID) {
			return true
		}
		
		if (XUTL.isIn(name, "SAVE", "DEL", "sub.ADD")) {
			return $scope.mstGrid.gridApi.selection.getSelectedRows().length === 0;
		} else if (name === "sub.DEL") {
			return $scope.subGrid.gridApi.selection.getSelectedRows().length === 0;
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/we_std/base/MENU_MNG");

		} else if (name === "SEARCH") {	//조회
			$scope.lfn_search();
			
		} else if (XUTL.isIn(name, "SAVE", "DEL", "root.SAVE")) {
			if (name === "DEL") {
				const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
				if (sels[0].ROW_CRUD === "C") {
					XUTL.removeRows($scope.mstGrid.data, sels[0]);
					$scope.lfn_dataset_init("SUB");
					return;
				}				
			}
			
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
			
		} else if (name === "mst.ADD") {
			let	entity;
			const find = XUTL.findRows($scope.mstGrid.data, "ROW_CRUD", "C");
			if (find.length > 0) {
				alert("작업중인 신규 항목을 저장 하세요.");
				entity = find[0];
			} else {
				entity = 
					{
						ROOT_MENU_ID	: $scope.ds_base.ROOT_MENU_ID, 
						MENU_LVL		: 1,
						MENU_SN			: XUTL.maxNum(XUTL.getValueMatrix($scope.mstGrid.data, "MENU_SN")[0]) + 100,
						HID_YN			: "N", 
						USE_YN			: "Y", 
						ROW_CRUD		: "C"
					}
				$scope.mstGrid.data.push(entity);
			}
			$timeout(() => {
				$scope.mstGrid.gridApi.selection.selectRow(entity);
			});            		

		} else if (name === "sub.ADD") {
			const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 1) {
				const entity =
					{
						ROOT_MENU_ID	: sels[0].ROOT_MENU_ID, 
						PARENT_MENU_ID	: sels[0].MENU_ID, 
						MENU_LVL		: 2, 
						MENU_SN			: XUTL.maxNum(XUTL.getValueMatrix($scope.subGrid.data, "MENU_SN")[0]) + 100,
						HID_YN			: "N", 
						USE_YN			: "Y", 
						ROW_CRUD		: "C"
					}
				$scope.subGrid.data.push(entity);
				$timeout(() => {
					$scope.subGrid.gridApi.selection.selectRow($scope.subGrid.data[$scope.subGrid.data.length-1]);
				});            		
			}

		} else if (name === "sub.DEL") {
			XUTL.removeRows($scope.subGrid.data, $scope.subGrid.gridApi.selection.getSelectedRows());

		} else if (XUTL.isIn(name, "root.NEW", "root.EDIT")) {
			$scope.lfn_start_edit_as_root(name);

		} else if (name === "root.CLOSE") {
			$("#rootEditModal").modal("hide");
			
		} else if (name === "pgm.SEL") {
			const sels = $scope.pgmGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("프로그램을 선택 하세요");
			} else {
				XUTL.applyRows($scope.subGrid.gridApi.selection.getSelectedRows(), ["PGM_ID", "MENU_NM"], [sels[0].PGM_ID, sels[0].PGM_NM]);
				$("#selPgmModal").modal("hide");
			}
			
		} else if (name === "pgm.CLOSE") {
			$("#selPgmModal").modal("hide");
			
		} else {
			alert("unknown commnad:"+name);
		}

	}//end-lfn_btn_onClick

	//입력관련 ng-show 처리
	$scope.lfn_input_show = (name) => {
		if (name === "ds_root.SECTR") {
			return BS_UTL.isSu();
		}
		return true;		
	}//end-lfn_input_show

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		//루트메뉴관련
		if (name.indexOf("ds_root.") === 0) {
			if ($scope.lfn_btn_disabled("root.SAVE")) {
				return true;
			}
			if (name === "ds_root.SECTR_ID") {
				return $scope.ds_root.SECTR_APLY_YN === "N";
			}
			if (XUTL.isIn(name, "ds_root.USE_YN", "ds_root.DEL_YN")) {
				return $scope.ds_root.ROW_CRUD === "C";
			}
		}
		return false;		
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		//루트메뉴관련
		if (name.indexOf("ds_root.") === 0) {
			if ($scope.ds_root.ROW_CRUD === "R") {
				$scope.ds_root.ROW_CRUD = "U";
			}
			//회사별적용시에만 회사코드 적용
			if (name === "ds_root.SECTR_APLY_YN" && $scope.ds_root.SECTR_APLY_YN === "N") {
				$scope.ds_root.SECTR_ID = "";
			}
		}
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
			const param = {
					querySet	:
						[
							{queryId: "we.std.base.MENU_MNG.selSectrComboList",		queryType:"selList",	dataName:"ds_code.SECTR_ID",		param:$scope.ds_cond},
							{queryId: "we.std.base.MENU_MNG.selRootMenuComboList",	queryType:"selList",	dataName:"ds_code.ROOT_MENU_ID",	param:$scope.ds_cond}
						]
				}

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/mquery.do",
				data: param 
			}).then((response) => {
				for (const path in response.success) {
					XUTL.setWithPath($scope, path, response.success[path]);
				}

			}).finally((data) => {
				$timeout(() => {
					blockUI.stop();
					resolve();
				});
			});
		});
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = (sels) => {
		$scope.lfn_dataset_init("MST");
		
    	const param = {
        		querySet	:
        			[
        			  {queryId: "we.std.base.MENU_MNG.selBaseInfo",	queryType:"selOne",		dataName:"ds_base",			param:$scope.ds_cond},
        			  {queryId: "we.std.base.MENU_MNG.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond},
        			  {queryId: "we.std.base.MENU_MNG.selPgmList",	queryType:"selList",	dataName:"pgmGrid.data",	param:{}}
        			]
        	}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param 
		}).then((response) => {
 			Object.keys(response.success).forEach((name) => {
				XUTL.setWithPath($scope, name, response.success[name]);
 			});

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "MENU_ID", XUTL.getValueMatrix(sels, "MENU_ID")[0]));
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search
	
	//서브(프로그램목록) 조회
	$scope.lfn_search_sub = () => {
		$scope.lfn_dataset_init("SUB");
		
		const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
		if (sels.length === 0) {
			return;
		}
		
		const param = {queryId: "we.std.base.MENU_MNG.selSubList", queryType:"selList", param:sels[0]};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.subGrid.data = response.success;

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
			} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
				return false;
			}
			
		} else if (name === "DEL") {
			const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("삭제 할 항목을 선택 하세요.");
				return false;
			}
			
		} else if (name === "root.SAVE") {
    		//저장 데이터 존재 여부 체크
    		if (!XUTL.isIn($scope.ds_root.ROW_CRUD, "C", "U")) {
    			alert("저장 할 내용이 없습니다.");
    			return false;
    		} else if (!XUTL.validateInput($("#ds_root")).isValid) {	//valid type check
    			return false;
    		} else {
    			if ($scope.ds_root.ROOT_ORG_YN === "Y" && !$scope.ds_root.ROOT_ORG_ID) {
    				alert("적용 할 소속을 선택 하세요.");
    				return false;
    			}
    		}
			
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
			confirmMsg = "삭제 하시겠습니까?";
		}
		
		if (!confirm(confirmMsg)) {
			return;
		}

		let cmd, sels;
		const xmlDoc 	= new XmlDoc({});
		if (name === "SAVE") {
			cmd = "SAVE.MENU";
			sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			xmlDoc.appendXml("mst", sels[0]);
			xmlDoc.appendXml("sub", $scope.subGrid.data);
		} else if (name === "DEL") {
			cmd = "SAVE.DEL";
			sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			xmlDoc.appendXml("mst", sels[0]);
		} else if (name === "root.SAVE") {
			cmd = "SAVE.ROOT";
			xmlDoc.appendXml("mst", $scope.ds_root);
		}

		const param = 
			{
				queryId	: "we.std.base.MENU_MNG.save",
				CMD		: cmd,
				XML_TEXT: xmlDoc.toXmlString()
			};
		
		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/sp.do",
			data: param 
		}).then((response) => {
			alert(successMsg);
			if (name === "SAVE") {
				$timeout(() => {
					$scope.lfn_search(sels);
				});
			} else if (name === "DEL") {
				$timeout(() => {
					$scope.lfn_search();
				});
			} else if (name === "root.SAVE") {
				$scope.lfn_load_base()
				.then(() => {
					$timeout(() => {
						if ($scope.ds_root.DEL_YN === "Y") {
							$scope.ds_cond.ROOT_MENU_ID = "";
							//루트메뉴삭제시 현재 조회된 메뉴와 같으면 clear
							if ($scope.ds_root.ROOT_MENU_ID === $scope.ds_base.ROOT_MENU_ID) {
								$scope.lfn_dataset_init("MST");
							}
						} else {
							$scope.ds_cond.ROOT_MENU_ID = response.RS_MESSAGE;
							$scope.lfn_search();
						}
						XUTL.empty($scope.ds_root);
						$("#rootEditModal").modal("hide");
					});
				});
			}

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
	//문자열
    const inputCell = NG_CELL.getEditCell({
    	permanent	: true,
    	ngIf		: "lfn_cell_show",
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange",
    	attributes	: ["kr-cell"]
    });
	//숫자
    const numCell = NG_CELL.getEditCell({
    	permanent	: true,
    	ngIf		: "lfn_cell_show",
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange",
		attributes	: ["numbers-only"],
		dataType	: "number"
    });
	//메뉴아이콘콤보
	const iconCombo = NG_CELL.getComboCell("ds_code.MENU_ICON", {
    	permanent	: true,
    	ngIf		: "lfn_cell_show",
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange",
    });
	//멤버롤코드 다중선택콤보
    const memRoleCdsMultiCombo = NG_CELL.getMultiComboCell("ds_code.MEM_ROLE_CD", {
    	permanent	: true,
    	ngIf		: "lfn_cell_show",
   		ngDisabled	: "lfn_cell_disabled",
    	change		: "lfn_cell_onChange"
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
		enableFiltering	: false,
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.lfn_search_sub();
				});
			},
		customGridName	: "대분류 목록",
		customStateId	: "/we_std/base/MENU_MNG/mstGrid",
		columnDefs		:
			[
				{displayName:"ID",			field:"MENU_ID",		width:"100",	type:"string",	cellClass:"align_cen",	visible:false},
				{displayName:"대분류이름",		field:"MENU_NM",		width:"*",		type:"string",	cellClass:"align_lft",
					cellTemplate	: inputCell,
					validTypes		: "required"
				},
				{displayName:"",			field:"ICON",			width:"40",		type:"string",	cellClass:"align_lft"},
				{displayName:"아이콘",			field:"MENU_ICON",		width:"150",	type:"string",	cellClass:"align_lft",
					cellTemplate	: iconCombo
				},
				{displayName:"순서",			field:"MENU_SN",		width:"50",		type:"string",	cellClass:"align_rgt",
					cellTemplate	: inputCell,
					validTypes		: "required"
				},
				{displayName:"숨김",			field:"HID_YN",			width:"50",		type:"string",	cellClass:"align_cen",
					cellTemplate	: chkCell,
					validTypes		: "required"
				},
				{displayName:"사용",			field:"USE_YN",			width:"50",		type:"string",	cellClass:"align_cen",
					cellTemplate	: chkCell,
					validTypes		: "required"
				}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "메뉴대분류목록");
	
	//서브 Grid Options
	$scope.subGrid = NG_GRD.instanceGridOptions({
		enableFiltering	: false,
		noUnselect		: true,
		customGridName	: "프로그램 목록",
		customStateId	: "/we_std/base/MENU_MNG/subGrid",
		columnDefs		:
			[
				{displayName:"ID",			field:"MENU_ID",		width:"100",	type:"string",	cellClass:"align_cen",	visible:false},
				{displayName:"프로그램ID",		field:"PGM_ID",			width:"100",	type:"string",	cellClass:"align_cen",
					cellTemplate	: NG_CELL.getAnchorRenderer({ngIf:"lfn_cell_show", ngClick:"lfn_cell_onClick"}),
					cellFilter		:'emptyLabel:"등록"',
					validTypes		: "required"
				},
				{displayName:"프로그램명",		field:"MENU_NM",		width:"*",		type:"string",	cellClass:"align_lft",
					cellTemplate	: inputCell,
					validTypes		: "required"
				},
				{displayName:"적용롤",			field:"MEM_ROLE_CDS",	width:"300",	type:"string",	cellClass:"align_lft",
					cellFilter		: 'codeName:grid.appScope.ds_code.MEM_ROLE_CD',
					cellTemplate	: memRoleCdsMultiCombo
				},
				{displayName:"순서",			field:"MENU_SN",		width:"50",		type:"string",	cellClass:"align_rgt",
					cellTemplate	: inputCell,
					validTypes		: "required"
				},
				{displayName:"사용",			field:"USE_YN",			width:"50",		type:"string",	cellClass:"align_cen",
					cellTemplate	: chkCell,
					validTypes		: "required"
				}
			]
	});
    NG_GRD.addExcelExportMenu($scope.subGrid, "메뉴프로그램목록");
    
	//프로그램선택 Grid Options
	$scope.pgmGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,
		columnDefs		:
			[
				{displayName:"ID",			field:"PGM_ID",		width:"100",	type:"string",	cellClass:"align_cen"},
				{displayName:"프로그램명",		field:"PGM_NM",		width:"*",		type:"string",	cellClass:"align_lft"},
				{displayName:"프로그램내용",		field:"PGM_EXPL",	width:"*",		type:"string",	cellClass:"align_lft"}
			]
	});
    NG_GRD.addExcelExportMenu($scope.pgmGrid, "프로그램목록");

    //cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if ($scope.subGrid === grid.options) {
			if (name === "PGM_ID") {
				$("#selPgmModal").modal({backdrop: 'static'});
			}
		}
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
		if (XUTL.isIn(name, "USE_YN", "DEL_YN")) {
			return entity.ROW_CRUD === "C";
		}
		return false;
	}//end-lfn_cell_disabled

	//cell show
	$scope.lfn_cell_show = (name, entity, grid, row) => {
		if (row && !row.isSelected) {
			return false;
		}
		if ($scope.lfn_btn_disabled("SAVE")) {
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
	//루트메뉴 edit modal popup
	$scope.lfn_start_edit_as_root = (name) => {
		if (name === "root.NEW") {
			$scope.ds_root = {ROW_CRUD:"C", ROOT_ORG_YN:"N", USE_YN:"Y", DEL_YN:"N"};
			if (!BS_UTL.isSu()) {
				$scope.ds_root.SECTR_APLY_YN	= "Y";
				$scope.ds_root.SECTR_ID			= SS_USER_INFO.SECTR_ID;
			}
			$("#rootEditModal").modal({backdrop: 'static'});
		} else if (name === "root.EDIT") {
	    	const param = {queryId: "we.std.base.MENU_MNG.selBaseInfo",	queryType:"selOne",	param:$scope.ds_cond};
			XUTL.fetch({
				url	: "/std/cmmn/query.do",
				data: param 
			}).then((response) => {
				$timeout(() => {
					$scope.ds_root = response.success;
					$("#rootEditModal").modal({backdrop: 'static'});
				});
			});
		}
	}//end-lfn_start_edit_as_root
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
