/**
 * 파일명	: PO_MNG.js
 * 설명		: 구매발주등록
 *
 * 수정일			수정자		수정내용
 * 2022.04.11		이진호
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
		PO_ST		: [],	//작업지시상태
		CUR_CD		: [],	//통화코드
		TX_CD		: [],	//세금코드
		QTY_UN		: []	//수량단위
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
		$scope.ds_code.PO_ST		= XUTL.getCodeFactory().PO_ST;		//작업지시상태
		$scope.ds_code.CUR_CD		= XUTL.getCodeFactory().CUR_CD;		//통화코드
		$scope.ds_code.TX_CD		= XUTL.getCodeFactory().TX_CD;		//세금코드
		$scope.ds_code.QTY_UN		= XUTL.getCodeFactory().QTY_UN;		//수량단위
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//작업지시번호 있을 경우 조회
		if ($scope.ds_cond.PO_ID) {
			$scope.lfn_search();
		}
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
			$scope.ds_cond.PO_ID = $scope.ds_conf.paramSet.PO_ID;
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
			return ($scope.ds_mst.PO_ST === "10");

        } else if (name === "CANCEL") { // 확정취소
            return (XUTL.isIn($scope.ds_mst.PO_ST, "30"));	//30:확정

        } else if (name === "WHIN_CANCEL") { // 납품취소
            return (XUTL.isIn($scope.ds_mst.PO_ST, "50"));	//50: 납품

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
		
		if (XUTL.isIn(name, "sub.ADD", "sub.DEL", "ds_mst.PO_CP_ID")) {
            //console.log(name)
			// if (name === "sub.ADD") {
			// 	return false;
			// } else
			if (name === "sub.DEL" && $scope.subGrid.data.length === 0) {
				return true;
			}
			return !($scope.ds_mst.ROW_CRUD === "C" || XUTL.isIn($scope.ds_mst.PO_ST, "10"));	//10:임시저장

		} else if (XUTL.isIn(name, "SAVE", "ds_mst.PO_CP_ID")) {
			return !($scope.ds_mst.ROW_CRUD === "C" || XUTL.isIn($scope.ds_mst.PO_ST, "10"));	//10:임시저장

        } else if (XUTL.isIn(name, "CONFIRM")) {
            return !(XUTL.isIn($scope.ds_mst.PO_ST, "00", "10", "20"));	//

        } else if (name === "DEL") {    // 삭제
			return !(XUTL.isIn($scope.ds_mst.PO_ST, "20"));

        } else if (name === "CANCEL") { // 확정취소
            return !(XUTL.isIn($scope.ds_mst.PO_ST, "30"));	//30:확정

        } else if (name === "WHIN") {    // 납품
            return !(XUTL.isIn($scope.ds_mst.PO_ST, "30"));	//

        } else if (name === "WHIN_CANCEL") {    // 납품취소
            return !(XUTL.isIn($scope.ds_mst.PO_ST, "50"));	//
        }

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/pm/PO_MNG");

		} else if (name === "NEW") {	//신규
			$scope.lfn_dataset_init("MST");	//마스터/그리드 리셋
			$.extend($scope.ds_mst, $scope.lfn_instance_new_mst());
			
		// } else if (XUTL.isIn(name, "SAVE", "CONFIRM", "CANCEL", "DEL", "WHIN", "WHIN_CANCEL")) {	//확정/취소/삭제
		// 	if ($scope.lfn_validate(name)) {
		// 		$scope.lfn_run(name)
		// 	}

		} else if (XUTL.isIn(name, "CONFIRM", "CANCEL", "WHIN_CANCEL")) {	//확정/취소/출고/출고취소
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
		} else if (XUTL.isIn(name, "WHIN")) {
			_YAM.openMdiTab('WHIN_REG', {}, {OD_ID: $scope.ds_mst.PO_ID});

		} else if (name === "ds_mst.PO_CP_ID") {	//담당자 선택팝업
			_YAM.popupUSER({})
			.then((response) => {
				$timeout(() => {
					// $scope.ds_mst.PO_MEM_ID = response.MEM_ID;
					$scope.ds_mst.PO_CP_ID = response.MEM_ID;
					$scope.ds_mst.PO_CP_NM = response.USER_NM;
				});
			});

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
			_YAM.popupItm({multiple: true, FIX_ITM_GB:""})	//품목 선택팝업, 품목구분제한 않함
			.then((response) => {
				$timeout(() => {
					let dupEntities = [];
					let dupParents 	= false;
					$.each(response, (idx, entity) => {
						dupParents = $scope.ds_mst.PO_ITM_ID === entity.ITM_ID;
						let find = XUTL.findRows($scope.subGrid.data, "PO_ITM_ID", entity.ITM_ID);
						if (find.length === 0 && !dupParents) {	//중복되지 않은 품목만 추가
							$scope.subGrid.data.push({
								ITM_ID	: entity.ITM_ID,
								ITM_CD	: entity.ITM_CD,
								ITM_NM	: entity.ITM_NM,
								PO_UN	: entity.ITM_UN,
								ROW_CRUD: "C"
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
                return !XUTL.isIn($scope.ds_mst.PO_ST, "30");
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
			if (name === "ds_mst.PO_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_PO_DY")) {
					$scope.ds_mst._OLD_PO_DY = $scope.ds_mst.PO_DY;
					return;
				}

			}
			
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";

			}
			
			// if (name === "ds_mst.PO_DY") {
			// 	$scope.ds_mst._OLD_PO_DY = $scope.ds_mst.PO_DY;
			// 	if ($scope.ds_mst.PO_GB === "10") {	//10:주문생산
			// 		$scope.ds_mst.TR_AGGR_DY = $scope.ds_mst.PO_DY;
			// 	}
            //
			// } else if (name === "ds_mst.PO_GB") {	//작업지시 변경시 주문집계 리셋
			// 	if ($scope.ds_mst.PO_GB === "10") {	//10:주문생산
			// 		$scope.ds_mst.TR_AGGR_DY = $scope.ds_mst.PO_DY;
			// 	} else {
			// 		$scope.ds_mst.TR_AGGR_DY = "";
			// 	}
			// 	$scope.ds_mst.TR_AGGR_TM = "";
            //
			// // } else if (name === "ds_mst.PO_ITM_CD") {	//품목코드 변경시 투입품목 리셋 및 BOM 적용
			// // 	$scope.lfn_load_bom();
            // //
			// // } else if (name === "ds_mst.PO_QTY") {
			// // 	$scope.lfn_calc_in_qty();
            //
			// }
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
				PO_CP_ID		: SS_USER_INFO.MEM_ID,
				PO_CP_NM		: SS_USER_INFO.USER_NM,
				PO_DY			: moment().format('YYYY-MM-DD'),
				PO_GB			: "10",		// 10:구매발주
				WHIN_WH_CD  	: "1000",	// 생산창고
                CUR_CD          : 'KRW',    // 대한민국원 KRW
                TX_CD           : '10',     // 부가세
				PO_ST			: "10",		// 10:작성중
				ROW_CRUD		: "C"
			};
		return mst;
	}//end-lfn_instance_new_mst

    // 부가세
    $scope.lfn_get_vat = (poSplAm) => {
        let poVat = 0;
        try {
            // 세금코드가 부가세이면 10%, 0.1 곱하기 계산
            poVat = $scope.ds_mst.TX_CD === '10' ? poSplAm * 0.1 : 0;
        } catch (ex) {
            poVat = 0;
        }
        return poVat;
    }

    $scope.lfn_recalc_poAm = () => {
        let totalSplAm = 0;
        let totalVat = 0;
        let totalSumAm = 0;

        let n = $scope.subGrid.data.length;
        $scope.subGrid.data.forEach((item, index) => {
            //console.log(item, index);
            let splAm = item["PO_SPL_AM"] || 0;
            let vat = item["PO_VAT"] || 0;
            let amt = item["PO_AM"] || 0;

            totalSplAm += splAm;
            totalVat += vat;
            totalSumAm += amt;
        })

        $scope.ds_mst.TOT_PO_SPL_AM = XUTL.formatNum(XUTL.toInt(totalSplAm));
        $scope.ds_mst.TOT_PO_VAT = XUTL.formatNum(XUTL.toInt(totalVat));
        $scope.ds_mst.TOT_PO_SUM_AM = XUTL.formatNum(XUTL.toInt(totalSumAm));
    }
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	// TR_AGGR_ID 으로 기 등록여부 확인

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST")

		let param = {
			querySet	:
				[
				 {queryId: "yam.pm.PO_MNG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.pm.PO_MNG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond}
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

	//신규등록을 위한 생산품목/투입목록 BOM기준 정보설정
	$scope.lfn_load_bom = (callback) => {
		$scope.lfn_dataset_init("SUB")

		let param = {
			querySet	:
				[
				 {queryId: "yam.pm.PO_MNG.selBomMstInfo",	queryType:"selOne",		dataName:"bomMst",	param:{ITM_ID:$scope.ds_mst.PO_ITM_ID}},
				 {queryId: "yam.pm.PO_MNG.selBomSubList",	queryType:"selList",	dataName:"bomSub",	param:{ITM_ID:$scope.ds_mst.PO_ITM_ID}}
				]
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param 
		}).then((response) => {
			$.extend($scope.ds_mst, response.success.bomMst);
			$scope.subGrid.data = response.success.bomSub;
			if (callback) {
				callback();
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_load_bom
	
	//검증
	$scope.lfn_validate = (name) => {
		if (name === "CONFIRM" || name === "WHIN") {
			//마스터 체크
			if (!XUTL.validateInput($("#ds_mst")).isValid){
				return false;
			// } else if ($scope.ds_mst.PO_GB === "10" && !($scope.ds_mst.TR_AGGR_DY && $scope.ds_mst.TR_AGGR_TM)) {	//10:주문생산시 주문집계정보 입력
			// 	alert("주문집계정보를 입력하세요.");
			// 	return false;
			}
			
			//그리드 체크
    		if ($scope.subGrid.data.length === 0) {
    			alert("투입품목을 등록 하세요.");
    			return false;
    		} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
    		}
            // 납품이면 입고수량 체크
            if (name === 'WHIN') {
                //console.log('$scope.ds_mst.DOG_DY', $scope.ds_mst, $scope.ds_mst.DOG_DY)
                if (typeof $scope.ds_mst.DOG_DY === 'undefined' ||$scope.ds_mst.DOG_DY === null || $scope.ds_mst.DOG_DY === '' ) {
                    alert('납품일자를 선택하세요!')
                    return false;
                }
                for (let i =0; i<$scope.subGrid.data.length; i++) {
                    let item = $scope.subGrid.data[i]
                    if (item["WHIN_QTY"] === null || item["WHIN_QTY"] === '') {
                        alert('입고수량을 입력하세요!')
                        return false;
                    }
                }
            }


        } else if (name === "WHIN_CANCEL") {
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
        } else if (name === "WHIN") {
            confirmMsg = "납품 하시겠습니까?";
        } else if (name === "WHIN_CANCEL") {
            confirmMsg = "납품취소 하시겠습니까?";
		} else if (name === "DEL") {
			confirmMsg = "삭제 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}

		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.ds_mst);
		//확정처리시 입고항목정보 추가
		if (XUTL.isIn(name, "CONFIRM", "WHIN")) {
			// 필수항목만 추가
			let addCols = [
				"ITM_ID",
				"PO_UN",
				"PO_QTY",
				"PO_PRC",
				"PO_SPL_AM",
				"PO_VAT",
				"PO_AM",
				"PO_BRIEFS"
			];
			let gridData = XUTL.copyRows($scope.subGrid.data, addCols);
			xmlDoc.appendXml("list", gridData); //$scope.subGrid.data
		}

		//console.log(xmlDoc, xmlDoc.toXmlString(), xmlDoc.toXmlString().length);

		const PARAM =
			{
				queryId	: "yam.pm.PO_MNG.save",
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
				$scope.ds_cond.PO_ID = response.RS_MESSAGE;
				$scope.lfn_search();
				XUTL.sendTopMessage("CHANGE_PO", {});	//작업지시 변경 브로드캐스팅
				XUTL.sendTopMessage("CHANGE_WHIN", {});	//작업지시 변경 브로드캐스팅
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
	// 	map			: _YAM.getColorMap("PO_ST"),
	// 	colorField	: "PO_STOCK_QTY",
	// 	labelVisible: true
	// });


    //sub Grid Options
	$scope.subGrid = NG_GRD.instanceGridOptions({
		customGridName	: "투입품목",
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering	: false,
        showColumnFooter: true,
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({}),
        customStateId	: "/yam/pm/PO_MNG/subGrid",
		columnDefs		:
			[
				{displayName:'순번',		field:'PO_SN',			width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate:NG_CELL.getRowNumRenderer()},
				{displayName:'품목코드',	field:'ITM_CD',			width:'120',	type:'string',	cellClass:'align_cen',	validTypes:"required"},
				{displayName:'품명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'단위',		field:'PO_UN',			width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN'},
				{displayName:'수량',		field:'PO_QTY',			width:'80',		type:'string',	cellClass:'align_cen',	cellTemplate:numfCell, },
				{displayName:'단가',		field:'PO_PRC',			width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell,	validTypes:"required"},
				{displayName:'공급가액',	field:'PO_SPL_AM',		width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell,	validTypes:"required",
                    footerCellTemplate: NG_CELL.getFooterSumRenderer(),  aggregationType: uiGridConstants.aggregationTypes.sum},
				{displayName:'부가세',	field:'PO_VAT',			width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell,
                    footerCellTemplate: NG_CELL.getFooterSumRenderer(),  aggregationType: uiGridConstants.aggregationTypes.sum},
				{displayName:'금액',		field:'PO_AM',			width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell,	validTypes:"required",
                    footerCellTemplate: NG_CELL.getFooterSumRenderer(),  aggregationType: uiGridConstants.aggregationTypes.sum},
				{displayName:'입고수량',	field:'WHIN_QTY',   	width:'100',	type:'number',	cellClass:'align_rgt', },
				{displayName:'비고',		field:'PO_REMARKS',		width:'300',	type:'string',	cellClass:'align_lft',	cellTemplate:inputCell},
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "구매발주품목목록");


    // cell ng-if
    $scope.lfn_cell_show = (name, entity, grid) => {
		if (grid.options === $scope.subGrid) {
			if (XUTL.isIn(name ,'WHIN_QTY') && XUTL.isIn($scope.ds_mst.PO_ST, '10', '20', '30')) { // 입고수량
				entity["WHIN_QTY"]  = "";
				return false;
			}
		}
        return true;
    }


	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		if (grid.options === $scope.subGrid) {
            // if (name === 'WHIN_QTY') { // 입고수량은 납품일때만 활성화, 납품수량과 동일하게 기본셋팅
            //     return $scope.lfn_btn_disabled("WHIN");
            // } else {
			return $scope.lfn_btn_disabled("CONFIRM");
            // }
		}
		return false;
	}//end-lfn_cell_disabled

	//cell click event
    $scope.lfn_cell_onClick = (name, entity, grid) => {
    }//end-lfn_cell_onClick
    
	//data change event
	$scope.lfn_cell_onChange = (name, entity, grid) => {
        // 수량, 단가 등이 변경되면 금액 변경 및 총 공급가액, 총 부가세, 총 발주금액 변경
        if (grid.options === $scope.subGrid) {
            if (XUTL.isIn(name, "PO_QTY", "PO_PRC")) {
                let poQty = entity["PO_QTY"] || 0;
                let poPrc = entity["PO_PRC"] || 0;
                let poSplAm = entity["PO_SPL_AM"] || 0;
                let poVat = entity["PO_VAT"] || 0;

                try {
                    poSplAm = poQty * poPrc;
                } catch (ex) {
                    poSplAm = 0;
                }

                poVat = $scope.lfn_get_vat(poSplAm);

                let poAm = poSplAm + poVat;

                entity["PO_SPL_AM"] = poSplAm;
                entity["PO_VAT"] = poVat;
                entity["PO_AM"] = poAm;
            }

            //공급가액, 부가세 등이 변경되면 금액 변경 및 총 공급가액, 총 부가세, 총 발주금액 변경
            if (XUTL.isIn(name, "PO_SPL_AM")) {
                let poSplAm = entity["PO_SPL_AM"] || 0;
                let poVat = $scope.lfn_get_vat(poSplAm);;

                entity["PO_VAT"] = poVat;
                entity["PO_AM"] = poSplAm + poVat;
            }

            //공급가액, 부가세 등이 변경되면 금액 변경 및 총 공급가액, 총 부가세, 총 발주금액 변경
            if (XUTL.isIn(name, "PO_VAT")) {
                let poSplAm = entity["PO_SPL_AM"] || 0;
                let poVat = entity["PO_VAT"] || 0;

                entity["PO_AM"] = poSplAm + poVat;
            }

            // footer 합계
            $scope.subGrid.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);

            // 총공급금액, 총부가세, 총발주금액 재계산
            $scope.lfn_recalc_poAm();
        }
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////


});// control end
