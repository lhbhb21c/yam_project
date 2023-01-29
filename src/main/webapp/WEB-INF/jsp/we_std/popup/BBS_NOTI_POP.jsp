<%@page import="we.std.core.StdConst"%>
<%@page import="we.std.core.StdUtils"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="com.google.gson.Gson"%>
<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<%--
	파일명	: BBS_NOTI_POP.jsp
	설명	: 게시판 공지내용
		
	수정일			수정자		수정내용
	2021.12.08	염국선		최초작성
--%> 

<!DOCTYPE HTML>
<html>
<head>
    <title>공지</title>
	
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
    <script type="text/javascript" src="/WEBSERVER/we_std/js/popup/BBS_NOTI_POP.js" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->
    
</head>

<body id="in_frame" style="overflow-x:hidden; overflow-y:auto;">

	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl" class="gray-bg" ng-init="load({});">
		
		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">
		
			<!-- 버튼 영역 -->
			<div class="row">
				<div class="col-lg-12 btn-box">
					<div class="btn-group pull-right">
						<p>
							<button type="button" class="btn btn-warning btn-tbb" ng-click="lfn_btn_onClick('CLOSE')"><i class="fa fa-close"></i> 닫기</button>
						</p>
					</div>
				</div>
			</div>
			<!-- //버튼 영역 -->

			<!-- 데이터 영역 -->
			<div class="row">

				<!-- 마스터 영역 -->
				<div class="ibox float-e-margins">
					<div class="ibox-content form-wsearch">
						<div class="col-sm-12 form-group">
							<label class="control-label" style="text-align: left">{{ds_mst.SUBJCT}}</label>
						</div>
						<div class="col-sm-12 form-group">
							<pre style="height: 55vh;">{{ds_mst.CN}}</pre>
						</div>
					</div>
				</div>
				<!-- //마스터 영역 -->
				
				<!-- 첨부 영역 -->
				<div class="ibox float-e-margins">
					<div class="ibox-title">
						<h5><i class="fa fa-list-alt"></i> 첨부파일</h5>
						<div class="ibox-tools">
							<a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
						</div>
					</div>
					<div class="ibox-content">
						<div attach-list="ds_at" attachTemplate="view" style="min-height:30px; max-height:100px; border:1px solid silver; padding:10px; line-height:120%; overflow-y:auto"></div>
					</div>
				</div>
				<!-- //첨부 영역 -->
				
			</div>
			<!-- //데이터 영역 -->

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