/**
 * 파일명	: SC_REG.js
 * 설명	: 재고실사등록
 * 수정일		        수정자		수정내용
 * 2021.11.04		zno 	최초작성
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
	//code set
	$scope.ds_code	= {
		SC_GB		: [],	//재고실사구분
		WH_CD		: [],	//창고코드
		SC_STOCK_GB	: []	//재고실사재고구분
	};
	//조회 조건
	$scope.ds_cond	= {
	};

	//마스터
	$scope.ds_mst	= {}
	//삭제목록
	$scope.ds_del	= []

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf					= conf||{};
		$scope.ds_conf.paramSet 		= XUTL.getRequestParamSet();
		$scope.ds_conf.paramSet.CMD		= $scope.ds_conf.paramSet.CMD||"REG";

		//공통코드
		$scope.ds_code.SC_GB			= XUTL.getCodeFactory().SC_GB;			//재고실사구분
		$scope.ds_code.WH_CD			= XUTL.getCodeFactory().WH_CD;			//창고코드
		$scope.ds_code.SC_STOCK_GB		= XUTL.getCodeFactory().SC_STOCK_GB;	//재고실사재고구분

		//데이터 초기화
		$scope.lfn_dataset_init();
		$scope.lfn_load_base();
		
		if ($scope.ds_conf.paramSet.CMD === "REG") {
			$scope.ds_mst.SECTR_ID	= SS_USER_INFO.SECTR_ID;
			$scope.ds_mst.SC_DY 	= moment().format('YYYY-MM-DD');
			$scope.ds_mst.SC_GB		= "10";
			$scope.ds_mst.SC_ST		= "10";
			$scope.ds_mst.ROW_CRUD	= "C"
		} else {
			$scope.lfn_search();
		}
		
		// //유저 구분에 따라 조회조건 창고코드 disabled
		// if (!XUTL.isIn(SS_USER_INFO.USER_GUBUN,'10')) {
		// 	$scope.ds_mst.WH_CD = SS_USER_INFO.WH_CD;
		// }
	}

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
			$scope.ds_cond.SECTR_ID = SS_USER_INFO.SECTR_ID;
			if ($scope.ds_conf.paramSet.CMD !== "REG") {
				$scope.ds_cond.SC_ID = $scope.ds_conf.paramSet.SC_ID;
			}
		}		
		if (!name || name === "MST"){
			XUTL.empty($scope.ds_mst);
			XUTL.empty($scope.ds_del);
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
		if (!$scope.ds_mst.SC_ST || $scope.ds_mst.SC_ST === "40") { //완료
			return false;
		}
 
		// 등록 상태면 삭제, 요청 버튼 활성화
		// 요청 상태면 요청버튼 숨김 요청취소버튼 활성
		// 확정 상태면 확정버튼 숨김 확정취소 버튼 활성
		// 완료상태면 위에서 처리 -> 모두 숨김
		switch (name) {
			case "REG":
				return $scope.ds_mst.ROW_CRUD === 'C';
			case "DEL":
			case "REQ": // SC_ST 10 일 경우
				return  $scope.ds_mst.ROW_CRUD !== 'C' && $scope.ds_mst.SC_ST === '10';
			case "REQ_CANCEL": // SC_ST 20 일 경우: 요청 취소 버튼과 확정버튼
			case "CONFIRM":
				return $scope.ds_mst.SC_ST === '20';
			case "CONFIRM_CANCEL": // SC_ST 30 이면 : 확정 취소버튼과 완료버튼
			case "DONE":
				return $scope.ds_mst.SC_ST === '30';
			case "SAVE":
				return $scope.ds_mst.SC_ST === '20';
		}

		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		// 확정이면
		if (!$scope.lfn_btn_show(name)){
			return true;
		}
		let editable 		= XUTL.isIn($scope.ds_mst.SC_ST,   "20") ;		    // 요청단계인지 -> 편집가능.
		let readable 		= XUTL.isIn($scope.ds_mst.ROW_CRUD, "R", "U");		// mst 의 상태확인 C 신규, R,U는 재고실사가 조회가 된 상태
		let disabled 		= true; // false 가 활성화
		switch(name) {
			case "REG": // 재고실사등록 CRUD === "C" 일 때만 false => 활성화
				disabled 	= !($scope.ds_mst.ROW_CRUD === "C");
				break;
			case "DEL": // 삭제. 임시저장 && 조회가 된 상태
				disabled 	= !(XUTL.isIn($scope.ds_mst.SC_ST, "10") && readable);
				break;
			case "SAVE": 	// 저장. 편집가능 && 조회가 된 상태
				disabled 	= !(editable && readable);
				break;
			case "REQ": 	// 요청. 편집가능 && 조회가 된 상태 && ST == '10'
				disabled 	= !(XUTL.isIn($scope.ds_mst.SC_ST, "10") && readable);
				break;
			case "REQ_CANCEL": 	// 요청취소.  ST == '20'
				disabled 	= !(XUTL.isIn($scope.ds_mst.SC_ST, "20") && readable);
				break;
			case "CONFIRM": // 확정. 편집가능 && 조회가 된 상태 && ST == '20'
				disabled	= !(XUTL.isIn($scope.ds_mst.SC_ST, "20") && readable);
				break;
			case "CONFIRM_CANCEL": // 확정. 편집가능 && 조회가 된 상태 && ST == '30'
				disabled	= !(XUTL.isIn($scope.ds_mst.SC_ST, "30") && readable);
				break;
			case "DONE": 	// 완료. ST == '30'
				disabled 	= !(XUTL.isIn($scope.ds_mst.SC_ST, "30"));
				break;
			case "sub.ADD": // 목록 추가. 임시저장이고 조회가 된 상태 == SAVE
				disabled 	= !(editable && readable);
				break;
			case "sub.DEL": // 목록 삭제. 재고실사재고구분이 신규 && ST < 30 일 경우만 삭제 가능
				disabled 	= !( readable && editable &&  $scope.subGrid.gridApi.selection.getSelectedRows().length > 0 && $scope.subGrid.gridApi.selection.getSelectedRows()[0].SC_STOCK_GB === "20");
				break;
			default:
				break;
		}
		return disabled;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/wm/SC_REG");

		} else if (XUTL.isIn(name, "sub.ADD")) {
			_YAM.popupItm({multiple: true, FIX_ITM_GB:""})
			.then((response) => {
				let dupEntities = [];
				$.each(response, (idx, entity) => {
					let find = XUTL.findRows($scope.subGrid.data, "ITM_CD", entity.ITM_CD);
					if (find.length === 0) {	//중복되지 않은 품목만 추가
						$timeout(() => {
							$scope.subGrid.data.unshift({
								ROW_CRUD		: "C",
								ITM_CD			: entity.ITM_CD,
								ITM_NM			: entity.ITM_NM,
								ITM_GB_NM		: entity.ITM_GB_NM,
								SC_UN			: entity.ITM_UN,
								SC_STOCK_GB		: "20",	//실사재고 신규
								SC_STOCK_GB_NM	: XUTL.getCodeName($scope.ds_code.SC_STOCK_GB, "20"),
								STOCK_QTY		: 0,
								SC_QTY			: 0,
							});
						});
					} else {
						dupEntities.push(entity);
					}
				});
				if (dupEntities.length > 0) {
					alert("중복된 품목 " + dupEntities.length + "건은 제외 되었습니다.");
				}
			});
    		
		} else if (XUTL.isIn(name, "sub.DEL")) {
			let sels = $scope.subGrid.gridApi.selection.getSelectedRows();
			XUTL.addRows($scope.ds_del, XUTL.findRows(sels, "ROW_CRUD", ["R", "U"]));
    		XUTL.removeRows($scope.subGrid.data, sels);

		} else if (XUTL.isIn(name, "REG", "REQ", "SAVE", "DEL", "CONFIRM", "DONE", "CANCEL")) {
			let isValid = $scope.lfn_validate(name);
			if (isValid){
				$scope.lfn_run(name)
			}
		}



	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		// if (name === "ds_mst.WH_CD") {
		// 	if (!XUTL.isIn(SS_USER_INFO.USER_GUBUN,'10')) {
		// 		return true;
		// 	}
		// }

		// if (!$scope.lfn_btn_show("SAVE")){
		// 	return true;
		// }
		// 완료면 모두 비활성화
		if (XUTL.isIn($scope.ds_mst.SC_ST, '40')) {
			return true;
		}

		if (name.indexOf("ds_mst.") === 0){
			if ($scope.ds_mst.ROW_CRUD === "C") {	//신규일 경우만 에디팅
				return false;
			}
			// 비고는 활성화
			if (name === "ds_mst.REMARKS") {
				return false;
			}
		}

		return true;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		if (name.indexOf("ds_mst.") === 0){
			if ($scope.ds_mst.ROW_CRUD === "R"){
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
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = (sels) => {
		$scope.lfn_dataset_init("MST");
		
		const param ={
			querySet	:
				[
				 {queryId: "yam.wm.SC_REG.selMst",			queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.wm.SC_REG.selMstList",		queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond},
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

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search

	//검증
	$scope.lfn_validate = (name) => {
		let validateMst = XUTL.validateInput($("#ds_mst"));
		if (name === "REG") { //등록
			//master input check
			if (!validateMst.isValid) {
				return false;
			}

		} else if (XUTL.isIn(name, "SAVE", "REQ", "CONFIRM", "DONE")) {
    		if ($scope.subGrid.data.length === 0) {
    			alert("재고실사 목록을 작성 하세요.");
    			return false;
    		}
			//master input check
			if (!validateMst.isValid) {
				return false;
			}
			//grid data check
    		if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
    		}
    		// if (name === "CONFIRM" && SS_USER_INFO.USER_GUBUN != "10") {
    		// 	alert("확정 권한이 없습니다.");
    		// 	return false;
    		// }

		} else if (name === "DEL") {
		} else if (name === "CANCEL") {
		} else{
			alert("unknown cmd:"+name)
			return false;
		}
		return true;
	}//end-lfn_validate

	//실행
	$scope.lfn_run = (name) => {
		let confirmMsg = "저장 하시겠습니까?";
		let successMsg = "정상적으로 처리완료 되었습니다.";
		
		if (name === "REG") {
			confirmMsg = "재고실사를 신규 등록 하시겠습니까?";
		} else if (name === "REQ") {
			confirmMsg = "재고실사를 요청 하시겠습니까?";
		} else if (name === "CONFIRM") {
			confirmMsg = "재고실사를 확정 하시겠습니까?";
		} else if (name === "CANCEL") {
			let st_nm = $scope.ds_mst.SC_ST === '20' ? "요청" : "확정";
			confirmMsg = "재고실사를 " + st_nm  + " 취소 하시겠습니까?";
		}  else if (name === "DONE") {
			confirmMsg = "재고실사를 완료 하시겠습니까?";
		} else if (name === "DEL") {
			confirmMsg = "재고실사를 삭제 하시겠습니까?";
		}

		if (confirm(confirmMsg)) {
			let xmlDoc 	= new XmlDoc({});
			xmlDoc.appendXml("mst", $scope.ds_mst);

			if (XUTL.isIn(name, "SAVE", "REQ", "CONFIRM", "DONE")) {
				xmlDoc.appendXml("sub", XUTL.findRows($scope.subGrid.data, "ROW_CRUD", ["U", "C"]));
				xmlDoc.appendXml("del", $scope.ds_del);
			}

			const param = {
				queryId	: "yam.wm.SC_REG.save",
				CMD		: name,
				XML_TEXT: xmlDoc.toXmlString()
			};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/sp.do",
				data: param 
			}).then((response) => {
				alert(successMsg);
				if (name === "DEL") {
					// 삭제면 페이지 초기화
					$scope.load();
				} else {
					$scope.ds_cond.SC_ID = response.RS_MESSAGE;
					$scope.lfn_search();
				}
	
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
	//숫자(포맷)
    let numfCell = NG_CELL.getNumFormatCell({
    	permanent		: true,
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange",
    	selectOnFocus	: true,
    	digit			: 0,
    	sign			: true
    });


	//서브 Grid Options [재고실사품목:ITM]
	$scope.subGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		noUnselect				: true,
		enableFiltering			: true,
		enableGridMenu			: true,
		rowTemplate				: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId			: "/yam/wm/SC_REG/subGrid",
		columnDefs:
			[
				{displayName:'품목코드',	field:'ITM_CD',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'품명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'구분',		field:'ITM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'단위',		field:'SC_UN',			width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'실사수량',	field:'SC_QTY',			width:'100',	type:'string',	cellClass:'align_rgt', cellFilter: "number", cellTemplate:numfCell },
				{displayName:'전산재고',	field:'STOCK_QTY',		width:'100',	type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'차이수량',	field:'DIFF_QTY',		width:'100',	type:'string',	cellClass:'align_rgt', cellFilter: "number"},
				{displayName:'단가',		field:'SC_PRC',			width:'100',	type:'string',	cellClass:'align_rgt', cellTemplate:numfCell },
				{displayName:'재고구분',	field:'SC_STOCK_GB_NM',	width:'100',	type:'string',	cellClass:'align_cen'},
			]
	});	NG_GRD.addExcelExportMenu($scope.subGrid, "재고실사품목");


	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		grid.api.selection.selectRow(entity);
	}//end-lfn_row_onClick

	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		// if (!$scope.lfn_btn_show("SAVE") || $scope.lfn_btn_disabled('SAVE')){
		// 	return true;
		// }
		// 요청 이후 확정 전에서만 편집 가능
		if ($scope.ds_mst.SC_ST !== '20') {
			return true;
		}
		return false;
	}//end-lfn_cell_disabled

	//data change event. 실사수량 수정
	$scope.lfn_cell_onChange = (name, entity, grid) => {
		if (entity.ROW_CRUD === "R") {
			entity.ROW_CRUD = "U"
		}
		if (name === "SC_QTY") { // 실사수량이 변경되면 차이 재계산
			entity.DIFF_QTY = XUTL.toNum(entity.STOCK_QTY) - XUTL.toNum(entity.SC_QTY)
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
