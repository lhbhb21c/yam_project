<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: TR_AGGR_MNG.jsp
	설명	: 주문집계관리
	수정일		 	수정자		수정내용
    2021.11.11	염국선		최초작성
--%> 

<head>
    <title>주문집계관리</title>
	
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
    <script type="text/javascript" src="/WEBSERVER/yam/js/sm/TR_AGGR_MNG.js?ver=<%=YamConst.VER_SM_JS %>" charset="utf-8"></script>
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
								<button ng-click="lfn_btn_onClick('AGGR')"		ng-disabled="lfn_btn_disabled('AGGR')"		ng-show="lfn_btn_show('AGGR')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check"></i> 주문집계실행</button>
<%--								<button ng-click="lfn_btn_onClick('PARSE')"		ng-disabled="lfn_btn_disabled('PARSE')"		ng-show="lfn_btn_show('PARSE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check"></i> 생산량분석</button>--%>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
						
						<div class="ibox-content row" style="overflow:visible;">
						
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">주문집계일</label>
	                        	<div class="col-sm-1">
                                    <div class="input-group"  style="width: 100%;">
										<div moment-picker="ds_cond.TR_AGGR_DY" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
									    	<input ng-model="ds_cond.TR_AGGR_DY" ng-model-options="{ updateOn: 'blur' }" ng-disabled="true" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
                                    </div>
	                        	</div>	      
	                        	
	                        	<label class="col-sm-1 control-label">차수</label>
	                        	<div class="col-sm-1">
	                        		<select ng-model="ds_cond.TR_AGGR_TM" ng-change="lfn_input_onChange('ds_cond.TR_AGGR_TM')" ng-disabled="lfn_input_disabled('ds_cond.TR_AGGR_TM')"	class="form-control">
                       					<option ng-repeat="x in ds_code.TR_AGGR_TM_F" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                       				</select>
	                        	</div>	                      	 
	                        	
	                        </div>

						</div>

					</div>
				</div>
			</div>
			<!-- //버튼/조회 영역 -->
			
			<!-- 마스터 데이터 영역 -->
			<div id="ds_mst" class="row">
				<div class="col-xs-12 form-group">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>집계 정보</h5>
							<div class="btn-group pull-right"></div>
						</div>
						
						<div class="ibox-content">
							<div class="row">
							
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label" label-mask>주문집계일</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.TR_AGGR_DY" readonly class="form-control text-center" type="text" />
									</div>

		                        	<label class="col-sm-1 control-label" label-mask>차수</label>
		                        	<div class="col-sm-1">
										<input ng-model="ds_mst.TR_AGGR_TM" readonly class="form-control text-center" type="text" />
		                        	</div>
		                        	
									<label class="col-sm-2 control-label">시작OMS번호</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.S_OMS_NO" readonly class="form-control text-center" type="text" />
		                        	</div>

									<label class="col-sm-1 control-label">종료OMS번호</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.E_OMS_NO" readonly class="form-control text-center" type="text" />
		                        	</div>

									<label class="col-sm-1 control-label">집계상태</label>
									<div class="col-sm-1">
										<select ng-model="ds_mst.TR_AGGR_ST" ng-disabled="true" class="form-control">
                        					<option ng-repeat="x in ds_code.TR_AGGR_ST" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>
								</div>
								
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">비고</label>
									<div class="col-sm-10">
										<textarea ng-model="ds_mst.TR_AGGR_MEMO"  ng-change="lfn_input_onChange('ds_mst.TR_AGGR_MEMO')" ng-disabled="lfn_input_disabled('ds_mst.TR_AGGR_MEMO')" 
													rows="3"></textarea>
									</div>
								</div>
								
							</div>
						</div>
					</div>

				</div>
			</div>
			<!-- //마스터 데이터 영역 -->
			
			
       		<!-- 서브 그리드 영역  -->
        	<div class="row">
				<div class="col-lg-12">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>주문집계 내역</h5>
							<div class="btn-group pull-right">
								<button ng-click="lfn_btn_onClick('sub.DO')"	ng-disabled="lfn_btn_disabled('sub.DO')"	ng-show="lfn_btn_show('sub.DO')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o"></i> 출하지시</button>
								<button ng-click="lfn_btn_onClick('sub.WSFR')"	ng-disabled="lfn_btn_disabled('sub.WSFR')"	ng-show="lfn_btn_show('sub.WSFR')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o"></i> 창고이동</button>
							</div>
						</div>
						<div class="ibox-content">
							<div ui-grid="subGrid" style="height: 60vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
			</div>
       		<!-- //서브 그리드 영역  -->
			
       </div>
       <!-- //block-ui 영역 -->
       
	</div>
	<!-- //application, controller 영역 -->
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>
