/**
 * 파일명	: PARTNR_MNG.js
 * 설명	: 거래처관리 - 거래처등록
 * 
 * 수정일		 	수정자		수정내용
 * 2022.02.27		zno
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl",  ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {}
	//code set
	$scope.ds_code	= {
		PARTNR_TY	: [],	//거래처유형
		PARTNR_GB	: [],	//거래처구분
		USE_YN		: [],	//사용구분
		/////////////////////////////////
		SECTR_ID	: []	//섹터ID
	}
	//조회 조건
	$scope.ds_cond	= {};
	//마스터
	$scope.ds_mst	= {};
	
	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.PARTNR_TY	= XUTL.getCodeFactory().PARTNR_TY;	//거래처유형
		$scope.ds_code.PARTNR_GB	= XUTL.getCodeFactory().PARTNR_GB;	//거래처구분
		$scope.ds_code.USE_YN		= XUTL.getCodeFactory().USE_YN;		//사용구분

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();

		$scope.lfn_search();
	}	

    //데이터 초기화
    $scope.lfn_dataset_init =  (name) => {
    	$scope.mstGrid.data = $scope.mstGrid.data||[]
    	
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
    $scope.lfn_btn_show =  (name) => {
    	return true;
    }//end-lfn_btn_show

    //버튼 관련 ng-disabled 처리
    $scope.lfn_btn_disabled =  (name) => {
    	if (!$scope.lfn_btn_show(name)) {
    		return true;
    	}
    	if (name === "UPD") {
    		return $scope.mstGrid.gridApi.selection.getSelectedRows().length === 0;
    	} else if (XUTL.isIn(name, "SAVE")) {
    		if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "R", "U")) {
    			return true;
    		}
    	}
    	
    	return false;
    }//end-lfn_btn_disabled

    //버튼클릭이벤트
    $scope.lfn_btn_onClick = (name, arg1) => {
    	if (name === "CLOSE") {
    		top.MDI.closeTab("/we_std/base/PARTNR_MNG");
    		
    	} else if (name === "SEARCH") {
           	$scope.lfn_search();
           	
    	} else if (XUTL.isIn(name, "REG", "UPD")) {
    		$scope.lfn_start_edit(name);

    	} else if (name === "SAVE") {
    		if ($scope.lfn_validate(name)) {
    			$scope.lfn_run(name)
    		}

    	} else if (name === "edit.CLOSE") {
    		$("#editModal").modal("hide");
        	$scope.ds_mst		= {}

    	} else if (name === "ds_mst.POP_CP") {
     		BS_UTL.popMemSel({FIX_MEM_TY:"10"}).then((response) => {	//멤버유형-10:자사, 20:거래처, 30:고객
     			$timeout(() => {
            		$scope.ds_mst.CP_ID	= response.MEM_ID;
            		$scope.ds_mst.CP_NM	= response.USER_NM;
            		$scope.lfn_input_onChange("ds_mst.CP_ID");
     			});
     		});
    		
    	} else if (name === "ds_mst.CLR_CP") {
    		$scope.ds_mst.CP_ID	= "";
    		$scope.ds_mst.CP_NM	= "";
    		$scope.lfn_input_onChange("ds_mst.CP_ID");
    	}
    	
    }//end-lfn_btn_onClick
    
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled =  (name) => {
    	if (name.indexOf("ds_mst.") === 0) {
        	if ($scope.lfn_btn_disabled("SAVE")) {
        		return true;
        	}
    	}
    	if (name === "ds_mst.PARTNR_ID"){
    		if (XUTL.isIn($scope.ds_mst.ROW_CRUD, "R", "U")) {
    			return true;
    		}
    	}
    	
    	return false;
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange =  (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			
			if (name === "ds_mst.PARTNR_NM") {
				$scope.ds_mst.PARTNR_ABBR_NM = $scope.ds_mst.PARTNR_NM;
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
		const param = {queryId: "we.std.base.PARTNR_MNG.selSectrComboList",		queryType:"selList",	param:$scope.ds_cond};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/query.do",
			data: param
		}).then((response) => {
			$scope.ds_code.SECTR_ID = response.success;

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_load_base
	
    //조회
    $scope.lfn_search =  (sels) => {
    	$scope.lfn_dataset_init("MST");
    	const param = {
    		querySet	:
    			[
    			 {queryId: "we.std.base.PARTNR_MNG.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
    			]
    	}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param 
		}).then( (response) => {
			for (const name in response.success) {
				XUTL.setWithPath($scope, name, response.success[name]);
			}
    		
			//row선택 설정
			if (sels) {
				$timeout( () => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "PARTNR_ID", XUTL.getValueMatrix(sels, "PARTNR_ID")[0]));
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

    //업체정보 작성 작업 시작
    $scope.lfn_start_edit =  (name, partnrNo) => {
    	$scope.ds_mst		= {}
		if (name === "REG") {
	    	$scope.ds_mst		= {
        		CO_CD		: SS_USER_INFO.CO_CD,
        		USE_YN		: "Y",
        		ROW_CRUD	: "C"
        	}
        	//소속이 하나일 경우 자동선택
        	if ($scope.ds_code.SECTR_ID.length === 1) {
        		$scope.ds_mst.SECTR_ID = $scope.ds_code.SECTR_ID[0].CODE_CD; 
        	}

    		$("#editModal").modal("show");    		

		} else if (name === "UPD") {
			const sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("수정 할 업체를 선택 하세요");
				return;
			}
	    	const param = {
        		querySet	:
        			[
        			 {queryId: "we.std.base.PARTNR_MNG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:sels[0]}
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
    
    //검증
    $scope.lfn_validate =  (name) => {
    	if (name === "SAVE") {
    		if ($scope.ds_mst.ROW_CRUD === "R") {
    			alert("저장 할 내용이 없습니다.");
    			return false;
    		}
    		
    		if (!XUTL.validateInput($("#ds_mst")).isValid) {
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

			console.log("$scope.ds_mst", $scope.ds_mst);
      		
        	let param = {
        		queryId	: "we.std.base.PARTNR_MNG.save",
        		CMD		: name,
        		XML_TEXT: xmlDoc.toXmlString()
        	};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/sp.do",
				data: param 
			}).then( (response) => {
        		alert(successMsg);
        		$scope.lfn_search([{PARTNR_ID:response.RS_MESSAGE}]);
        		$scope.lfn_btn_onClick("edit.CLOSE");
	
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
	
    //마스터 Grid Options
    $scope.mstGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	noUnselect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick", ngDblclick:'lfn_row_onDblClick'}),
		columnDefs		:
			[
			 {displayName:'파트너번호',	field:'PARTNR_ID',		width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'소속',		field:'SECTR_NM',		width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
			 {displayName:'업체명',	field:'PARTNR_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
		 	 {displayName:'약어명',	field:'PARTNR_ABBR_NM',	width:'100',	type:'string',	cellClass:'align_lft',	visible:false},
			 {displayName:'CEO',	field:'CEO',			width:'150',	type:'string',	cellClass:'align_cen'},
			 {displayName:'유형',		field:'PARTNR_TY_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'구분',		field:'PARTNR_GB_NM',	width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
			 {displayName:'사업자번호',	field:'BLNO',			width:'150',	type:'string',	cellClass:'align_cen'},
			 {displayName:'거래처코드',	field:'PARTNR_CD',		width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'업태',		field:'BIZTY',			width:'150',	type:'string',	cellClass:'align_lft'},
			 {displayName:'업종',		field:'BIZGB',			width:'150',	type:'string',	cellClass:'align_lft'},
			 {displayName:'담당자',	field:'CP_NM',			width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
			 {displayName:'사용',		field:'USE_YN_NM',		width:'100',	type:'string',	cellClass:'align_cen'}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "업체목록");
    
    
    //row click event
    $scope.lfn_row_onClick =  (name, entity, grid) => {
    	if (grid.options === $scope.mstGrid) {
    		grid.api.selection.selectRow(entity);
    	}
    }//end-lfn_row_onClick

	$scope.lfn_row_onDblClick =  (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			// grid.api.selection.selectRow(entity);
			$scope.lfn_start_edit("UPD");
		}
	}
    
    //cell click event
    $scope.lfn_cell_onClick =  (name, entity, grid) => {
    }//end-lfn_cell_onClick
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
