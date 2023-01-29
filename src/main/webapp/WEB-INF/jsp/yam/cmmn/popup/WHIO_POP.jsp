<%@page import="yam.cmmn.YamConst"%>
<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: WHIO_POP.jsp
	설명	: 입출고조회(재고이력)
	수정일		 	수정자		수정내용
    2021.11.01 		zno			최초작성
--%> 
<head>
    <title>입출고이력</title>

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
	<script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/popup/WHIO_POP.js?ver=<%=YamConst.VER_POPUP_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->


</head>

<body id="in_frame" class="scroll" style="overflow:hidden;">

	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl" class="gray-bg" ng-init="load({});">
		
		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">

			<!-- 버튼 영역 -->
			<div class="row">
				<div class="col-lg-12 btn-box">
					<div class="btn-group pull-right">
						<p>
							<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	class="btn btn-warning btn-sm" type="button"><i class="fa fa-search"></i> 조회</button>
							<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							class="btn btn-warning btn-sm" type="button"><i class="fa fa-window-close"></i> 닫기</button>
						</p>
					</div>
				</div>
			</div>
			<!-- //버튼 영역 -->
			
			
			<!-- 조회/그리드 영역 -->
			<div class="row">

				<!-- 조회 영역 -->
				<div class="col-xs-12">
					<div class="ibox" style="margin-bottom:0;">
						<div class="ibox-content i-box-search">
							<div class="col-sm-12 form-group">
								
                                <label class="col-sm-1 control-label">년월</label>
								<div class="col-sm-1">
									<div class="input-group">
										<div moment-picker="ds_cond.SIO_YM" style="display:inherit" class="ng-isolate-scope" locale="ko" start-view="month" format="YYYY-MM">
											<input 	ng-model="ds_cond.SIO_YM" ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
											<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
									</div>
								</div>

	                        	<label class="col-sm-1 control-label">창고</label>
	                        	<div class="col-sm-2">
	                        		<select ng-model="ds_cond.WH_CD" ng-disabled="lfn_input_disabled('ds_cond.WH_CD')" class="form-control">
	                        			<option value="">전체</option>
	                        			<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
	                        		</select>
	                        	</div>
	                        	
	                        	<label class="col-sm-1 control-label">품목코드</label>
	                        	<div class="col-sm-2">
									<div class="input-group">
		                                <input ng-model="ds_cond.ITM_CD" readonly  class="form-control text-center" type="text" />
		                                <div class="input-group-btn">
		                                    <button ng-click="lfn_btn_onClick('ds_cond.ITM_CD')"	class="btn btn-primary m-n" ><i class="fa fa-search"></i></button>
		                                </div>
                            		</div>
	                        	</div>
	                        	<div class="col-sm-4">
		                        	<input ng-model="ds_cond.ITM_NM" readonly  class="form-control" type="text" />
	                        	</div>
								
							</div>
						</div>
					</div>
				</div>
				<!-- //조회 영역 -->
				
				<!-- 입고 그리드 영역 -->
				<div class="col-xs-6">
					<div class="ibox" style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>입고</h5>
							<div class="ibox-tools"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="whinGrid" style="height: 80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
				<!-- //입고 그리드 영역  -->
				
				<!-- 출고 그리드 영역 -->
				<div class="col-xs-6">
					<div class="ibox" style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>출고</h5>
							<div class="ibox-tools"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="whoutGrid" style="height: 80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
				<!-- //출고 그리드 영역  -->

				
			</div>
			<!-- //조회/그리드 영역 -->
			
		</div>
		<!-- //block-ui 영역 -->
		
	</div>
	<!-- //application, controller 영역 -->
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->


</body>
