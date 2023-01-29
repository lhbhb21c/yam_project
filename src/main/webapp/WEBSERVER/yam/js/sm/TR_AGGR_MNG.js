/**
 * 파일명	: TR_AGGR_MNG.js
 * 설명	: 주문집계관리
 *
 * 수정일			수정자		수정내용
 * 2021.11.01	염국선		최초작성
 */
//angular module instance
let app = NG_UTL.instanceBasicModule("mstApp", []);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};
	//code set
	$scope.ds_code	= {
		TR_AGGR_ST	: [],	//주문집계상태
		//load--------------------------
		TR_AGGR_TM_F: []	//주문집계차수 필터
	}
	//조회 조건
	$scope.ds_cond	= {
		SIO_WH_CD 	: '1000' // 생산창고
	};
	//마스터(주문집계)
	$scope.ds_mst	= {};
	//데이터
	$scope.ds_data	= {
		LAST_TM		: {}	//최종차수정보
	};
	

	//초기화
	$scope.load = async (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		
		//공통코드
		$scope.ds_code.TR_AGGR_ST	= XUTL.getCodeFactory().TR_AGGR_ST;	//주문집계상태
						
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		await $scope.lfn_load_base();
		//조회
		$timeout(() => {
			$scope.lfn_search();
		});

		//작업지시정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_PWO", "/yam/sm/TR_AGGR_MNG", (msg) => {
			$scope.lfn_search();
	    });
		//작업실적정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_PWP", "/yam/sm/TR_AGGR_MNG", (msg) => {
			$scope.lfn_search();
	    });
		// 창고이동정보가 변경 되었으면 다시 조회할 리스너 설정
		XUTL.listenTopMessage("CHANGE_WSFR", "/yam/sm/TR_AGGR_MNG", (msg) => {
			$scope.lfn_search();
		});

	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.subGrid.data = $scope.subGrid.data||[];
		
		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
			// 창고코드 설정
			$scope.ds_cond.SIO_WH_CD = '1000'; // 생산창고
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.ds_data, true);
			XUTL.empty($scope.ds_mst);
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
    	
    	if (name === "AGGR") {
    		return $scope.ds_mst.TR_AGGR_ST && !XUTL.isIn($scope.ds_mst.TR_AGGR_ST, "10");
    	} else if (name === "PARSE") {
    		return !XUTL.isIn($scope.ds_mst.TR_AGGR_ST, "30");	//10:임시저장, 30:주문집계, 40:생산량분석
		} else if (XUTL.isIn(name,"sub.WSFR","sub.DO")) {
			return $scope.subGrid.gridApi.selection.getSelectedCount() < 1;
		}
    	
		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE") {
			top.MDI.closeTab("/yam/sm/TR_AGGR_MNG");

		} else if (name === "SEARCH") {
			$scope.lfn_search();

		} else if (XUTL.isIn(name, "AGGR", "PARSE")) {
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}
		}  else if (name === 'sub.WSFR') {
			// 창고이동
			$scope.lfn_run_wsfr();

		}  else if (name === 'sub.DO') {
			// 창고이동
			$scope.lfn_run_do();

		}
	}//end-lfn_btn_onClick
	
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = (name) => {
    	if (name.indexOf("ds_mst.") === 0) {
    		if (name === "ds_mst.TR_AGGR_MEMO") {
    			return $scope.lfn_btn_disabled("AGGR");
    		}
    		return true;
    	}
		return false;
    }//end-lfn_input_disabled
    
	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
	}//end-lfn_input_onChange
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////

    
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	//조회조건 설정
	$scope.lfn_set_cond = () => {
		let dy	= $scope.ds_cond.TR_AGGR_DY;
		$scope.lfn_filter_tm();	//주문집계차수코드(조회조건) 필터
		if (!dy || dy !== $scope.ds_data.LAST_TM.TR_AGGR_DY) {
			if ($scope.ds_code.TR_AGGR_TM_F.length > 1) {
				$scope.ds_cond.TR_AGGR_TM = ($scope.ds_code.TR_AGGR_TM_F.length-1)+"";
			} else {
				$scope.ds_cond.TR_AGGR_TM = $scope.ds_code.TR_AGGR_TM_F.length+"";
			}
		}
		$scope.ds_cond.TR_AGGR_DY = $scope.ds_data.LAST_TM.TR_AGGR_DY;

	}//end-lfn_set_cond
	
	//주문집계차수코드(조회조건) 필터
	$scope.lfn_filter_tm = function () {
		XUTL.empty($scope.ds_code.TR_AGGR_TM_F);
		for (let i=0; i<4 && i<=$scope.ds_data.LAST_TM.TR_AGGR_TM; i++) {
			$scope.ds_code.TR_AGGR_TM_F.push({CODE_CD:(i+1)+"", CODE_NM:(i+1)+"차"});
		}
		//alert(JSON.stringify())
	}//end-lfn_filter_tm


	$scope.lfn_run_wsfr = () => {
		// IDS 파악
		let rows = $scope.subGrid.gridApi.selection.getSelectedRows();
		let ids = rows.map((item ,index) => {
			return item.ITM_ID;
		})

		let param =
			{
				TR_AGGR_TM	: $scope.ds_mst.TR_AGGR_TM,
				TR_AGGR_ID	: $scope.ds_mst.TR_AGGR_ID,
				TR_AGGR_DY	: $scope.ds_mst.TR_AGGR_DY,
				ITM_IDS		: encodeURIComponent(ids.join(',')),
			};
		_YAM.openMdiTab("WSFR_REG", null, param);

		$scope.subGrid.gridApi.selection.clearSelectedRows();
	}


	$scope.lfn_run_do = () => {
		// IDS 파악
		let rows = $scope.subGrid.gridApi.selection.getSelectedRows();
		let list = rows.map((item ,index) => {
			return item.TR_AGGR_SN;
		})

		let param =
			{
				OD_ID		: $scope.ds_mst.TR_AGGR_ID,
				OD_NO		: $scope.ds_mst.TR_AGGR_ID,
				OD_SN_LIST	: encodeURIComponent(list.join(',')),
			};
		_YAM.openMdiTab("DO_MNG", null, param);

		$scope.subGrid.gridApi.selection.clearSelectedRows();
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

    
	///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
	//기초 데이터 로드
	$scope.lfn_load_base = () => {
		let param = {
			querySet	:
				[
				 {queryId: "yam.sm.TR_AGGR_MNG.selLastTmInfo",	queryType:"selOne",	dataName:"ds_data.LAST_TM",	param:{}}
				]
		}
			
		blockUI.start();
		return XUTL.fetch({
			url	: "/std/cmmn/mquery.do",
			data: param
		}).then((response) => {
			$.each(response.success, (name, data) => {
				XUTL.setWithPath($scope, name, data);
			});
			$scope.lfn_set_cond();	//조회조건설정
		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = () => {
		$scope.lfn_dataset_init("MST");

		let param = {
			querySet	:
				[
				 {queryId: "yam.sm.TR_AGGR_MNG.selLastTmInfo",	queryType:"selOne",		dataName:"ds_data.LAST_TM",	param:{}},
				 {queryId: "yam.sm.TR_AGGR_MNG.selMstInfo",		queryType:"selOne",		dataName:"ds_mst",			param:$scope.ds_cond},
				 {queryId: "yam.sm.TR_AGGR_MNG.selSubList",		queryType:"selList",	dataName:"subGrid.data",	param:$scope.ds_cond}
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
			$scope.lfn_set_cond();	//조회조건설정
			
		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search
	
	//검증
	$scope.lfn_validate = (name) => {
		if (name === "AGGR") {
		} else if (name === "PARSE") {
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
		if (name === "AGGR") {
			confirmMsg = "주문집계를 실행 하시겠습니까?";
		} else if (name === "PARSE") {
			confirmMsg = "생산량분석을 실행 하시겠습니까?";
		}

		if (!confirm(confirmMsg)) {
			return;
		}

		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.ds_mst);
		let param =
			{
				queryId	: "yam.sm.TR_AGGR_MNG.save",
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
				let keys = response.RS_MESSAGE.split(",");
				$scope.ds_cond.TR_AGGR_ID 	= keys[0];
				$scope.ds_cond.TR_AGGR_DY	= keys[1];
				$scope.ds_cond.TR_AGGR_TM	= keys[2];
				$scope.lfn_search();
				XUTL.sendTopMessage("CHANGE_TR_AGGR", {});	//주문집계 변경 브로드캐스팅
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



	$scope.subGrid = NG_GRD.instanceGridOptions({
		enableRowHeaderSelection: true,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
		multiSelect		: true,
		rowTemplate		: NG_CELL.getRowTemplate({toggleSelection:true}),
		// rowTemplate		: NG_CELL.getRowTemplate({}),
		customStateId	: "/yam/sm/TR_AGGR_MNG/subGrid",
		columnDefs		:
			[
				{displayName:'순번',		field:'TR_AGGR_SN',	width:'50',		type:'string',	cellClass:'align_rgt'},
				{displayName:'품목코드',	field:'ITM_CD',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'품목명',		field:'ITM_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'단위',		field:'ITM_UN_NM',	width:'50',		type:'string',	cellClass:'align_cen',	visible:false},
				{displayName:'주문수량',	field:'TR_QTY',		width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'number',	exportType:"number"},
				{displayName:'재고수량',	field:'STOCK_QTY',	width:'100',	type:'string',	cellClass:'align_rgt',	exportType:"number",
					// cellFilter:'number', //
					cellFilter:'dataRender:"lfn_cell_format":col.colDef.field:row.entity:grid',
					cellTemplate: NG_CELL.getAnchorRenderer({ngIf:"lfn_cell_show", ngClick:"lfn_cell_onClick"})
				},
				{displayName:'이동수량',	field:'WSF_QTY',	width:'100',	type:'string',	cellClass:'align_rgt',	exportType:"number",
					cellFilter:'number', // cellFilter:'dataRender:"lfn_cell_format":col.colDef.field:row.entity:grid',
					// cellTemplate: NG_CELL.getAnchorRenderer({ngIf:"lfn_cell_show", ngClick:"lfn_cell_onClick"})
				},
				{displayName:'지시수량',	field:'PWO_QTY',	width:'100',	type:'string',	cellClass:'align_rgt',	exportType:"number",
					cellFilter:'number|emptyLabel:"작업지시등록"', // cellFilter:'dataRender:"lfn_cell_format":col.colDef.field:row.entity:grid',
					cellTemplate: NG_CELL.getAnchorRenderer({ngIf:"lfn_cell_show", ngClick:"lfn_cell_onClick"})
				},
				{displayName:'생산수량',	field:'PWP_QTY',	width:'100',	type:'string',	cellClass:'align_rgt',	exportType:"number",
					cellFilter:'number', // cellFilter:'dataRender:"lfn_cell_format":col.colDef.field:row.entity:grid',
					cellTemplate: NG_CELL.getAnchorRenderer({ngIf:"lfn_cell_show", ngClick:"lfn_cell_onClick"})
				},
			]
	});
	NG_GRD.addExcelExportMenu($scope.subGrid, "주문집계목록");

	$scope.lfn_cell_format = function (name, entity, grid) {
		if (XUTL.isIn(name, "STOCK_QTY")) {
			return entity[name]>0?entity[name]:'';
		}
		return entity[name]
	}

	//cell show
	$scope.lfn_cell_show = (name, entity, grid) => {
		if (XUTL.isIn(name, "STOCK_QTY", "WSF_QTY")) {
			return entity[name]>0;
		}
		return true;
	}//end-lfn_cell_show

	//cell click event
	$scope.lfn_cell_onClick = (name, entity, grid) => {
		// console.log(name, entity)

		if (grid.options === $scope.subGrid) {
			//작업지시번호 클릭시 등록화면으로 이동
			if (name === "PWO_QTY") {
				if (!($scope.ds_mst.TR_AGGR_ST === "40")) {	//40:생산량분석
					alert("생산량분석을 먼저 실행 하세요.!");
					return;
				}

				let pwoQty = entity[name];
				let trQty = entity["TR_QTY"];
				let stockQty = entity["STOCK_QTY"];
				let wsfQty = entity["WSF_QTY"];
				let val = trQty - stockQty - wsfQty;
				let param =
					{
						PWO_GB		: "10",	//10:주문생산
						TR_AGGR_DY	: $scope.ds_mst.TR_AGGR_DY,
						TR_AGGR_TM	: $scope.ds_mst.TR_AGGR_TM,
						TR_AGGR_ID	: entity.TR_AGGR_ID,
						TR_AGGR_SN	: entity.TR_AGGR_SN,
						PWO_ITM_ID	: entity.ITM_ID,
						PWO_ITM_CD	: entity.ITM_CD,
						PWO_QTY		: trQty
					};

				_YAM.openMdiTab("PWO_REG", null, param);

			} else if (name === "PWP_QTY" || name === "STOCK_QTY") {
				let param =
					{
						TR_AGGR_TM	: $scope.ds_mst.TR_AGGR_TM,
						TR_AGGR_DY	: $scope.ds_mst.TR_AGGR_DY,
						TR_AGGR_ID	: entity.TR_AGGR_ID,
						TR_AGGR_SN	: entity.TR_AGGR_SN,
						ITM_IDS		: entity.ITM_ID,
					};
				_YAM.openMdiTab("WSFR_REG", null, param);
			}
		}
	}//end-lfn_cell_onClick
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
