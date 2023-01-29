<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: PWP_REG.jsp
	설명		: 작업실적등록
	수정일		 	수정자		수정내용
    2021.11.04	염국선		최초작성
--%> 

<head>
    <title>직업실적등록</title>
	
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
    <script type="text/javascript" src="/WEBSERVER/yam/js/pc/PWP_REG.js?ver=<%=YamConst.VER_PC_JS %>" charset="utf-8"></script>
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
							<div class="pull-left">
								<span>작업지시번호</span>
								<input ng-model="ds_cond.PWO_NO" ng-enter="lfn_input_onEnter('ds_cond.PWO_NO')" class="text-center" style="width:120px;" type="text" />
							</div>
							<div class="ibox-tools">
								<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"		ng-show="lfn_btn_show('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save" aria-hidden="true"></i> 등록</button>
								<button ng-click="lfn_btn_onClick('DEL')"		ng-disabled="lfn_btn_disabled('DEL')"		ng-show="lfn_btn_show('DEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-trash" aria-hidden="true"></i> 등록취소</button>
								<button ng-click="lfn_btn_onClick('CONFIRM')"	ng-disabled="lfn_btn_disabled('CONFIRM')"	ng-show="lfn_btn_show('CONFIRM')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 확정</button>
								<button ng-click="lfn_btn_onClick('CANCEL')"	ng-disabled="lfn_btn_disabled('CANCEL')"	ng-show="lfn_btn_show('CANCEL')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-undo" aria-hidden="true"></i> 확정취소</button>
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
									<label class="col-sm-1 control-label">작업지시번호</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.PWO_NO" readonly class="form-control text-center" type="text" />
		                        	</div>

									<label class="col-sm-1 control-label">지시일</label>
		                        	<div class="col-sm-1">
		                        		<span class="form-control text-center">{{ds_mst.PWO_DY}}</span>
		                        	</div>
		                        	
		                        	<label class="col-sm-1 control-label">작업구분</label>
		                        	<div class="col-sm-1">
		                        		<span class="form-control text-center">{{ds_mst.PWO_GB|codeName:ds_code.PWO_GB}}</span>
		                        	</div>
		                        	
		                        	<label class="col-sm-1 control-label">주문집계일자</label>
		                        	<div class="col-sm-1">
		                        		<span class="form-control text-center">{{ds_mst.TR_AGGR_DY}}</span>
		                        	</div>
		                        	
		                        	<label class="col-sm-1 control-label">생산집계차수</label>
		                        	<div class="col-sm-1">
		                        		<span class="form-control text-center">{{ds_mst.PROD_TM|codeName:ds_code.PROD_TM}}</span>
		                        	</div>
								</div>
								
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">지시메모</label>
									<div class="col-sm-9">
										<textarea ng-model="ds_mst.PWO_MEMO"  ng-disabled="true" rows="3"></textarea>
									</div>
								</div>
							</div>
						</div>

						<div class="ibox-content">
							<div class="row">
							
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">생산번호</label>
									<div class="col-sm-1">
										<input ng-model="ds_mst.PWP_NO" readonly class="form-control text-center" type="text" />
		                        	</div>

									<label class="col-sm-1 control-label">상태</label>
									<div class="col-sm-1">
										<select ng-model="ds_mst.PWP_ST" ng-disabled="true" class="form-control">
											<option value="00">작성중</option>
                        					<option ng-repeat="x in ds_code.PWP_ST" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>
								</div>
								
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label" label-mask>생산일시</label>
									<div class="col-sm-1">
										<div class="input-group">
											<div moment-picker="ds_mst.PWP_S_DY"  change="lfn_input_onChange('ds_mst.PWP_S_DY')"
													locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
										    	<input ng-model="ds_mst.PWP_S_DY" ng-disabled="lfn_input_disabled('ds_mst.PWP_S_DY')" validTypes="required" validName="생산시작일자"
										    			ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen">
										    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
											</div>
										</div>
									</div>
									
									<div class="col-sm-1">
		                        		<select ng-model="ds_mst.PWP_S_HR" ng-change="lfn_input_onChange('ds_mst.PWP_S_HR')" ng-disabled="lfn_input_disabled('ds_mst.PWP_S_HR')"
												validTypes="required" validName="시작시간"  class="form-control" style="width:50%;float:left;border-right:0">
                        					<option ng-repeat="x in ds_code.HR_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        		<select ng-model="ds_mst.PWP_S_MT" ng-change="lfn_input_onChange('ds_mst.PWP_S_MT')" ng-disabled="lfn_input_disabled('ds_mst.PWP_S_MT')"
												validTypes="required" validName="시작분"  class="form-control" style="width:50%;float:left;">
                        					<option ng-repeat="x in ds_code.MT_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
									</div>

									<div class="col-sm-1">
										<span class="input-group-addon dash">-</span>
									</div>
									
									<div class="col-sm-1">
										<div class="input-group">
											<div moment-picker="ds_mst.PWP_E_DY"  change="lfn_input_onChange('ds_mst.PWP_E_DY')"
													locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
										    	<input ng-model="ds_mst.PWP_E_DY" ng-disabled="lfn_input_disabled('ds_mst.PWP_E_DY')" validTypes="required" validName="생산종료일자"
										    			ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen">
										    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
											</div>
										</div>
									</div>
		                        	
									<div class="col-sm-1">
		                        		<select ng-model="ds_mst.PWP_E_HR" ng-change="lfn_input_onChange('ds_mst.PWP_E_HR')" ng-disabled="lfn_input_disabled('ds_mst.PWP_E_HR')"
												validTypes="required" validName="종료시간"  class="form-control" style="width:50%;float:left;border-right:0">
                        					<option ng-repeat="x in ds_code.HR_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        		<select ng-model="ds_mst.PWP_E_MT" ng-change="lfn_input_onChange('ds_mst.PWP_E_MT')" ng-disabled="lfn_input_disabled('ds_mst.PWP_E_MT')"
												validTypes="required" validName="종료분"  class="form-control" style="width:50%;float:left;">
                        					<option ng-repeat="x in ds_code.MT_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
									</div>

									<label class="col-sm-1 control-label">담당자</label>
		                        	<div class="col-sm-1">
										<div class="input-group">
			                                <input ng-model="ds_mst.PWP_CP_NM" readonly validTypes="required" validName="담당자" class="form-control" type="text"/>
			                                <div class="input-group-btn">
			                                    <button ng-click="lfn_btn_onClick('ds_mst.PWP_CP_ID')"	ng-disabled="lfn_btn_disabled('ds_mst.PWP_CP_ID')" ng-show="lfn_btn_show('ds_mst.PWP_CP_ID')" 
			                                    		class="btn btn-primary m-n" ><i class="fa fa-search"></i></button>
			                                </div>
	                            		</div>
		                        	</div>
								</div>
								
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">품목</label>
		                        	<div class="col-sm-1">
		                                <input ng-model="ds_mst.PWP_ITM_CD" readonly validTypes="required" validName="품목" class="form-control" type="text"/>
		                        	</div>
		                        	   
		                        	<div class="col-sm-4">
		                                <input ng-model="ds_mst.PWP_ITM_NM" readonly class="form-control" type="text"/>
		                        	</div>
		                        	
									<label class="col-sm-1 control-label" label-mask>생산공정</label>
									<div class="col-sm-1">
										<select ng-model="ds_mst.PROC_CD" ng-disabled="true" validTypes="required" validName="생산공정" class="form-control">
                        					<option ng-repeat="x in ds_code.PROC_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>
								</div>								

								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label" label-mask>생산수량</label>
									<div class="col-sm-1">
										<input number-format model="ds_mst.PWP_QTY" digit="0" sign="false" change="lfn_input_onChange('ds_mst.PWP_QTY')" ng-disabled="lfn_input_disabled('ds_mst.PWP_QTY')"
												validTypes="required" validName="생산수량"  class="form-control text-right" type="text" />
		                        	</div>

									<label class="col-sm-1 control-label">지시수량</label>
									<div class="col-sm-1">
										<input number-format model="ds_mst.PWO_QTY" digit="0" sign="false" ng-disabled="true"	class="form-control text-right" type="text" />
		                        	</div>

									<label class="col-sm-1 control-label" label-mask>입고창고</label>
									<div class="col-sm-1">
		                        		<select ng-model="ds_mst.PWP_WHIN_WH_CD" ng-change="lfn_input_onChange('ds_mst.PWP_WHIN_WH_CD')" ng-disabled="lfn_input_disabled('ds_mst.PWP_WHIN_WH_CD')"
												validTypes="required" validName="입고창고"  class="form-control">
                        					<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>

									<label class="col-sm-1 control-label" label-mask>출고창고</label>
									<div class="col-sm-1">
		                        		<select ng-model="ds_mst.PWP_WHOUT_WH_CD" ng-change="lfn_input_onChange('ds_mst.PWP_WHOUT_WH_CD')" ng-disabled="lfn_input_disabled('ds_mst.PWP_WHOUT_WH_CD')"
												validTypes="required" validName="출고창고"  class="form-control">
                        					<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>
								</div>								

								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">생산메모</label>
									<div class="col-sm-9">
										<textarea ng-model="ds_mst.PWP_MEMO"  ng-change="lfn_input_onChange('ds_mst.PWP_MEMO')" ng-disabled="lfn_input_disabled('ds_mst.PWP_MEMO')"	kr-input rows="3"></textarea>
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
						</div>
						<div class="ibox-content">
							<div ui-grid="subGrid" style="height:40vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
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
