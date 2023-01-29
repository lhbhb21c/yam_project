<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="com.google.gson.Gson"%>
<%@page import="we.std.core.StdUtils"%>
<%@page import="we.cmmn.utils.WeUtils"%>
<%@page import="java.util.Properties"%>
<%@page import="we.std.core.StdConst"%>
<%@page import="yam.cmmn.YamConst"%>
<%
	String SYSTEM_NM	= "YAM_MES";
	String USER_NM		= (String) StdUtils.getSessionUserInfo().get("USER_NM");
	String MEM_ROLE_NM	= (String) StdUtils.getSessionUserInfo().get("MEM_ROLE_NM");
%>

<!DOCTYPE html>
<html>
<head>
    <title>얌테이블-MES</title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name=”format-detection” content=”telephone=no”/>				   <!-- EDGE : 숫자형에 자동으로 붙는 링크 제거 -->


    <!-- ====================================================================================================================================================== -->
    <!-- Bootstrap(inspinia v2.7.1) -->
    
    <!-- Favicon -->
    <link rel="shortcut icon" href="/WEBSERVER/we_std/images/mes_favicon.ico">
    <link rel="icon" href="/WEBSERVER/we_std/images/mes_favicon.ico">

    <!-- CSS -->
    <link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/font-awesome/css/font-awesome.css" rel="stylesheet">

    <link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/animate.css" rel="stylesheet">
    <link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/style.css" rel="stylesheet">
    
	<!-- Mainly scripts -->
	<script src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/jquery-3.1.1.min.js"></script>
	<script src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/bootstrap.min.js"></script>
	<script src="/WEBSERVER/wevefw_bt/metismenu/v2.7.0/metisMenu.js">/*inspinia 에 있는 버전은 다이나믹 안됨, 최신으로 변경함*/</script>
	<script src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/slimscroll/jquery.slimscroll.min.js">/*div에 스크롤 생성*/</script>
	
	<!-- Custom and plugin javascript -->
	<script src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/inspinia.js"></script>
	<script src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/pace/pace.min.js">/*프로그레스*/</script>
    <!-- ====================================================================================================================================================== -->

	<!-- 암복호화(RSA)-->
    <script type="text/javascript" src="/WEBSERVER/we_std/js/lib/enc/jsencrypt.min.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->

    <!-- ====================================================================================================================================================== -->
    <!-- 페이지 -->
    <link href="/WEBSERVER/we_std/css/Main_v17_std_bt.css" rel="stylesheet">
	<script type="text/javascript" src="/WEBSERVER/we_cmmn/js/we.cmmn.utils.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>
	<script type="text/javascript" src="/WEBSERVER/we_cmmn/js/we.cmmn.mdi.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>
	<script type="text/javascript" src="/WEBSERVER/we_cmmn/js/we.cmmn.relogin.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/main/Main.js?ver=<%=YamConst.VER_PJT_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->
    
    
    <!-- 환경정보 설정  -->
    <script type="text/javascript">
<%
	Properties props = (Properties) WeUtils.getBean("props");
	String publicKey = props.getProperty("cipher.asymmetirc.privatekey");
%>
		//환경정보 - localhost 나 파라메터 deubg=true 일 경우 모든 로그보이게 설정 
		window.ENV = {
			JS_DEBUG_MODE	: window.location.href.indexOf("//localhost") !== -1 || window.location.href.indexOf("debug=true") !== -1,
			JS_CONTEXT_MENU	: window.location.href.indexOf("//localhost") !== -1 || window.location.href.indexOf("debug=true") !== -1,
			PUBLIC_KEY		: "<%=publicKey %>"
		};

		//공통 Utilitiy
		const XUTL = new CmmnUtil({name:"XUTL", debug:ENV.JS_DEBUG_MODE});
		//MDI
    	window.MDI = new MdiUtil({name:"MDI", URL_DASHBOARD:"forward/yam/cmmn/main/Dashboard.do", URL_VALIDATION:"/std/cmmn/validSession.do", debug:ENV.JS_DEBUG_MODE});   	
		//relogin modal
    	window.RELOGIN = new ReloginModal({name:"RELOGIN", allowedRetry:3, PUBLIC_KEY:ENV.PUBLIC_KEY, debug:ENV.JS_DEBUG_MODE});


		//디버깅모드가 아니면 contextmenu 않되게
		if (!ENV.JS_CONTEXT_MENU) {
			document.addEventListener("contextmenu", (e) => {
				return event.preventDefault();
			});			
		}
	</script>

<% if (StdUtils.getSimpleSessionUserInfo() != null) {%>
	<!-- 사용자세션정보 설정  -->
    <script type="text/javascript">
		window.SS_USER_INFO = <%=new Gson().toJson(StdUtils.getSimpleSessionUserInfo()) %>
		SS_USER_INFO.svrDt = '<%=new SimpleDateFormat("yyyyMMdd").format(new Date())%>'
    </script>
<%}%>

</head>
<!--   왼쪽 메뉴에 스크롤 달려고 body 에 적용함 -->
<body  class="fixed-sidebar no-skin-config full-height-layout" oncontextmenu="return ENV.JS_CONTEXT_MENU;"> 
	<div id="wrapper">
	
	    <!-- 메뉴판: 왼쪽 --> 
	    <!-- Collapse menu Fixed sidebar Scroll navbar Top fixed navbar Boxed layout Scroll footer Fixed footer -->
		<nav class="navbar-default navbar-static-side" role="navigation">
			<div class="sidebar-collapse sidebar-ie-fix" style="overflow: hidden; width: auto; height: 100%;">
				<div class="sidebar-collapse">
					<ul id="side-menu" class="nav metismenu">
						<li class="nav-header">
							<div class="dropdown profile-element">
								<a data-toggle="dropdown" class="dropdown-toggle" href="#">
									<span class="clear">
										<span class="block m-t-xs">
											<strong class="font-bold"><%=USER_NM%></strong>
										</span>
									<span class="text-muted text-xs block"><%=MEM_ROLE_NM%> <b class="caret"></b></span>
									</span>
								</a>

								<ul class="dropdown-menu animated fadeInRight m-t-xs">
									<li>
										<a href="#" class="mdi_logout">Logout</a>
									</li>
								</ul>
							</div>
							<div class="logo-element">IN+</div>
						</li>
						<!-- 동적으로 메뉴 추가될 위치 -->
					</ul><!-- metismenu -->

					<div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto; height: 100%;"></div>

				</div>
			</div>
		</nav>
	
		<!-- 페이지판 -->
		<div id="page-wrapper" class="gray-bg">
		
			<!-- 상단막대기 -->
			<div class="row border-bottom">
				<nav class="navbar navbar-static-top white-bg" role="navigation" style="margin-bottom: 0">

					<div class="navbar-header">
						<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
					</div>

					<ul class="nav navbar-top-links navbar-left">
						<li>
							<a href="#" class="mdi_dashboard">
								<img src="/WEBSERVER/we_std/images/yam_logo.png" alt="" id="LOGO" style="height:25px;margin-top:6px;">
								<span style="font-weight:bold;color:silver;"><%=SYSTEM_NM%></span>
							</a>
						</li>
					</ul>

					<ul class="nav navbar-top-links navbar-right">
						<li>
							<a href="#" class="btn_logout mdi_logout">
								<i class="fa fa-sign-out"></i>
								Log out.
							</a>
						</li>
					</ul>

				</nav>
			</div>
			
			<!-- 중단 iframe 판 wrapper wrapper-content animated fadeInRight -->
			<div class="wrapper wrapper-content">
				<div class="tabs-container" id="div_tabList">
					
					<!-- ====================================================================================================================================================== -->
					<!-- 상단 탭 -->
					<ul class="nav nav-tabs">
						<!-- 동적으로 탭 추가될 위치 -->
						<li id="li_closeTabAll" style="float: right;">
							<img class="mdi_closeTabAll" style="width: 18px; cursor: pointer;" src="/WEBSERVER/weve/images/common/close_all.png">
						</li>
					</ul>
					
					<!-- ====================================================================================================================================================== -->
					<!-- 탭 내용 -->
					<div id="div_iframe_box"></div>
					
				</div>
			</div>
			<!-- wrapper wrapper-content -->
			
			
			<!-- 하단막대기 -->
			<div class="footer">
				<div>
					<strong>얌테이블-MES</strong>
				</div>
				<div class="pull-right"></div>
			</div>
			
		</div><!-- page-wrapper -->
		
	</div><!-- wrapper -->


	<!-- 재로그인모달영력 --> 
	<div id="reloginModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-fullsize" role="document" style="width:500px;">
			<div class="modal-content modal-fullsize" >
				<div class="modal-body">

					<div class="row">
						<div class="col-sm-12 form-group">
						</div>
						<div class="col-sm-12 form-group">
							<div class="col-sm-7">
								<input id="RELOGIN_USER_PWD"  placeholder="비밀번호" class="form-control" type="password"/>
							</div>
							<div class="col-sm-5">
								<div class="btn-group pull-right">
									<button id="RELOGIN_SUBMIT" class="btn btn-warning btn-tbb" type="button">로그인</button>
									<button id="RELOGIN_CLOSE" class="btn btn-warning btn-tbb" type="button">닫기</button>
								</div>
							</div>
						</div>
					</div>
     					
     			</div> 
  			</div> 
		</div> 
	</div>			
	<!-- //재로그인 모달영력 --> 		


</body>`
</html>
