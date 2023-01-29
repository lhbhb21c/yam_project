/**
 * 파일명	: BOM_MNG.js
 * 설명	: BOM 등록
 * 
 * 수정일		 	수정자		수정내용
 * 2021.10.23	정래훈		최초작성
 */
//angular module instance
let app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl",  ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {}
	//code set
	$scope.ds_code	= {
		USE_YN		: [],	//사용구분	
		QTY_UN		: [],	//수량단위
		PROC_CD		: [],	//공정코드
	}
	//조회 조건
	$scope.ds_cond	= {};
	//마스터 -모달에디트
	$scope.ds_mst	= {};
	// 중복체크
	$scope.ds_dup  	= {};
	
	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.USE_YN	= XUTL.getCodeFactory().USE_YN;	//사용구분
		$scope.ds_code.QTY_UN	= XUTL.getCodeFactory().QTY_UN; 	//품목단위
		$scope.ds_code.PROC_CD	= XUTL.getCodeFactory().PROC_CD;	//공정코드
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		$scope.lfn_load_base();
	}	

    //데이터 초기화
    $scope.lfn_dataset_init =  (name) => {
    	$scope.mstGrid.data = $scope.mstGrid.data||[];
    	$scope.dtlGrid.data = $scope.dtlGrid.data||[];
    	$scope.subGrid.data = $scope.subGrid.data||[];
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond);
    	}
    	if (!name || name === "MST") {
        	XUTL.empty($scope.mstGrid.data);
        	$scope.lfn_dataset_init("DTL");
    	} 
    	if (name === "DTL") {
        	XUTL.empty($scope.dtlGrid.data);
    	} else if (name === "MODAL") {
        	XUTL.empty($scope.ds_mst);
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
    $scope.lfn_btn_show =  (name) => {
    	return true;
    }//end-lfn_btn_show

    //버튼 관련 ng-disabled 처리
    $scope.lfn_btn_disabled =  (name) => {
    	if (!$scope.lfn_btn_show(name)) {
    		return true;
    	}
    	if (name === "UPD") {
    		return $scope.mstGrid.gridApi.selection.getSelectedRows().length !== 1;
    	} else if (name === "SAVE") {
    		if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "R", "U")) {
    			return true;
    		}
    	} else if (name === "edit.sub.DEL") {
    	//	return $scope.subApi.selection.getSelectedRows().length === 0;
    	}

    	return false;
    }//end-lfn_btn_disabled

    //버튼클릭이벤트
    $scope.lfn_btn_onClick = (name, arg1) => {
    	if (name === "CLOSE") {
    		top.MDI.closeTab("/yam/mm/BOM_MNG");
    		
    	} else if (name === "SEARCH") {
           	$scope.lfn_search();
           	
    	} else if (XUTL.isIn(name, "REG", "UPD")) {
    		$scope.lfn_start_edit(name, arg1);
    		
    	} else if (name === "SAVE") {
    		if ($scope.lfn_validate(name)) {
    			$scope.lfn_run(name)
    		}

    	} else if (name === "ds_mst.POP_ITM") {	//품목코드 팝업
			_YAM.popupItm({FIX_ITM_GB:""})
			.then( (response) => {
				let callback =  () =>{
					$timeout( () => {
						console.log('callback', response)
						$scope.ds_mst.ITM_ID	= response.ITM_ID;
						$scope.ds_mst.ITM_CD	= response.ITM_CD;
						$scope.ds_mst.ITM_NM	= response.ITM_NM;
						$scope.ds_mst.ITM_GB	= response.ITM_GB;
						$scope.ds_mst.QTY_UN	= response.ITM_UN;
					});
				};
				//중복체크 후 추가
				$scope.lfn_dup_check(response.ITM_CD, callback)
			});
			
	    } else if (name === "edit.sub.ADD") { //품목 선택팝업
			if (typeof $scope.ds_mst.ITM_CD === 'undefined' || $scope.ds_mst.ITM_CD === '') {
				alert('품목코드를 먼저 선택하세요!');
				return;
			}

    		_YAM.popupItm({multiple: true, FIX_ITM_GB:""})
    		.then( (response) => {
				$timeout( () => {
					let dupEntities = [];
					let dupParents = false;
					$.each(response,  (idx, entity) => {
						dupParents = $scope.ds_mst.ITM_CD === entity.ITM_CD;
						let find = XUTL.findRows($scope.subGrid.data, "ITM_CD", entity.ITM_CD);
						if (find.length === 0 && !dupParents) {	//중복되지 않은 품목만 추가
							$scope.subGrid.data.push({
								ITM_ID	: entity.ITM_ID,
								ITM_CD	: entity.ITM_CD,
								ITM_NM	: entity.ITM_NM,
								ITM_GB	: entity.ITM_GB,
								QTY_UN	: entity.ITM_UN,
								PROC_CD	: entity.PROC_CD,
								ROW_CRUD: "C"
							});
						} else {
							dupEntities.push(entity);
						}
					});
					if (dupEntities.length > 0) {
						alert("중복되거나 BOM 품목과 같은 상세 품목 " + (dupEntities.length)
							+ "건은 제외 되었습니다.");
					}
				});
			});

    	} else if (name === "edit.sub.DEL") {
    		XUTL.removeRows($scope.subGrid.data, $scope.subGrid.gridApi.selection.getSelectedRows());
    		
    	} else if (name === "edit.CLOSE") {
    		$("#editModal").modal("hide");
        	
    	}
    	
    }//end-lfn_btn_onClick
    
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled =  (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "R", "U" )) {
				return true;
			}
			if (name === "ds_mst.POP_ITM") { //신규일경우만 품목코드 등록 가능
				return $scope.ds_mst.ROW_CRUD !== "C";
			}
			
			if (name === "ds_mst.QTY_UN") {
//				return true;
			}
		}
    	return false;
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange =  (name) => {
		if (name.indexOf("ds_cond.") === 0) {
			return;
		}
		
		//ds_mst 계열
		if ($scope.ds_mst.ROW_CRUD === "R") {
			$scope.ds_mst.ROW_CRUD = "U";
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
    $scope.lfn_load_base =  () => {	
    }//end-lfn_load_base
    
    //조회
    $scope.lfn_search =  (sels) => {
    	$scope.lfn_dataset_init("MST")
    	
    	let param = {
    		querySet	:
    			[
    			 {queryId: "yam.mm.BOM_MNG.selMstList",	queryType:"selList",	dataName:"mstGrid.data",		param:$scope.ds_cond}
    			]
    	}
    	
    	blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		}).then( (response) => {
    		$.each(response.success, (name, data) => {
    			XUTL.setWithPath($scope, name, data);
    		});
    		
			//row선택 설정
			if (sels) {
				let rows = []
				$.each(sels,  (idx, sel) => {
					XUTL.addRows(rows, XUTL.findRows($scope.mstGrid.data, "ITM_CD", sel.ITM_CD));
				});
				$timeout( () => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, rows);
				});
			} else {
				$timeout( () => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, "first");
				});
			}
		}).finally( (data) => {
			$timeout( () => {
				blockUI.stop();
			});
		});
    }//end-lfn_search
    
    //서브리스트 조회
    $scope.lfn_search_sub = (entity) => {
    	
    	$scope.lfn_dataset_init("DTL")
    	
    	let param = {
    		querySet	:
    			[
    			 {queryId: "yam.mm.BOM_MNG.selSubList",	queryType:"selList",	dataName:"dtlGrid.data", param: entity}
    			]
    	}
    	
    	blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		}).then( (response) => {
    		$.each(response.success, (name, data) => {
    			XUTL.setWithPath($scope, name, data);
    		});
    		
    		if ($scope.dtlGrid.data.length > 0) {
				$timeout( () => {
					// NG_GRD.selectRow($scope.subApi, $scope.dtlGrid.data[0]);
				});
    		}
		}).finally( (data) => {
			$timeout( () => {
				blockUI.stop();
			});
		});    	
    }//end-lfn_search_sub    
    
    //자재정보 작성 작업 시작
    $scope.lfn_start_edit =  (name, itm_cd) => {
    	$scope.lfn_dataset_init("MODAL");
		if (name === "REG") {
	    	$scope.ds_mst		= {
        		SECTR_ID	: SS_USER_INFO.SECTR_ID,
        		LIVE_GUBN	: SS_USER_INFO.LIVE_GUBN,
        		USE_YN		: "Y", //사용구분:사용가능 자동선택
        		ROW_CRUD	: "C"
        	}

			// $("#editModal").modal("show");
			$("#editModal").modal({
				backdrop: 'static',
			});

		} else if (name === "UPD") {
			let sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("수정 할 BOM을 선택 하세요");
				return;
			}
			
	    	let param = {
        		querySet	:
        			[
        			 {queryId: "yam.mm.BOM_MNG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:{BOM_ID:sels[0].BOM_ID}},
        			 {queryId: "yam.mm.BOM_MNG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:{BOM_ID:sels[0].BOM_ID}}
        			]
        	}
        	
        	blockUI.start();
    		XUTL.fetch({
    			url	: "/std/cmmn/mquery.do",
    			data: param
    		}).then( (response) => {
	    		$.each(response.success, (name, data) => {
	    			XUTL.setWithPath($scope, name, data);
	    		});
	    		$("#editModal").modal("show");

			}).finally( (data) => {
    			$timeout( () => {
    				blockUI.stop();
    			});
    		});
    		
    	}
    }//end-lfn_start_edit


	// 품목코드 중복 체크
	$scope.lfn_dup_check =  (itmCd, callback) => {
		let param = {
			querySet	:
				[
					{queryId: "yam.mm.BOM_MNG.selDupCheckItmCd",	queryType:"selOne",	dataName:"ds_dup",		param:{ITM_CD:itmCd}}
				]
		}
		
		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		}).then( (response) => {
			$.each(response.success, (name, data) => {
				XUTL.setWithPath($scope, name, data);
			});
			if ($scope.ds_dup.DUP_COUNT > 0) {
				alert(itmCd + " 는 중복(등록)된 품목입니다. 다시 선택해주세요");
			} else {
				callback();
			}
		}).finally( (data) => {
			$timeout( () => {
				blockUI.stop();
			});
		});
	}


	//검증
    $scope.lfn_validate =  (name) => {
    	if (name === "SAVE") {
    		//저장 데이터 존재 여부 체크
    		if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "U")) {
    			alert("저장 할 내용이 없습니다.");
    			return false;
    		}
    		//valid type check
    		if (!XUTL.validateInput($("#ds_mst")).isValid) {
    			return false;
    		}

			if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
				return false;
			}
    		
		} else {
			alert("unknown cmd:"+name)
			return false;
		}
    	return true;
    }//end-lfn_validate
    
    //실행
    $scope.lfn_run =  (name) => {
    	let confirmMsg = "저장 하시겠습니까?";
    	let successMsg = "정상적으로 처리완료 되었습니다.";
    	
    	if (confirm(confirmMsg)) {
      		let xmlDoc = new XmlDoc({});
    		xmlDoc.appendXml("mst", $scope.ds_mst);
    		xmlDoc.appendXml("sub", $scope.subGrid.data);
    		
        	let param = {
        		queryId	: "yam.mm.BOM_MNG.save",
        		CMD		: name,
        		XML_TEXT: xmlDoc.toXmlString()
        	};
        	
        	blockUI.start();
    		XUTL.fetch({
    			url	: "/std/cmmn/sp.do",
    			data: param
    		}).then( (response) => {
        		alert(successMsg);
        		$scope.lfn_search([{ITM_CD:$scope.ds_mst.ITM_CD}]);
				$scope.subGrid.data = []; // 등록화면의 목록 리셋
        		$("#editModal").modal("hide"); 
        	}).finally( (data) => {
    			$timeout( () => {
    				blockUI.stop();
    			});
    		});
    	}
    }//end-lfn_run        
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////

    
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////
	//숫자(포맷)
    let numfCell = NG_CELL.getNumFormatCell({
    	permanent		: true,
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange",
    	selectOnFocus	: true,
    	digit			: 3,
    	sign			: false
    });

	//공정코드콤보
	let procCdCombo = NG_CELL.getComboCell("ds_code.PROC_CD", {
    	permanent	: true,
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange"
    });

    
    //마스터 Grid Options
    $scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	noUnselect		: true,
    	// enableGridMenu	: false,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.lfn_search_sub(row.entity);
				});				
			},
		columnDefs		:
			[
				{displayName:'BOM.ID',			field:'BOM_ID',			width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목코드',			field:'ITM_CD',			width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목',				field:'ITM_NM',		 	width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'구분',				field:'ITM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목단위',			field:'QTY_UN_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'자재수량',			field:'ITM_QTY',		width:'150',	type:'string',	cellClass:'align_rgt',	cellFilter:'currency:"":3'},
				{displayName:'공정',				field:'PROC_CD_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'사용여부',			field:'USE_YN_NM',		width:'100',	type:'string',	cellClass:'align_cen'}
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, 'BOM 목록');
    //서브 Grid Options
    $scope.dtlGrid = NG_GRD.instanceGridOptions({
    	enableFiltering	: false,
    	enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	noUnselect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
				{displayName:'품목코드',		field:'ITM_CD',			width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목',			field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'수량단위',		field:'QTY_UN_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'소요수량',		field:'CONSM_QTY',		width:'150',	type:'string',	cellClass:'align_rgt'},
				{displayName:'공정',			field:'PROC_CD_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
			]
		});
	NG_GRD.addExcelExportMenu($scope.dtlGrid, 'BOM 상세 목록');

    //BOM Grid Options - BOM 등록화면 상세 자재 그리드
    $scope.subGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering	: false,
		enableGridMenu	: false,
		multiSelect		: true,
		noUnselect		: true,
 		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
				{displayName:'품목코드',		field:'ITM_CD',			width:'130',	type:'string',	cellClass:'align_lft'},
				{displayName:'품목',			field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'수량단위',		field:'QTY_UN',			width:'80',		type:'string',	cellClass:'align_cen'},
				{displayName:'소요수량',		field:'CONSM_QTY',		width:'80',		type:'string',	cellClass:'align_rgt',
											cellTemplate:numfCell,	validTypes:"required" },
				{displayName:'공정',			field:'PROC_CD',		width:'150',	type:'string',	cellClass:'align_cen',
											cellTemplate:procCdCombo, validTypes:"required" },

			]
	});
    
    //row click event
    $scope.lfn_row_onClick =  (name, entity, grid) => {
    	if (grid.options === $scope.mstGrid || grid.options === $scope.dtlGrid) {
    		grid.api.selection.selectRow(entity);
    	}
    }//end-lfn_row_onClick
    
    //cell disabled define
    $scope.lfn_cell_disabled =  (name, entity, grid) => {
		if (name == "QTY_UN") {
			return true;
		}

    	return false;
    }//end-lfn_cell_disabled    
    
    //cell click event
    $scope.lfn_cell_onClick =  (name, entity, grid) => {
    }//end-lfn_cell_onClick  
    
    //data change event
	$scope.lfn_cell_onChange =  (name, entity, grid) => {
		if ($scope.ds_mst.ROW_CRUD === "R") {
			$scope.ds_mst.ROW_CRUD = "U";
		}
	}
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

}); // control end
