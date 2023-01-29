<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<%--
	파일명	: BBS_MNG.jsp
	설명	: 게시판관리
		
	수정일 		수정자		수정내용
	2022.03.18	염국선		최초작성
--%> 

<!DOCTYPE HTML>
<html>
<head>
    <title>게시판관리</title>

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
	<script type="text/javascript" src="/WEBSERVER/we_std/js/base/BBS_MNG.js?ver=<%=StdConst.VER_STD_BASE_JS %>" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
	
 	<style>
		/* 콤보필터적용시 */
		.ui-grid-filter-select {
			color:black;
		}
	</style> 
	
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
							<div class="ibox-tools">
								<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	ng-show="lfn_btn_show('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
								<button ng-click="lfn_btn_onClick('NEW')"		ng-disabled="lfn_btn_disabled('NEW')"		ng-show="lfn_btn_show('NEW')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-o"></i> 신규</button>
								<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"		ng-show="lfn_btn_show('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 저장</button>
								<button ng-click="lfn_btn_onClick('DEL')"		ng-disabled="lfn_btn_disabled('DEL')"		ng-show="lfn_btn_show('DEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-trash"></i> 삭제</button>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>

					</div>
				</div>
			</div>
			<!-- //버튼/조회 영역 -->
			
       		<!-- 마스터 그리드 영역  -->
        	<div class="row row-full-height">

				<div class="ibox"  style="margin-bottom:0;">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>게시판목록</h5>
						<div class="btn-group pull-right"></div>
					</div>
					<div class="ibox-content">
						<div ui-grid="mstGrid" style="height: 85vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
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
</html>
