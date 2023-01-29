<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 
<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@page import="we.cmmn.svc.WeSessionSvc"%>
<%@page import="we.cmmn.svc.WeSessionSvc.SessionData"%>
<%@page import="we.std.core.StdUtils"%>
<%@page import="we.cmmn.utils.WeUtils"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="org.apache.catalina.Session"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Date"%>
<%@page import="we.cmmn.utils.TomcatUtils"%>
<%@page import="java.util.List"%>
<%
	SimpleDateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
%> 
<%!
String formatTime(long milliseconds) {
	return WeUtils.formatTime(milliseconds, new String[]{"", "초 ", "분 ", "시 "});
}
%>
<html> 
<head>
	<title>Session Monitor</title>
	<style type="text/css">
		body{ font-family:"Myriad Pro","Myriad Web","Tahoma","Helvetica","Arial",sans-serif; }
		table{ border-collapse: collapse; }
		td,th{ padding: 5px; }
		th { background-color: navy; color: #fff; font-weight: bold; }
		td { text-align: center; }
	</style> 
</head> 
<body>

<h1>All Session</h1>
<table border="1" width="100%">
	<colgroup>
		<col width="20%"/>
		<col width="20%"/>
		<col width="20%"/>
		<col width="20%"/>
		<col width="20%"/>
	</colgroup>
	<tr>
		<th>UID</th>
		<th>JID</th>
		<th>SID</th>
		<th>SS_USER_INFO</th>
		<th>CreationTime</th>
	</tr>

<%
for (SessionData data : StdUtils.getWeSessionSvc().getSesionDataList()) {
	Map<String, Object> ssUserInfo = (Map<String, Object>)data.properties.get(WeSessionSvc.SS_USER_INFO);
%>
	<tr>
		<td><%=data.uid %></td>
		<td><%=data.jsid %></td>
		<td><%=data.sid %></td>
		<td><%=ssUserInfo == null ? "" : ssUserInfo.get("USER_ID") + "/" + ssUserInfo.get("USER_NM")%></td>
		<td><%=dFormat.format(data.createTime) %></td>
	</tr>
<%
}
%>
</table>

<hr/>

</body> 
</html> 
