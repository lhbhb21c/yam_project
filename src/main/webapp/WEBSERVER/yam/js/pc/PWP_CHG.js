/**
 * 파일명	: PWP_CHG.js
 * 설명		: 투입품목 수량 일괄 수정
 *
 * 수정일			수정자		수정내용
 * 2022.02.10		zno
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
		PROD_TM_F: []	//주문집계차수 필터
	};
	//조회 조건
	$scope.ds_cond	= {};
	//데이터
	$scope.ds_data	= {
		LAST_TM		: {}	//최종차수정보
	};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		// $scope.lfn_search();
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
			$scope.ds_cond.PWP_DY	= moment().format('YYYY-MM-DD');	//현재월
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.mstGrid.data);
			XUTL.empty($scope.ds_data, true);
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
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		if (!$scope.lfn_btn_show(name)) {
			return true;
		}
		if (name === "CONFIRM") {
			if ($scope.mstGrid.gridApi.selection.getSelectedRows().length === 0) {
				return true;
			}
		}
		return false;
	}//end-lfn_btn_disabled

	//버튼 관련 click event 처리
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE") {
			top.MDI.closeTab("/yam/pc/PWP_CHG");

		} else if (name === "SEARCH") {
			$scope.lfn_search();

		} else if (name === "CONFIRM") {
			if ($scope.lfn_validate(name)){
				$scope.lfn_run(name)
			}
		}
	}//end-lfn_btn_onClick

	//입력필드 관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		return false;
	}//end-lfn_input_disabled

	//입력필드 관련 change event 처리
	$scope.lfn_input_onChange = (name) => {
	}//end-lfn_input_onChange
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	$scope.lfn_qty_recalc = (entity) => {
		// console.log(entity)
		let gridLength = $scope.subGrid.data.length;
		if (gridLength > 0) {
			let chgTotalPwpInQty = entity.CHG_PWP_QTY; // 변경수량
			let totalPwoInQty = XUTL.sumRows($scope.subGrid.data, 'PWO_IN_QTY'); // 총 지시수량
			let incQty = 0; // 증분값
			$scope.subGrid.data.forEach((row, i) => {
				let pwpInQty = Math.floor(chgTotalPwpInQty * (row.PWO_IN_QTY / totalPwoInQty)); // 내림
				row.CHG_PWP_IN_QTY = pwpInQty;
				if (i === (gridLength - 1)) { //마지막 남은값으로 처리
					row.CHG_PWP_IN_QTY = chgTotalPwpInQty - incQty;
				}
				row.ROW_CRUD = 'U';
				incQty += pwpInQty;
			})
		}
	}

	//조회조건 설정
	$scope.lfn_set_cond = () => {
		// let dy	= $scope.ds_cond.PWP_DY;
		$scope.lfn_filter_tm();	//주문집계차수코드(조회조건) 필터
		// if (!dy || dy !== $scope.ds_data.LAST_TM.PWO_DY) {
		// 	if ($scope.ds_code.PROD_TM_F.length > 1) {
		// 		$scope.ds_cond.PROD_TM = ($scope.ds_code.PROD_TM_F.length-1)+"";
		// 	} else {
		// 		$scope.ds_cond.PROD_TM = $scope.ds_code.PROD_TM_F.length+"";
		// 	}
		// }
		// $scope.ds_cond.PWP_DY = $scope.ds_data.LAST_TM.PWO_DY;
	}//end-lfn_set_cond

	//주문집계차수코드(조회조건) 필터
	$scope.lfn_filter_tm = () => {
		XUTL.empty($scope.ds_code.PROD_TM_F);
		for (let i=0; i<4  ; i++) {
			$scope.ds_code.PROD_TM_F.push({CODE_CD:(i+1)+"", CODE_NM:(i+1)+"차"});
		}
		//alert(JSON.stringify())
	}//end-lfn_filter_tm
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
		$scope.lfn_set_cond();	//조회조건설정

	}//end-lfn_load_base

	//조회
	$scope.lfn_search = (sels) => {
		$scope.lfn_dataset_init("MST");

		const param = {
			querySet	:
				[
					//{queryId: "yam.pc.PWP_CHG.selLastProdTmInfo",	queryType:"selOne",		dataName:"ds_data.LAST_TM",	param:{PWO_DY: $scope.ds_cond.PWP_DY}},
					{queryId: "yam.pc.PWP_CHG.selMstList",			queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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

			//row선택 설정
			if (sels) {
				$timeout(() => {
					NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "ITM_CD", XUTL.getValueMatrix(sels, "ITM_CD")[0]));
				});
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search

	//마스터 선택시 생산실적 조회
	$scope.lfn_search_sub = (entity) => {
		$scope.lfn_dataset_init("SUB")
		let queryParam = {
			ITM_CD: entity.ITM_CD,
			PWP_IN_ITM_NM: entity.ITM_NM,
			PWP_DY: $scope.ds_cond.PWP_DY,
			PROD_TM: $scope.ds_cond.PROD_TM,
			WH_CD: entity.PWP_WHOUT_WH_CD
		}

		const param = {
			querySet	:
				[
					{queryId: "yam.pc.PWP_CHG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:queryParam}
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
	}//end-lfn_search_sub

	//검증
	$scope.lfn_validate = (name) => {
		if (name === "CONFIRM") {
			let sels = $scope.mstGrid.gridApi.selection.getSelectedRows();
			if(sels.length === 0) {
				alert("투입품목을 선택해주세요.");
				return false;
			} else if (sels[0].ROW_CRUD === "R" && XUTL.findRows($scope.subGrid.data, "ROW_CRUD", "U").length === 0) {
				alert("변경내역이 없습니다.");
				return false;
			} else if (!NG_GRD.validateGridData($scope.mstGrid.gridApi, {data:sels}).isValid) {
				return false;
			} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
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
			confirmMsg = "투입량 일괄 수정 처리 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return
		}

		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.mstGrid.gridApi.selection.getSelectedRows()[0]);
		xmlDoc.appendXml("sub", $scope.subGrid.data);

		const param = {
			queryId	: "yam.pc.PWP_CHG.save",
			CMD		: name,
			XML_TEXT: xmlDoc.toXmlString()
		};

		// console.log(param.XML_TEXT)
		//
		// return;

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/sp.do",
			data: param
		}).then((response) => {
			alert(successMsg);
			$scope.lfn_search($scope.mstGrid.gridApi.selection.getSelectedRows());

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
	//숫자(포맷)
	let numfCell = NG_CELL.getNumFormatCell({
		permanent		: true,
		ngDisabled		: "lfn_cell_disabled",
		ngChange		: "lfn_cell_onChange",
		selectOnFocus	: true,
		digit			: 2,
		sign			: true
	});
	// 재고부족 여부
	let stockStatusColorBox = NG_CELL.getColorRenderer({
		map			: {
			"10" : "navy",		//
			"20" : "red",	// 재고부족
		},
		colorField	: "STOCK_STATUS",
		labelVisible: true
	});
	// 변경이 있으면 품목명 진하게 네이비로 변경. 이 라인이 변경되어 있음을 알림. 저장하도록
	let itmNmClass = (grid, row, col, rowRenderIndex, colRenderIndex) => {
		return row.entity.ROW_CRUD === "R" ? 'align_lft' : 'font-bold text-navy align_lft';
	}

	//mst Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		customGridName	: "투입품목",
		enableFiltering	: true,
		noUnselect		: true,
		onRegisterApi	:
			(gridApi) => {
				gridApi.selection.on.rowSelectionChanged($scope, (row) => {
					$scope.lfn_search_sub(row.entity);
				});
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/pc/PWP_CHG/mstGrid",
		columnDefs		:
			[
				{displayName:'창고',			field:'WH_NM',				width:'120',	type:'string',	cellClass:'align_cen'},
				// {displayName:'투입품목코드',		field:'ITM_CD',				width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'투입품목코드',	field:'ITM_CD',				width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'투입품명',		field:'ITM_NM',				width:'*',		type:'string',	cellClass:itmNmClass},
				{displayName:'단위',			field:'ITM_UN',				width:'80',		type:'string',	cellClass:'align_cen'},
				{displayName:'현 재고수량',	field:'STOCK_QTY',			width:'150',	type:'string',	cellClass:'align_rgt', cellFilter:'number', cellTemplate:stockStatusColorBox},
				{displayName:'총 지시수량',	field:'TOTAL_PWO_IN_QTY',	width:'150',	type:'string',	cellClass:'align_rgt', cellFilter:'number'},
				{displayName:'총 투입수량',	field:'TOTAL_PWP_IN_QTY',	width:'150',	type:'string',	cellClass:'align_rgt', cellFilter:'number'},
				{displayName:'변경수량',		field:'CHG_PWP_QTY',		width:'150',	type:'string',	cellClass:'align_rgt', cellTemplate:numfCell},
			]
	});
	NG_GRD.addExcelExportMenu($scope.mstGrid, '투입품목');

	//sub Grid Options
	$scope.subGrid = NG_GRD.instanceGridOptions({
		customGridName	: "투입품목별 생산실적목록",
		enableFiltering	: false,
		showColumnFooter: true,
		onRegisterApi	:
			(gridApi) => {
				gridApi.core.on.rowsRendered($scope, () => {
					// 서브그리드가 변경시 마스터 그리드의 변경수량에 맞춰 다시 계산해야 함.
					$scope.lfn_qty_recalc($scope.mstGrid.gridApi.selection.getSelectedRows()[0]);
				})
			},
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		customStateId	: "/yam/pc/PWP_CHG/subGrid",
		columnDefs		:
			[
				{displayName:'생산번호',	field:'PWP_NO',				width:'100',	type:'string',	cellClass:'align_cen',
					cellTemplate: NG_CELL.getAnchorRenderer({ngClick:"lfn_cell_onClick"})
				},
				// {displayName:'생산번호',		field:'PWP_NO',				width:'150',	type:'string',	cellClass:'align_cen'},
				{displayName:'생산품목코드',	field:'PWP_ITM_CD',			width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'생산품명',		field:'PWP_ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'투입품목코드',	field:'PWP_IN_ITM_CD',		width:'120',	type:'string',	cellClass:'align_cen'},
				{displayName:'투입품명',		field:'PWP_IN_ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'지시수량',		field:'PWO_IN_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'number', footerCellTemplate: NG_CELL.getFooterSumRenderer(),  aggregationType: uiGridConstants.aggregationTypes.sum},
				{displayName:'투입수량',		field:'PWP_IN_QTY',			width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'number', footerCellTemplate: NG_CELL.getFooterSumRenderer(),  aggregationType: uiGridConstants.aggregationTypes.sum},
				{displayName:'변경수량',		field:'CHG_PWP_IN_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell,	validTypes:"required", footerCellTemplate: NG_CELL.getFooterSumRenderer(),  aggregationType: uiGridConstants.aggregationTypes.sum}
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, '투입품목별 생산실적목록');

	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
	}//end-lfn_row_onClick

	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		return $scope.lfn_btn_disabled("CONFIRM");
	}//end-lfn_cell_disabled

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		if (grid.options === $scope.subGrid && name === 'PWP_NO') {
			_YAM.openMdiTab("PWP_REG", entity);
		}
	}//end-lfn_cell_onClick

	//cell change event
	$scope.lfn_cell_onChange = (name, entity, grid) => {
		if (entity.ROW_CRUD === "R") {
			entity.ROW_CRUD = "U"
		}

		// recalc 투입수량
		if (grid.options === $scope.mstGrid && name === 'CHG_PWP_QTY') {
			// 생산품목의 투입량 변경
			$scope.lfn_qty_recalc(entity);
			//  색상변경
			entity.STOCK_STATUS = entity.CHG_PWP_QTY > entity.STOCK_QTY ? '20' : '10';
			// 데이터 변경 알림. 풋터 합계 변경 등
			$scope.mstGrid.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
			$scope.subGrid.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
		}
	}//end-lfn_cell_onChange
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
