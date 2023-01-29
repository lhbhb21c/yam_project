/**
 * 파일명	: WHOUT_REG.js
 * 설명	: 출고등록
 *
 * 수정일			수정자		수정내용
 * 2021.10.22	염국선		최초작성
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
		WHOUT_GB	: [],	//출고구분
		WHOUT_ST	: [],	//출고상태
		QTY_UN		: [],	//수량단위
		//load or filter//////////////////
		WHOUT_GB_F	: [],	//출고구분(필터된 에디터용, 전체/등록가능)
	};
	//조회조건 dataset
	$scope.ds_cond	= {};
	//마스터 dataset
	$scope.ds_mst	= {};

	//초기화
	$scope.load = async (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		$scope.ds_conf.paramSet.CMD	= $scope.ds_conf.paramSet.CMD||"REG";

		//공통코드
		$scope.ds_code.WH_CD		= XUTL.getCodeFactory().WH_CD;			//창고코드
		$scope.ds_code.WHOUT_GB		= XUTL.getCodeFactory().WHOUT_GB;		//출고구분
		$scope.ds_code.WHOUT_ST		= XUTL.getCodeFactory().WHOUT_ST;		//출고상태
		$scope.ds_code.QTY_UN		= XUTL.getCodeFactory().QTY_UN;		//수량단위
		$scope.ds_code.WHOUT_GB_F	= $.extend([], $scope.ds_code.WHOUT_GB);//창고코드(필터된 에디터용, 전체/등록가능)

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//출고번호 있을 경우 조회
		if ($scope.ds_cond.WHOUT_ID) {
			$scope.lfn_search();
		// } else if (!XUTL.isEmpty($scope.ds_conf.paramSet.ITM_CD)) {
		// 	// ITM_CD 가 넘어오면 출고품목 셋팅
		// 	$scope.lfn_subGrid_add();
		} else if ($scope.ds_conf.paramSet.TR_AGGR_SN && $scope.ds_conf.paramSet.TR_AGGR_DY && $scope.ds_conf.paramSet.TR_AGGR_TM && $scope.ds_conf.paramSet.ITM_CD) {
			// $scope.lfn_search_tr();
			$scope.lfn_subGrid_add();
		} else if (!XUTL.isEmpty($scope.ds_conf.paramSet.OD_ID)) {
			// 출하지시에서 넘어온 경우
			if ($scope.ds_conf.paramSet.OD_ID.substring(0,2) === 'DO') {
				$scope.lfn_new_as_do($scope.ds_conf.paramSet.OD_ID);
			}
		}
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond);
			$scope.ds_cond.WHOUT_ID = $scope.ds_conf.paramSet.WHOUT_ID;
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
			if (name === "sub.ADD" && (!$scope.ds_mst.WHOUT_GB || !$scope.ds_mst.WH_CD)) {
				return true;
			} else if (XUTL.isIn(name, "sub.ADD", "sub.DEL") && $scope.ds_conf.paramSet.OD_ID) {
				return true;
			} else if (name === "sub.DEL" && $scope.subGrid.gridApi.selection.getSelectedRows().length === 0) {
				return true;
			} else if (name === "ds_mst.PARTNR_ID") {
				//출고구분3-5:납품
				return !($scope.ds_mst.WHOUT_GB && XUTL.isIn($scope.ds_mst.WHOUT_GB.substring(2,3), "5"));
			} else if (name === "ds_mst.OD_ID") {
				return true;	//TODO:???
			}
			
			return !XUTL.isIn($scope.ds_mst.WHOUT_ST, "00", "10");	//00:작성중(화면상 가상코드), 10:임시저장
		} else if (name === "CANCEL") {
			// 지시서에 의한 입고일 경우 취소하면 안됨.
			// let odNo = $scope.ds_mst.OD_NO;
			// if (!NG_UTL.isEmpty(odNo)) {
			// 	return true;
			// }
			return !(XUTL.isIn($scope.ds_mst.WHOUT_ST, "30") && $scope.ds_mst.WHOUT_GB.substring(1,2) === "0");	//30:출고확정, 0:정상출고
		}

		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/yam/wm/WHOUT_REG");

		} else if (name === "NEW") {	//신규
			$scope.lfn_dataset_init("MST");	//마스터/그리드 리셋
			$scope.ds_mst.SECTR_ID	= SS_USER_INFO.SECTR_ID;
			$scope.ds_mst.WHOUT_DY 	= moment().format('YYYY-MM-DD');
			$scope.ds_mst.WHOUT_ST 	= "00";	//00:작성중(화면에서 사용하는 가상코드)
			$scope.ds_mst.ROW_CRUD 	= "C";
			$scope.ds_mst.OD_ID 	= "";
			$scope.ds_mst.OD_NO 	= "";
			$scope.ds_conf.paramSet.OD_ID = "";
			$scope.lfn_filter_whoutGb();	//출고구분 신규등록용으로 필터
			
		} else if (XUTL.isIn(name, "CONFIRM", "CANCEL")) {	//확정/취소
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
			
		} else if (name === "sub.ADD") {	//품목추가
			let sioYyyy	= $scope.ds_mst.WHOUT_DY.substring(0,4);
			let sioMm	= $scope.ds_mst.WHOUT_DY.substring(5,7);
			let whCd	= $scope.ds_mst.WH_CD;
			
			_YAM.popupSioItm({multiple: true, FIX_SIO_YYYY:sioYyyy, FIX_SIO_MM:sioMm, FIX_WH_CD:whCd, FIX_ITM_GB:""})	//재고품목 선택팝업
			.then((response) => {
				$timeout(() => {
					var dupEntities = [];
					$.each(response, (idx, entity) => {
						var find = XUTL.findRows($scope.subGrid.data, "ITM_CD", entity.ITM_CD);
						if (find.length === 0) {	//중복되지 않은 품목만 추가
							$scope.subGrid.data.push({
								ITM_ID		: entity.ITM_ID,
								ITM_CD		: entity.ITM_CD,
								ITM_NM		: entity.ITM_NM,
								STOCK_QTY	: entity.STOCK_QTY,
								WHOUT_UN	: entity.SIO_UN,
								ROW_CRUD	: "C"
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
			// _YAM.popupOD({WHIO_GB: $scope.ds_mst.WHOUT_GB})
			// .then((result) => {
			// 	$timeout(() => {
			// 		$scope.ds_mst.OD_ID 	= result.OD_ID;
			// 		$scope.ds_mst.OD_NO 	= result.OD_NO;
			// 		$scope.ds_mst.WH_CD 	= result.WH_CD;
			// 		$scope.ds_mst.PARTNR_ID	= result.PARTNR_ID;
			// 		$scope.ds_mst.PARTNR_NM	= result.PARTNR_NM;
			// 		$scope.lfn_input_onChange('ds_mst.OD_NO');
			// 	});
			// });

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
			if (name === "ds_mst.WHOUT_DY") {
				if (!$scope.ds_mst.hasOwnProperty("_OLD_WHOUT_DY")) {
					$scope.ds_mst._OLD_WHOUT_DY = $scope.ds_mst.WHOUT_DY;
					return;
				}
			}
			
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}

			if (name === "ds_mst.WHOUT_DY") {	//출고일자
				//월이 변경되면 출고품목은 재고와 관련되므로 리셋
				if ($scope.ds_mst.WHOUT_DY.substring(0,7) !== $scope.ds_mst._OLD_WHOUT_DY.substring(0,7)) {
					$scope.lfn_dataset_init("SUB");
				}
				$scope.ds_mst._OLD_WHOUT_DY = $scope.ds_mst.WHOUT_DY;
				
			} else if (XUTL.isIn(name, "ds_mst.WHOUT_GB", "ds_mst.WH_CD")) {	//출고구분/창고 변경시 거래처/지시서/출고품목 리셋
				$scope.ds_mst.PARTNR_ID	= "";
				$scope.ds_mst.PARTNR_NM	= "";
				$scope.ds_mst.OD_ID		= "";
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
	//출고구분은 등록시에는 등록가능한 출고구분으로 필터링 되면 조회시에는 전체
	$scope.lfn_filter_whoutGb = () => {
		XUTL.empty($scope.ds_code.WHOUT_GB_F);
		if ($scope.ds_mst.ROW_CRUD === "C") {
			//출고구분-3030:생산출고, 3050:납품출고, 30G0:불용재고출고, 30H0:창고이동출고, 30I0:재고실사출고
			$.extend($scope.ds_code.WHOUT_GB_F, XUTL.findRows($scope.ds_code.WHOUT_GB, "CODE_CD", ["3050", "30G0"]));
		} else {
			$.extend($scope.ds_code.WHOUT_GB_F, $scope.ds_code.WHOUT_GB);
		}
	}//end-lfn_filter_whoutGb
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
	}//end-lfn_load_base

	$scope.lfn_new_as_do =  async (odId) => {
		// ds_mst data
		$scope.lfn_btn_onClick('NEW');
		const DO_PARAM = {
			DO_ID: odId
		}
		const PARAM = {
			querySet	: [{queryId: "yam.wm.WHOUT_REG.selDoInfo",	queryType:"selOne",	dataName:"do_info",	param:DO_PARAM}]
		}

		blockUI.start();
		let ret
		try {
			ret = await XUTL.fetch({
				url: "/std/cmmn/mquery.do",
				data: PARAM
			});
		} catch(ex) {
		} finally {
			$timeout(() => {
				blockUI.stop();
			});
		}

		$.each(ret.success, (name, data) => {
			XUTL.setWithPath($scope, name, data);
		});

		if ($scope.do_info) {
			$scope.ds_mst.WHOUT_GB 	= '3050';	// 납품ㅊ출고
			$scope.ds_mst.WH_CD 	= $scope.do_info.WH_CD;
			$scope.ds_mst.PARTNR_NM = $scope.do_info.PARTNR_NM;
			$scope.ds_mst.PARTNR_ID = $scope.do_info.PARTNR_ID;
			$scope.ds_mst.OD_ID		= $scope.do_info.DO_ID;
			$scope.ds_mst.OD_NO 	= $scope.do_info.DO_NO;
			$scope.ds_mst.REMARKS 	= XUTL.isEmpty($scope.do_info.DO_REMARKS) ? "" : "- 출하지시서 비고: " + $scope.do_info.DO_REMARKS + '\n';
			// console.log($scope.ds_mst, $scope.do_info)

			// subGrid 추가
			const LIST_PARAM = {
				querySet	: [{queryId: "yam.wm.WHOUT_REG.selDoList",	queryType:"selList",	dataName:"subGrid.data",	param:DO_PARAM}]
			}

			blockUI.start();
			let dataList
			try {
				dataList = await XUTL.fetch({
					url: "/std/cmmn/mquery.do",
					data: LIST_PARAM
				});
			} catch(ex) {
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

	// 출고품목 셋팅
	$scope.lfn_subGrid_add = () => {
		// 신규 버튼
		$scope.lfn_btn_onClick('NEW');
		// 기본값 셋팅
		$scope.ds_mst.WHOUT_GB 	= "3050"; 	//납품출고
		$scope.ds_mst.WH_CD 	= "1030";	//
		//
		// 출고품목 조회
		const itmCd 		= $scope.ds_conf.paramSet.ITM_CD;
		const whoutQty 		= $scope.ds_conf.paramSet.WHOUT_QTY;
		const trAggrDy 		= $scope.ds_conf.paramSet.TR_AGGR_DY;

		const queryParam = {
			ITM_CD		: itmCd,
			WH_CD		: $scope.ds_mst.WH_CD,
			SIO_YYYY	: trAggrDy.substring(0, 4),
			SIO_MM		: trAggrDy.substring(5, 7)

		}

		const param = {
			querySet	: [{queryId: "yam.wm.WHOUT_REG.subItmCdInfo",	queryType:"selList",	dataName:"subItmCdInfo",	param:queryParam}]
		}

		blockUI.start();
		XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		}).then((response) => {
			$.each(response.success, (name, data) => {
				XUTL.setWithPath($scope, name, data);
			});

			if ($scope.subItmCdInfo && $scope.subItmCdInfo.length > 0) {
				$scope.subItmCdInfo[0].WHOUT_QTY = whoutQty || 0;
				$scope.subGrid.data = $scope.subItmCdInfo;
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});

	}

	// 생산계획관리에서 넘어오는 경우
	// $scope.lfn_search_tr = async () => {
	// 	// TR_AGGR_DY / TR_AGGR_TM / TR_AGGR_SN 으로  PWP_NO 파악
	// 	const queryParam = {
	// 		TR_AGGR_DY	: $scope.ds_conf.paramSet.TR_AGGR_DY,
	// 		TR_AGGR_TM	: $scope.ds_conf.paramSet.TR_AGGR_TM,
	// 		TR_AGGR_SN	: $scope.ds_conf.paramSet.TR_AGGR_SN,
	// 		WHOUT_GB	: "3050" // 납품출고
	// 	}
	//
	// 	const param = {
	// 		querySet	:
	// 			[
	// 				{queryId: "yam.wm.WHOUT_REG.selWhoutInfoByTr",	queryType:"selOne",		dataName:"whoutNo",	param:queryParam},
	// 				//{queryId: "yam.wm.WHOUT_REG.selPwpNoByTr",		queryType:"selOne",		dataName:"pwpNo",	param:queryParam},
	// 			]
	// 	}
	//
	// 	blockUI.start();
	// 	let ret = await XUTL.fetch({
	// 		url	: "/std/cmmn/mquery.do",
	// 		data: param
	// 	})
	// 	$timeout(() => {
	// 		blockUI.stop();
	// 	});
	//
	// 	let whoutNo = ret?.success?.whoutNo?.WHOUT_NO ;
	// 	//let pwpNo	= whoutNo ? ret?.success?.whoutNo?.OD_NO :ret?.success?.pwpNo?.PWP_NO ;
	//
	//
	// 	// pwp_no 가 od_no 인것이 있는지 확인 있으면 조회 없음 등록
	// 	if (typeof whoutNo === "undefined" || !whoutNo) {
	// 		$scope.lfn_subGrid_add();
	// 	} else {
	// 		$scope.ds_cond.WHOUT_NO = whoutNo;
	// 		$scope.lfn_search();
	// 	}
	// }

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST")

		const param = {
			querySet	:
				[
				 {queryId: "yam.wm.WHOUT_REG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.wm.WHOUT_REG.selSubList",	queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond}
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
			$scope.lfn_filter_whoutGb();	//출고구분 조회용으로 필터

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
    			alert("출고항목을 등록 하세요.");
    			return false;
    		} else if (!NG_GRD.validateGridData($scope.subGrid.gridApi).isValid) {
    			return false;
    		}

		} else if (name === "CANCEL") {
			// 지시서에 의한 출고일 경우 취소하면 안됨.
			const odId = $scope.ds_mst.OD_ID;
			if (!NG_UTL.isEmpty(odId)) {
				var odNm = "";
				switch ($scope.ds_mst.OD_NO.substring(0,2).toUpperCase()) {
					case "WP" : odNm = "실적"; break;
					case "DO" : odNm = "출하"; break;
				}
				alert(odNm + '지시서에 의한 출고는 취소할 수 없습니다. 지시서번호:' + $scope.ds_mst.OD_NO);
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
		var confirmMsg = "저장 하시겠습니까?";
		var successMsg = "정상적으로 처리완료 되었습니다.";
		if (name === "CONFIRM") {
			confirmMsg = "출고처리 하시겠습니까?";
		} else if (name === "CANCEL") {
			confirmMsg = "출고취소 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}

		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.ds_mst);
		//확정처리시 출고항목정보 추가
		if (name === "CONFIRM") {
			xmlDoc.appendXml("list", $scope.subGrid.data);
		}

		const param =
			{
				queryId	: "yam.wm.WHOUT_REG.save",
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
				$scope.ds_cond.WHOUT_ID = response.RS_MESSAGE;
				$scope.lfn_search();
				XUTL.sendTopMessage("CHANGE_WHOUT", {});	//출고정보 변경 브로드캐스팅
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
		columnDefs		:
			[
			{displayName:'순번',		field:'ROW_NUM',		width:'50',		type:'string',	cellClass:'align_cen',	cellTemplate:NG_CELL.getRowNumRenderer()},
			{displayName:'품목코드',	field:'ITM_CD',			width:'150',	type:'string',	cellClass:'align_cen',	validTypes:"required"},
			{displayName:'품목명',		field:'ITM_NM',			width:'*',		type:'string',	cellClass:'align_lft'},
			{displayName:'수량',		field:'WHOUT_QTY',		width:'100',	type:'string',	cellClass:'align_cen',	cellTemplate:numfCell,	validTypes:"required"},
			{displayName:'단위',		field:'WHOUT_UN',		width:'100',	type:'string',	cellClass:'align_cen',	cellFilter:'codeName:grid.appScope.ds_code.QTY_UN'},
			{displayName:'단가',		field:'WHOUT_PRC',		width:'150',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell},
			{displayName:'공급가',		field:'WHOUT_SPL_AM',	width:'150',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell},
			{displayName:'부가세',		field:'WHOUT_VAT',		width:'150',	type:'string',	cellClass:'align_rgt',	cellTemplate:numfCell},
			{displayName:'합계금액',	field:'WHOUT_SUM_AM',	width:'150',	type:'string',	cellClass:'align_rgt',	cellFilter:'number'},
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "출고품목목록");

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
		// 출고수량 검증. 재고수량 이상 입력 금지.
		if (XUTL.isIn(name, "WHOUT_QTY") && entity.STOCK_QTY < entity.WHOUT_QTY) {
			entity.WHOUT_QTY = '';
			alert('출고수량은 재고수량 ' + entity.STOCK_QTY + ' ' + entity.WHOUT_UN + ' 를(을) 초과할 수 없습니다.' );
		}
		if (XUTL.isIn(name, "WHOUT_QTY", "WHOUT_PRC")) {
			entity.WHOUT_SPL_AM	= XUTL.toNum(entity.WHOUT_QTY) * XUTL.toNum(entity.WHOUT_PRC); 
			entity.WHOUT_VAT	= XUTL.ceil(entity.WHOUT_SPL_AM / 10);
			entity.WHOUT_SUM_AM	= entity.WHOUT_SPL_AM + entity.WHOUT_VAT;
		} else if (name === "WHOUT_VAT") {
			entity.WHOUT_SUM_AM	= XUTL.toNum(entity.WHOUT_SPL_AM) + XUTL.toNum(entity.WHOUT_VAT);
		}
		
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

});// control end
