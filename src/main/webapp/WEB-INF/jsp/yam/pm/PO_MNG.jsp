<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: PO_MNG.jsp
	설명		: 구매발주등록
	수정일		 	수정자		수정내용
    2022.04.11		이진호		최초작성
--%> 

<head>
    <title>구매발주등록</title>
	
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
    <script type="text/javascript" src="/WEBSERVER/yam/js/pm/PO_MNG.js?ver=<%=YamConst.VER_PC_JS %>" charset="utf-8"></script>
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
							<h5></h5>
							<div class="ibox-tools">
		                        <button ng-click="lfn_btn_onClick('NEW')"		ng-disabled="lfn_btn_disabled('NEW')"		ng-show="lfn_btn_show('NEW')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-o" aria-hidden="true"></i> 신규</button>
								<button ng-click="lfn_btn_onClick('CONFIRM')"	ng-disabled="lfn_btn_disabled('CONFIRM')"	ng-show="lfn_btn_show('CONFIRM')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 확정</button>
								<button ng-click="lfn_btn_onClick('CANCEL')"	ng-disabled="lfn_btn_disabled('CANCEL')"	ng-show="lfn_btn_show('CANCEL')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-undo" aria-hidden="true"></i> 확정취소</button>
								<button ng-click="lfn_btn_onClick('WHIN')"		ng-disabled="lfn_btn_disabled('WHIN')"		ng-show="lfn_btn_show('WHIN')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 입고</button>
								<button ng-click="lfn_btn_onClick('WHIN_CANCEL')"	ng-disabled="lfn_btn_disabled('WHIN_CANCEL')"	ng-show="lfn_btn_show('WHIN_CANCEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 입고취소</button>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //버튼/조회 영역 -->
			
			<!-- 기본사항 영역 -->
			<div id="ds_mst" class="row">
				<div class="col-xs-12 form-group">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>기본사항</h5>
							<div class="btn-group pull-right"></div>
						</div>
						
						<div class="ibox-content">
							<div class="row">
							
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">구매발주번호</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.PO_NO" readonly class="form-control text-center" type="text" />
		                        	</div>

									<label class="col-sm-1 control-label">상태</label>
									<div class="col-sm-1">
										<select ng-model="ds_mst.PO_ST" ng-disabled="true" class="form-control">
											<option value="00">작성중</option>
                        					<option ng-repeat="x in ds_code.PO_ST" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>
								</div>

								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label" label-mask>발주일자</label>
									<div class="col-sm-1">
										<div class="input-group">
											<div moment-picker="ds_mst.PO_DY"  change="lfn_input_onChange('ds_mst.PO_DY')"
													locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
										    	<input ng-model="ds_mst.PO_DY" ng-disabled="lfn_input_disabled('ds_mst.PO_DY')" validTypes="required" validName="발주일자"
										    			ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen">
										    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
											</div>
										</div>
									</div>

		                        	
		                        	<label class="col-sm-1 control-label">납기일자</label>
		                        	<div class="col-sm-1">
										<div class="input-group">
											<div moment-picker="ds_mst.DUE_DY"  change="lfn_input_onChange('ds_mst.DUE_DY')"
												 locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
												<input ng-model="ds_mst.DUE_DY" ng-disabled="lfn_input_disabled('ds_mst.DUE_DY')" validTypes="required" validName="납기일자"
													   ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen">
												<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
											</div>
										</div>
		                        	</div>

									<label class="col-sm-1 control-label">납품일자</label>
									<div class="col-sm-1">
										<div class="input-group">
											<div moment-picker="ds_mst.DOG_DY"  change="lfn_input_onChange('ds_mst.DOG_DY')"
												 locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
												<input ng-model="ds_mst.DOG_DY" ng-disabled="lfn_input_disabled('ds_mst.DOG_DY')" validName="납품일자"
													   ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen">
												<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
											</div>
										</div>
									</div>

									<label class="col-sm-1 control-label">발주담당자</label>
									<div class="col-sm-1">
										<div class="input-group">
											<input ng-model="ds_mst.PO_CP_NM" readonly validTypes="required" validName="담당자" class="form-control" type="text"/>
											<div class="input-group-btn">
												<button ng-click="lfn_btn_onClick('ds_mst.PO_CP_ID')"	ng-disabled="lfn_btn_disabled('ds_mst.PO_CP_ID')" ng-show="lfn_btn_show('ds_mst.PO_CP_ID')"
														class="btn btn-primary m-n" ><i class="fa fa-search"></i></button>
											</div>
										</div>
									</div>


									<label class="col-sm-1 control-label">거래처</label>
									<div class="col-sm-1">
										<div class="input-group">
											<input ng-model="ds_mst.PARTNR_NM" readonly validTypes="required" validName="거래처" class="form-control" type="text"/>
											<div class="input-group-btn">
												<button ng-click="lfn_btn_onClick('ds_mst.PARTNR_ID')"	ng-disabled="lfn_btn_disabled('ds_mst.PARTNR_ID')" ng-show="lfn_btn_show('ds_mst.PARTNR_ID')"
														class="btn btn-primary m-n" ><i class="fa fa-search"></i></button>
											</div>
										</div>
									</div>
								</div>
								
								<div class="col-sm-12 form-group">

									<label class="col-sm-1 control-label" label-mask>입고창고</label>
									<div class="col-sm-1">
										<select ng-model="ds_mst.WHIN_WH_CD" ng-change="lfn_input_onChange('ds_mst.WHIN_WH_CD')" ng-disabled="lfn_input_disabled('ds_mst.WHIN_WH_CD')"
												validTypes="required" validName="입고창고"  class="form-control">
											<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
										</select>
									</div>

									<label class="col-sm-1 control-label">통화코드</label>
									<div class="col-sm-1">
										<select ng-model="ds_mst.CUR_CD" ng-change="lfn_input_onChange('ds_mst.CUR_CD')" ng-disabled="lfn_input_disabled('ds_mst.CUR_CD')"
												validTypes="required" validName="통화코드"  class="form-control">
											<option ng-repeat="x in ds_code.CUR_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
										</select>
									</div>

									<label class="col-sm-1 control-label">세금코드</label>
									<div class="col-sm-1">
										<select ng-model="ds_mst.TX_CD" ng-change="lfn_input_onChange('ds_mst.TX_CD')" ng-disabled="lfn_input_disabled('ds_mst.TX_CD')"
												validTypes="required" validName="세금코드"  class="form-control">
											<option ng-repeat="x in ds_code.TX_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
										</select>
									</div>

								</div>

								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">총 공급금액</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.TOT_PO_SPL_AM" ng-change="lfn_input_onChange('ds_mst.TOT_PO_SPL_AM')" ng-disabled="lfn_input_disabled('ds_mst.TOT_PO_SPL_AM')" class="form-control text-right" type="text" />
									</div>

									<label class="col-sm-1 control-label">총 부가세</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.TOT_PO_VAT" ng-change="lfn_input_onChange('ds_mst.TOT_PO_VAT')" ng-disabled="lfn_input_disabled('ds_mst.TOT_PO_VAT')" class="form-control text-right" type="text" />
									</div>

									<label class="col-sm-1 control-label">총 발주금액</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.TOT_PO_SUM_AM" ng-change="lfn_input_onChange('ds_mst.TOT_PO_SUM_AM')" ng-disabled="lfn_input_disabled('ds_mst.TOT_PO_SUM_AM')" class="form-control text-right" type="text" />
									</div>

								</div>

								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">메모</label>
									<div class="col-sm-9">
										<textarea ng-model="ds_mst.PO_REMARKS"  ng-change="lfn_input_onChange('ds_mst.PO_REMARKS')" ng-disabled="lfn_input_disabled('ds_mst.PO_REMARKS')"	kr-input rows="3"></textarea>
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
				<div class="col-xs-12">
					<div class="ibox">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>투입품목</h5>
							<div class="btn-group pull-right">
 				                <button ng-click="lfn_btn_onClick('sub.ADD')"		ng-disabled="lfn_btn_disabled('sub.ADD')"		ng-show="lfn_btn_show('sub.ADD')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-plus" aria-hidden="true"></i> 추가</button>
								<button ng-click="lfn_btn_onClick('sub.DEL')"		ng-disabled="lfn_btn_disabled('sub.DEL')"		ng-show="lfn_btn_show('sub.DEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-minus" aria-hidden="true"></i> 삭제</button>							
							</div>
						</div>
						<div class="ibox-content">
							<div ui-grid="subGrid" style="height:55vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
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
