<%@page import="we.cmmn.exception.AuthException"%>
<%@page import="we.cmmn.exception.SessionException"%>
<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@taglib prefix="c"      uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: error.jsp
	설명	: 공통 오류처리
			- SessionException 일 경우 재로그인 모달을 이용하여 로긴하고 리로드
			- Exception 일 경우 오류메세지, 이외 상태코드를 메세지메 포함
	수정일		 	수정자		수정내용
    2021.10.29	염국선		최초작성
--%> 

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>오류</title>

<%
	String erMsg = "통신장애가 발생하여 사용 하실 수 없습니다.";
	Integer statusCode = (Integer)request.getAttribute("javax.servlet.error.status_code");
	Exception exception = (Exception) request.getAttribute("javax.servlet.error.exception");
	//String reqUri = (String) request.getAttribute("javax.servlet.error.request_uri");
	//String erMsg = (String) request.getAttribute("javax.servlet.error.message");
	
	if (exception == null) {
		if (statusCode == 404) {
			erMsg = "잘못 된 호출 입니다.";
		}
		erMsg += "["+statusCode+"]";
		
	} else if (exception instanceof SessionException || exception.getCause() instanceof SessionException) {
		//session timeout 일 경우 relogin 모달로 로긴하고 재로드
		erMsg = "연결시간이 종료 되었습니다.";
%>
	<script type="text/javascript">
		if (top.RELOGIN) {
			top.RELOGIN.relogin().then(function () {
				location.reload();
			});	
		}
	</script>
<%
	} else if (exception instanceof AuthException || exception.getCause() instanceof AuthException) {
		erMsg = "보안에 위배된 호출 입니다.";
		if (exception.getCause() == null) {
			erMsg += "<br/>["+exception.getMessage()+"1]";
		} else {
			erMsg += "<br/>["+exception.getCause().getMessage()+"2]"+exception.getCause().getClass().getName();
		}

	} else {
		if (exception.getCause() == null) {
			erMsg += "<br/>["+exception.getMessage()+"1]";
		} else {
			erMsg += "<br/>["+exception.getCause().getMessage()+"2]"+exception.getCause().getClass().getName();
		}
	}
%>

</head>
<body>

	<table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td width="100%" height="100%" align="center" valign="middle" style="padding-top: 100px;">
				<table border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td>
							<span style="font-weight: bold; line-height: 150%; color:red;"><%=erMsg %></span>
						</td>
					</tr>
					<tr>
						<td style="padding-top:30px;">
							<span style="line-height: 150%;">☛ 문제가 지속 되면 관리자에게 문의 하세요.</span>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	
</body>
</html>