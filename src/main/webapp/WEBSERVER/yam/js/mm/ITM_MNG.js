/**
 * 파일명	: ITM_MNG.js
 * 설명	: 자재마스터 등록
 * 
 * 수정일		 	수정자		수정내용
 * 2021.10.18	정래훈		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {}
	//code set
	$scope.ds_code	= {
		ITM_GRP		: [],	//품목그룹
		ITM_LCAT	: [],	//품목대분류
		ITM_MCAT	: [],	//품목중분류
		ITM_MCAT_F	: [],	//품목중분류
		ITM_SCAT	: [],	//품목소분류
		ITM_SCAT_F	: [],	//품목소분류
		ITM_TY1		: [],	//상태
		ITM_TY2		: [],	//원산지
		ITM_TY3		: [],	//사이즈
		ITM_TY4		: [],	//포장규격
		ITM_TY5		: [],	//구성
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
	$scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
			
		//공통코드
		$scope.ds_code.ITM_GRP		= XUTL.getCodeFactory().ITM_GRP;	 //품목그룹
		$scope.ds_code.ITM_LCAT		= XUTL.getCodeFactory().ITM_LCAT;	 //품목대분류
		$scope.ds_code.ITM_MCAT		= XUTL.getCodeFactory().ITM_MCAT;	 //품목중분류
		$scope.ds_code.ITM_MCAT_F	= [];	//품목중분류
		$scope.ds_code.ITM_SCAT		= XUTL.getCodeFactory("G_CMMN_CODE_LIST_L3").ITM_MCAT;	 //품목소분류
		$scope.ds_code.ITM_SCAT_F	= [];	 //품목소분류
		$scope.ds_code.ITM_TY1		= XUTL.getCodeFactory().ITM_TY1;	 //상태
		$scope.ds_code.ITM_TY2		= XUTL.getCodeFactory().ITM_TY2;	 //원산지
		$scope.ds_code.ITM_TY3		= XUTL.getCodeFactory().ITM_TY3;	 //사이즈
		$scope.ds_code.ITM_TY4		= XUTL.getCodeFactory().ITM_TY4;	 //포장규격
		$scope.ds_code.ITM_TY5		= XUTL.getCodeFactory().ITM_TY5;	 //구성
		$scope.ds_code.PROC_CD		= XUTL.getCodeFactory().PROC_CD;	 //공정코드
		
		$scope.ds_code.USE_YN		= XUTL.getCodeFactory().USE_YN;	 //사용구분
		$scope.ds_code.ITM_GB		= XUTL.getCodeFactory().ITM_GB;	 //품목구분
		$scope.ds_code.QTY_UN		= XUTL.getCodeFactory().QTY_UN;	 //수량단위
		$scope.ds_code.SIO_MNG_GB	= XUTL.getCodeFactory().SIO_MNG_GB; //재고수불관리
			
		//데이터 초기화
		$scope.lfn_dataset_init();
	}	

    //데이터 초기화
    $scope.lfn_dataset_init = (name) => {
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
    $scope.lfn_btn_show = (name) => {
    	return true;
    }//end-lfn_btn_show

    //버튼 관련 ng-disabled 처리
    $scope.lfn_btn_disabled = (name) => {
    	if (!$scope.lfn_btn_show(name)) {
    		return true;
    	}
    	if (name === "UPD") {
    		return $scope.mstGrid.gridApi.selection.getSelectedRows().length === 0;
    	} else if (name == "SAVE") {
    		if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "R", "U")) {
    			return true;
    		}
    	} 

    	return false;
    }//end-lfn_btn_disabled

    //버튼클릭이벤트
    $scope.lfn_btn_onClick = (name, arg1) => {
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
    $scope.lfn_input_disabled = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, "C", "R", "U")) {
				return true;
			}
			if (XUTL.isIn($scope.ds_mst.ROW_CRUD, "R", "U")) {
				// 품목코드 단위, 그룹, 대,중,소분류, 상태, 원산지, 사이즈, 포장규역, 구성 등 품목코드 생성에 관한 것들
				if (XUTL.isIn(name, "ds_mst.ITM_CD","ds_mst.ITM_UN", "ds_mst.ITM_GRP","ds_mst.ITM_LCAT","ds_mst.ITM_MCAT","ds_mst.ITM_SCAT","ds_mst.ITM_TY1","ds_mst.ITM_TY2","ds_mst.ITM_TY3","ds_mst.ITM_TY4","ds_mst.ITM_TY5")) {
					return true;
				}
			}
		}
    	return false;
    	
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange = (name) => {
    	if(name.indexOf("ds_mst.")===0) {
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			
			if(name === "ds_mst.ITM_LCAT") {
				XUTL.empty($scope.ds_code.ITM_MCAT_F, true);
				$.extend($scope.ds_code.ITM_MCAT_F, XUTL.findRows($scope.ds_code.ITM_MCAT, "USRDF_1", [$scope.ds_mst.ITM_LCAT]));
			}
			if(name === "ds_mst.ITM_MCAT") {
				XUTL.empty($scope.ds_code.ITM_SCAT_F, true);
				$.extend($scope.ds_code.ITM_SCAT_F, XUTL.findRows($scope.ds_code.ITM_SCAT, "CODE_CD_L", [$scope.ds_mst.ITM_MCAT]));
			}
			
			if(XUTL.isIn(name, "ds_mst.ITM_GRP","ds_mst.ITM_LCAT","ds_mst.ITM_MCAT","ds_mst.ITM_SCAT","ds_mst.ITM_TY1","ds_mst.ITM_TY2","ds_mst.ITM_TY3","ds_mst.ITM_TY4","ds_mst.ITM_TY5")) {
				if($scope.ds_mst.ITM_GRP && $scope.ds_mst.ITM_LCAT && $scope.ds_mst.ITM_MCAT && $scope.ds_mst.ITM_SCAT && $scope.ds_mst.ITM_TY1 && $scope.ds_mst.ITM_TY2 && $scope.ds_mst.ITM_TY3 && $scope.ds_mst.ITM_TY4 && $scope.ds_mst.ITM_TY5) {
					let prevItmCd = $scope.ds_mst.ITM_CD;
					$scope.ds_mst.ITM_CD = $scope.ds_mst.ITM_GRP
						+ $scope.ds_mst.ITM_LCAT
						+ $scope.ds_mst.ITM_MCAT + "-"
						+ $scope.ds_mst.ITM_SCAT + "-"
						+ $scope.ds_mst.ITM_TY1
						+ $scope.ds_mst.ITM_TY2
						+ $scope.ds_mst.ITM_TY3
						+ $scope.ds_mst.ITM_TY4
						+ $scope.ds_mst.ITM_TY5;

					// 수정일때는 변경하지 않음.
					if ($scope.ds_mst.ROW_CRUD !== 'U') {
						$scope.ds_mst.ITM_NM = XUTL.findRows($scope.ds_code.ITM_GRP, "CODE_CD", $scope.ds_mst.ITM_GRP)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_LCAT, "CODE_CD", $scope.ds_mst.ITM_LCAT)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_MCAT_F, "CODE_CD", $scope.ds_mst.ITM_MCAT)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_SCAT_F, "CODE_CD", $scope.ds_mst.ITM_SCAT)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_TY1, "CODE_CD", $scope.ds_mst.ITM_TY1)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_TY2, "CODE_CD", $scope.ds_mst.ITM_TY2)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_TY3, "CODE_CD", $scope.ds_mst.ITM_TY3)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_TY4, "CODE_CD", $scope.ds_mst.ITM_TY4)[0].CODE_NM + "/"
							+ XUTL.findRows($scope.ds_code.ITM_TY5, "CODE_CD", $scope.ds_mst.ITM_TY5)[0].CODE_NM;
					}
					// 중복검사
					if (prevItmCd !== $scope.ds_mst.ITM_CD) {
						// console.log("----", $scope.ds_mst)
						$scope.lfn_dup_check();
					}
				}
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
    $scope.lfn_search = (sels) => {
    	$scope.lfn_dataset_init("MST")
    	
    	const param = {
    		querySet	:
    			[
    			 {queryId: "yam.mm.ITM_MNG.selMstList",	queryType:"selList",	dataName:"mstGrid.data",		param:$scope.ds_cond}
    			]
    	}
    	
    	blockUI.start();
		XUTL.fetch({
			url	: '/std/cmmn/mquery.do',
			data: param
		}).then((response) => {
    		$.each(response.success, (name, data) => {
    			XUTL.setWithPath($scope, name, data);
    		});
    		
			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "ITM_CD", XUTL.getValueMatrix(sels, "ITM_CD")[0]));
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
    
    //품목정보 작성 작업 시작
    $scope.lfn_start_edit = (name, itm_cd) => {
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
			let sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if (sels.length === 0) {
				alert("수정 할 품목을 선택 하세요");
				return;
			}
			
	    	const param = {
        		querySet	:
        			[
        			 {queryId: "yam.mm.ITM_MNG.selMstInfo",	queryType:"selOne",	dataName:"ds_mst",		param:{ITM_CD:sels[0].ITM_CD}}
        			]
        	}
        	
        	blockUI.start();
    		XUTL.fetch({
    			url	: "/std/cmmn/mquery.do",
    			data: param
    		}).then((response) => {
	    		$.each(response.success, (name, data) => {
	    			XUTL.setWithPath($scope, name, data);
	    		});

	    		//$("#editModal").modal("show");
				$("#editModal").modal({
					backdrop: 'static',
				});

				$timeout(() => {
					// 대/중/소 분류값 설정
					try {
						$scope.lfn_input_onChange('ds_mst.ITM_LCAT');
					} catch (e) {
						// console.log(e)
					}
					try {
						$scope.lfn_input_onChange('ds_mst.ITM_MCAT');
					}
					catch (e) {
						// console.log(e)
					}
				});
	    		
			}).finally((data) => {
    			$timeout(() => {
    				blockUI.stop();
    			});
    		});
	    	
    	}
    }//end-lfn_start_edit

	// 품목코드 중복 체크
	$scope.lfn_dup_check = () => {
		let itmCd = $scope.ds_mst.ITM_CD;
		const param = {
			querySet	:
				[
					{queryId: "yam.mm.ITM_MNG.selDupCheckItmCd",	queryType:"selOne",	dataName:"ds_dup",		param:{ITM_CD:itmCd}}
				]
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param 
		}).then((response) => {
			$.each(response.success, (name, data) => {
				XUTL.setWithPath($scope, name, data);
			});
			if ($scope.ds_dup.DUP_COUNT > 0) {
				alert(itmCd + " 는 중복(등록)된 품목입니다. 다시 선택해주세요");
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_dup_check
    
    //검증
    $scope.lfn_validate = (name) => {
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
    $scope.lfn_run = (name) => {
    	let confirmMsg = "저장 하시겠습니까?";
    	let successMsg = "정상적으로 처리완료 되었습니다.";
    	
    	if (confirm(confirmMsg)) {
      		let xmlDoc = new XmlDoc({});
    		xmlDoc.appendXml("mst", $scope.ds_mst);
      		
        	const param = {
        		queryId	: "yam.mm.ITM_MNG.save",
        		CMD		: name,
        		XML_TEXT: xmlDoc.toXmlString()
        	};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/sp.do",
				data: param 
			}).then((response) => {
        		alert(successMsg);
        		$scope.lfn_search();
				//$scope.ds_mst = {} // 등록조건 리셋. 창닫지 않음.
				$("#editModal").modal('hide');
	
			}).finally((data) => {
				$timeout(() => {
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
				{displayName:'품목명',			field:'ITM_NM',		 	width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'구분',			field:'ITM_GB_NM',		width:'80',		type:'string',	cellClass:'align_cen'},
				{displayName:'단위',			field:'ITM_UN_NM',		width:'70',		type:'string',	cellClass:'align_cen'},
				{displayName:'그룹',			field:'ITM_GRP_NM',		width:'90',		type:'string',	cellClass:'align_cen'},
				{displayName:'중량',			field:'ITM_WT',			width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'용량',			field:'ITM_VOL',		width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'안전재고',		field:'SAF_STOCK_QTY',	width:'80',		type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'유통기한',		field:'EXPRDY',			width:'80',		type:'string',	cellClass:'align_rgt'},
				{displayName:'공정',			field:'PROC_CD_NM',		width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'비고',			field:'REMARKS',		width:'200',	type:'string',	cellClass:'align_lft'},
				{displayName:'사용',			field:'USE_YN',			width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate: NG_CELL.getCheckboxRenderer()}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "품목마스터");
    
    
    //row click event
    $scope.lfn_row_onClick = (name, entity, grid) => {
		grid.api.selection.selectRow(entity);
    }//end-lfn_row_onClick
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

}); // control end
