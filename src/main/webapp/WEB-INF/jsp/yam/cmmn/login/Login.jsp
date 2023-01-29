<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: Login.jsp
	설명	: Login
	수정일		 	수정자		수정내용
    2021.10.23	이경수		최초작성
--%> 

<head>
    <title>얌테이블</title>
	<!-- Favicon -->
	<link rel="shortcut icon" href="/WEBSERVER/we_std/images/mes_favicon.ico">
	<link rel="icon" href="/WEBSERVER/we_std/images/mes_favicon.ico">
	
	<!-- ====================================================================================================================================================== -->
	<!-- 공통헤더 -->
	<jsp:include page="/WEB-INF/jsp/inc_head.jsp" />
	<!-- ====================================================================================================================================================== -->
	
    <!-- ====================================================================================================================================================== -->
    <!-- 페이지별 SCRIPT, CSS -->
    <script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/yam.js?ver=<%=YamConst.VER_PJT_JS %>" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/login/Login.js?ver=<%=YamConst.VER_MM_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->

	<link href="/WEBSERVER/yam/css/login/style.css" rel="stylesheet">
	<link href="/WEBSERVER/yam/css/login/mobile.css" rel="stylesheet">

</head>

<body class="white-bg">

	<!-- application.controller 영역 -->
	<div id="wrap" ng-app="mstApp" ng-controller="mstCtl" ng-init="load({});">

		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">
		
			<div class="container">
				<div class="content main">
					<div class="side_bg"></div>
					<div class="side_cont">
						<div class="inner">
							<h1>얌테이블 MES</h1>
							<div class="form_login">
								<form role="form">
									<div class="text">
										<label for="id">ID</label>
										<input ng-model="ds_mst.USER_ID" ng-enter="lfn_input_onEnter('ds_mst.USER_ID')"	id="id" placeholder="User ID" type="text"/>
									</div>
									<div class="text">
										<label for="password">PASSWORD</label>
										<input ng-model="ds_mst.USER_PWD" ng-enter="lfn_input_onEnter('ds_mst.USER_PWD')"	id="password"  placeholder="비밀번호" type="Password"/>
									</div>
								</form>
								<div class="btn_wrap">
									<button ng-click="lfn_btn_onClick('LOGIN')"		ng-disabled="lfn_btn_disabled('LOGIN')"		ng-show="lfn_btn_show('LOGIN')" class="login" type="button">로그인</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div id="footer">
					<p>Copyright©2021 얌테이블 All rights reserved.</p>
					<p>
						<span>※ 허가받지않은 무단 접속이나 시도는 고발조치됩니다.</span>
						<span>/ 본 시스템은 Microsoft Edge 및 Chrome 브라우저 최신버전에 최적화 되어 있습니다.</span>
						<span>/ 본 시스템은(1920*1080)해상도에 최적화 되어 있습니다.</span>
					</p>
				</div>
			</div>
		
		</div>
		<!-- //block-ui 영역 -->
		
	</div>
	<!-- //application.controller 영역 -->

</body>
</html>
