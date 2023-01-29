/**
 * 파일명	: WSFR_REG.js
 * 설명		: 창고이동관리
 *
 * 수정일			수정자		수정내용
 * 2021.10.26	염국선		최초작성
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
		ITM_GB		: [],	//품목구분
		WH_CD		: [],	//창고코드
		QTY_UN		: [],	//수량단위
		WSFR_ST		: []	//창고이동요청상태
	}
	//조회 조건
	$scope.ds_cond	= {
		ITM_GBS		: [],	//품목구분
		WHOUT_WH_CDS: [],	//출고창고구분
		WHIN_WH_CDS	: []	//입고창고구분
	};
	//에디터마스터
	$scope.ds_mst	= {};
	
	
	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();

		//공통코드
		$scope.ds_code.ITM_GB	= XUTL.getCodeFactory().ITM_GB;	//품목구분
		$scope.ds_code.WH_CD	= XUTL.getCodeFactory().WH_CD;	//창고코드
		$scope.ds_code.QTY_UN	= XUTL.getCodeFactory().QTY_UN;	//수량단위
		$scope.ds_code.WSFR_ST	= XUTL.getCodeFactory().WSFR_ST;//창고이동요청상태

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();

		if ($scope.ds_cond.WSFR_ID) {
			//조회
			$timeout(() => {
				$scope.lfn_search();
			});
		} else if($scope.ds_conf.paramSet.ITM_IDS) {
			// 초기데이타 로드
			$scope.lfn_set_new_as_aggr();
		}
		
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init =  (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
			$scope.ds_cond.WSFR_ID	= $scope.ds_conf.paramSet.WSFR_ID;
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.ds_mst);
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
		if (XUTL.isIn(name, "edit.sub.ADD", "edit.sub.DEL")) {
			return !($scope.ds_conf.paramSet.TR_AGGR_ID && $scope.ds_conf.paramSet.ITM_IDS);
		}
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
    	if (!$scope.lfn_btn_show(name)) {
    		return true;
    	}

    	if (XUTL.isIn(name, "CONFIRM", "edit.sub.ADD", "edit.sub.DEL")) {
    		if (!($scope.ds_mst.ROW_CRUD === "C")) {
    			return true;
    		}
    		if (name === "edit.sub.ADD") {
    			return !($scope.ds_mst.WSFR_DY && $scope.ds_mst.WHOUT_WH_CD);
    		} else if (name === "edit.sub.DEL") {
    			return $scope.subGrid.data.length === 0;
    		}

    	} else if (name === "CANCEL") {
    		return !($scope.ds_mst.WSFR_ST === "40");
    	}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE") {
			top.MDI.closeTab("/yam/wm/WSFR_REG");

		} else if (name === "SEARCH") {
			$scope.lfn_search();

    	} else if (name === "REG") {
    		$scope.lfn_start_edit(name);

    	} else if (XUTL.isIn(name, "CONFIRM", "CANCEL")) {
    		if ($scope.lfn_validate(name)) {
    			$scope.lfn_run(name)
    		}

    	} else if (name === "edit.sub.ADD") {
			let sioYyyy	= $scope.ds_mst.WSFR_DY.substring(0,4);
			let sioMm	= $scope.ds_mst.WSFR_DY.substring(5,7);
			let whCd	= $scope.ds_mst.WHOUT_WH_CD;
			_YAM.popupSioItm({multiple: true, FIX_SIO_YYYY:sioYyyy, FIX_SIO_MM:sioMm, FIX_WH_CD:whCd, FIX_ITM_GB:""})	//재고품목 선택팝업
			.then((response) => {
				$timeout(() => {
					$scope.lfn_add_sub(response);
				});
			});

    	} else if (name === "edit.sub.DEL") {
    		XUTL.removeRows($scope.subGrid.data, $scope.subGrid.gridApi.selection.getSelectedRows());

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
			if (name === "ds_mst.WSFR_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_WSFR_DY")) {
					$scope.ds_mst._OLD_WSFR_DY = $scope.ds_mst.WSFR_DY;
					return;
				}
			}

			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}

			if (name === "ds_mst.WSFR_DY") {	//창고이동일자
				//월이 변경되면 출고품목은 재고와 관련되므로 리셋
				if ($scope.ds_mst.WSFR_DY.substring(0,7) !== $scope.ds_mst._OLD_WSFR_DY.substring(0,7)) {
		        	XUTL.empty($scope.subGrid.data);
				}
				$scope.ds_mst._OLD_WSFR_DY = $scope.ds_mst.WSFR_DY;
			} else if (name === "ds_mst.WHOUT_WH_CD" && !$scope.ds_conf.paramSet.ITM_CD) {	//출고창고
				//출고창고가 변경되면 출고품목은 재고와 관련되므로 리셋. 예외: ITM_CD 가 넘어올 경우는 제외.
	        	XUTL.empty($scope.subGrid.data);
			}
		}

	}//end-lfn_input_onChange
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
    //창고이동 작성 작업 시작
    $scope.lfn_start_edit = (name, entity) => {
    	$scope.lfn_dataset_init("MST");
		if (name === "REG") {
	    	$scope.ds_mst		= {
	    		SECTR_ID	: SS_USER_INFO.SECTR_ID,
        		WSFR_DY		: moment().format("YYYY-MM-DD"),
        		WSFR_GB		: "10",	//10:일반
        		AUTO_WHIO_YN: "Y",
        		ROW_CRUD	: "C"
        	}
			$scope.ds_conf.paramSet = {};

	    	XUTL.applyRows(XUTL.findRows($scope.subGrid.columnDefs, "field", "STOCK_QTY"), "visible", true);	//재고수량 보이게
    	//	$("#editModal").modal("show");
		}
    }//end-lfn_start_edit

	$scope.lfn_set_new_as_aggr = () => {
		$scope.ds_mst		= {
			SECTR_ID	: SS_USER_INFO.SECTR_ID,
			WSFR_DY		: moment().format("YYYY-MM-DD"),
			WSFR_GB		: "10",	//10:일반
			AUTO_WHIO_YN: "Y",
			WHOUT_WH_CD	: '1000',	// 생산창고
			WHIN_WH_CD	: '1030',	// 납품예정창고
			ROW_CRUD	: "C"
		}
		// TR_AGGR_ID
		if ($scope.ds_conf.paramSet.TR_AGGR_ID && $scope.ds_conf.paramSet.TR_AGGR_ID !== '') {
			$scope.ds_mst['OD_ID'] = $scope.ds_conf.paramSet.TR_AGGR_ID;
			$scope.ds_mst['OD_NO'] = $scope.ds_conf.paramSet.TR_AGGR_ID;
		}

		if ($scope.ds_conf.paramSet.TR_AGGR_TM && $scope.ds_conf.paramSet.TR_AGGR_TM !== '') {
			$scope.ds_mst['TR_AGGR_TM'] = $scope.ds_conf.paramSet.TR_AGGR_TM;
		}
// console.log('$scope.ds_mst::', $scope.ds_mst)
		// 불러오기
		if ($scope.ds_conf.paramSet.ITM_IDS && $scope.ds_conf.paramSet.ITM_IDS.length > 0) {
			$scope.lfn_load_tr();
		}
	}

	/**
	 * 디비목록을 서브목록에 추가
	 * @param response
	 */
	$scope.lfn_add_sub = (response) => {
		let dupEntities = [];
		$.each(response, (idx, entity) => {
			let find = XUTL.findRows($scope.subGrid.data, "ITM_ID", entity.ITM_ID);
			if (find.length === 0) {	//중복되지 않은 품목만 추가
				$scope.subGrid.data.push({
					ITM_ID		: entity.ITM_ID,
					ITM_CD		: entity.ITM_CD,
					ITM_NM		: entity.ITM_NM,
					ITM_GB		: entity.ITM_GB,
					WSFR_UN		: entity.SIO_UN,
					WSFR_QTY	: entity.WSFR_QTY || 0,
					STOCK_QTY	: entity.STOCK_QTY,
					ROW_CRUD	: "C"
				});
			} else {
				dupEntities.push(entity);
			}
		});
		if (dupEntities.length > 0) {
			alert("중복된 품목 " + dupEntities.length + "건은 제외 되었습니다.");
		}
	}

	//
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
		$scope.lfn_dataset_init("MST");
		var param = {
				querySet	:
					[
						{queryId: "yam.wm.WSFR_REG.selMstInfo",	queryType: "selOne",	dataName: "ds_mst",			param: $scope.ds_cond},
						{queryId: "yam.wm.WSFR_REG.selSubList",	queryType: "selList",	dataName: "subGrid.data",	param: $scope.ds_cond}
					]
			}

			blockUI.start();
			XUTL.fetch({
				url: "/std/cmmn/mquery.do",
				data: param
			}).then(function (response) {
				$.each(response.success, function (name, data) {
					XUTL.setWithPath($scope, name, data);
				});
				XUTL.applyRows(XUTL.findRows($scope.subGrid.columnDefs, "field", "STOCK_QTY"), "visible", false);	//재고수량 않보이게
			}).finally(function (data) {
				$timeout(function () {
					blockUI.stop();
				});
			});

	}//end-lfn_search

	$scope.lfn_load_tr = () => {
		$scope.lfn_dataset_init("SUB")
		let itmIds = decodeURIComponent($scope.ds_conf.paramSet.ITM_IDS);
		if (itmIds && itmIds !== '') {
			itmIds = itmIds.split(",");
		}
		const queryParam = {
			ITM_IDS		: itmIds,
			TR_AGGR_ID	: $scope.ds_conf.paramSet.TR_AGGR_ID,
			SIO_YM 		: $scope.ds_mst.WSFR_DY ||  moment().format("YYYY-MM-DD"),
			WH_CDS		: [$scope.ds_mst.WHOUT_WH_CD],
		}
		let param = {
			querySet	:
				[
					{queryId: "yam.wm.WSFR_REG.selItmList",	queryType:"selList",		dataName:"itmList",		param:queryParam},
				]
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		}).then(function (response) {
			$scope.subGrid.data = response.success.itmList;
			// $timeout(()=> {
			// 	// console.log(response.success.itmList)
			// 	// let qty = $scope.ds_conf.paramSet.QTY;
			// 	// // WSFR_QTY
			// 	// if (response.success.itmList && response.success.itmList.length > 0) {
			// 	// 	response.success.itmList[0].WSFR_QTY = qty;
			// 	// }
			// 	// $scope.lfn_add_sub(response.success.itmList);
			// })

		}).finally(function (data) {
			$timeout(function () {
				blockUI.stop();
			});
		});
	}

    //검증
    $scope.lfn_validate = (name) => {
    	if (name === "CONFIRM") {
    		//마스터데이터 검증
    		if (!XUTL.validateInput($("#ds_mst")).isValid) {
    			return false;
    		}
    		//추가 마스터데이터 검증
    		if ($scope.ds_mst.WHOUT_WH_CD === $scope.ds_mst.WHIN_WH_CD) {
    			alert("입고창고와 출고창고는 달라야 합니다.");
    			return false;
    		}

    		//그리드 검증
    		if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
    		}
    		//추가그리드 검증
    		if ($scope.subGrid.data.length === 0) {
    			alert("품목을 등록 하세요.");
    			return false;
    		}

    	} else if (name === "CANCEL") {
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
    		confirmMsg = "창고이동을 확정 처리 하시겠습니까?";
    	} else if (name === "CANCEL") {
    		confirmMsg = "창고이동을 취소 하시겠습니까?\n창고이동 입출고도 취소 됩니다.";
    	}

    	if (confirm(confirmMsg)) {
      		let xmlDoc = new XmlDoc({});
    		xmlDoc.appendXml("mst", $scope.ds_mst);
			//ITM_ID, WSFR_UN, WSFR_QTY
    		// xmlDoc.appendXml("list", $scope.subGrid.data);
			// 필수항목만 추가
			let addCols = ['ITM_ID', 'WSFR_UN', 'WSFR_QTY', 'OD_ID', 'OD_SN' ];
			let gridData = XUTL.copyRows($scope.subGrid.data, addCols);
			xmlDoc.appendXml("list",gridData);

        	let param = {
        		queryId	: "yam.wm.WSFR_REG.save",
        		CMD		: name,
        		XML_TEXT: xmlDoc.toXmlString()
        	};

			blockUI.start();
			XUTL.fetch({
				url	: "/std/cmmn/sp.do",
				data: param
			}).then((response) => {
        		alert(successMsg);
				if (response.RS_MESSAGE) {
					$scope.ds_cond.WSFR_ID	= response.RS_MESSAGE;
					$scope.lfn_search();
					XUTL.sendTopMessage("CHANGE_WSFR", {});	//입고정보 변경 브로드캐스팅
					$scope.subGrid.gridApi.selection.clearSelectedRows();
					// event broadcast
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

    //edit sub Grid Options
    $scope.subGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		multiSelect		: true,
    	enableFiltering	: false,
    	showColumnFooter: true,
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/wm/WSFR_REG/subGrid",
		columnDefs		:
			[
			 {displayName:'No.',		field:'ROW_NUM',	width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate:NG_CELL.getRowNumRenderer()},
			 {displayName:'품목코드',	field:'ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen',	validTypes:"required"},
			 {displayName:'품목명',		field:'ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
			 {displayName:'품목구분',	field:'ITM_GB',		width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.ITM_GB'},
			 {displayName:'단위',		field:'WSFR_UN',	width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN',
				 footerCellTemplate:'<div style="text-align:center">합계</div>'
			 },
			 {displayName:'수량',		field:'WSFR_QTY',	width:'100',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell,	validTypes:"required",
				 footerCellFilter:'number',
				 footerCellClass:'align_rgt',
	             aggregationType:uiGridConstants.aggregationTypes.sum
			 },
			 {displayName:'재고',		field:'STOCK_QTY',	width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'number'}
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "창고이동");

	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		if (grid.options === $scope.subGrid) {
			//입력필드 외 toggle selection
			if (name !== "WSFR_QTY") {
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
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
