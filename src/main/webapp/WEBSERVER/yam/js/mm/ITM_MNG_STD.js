/**
 * 파일명	: ITM_MNG.js
 * 설명	: 자재마스터 등록
 * 
 * 수정일		 	수정자		수정내용
 */
//angular module instance
var app = _ANG.instanceBasicModule("mstApp", _ANG.instanceModuleConfigs("ui.calendar", "moment-picker"));
//controller 설정
app.controller("mstCtl", function ($scope, $timeout, $filter, $window, exportUiGridService, uiGridConstants, blockUI) {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {}
	//code set
	$scope.ds_code	= {
		ITM_GRP		: [],	//품목그룹
		PROC_CD		: [],	//공정코드
		
		USE_YN		: [],	//사용구분
		ITM_GB		: [],	//품목구분
		QTY_UN		: [],	//수량단위
		SIO_MNG_GB	: []	//재고수불관리구분
	}
	//조회 조건
	$scope.ds_cond	= {
		ITM_GBS		: [],	//품목구분
		ITM_GRPS	: []	//품목그룹
	};
	//마스터
	$scope.ds_mst	= {};
	// 중복체크
	$scope.ds_dup  	= {};
	
	//초기화
	$scope.load = function(conf) {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
			
		//공통코드
		$scope.ds_code.ITM_GRP		= XUTL.getCodeFactory().ITM_GRP;	 //품목그룹
		$scope.ds_code.PROC_CD		= XUTL.getCodeFactory().PROC_CD;	 //공정코드
		
		$scope.ds_code.USE_YN		= XUTL.getCodeFactory().USE_YN;	 //사용구분
		$scope.ds_code.ITM_GB		= XUTL.getCodeFactory().ITM_GB;	 //품목구분
		$scope.ds_code.QTY_UN		= XUTL.getCodeFactory().QTY_UN;	 //수량단위
		$scope.ds_code.SIO_MNG_GB	= XUTL.getCodeFactory().SIO_MNG_GB; //재고수불관리
			
		//데이터 초기화
		$scope.lfn_dataset_init();
	}	

    //데이터 초기화
    $scope.lfn_dataset_init = function (name) {
    	$scope.mstGrid.data = $scope.mstGrid.data||[]
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond, true);
 			XUTL.addRows($scope.ds_cond.ITM_GBS, XUTL.getValueMatrix($scope.ds_code.ITM_GB, "CODE_CD")[0]);	//품목구분목록
 			XUTL.addRows($scope.ds_cond.ITM_GRPS, XUTL.getValueMatrix($scope.ds_code.ITM_GRP, "CODE_CD")[0]);	//품목그룹목록
        	$scope.ds_cond.USE_YN = 'Y';
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
    	} else if (name === "SAVE") {
    		if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "R", "U")) {
    			return true;
    		}
    	} 

    	return false;
    }//end-lfn_btn_disabled

    //버튼클릭이벤트
    $scope.lfn_btn_onClick = function(name, arg1) {
    	if (name === "CLOSE") {
    		top.MDI.closeTab("/yam/mm/ITM_MNG");
    		
    	} else if (name === "SEARCH") {
           	$scope.lfn_search();
           	
    	} else if (XUTL.isIn(name, "REG", "UPD")) {
    		$scope.lfn_start_edit(name, arg1);
    		
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
			if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "R", "U")) {
				return true;
			}
			if (XUTL.isIn($scope.ds_mst.ROW_CRUD, "R", "U")) {
				// 업데이트이면 품목코드는 수정불가
				if (XUTL.isIn(name, "ds_mst.ITM_CD")) {
					return true;
				}
			}
		}
    	return false;
    	
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange = function (name) {
    	if(name.indexOf("ds_mst.")===0) {
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			// 중복검사
			if(name === "ds_mst.ITM_CD") {
				$scope.lfn_dup_check();
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
    			 {queryId: "yam.mm.ITM_MNG.selMstList",	queryType:"selList",	dataName:"mstGrid.data",		param:$scope.ds_cond}
    			]
    	}
    	
    	blockUI.start();
		XUTL.fetch({
			url	: '/std/cmmn/mquery.do',
			data: param
		}).then(function (response) {
    		$.each(response.success, function(name, data) {
    			XUTL.setWithPath($scope, name, data);
    		});
    		
			//row선택 설정
			if (sels) {
				var rows = []
				$.each(sels, function (idx, sel) {
					XUTL.addRows(rows, XUTL.findRows($scope.mstGrid.data, "ITM_CD", sel.ITM_CD));
				});
				$timeout(function () {
					_GRD.selectRow($scope.mstGrid.gridApi, rows);
				});
			} else {
				if ($scope.mstGrid.data.length > 0) {
					$timeout(function () {
						_GRD.selectRow($scope.mstGrid.gridApi, $scope.mstGrid.data[0]);
					});
				}
			}
		}).finally(function (data) {
			$timeout(function () {
				blockUI.stop();
			});
		});
    }//end-lfn_search
    
    //품목정보 작성 작업 시작
    $scope.lfn_start_edit = function (name, itm_cd) {
    	$scope.ds_mst		= {}
		if (name === "REG") {
	    	$scope.ds_mst		= {
        		COMPANY_CD	: SS_USER_INFO.COMPANY_CD,
        		USE_YN		: "Y", 	//사용구분:사용가능 자동선택
        		SIO_MNG_GB	: "10",	//재고수불구분:일반 자동선택
        		ROW_CRUD	: "C"
        	}

			// $("#editModal").modal("show");
			$("#editModal").modal({
				backdrop: 'static',
			});

		} else if (name === "UPD") {
			var sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("수정 할 품목을 선택 하세요");
				return;
			}
			
	    	var param = {
        		querySet	:
        			[
        			 {queryId: "yam.mm.ITM_MNG.selMstInfo",	queryType:"selOne",	dataName:"ds_mst",		param:{ITM_CD:sels[0].ITM_CD}}
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

	    		//$("#editModal").modal("show");
				$("#editModal").modal({
					backdrop: 'static',
				});

				$timeout(function () {
				});
	    		
			}).finally(function (data) {
    			$timeout(function () {
    				blockUI.stop();
    			});
    		});
	    	
    	}
    }//end-lfn_start_edit

	// 품목코드 중복 체크
	$scope.lfn_dup_check = function () {
		var itmCd = $scope.ds_mst.ITM_CD;
		var param = {
			querySet	:
				[
					{queryId: "yam.mm.ITM_MNG.selDupCheckItmCd",	queryType:"selOne",	dataName:"ds_dup",		param:{ITM_CD:itmCd}}
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
			if ($scope.ds_dup.DUP_COUNT > 0) {
				alert(itmCd + " 는 중복(등록)된 품목입니다. 다시 선택해주세요");
			}

		}).finally(function (data) {
			$timeout(function () {
				blockUI.stop();
			});
		});
	}//end-lfn_dup_check
    
    //검증
    $scope.lfn_validate = function (name) {
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
        		queryId	: "yam.mm.ITM_MNG.save",
        		CMD		: name,
        		XML_TEXT: xmlDoc.toXmlString()
        	};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/sp.do",
				data: param 
			}).then(function (response) {
        		alert(successMsg);
        		$scope.lfn_search();
				//$scope.ds_mst = {} // 등록조건 리셋. 창닫지 않음.
				$("#editModal").modal('hide');
	
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
		enableRowHeaderSelection: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
    	noUnselect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/mm/ITM_MNG/mstGrid",
		columnDefs		:
			[
				{displayName:'품목코드',		field:'ITM_CD',			width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목명',		field:'ITM_NM',		 	width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'구분',			field:'ITM_GB_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
				{displayName:'단위',			field:'ITM_UN_NM',		width:'70',		type:'string',	cellClass:'align_cen'},
				{displayName:'그룹',			field:'ITM_GRP_NM',		width:'90',		type:'string',	cellClass:'align_cen'},
				{displayName:'중량',			field:'ITM_WT',			width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'용량',			field:'ITM_VOL',		width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'안전재고',		field:'SAF_STOCK_QTY',	width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'유통기한',		field:'EXPRDY',			width:'80',		type:'string',	cellClass:'align_rgt'},
				{displayName:'공정',			field:'PROC_CD_NM',		width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'비고',			field:'REMARKS',		width:'200',	type:'string',	cellClass:'align_lft'},
				{displayName:'사용',			field:'USE_YN',			width:'50',		type:'string',	cellClass:'align_cen'}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "품목마스터");
    
    
    //row click event
    $scope.lfn_row_onClick = function (name, entity, grid) {
		grid.api.selection.selectRow(entity);
    }//end-lfn_row_onClick
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

}); // control end
