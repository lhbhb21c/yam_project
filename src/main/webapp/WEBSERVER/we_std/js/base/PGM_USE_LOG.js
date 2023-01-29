/**
 * 파일명	: PGM_USE_LOG.js
 * 설명	: 사용자LOG조회
 * 
 * 수정일		 	수정자		수정내용
 * 2021.02.01	이경수		최초작성
 */
//angular module instance
const app = NG_UTL.instanceBasicModule("mstApp", ["ui.select", "ngSanitize"]);
//controller 설정
app.controller("mstCtl", ($scope, $timeout, $filter, $window, uiGridConstants, blockUI) => {
	///////////////////////////////////////////////////////////////////////////////////////////////
	// DATA 선언 및 초기화
	///////////////////////////////////////////////////////////////////////////////////////////////
	//configuration
	$scope.ds_conf	= {};

	//조회 조건
	$scope.ds_cond	= {};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf 				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		$scope.ds_conf.paramSet.CMD	= $scope.ds_conf.paramSet.CMD||"REG"; 	//REG/UPD/SEL/APPR
				
		//데이터 초기화
		$scope.lfn_dataset_init();
		//기본정보 로드
		$scope.lfn_load_base();
		
		//일자 넣기(디폴트 현재일)
		$scope.ds_cond.REG_DY_FR	= moment().add(-1, 'days').format('YYYY-MM-DD');		//주문시작일 = 현재일 - 1달
		$scope.ds_cond.REG_DY_TO	= moment().format('YYYY-MM-DD');						//주문종료일 = 현재일
	}	

    //데이터 초기화
    $scope.lfn_dataset_init = (name) => {
    	$scope.mstGrid.data = $scope.mstGrid.data||[];
    	
    	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond)

    	} else if (!name || name === "MST") {
       		XUTL.empty($scope.mstGrid.data);
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
    	return false;
    }//end-lfn_btn_disabled
    
    //버튼클릭이벤트
    $scope.lfn_btn_onClick = (name) => {
    	if (name === "CLOSE") {
    		top.MDI.closeTab("/we_std/base/PGM_USE_LOG");
    		
    	} else if (name === "SEARCH") {
           	$scope.lfn_search();
           	
    	} 
    }//end-lfn_btn_onClick

    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = (name) => {
		return false;
    }//end-lfn_input_disabled
    
    //입력필드 change
    $scope.lfn_input_onChange = (name) => {
    }//end-lfn_input_onChange

    //입력필드 엔터
    $scope.lfn_input_onEnter = (name) => {
    }//end-lfn_input_onEnter
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //UI interface
	///////////////////////////////////////////////////////////////////////////////////////////////
	    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////
    //기초 데이터 로드
    $scope.lfn_load_base = () => {
    }//end-lfn_load_base
    
    //조회
    $scope.lfn_search = (sels) => {
    	$scope.lfn_dataset_init("MST")
    	const param = {
    		querySet	:
    			[
    			 {queryId: "we.std.base.PGM_USE_LOG.selMstList",	queryType:"selList",	dataName:"mstGrid.data",	param:$scope.ds_cond}
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
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////
    //마스터 Grid Options
    $scope.mstGrid = NG_GRD.instanceGridOptions({
		customStateId	: "/we_std/base/PGM_USE_LOG/mstGrid",
		columnDefs		:
			[
			 {displayName:'시간',			field:'REG_DT',			width:'150',	type:'string',	cellClass:'align_cen'},
			 {displayName:'멤버ID',		field:'MEM_ID',			width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
			 {displayName:'섹터ID',		field:'SECTR_ID',		width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
			 {displayName:'섹터명',		field:'SECTR_NM',		width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
			 {displayName:'회사코드',		field:'CO_CD',			width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
			 {displayName:'사용자ID',		field:'USER_ID',		width:'100',	type:'string',	cellClass:'align_cen'},
			 {displayName:'사용자명',		field:'USER_NM',		width:'150',	type:'string',	cellClass:'align_cen'},
			 {displayName:'프로그램',		field:'PGM_ID',			width:'200',	type:'string',	cellClass:'align_cen'},
			 {displayName:'내용',			field:'LOG_CN',			width:'*',		type:'string',	cellClass:'align_lft'}
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "사용자로그");
    ///////////////////////////////////////////////////////////////////////////////////////////////
	// //Grid 관련   
	///////////////////////////////////////////////////////////////////////////////////////////////	

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
 	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

}); // control end
