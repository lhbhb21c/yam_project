<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<%--
	파일명	: USER_MNG.jsp
	설명	: 사용자관리

	수정일 		수정자		수정내용
	2022.02.23	이진호		최초작성
--%>

<!DOCTYPE HTML>
<html>
<head>
	<title>사용자관리</title>

	<!-- ====================================================================================================================================================== -->
	<!-- 세션체크 -->
	<jsp:include page="/WEB-INF/jsp/inc_session_check.jsp" />
	<!-- ====================================================================================================================================================== -->

	<!-- ====================================================================================================================================================== -->
	<!-- 공통헤더 -->
	<jsp:include page="/WEB-INF/jsp/inc_head.jsp" />
	<!-- ====================================================================================================================================================== -->

	<!-- ====================================================================================================================================================== -->
	<!-- 페이지별 SCRIPT, CSS -->
	<script type="text/javascript" src="/WEBSERVER/we_std/js/base/USER_MNG.js?ver=<%=StdConst.VER_STD_BASE_JS %>" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->

</head>

<body id="in_frame" class="scroll">

<!-- application, controller 영역 -->
<div ng-app="mstApp" ng-controller="mstCtl" class="gray-bg" ng-init="load();">

	<!-- block-ui 영역 -->
	<div block-ui="main" class="block-ui-main">

		<!-- 버튼/조회 영역 -->
		<div class="row">
				<div class="ibox">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>조회조건</h5>
						<div class="ibox-tools">
							<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	ng-show="lfn_btn_show('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
							<button ng-click="lfn_btn_onClick('NEW')"		ng-disabled="lfn_btn_disabled('NEW')"		ng-show="lfn_btn_show('NEW')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-o" aria-hidden="true"></i> 신규</button>
							<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"		ng-show="lfn_btn_show('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 저장</button>
							<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
						</div>
					</div>

					<div id="ds_cond" class="ibox-content">
						<div class="row">

							<div class="col-sm-12 form-group">
								<label class="col-sm-1 control-label">사용자명</label>
								<div class="col-sm-1">
									<input ng-model="ds_cond.USER_NM" class="form-control text-center" type="text" />
								</div>

								<label class="col-sm-1 control-label">구분</label>
								<div class="col-sm-1">
									<select ng-model="ds_cond.MEM_GB" ng-change="lfn_input_onChange('ds_cond.MEM_GB')" ng-disabled="lfn_input_disabled('ds_cond.MEM_GB')"
											validName="사용자구분"  class="form-control">
										<option value="">전체</option>
										<option ng-repeat="x in ds_code.MEM_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
									</select>
								</div>

								<label class="col-sm-1 control-label">사용여부</label>
								<div class="col-sm-1">
									<select ng-model="ds_cond.USE_YN" ng-change="lfn_input_onChange('ds_cond.USE_YN')" ng-disabled="lfn_input_disabled('ds_cond.USE_YN')"
											validName="사용자여부"  class="form-control">
										<option value="">전체</option>
										<option ng-repeat="x in ds_code.USE_YN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
									</select>
								</div>
							</div>

						</div>
					</div>

				</div>
			</div>
		</div>
		<!-- //버튼/조회 영역 -->


		<!-- 그리드 영역  -->
		<div class="row">
			<div class="col-xs-7">
				<div class="ibox">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>사용자목록</h5>
					</div>
					<div class="ibox-content">
						<div ui-grid="mstGrid" style="height:72vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xs-5">
				<div class="ibox">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>기본사항</h5>
					</div>
					<div id="ds_mst" class="ibox-content" style="height: 50vh;">
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label" label-mask>소속</label>
							<div class="col-sm-3">
								<select ng-model="ds_mst.SECTR_ID" ng-change="lfn_input_onChange('ds_mst.SECTR_ID')" ng-disabled="lfn_input_disabled('ds_mst.SECTR_ID')"
										validTypes="required" 	validName="소속"  class="form-control">
									<option ng-repeat="x in ds_code.SECTR_ID" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
								</select>
							</div>
						</div>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label text-right" label-mask> 사용자ID</label>
							<div class="col-sm-5">
								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="text"
									   ng-model="ds_mst.USER_ID" 	validTypes="required"	validName="사용자ID"		maxlength="20"
									   ng-disabled="lfn_input_disabled('ds_mst.USER_ID')"/>
							</div>
							<div class="col-sm-2">
								<button ng-click="lfn_btn_onClick('DUP_CHECK')"
										ng-disabled="lfn_btn_disabled('DUP_CHECK')"
										ng-show="lfn_btn_show('DUP_CHECK')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 중복체크</button>
							</div>
						</div>
						<div class="col-sm-12 form-group" ng-if="lfn_input_show('ds_mst.USER_PWD')">
							<label class="col-sm-2 control-label text-right" label-mask> 비밀번호</label>
							<div class="col-sm-5">
								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="password"
									   validTypes="required"	validName="비밀번호" 	autocomplete="new-password"
									   ng-model="ds_mst.USER_PWD"
<%--									   ng-change="lfn_input_onChange('ds_mst.USER_PWD')"--%>
									   ng-blur="lfn_input_blur('ds_mst.USER_PWD')"
									   ng-disabled="lfn_input_disabled('ds_mst.USER_PWD')"/>
							</div>
						</div>
						<div class="col-sm-12 form-group" ng-if="lfn_input_show('ds_mst.USER_PWD2')">
							<label class="col-sm-2 control-label text-right" label-mask> 비밀번호 확인</label>
							<div class="col-sm-5">
								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="password"
									   validTypes="required"	validName="비밀번호 확인"		 autocomplete="new-password"
									   ng-model="ds_mst.USER_PWD2"
									   ng-blur="lfn_input_blur('ds_mst.USER_PWD2')"
									   ng-disabled="lfn_input_disabled('ds_mst.USER_PWD2')"/>
							</div>
						</div>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label text-right" label-mask> 사용자명</label>
							<div class="col-sm-5">
								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="text" kr-input ng-model="ds_mst.USER_NM"
									   validTypes="required"	validName="사용자명"
									   ng-disabled="lfn_input_disabled('ds_mst.USER_NM')">
							</div>
						</div>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label" label-mask>구분</label>
							<div class="col-sm-3">
								<select ng-model="ds_mst.MEM_GB" ng-change="lfn_input_onChange('ds_ms.MEM_GB')" ng-disabled="lfn_input_disabled('ds_mst.MEM_GB')"
										validTypes="required" 	validName="사용자구분"  class="form-control">
									<option ng-repeat="x in ds_code.MEM_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
								</select>
							</div>
						</div>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label" label-mask>유형</label>
							<div class="col-sm-3">
								<select ng-model="ds_mst.MEM_TY" ng-change="lfn_input_onChange('ds_mst.MEM_TY')" ng-disabled="lfn_input_disabled('ds_mst.MEM_TY')"
										validTypes="required" 	validName="사용자구분"  class="form-control">
									<option ng-repeat="x in ds_code.MEM_TY" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
								</select>
							</div>
						</div>
						<div class="col-sm-12 form-group" ng-show="ds_mst.MEM_TY === '20'">
							<label class="col-sm-2 control-label text-right"> 파트너</label>
							<div class="col-sm-5">
								<div class="input-group">
									<input ng-model="ds_mst.PARTNR_NM" readonly class="form-control" type="text"/>
									<div class="input-group-btn">
										<button ng-click="lfn_btn_onClick('ds_mst.PARTNR_ID')" class="btn btn-primary m-n" ><i class="fa fa-search"></i></button>
									</div>
								</div>
							</div>
						</div>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label" label-mask>메뉴</label>
							<div class="col-sm-3">
								<select ng-model="ds_mst.ROOT_MENU_ID" ng-change="lfn_input_onChange('ds_mst.ROOT_MENU_ID')" ng-disabled="lfn_input_disabled('ds_mst.ROOT_MENU_ID')"
										validTypes="required" 	validName="기본메뉴"  class="form-control">
									<option ng-repeat="x in ds_code.ROOT_MENU_ID" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
								</select>
							</div>
						</div>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label text-right" label-mask> 권한</label>
							<div class="col-sm-9">
								<div class="checkbox checkbox-inline" ng-repeat="x in ds_code.MEM_ROLE_CDS">
									<input type="checkbox" ng-change="lfn_input_onChange('ds_mst.MEM_ROLE_CDS')"  ng-disabled="lfn_input_disabled('ds_mst.MEM_ROLE_CDS',  x.CODE_CD)"
										   checklist-model="ds_mst.MEM_ROLE_CDS" checklist-value="x.CODE_CD" id="{{x.CODE_NM}}" />
									<label for="{{x.CODE_NM}}" style="margin-right:10px;">{{x.CODE_NM}}</label>
								</div>
							</div>
						</div>
<%--						<div class="col-sm-12 form-group">--%>
<%--							<label class="col-sm-2 control-label text-right"> 추가정보2</label>--%>
<%--							<div class="col-sm-5">--%>
<%--								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="text" kr-input ng-model="ds_mst.MEM_REF2"--%>
<%--									   ng-disabled="lfn_input_disabled('ds_mst.MEM_REF2')">--%>
<%--							</div>--%>
<%--						</div>--%>
<%--						<div class="col-sm-12 form-group">--%>
<%--							<label class="col-sm-2 control-label text-right"> 추가정보3</label>--%>
<%--							<div class="col-sm-5">--%>
<%--								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="text" kr-input ng-model="ds_mst.MEM_REF3"--%>
<%--									   ng-disabled="lfn_input_disabled('ds_mst.MEM_REF3')">--%>
<%--							</div>--%>
<%--						</div>--%>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label">사용여부</label>
							<div class="col-sm-3">
								<div class="input-group">
									<div class="radio radio-inline">
										<input id="use_yn_y" type="radio" value="Y" class="ng-pristine ng-untouched ng-valid ng-not-empty" ng-model="ds_mst.USE_YN" ng-change="lfn_input_onChange('ds_mst.USE_YN')">
										<label for="use_yn_y">사용</label>
									</div>
									<div class="radio radio-inline">
										<input id="use_yn_n" type="radio" value="N" class="ng-pristine ng-untouched ng-valid ng-not-empty" ng-model="ds_mst.USE_YN" ng-change="lfn_input_onChange('ds_mst.USE_YN')">
										<label for="use_yn_n">미사용</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="ibox">
					<div class="ibox-title" ng-if="lfn_input_show('PASSWD_CHANGE')" >
						<h5><i class="fa fa-list-alt"></i>비밀번호 변경 </h5>
						<div class="ibox-tools">
							<button ng-click="lfn_btn_onClick('PASSWORD')"	ng-disabled="lfn_btn_disabled('passwd.SAVE')"	ng-show="lfn_btn_show('passwd.SAVE')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 변경</button>
							<%--								<button ng-click="lfn_btn_onClick('passwd.CLOSE')"	ng-disabled="false"								ng-show="true"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>--%>
						</div>
					</div>
					<div id="ds_pwd" class="ibox-content" ng-if="lfn_input_show('PASSWD_CHANGE')" style="height: 20vh;">
						<!-- 에디터 영역 -->
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label text-right" label-mask> 비밀번호</label>
							<div class="col-sm-5">
								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="password"
									   validTypes="required"	validName="비밀번호" 	autocomplete="new-password"
									   ng-model="ds_passwd.USER_PWD"
								<%--									   ng-change="lfn_input_onChange('ds_mst.USER_PWD')"--%>
									   ng-blur="lfn_input_blur('ds_passwd.USER_PWD')"
									   ng-disabled="lfn_input_disabled('ds_passwd.USER_PWD')"/>
							</div>
						</div>
						<div class="col-sm-12 form-group">
							<label class="col-sm-2 control-label text-right" label-mask> 비밀번호 확인</label>
							<div class="col-sm-5">
								<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="password"
									   validTypes="required"	validName="비밀번호 확인"		 autocomplete="new-password"
									   ng-model="ds_passwd.USER_PWD2"
									   ng-blur="lfn_input_blur('ds_passwd.USER_PWD2')"
									   ng-disabled="lfn_input_disabled('ds_passwd.USER_PWD2')"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	<!-- //block-ui 영역 -->

</div>
<!-- //application, controller 영역 -->
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>
</html>
