<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: WSFR_LIST.jsp
	설명	: 창고이동관리
	수정일		 	수정자		수정내용
    2021.10.26	염국선		최초작성
--%> 

<head>
    <title>창고이동관리</title>

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
    <script type="text/javascript" src="/WEBSERVER/yam/js/wm/WSFR_LIST.js?ver=<%=YamConst.VER_WM_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->

	<style>
		.moment-picker{ z-index: 5000 !important;}
	</style>

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
<%--								<button ng-click="lfn_btn_onClick('REG')"		ng-disabled="lfn_btn_disabled('REG')"		ng-show="lfn_btn_show('REG')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-text-o"></i> 등록</button>--%>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
						
						<div class="ibox-content row" style="overflow:visible;">
						
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">창고이동일</label>
	                        	<div class="col-sm-3">
                                    <div class="input-group">
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
	                        	
	                        	<label class="col-sm-1 control-label">품목구분</label>
	                        	<div class="col-sm-1">
									<multicombo multi-combo sel-model="ds_cond.ITM_GBS" list-model="ds_code.ITM_GB"></multicombo>
	                        	</div>	                      	 
	                        	
	                        	<label class="col-sm-1 control-label">출고창고</label>
	                        	<div class="col-sm-1">
	                        		<multicombo multi-combo sel-model="ds_cond.WHOUT_WH_CDS" list-model="ds_code.WH_CD"></multicombo>
	                        	</div>	                        	                  
	                        	
	                        	<label class="col-sm-1 control-label">입고창고</label>
	                        	<div class="col-sm-1">
	                        		<multicombo multi-combo sel-model="ds_cond.WHIN_WH_CDS" list-model="ds_code.WH_CD"></multicombo>
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
							<h5><i class="fa fa-list-alt"></i>창고이동 목록</h5>
							<div class="btn-group pull-right"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height: 38vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize></div>
						</div>
					</div>
				</div>
			</div>
       		<!-- //마스터 그리드 영역  -->
			
       		<!-- 상세 그리드 영역  -->
			<div class="row">
				<div class="col-lg-12">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>창고이동 상세</h5>
							<div class="btn-group pull-right"></div>
						</div>
						
						<!--상세그리드-->		
						<div class="ibox-content">
							<div ui-grid="subGrid" style="height: 35vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize></div>
						</div>
						<!--//상세그리드-->	
					</div>
				</div>
			</div>
       		<!-- //상세 그리드 영역  -->

			<!-- 창고이동 작성 모달영력 --> 
			<div id="editModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-fullsize" role="document" style="width:800px;">
					<div class="modal-content modal-fullsize" >
						<div class="modal-body">
							<div class="ibox">
	
								<div class="ibox-title">	
									<h5><i class="fa fa-list-alt"></i>창고이동</h5>
									<div class="ibox-tools">
										<button ng-click="lfn_btn_onClick('CONFIRM')"		ng-disabled="lfn_btn_disabled('CONFIRM')"	ng-show="lfn_btn_show('CONFIRM')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 확정</button>
										<button ng-click="lfn_btn_onClick('CANCEL')"		ng-disabled="lfn_btn_disabled('CANCEL')"	ng-show="lfn_btn_show('CANCEL')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 확정취소</button>
										<button ng-click="lfn_btn_onClick('edit.CLOSE')"	ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
									</div>
								</div>
								
				          		<!-- 에디터 영역 -->
								<div id="ds_editMst" class="ibox-content">
									<div class="row row-full-height">
									
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label" label-mask>이동요청일</label>
											<div class="col-sm-2">
												<div class="input-group" style="z-index: 9999">
													<div moment-picker="ds_editMst.WSFR_DY" change="lfn_input_onChange('ds_editMst.WSFR_DY')"	format="YYYY-MM-DD" start-view="month" locale="ko" class="ng-isolate-scope" style="display: inherit;">
														<input ng-model="ds_editMst.WSFR_DY" ng-disabled="lfn_input_disabled('ds_editMst.WSFR_DY')"	ng-model-options="{ updateOn: 'blur' }"	validTypes="required"	validName="창고이동요청일자"	readonly tabindex="0" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty" type="text">
														<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
													</div>
												</div>
											</div>
											
											<label class="col-sm-2 control-label">자동입출고</label>
											<div class="col-sm-2">
												<input ng-model="ds_editMst.AUTO_WHIO_YN"	ng-disabled="true"	ng-true-value="'Y'" ng-false-value="'N'"	type="checkbox"/>
											</div>

											<label class="col-sm-2 control-label">창고이동번호</label>
											<div class="col-sm-2">
												<input ng-model="ds_editMst.WSFR_NO" readonly class="form-control text-center" type="text" />
											</div>
										</div>
										
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label" label-mask>출고창고</label>
											<div class="col-sm-2">
												<select ng-model="ds_editMst.WHOUT_WH_CD"	ng-disabled="lfn_input_disabled('ds_editMst.WHOUT_WH_CD')"	ng-change="lfn_input_onChange('ds_editMst.WHOUT_WH_CD')"	validTypes="required"	validName="출고창고"	class="form-control">
													<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
											
											<label class="col-sm-2 control-label" label-mask>입고창고</label>
											<div class="col-sm-2">
												<select ng-model="ds_editMst.WHIN_WH_CD"	ng-disabled="lfn_input_disabled('ds_editMst.WHIN_WH_CD')"	ng-change="lfn_input_onChange('ds_editMst.WHIN_WH_CD')"		validTypes="required"	validName="입고창고"	class="form-control">
													<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label">상태</label>
											<div class="col-sm-2">
												<span class="form-control text-center">{{ds_editMst.WSFR_ST|codeName:ds_code.WSFR_ST}}</span>
											</div>
										</div>
										
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label text-right" >비고</label>
											<div class="col-sm-10">
												<textarea ng-model="ds_editMst.REMARKS" ng-disabled="lfn_input_disabled('ds_editMst.REMARKS')"	ng-change="lfn_input_onChange('ds_editMst.REMARKS')"	kr-input rows="5" cols="" class="form-control"></textarea>
											</div>
										</div>
										
										<div class="col-sm-12 form-group">
											<div class="ibox-title">
												<div class="ibox-tools">
													<button ng-click="lfn_btn_onClick('edit.sub.ADD')"	ng-disabled="lfn_btn_disabled('edit.sub.ADD')"	ng-show="lfn_btn_show('edit.sub.ADD')"		class="btn btn-warning btn-tbb" type="button">추가</button>
													<button ng-click="lfn_btn_onClick('edit.sub.DEL')"	ng-disabled="lfn_btn_disabled('edit.sub.DEL')"	ng-show="lfn_btn_show('edit.sub.DEL')"		class="btn btn-warning btn-tbb" type="button">삭제</button>
												</div>
											</div>
											
											<div class="row row-full-height">
												<div ui-grid="editSubGrid" style="height: 50vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize></div>
											</div>
										</div>
										
									</div>
								</div>
								<!-- //에디터 영역 -->
									
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //창고이동 작성 모달영력 -->
			
		</div>
		<!-- //block-ui 영역 -->
		
	</div>
	<!-- //application, controller 영역 -->
	
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>
