/**
 * 파일명	: DO_MNG.js
 * 설명		: 출하지시등록
 *
 * 수정일			수정자		수정내용
 * 2022.04.20		이진호
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
		DO_ST		: [],	//출하지시상태
        DO_GB       : []
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
		$scope.ds_code.WH_CD		= XUTL.getCodeFactory().WH_CD;		//창고코드
		$scope.ds_code.DO_ST		= XUTL.getCodeFactory().DO_ST;		//출하지시상태
		$scope.ds_code.DO_GB		= XUTL.getCodeFactory().DO_GB;		//
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//출하지시번호 있을 경우 조회
		if ($scope.ds_cond.DO_ID) {
			$scope.lfn_search();
		} else if ($scope.ds_conf.paramSet.OD_ID && $scope.ds_conf.paramSet.OD_SN_LIST) {
			$scope.lfn_new_as_tr();
		}
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
			$scope.ds_cond.DO_ID = $scope.ds_conf.paramSet.DO_ID;
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

		if (name === "DEL") {
			return ($scope.ds_mst.DO_ST === "10");

        } else if (name === "CANCEL") { // 확정취소
            return (XUTL.isIn($scope.ds_mst.DO_ST, "30"));	//30:확정

		} else if (XUTL.isIn(name, "WHOUT")) {
			return (XUTL.isIn($scope.ds_mst.DO_ST, "30"));	//

		} else if (XUTL.isIn(name, "WHOUT_CANCEL")) {
			return (XUTL.isIn($scope.ds_mst.DO_ST, "40"));	//

		} else if (name === 'ds_mst.OD_NO') {
			return false;
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

		if (XUTL.isIn(name, "sub.ADD", "sub.DEL", "ds_mst.DO_CP_ID")) {
			// if (name === "sub.ADD") {
			// 	return false;
			// } else
			if (name === "sub.DEL" && $scope.subGrid.data.length === 0) {
				return true;
			}
			return !($scope.ds_mst.ROW_CRUD === "C" || XUTL.isIn($scope.ds_mst.DO_ST, "10"));	//10:임시저장

		} else if (XUTL.isIn(name, "SAVE", "ds_mst.DO_CP_ID")) {
			return !($scope.ds_mst.ROW_CRUD === "C" || XUTL.isIn($scope.ds_mst.DO_ST, "10"));	//10:임시저장

		} else if (XUTL.isIn(name, "CONFIRM")) {
			return !(XUTL.isIn($scope.ds_mst.DO_ST, "10", "20"));	//

		} else if (XUTL.isIn(name, "WHOUT")) {
			return !(XUTL.isIn($scope.ds_mst.DO_ST, "30"));	//

		} else if (XUTL.isIn(name, "WHOUT_CANCEL")) {
			return !(XUTL.isIn($scope.ds_mst.DO_ST, "40"));	//
        // } else if (name === "DEL") {    // 삭제
		// 	return !(XUTL.isIn($scope.ds_mst.DO_ST, "20"));

        } else if (name === "CANCEL") { // 확정취소
            return !(XUTL.isIn($scope.ds_mst.DO_ST, "30"));	//30:확정

        }

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/sm/DO_MNG");

		} else if (name === "NEW") {	//신규
			$scope.lfn_dataset_init("MST");	//마스터/그리드 리셋
			$.extend($scope.ds_mst, $scope.lfn_instance_new_mst());
			console.log("===>", $scope.ds_mst)

		} else if (XUTL.isIn(name, "CONFIRM", "CANCEL", "WHOUT_CANCEL")) {	//확정/취소/출고/출고취소
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}

		} else if (XUTL.isIn(name, "WHOUT")) {
				_YAM.openMdiTab('WHOUT_REG', {}, {OD_ID: $scope.ds_mst.DO_ID});

		} else if (name === "ds_mst.PARTNR_ID") {	//거래처 선택팝업
			_YAM.popupPARTNR({})
			.then((response) => {
				$timeout(() => {
					$scope.ds_mst.PARTNR_ID = response.PARTNR_ID;
					// $scope.ds_mst.PARTNR_NO = response.USER_ID;
					$scope.ds_mst.PARTNR_NM = response.PARTNR_NM;
				});
			});

		} else if (name === "sub.ADD") {	//품목추가
			_YAM.popupSioItm({
				multiple	: true,
				FIX_ITM_GB	: "",
				FIX_SIO_YYYY: $scope.ds_mst.DO_DY.substring(0, 4),
				FIX_SIO_MM	: $scope.ds_mst.DO_DY.substring(5, 7),
				FIX_WH_CD	: $scope.ds_mst.WH_CD
			}).then((response) => {
				$timeout(() => {
					let dupEntities = [];
					$.each(response, (idx, entity) => {
						let find = XUTL.findRows($scope.subGrid.data, "ITM_ID", entity.ITM_ID);
						if (find.length === 0) {	//중복되지 않은 품목만 추가
							$scope.subGrid.data.push({
								ITM_ID		: entity.ITM_ID,
								ITM_CD		: entity.ITM_CD,
								ITM_NM		: entity.ITM_NM,
								DO_UN		: entity.SIO_UN,
								STOCK_QTY	: entity.STOCK_QTY,
								DO_QTY		: entity.STOCK_QTY,
								ROW_CRUD	: "C"
							});
						} else {
							dupEntities.push(entity);
						}
					});

					if (dupEntities.length > 0) {
						alert("중복되거나 기본과 같은 품목 " + (dupEntities.length)
							+ "건은 제외 되었습니다.");
					}
				});
			});

		} else if (name === "sub.DEL") {	//품목삭제
			XUTL.removeRows($scope.subGrid.data, $scope.subGrid.gridApi.selection.getSelectedRows());

		}

	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
            if (name === "ds_mst.DOG_DY") {
                return !XUTL.isIn($scope.ds_mst.DO_ST, "30");
            }

			if ($scope.lfn_btn_disabled("SAVE") && $scope.lfn_btn_disabled("CONFIRM")) {
				return true;
			}
		}
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			//일자의 첫 바인딩 이벤트는 제외시킴
			if (name === "ds_mst.DO_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_DO_DY")) {
					$scope.ds_mst._OLD_DO_DY = $scope.ds_mst.DO_DY;
					return;
				}

			}
			// OD_ID 가 있는 상타에서 출하지시구분이나 창고가 변경되면 신규처리
			if (!XUTL.isEmpty($scope.ds_mst.OD_ID) && XUTL.isIn(name, "ds_mst.WH_CD", "ds_mst.DO_GB") && $scope.ds_mst.WH_CD !== '9010') {
				if (confirm("창고가 변경되면 기존 데이터가 리셋되며 신규 생성됩니다")) {
					let oldVal = $scope.ds_mst.WH_CD;
					$scope.lfn_btn_onClick('NEW');
					$scope.ds_mst.WH_CD = oldVal;
				} else {
					$scope.ds_mst.WH_CD = "9010";
				}
			}

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


	//기본 신규데이터
	$scope.lfn_instance_new_mst = () => {
		let mst =
			{
				SECTR_ID		: SS_USER_INFO.SECTR_ID,
				DO_DY			: moment().format('YYYY-MM-DD'),
				DO_GB			: "10",		// 10:납품출고
				WH_CD       	: "1030", 	// 납품예정창고에서 출하
				DO_ST			: "10",		// 10:작성중
				ROW_CRUD		: "C",
				OD_ID 			: "",
				OD_NO 			: ""
			};
		return mst;
	}//end-lfn_instance_new_mst

	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	// TR_AGGR_ID와 TR_AGGR_SN_LIST 가 있음 조회하여 셋팅
	$scope.lfn_new_as_tr = () => {
		$scope.lfn_dataset_init("MST");
		$.extend($scope.ds_mst, $scope.lfn_instance_new_mst());
		$.extend($scope.ds_mst, {
			OD_ID : $scope.ds_conf.paramSet.OD_ID,
			OD_NO : $scope.ds_conf.paramSet.OD_NO,
		});

		let snList = (decodeURIComponent($scope.ds_conf.paramSet.OD_SN_LIST)).split(",");

		const queryParam = {
			TR_AGGR_ID 		: $scope.ds_conf.paramSet.OD_ID,
			TR_AGGR_SN_LIST	: snList,
			SIO_WH_CD		: '1030' // 납품예정창고에서 출하함.
		}

		const param = {
			querySet	:
				[
					{queryId: "yam.sm.DO_MNG.selTrSubList",	queryType:"selList",	dataName:"subGrid.data",	param:queryParam}
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
	}

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST")

		let param = {
			querySet	:
				[
				 {queryId: "yam.sm.DO_MNG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.sm.DO_MNG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond}
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
		if (XUTL.isIn(name,"CONFIRM", "WHOUT")) {
			//마스터 체크
			if (!XUTL.validateInput($("#ds_mst")).isValid){
				return false;
			}

			//그리드 체크
    		if ($scope.subGrid.data.length === 0) {
    			alert("투입품목을 등록 하세요.");
    			return false;
    		} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
    		}

        } else if (XUTL.isIn(name,"CANCEL","WHOUT_CANCEL")) {

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
		} else if (name === "WHOUT") {
			confirmMsg = "출고 하시겠습니까?";
		} else if (name === "WHOUT_CANCEL") {
			confirmMsg = "출고취소 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}

		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.ds_mst);
		//확정처리시 항목정보 추가
		if (XUTL.isIn(name, "CONFIRM", "WHOUT")) {
			xmlDoc.appendXml("list", $scope.subGrid.data);
		}

        console.log(xmlDoc.toXmlString())

		const PARAM =
			{
				queryId	: "yam.sm.DO_MNG.save",
				CMD		: name,
				XML_TEXT: xmlDoc.toXmlString()
			};

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/sp.do",
			data: PARAM
		}).then((response) => {
			alert(successMsg);
			$timeout(() => {
				$scope.ds_cond.DO_ID = response.RS_MESSAGE;
				$scope.lfn_search();
				XUTL.sendTopMessage("CHANGE_DO", {});	//출하지시 변경 브로드캐스팅
				if (name === "WHOUT_CANCEL") {
					XUTL.sendTopMessage("CHANGE_WHOUT", {});	//출하지시 변경 브로드캐스팅
				}
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
    	permanent	    : true,
    	ngDisabled	    : "lfn_cell_disabled",
    	ngChange	    : "lfn_cell_onChange",
        ngIf            : "lfn_cell_show",
    	attributes	    : ["kr-cell"],

    });
	//숫자(포맷)
    let numfCell = NG_CELL.getNumFormatCell({
    	permanent		: true,
    	ngDisabled		: "lfn_cell_disabled",
    	ngChange		: "lfn_cell_onChange",
        ngIf            : "lfn_cell_show",
    	selectOnFocus	: true,
    	digit			: 2,
    	sign			: true
    });

	// //재고상태
	// let stockColorBox = NG_CELL.getColorRenderer({
	// 	map			: _YAM.getColorMap("DO_ST"),
	// 	colorField	: "DO_STOCK_QTY",
	// 	labelVisible: true
	// });


    //sub Grid Options
	$scope.subGrid = NG_GRD.instanceGridOptions({
		customGridName	: "투입품목",
		customStateId	: "/yam/sm/DO_MNG/subGrid",
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering	: true,
		enableGridMenu	: true,
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({}),
		onRegisterApi	: (gridApi) => {
			// gridApi.core.on.renderingComplete($scope, (gridApi) => {
			// 	$scope.lfn_show_cols();
			// });
		},
		columnDefs		:
			[
                {displayName:'순번',			field:'DO_SN',		width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate:NG_CELL.getRowNumRenderer()},
                {displayName:'품목코드',		field:'ITM_CD',		width:'120',	type:'string',	cellClass:'align_cen',	validTypes:"required"},
                {displayName:'품명',			field:'ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
                {displayName:'단위',			field:'DO_UN',		width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN'},
				{displayName:'재고수량',		field:'STOCK_QTY',	width:'120',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell, cellFilter:'number|emptyLabel:"0"' },
				{displayName:'출하지시수량',	field:'DO_QTY',		width:'120',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell },
				{displayName:'출고수량',		field:'WHOUT_QTY',	width:'120',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell },
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "출하지시품목");

	$scope.lfn_show_cols = () => {
		// if (typeof $scope.ds_mst !== 'undefined' && $scope.ds_mst && XUTL.isIn($scope.ds_mst.DO_ST, '30', '39', '40')) {
		// 	$scope.subGrid.columnDefs[4].visible = false;
		// 	$scope.subGrid.gridApi.grid.refresh();
		// }

	}

    // cell ng-if
    $scope.lfn_cell_show = (name, entity, grid) => {
		if (grid.options === $scope.subGrid) {
			if (XUTL.isIn(name ,'WHOUT_QTY') && XUTL.isIn($scope.ds_mst.DO_ST, '10', '20', '30')) { // 출고수량
				entity["WHOUT_QTY"]  = "";
				return false;
			}
			// if (name === 'STOCK_QTY' && XUTL.isIn($scope.ds_mst.DO_ST, '30', '39', '40')) {
			// 	console.log(name, $scope.ds_mst.DO_ST, typeof $scope.ds_mst.DO_ST, XUTL.isIn($scope.ds_mst.DO_ST, '30', '39', '40'))
			//
			// 	return false;
			// } else if (name === 'WHOUT_QTY' && XUTL.isIn($scope.ds_mst.DO_ST, '40')) {
			// 	return false;
			// }
		}
        return true;
    }


	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		if (grid.options === $scope.subGrid) {
			if (XUTL.isIn(name ,'STOCK_QTY')) { // 재고수량
				return true;
			}	else if (XUTL.isIn(name ,'WHOUT_QTY')) { // 출고수량
				return $scope.ds_mst.DO_ST !== '30'; // 확정이 아니면 입력제한
            } else {
                return $scope.lfn_btn_disabled("CONFIRM");
            }
		}
		return false;
	}//end-lfn_cell_disabled

	//cell click event
    $scope.lfn_cell_onClick = (name, entity, grid) => {
    }//end-lfn_cell_onClick

	//data change event
	$scope.lfn_cell_onChange = (name, entity, grid) => {
        if (grid.options === $scope.subGrid) {
        }
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////


});// control end
