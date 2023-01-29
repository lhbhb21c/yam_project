<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<%--
	파일명	: CO_MNG.jsp
	설명	: 회사코드관리
		
	수정일 		수정자		수정내용
	2022.03.28	염국선		최초작성
--%> 

<!DOCTYPE HTML>
<html>

<head>
    <title>회사코드관리</title>

	<!-- ====================================================================================================================================================== -->
	<!-- 세션체크 -->
	<jsp:include page="/WEB-INF/jsp/inc_session_admchk.jsp" />
	<!-- ====================================================================================================================================================== -->
	
	<!-- ====================================================================================================================================================== -->
	<!-- 공통헤더 -->
	<jsp:include page="/WEB-INF/jsp/inc_head.jsp" />
	<!-- ====================================================================================================================================================== -->
	
	<!-- ====================================================================================================================================================== -->
	<!-- 페이지별 SCRIPT, CSS -->
	<script type="text/javascript" src="/WEBSERVER/we_std/js/base/CO_MNG.js?ver=20220328" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
    
</head>

<body id="in_frame" class="scroll">

	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl" ng-init="load();" style="height:100%; background-color:white;">
		
		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">
		
			<!-- top버튼 영역 -->
			<div class="row">
				<div class="col-lg-12 btn-box">
					<div class="btn-group pull-right">
						<p>
							<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i>조회</button>
							<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i>저장</button>
							<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="lfn_btn_disabled('CLOSE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i>닫기</button>
						</p>
					</div>
				</div>
			</div>
			<!-- //top버튼 영역 -->
			

			<!-- 그래드 영역 -->
			<div class="row">
				<div class="ibox">
				
		    		<div class="ibox-title">
		        		<h5><i class="fa fa-list-alt"></i>회사코드 목록</h5>
						<div class="btn-group pull-right">
							<p>
								<button ng-click="lfn_btn_onClick('mst.ADD')"	ng-disabled="lfn_btn_disabled('mst.ADD')"	class="btn btn-warning btn-tbb" type="button">행추가</button>
							</p>
						</div>
		        	</div>
		        	
		        	<div class="ibox-content">
		        		<div ui-grid="mstGrid" style="height:85vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
		        	</div>
		        	
				</div>
			</div>
			<!-- //그래드 영역 -->
			

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
