<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: SC_REG.jsp
	설명	: 재고실사조회
	수정일		 	수정자		수정내용
    2021.11.02	zno		최초작성
--%> 

<head>
    <title>재고실사</title>

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
    <script type="text/javascript" src="/WEBSERVER/yam/js/wm/SC_LIST.js?ver=<%=YamConst.VER_WM_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->

	<style>
        .moment-picker {
            z-index: 5000 !important;
        }
	</style>
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
		                        <button ng-click="lfn_btn_onClick('SEARCH')"		ng-disabled="lfn_btn_disabled('SEARCH')"		ng-show="lfn_btn_show('SEARCH')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
		                        <button ng-click="lfn_btn_onClick('CLOSE')"			ng-disabled="false"								ng-show="true"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
							</div>
						</div>
						
						<div id="ds_data" class="ibox-content row" style="overflow:visible;">
						
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">재고실사일</label>
	                        	<div class="col-sm-3">
                                    <div class="input-group"  style="width: 100%;">
										<div moment-picker="ds_cond.SC_DY_FR" style="display:inherit"  
											 class="ng-isolate-scope" locale="ko" start-view="month" format="YYYY-MM-DD">
									    	<input 	ng-model="ds_cond.SC_DY_FR" ng-model-options="{ updateOn: 'blur' }" 
									    			class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
										<span class="input-group-addon dash">-</span>
										<div style="display:inherit" moment-picker="ds_cond.SC_DY_TO" 
											 class="ng-isolate-scope" locale="ko" start-view="month" format="YYYY-MM-DD">
									    	<input 	ng-model="ds_cond.SC_DY_TO" ng-model-options="{ updateOn: 'blur' }"
									    			class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
                                    </div>
	                        	</div>								                        
	                         
                                <label class="col-sm-1 control-label">창고</label>
	                        	<div class="col-sm-1">
									<multicombo multi-combo sel-model="ds_cond.WH_CDS" list-model="ds_code.WH_CD"></multicombo>
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
							<h5><i class="fa fa-list-alt"></i>재고실사 목록</h5>
							<div class="btn-group pull-right"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height: 30vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="row">
				<div class="col-lg-12">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>재고실사등록 상세</h5>
							<div class="btn-group pull-right"></div>
						</div>
						
						<!--상세그리드-->		
						<div class="ibox-content">
							<div ui-grid="subGrid" style="height: 40vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
						<!--//상세그리드-->	
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
