/**
 * 파일명	: PWP_REG.js
 * 설명	: 작업실적등록
 *
 * 수정일			수정자		수정내용
 * 2021.11.04	염국선		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};
	//code dataset
	$scope.ds_code	= {
		PWO_GB		: [],	//작업지시구분
		PROD_TM		: [],	//생산집계차수
		PROC_CD		: [],	//공정코드
		WH_CD		: [],	//창고코드
		PWO_ST		: [],	//작업지시상태
		PWP_ST		: [],	//작업실적상태
		QTY_UN		: [],	//수량단위
		//load-------------------------
		HR_CD		: [],	//시간
		MT_CD		: []	//분
	};
	//조회조건 dataset
	$scope.ds_cond	= {};
	//마스터 dataset
	$scope.ds_mst	= {};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		$scope.ds_conf.paramSet.CMD	= $scope.ds_conf.paramSet.CMD||"REG";

		//공통코드
		$scope.ds_code.PWO_GB		= XUTL.getCodeFactory().PWO_GB;		//작업지시구분
		$scope.ds_code.PROD_TM		= XUTL.getCodeFactory().PROD_TM;	//생산집계차수
		$scope.ds_code.PROC_CD		= XUTL.getCodeFactory().PROC_CD;		//공정코드
		$scope.ds_code.WH_CD		= XUTL.getCodeFactory().WH_CD;			//창고코드
		$scope.ds_code.PWO_ST		= XUTL.getCodeFactory().PWO_ST;		//작업지시상태
		$scope.ds_code.PWP_ST		= XUTL.getCodeFactory().PWP_ST;		//작업실적상태
		$scope.ds_code.QTY_UN		= XUTL.getCodeFactory().QTY_UN;		//수량단위
		$scope.ds_code.HR_CD		= _YAM.getHrCd();						//시간
		$scope.ds_code.MT_CD		= _YAM.getMtCd();						//분

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		
		if ($scope.ds_cond.PWP_ID) {	//작업실적번호 있을 경우 조회
			$scope.lfn_search();
		} else if ($scope.ds_cond.PWO_ID) {	//작업지시번호 있을 경우 작업실적등록을 위한 조회
			$scope.lfn_search_as_new($scope.ds_cond.PWO_ID);
		}
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
			$scope.ds_cond.PWP_ID = $scope.ds_conf.paramSet.PWP_ID;
			$scope.ds_cond.PWO_ID = $scope.ds_conf.paramSet.PWO_ID;
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.ds_mst);
			$scope.lfn_dataset_init("SUB");
		}
		
		if (name === "SUB"){
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
		if ($scope.ds_conf.paramSet.CMD !== "REG") {
			return false;
		}
		
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		if (!$scope.lfn_btn_show(name)){
			return true;
		}

		if (!$scope.ds_mst.ROW_CRUD) {
			return true;
		}

		if (XUTL.isIn(name, "SAVE", "ds_mst.PWP_CP_ID")) {
			return !($scope.ds_mst.ROW_CRUD === "C" || XUTL.isIn($scope.ds_mst.PWP_ST, "10"));	//10:임시저장

		} else if (XUTL.isIn(name, "CONFIRM", "ds_mst.PWP_CP_ID")) {
			return !(XUTL.isIn($scope.ds_mst.PWP_ST, "20"));	//

		} else if (name === "DEL") {
			return !(XUTL.isIn($scope.ds_mst.PWP_ST, "20"));

		} else if (name === "CANCEL") {
			return !(XUTL.isIn($scope.ds_mst.PWP_ST, "30"));	//30:확정
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/pc/PWP_REG");

		} else if (XUTL.isIn(name, "SAVE", "DEL")) {
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}

		} else if (XUTL.isIn(name, "CONFIRM", "CANCEL")) {	//확정/취소
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}

		} else if (name === "ds_mst.PWP_CP_ID") {	//담당자 선택팝업
			_YAM.popupUSER({})
			.then((response) => {
				$timeout(() => {
					//$scope.ds_mst.PWP_CP_ID = response.USER_ID;
                    $scope.ds_mst.PWP_CP_ID = response.MEM_ID;
					$scope.ds_mst.PWP_CP_NM = response.USER_NM;
				});
			});
			
		}

	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			if ($scope.lfn_btn_disabled("SAVE") && $scope.lfn_btn_disabled("CONFIRM")) {
				return true;
			}
		}
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		console.log(name)
		if (name.indexOf("ds_mst.") === 0) {
			//일자의 첫 바인딩 이벤트는 제외시킴
			if (name === "ds_mst.PWP_S_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_PWP_S_DY")) {
					$scope.ds_mst._OLD_PWP_S_DY = $scope.ds_mst.PWP_S_DY;
					return;
				}
			} else if (name === "ds_mst.PWP_E_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_PWP_E_DY")) {
					$scope.ds_mst._OLD_PWP_E_DY = $scope.ds_mst.PWP_E_DY;
					return;
				}
			}
			
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			
			if (name === "ds_mst.PWP_S_DY") {
				$scope.ds_mst._OLD_PWP_S_DY = $scope.ds_mst.PWP_S_DY;
			} else if (name === "ds_mst.PWP_E_DY") {
				$scope.ds_mst._OLD_PWP_E_DY = $scope.ds_mst.PWP_E_DY;
			}
		}
	}//end-lfn_input_onChange

	//입력필드 ng-enter 처리
	$scope.lfn_input_onEnter = (name) => {
		if (name === "ds_cond.PWO_ID") {
			if ($scope.ds_cond.PWO_ID) {
				$scope.lfn_search_as_new($scope.ds_cond.PWO_ID);
			}
		}
	}//end-lfn_input_onEnter
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	//시분 분리
	$scope.lfn_parse_hm = () => {
		$scope.ds_mst.PWP_S_HR = $scope.ds_mst.PWP_S_HM ? $scope.ds_mst.PWP_S_HM.substring(0,2) : ""; 
		$scope.ds_mst.PWP_S_MT = $scope.ds_mst.PWP_S_HM ? $scope.ds_mst.PWP_S_HM.substring(3,5) : "";
		$scope.ds_mst.PWP_E_HR = $scope.ds_mst.PWP_E_HM ? $scope.ds_mst.PWP_E_HM.substring(0,2) : ""; 
		$scope.ds_mst.PWP_E_MT = $scope.ds_mst.PWP_E_HM ? $scope.ds_mst.PWP_E_HM.substring(3,5) : "";
	}//end-lfn_parse_hm

	//시분 병합
	$scope.lfn_merge_hm = () => {
		$scope.ds_mst.PWP_S_HM = $scope.ds_mst.PWP_S_HR + ":" + $scope.ds_mst.PWP_S_MT; 
		$scope.ds_mst.PWP_E_HM = $scope.ds_mst.PWP_E_HR + ":" + $scope.ds_mst.PWP_E_MT; 
	}//end-lfn_merge_hm
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST")

		let param = {
			querySet	:
				[
				 {queryId: "yam.pc.PWP_REG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.pc.PWP_REG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond}
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
			$timeout(() => {
				$scope.lfn_parse_hm();	//시분분리
				// 확정,확정취소 상태일 경우 재고현황 안보여줌
				if ($scope.ds_mst.PWP_ST >= '30') {
					$scope.subGrid.gridApi.grid.columns.forEach((col, index) => {
						if (col.field === 'STOCK_QTY' && col.visible) {
							col.hideColumn();
						}
					})
				}
			});

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search

	//조회(신규등록을 위한 작업지시번호로 조회)
	$scope.lfn_search_as_new = (pwoId) => {
		$scope.lfn_dataset_init("MST")

		let param = {
			querySet	:
				[
				 {queryId: "yam.pc.PWP_REG.selNewMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:{PWO_ID:pwoId}},
				 {queryId: "yam.pc.PWP_REG.selNewSubList",	queryType:"selList",	dataName:"subGrid.data",	param:{PWO_ID:pwoId}}
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
			$timeout(() => {
				$scope.lfn_parse_hm();	//시분분리
			});

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search_as_new

	//검증
	$scope.lfn_validate = (name) => {
		if (name === "SAVE" || name === "CONFIRM") {
			//마스터 체크
			if (!XUTL.validateInput($("#ds_mst")).isValid){
				return false;
			} else if ($scope.ds_mst.PWO_GB === "10" && !$scope.ds_mst.PROD_TM) {	//10:주문생산시 주문차수 입력
				alert("주문차수를 선택 하세요.");
				return false;
			}
			
			//그리드 체크
    		if ($scope.subGrid.data.length === 0) {
    			alert("투입품목을 등록 하세요.");
    			return false;
    		} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
    		}
			// 확정시 재고수량 검증
			if (name === "CONFIRM") {
				let inValidData = $scope.subGrid.data.filter((item) => item.PWP_IN_QTY > item.STOCK_QTY);
				if (inValidData.length > 0) {
					alert('재고가 부족한 투입품목 ' + inValidData.length + ' 건이 존재합니다');
					return false;
				}
			}

		} else if (name === "CANCEL") {
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
		let successMsg = "정상적으로 처리완료 되었습니다.";
		if (name === "CONFIRM") {
			confirmMsg = "확정처리 하시겠습니까?";
		} else if (name === "CANCEL") {
			confirmMsg = "확정취소 하시겠습니까?";
		} else if (name === "DEL") {
			confirmMsg = "삭제 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}

		$scope.lfn_merge_hm();	//시분병합
		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.ds_mst);
		console.log(xmlDoc)
		//확정처리시 입고항목정보 추가
		if (name === "SAVE" || name === "CONFIRM") {
			// 필수항목만 추가
			let addCols = [
				'PWO_ID','PWO_NO', 'PWO_SN', 'PWO_IN_QTY', 'PWP_IN_PROC_CD', 'PWP_IN_ITM_ID', 'PWP_IN_ITM_CD', 'PWP_IN_QTY', 'ROW_CRUD', 'PWP_IN_ITM_UN', 'OD_ID', 'OD_SN'
			];
			let gridData = XUTL.copyRows($scope.subGrid.data, addCols);
			xmlDoc.appendXml("list", gridData);
		}

		let param = 
			{
				queryId	: "yam.pc.PWP_REG.save",
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
				$scope.ds_cond.PWP_ID = response.RS_MESSAGE;
				$scope.lfn_search();
				XUTL.sendTopMessage("CHANGE_PWO", {});	//작업지시 변경 브로드캐스팅
				XUTL.sendTopMessage("CHANGE_PWP", {});	//작업실적 변경 브로드캐스팅
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
	//문자열
    let inputCell = NG_CELL.getEditCell({
    	permanent	: true,
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange",
    	attributes	: ["kr-cell"]
    });
	//숫자(포맷)
    let numfCell = NG_CELL.getNumFormatCell({
    	permanent		: true,
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange",
    	selectOnFocus	: true,
    	digit			: 2,
    	sign			: true
    });
	//
	let stockStatusColorBox = NG_CELL.getColorRenderer({
		map			: {
			"10" : "navy",		//
			"20" : "red",	// 재고부족
		},
		colorField	: "STOCK_STATUS",
		labelVisible: true
	});
    //sub Grid Options
	$scope.subGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering	: false,
		multiSelect		: true,
		customStateId	: "/yam/pc/PWP_REG/mstGrid",
		onRegisterApi	:
			(gridApi) => {

			},
		rowTemplate		: NG_CELL.getRowTemplate({}),
		columnDefs		:
			[
			 {displayName:'순번',		field:'ROW_NUM',			width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate:NG_CELL.getRowNumRenderer()},
			 {displayName:'품목코드',	field:'PWP_IN_ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen',	validTypes:"required"},
			 {displayName:'품목명',		field:'PWP_IN_ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
			 {displayName:'단위',		field:'PWP_IN_ITM_UN',		width:'80',		type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN'},
			 {displayName:'지시수량',	field:'PWO_IN_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'number'},
			 {displayName:'투입수량',	field:'PWP_IN_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell,	validTypes:"required"},
			 {displayName:'재고',		field:'STOCK_QTY',			width:'120',	type:'string',	cellClass:'align_rgt',	cellFilter:'number', 	cellTemplate:stockStatusColorBox},
			 {displayName:'공정',		field:'PWP_IN_PROC_CD_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'지시사항',	field:'PWO_IN_REMARKS',		width:'300',	type:'string',	cellClass:'align_lft'},
			 {displayName:'비고',		field:'PWP_IN_REMARKS',		width:'300',	type:'string',	cellClass:'align_lft',	cellTemplate:inputCell},
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "작업실적 투입품목");

	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		if (grid.options === $scope.subGrid) {
			return $scope.lfn_btn_disabled("SAVE") && $scope.lfn_btn_disabled("CONFIRM");
		}
		return false;
	}//end-lfn_cell_disabled

	//cell click event
    $scope.lfn_cell_onClick = (name, entity, grid) => {
    }//end-lfn_cell_onClick
    
	//data change event
	$scope.lfn_cell_onChange = (name, entity, grid) => {
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

});// control end
