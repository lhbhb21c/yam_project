<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: PWO_LIST.jsp
	설명	: 작업지시조회
	수정일		 	수정자		수정내용
    2021.11.04	염국선		최초작성
--%> 

<head>
    <title>작업지시조회</title>
	
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
    <script type="text/javascript" src="/WEBSERVER/yam/js/pc/PWO_LIST.js?ver=<%=YamConst.VER_PC_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->

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
							<h5><i class="fa fa-list-alt"></i>조회 조건</h5>
							<div class="ibox-tools">
								<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	ng-show="lfn_btn_show('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
								<button ng-click="lfn_btn_onClick('REG')"		ng-disabled="lfn_btn_disabled('REG')"		ng-show="lfn_btn_show('REG')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 작업지시등록</button>
								<button ng-click="lfn_btn_onClick('REPORT')"	ng-disabled="lfn_btn_disabled('REPORT')"	ng-show="lfn_btn_show('REPORT')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-print"></i> 작업지시서</button>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
						
						<div class="ibox-content row" style="overflow:visible;">
						
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">지시일</label>
	                        	<div class="col-sm-3">
                                    <div class="input-group"  style="width: 100%;">
										<div moment-picker="ds_cond.DY_FR" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
									    	<input ng-model="ds_cond.DY_FR" ng-model-options="{ updateOn: 'blur' }"	class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
										<span class="input-group-addon dash">-</span>
										<div moment-picker="ds_cond.DY_TO" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
									    	<input ng-model="ds_cond.DY_TO" ng-model-options="{ updateOn: 'blur' }"	class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
                                    </div>
	                        	</div>	      
	                        	
	                        	<label class="col-sm-1 control-label">구분</label>
	                        	<div class="col-sm-1">
									<multicombo multi-combo sel-model="ds_cond.PWO_GBS" list-model="ds_code.PWO_GB"></multicombo>
	                        	</div>	                      	 
	                        	
	                        	<label class="col-sm-1 control-label">상태</label>
	                        	<div class="col-sm-1">
									<multicombo multi-combo sel-model="ds_cond.PWO_STS" list-model="ds_code.PWO_ST"></multicombo>
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
							<h5><i class="fa fa-list-alt"></i>작업지시 목록</h5>
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
</html>
