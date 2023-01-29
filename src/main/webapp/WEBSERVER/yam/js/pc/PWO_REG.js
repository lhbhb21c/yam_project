/**
 * 파일명	: PWO_REG.js
 * 설명	: 작업지시등록
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
		TR_AGGR_TM	: [],	//주문집계차수
		PROC_CD		: [],	//공정코드
		WH_CD		: [],	//창고코드
		PWO_ST		: [],	//작업지시상태
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
		$scope.ds_code.PWO_GB		= XUTL.getCodeFactory().PWO_GB;		//작업지시구분
		$scope.ds_code.TR_AGGR_TM	= XUTL.getCodeFactory().TR_AGGR_TM;	//주문집계차수
		$scope.ds_code.PROC_CD		= XUTL.getCodeFactory().PROC_CD;		//공정코드
		$scope.ds_code.WH_CD		= XUTL.getCodeFactory().WH_CD;			//창고코드
		$scope.ds_code.PWO_ST		= XUTL.getCodeFactory().PWO_ST;		//작업지시상태
		$scope.ds_code.QTY_UN		= XUTL.getCodeFactory().QTY_UN;		//수량단위

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//작업지시번호 있을 경우 조회
		if ($scope.ds_cond.PWO_ID) {
			$scope.lfn_search();
		// } else if ($scope.ds_conf.paramSet.TR_AGGR_DY && $scope.ds_conf.paramSet.TR_AGGR_TM && $scope.ds_conf.paramSet.TR_AGGR_SN) {	// 조회
		// 	$scope.ds_cond.TR_AGGR_DY = $scope.ds_conf.paramSet.TR_AGGR_DY;
		// 	$scope.ds_cond.TR_AGGR_TM = $scope.ds_conf.paramSet.TR_AGGR_TM;
		// 	$scope.ds_cond.TR_AGGR_SN = $scope.ds_conf.paramSet.TR_AGGR_SN;
		// 	$scope.lfn_search();
		} else if ($scope.ds_conf.paramSet.TR_AGGR_DY && $scope.ds_conf.paramSet.TR_AGGR_TM) {	//주문집계정보에 의한 신규등록 데이터 설정
			$scope.lfn_set_new_as_aggr();
		}
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
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
		
		if (name === "DEL") {
			return ($scope.ds_mst.PWO_ST === "10");
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
		
		if (XUTL.isIn(name, "CONFIRM", "sub.ADD", "sub.DEL", "ds_mst.PWO_CP_ID", "ds_mst.PWO_ITM_CD")) {
			if (name === "sub.ADD" && !$scope.ds_mst.PWO_ITM_CD) {
				return true;
			} else if (name === "sub.DEL" && $scope.subGrid.data.length === 0) {
				return true;
			}
			return !($scope.ds_mst.ROW_CRUD === "C" || XUTL.isIn($scope.ds_mst.PWO_ST, "10"));	//10:임시저장
			
		} else if (name === "CANCEL") {
			return !(XUTL.isIn($scope.ds_mst.PWO_ST, "30"));	//30:확정
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/pc/PWO_REG");

		} else if (name === "NEW") {	//신규
			$scope.lfn_dataset_init("MST");	//마스터/그리드 리셋
			$.extend($scope.ds_mst, $scope.lfn_instance_new_mst());
			
		} else if (XUTL.isIn(name, "CONFIRM", "CANCEL", "DEL")) {	//확정/취소/삭제
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
			
		} else if (name === "ds_mst.PWO_CP_ID") {	//담당자 선택팝업
			_YAM.popupUSER({})
			.then((response) => {
				$timeout(() => {
					$scope.ds_mst.PWO_CP_ID = response.MEM_ID;
					$scope.ds_mst.PWO_CP_NM = response.USER_NM;
				});
			});
			
		} else if (name === "ds_mst.PWO_ITM_CD") {	//품목 선택팝업
			_YAM.popupItm({FIX_ITM_GB:"1"})	//품목 선택팝업, 1:제품
			.then((response) => {
				$timeout(() => {
					$scope.ds_mst.PWO_ITM_ID	= response.ITM_ID;
					$scope.ds_mst.PWO_ITM_CD	= response.ITM_CD;
					$scope.ds_mst.PWO_ITM_NM	= response.ITM_NM;
					$scope.ds_mst.PWO_ITM_UN	= response.ITM_UN;
					$scope.lfn_input_onChange("ds_mst.PWO_ITM_CD");
				});
			});

		} else if (name === "sub.ADD") {	//품목추가
			_YAM.popupItm({multiple: true, FIX_ITM_GB:""})	//품목 선택팝업, 품목구분제한 않함
			.then((response) => {
				$timeout(() => {
					let dupEntities = [];
					let dupParents 	= false;
					$.each(response, (idx, entity) => {
						dupParents = $scope.ds_mst.PWO_ITM_CD === entity.ITM_CD;
						let find = XUTL.findRows($scope.subGrid.data, "PWO_IN_ITM_CD", entity.ITM_CD);
						if (find.length === 0 && !dupParents) {	//중복되지 않은 품목만 추가
							$scope.subGrid.data.push({
								PWO_IN_ITM_ID	: entity.ITM_ID,
								PWO_IN_ITM_CD	: entity.ITM_CD,
								PWO_IN_ITM_NM	: entity.ITM_NM,
								PWO_IN_ITM_UN	: entity.ITM_UN,
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
			if ($scope.lfn_btn_disabled("CONFIRM")) {
				return true;
			}
			if (name === "ds_mst.TR_AGGR_TM") {	//주문차수는 10:주문생산 일 경우만 등록
				return !($scope.ds_mst.PWO_GB === "10");
			}
		}
		return false;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			//일자의 첫 바인딩 이벤트는 제외시킴
			if (name === "ds_mst.PWO_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_PWO_DY")) {
					$scope.ds_mst._OLD_PWO_DY = $scope.ds_mst.PWO_DY;
					return;
				}
			}
			
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
			
			if (name === "ds_mst.PWO_DY") {
				$scope.ds_mst._OLD_PWO_DY = $scope.ds_mst.PWO_DY;
				if ($scope.ds_mst.PWO_GB === "10") {	//10:주문생산
					$scope.ds_mst.TR_AGGR_DY = $scope.ds_mst.PWO_DY;
				}
			} else if (name === "ds_mst.PWO_GB") {	//작업지시 변경시 주문집계 리셋
				if ($scope.ds_mst.PWO_GB === "10") {	//10:주문생산
					$scope.ds_mst.TR_AGGR_DY = $scope.ds_mst.PWO_DY;
				} else {
					$scope.ds_mst.TR_AGGR_DY = "";
				}
				$scope.ds_mst.TR_AGGR_TM = "";
			} else if (name === "ds_mst.PWO_ITM_CD") {	//품목코드 변경시 투입품목 리셋 및 BOM 적용
				$scope.lfn_load_bom();
			} else if (name === "ds_mst.PWO_QTY") {	//지시수량에 따른 BOM근거 투입수량 재계산
				$scope.lfn_calc_in_qty();
			}
		}
	}//end-lfn_input_onChange
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	//지시수량에 따른 투입수량(BOM에 근거) 재계산
	$scope.lfn_calc_in_qty = () => {
		$.each($scope.subGrid.data, (idx, entity) => {
			let pwoQty	= XUTL.toNum($scope.ds_mst.PWO_QTY);
			let bomHQty = XUTL.toNum(entity.BOM_H_QTY);
			if (bomHQty) {
				let bomLQty	= XUTL.toNum(entity.BOM_L_QTY);
				entity.PWO_IN_QTY = XUTL.round(pwoQty * bomLQty / bomHQty, 3);
			}
		})
	}//end-lfn_calc_in_qty
	
	//기본 신규데이터
	$scope.lfn_instance_new_mst = () => {
		let mst = 
			{
				SECTR_ID		: SS_USER_INFO.SECTR_ID,
				PWO_CP_ID		: SS_USER_INFO.MEM_ID,
				PWO_CP_NM		: SS_USER_INFO.USER_NM,
				PWO_DY			: moment().format('YYYY-MM-DD'),
				PWO_GB			: "20",		//10:주문생산, 20:계획생산
				PWO_WHIN_WH_CD	: "1000",	//생산창고
				PWO_WHOUT_WH_CD	: "1000", 	//생산창고
				PWO_ST			: "00",		//00:작성중(화면에서 사용하는 가상코드)
				ROW_CRUD		: "C"
			};
		return mst;
	}//end-lfn_instance_new_mst
	
	//주문집계정보에 의한 신규등록 데이터 설정
	$scope.lfn_set_new_as_aggr = async () => {
		$scope.lfn_dataset_init("MST");	//마스터/그리드 리셋

		// TR_AGGR_DY, TM, SN 으로 검색해서 PWO_ID 파악후 있으면 조회로 없으면 신규등록
		let pwoId = await $scope.lfn_get_pwoId() || '';
		// 기존 데이터가 있으면
		if (pwoId !== '') {
			$scope.ds_cond.PWO_ID = pwoId;
			$scope.lfn_search();

		} else {
			$.extend($scope.ds_mst, $scope.lfn_instance_new_mst());
			$scope.ds_mst.PWO_GB 		= "10";	//10:주문생산
			$scope.ds_mst.OD_ID 		= $scope.ds_conf.paramSet.TR_AGGR_ID;
			$scope.ds_mst.OD_SN 		= $scope.ds_conf.paramSet.TR_AGGR_SN;
			$scope.ds_mst.TR_AGGR_DY 	= $scope.ds_conf.paramSet.TR_AGGR_DY;
			$scope.ds_mst.TR_AGGR_TM 	= $scope.ds_conf.paramSet.TR_AGGR_TM;
			$scope.ds_mst.PWO_ITM_ID 	= $scope.ds_conf.paramSet.PWO_ITM_ID;
			$scope.ds_mst.PWO_ITM_CD 	= $scope.ds_conf.paramSet.PWO_ITM_CD;
			$scope.lfn_load_bom(() => {
				$scope.ds_mst.PWO_QTY = $scope.ds_conf.paramSet.PWO_QTY;
				$scope.lfn_input_onChange("ds_mst.PWO_QTY");
			});
		}
	}//end-lfn_set_new_as_aggr
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
	$scope.lfn_get_pwoId = async () => {
		$scope.lfn_dataset_init("MST");

		let queryParam = {
			OD_ID: $scope.ds_conf.paramSet.TR_AGGR_ID,
			// TR_AGGR_DY: $scope.ds_conf.paramSet.TR_AGGR_DY,
			// TR_AGGR_TM: $scope.ds_conf.paramSet.TR_AGGR_TM,
			OD_SN: $scope.ds_conf.paramSet.TR_AGGR_SN,
		}

		let param = {
			querySet	:
				[
					{queryId: "yam.pc.PWO_REG.selPwoInfo",	queryType:"selOne",		dataName:"pwoinfo",			param:queryParam},
				]
		}

		blockUI.start();
		let ret = await XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		});
		$timeout(()=> {
			blockUI.stop();
		})

		return ret?.success?.pwoinfo?.PWO_ID ;
		// return ret && ret.success && ret.success.pwo_no && ret.success.pwo_no.PWO_NO ? ret.success.pwo_no.PWO_NO : null;
	}

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST")

		let param = {
			querySet	:
				[
				 {queryId: "yam.pc.PWO_REG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.pc.PWO_REG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond}
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
				 {queryId: "yam.pc.PWO_REG.selBomMstInfo",	queryType:"selOne",		dataName:"bomMst",	param:{ITM_ID:$scope.ds_mst.PWO_ITM_ID}},
				 {queryId: "yam.pc.PWO_REG.selBomSubList",	queryType:"selList",	dataName:"bomSub",	param:{ITM_ID:$scope.ds_mst.PWO_ITM_ID}}
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
		if (name === "CONFIRM") {
			//마스터 체크
			if (!XUTL.validateInput($("#ds_mst")).isValid){
				return false;
			} else if ($scope.ds_mst.PWO_GB === "10" && !($scope.ds_mst.TR_AGGR_DY && $scope.ds_mst.TR_AGGR_TM)) {	//10:주문생산시 주문집계정보 입력
				alert("주문집계정보를 입력하세요.");
				return false;
			}
			
			//그리드 체크
    		if ($scope.subGrid.data.length === 0) {
    			alert("투입품목을 등록 하세요.");
    			return false;
    		} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
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

		let xmlDoc 	= new XmlDoc({});
		// 생산집계 차수 설정, 프로그램수정 필요.
		$scope.ds_mst["PROD_TM"] = $scope.ds_mst.TR_AGGR_TM;
		xmlDoc.appendXml("mst", $scope.ds_mst);
		//확정처리시 입고항목정보 추가
		if (name === "CONFIRM") {
			xmlDoc.appendXml("list", $scope.subGrid.data);
		}
		const param =
			{
				queryId	: "yam.pc.PWO_REG.save",
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
				$scope.ds_cond.PWO_ID = response.RS_MESSAGE;
				$scope.lfn_search();
				XUTL.sendTopMessage("CHANGE_PWO", {});	//작업지시 변경 브로드캐스팅
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
	//공정코드콤보
    let procCdCombo = NG_CELL.getComboCell("ds_code.PROC_CD", {
    	permanent	: true,
    	ngDisabled	: "lfn_cell_disabled",
    	ngChange	: "lfn_cell_onChange"
    });
	// //재고상태
	// let stockColorBox = NG_CELL.getColorRenderer({
	// 	map			: _YAM.getColorMap("PWO_ST"),
	// 	colorField	: "PWO_STOCK_QTY",
	// 	labelVisible: true
	// });


    //sub Grid Options
	$scope.subGrid = NG_GRD.instanceGridOptions({
		customGridName	: "투입품목",
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		enableFiltering	: false,
		enableGridMenu	: true,
		customStateId	: "/yam/pc/PWO_REG/mstGrid",
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({}),
		columnDefs		:
			[
			 {displayName:'순번',	field:'ROW_NUM',			width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate:NG_CELL.getRowNumRenderer()},
			 {displayName:'품목코드',field:'PWO_IN_ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen',	validTypes:"required"},
			 {displayName:'품명',	field:'PWO_IN_ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
			 {displayName:'단위',	field:'PWO_IN_ITM_UN',		width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN'},
			 {displayName:'수량',	field:'PWO_IN_QTY',			width:'120',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell,		validTypes:"required"},
			 // {displayName:'재고',	field:'PWO_IN_STOCK_QTY',	width:'120',	type:'string',	cellClass:'align_rgt',	cellFilter: "number"},
			 {displayName:'공정',	field:'PWO_IN_PROC_CD',		width:'150',	type:'string',	cellClass:'align_cen',	cellTemplate:procCdCombo,	validTypes:"required"},
			 {displayName:'비고',	field:'PWO_IN_REMARKS',		width:'400',	type:'string',	cellClass:'align_lft',	cellTemplate:inputCell},
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "투입품목");

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

});// control end
