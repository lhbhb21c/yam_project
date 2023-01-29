<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: DO_MNG.jsp
	설명		: 출하지시등록
	수정일		 	수정자		수정내용
    2022.04.20		이진호		최초작성
--%> 

<head>
    <title>직업지시등록</title>
	
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
    <script type="text/javascript" src="/WEBSERVER/yam/js/sm/DO_MNG.js?ver=<%=YamConst.VER_PC_JS %>" charset="utf-8"></script>
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
							<button ng-click="lfn_btn_onClick('NEW')"			ng-disabled="lfn_btn_disabled('NEW')"			ng-show="lfn_btn_show('NEW')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-o" aria-hidden="true"></i> 신규</button>
							<button ng-click="lfn_btn_onClick('CONFIRM')"		ng-disabled="lfn_btn_disabled('CONFIRM')"		ng-show="lfn_btn_show('CONFIRM')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 확정</button>
							<button ng-click="lfn_btn_onClick('CANCEL')"		ng-disabled="lfn_btn_disabled('CANCEL')"		ng-show="lfn_btn_show('CANCEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 취소</button>
							<button ng-click="lfn_btn_onClick('WHOUT')"			ng-disabled="lfn_btn_disabled('WHOUT')"			ng-show="lfn_btn_show('WHOUT')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 출고</button>
							<button ng-click="lfn_btn_onClick('WHOUT_CANCEL')"	ng-disabled="lfn_btn_disabled('WHOUT_CANCEL')"	ng-show="lfn_btn_show('WHOUT_CANCEL')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 출고취소</button>
							<button ng-click="lfn_btn_onClick('CLOSE')"			ng-disabled="false"								ng-show="true"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
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
						<h5><i class="fa fa-list-alt"></i>기본사항12</h5>
						<div class="btn-group pull-right"></div>
					</div>

					<div class="ibox-content">
						<div class="row">

							<div class="col-sm-12 form-group">
								<label class="col-sm-1 control-label" label-mask>출하지시일자</label>
								<div class="col-sm-2">
									<div class="input-group">
										<div moment-picker="ds_mst.DO_DY"  change="lfn_input_onChange('ds_mst.DO_DY')"
											 locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
											<input ng-model="ds_mst.DO_DY" ng-disabled="lfn_input_disabled('ds_mst.DO_DY')" validTypes="required" validName="출고일자"
												   ng-model-options="{ updateOn: 'blur' }" class="form-control ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty align_cen">
											<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
									</div>
								</div>

								<label class="col-sm-1 control-label" label-mask>출하지시구분</label>
								<div class="col-sm-2">
									<select ng-model="ds_mst.DO_GB" ng-change="lfn_input_onChange('ds_mst.DO_GB')" ng-disabled="lfn_input_disabled('ds_mst.DO_GB')"
											validTypes="required" validName="출하지시구분"	class="form-control">
										<option ng-repeat="x in ds_code.DO_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
									</select>
								</div>

								<label class="col-sm-1 control-label" label-mask>창고</label>
								<div class="col-sm-2">
									<select ng-model="ds_mst.WH_CD" ng-change="lfn_input_onChange('ds_mst.WH_CD')" ng-disabled="lfn_input_disabled('ds_mst.WH_CD')"
											validTypes="required" validName="창고"  class="form-control">
										<option ng-repeat="x in ds_code.WH_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
									</select>
								</div>

								<label class="col-sm-1 control-label">출하지시번호</label>
								<div class="col-sm-1">
									<input ng-model="ds_mst.DO_NO" readonly class="form-control text-center" type="text" />
								</div>
							</div>

							<div class="col-sm-12 form-group">
								<label class="col-sm-1 control-label">거래처</label>
								<div class="col-sm-2">
									<div class="input-group">
										<input ng-model="ds_mst.PARTNR_NM" readonly class="form-control" type="text"/>
										<div class="input-group-btn">
											<button ng-click="lfn_btn_onClick('ds_mst.PARTNR_ID')"	ng-disabled="lfn_btn_disabled('ds_mst.PARTNR_ID')" ng-show="lfn_btn_show('ds_mst.PARTNR_ID')"
													class="btn btn-primary m-n" ><i class="fa fa-search"></i></button>
										</div>
									</div>
								</div>
								<label class="col-sm-1 control-label">지시서번호</label>
								<div class="col-sm-2">
									<div class="input-group">
										<input ng-model="ds_mst.OD_NO" readonly class="form-control" type="text"/>
										<div class="input-group-btn">
											<button ng-click="lfn_btn_onClick('ds_mst.OD_ID')"	ng-disabled="lfn_btn_disabled('ds_mst.OD_ID')" ng-show="lfn_btn_show('ds_mst.OD_NO')"
													class="btn btn-primary m-n"><i class="fa fa-search"></i></button>
										</div>
									</div>
								</div>
								<div class="col-sm-1"></div>
								<label class="col-sm-3 control-label">출하상태</label>
								<div class="col-sm-1">
									<select ng-model="ds_mst.DO_ST" ng-disabled="true" class="form-control">
										<option value="00">작성중</option>
										<option ng-repeat="x in ds_code.DO_ST" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
									</select>
								</div>
							</div>

							<div class="col-sm-12 form-group">
								<label class="col-sm-1 control-label">비고</label>
								<div class="col-sm-10">
										<textarea ng-model="ds_mst.DO_REMARKS"  ng-change="lfn_input_onChange('ds_mst.REMARKS')" ng-disabled="lfn_input_disabled('ds_mst.REMARKS')"
												  rows="3"></textarea>
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
						<h5><i class="fa fa-list-alt"></i>출하품목</h5>
						<div class="btn-group pull-right">
							<button ng-click="lfn_btn_onClick('sub.ADD')"		ng-disabled="lfn_btn_disabled('sub.ADD')"		ng-show="lfn_btn_show('sub.ADD')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-plus" aria-hidden="true"></i> 추가</button>
							<button ng-click="lfn_btn_onClick('sub.DEL')"		ng-disabled="lfn_btn_disabled('sub.DEL')"		ng-show="lfn_btn_show('sub.DEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-minus" aria-hidden="true"></i> 삭제</button>
						</div>
					</div>
					<div class="ibox-content">
						<div ui-grid="subGrid" style="height:60vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
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
