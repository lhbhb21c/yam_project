<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: PWP_CHG.jsp
	설명		:
	수정일		 	수정자		수정내용
    2022.02.10		zno
--%>

<head>
	<title>작업실적완료</title>

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
	<script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/yam.js?ver=<%=YamConst.VER_PJT_JS %>" charset="utf-8"></script>
	<script type="text/javascript" src="/WEBSERVER/yam/js/pc/PWP_CHG.js?ver=<%=YamConst.VER_PC_JS %>" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->

</head>

<body id="in_frame" class="scroll">

<!-- application, controller 영역 -->
<div ng-app="mstApp" ng-controller="mstCtl" class="gray-bg" ng-init="load();">

	<!-- block-ui 영역 -->
	<div block-ui="main" class="block-ui-main">

		<!-- 버튼/조회 영역 -->
		<div class="row">
			<div class="col-xs-12">
				<div class="ibox">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>조회 조건</h5>
						<div class="ibox-tools">
							<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	ng-show="lfn_btn_show('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
							<button ng-click="lfn_btn_onClick('CONFIRM')"	ng-disabled="lfn_btn_disabled('CONFIRM')"	ng-show="lfn_btn_show('CONFIRM')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-envelope-o"></i> 저장</button>
							<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
						</div>
					</div>

					<div class="ibox-content row" style="overflow:visible;">

						<div class="col-sm-12 form-group">

							<label class="col-sm-1 control-label">생산지시일자</label>
							<div class="col-sm-1">
								<div class="input-group">
									<div moment-picker="ds_cond.PWP_DY" style="display:inherit" class="ng-isolate-scope" locale="ko" start-view="day" format="YYYY-MM-DD">
										<input 	ng-model="ds_cond.PWP_DY" ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
										<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
									</div>
								</div>
							</div>

							<label class="col-sm-1 control-label">생산집계차수</label>
							<div class="col-sm-1">
								<select ng-model="ds_cond.PROD_TM" ng-change="lfn_input_onChange('ds_cond.PROD_TM')" ng-disabled="lfn_input_disabled('ds_cond.PROD_TM')"	class="form-control">
									<option ng-repeat="x in ds_code.PROD_TM_F" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
								</select>
							</div>

						</div>

					</div>

				</div>
			</div>
		</div>
		<!-- //버튼/조회 영역 -->

		<!-- 마스터 그리드 영역  -->
		<div class="row">
			<div class="col-lg-12">
				<div class="ibox"  style="margin-bottom:0;">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>투입품목</h5>
						<div class="btn-group pull-right"></div>
					</div>
					<div class="ibox-content">
						<div ui-grid="mstGrid" style="height: 38vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- //마스터 그리드 영역  -->

		<!-- 상세 그리드 영역  -->
		<div class="row">
			<div class="col-lg-12">
				<div class="ibox"  style="margin-bottom:0;">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>생산목록</h5>
						<div class="btn-group pull-right"></div>
					</div>

					<!--상세그리드-->
					<div class="ibox-content">
						<div ui-grid="subGrid" style="height: 35vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
					</div>
					<!--//상세그리드-->
				</div>
			</div>
		</div>
		<!-- //상세 그리드 영역  -->

	</div>
	<!-- //block-ui 영역 -->

</div>
<!-- //application, controller 영역 -->
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>
