<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: ITM_LIST.xml
	설명	: 품목 조회
	수정일		 	수정자		수정내용
	2021.11.03	정래훈		최초작성
--%> 

<head>
    <title>품목조회</title>

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
    <script type="text/javascript" src="/WEBSERVER/yam/js/mm/ITM_LIST.js?ver=<%=YamConst.VER_MM_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->

</head>

<body id="in_frame" class="scroll">

	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl" class="gray-bg" ng-init="load({});">
		
		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">

			<!-- 버튼/조회 영역 -->
			<div class="row">			
				<div class="col-xs-12">
					<div class="ibox">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>조회 조건</h5>
							<div class="ibox-tools">
		                        <button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	ng-show="lfn_btn_show('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
		                        <button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
							</div>
						</div>
						
						<div class="ibox-content row" style="overflow:visible;">
						
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">품목</label>
	                        	<div class="col-sm-1">
		                        	<input ng-model="ds_cond.ITM_CD"	kr-input	class="form-control" type="text" />
	                        	</div>
	                        	
	                        	<label class="col-sm-1 control-label">품목구분</label>
	                        	<div class="col-sm-1">
	                        		<multicombo multi-combo sel-model="ds_cond.ITM_GBS" list-model="ds_code.ITM_GB"></multicombo>
	                        	</div>	      
	                        	
	                        	<label class="col-sm-1 control-label">품목그룹</label>
	                        	<div class="col-sm-1">
	                        		<multicombo multi-combo sel-model="ds_cond.ITM_GRPS" list-model="ds_code.ITM_GRP"></multicombo>
	                        	</div>	
                                <label class="col-sm-1 control-label">사용구분</label>
	                        	<div class="col-sm-1">
	                        		<select ng-model="ds_cond.USE_YN"	class="form-control">
	                        			<option value="">전체</option>
	                        			<option ng-repeat="x in ds_code.USE_YN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
	                        		</select>
	                        	</div>
	                        		    	                        		
	                   		</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //버튼/조회 영역 -->
			
			
       		<!-- 마스터 그리드 영역  -->
        	<div class="row">
				<div class="col-lg-12">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>품목 목록</h5>
							<div class="btn-group pull-right"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height: 80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
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
