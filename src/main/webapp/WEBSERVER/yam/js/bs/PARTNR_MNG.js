/**
 * 파일명	: PARTNR_MNG.js
 * 설명	: 거래처관리 - 거래처등록
 * 
 * 수정일		 	수정자		수정내용
 * 2021.10.18 	정래훈		최초작성
 */
//angular module instance
var app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", function ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {}
	//code set
	$scope.ds_code	= {
		PARTNR_GB	: [],	//거래처구분
		USE_YN		: []	//사용구분
	}
	//조회 조건
	$scope.ds_cond	= {};
	//마스터
	$scope.ds_mst	= {};
	
	//초기화
	$scope.load = function(conf) {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.PARTNR_GB	= XUTL.getCodeFactory().PARTNR_GB;	//거래처구분
		$scope.ds_code.USE_YN		= XUTL.getCodeFactory().USE_YN;	//사용구분
		
		//데이터 초기화
		$scope.lfn_dataset_init();
	}	

    //데이터 초기화
    $scope.lfn_dataset_init = function (name) {
    	$scope.mstGrid.data = $scope.mstGrid.data||[]
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond)
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
    $scope.lfn_btn_show = function (name) {
    	return true;
    }//end-lfn_btn_show

    //버튼 관련 ng-disabled 처리
    $scope.lfn_btn_disabled = function (name) {
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
    $scope.lfn_btn_onClick = function(name, arg1) {
    	if (name === "CLOSE") {
    		top.MDI.closeTab("/yam/bs/PARTNR_MNG");
    		
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

    	} 
    }//end-lfn_btn_onClick
    
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = function (name) {
    	if (name.indexOf("ds_mst.") === 0) {
        	if ($scope.lfn_btn_disabled("SAVE")) {
        		return true;
        	}
    	}
    	if (name === "ds_mst.PARTNR_NO"){
    		if (XUTL.isIn($scope.ds_mst.ROW_CRUD, "R", "U")) {
    			return true;
    		}
    	}
    	
    	return false;
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange = function (name) {
		if (name.indexOf("ds_mst.") === 0) {
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
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
    
    //조회
    $scope.lfn_search = function (sels) {
    	$scope.lfn_dataset_init("MST")
    	var param = {
    		querySet	:
    			[
    			 {queryId: "yam.bs.PARTNR_MNG.selMstList",	queryType:"selList",	dataName:"mstGrid.data",		param:$scope.ds_cond}
    			]
    	}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param 
		}).then(function (response) {
    		$.each(response.success, function(name, data) {
    			XUTL.setWithPath($scope, name, data);
    		});
    		
			//row선택 설정
			if (sels) {
				$timeout(function () {
					NG_GRD.selectRow($scope.mstGridApi, XUTL.findRows($scope.mstGrid.data, "PARTNR_NO", XUTL.getValueMatrix(sels, "PARTNR_NO")[0]));
				});
			} else {
				$timeout(function () {
					NG_GRD.selectRow($scope.mstGrid.gridApi, "first");
				});
			}

		}).finally(function (data) {
			$timeout(function () {
				blockUI.stop();
			});
		});
    }//end-lfn_search

    //업체정보 작성 작업 시작
    $scope.lfn_start_edit = function (name, partnrNo) {
    	$scope.ds_mst		= {}
		if (name === "REG") {
	    	$scope.ds_mst		= {
        		COMPANY_CD	: SS_USER_INFO.COMPANY_CD,
        		ROW_CRUD	: "C"
        	}
    		$("#editModal").modal("show");    		

		} else if (name === "UPD") {
			var sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("수정 할 업체를 선택 하세요");
				return;
			}
			
	    	var param = {
        		querySet	:
        			[
        			 {queryId: "yam.bs.PARTNR_MNG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:{PARTNR_NO:sels[0].PARTNR_NO}}
        			]
        	}

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/mquery.do",
				data: param 
			}).then(function (response) {
	    		$.each(response.success, function(name, data) {
	    			XUTL.setWithPath($scope, name, data);
	    		});
	    		$("#editModal").modal("show");    		
	
			}).finally(function (data) {
				$timeout(function () {
					blockUI.stop();
				});
			});
    	}
    }//end-lfn_start_edit
    
    //검증
    $scope.lfn_validate = function (name) {
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
    $scope.lfn_run = function (name) {
    	var confirmMsg = "저장 하시겠습니까?";
    	var successMsg = "정상적으로 처리완료 되었습니다.";
    	
    	if (confirm(confirmMsg)) {
      		var xmlDoc = new XmlDoc({});
    		xmlDoc.appendXml("mst", $scope.ds_mst);
      		
        	var param = {
        		queryId	: "yam.bs.PARTNR_MNG.save",
        		CMD		: name,
        		XML_TEXT: xmlDoc.toXmlString()
        	};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/sp.do",
				data: param 
			}).then(function (response) {
        		alert(successMsg);
        		$scope.lfn_search([{PARTNR_NO:response.RS_MESSAGE}]);
        		$scope.lfn_btn_onClick("edit.CLOSE");
	
			}).finally(function (data) {
				$timeout(function () {
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
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	noUnselect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
			 {displayName:'파트너번호',		field:'PARTNR_NO',		width:'100',	type:'string',	cellClass:'align_cen'},					
			 {displayName:'업체코드',		field:'PARTNR_CD',		width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'업체명',		field:'PARTNR_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
			 {displayName:'CEO',		field:'CEO',			width:'150',	type:'string',	cellClass:'align_cen'},
			 {displayName:'사업자번호',		field:'BLNO',			width:'150',	type:'string',	cellClass:'align_cen'},
			 {displayName:'업태',			field:'BIZTY',			width:'150',	type:'string',	cellClass:'align_lft'},
			 {displayName:'업종',			field:'BIZGB',			width:'150',	type:'string',	cellClass:'align_lft'},
			 {displayName:'업체구분',		field:'PARTNR_GB_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'담당자',		field:'MNG_CP_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'사용구분',		field:'USE_YN_NM',		width:'100',	type:'string',	cellClass:'align_cen'}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "업체목록");
    
    
    //row click event
    $scope.lfn_row_onClick = function (name, entity, grid) {
    	if (grid.options === $scope.mstGrid) {
    		grid.api.selection.selectRow(entity);
    	}
    }//end-lfn_row_onClick
    
    //cell click event
    $scope.lfn_cell_onClick = function (name, entity, grid) {
    }//end-lfn_cell_onClick
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

}); // control end
