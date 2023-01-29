<%@page import="yam.cmmn.YamConst"%>
<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: PARTNR_POP.jsp
	설명	: 거래처 선택 팝업
	수정일		 	수정자		수정내용
    2021.10.20	정래훈		최초작성
--%> 
<head>
    <title>거래처 선택</title>

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
	<script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/popup/PARTNR_POP.js?ver=<%=YamConst.VER_POPUP_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->

</head>

<body id="in_frame" class="scroll" style="overflow:hidden;">

	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl" class="gray-bg" ng-init="load({});">
		
		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">

			<!-- 버튼 영역 -->
			<div class="row">
				<div class="col-lg-12 btn-box">
					<div class="btn-group pull-right">
						<p>
							<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	class="btn btn-warning btn-sm" type="button"><i class="fa fa-search"></i> 조회</button>
							<button ng-click="lfn_btn_onClick('SEL')"		ng-disabled="lfn_btn_disabled('SEL')"		class="btn btn-warning btn-sm" type="button"><i class="fa fa-plus"></i> 선택</button>
							<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							class="btn btn-warning btn-sm" type="button"><i class="fa fa-window-close"></i> 닫기</button>
						</p>
					</div>
				</div>
			</div>
			<!-- //버튼 영역 -->
			
			
			<!-- 조회 영역 -->
			<div class="row">
				<div class="col-xs-12">
					<div class="ibox">
						<div class="ibox-content i-box-search">
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label">거래처코드/명</label>
								<div class="col-sm-3">
									<input ng-model="ds_cond.PARTNR_CD" ng-enter="lfn_btn_onClick('SEARCH')" kr-input class="form-control" type="text">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //조회 영역 -->
			
			
			<!-- 마스터 그리드 영역 -->
			<div class="row">
				<div class="col-xs-12">
					<div class="ibox">
						<div class="ibox-content" style="border-top:0;">
							<div ui-grid="mstGrid" style="height:80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //마스터 그리드 영역  -->

		</div>
		<!-- //block-ui 영역 -->
		
	</div>
	<!-- //application, controller 영역 -->
	
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>
