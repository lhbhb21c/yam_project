<%@page import="yam.cmmn.YamConst"%>
<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE HTML>
<html>
<%--
	파일명	: Dashboard.jsp
	설명	: 대시보드
	수정일		 	수정자		수정내용
    2021.11.05	이경수		최초작성
--%> 

<head>
    <title>대시보드</title>

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
    <script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/main/Dashboard.js?ver=<%=YamConst.VER_PJT_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->

    
    <style>
		/* Tooltip */
		*[tooltip] > u{
		    visibility: hidden;
		    opacity: 0;
		    font-size: 12px;
		    padding: 0 5px;
		    background: #f6e6c2;
		    border: 1px solid #000;
		    color: #000;
		    z-index: 1000;
		    white-space: nowrap;
		    text-decoration: none;
		    position: absolute;
		    bottom: -2em;
		    left: 0;
		    transition: opacity 0.5s linear 0.5s, visibility 0s;
		}
		*[tooltip]:hover>u{
		    visibility: visible;
		    opacity: 1;
		}
    </style>
    
</head>

<body id="in_frame">
	
	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl"  data-ng-init="load({})">

		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">
	 		 
			<!-- 현황 -->
			<div class="col-xs-12">				
				<div class="col-sm-6 form-group">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>생산현황</h5>
						<div class="btn-group pull-right">
							<button ng-click="lfn_btn_onClick('pwpGrid.REFRESH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-refresh" aria-hidden="true" style="padding-right:0"></i></button>
						</div>
					</div>
					<div class="ibox-content">
				        <div ui-grid="pwpGrid" style="height: 40vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
					</div>
				</div>	
				<div class="col-sm-6 form-group">			
					<!-- 주문집계현황 -->						
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i>주문집계현황</h5>
						<div class="btn-group pull-right">
							<button ng-click="lfn_btn_onClick('trGrid.REFRESH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-refresh" aria-hidden="true" style="padding-right:0"></i></button>
						</div>
					</div>
					<div class="ibox-content">
				        <div ui-grid="trGrid" style="height: 40vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
					</div>	
				</div>
			</div>							
			<!-- //현황 -->
			
			<!-- 공지사항 -->
			<div class="ibox">
				<div class="ibox-title">
					<h5><i class="fa fa-list-alt"></i>공지사항</h5>
					<div class="btn-group pull-right">
						<button ng-click="lfn_btn_onClick('bbsGrid.REFRESH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-refresh" aria-hidden="true" style="padding-right:0"></i></button>
					</div>
				</div>
				<div class="ibox-content">
			        <div ui-grid="bbsGrid" style="height: 43vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
					</div>
				</div>
			</div>
			<!-- //공지사항 -->

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