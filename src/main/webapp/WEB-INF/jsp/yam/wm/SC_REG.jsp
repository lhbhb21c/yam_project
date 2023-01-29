<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: SC_REG.jsp
	설명	: 재고실사등록
	수정일		 	수정자		수정내용
    2021.11.05	이진호		초기생성
--%>

<head>
    <title>재고실사등록</title>

	<!-- ====================================================================================================================================================== -->
	<!-- 세션체크 -->
	<jsp:include page="/WEB-INF/jsp/inc_session_check.jsp" />
	<!-- ====================================================================================================================================================== -->

	<!-- ====================================================================================================================================================== -->
	<!-- 공통헤더 -->
	<jsp:include page="/WEB-INF/jsp/inc_head.jsp" />
	<!-- ====================================================================================================================================================== -->

	<style>
		.moment-picker { z-index: 5000 !important; }
	</style>

    <!-- ====================================================================================================================================================== -->
    <!-- 페이지별 SCRIPT, CSS -->
	<script type="text/javascript" src="/WEBSERVER/yam/js/cmmn/yam.js?ver=<%=YamConst.VER_PJT_JS %>" charset="utf-8"></script>
	<script type="text/javascript" src="/WEBSERVER/yam/js/wm/SC_REG.js?ver=<%=YamConst.VER_WM_JS %>" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->


</head>

<body id="in_frame" class="scroll">

	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl" class="gray-bg" ng-init="load();">

		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">

			<!-- 기본사항 영역 -->
			<div class="row">
				<div class="col-lg-12 form-group">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>기본사항</h5>
							<div class="ibox-tools">
								<button ng-click="lfn_btn_onClick('REG')"		ng-disabled="lfn_btn_disabled('REG')"				ng-show="lfn_btn_show('REG')"				class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-text-o"></i> 신규</button>
								<button ng-click="lfn_btn_onClick('REQ')"		ng-disabled="lfn_btn_disabled('REQ')"				ng-show="lfn_btn_show('REQ')"				class="btn btn-warning btn-tbb" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> 재고실사시작</button>
								<button ng-click="lfn_btn_onClick('CONFIRM')"	ng-disabled="lfn_btn_disabled('CONFIRM')"			ng-show="lfn_btn_show('CONFIRM')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 확정</button>
								<button ng-click="lfn_btn_onClick('CANCEL')"	ng-disabled="lfn_btn_disabled('REQ_CANCEL')"		ng-show="lfn_btn_show('REQ_CANCEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-repeat" aria-hidden="true"></i> 재고실사취소</button>
								<button ng-click="lfn_btn_onClick('DONE')"		ng-disabled="lfn_btn_disabled('DONE')"				ng-show="lfn_btn_show('DONE')"				class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 완료(수불처리)</button>
								<button ng-click="lfn_btn_onClick('CANCEL')"	ng-disabled="lfn_btn_disabled('CONFIRM_CANCEL')"	ng-show="lfn_btn_show('CONFIRM_CANCEL')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-repeat" aria-hidden="true"></i> 확정취소</button>
								<button ng-click="lfn_btn_onClick('DEL')"		ng-disabled="lfn_btn_disabled('DEL')"				ng-show="lfn_btn_show('DEL')"				class="btn btn-warning btn-tbb" type="button"><i class="fa fa-trash"></i> 삭제</button>
								<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"				ng-show="lfn_btn_show('SAVE')"				class="btn btn-warning btn-tbb" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> 저장</button>
		                        <button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"									ng-show="true"								class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
						<div class="ibox-content row" style="overflow:visible;">

							<div id="ds_mst" class="row">
								<div class="col-sm-6">

									<div class="col-sm-12 form-group">
										<label class="col-sm-3 control-label" label-mask>재고실사일자</label>
										<div class="col-sm-3">
											<div class="input-group"  style="width: 100%;">
												<div class="ng-isolate-scope" style="display:inherit" moment-picker="ds_mst.SC_DY"  change="lfn_input_onChange('ds_mst.SC_DY')"
													         locale="ko"
													         start-view="month"
														     format="YYYY-MM-DD">
											    	<input ng-model="ds_mst.SC_DY" ng-model-options="{ updateOn: 'blur' }"
											    			ng-disabled="lfn_input_disabled('ds_mst.SC_DY')"
											    			validTypes="required" validName="재고실사일자"
											    			class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen" >
											    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
												</div>
											</div>
										</div>

			                        	<label class="col-sm-3 control-label">재고실사번호</label>
			                        	<div class="col-sm-3">
			                        		<input ng-model="ds_mst.SC_NO"	ng-disabled="true"	class="form-control">
			                        	</div>
									</div>

									<div class="col-sm-12 form-group">
										<label class="col-sm-3 control-label">창고</label>
										<div class="col-sm-3">
											<select ng-model="ds_mst.WH_CD"  ng-change="lfn_input_onChange('ds_mst.WH_CD')" ng-disabled="lfn_input_disabled('ds_mst.WH_CD')"
													validTypes="required" validName="창고"  class="form-control" >
												<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_CD}} : {{x.CODE_NM}}</option>
											</select>
										</div>

										<label class="col-sm-3 control-label" label-mask>재고실사구분</label>
			                        	<div class="col-sm-3">
			                        		<select ng-model="ds_mst.SC_GB" ng-change="lfn_input_onChange('ds_mst.SC_GB')" ng-disabled="lfn_input_disabled('ds_mst.SC_GB')"
			                        				validTypes="required" validName="재고실사구분"	class="form-control">
	                        					<option ng-repeat="x in ds_code.SC_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
	                        				</select>
			                        	</div>

									</div>




								</div>

								<div class="col-sm-6">
									<div class="col-sm-12 form-group">
										<label class="col-sm-1 control-label">비고</label>
										<div class="col-sm-10">
											<textarea ng-model="ds_mst.REMARKS"  ng-change="lfn_input_onChange('ds_mst.REMARKS')" ng-disabled="lfn_input_disabled('ds_mst.REMARKS')"
													  rows="3" style="width:100%;" ></textarea>
										</div>
									</div>
								</div>

							</div>

						</div>
					</div>

				</div>
			</div>

			<!-- //기본사항 영역 -->

       		<!-- 서브 그리드 영역  -->

        	<div class="row">
				<div class="col-lg-12">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>재고실사목록</h5>
							<div class="btn-group pull-right">
 				                <button ng-click="lfn_btn_onClick('sub.ADD')"		ng-disabled="lfn_btn_disabled('sub.ADD')"		ng-show="lfn_btn_show('sub.ADD')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-plus" aria-hidden="true"></i> 추가</button>
								<button ng-click="lfn_btn_onClick('sub.DEL')"		ng-disabled="lfn_btn_disabled('sub.DEL')"		ng-show="lfn_btn_show('sub.DEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-minus" aria-hidden="true"></i> 삭제</button>
							</div>
						</div>
						<div class="ibox-content">
							<div ui-grid="subGrid" style="height: 75vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
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
