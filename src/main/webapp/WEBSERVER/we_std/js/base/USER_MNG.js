/**
 * 파일명	: USER_MNG.js
 * 설명	: 사용자설정
 *
 * 수정일			수정자		수정내용
 * 2022.03.02		지노
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
		MEM_TY		: [],
		MEM_GB		: [],	//멤버구분
		MEM_ROLE_CDS: [],
		ROOT_MENU_ID: [],
		SECTR_ID	: [],
		USE_YN		: []	//사용여부
	};
	//조회조건 dataset
	$scope.ds_cond	= {};
	//마스터 dataset
	$scope.ds_mst	= {};
	// 비밀번호 변경 dataset
	$scope.ds_passwd= {};

	//초기화
	$scope.load = (conf) => {
		$scope.ds_conf				= conf||{};
		$scope.ds_conf.paramSet 	= XUTL.getRequestParamSet();
		$scope.ds_conf.paramSet.CMD	= $scope.ds_conf.paramSet.CMD||"REG";

		//공통코드
		$scope.ds_code.MEM_TY		= XUTL.getCodeFactory().MEM_TY;			//
		$scope.ds_code.MEM_GB		= XUTL.getCodeFactory().MEM_GB;			//멤버구분
		$scope.ds_code.MEM_ROLE_CDS	= XUTL.getCodeFactory().MEM_ROLE_CD; 	//
		// $scope.ds_code.ROOT_MENU_ID = XUTL.getCodeFactory().ROOT_MENU_ID;   //
		$scope.ds_code.USE_YN		= XUTL.getCodeFactory().USE_YN;			//사용  여부

		//데이터 초기화
		$scope.lfn_dataset_init();
		//기초데이터 로드
		$scope.lfn_load_base();
		//조회
		$scope.lfn_search();
	}//end-load

	//데이터 초기화
	$scope.lfn_dataset_init = (name) => {
		$scope.mstGrid.data = $scope.mstGrid.data||[];

		if (!name || name === "ds_cond") {
			XUTL.empty($scope.ds_cond, true);
		}
		if (!name || name === "MST") {
			XUTL.empty($scope.ds_mst, true);
			XUTL.empty($scope.mstGrid.data);
		}
		if (!name || name === "PWD") {
			XUTL.empty($scope.ds_passwd, true);
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
		// console.log(name)
		if (name==='DUP_CHECK' && XUTL.isIn($scope.ds_mst.ROW_CRUD, ["R","U"])) {
			return false;
		}
		return true;
	}//end-lfn_btn_show

	//버튼 관련 ng-disabled 처리
	$scope.lfn_btn_disabled = (name) => {
		if (!$scope.lfn_btn_show(name)){
			return true;
		}

		if (name === "SEARCH") {
			return false;
		}

		if (name === "SAVE") {
			if (!$scope.ds_mst.USER_ID || !$scope.ds_mst.USER_NM || !$scope.ds_mst.USER_PWD) {
				return true;
			}
			return false;
		}

		if (name === "NEW") {
			return false;
		}
		
		return false;
	}//end-lfn_btn_disabled

	//버튼클릭이벤트
	$scope.lfn_btn_onClick = (name) => {
		if (name === "CLOSE"){
			top.MDI.closeTab("/we_std/base/USER_MNG");

		} else if (name === "SEARCH") {
			$scope.lfn_search();
			
		} else if (XUTL.isIn(name, "SAVE", "PASSWORD")) {	//저장
			if ($scope.lfn_validate(name)) {
				$scope.lfn_run(name)
			}

		} else if (name === "NEW") {
			$scope.lfn_start_edit();

		} else if (name === 'ds_mst.PARTNR_ID') {
			// POPup
			XPOP.popup(
				{
					url:"/forward/yam/cmmn/popup/PARTNR_POP.do?ver=1000" ,
					name:"PARTNR_POP",
					specs:"width=800, height=600, left=100, top=100"
				},
				{multiple:false, noclose:false, FIX_PARTNR_GB: ""},
				null
			).then((response) => {
				$timeout(() => {
					$scope.ds_mst.MEM_REF1 	= response.PARTNR_ID?response.PARTNR_NO:response.PARTNR_NO;
					$scope.ds_mst.PARTNR_ID = response.PARTNR_ID?response.PARTNR_NO:response.PARTNR_NO;
					$scope.ds_mst.PARTNR_NM = response.PARTNR_NM;
					// console.log('$scope.ds_mst.MEM_REF1', $scope.ds_mst)
				});
			});

		} else if (name === 'DUP_CHECK') {
			$scope.lfn_check_id_dup($scope.ds_mst.USER_ID);

		// } else if (name === 'passwd.SAVE') {
		// 	$scope.lfn_save_password($scope.ds_passwd.USER_PWD, $scope.ds_passwd.USER_PWD2);

		}

	}//end-lfn_btn_onClick

	//입력관련 ng-disabled 처리
	$scope.lfn_input_disabled = (name, val) => {
		if (name.indexOf("ds_mst.") === 0) {

			// let ret = !$scope.ds_mst.ROW_CRUD
			// 수정이면 USER_ID, SECTR_ID 는 수정불가
			if (XUTL.isIn($scope.ds_mst.ROW_CRUD, ["R","U"]) && XUTL.isIn(name, ['ds_mst.USER_ID','ds_mst.SECTR_ID'])) {
				return true;
			// } else if (XUTL.isIn(name, ['ds_mst.MEM_ROLE_CDS'])) {
			// 	return SS_USER_INFO.MEM_ROLE_CDS.indexOf(val) < 0;
			}  else {
				return !$scope.ds_mst.ROW_CRUD;
			}

		} else if (XUTL.isIn(name, ['ds_passwd.USER_PWD','ds_passwd.USER_PWD2'])) {
			return false;

		} else if (XUTL.isIn(name, ['ds_cond.MEM_GB','ds_cond.USE_YN'])) {
			return false;
		}

		return true;
	}//end-lfn_input_disabled

	//입력필드 change
	$scope.lfn_input_onChange = (name) => {
		if (name.indexOf("ds_mst.") === 0) {
			if ($scope.ds_mst.ROW_CRUD === "R") {
				$scope.ds_mst.ROW_CRUD = "U";
			}
		}
	}//end-lfn_input_onChange

	// ng-if
	$scope.lfn_input_show = (name, val) => {
		if (XUTL.isIn($scope.ds_mst.ROW_CRUD, ["R","U"]) && XUTL.isIn(name, ['ds_mst.USER_PWD','ds_mst.USER_PWD2'])) {
			return false;
		}

		if (XUTL.isIn(name, ['PASSWD_CHANGE'])) {
			return (XUTL.isIn($scope.ds_mst.ROW_CRUD, ["R","U"]));
		}

		return true;
	}

	// 입력필드 포커스 아웃에서 처리할 것들
	$scope.lfn_input_blur = (name) => {
		if (name === "ds_mst.USER_PWD") {
			$scope.lfn_validate_password($scope.ds_mst.USER_PWD);
		}

		if (name === "ds_mst.USER_PWD2") {
			$scope.lfn_equal_password($scope.ds_mst.USER_PWD, $scope.ds_mst.USER_PWD2);
		}
	}

	//입력필드 ng-enter 처리
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
		let param = {
			querySet	:
				[
					{queryId: "we.std.base.USER_MNG.selSubRootMenuList",	queryType:"selList",		dataName:"ds_code.ROOT_MENU_ID",			param:$scope.ds_cond},
					{queryId: "we.std.base.USER_MNG.selSubCoSectrList",		queryType:"selList",		dataName:"ds_code.SECTR_ID",				param:$scope.ds_cond}
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

			$scope.lfn_mst_reset();
		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_load_base

	//조회
	$scope.lfn_search = (memId) => {
		$scope.lfn_dataset_init("MST");
		$scope.lfn_dataset_init("PWD");

		const param = {
			querySet	:
				[
					{queryId: "we.std.base.USER_MNG.selMstList",	queryType:"selList",		dataName:"mstGrid.data",			param:$scope.ds_cond}
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

			$scope.lfn_mst_reset();

			if (typeof memId !== 'undefined' && memId !== '') {
				NG_GRD.selectRow($scope.mstGrid.gridApi, XUTL.findRows($scope.mstGrid.data, "MEM_ID", memId));
			}
		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search

	// 아아디 중복체크
	$scope.lfn_check_id_dup = async (userId) => {
		$scope.ds_mst.dup_check = false;

		if (!userId || userId === '') {
			alert('아이디를 입력하세요!');
			return;
		}
		// 검증
		if (!$scope.lfn_validate_userId()) {
			return;
		}

		let ret = await XUTL.fetch({
			url: "/user_mng/id_dup_check.do",
			body: {
				userId: encodeURIComponent(userId)
			}
		})
		if (ret && ret.erMsg) {
			alert(ret.erMsg);
			return;
		}

		alert($scope.ds_mst.USER_ID + ' 은(는)은 사용가능합니다.');
		$scope.ds_mst.dup_check = true;
	}

	// 비밀번호 암호화
	// $scope.lfn_enc_password = async (passwd) => {
	// 	passwd = passwd || $scope.ds_mst.USER_PWD ;
	// 	if (typeof passwd === 'undefined' || passwd === '') {
	// 		return;
	// 	}
	//
	// 	const param = {
	// 		"userPassword" : passwd
	// 	}
	//
	// 	const ret = await XUTL.fetch({
	// 			url: "/user_mng/generate_password.do",
	// 			enc: true,
	// 			data: param
	// 		})
	//
	// 	if (ret && ret.erMsg) {
	// 		alert(ret.erMsg);
	// 		return;
	// 	}
	//
	// 	return ret.ENC_PASSWORD;
	// }

	// 사용자 선택
	$scope.lfn_show_detail = (mem_id) => {
		XUTL.empty($scope.ds_mst, true);
		$scope.lfn_dataset_init("PWD");

		const param = {
			querySet	:
				[
					{queryId: "we.std.base.USER_MNG.selMstInfo",	queryType:"selOne",		dataName:"ds_mst",			param: {
							MEM_ID: mem_id
						}}
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

			if(!($scope.ds_mst.MEM_ROLE_CDS instanceof Array) && $scope.ds_mst.MEM_ROLE_CDS !== undefined && $scope.ds_mst.MEM_ROLE_CDS.length > 0) {
				$scope.ds_mst.MEM_ROLE_CDS = $scope.ds_mst.MEM_ROLE_CDS.split(',');
			}
			// 파트너 정보
			if ($scope.ds_mst.MEM_TY === '20') {
				$scope.ds_mst.PARTNR_NM = $scope.ds_mst.MEM_REF1_NM;
			}

		}).finally((data) => {
			$timeout(() => {
				blockUI.stop();
			});
		});
	}//end-lfn_search

	//검증
	$scope.lfn_validate = (name) => {
		if (name === "SAVE") {
			if (!XUTL.validateInput($("#ds_mst")).isValid) {
				return false;
			}

			// 신규생성이면
			if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, ["R", "U"])) {
				// 아이디 검사
				if (!$scope.lfn_validate_userId()) {
					return false;
				}
				// 아이디 중복체크 여부 확인
				if (!$scope.ds_mst.dup_check) {
					alert('아이디 중복체크를 하세요.')
					return false;
				}

				// 비밀번호 확인
				if (!$scope.lfn_validate_password($scope.ds_mst.USER_PWD)) {
					return false;
				}
				//동일한지 검사
				if (!$scope.lfn_equal_password($scope.ds_mst.USER_PWD, $scope.ds_mst.USER_PWD2)) {
					return false;
				}
			}

			if (typeof $scope.ds_mst.MEM_ROLE_CDS === 'undefined' || $scope.ds_mst.MEM_ROLE_CDS.length < 1) {
				alert('사용자 권한을 선택하세요.');
				return false;
			}

		} else if ('PASSWORD') {
			if (!XUTL.validateInput($("#ds_pwd")).isValid) {
				return false;
			}
			if (!$scope.lfn_validate_password($scope.ds_passwd.USER_PWD)) {
				return false;
			}
			if (!$scope.lfn_equal_password($scope.ds_passwd.USER_PWD, $scope.ds_passwd.USER_PWD2)) {
				return false;
			}

		} else {
			alert("unknown cmd:"+name)
			return false;
		}

		return true;
	}//end-lfn_validate

	//실행
	$scope.lfn_run = async (name) => {
		let confirmMsg = name === "PASSWORD"? "비밀번호를 변경하시겠습니까?" : "저장 하시겠습니까?";
		let successMsg = "정상적으로 처리완료 되었습니다.";
		
		if (!confirm(confirmMsg)) {
			return;
		}
		//
		$scope.ds_mst.MEM_ROLE_CDS 	= $scope.ds_mst.MEM_ROLE_CDS.join(",");
		// $scope.ds_mst.CO_CD 		= SS_USER_INFO.COMPANY_CD;
		// TODO 현재는 파트너만 있어서...
		if ($scope.ds_mst.MEM_TY !== '20') {
			$scope.ds_mst.MEM_REF1 = '';
		}

		let old_mst = {...$scope.ds_mst};

		// 신규생성이면
		if (!XUTL.isIn($scope.ds_mst.ROW_CRUD, ["R", "U"])) {
			// password 암호화 처리
			// $scope.ds_mst.USER_PWD = await $scope.lfn_enc_password($scope.ds_mst.USER_PWD);
			// $scope.ds_mst.USER_PWD2 = null;
		}

		if (name === "PASSWORD") {
			$scope.ds_mst.USER_PWD = $scope.ds_passwd.USER_PWD;
		}

		let xmlDoc 	= new XmlDoc({});
		xmlDoc.appendXml("mst", $scope.ds_mst);

		const param =
			{
				CMD		: name,
				XML_TEXT: xmlDoc.toXmlString(),
				USER_ID	: SS_USER_INFO.MEM_ID,
			};

		blockUI.start();
		XUTL.fetch({
			url:"/user_mng/save.do",
			enc: true,
			data: param

		}).then(function (response) {
			if (response && response.erMsg) {
				// 기존데이터 복원
				$scope.ds_mst = {...old_mst};
				alert(response.erMsg);
			} else {
				alert(successMsg);
				$timeout(() => {
					// $scope.ds_cond.MEM_ID = response.RS_MESSAGE;
					$scope.lfn_search(response.RS_MESSAGE);
				});
			}

		}).finally(function (data) {
			$timeout(function () {
				blockUI.stop();
			});
		});
	}//end-lfn_run

	// // 비밀번호 변경
	// $scope.lfn_save_password = async (pwd1, pwd2) => {
	// 	const isValid = await $scope.lfn_validate('PASSWORD');
	// 	if (!isValid) {
	// 		return false;
	// 	}
	//
	// 	if (!$scope.lfn_validate_password(pwd1)) {
	// 		return false;
	// 	}
	//
	// 	if (!$scope.lfn_equal_password(pwd1, pwd2)) {
	// 		return false;
	// 	}
	//
	// 	$scope.lfn_run();
	// 	//
	// 	// let confirmMsg = "비밀번로를 변경 하시겠습니까?";
	// 	// let successMsg = "정상적으로 처리완료 되었습니다.";
	// 	//
	// 	// if (!confirm(confirmMsg)) {
	// 	// 	return false;
	// 	// }
	// 	//
	// 	// $scope.ds_mst.USER_PWD = pwd1;
	// 	// // $scope.ds_passwd = {...$scope.ds_mst, ...$scope.ds_passwd};
	// 	//
	// 	//
	// 	// let xmlDoc 	= new XmlDoc({});
	// 	// xmlDoc.appendXml("mst", $scope.ds_passwd);
	// 	//
	// 	// console.log($scope.ds_passwd, $scope.ds_mst, xmlDoc.toXmlString())
	// 	//
	// 	//
	// 	// const param =
	// 	// 	{
	// 	// 		CMD		: name,
	// 	// 		XML_TEXT: xmlDoc.toXmlString(),
	// 	// 		USER_ID	: $scope.ds_mst.USER_ID,
	// 	// 	};
	// 	//
	// 	// blockUI.start();
	// 	// XUTL.fetch({
	// 	// 	url:"/user_mng/save.do",
	// 	// 	enc: true,
	// 	// 	data: param
	// 	// 	// body:"json=" + escape(encodeURIComponent(JSON.stringify(param)))
	// 	//
	// 	// }).then(function (response) {
	// 	// 	if (response && response.erMsg) {
	// 	// 		// 기존데이터 복원
	// 	// 		$scope.ds_mst = {...old_mst};
	// 	// 		alert(response.erMsg);
	// 	// 	} else {
	// 	// 		alert(successMsg);
	// 	// 		$timeout(() => {
	// 	// 			// $scope.ds_cond.MEM_ID = response.RS_MESSAGE;
	// 	// 			$scope.lfn_search(response.RS_MESSAGE);
	// 	// 		});
	// 	// 	}
	// 	// }).finally(function (data) {
	// 	// 	$timeout(function () {
	// 	// 		blockUI.stop();
	// 	// 	});
	// 	// });
	//
	// };
	///////////////////////////////////////////////////////////////////////////////////////////////
	// //CRUD
	///////////////////////////////////////////////////////////////////////////////////////////////

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Grid 관련
	///////////////////////////////////////////////////////////////////////////////////////////////
	const useYnNmClass = (grid, row, col, rowRenderIndex, colRenderIndex) => {
		return row.entity.USE_YN === "Y" ? 'align_cen' : 'align_cen_red';
	}

    //sub Grid Options
	$scope.mstGrid = NG_GRD.instanceGridOptions({
		customStateId	: "/we_std/base/USER_MNG/mstGrid",
		rowTemplate		: NG_CELL.getRowTemplate({ngClick:"lfn_row_onClick"}),
		columnDefs		:
			[
				{displayName:'멤버ID',		field:'MEM_ID',			width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
				{displayName:'소속',			field:'SECTR_NM',		width:'100',	type:'string',	cellClass:'align_cen',	visible:false},
				{displayName:'사용자ID',		field:'USER_ID',		width:'150',	type:'string',	cellClass:'align_lft'},
				{displayName:'사용자명',		field:'USER_NM',		width:'*',		type:'string',	cellClass:'align_lft'},
				{displayName:'구분',			field:'MEM_GB_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'유형',			field:'MEM_TY_NM',		width:'100',	type:'string',	cellClass:'align_cen'},
				{displayName:'등록일',			field:'REG_DTTM',		width:'100',	type:'string',	cellClass:'align_cen', 	cellFilter:'date:"yyyy-MM-dd"'},
				{displayName:'사용여부',		field:'USE_YN_NM',		width:'70',		type:'string',	cellClass:useYnNmClass},
			]
	});
    NG_GRD.addExcelExportMenu($scope.mstGrid, "사용자목록");

	//row click event
	$scope.lfn_row_onClick = (name, entity, grid) => {
		if (grid.options === $scope.mstGrid) {
			//
			$scope.lfn_show_detail(entity.MEM_ID);
		}
	}//end-lfn_row_onClick

	//cell ng-disabled
	$scope.lfn_cell_disabled = (name, entity, grid) => {
		return true;
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

	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// Utility
	///////////////////////////////////////////////////////////////////////////////////////////////
	// 리셋
	$scope.lfn_mst_reset = () => {
		// GRID DESELECT
		$scope.mstGrid.gridApi.selection.clearSelectedRows();
		XUTL.empty($scope.ds_mst, true);
		$scope.ds_mst.ROW_CRUD = '';
	}

	$scope.lfn_start_edit = () => {
		$scope.	lfn_mst_reset();
		$scope.ds_mst.ROW_CRUD = 'C';
		//소속이 하나일 경우 자동선택
		if ($scope.ds_code.SECTR_ID.length === 1) {
			$scope.ds_mst.SECTR_ID = $scope.ds_code.SECTR_ID[0].CODE_CD;
		}
		// ㅁㅔ뉴
		if ($scope.ds_code.ROOT_MENU_ID.length === 1) {
			$scope.ds_mst.ROOT_MENU_ID = $scope.ds_code.ROOT_MENU_ID[0].CODE_CD;
		}
		// 구분
		if ($scope.ds_code.MEM_GB.length === 1) {
			$scope.ds_mst.MEM_GB = $scope.ds_code.MEM_GB[0].CODE_CD;
		}
		// 유형
		if ($scope.ds_code.MEM_TY.length === 1) {
			$scope.ds_mst.MEM_TY = $scope.ds_code.MEM_TY[0].CODE_CD;
		}
	}

	// 사용자아이디 검증
	$scope.lfn_validate_userId = () => {
		let userId = $scope.ds_mst.USER_ID || '';

		if (userId !== '') {
			if (userId.length < 6) {
				alert('아이디는 6자 이상입니다');
				return false;
			}
			let pattern =  /^[a-zA-Z0-9@._]+$/g;
			if (pattern.test(userId.toLowerCase()) === false) {
				console.log(userId, pattern.test(userId.toLowerCase()), pattern.test(userId.toLowerCase()))
				alert('아이디는 영문자 숫자 @ . _ 만 가능합니다.');
				return false;
			}

			$scope.ds_mst.USER_ID = userId.toLowerCase();
			return true;
		}
	}

	// 비밀번호 입력값 확인
	$scope.lfn_equal_password = (pwd1, pwd2) => {
		pwd1 = pwd1 || '';
		pwd2 = pwd2 || '';
		if (pwd1 !== '' && pwd1 !== pwd2) {
			alert('입력된 비밀번호가 다릅니다.');
			return false;
		}
		return true;
	}

	$scope.lfn_validate_password = (pwd) => {
		pwd = pwd || '';

		if (pwd !== '') {
			if (pwd.length < 6) {
				alert('비밀번호는 6자 이상입니다');
				return false;
			}
			let letter = /[a-zA-z]/.test(pwd);
			let digit = /[0-9]/.test(pwd);
			let special = /[`!@#$%^&*?~]/.test(pwd);
			if (!letter) {
				alert('영문자가 1자이상 포함되어야 합니다.');
				return false;
			}
			if (!digit) {
				alert('숫자 1자이상 포함되어야 합니다.');
				return false;
			}
			if (!special) {
				alert('특수문자가 1자이상 포함되어야 합니다.');
				return false;
			}

			return true;
		}
	}




	///////////////////////////////////////////////////////////////////////////////////////////////
	// //Utility
	///////////////////////////////////////////////////////////////////////////////////////////////

});// control end
