/**
 * 파일명	: Login.js
 * 설명	: Login
 * 
 * 수정일		 	수정자		수정내용
 * 2021.10.23	이경수		최초작성
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
	$scope.ds_code	= {}
	//조회 조건
	$scope.ds_cond	= {};
	//마스터 -모달에디트
	$scope.ds_mst	= {};
	
	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf = conf||{};
		$scope.ds_conf.paramSet = XUTL.getRequestParamSet();
		
		//데이터 초기화
		$scope.lfn_dataset_init();
		$scope.lfn_load_base();
		
		$timeout(() => {
			$("[ng-model='ds_mst.USER_ID']").focus();			
		});
	}	

    //데이터 초기화
    $scope.lfn_dataset_init = (name) => {
   	if (!name || name === "ds_cond") {
        	XUTL.empty($scope.ds_cond);
    	}
    	if (!name || name === "MST") {
        	XUTL.empty($scope.ds_mst);
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
    	if (name === "LOGIN") {
    		if ($scope.lfn_validate(name)) {
    			$scope.lfn_run(name)
    		}
    	}
    }//end-lfn_btn_onClick
    
    //입력관련 ng-disabled 처리
    $scope.lfn_input_disabled = (name) => {
    	return false;
    }//end-lfn_input_disabled
    
    //입력필드 ng-change
    $scope.lfn_input_onChange = (name) => {
    }//end-lfn_input_onChange

    //입력필드 ng-enter
    $scope.lfn_input_onEnter = (name) => {
		if (name === "ds_mst.USER_ID") {
			$timeout(() => {
				$("[ng-model='ds_mst.USER_PWD']").focus();
			});
			
		} else if (name === "ds_mst.USER_PWD") {
			$scope.lfn_btn_onClick("LOGIN");
		}

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

    //검증
	$scope.lfn_validate = (name) => {
		if (name === "LOGIN") {
			if (!$scope.ds_mst.USER_ID) {
				alert("ID를 입력 하세요.");
				$timeout(() => {
					$("[ng-model='ds_mst.USER_ID']").focus();
				});
				return false;
				
			} else if (!$scope.ds_mst.USER_PWD) {
				alert("임호를 입력 하세요.");
				$timeout(() => {
					$("[ng-model='ds_mst.USER_PWD']").focus();
				});
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
		console.log('check')
        blockUI.start();

		XUTL.fetch({
			url	: "/login.do",
			enc	: true,
			data: $scope.ds_mst
		}).then((response) => {
				if (response.erMsg) {
					alert(response.erMsg);
				} else {
					$window.location.href = "/";	// 메인화면으로 이동
				}
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
