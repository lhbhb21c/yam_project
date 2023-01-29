<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="java.util.Properties"%>
<%@page import="we.cmmn.utils.WeUtils"%>
<%@page import="we.std.core.StdConst"%>
<%@page import="we.std.core.StdUtils"%>
<%@page import="com.google.gson.Gson"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>

<%--
	파일명	: inc_head.jsp
	설명	: head include 공통
--%>

	<meta charset="utf-8">
	<!-- 컨텐츠TYPE : UTF-8 -->
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<!-- 호환성을 최신으로 세팅하여 호환성 안뜨게 한다 -->    
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<!-- cache 를 하지 않게 설정 -->
	<meta http-equiv="Cache-Control" content="no-cache">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="Expires" content="0">
	<!-- EDGE : 숫자형에 자동으로 붙는 링크 제거 -->
	<meta name="format-detection" content="telephone=no">

	<!-- ====================================================================================================================================================== -->
	<!-- 제이쿼리 : fullcalendar 에서 제이쿼리 사용 함  -->
	<script src="/WEBSERVER/wevefw/js/jquery/jquery-1.7.1.min.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
	
	<!-- ====================================================================================================================================================== -->
	<!-- 앵귤러 https://code.angularjs.org/1.6.2/ -->
	<script src="/WEBSERVER/wevefw/js/angular/angular.v1.6.2.min.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
	
    <!-- ====================================================================================================================================================== -->
    <!-- 앵귤러 UI-그리드 -->
    <link rel="stylesheet" href="/WEBSERVER/wevefw/js/angular/ui/uigrid/4.0.7/ui-grid_weve_v18.css?ver=20190630"/>
    <script src="/WEBSERVER/we_std/js/lib/ui-grid_weve_v18_we.js?ver=20220221"></script>
    
    <!-- 앵귤러 UI-그리드-Export 엑셀
    <script src="http://ui-grid.info/docs/grunt-scripts/csv.js" charset="utf-8"></script>
    -->
    
    
    <!-- 앵귤러 UI-그리드-Export PDF IE9에서 안됨 , 에러 발생
    <script src="http://ui-grid.info/docs/grunt-scripts/pdfmake.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/vfs_fonts.js"></script>
    -->
    
    <!-- 앵귤러 UI-폼 멀티체크박스 처리 -->
    <script src="/WEBSERVER/wevefw/js/angular/ui/checklist-model/checklist-model.js" charset="utf-8"></script>
    
    
    <!-- 앵귤러 UI-시간(달력, DatePicker) localization -->
    <script src="/WEBSERVER/wevefw/js/angular/ui/datetime/moment-with-locales.v2.10.6.js"></script>
    
    <!-- 앵귤러 UI-달력 -->
    <script src="/WEBSERVER/wevefw/js/angular/ui/calendar/calendar.v1.0.1.js" charset="utf-8"></script>
    <link rel="stylesheet" href="/WEBSERVER/wevefw/js/angular/ui/calendar/fullcalendar.v3.3.1.css"/>
    <script src="/WEBSERVER/wevefw/js/angular/ui/calendar/fullcalendar.v3.3.1.js" charset="utf-8"></script>
    
    <!-- 앵귤러 UI-DatePicker -->
    <link rel="stylesheet" href="/WEBSERVER/wevefw/js/angular/ui/octicons/octicons.min.v3.3.0.css"> <!-- 달력아이콘 -->
    <link rel="stylesheet" href="/WEBSERVER/wevefw/js/angular/ui/datepicker/angular-moment-picker.v0.10.1.css"> <!-- DatePicker 달력모양 -->
    <script src="/WEBSERVER/wevefw/js/angular/ui/datepicker/angular-moment-picker.v0.10.1.js"></script>
    
    <!-- 앵귤러 UI-블럭 -->
    <link rel="stylesheet" href="/WEBSERVER/wevefw/js/angular/ui/block/angular-block-ui.v0.2.1.css"/>
    <script src="/WEBSERVER/wevefw/js/angular/ui/block/angular-block-ui.v0.2.1.js"></script>
    <!-- ====================================================================================================================================================== -->
    
    <!-- ====================================================================================================================================================== -->
    <!-- 앵귤러 파일-업로드 -->
    <script src="/WEBSERVER/wevefw/js/angular/fileupload/ng-upload.min.v0.5.19.js" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->
    
    <!-- ====================================================================================================================================================== -->
    <!-- 앵귤러 HTML-innerHtml 예제: ng-bind-html -->
    <script src="/WEBSERVER/wevefw/js/angular/ui/html/angular-sanitize.min.v1.6.2.js" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->
    
    <!-- ====================================================================================================================================================== -->
    <!-- 보안 RSA -->
<!-- 	<script src="/WEBSERVER/wevefw/js/security/weveRsa.js" charset="utf-8"></script>  -->
	<script src="/WEBSERVER/wevefw/js/security/jsbn.js" charset="utf-8"></script> <!-- BigInteger -->
	<script src="/WEBSERVER/wevefw/js/security/rsa.js" charset="utf-8"></script>
	<script src="/WEBSERVER/wevefw/js/security/prng4.js" charset="utf-8"></script>
	<script src="/WEBSERVER/wevefw/js/security/rng.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
	
	<!-- ====================================================================================================================================================== -->
	<!-- 앵귤러 touch -->
	<script src="/WEBSERVER/wevefw/js/angular/ui/touch/angular-touch.min.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
	
	<!-- ====================================================================================================================================================== -->
	<!-- angularjs translate -->
	<script src="/WEBSERVER/wevefw/js/angular/translate/v2.18.1/angular-translate.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
	
	
	
	
	<!-- ====================================================================================================================================================== -->
	<!-- 부트스트랩 CSS -->
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/bootstrap.min.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/font-awesome/css/font-awesome.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/plugins/iCheck/custom.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/animate.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/style.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/plugins/jasny/jasny-bootstrap.min.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/plugins/datapicker/datepicker3.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/css/plugins/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw/js/angular/ui/select/select.css" rel="stylesheet">
	<link href="/WEBSERVER/wevefw_bt/css/site.css" rel="stylesheet">
	<link href="/WEBSERVER/we_std/css/std_cmmn.css" rel="stylesheet">
	<!-- ====================================================================================================================================================== -->
	
	<!-- ====================================================================================================================================================== -->
	<!-- 부트스트랩 js -->
	<script	src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/jquery-3.1.1.min.js"></script>
	<script src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/bootstrap.min.js"></script>
	<script	src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/metisMenu/jquery.metisMenu.js"></script>
	<script	src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
	<script	src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/datapicker/bootstrap-datepicker.js"></script>
	<script	src="/WEBSERVER/wevefw/js/angular/ui/select/select.js"></script>
	<script	src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/jasny/jasny-bootstrap.min.js"></script>
	
	<!-- Custom and plugin javascript -->
	<script src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/inspinia.js"></script>
	<script	src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/pace/pace.min.js"></script>
	<!-- iCheck -->
	<script	src="/WEBSERVER/wevefw_bt/inspinia/v2.7.1/js/plugins/iCheck/icheck.min.js"></script>
	<!-- ====================================================================================================================================================== -->
	
	<!-- 로컬에서 엑셀처리(style처리를 위해 sheetjs + https://github.com/gitbrent/xlsx-js-style) -->
    <script type="text/javascript" src="/WEBSERVER/we_std/js/lib/xlsx-js-style-0.16.8/xlsx.full.min.js" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/we_std/js/lib/xlsx-js-style-0.16.8/xlsx.bundle.js" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/we_std/js/lib/FileSaver.min.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->

	<!-- 암복호화 -->
	<!-- (RSA) -->
    <script type="text/javascript" src="/WEBSERVER/we_std/js/lib/enc/jsencrypt.min.js" charset="utf-8"></script>
	<!-- (AES 등...) -->
    <script type="text/javascript" src="/WEBSERVER/we_std/js/lib/enc/cryptojs.js" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->

	<!-- standard 공통 라이브러리 -->
    <script type="text/javascript" src="/WEBSERVER/we_cmmn/js/we.cmmn.utils.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/we_cmmn/js/we.cmmn.enc.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/we_cmmn/js/we.cmmn.xml.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/we_cmmn/js/we.cmmn.ng.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>
    <script type="text/javascript" src="/WEBSERVER/we_std/js/we.std.utils.js?ver=<%=StdConst.VER_STD_CMMN_JS %>" charset="utf-8"></script>

    <!-- 환경정보 설정  -->
    <script type="text/javascript">
<%
	Properties props = (Properties) WeUtils.getBean("props");
	String publicKey = props.getProperty("cipher.asymmetirc.privatekey");
%>
		//환경정보 - localhost 나 파라메터 deubg=true 일 경우 모든 로그보이게 설정 
		window.ENV = {
			JS_DEBUG_MODE	: (top.ENV ? top.ENV.JS_DEBUG_MODE : false) || (window.location.href.indexOf("//localhost") !== -1 || window.location.href.indexOf("debug=true") !== -1),
			JS_CONTEXT_MENU	: window.location.href.indexOf("//localhost") !== -1 || window.location.href.indexOf("debug=true") !== -1,
			PUBLIC_KEY		: "<%=publicKey %>"
		};

		//공용 Utilities 선업
		const XUTL		= new CmmnUtil({name: "XUTL",		debug: ENV.JS_DEBUG_MODE});
		const XENC		= new EncUtil({name: "XENC",		debug: ENV.JS_DEBUG_MODE});
		const XFILE		= new FileUtil({name: "XFILE",		debug: ENV.JS_DEBUG_MODE});
		window.XPOP		= new PopUtil({name: "XPOP",		debug: ENV.JS_DEBUG_MODE});
		const NG_UTL	= new NgUtil({
			name					: "NG_UTL",
			CELL_COMBO_HEIGHT		: "23px",
			debug					: ENV.JS_DEBUG_MODE
		});
		const NG_GRD	= new NgGridUtil({name:"NG_GRD",	debug: ENV.JS_DEBUG_MODE});
		const NG_CELL	= new NgCellTemplateUtil({
			name					: "NG_CELL",
			CELL_INPUT_HEIGHT		: "23px",
			CELL_DATE_HEIGHT		: "23px",
			CELL_COMBO_HEIGHT		: "23px",
			CELL_TEXTAREA_HEIGHT	: "23px",
			debug					: ENV.JS_DEBUG_MODE
		});
		const NG_ATCH	= new NgUiAtch({
			name				: "NG_ATCH",
			URL_FILE_LIST		: "/std/cmmn/fl/selFileList.do",
			URL_FILE_UPLOAD		: "/std/cmmn/fl/upload.do",
			URL_FILE_DOWNLOAD	: "/std/cmmn/fl/download.do",
			URL_FILE_DELETE		: "/std/cmmn/fl/removeFile.do",
			debug				: ENV.JS_DEBUG_MODE
		});
		
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
		const SS_USER_INFO = <%=new Gson().toJson(StdUtils.getSimpleSessionUserInfo()) %>
		SS_USER_INFO.svrDt = '<%=new SimpleDateFormat("yyyyMMdd").format(new Date())%>'
    </script>
<%}%>
    