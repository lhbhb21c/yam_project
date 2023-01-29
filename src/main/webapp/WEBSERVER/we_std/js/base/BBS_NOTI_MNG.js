/**
 * 파일명	: BBS_NOTI_MNG.js
 * 설명	: 공지사항관리
 *
 * 수정일			수정자		수정내용
 * 2021.12.09	염국선		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
NG_ATCH.addAttachListDirective(app);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};
	//code set
	$scope.ds_code	= {
		/////////////////////////////////
		NOTI_SCOPE_CD	: []	//게시범위코드(게시범위구분에 따라 멤버유형/멤버구분)
	}
	//조회 조건
	$scope.ds_cond	= {};
	//전자게시판정보
	$scope.ds_base	= {};
	//마스터
	$scope.ds_mst	= {};
	//첨부파일
	$scope.ds_at	= 
		{
			config	: {
				FILE_BINDER_ID: null,
				data		: {FILE_BINDER_GB: "NOTICE"},
				editable	: false,
				multiple	: true,
				onAdd		: (list) => {
					if (!$scope.ds_mst.NOTI_AT) {
						if ($scope.ds_mst.ROW_CRUD === "C") {
							$scope.ds_mst.NOTI_AT = $scope.ds_at.config.FILE_BINDER_ID;
						} else {
							//기존데이터에서 첨부ID가 없을 경우 첨부즉시 첨부ID update
							const param = {queryId: "we.std.base.BBS_NOTI_MNG.updBbsNotiAt", queryType: "upd",	param: {NOTI_ID: $scope.ds_mst.NOTI_ID, NOTI_AT: $scope.ds_at.config.FILE_BINDER_ID}};
							XUTL.fetch({
								url	: "/std/cmmn/query.do",
								data: param 
							}).then((response) => {
								if (response.success) {
									$scope.ds_mst.NOTI_AT = $scope.ds_at.config.FILE_BINDER_ID;
								}
							});
						}
					}//end-if (!$scope.ds_mst.NOTI_AT) {
				}//end-(list) => {
			}//end-config	: {
		};
	

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf					= conf||{};
		$scope.ds_conf.paramSet 		= XUTL.getRequestParamSet();
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base().then(() => {
			//게시범위구분(MEM_TY/MEM_GB)에 의한 게시범위코드목록 설정
			$scope.ds_code.NOTI_SCOPE_CD	= XUTL.getCodeFactory()[$scope.ds_base.NOTI_SCOPE_GB]||[];
			//조회
 			if ($scope.ds_base.BBS_ID) {
 				$scope.ds_cond.BBS_ID = $scope.ds_base.BBS_ID;
 				$scope.lfn_search();
 			}
		});
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
			$scope.ds_cond.DY_FR	= moment().add(-3, 'months').format('YYYY-MM-DD');		//작업지시시작일 = 현재일 - 3달
			$scope.ds_cond.DY_TO	= moment().format('YYYY-MM-DD');						//작업지시종료일 = 현재일
		}
		if (!name || name === "MST") {
        	$scope.lfn_dataset_init("ds_mst");
        	XUTL.empty($scope.mstGrid.data);
		}
		
		if (name === "ds_mst") {	//ds_mst 관련
			$scope.ds_mst = {};
			$scope.ds_at.config.FILE_BINDER_ID = null;
			$scope.ds_at.config.editable = false;
			$scope.ds_at.data = [];
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
		if (!$scope.ds_base.BBS_ID) {
			return false;
		}
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		if (!$scope.lfn_btn_show(name)){
			return true;
		}

		if (name === "NEW") {
			const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length > 0 && sels[0].ROW_CRUD === "C") {
				return true;
			}
			return false;
		}
		
		if (XUTL.isIn(name, "SAVE", "DEL")) {
			if (!$scope.ds_mst.ROW_CRUD) {
				return true;
			}
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
			
		} else if (XUTL.isIn(name, "SAVE", "DEL")) {	//저장/삭제
			if (name === "DEL" && $scope.ds_mst.ROW_CRUD === "C") {
				XUTL.removeRows($scope.mstGrid.data, $scope.ds_mst);
				$scope.lfn_dataset_init("ds_mst");
				return;
			}
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}

		}

	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			if ($scope.lfn_btn_disabled("SAVE")) {
				return true;
			}
			
			if (name === "ds_mst.NOTI_SCOPE_LIST") {
				return $scope.ds_mst.ALL_NOTI_YN === "Y";
			}
			
		}
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			//일자의 첫 바인딩 이벤트는 제외시킴
			if (name === "ds_mst.NOTI_S_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_NOTI_S_DY")) {
					$scope.ds_mst._OLD_NOTI_S_DY = $scope.ds_mst.NOTI_S_DY;
					return;
				}
			} else if (name === "ds_mst.NOTI_E_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_NOTI_E_DY")) {
					$scope.ds_mst._OLD_NOTI_E_DY = $scope.ds_mst.NOTI_E_DY;
					return;
				}
			}
			
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			
			if (XUTL.isIn(name, "ds_mst.ALL_NOTI_YN", "ds_mst.NOTI_SCOPE_LIST")) {
				$timeout(() => {
					$scope.lfn_parse_noti_scope();	//범위코드/명 설정
				});
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
			const param = {queryId: "we.std.base.BBS_NOTI_MNG.selBaseInfo",	queryType:"selOne",	param:{BBS_CD: $scope.ds_conf.paramSet.BBS_CD}};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/query.do",
				data: param 
			}).then((response) => {
				$scope.ds_base = response.success||{};

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

		const param = {queryId: "we.std.base.BBS_NOTI_MNG.selMstList",	queryType:"selList",	param:$scope.ds_cond};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param 
		}).then((response) => {
			$scope.mstGrid.data = response.success;

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "NOTI_ID", XUTL.getValueMatrix(sels, "NOTI_ID")[0]));
				});
			} else {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, "first");
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
			if ($scope.ds_mst.ROW_CRUD === "R") {
				alert("수정 한 내용이 없습니다.");
				return false;
			} else if (!($scope.ds_mst.ALL_NOTI_YN === "Y") && !$scope.ds_mst.NOTI_SCOPE_CDS) {
				alert("공지범위를 선택 하세요.");
				return false;
			}
			
			//마스터 체크
			if (!XUTL.validateInput($("#ds_mst")).isValid){
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
		xmlDoc.appendXml("mst", $scope.ds_mst);
		const param = 
			{
				queryId	: "we.std.base.BBS_NOTI_MNG.save",
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
				//조회 후 등록된게시물 선택
				$scope.lfn_search([{NOTI_ID: response.RS_MESSAGE}]);
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
	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		noUnselect		: true,
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					delete row.entity._OLD_NOTI_S_DY;
					delete row.entity._OLD_NOTI_E_DY;
					row.entity.NOTI_SCOPE_LIST = row.entity.NOTI_SCOPE_CDS ? row.entity.NOTI_SCOPE_CDS.split(",") : []; 
					$scope.ds_mst = row.entity;
					$scope.ds_at.config.FILE_BINDER_ID = row.entity.NOTI_AT;
					$scope.ds_at.config.editable = true;
					$scope.ds_at.data = [];
					if ($scope.ds_at.config.FILE_BINDER_ID) {
						$scope.ds_at.api.load();
					}
				});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/we_std/base/BBS_NOTI_MNG/mstGrid",
		columnDefs		:
			[
				{displayName:'번호',		field:'BBS_SN',			width:'70',		type:'string',	cellClass:'align_cen'},
			 	{displayName:'범위',		field:'NOTI_SCOPE',		width:'120',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'제목',		field:'SUBJCT',			width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'게시시작일',	field:'NOTI_S_DY',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'게시종료일',	field:'NOTI_E_DY',		width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
				{displayName:'게시자',		field:'NOTI_CP_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
			 	{displayName:'게시여부',	field:'USE_YN',			width:'70',		type:'string',	cellClass:'align_cen'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, "공지사항");

	
	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		grid.api.selection.selectRow(entity);
	}//end-lfn_row_onClick
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
				BBS_ID		: $scope.ds_base.BBS_ID,
				ALL_NOTI_YN	: "Y",
				NOTI_SCOPE	: "전체",
				NOTI_S_DY	: moment().format('YYYY-MM-DD'),
				NOTI_E_DY	: moment().add(12, "months").format('YYYY-MM-DD'),
				NOTI_CP_NM	: SS_USER_INFO.USER_NM,
				USE_YN		: "Y",
				REG_NM		: SS_USER_INFO.USER_NM,
				REG_DT		: moment().format('YYYY-MM-DD'),
				ROW_CRUD	: "C"
			};
		return mst;
	}//end-lfn_instance_new_mst	
	
	//선택된 범위코드/명 작성
	$scope.lfn_parse_noti_scope = () => {
		if ($scope.ds_mst.ALL_NOTI_YN === "Y") {
			$scope.ds_mst.NOTI_SCOPE_LIST	= [];
			$scope.ds_mst.NOTI_SCOPE_CDS	= "";
			$scope.ds_mst.NOTI_SCOPE_NM		= "";
			$scope.ds_mst.NOTI_SCOPE		= "전체";
			
		} else {
			$scope.ds_mst.NOTI_SCOPE_CDS	= $scope.ds_mst.NOTI_SCOPE_LIST.join(",");
			const names = [];
			for (let i=0; i<$scope.ds_mst.NOTI_SCOPE_LIST.length; i++) {
				names.push(XUTL.getCodeName($scope.ds_code.MEM_TY, $scope.ds_mst.NOTI_SCOPE_LIST[i]));
			}
			$scope.ds_mst.NOTI_SCOPE_NM	= names.join(",");
			$scope.ds_mst.NOTI_SCOPE	= $scope.ds_mst.NOTI_SCOPE_NM;
		}
	}//end-lfn_parse_noti_scope
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
