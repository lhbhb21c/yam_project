/**
 * 파일명	: WHIN_REG.js
 * 설명	: 입고등록
 *
 * 수정일			수정자		수정내용
 * 2021.10.15	염국선		최초작성
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
		WH_CD		: [],	//창고코드
		WHIN_GB		: [],	//입고구분
		WHIN_ST		: [],	//입고상태
		QTY_UN		: [],	//수량단위
		//load or filter//////////////////
		WHIN_GB_F	: [],	//입고구분(필터된 에디터용, 전체/등록가능)
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
		$scope.ds_code.WH_CD		= XUTL.getCodeFactory().WH_CD;			//창고코드
		$scope.ds_code.WHIN_GB		= XUTL.getCodeFactory().WHIN_GB;		//입고구분
		$scope.ds_code.WHIN_ST		= XUTL.getCodeFactory().WHIN_ST;		//입고상태
		$scope.ds_code.QTY_UN		= XUTL.getCodeFactory().QTY_UN;		//수량단위
		$scope.ds_code.WHIN_GB_F	= $.extend([], $scope.ds_code.WHIN_GB);	//창고코드(필터된 에디터용, 전체/등록가능)

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//입고번호 있을 경우 조회
		if ($scope.ds_cond.WHIN_ID) {
			$scope.lfn_search();
		} else if (!XUTL.isEmpty($scope.ds_conf.paramSet.OD_ID)) {
			// 출하지시에서 넘어온 경우
			if ($scope.ds_conf.paramSet.OD_ID.substring(0,2) === 'PO') {
				$scope.lfn_new_as_po($scope.ds_conf.paramSet.OD_ID);
			}
		}
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
			$scope.ds_cond.WHIN_ID = $scope.ds_conf.paramSet.WHIN_ID;
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
		} else if (name === 'ds_mst.OD_NO') {
			return false;
		// } else if (XUTL.isIn(name, "sub.ADD", "sub.DEL") && $scope.ds_conf.paramSet.OD_ID) {
		// 	return false;
		}
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		if (!$scope.lfn_btn_show(name)){
			return true;
		}

		if (name === "NEW") {
			return false;
		}
		
		if (!$scope.ds_mst.ROW_CRUD) {
			return true;
		}
		
		if (XUTL.isIn(name, "CONFIRM", "sub.ADD", "sub.DEL", "ds_mst.PARTNR_ID", "ds_mst.OD_ID")) {
			if (name === "sub.ADD" && !$scope.ds_mst.WHIN_GB) {
				return true;
			} else if (XUTL.isIn(name, "sub.ADD", "sub.DEL") && $scope.ds_conf.paramSet.OD_ID) {
				return true;
			} else if (name === "sub.DEL" && $scope.subGrid.gridApi.selection.getSelectedRows().length === 0) {
				return true;
			} else if (name === "ds_mst.PARTNR_ID") {
				//입고구분3-1:구매, 9:반품
				return !($scope.ds_mst.WHIN_GB && XUTL.isIn($scope.ds_mst.WHIN_GB.substring(2,3), "1", "9"));
			} else if (name === "ds_mst.OD_ID") {
				return true;	//TODO:
			}
			
			return !XUTL.isIn($scope.ds_mst.WHIN_ST, "00", "10");	//00:작성중(화면상 가상코드), 10:임시저장
		} else if (name === "CANCEL") {
			// 지시서에 의한 입고일 경우 취소하면 안됨.
			// let odNo = $scope.ds_mst.OD_NO;
			// if (!NG_UTL.isEmpty(odNo)) {
			// 	return true;
			// }

			return !(XUTL.isIn($scope.ds_mst.WHIN_ST, "30") && $scope.ds_mst.WHIN_GB.substring(1,2) === "0");	//30:입고확정, 0:정상입고
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/wm/WHIN_REG");

		} else if (name === "NEW") {	//신규
			$scope.lfn_dataset_init("MST");	//마스터/그리드 리셋
			$scope.ds_mst.SECTR_ID	= SS_USER_INFO.SECTR_ID;
			$scope.ds_mst.WHIN_DY 	= moment().format('YYYY-MM-DD');
			$scope.ds_mst.WHIN_ST 	= "00";	//00:작성중(화면에서 사용하는 가상코드)
			$scope.ds_mst.ROW_CRUD 	= "C";
			$scope.ds_mst.OD_ID 	= "";
			$scope.ds_mst.OD_NO 	= "";
			$scope.ds_conf.paramSet.OD_ID = "";
			$scope.lfn_filter_whinGb();	//입고구분 신규등록용으로 필터
			
		} else if (XUTL.isIn(name, "CONFIRM", "CANCEL")) {	//확정/취소
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
			
		} else if (name === "sub.ADD") {	//품목추가
			_YAM.popupItm({multiple: true, FIX_ITM_GB:""})	//품목 선택팝업
			.then((response) => {
				$timeout(() => {
					let dupEntities = [];
					$.each(response, (idx, entity) => {
						let find = XUTL.findRows("ITM_CD", entity.ITM_CD, $scope.subGrid.data);
						if (find.length === 0) {	//중복되지 않은 품목만 추가
							$scope.subGrid.data.push({
								ITM_ID	: entity.ITM_ID,
								ITM_CD	: entity.ITM_CD,
								ITM_NM	: entity.ITM_NM,
								WHIN_UN	: entity.ITM_UN,
								ROW_CRUD: "C"
							});
						} else {
							dupEntities.push(entity);
						}
					});
					if (dupEntities.length > 0) {
						alert("중복된 품목 " + dupEntities.length + "건은 제외 되었습니다.");
					}
				});
			});
			
    	} else if (name === "sub.DEL") {	//품목삭제
			XUTL.removeRows($scope.subGrid.data, $scope.subGrid.gridApi.selection.getSelectedRows());

		} else if (name === "ds_mst.PARTNR_ID") {	//거래처 선택팝업
			_YAM.popupPARTNR({FIX_PARTNR_GB: ""})
			.then((response) => {
				$timeout(() => {
					$scope.ds_mst.PARTNR_ID = response.PARTNR_ID;
					$scope.ds_mst.PARTNR_NM = response.PARTNR_NM;
					$scope.lfn_input_onChange("ds_mst.PARTNR_ID");
				});
			});
			
		} else if (name === "ds_mst.OD_NO") {	//지시서 선택팝업
			_YAM.popupOD({WHIO_GB: $scope.ds_mst.WHIN_GB})
			.then((result) => {
				$timeout(() => {
					$scope.ds_mst.OD_ID 	= result.OD_ID;
					$scope.ds_mst.OD_NO 	= result.OD_NO;
					$scope.ds_mst.WH_CD 	= result.WH_CD;
					$scope.ds_mst.PARTNR_ID	= result.PARTNR_ID;
					$scope.ds_mst.PARTNR_NM	= result.PARTNR_NM;
					$scope.lfn_input_onChange('ds_mst.OD_NO');
				});
			});

		}

	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			if ($scope.lfn_btn_disabled("CONFIRM")) {
				return true;
			}
		}
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			//일자의 첫 바인딩 이벤트는 제외시킴
			if (name === "ds_mst.WHIN_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_WHIN_DY")) {
					$scope.ds_mst._OLD_WHIN_DY = $scope.ds_mst.WHIN_DY;
					return;
				}
			}
			
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			
			//입고구분 변경시 거래처/지시서/입고품목 리셋
			if (name === "ds_mst.WHIN_GB") {
				$scope.ds_mst.PARTNR_ID	= "";
				$scope.ds_mst.PARTNR_NM	= "";
				$scope.ds_mst.OD_NO		= "";
				$scope.lfn_dataset_init("SUB");
			}
		}
	}//end-lfn_input_onChange

	//입력필드 ng-enter 처리
	$scope.lfn_input_onEnter = (name) => {
	}//end-lfn_input_onEnter
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	//입고구분은 등록시에는 등록가능한 입고구분으로 필터링 되면 조회시에는 전체
	$scope.lfn_filter_whinGb = () => {
		XUTL.empty($scope.ds_code.WHIN_GB_F);
		if ($scope.ds_mst.ROW_CRUD === "C") {
			//입고구분-1010:구매입고, 1030:완제품입고, 1090:반품입고, 10H0:창고이동입고, 10I0:재고실사입고
			$.extend($scope.ds_code.WHIN_GB_F, XUTL.findRows($scope.ds_code.WHIN_GB, "CODE_CD", ["1010", "1090"]));
		} else {
			$.extend($scope.ds_code.WHIN_GB_F, $scope.ds_code.WHIN_GB);
		}
	}//end-lfn_filter_whinGb
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	$scope.lfn_new_as_po = async (odId) => {
		// ds_mst data
		$scope.lfn_btn_onClick('NEW');
		const PO_PARAM = {
			PO_ID: odId
		}
console.log(PO_PARAM, $scope.ds_conf.paramSet)
		const PARAM = {
			querySet	: [{queryId: "yam.wm.WHIN_REG.selPoInfo",	queryType:"selOne",	dataName:"po_info",	param:PO_PARAM}]
		}

		blockUI.start();
		let ret
		try {
			ret = await XUTL.fetch({
				url: "/std/cmmn/mquery.do",
				data: PARAM
			});
		} catch(ex) {
			console.log(ex)
		} finally {
			$timeout(() => {
				blockUI.stop();
			});
		}

		$.each(ret.success, (name, data) => {
			XUTL.setWithPath($scope, name, data);
		});

		if ($scope.po_info) {
			$scope.ds_mst.WHIN_GB 	= '1010';	// 납품ㅊ출고
			$scope.ds_mst.WH_CD 	= $scope.po_info.WH_CD;
			$scope.ds_mst.PARTNR_NM = $scope.po_info.PARTNR_NM;
			$scope.ds_mst.PARTNR_ID = $scope.po_info.PARTNR_ID;
			$scope.ds_mst.OD_ID		= $scope.po_info.PO_ID;
			$scope.ds_mst.OD_NO 	= $scope.po_info.PO_NO;
			$scope.ds_mst.REMARKS 	= XUTL.isEmpty($scope.po_info.PO_REMARKS) ? "" : "- 구매발주 비고: " + $scope.po_info.PO_REMARKS + '\n';
			// console.log($scope.ds_mst, $scope.po_info)

			// subGrid 추가
			const LIST_PARAM = {
				querySet	: [{queryId: "yam.wm.WHIN_REG.selPoList",	queryType:"selList",	dataName:"subGrid.data",	param:PO_PARAM}]
			}

			blockUI.start();
			let dataList;
			try {
				dataList = await XUTL.fetch({
					url: "/std/cmmn/mquery.do",
					data: LIST_PARAM
				});
			} catch (ex) {
			} finally {
				$timeout(() => {
					blockUI.stop();
				});
			}


			$.each(dataList.success, (name, data) => {
				XUTL.setWithPath($scope, name, data);
			});
		}
	}

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST")

		const param = {
			querySet	:
				[
				 {queryId: "yam.wm.WHIN_REG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.wm.WHIN_REG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond}
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
			$scope.lfn_filter_whinGb();	//입고구분 조회용으로 필터

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search

	//검증
	$scope.lfn_validate = (name) => {
		if (name === "CONFIRM") {
			//마스터 체크
			if (!XUTL.validateInput($("#ds_mst")).isValid){
				return false;
			} else if (!$scope.lfn_btn_disabled("ds_mst.PARTNR_ID")) {
				if (!$scope.ds_mst.PARTNR_ID) {
					alert("거래처를 입력 하세요.");
					return false;
				}
			}
			
			//그리드 체크
    		if ($scope.subGrid.data.length === 0) {
    			alert("입고항목을 등록 하세요.");
    			return false;
    		} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
    		}

		} else if (name === "CANCEL") {
			// 지시서에 의한 입고일 경우 취소하면 안됨.
			let odId = $scope.ds_mst.OD_ID;
			if (!NG_UTL.isEmpty(odId)) {
				let odNm = "";
				switch ($scope.ds_mst.OD_NO.substring(0,2).toUpperCase()) {
					case "WP" : odNm = "실적"; break;
					case "PO" : odNm = "구매발주"; break;
				}

				alert(odNm + '지시서에 의한 입고는 취소할 수 없습니다. 지시서번호:' + $scope.ds_mst.OD_NO);
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
		if (name === "CONFIRM") {
			confirmMsg = "입고처리 하시겠습니까?";
		} else if (name === "CANCEL") {
			confirmMsg = "입고취소 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}

		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.ds_mst);
		//확정처리시 입고항목정보 추가
		if (name === "CONFIRM") {
			xmlDoc.appendXml("list", $scope.subGrid.data);
		}

		const param =
			{
				queryId	: "yam.wm.WHIN_REG.save",
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
				$scope.ds_cond.WHIN_ID = response.RS_MESSAGE;
				$scope.lfn_search();
				XUTL.sendTopMessage("CHANGE_WHIN", {});	//입고정보 변경 브로드캐스팅
				XUTL.sendTopMessage("CHANGE_PO", {});	//입고정보 변경 브로드캐스팅
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
    	digit			: 0,
    	sign			: true
    });


    //sub Grid Options
	$scope.subGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering	: false,
		enableGridMenu	: true,
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/wm/WHIN_REG/subGrid",
		columnDefs		:
			[
			 {displayName:'순번',		field:'ROW_NUM',		width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate:NG_CELL.getRowNumRenderer()},
			 {displayName:'품목코드',	field:'ITM_CD',			width:'150',	type:'string',	cellClass:'align_cen',	validTypes:"required"},
			 {displayName:'품목명',	    field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			 {displayName:'수량',		field:'WHIN_QTY',		width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell,	validTypes:"required"},
			 {displayName:'단위',		field:'WHIN_UN',		width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN'},
			 {displayName:'단가',		field:'WHIN_PRC',		width:'150',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell},
			 {displayName:'공급가',	    field:'WHIN_SPL_AM',	width:'150',	type:'string',	cellClass:'align_rgt',	cellFilter:'number'},
			 {displayName:'부가세',	    field:'WHIN_VAT',		width:'150',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell},
			 {displayName:'합계금액',	field:'WHIN_SUM_AM',	width:'150',	type:'string',	cellClass:'align_rgt',	cellFilter:'number'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "입고상세목록");

	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		//행추가 가능할 경우 입력필드외 클릭시 toggleRowSelection
		if (!$scope.lfn_btn_disabled("CONFIRM")) {
			let defs = XUTL.findRows(grid.options.columnDefs, "field", name);
			if (defs.length === 1 && !(defs[0].cellTemplate)) {
				grid.api.selection.toggleRowSelection(entity);
			}
		}
	}//end-lfn_row_onClick

	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		if (grid.options === $scope.subGrid) {
			return $scope.lfn_btn_disabled("CONFIRM");
		}
		return false;
	}//end-lfn_cell_disabled

	//cell click event
    $scope.lfn_cell_onClick = (name, entity, grid) => {
    }//end-lfn_cell_onClick
    
	//data change event
	$scope.lfn_cell_onChange = (name, entity, grid) => {
		if (XUTL.isIn(name, "WHIN_QTY", "WHIN_PRC")) {
			entity.WHIN_SPL_AM	= XUTL.toNum(entity.WHIN_QTY) * XUTL.toNum(entity.WHIN_PRC); 
			entity.WHIN_VAT		= XUTL.ceil(entity.WHIN_SPL_AM / 10);
			entity.WHIN_SUM_AM	= entity.WHIN_SPL_AM + entity.WHIN_VAT;
		} else if (name === "WHIN_VAT") {
			entity.WHIN_SUM_AM	= XUTL.toNum(entity.WHIN_SPL_AM) + XUTL.toNum(entity.WHIN_VAT);
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

});// control end
