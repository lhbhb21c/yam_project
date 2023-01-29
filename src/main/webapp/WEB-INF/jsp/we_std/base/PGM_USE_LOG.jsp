<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: PGM_USE_LOG.jsp
	설명	: 사용자로그
	수정일		 	수정자		수정내용
    2021.11.05	이경수		최초작성
--%> 

<head>
    <title>사용자로그</title>
	
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
    <script type="text/javascript" src="/WEBSERVER/we_std/js/base/PGM_USE_LOG.js?ver=<%=StdConst.VER_STD_BASE_JS %>" charset="utf-8"></script>
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
								<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
						
						<div id="ds_data" class="ibox-content">
						
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">사용일자</label>
	                        	<div class="col-sm-3">
                                    <div class="input-group"  style="width: 100%;">
										<div moment-picker="ds_cond.REG_DY_FR" style="display:inherit"  
											 class="ng-isolate-scope" locale="ko" start-view="month" format="YYYY-MM-DD">
									    	<input 	ng-model="ds_cond.REG_DY_FR" ng-model-options="{ updateOn: 'blur' }" 
									    			class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
										<span class="input-group-addon dash">-</span>
										<div moment-picker="ds_cond.REG_DY_TO" style="display:inherit" 
											 class="ng-isolate-scope" locale="ko" start-view="month" format="YYYY-MM-DD">
									    	<input 	ng-model="ds_cond.REG_DY_TO" ng-model-options="{ updateOn: 'blur' }"
									    			class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
                                    </div>
	                        	</div>	      
	                        	
                                <label class="col-sm-1 control-label">사용자명</label>
	                        	<div class="col-sm-1">
									<input ng-model="ds_cond.USER_NM" class="form-control" type="text" />
	                        	</div>
	                        	
	                        </div>

						</div>

					</div>
				</div>
			</div>
			<!-- //버튼/조회 영역 -->
			
       		<!-- 그리드 영역  -->

        	<div class="row">
				<div class="col-lg-12">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>로그내역</h5>
							<div class="btn-group pull-right"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height: 80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- //그리드 영역  -->
			
       </div>
       <!-- //block-ui 영역 -->
       
	</div>
	<!-- //application, controller 영역 -->
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>
