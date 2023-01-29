<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<%--
	파일명	: BBS_NOTI_MNG.jsp
	설명	: 공지사항관리
		
	수정일 		수정자		수정내용
	2021.12.09	염국선		최초작성
--%> 

<!DOCTYPE HTML>
<html>
<head>
    <title>공지사항</title>

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
	<script type="text/javascript" src="/WEBSERVER/we_std/js/base/BBS_NOTI_MNG.js?ver=<%=StdConst.VER_STD_BASE_JS %>" charset="utf-8"></script>
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
								<button ng-click="lfn_btn_onClick('NEW')"		ng-disabled="lfn_btn_disabled('NEW')"		ng-show="lfn_btn_show('NEW')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-o"></i> 신규</button>
								<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"		ng-show="lfn_btn_show('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 저장</button>
								<button ng-click="lfn_btn_onClick('DEL')"		ng-disabled="lfn_btn_disabled('DEL')"		ng-show="lfn_btn_show('DEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-trash"></i> 삭제</button>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
						
						<div class="ibox-content row" style="overflow:visible;">
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">게시일</label>
	                        	<div class="col-sm-3">
                                    <div class="input-group">
										<div moment-picker="ds_cond.DY_FR" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
									    	<input ng-model="ds_cond.DY_FR" ng-model-options="{ updateOn: 'blur' }"	class="form-control text-center" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
										<span class="input-group-addon dash">-</span>
										<div moment-picker="ds_cond.DY_TO" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
									    	<input ng-model="ds_cond.DY_TO" ng-model-options="{ updateOn: 'blur' }"	class="form-control text-center" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
                                    </div>
	                        	</div>	      
	                        	
	                        </div>
						</div>

					</div>
				</div>
			</div>
			<!-- //버튼/조회 영역 -->
			
       		<!-- 마스터 영역  -->
        	<div class="row row-full-height">

	       		<!-- 마스터 그리드 영역  -->
				<div class="col-lg-7">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>공지목록</h5>
							<div class="btn-group pull-right"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height: 80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
	       		<!-- //마스터 그리드 영역  -->

	       		<!-- 마스터 에디터 영역  -->
				<div class="col-lg-5">
					
		       		<!-- 마스터 에디터.공지내용 영역  -->
					<div class="ibox float-e-margins">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i> 공지사항</h5>
							<div class="ibox-tools">
								<a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
							</div>
						</div>
						
						<div id="ds_mst" class="ibox-content form-wsearch">
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label" label-mask>공지범위</label>
								<div class="col-sm-2">
	                                <div class="checkbox checkbox-inline">
										<input ng-model="ds_mst.ALL_NOTI_YN" ng-disabled="lfn_input_disabled('ds_mst.ALL_NOTI_YN')" ng-change="lfn_input_onChange('ds_mst.ALL_NOTI_YN')" ng-true-value="'Y'" ng-false-value="'N'" type="checkbox" />
		                                <label style="color:blue;">전체&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
									</div>
								</div>
								<div class="col-sm-8">
	                                <div class="checkbox checkbox-inline" ng-repeat="x in ds_code.NOTI_SCOPE_CD">
		                                <input checklist-model="ds_mst.NOTI_SCOPE_LIST" ng-disabled="lfn_input_disabled('ds_mst.NOTI_SCOPE_LIST')" ng-change="lfn_input_onChange('ds_mst.NOTI_SCOPE_LIST')" checklist-value="x.CODE_CD" type="checkbox" />
		                                <label>{{x.CODE_NM}}</label>
		                            </div>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label" label-mask>제목</label>
								<div class="col-sm-10">
									<input ng-model="ds_mst.SUBJCT" ng-disabled="lfn_input_disabled('ds_mst.SUBJCT')" ng-change="lfn_input_onChange('ds_mst.SUBJCT')" kr-cell validTypes="required" validName="제목" class="form-control" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label">등록자</label>
								<div class="col-sm-4">
									<input ng-model="ds_mst.REG_NM" disabled="disabled" class="form-control text-center" type="text" />
								</div>

								<label class="col-sm-2 control-label">등록일시</label>
								<div class="col-sm-4">
									<input ng-model="ds_mst.REG_DT" disabled="disabled" class="form-control text-center" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label" label-mask>게시자</label>
								<div class="col-sm-4">
									<input ng-model="ds_mst.NOTI_CP_NM" ng-disabled="lfn_input_disabled('ds_mst.NOTI_CP_NM')" ng-change="lfn_input_onChange('ds_mst.NOTI_CP_NM')" kr-input validTypes="required" validName="게시자" class="form-control" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label" label-mask>게시시작일</label>
								<div class="col-sm-4">
									<div class="input-group">
										<div moment-picker="ds_mst.NOTI_S_DY" change="lfn_input_onChange('ds_mst.NOTI_S_DY')" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
									    	<input ng-model="ds_mst.NOTI_S_DY" ng-model-options="{ updateOn: 'blur' }"	validTypes="required" validName="게시시작일" class="form-control text-center" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
									</div>
								</div>
								
								<label class="col-sm-2 control-label" label-mask>게시종료일</label>
								<div class="col-sm-4">
									<div class="input-group">
										<div moment-picker="ds_mst.NOTI_E_DY" change="lfn_input_onChange('ds_mst.NOTI_E_DY')" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
									    	<input ng-model="ds_mst.NOTI_E_DY" ng-model-options="{ updateOn: 'blur' }"	validTypes="required" validName="게시종료일" class="form-control text-center" >
									    	<span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
										</div>
									</div>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label" label-mask>게시여부</label>
								<div class="col-sm-10">
									<div class="radio radio-inline">
										<input ng-model="ds_mst.USE_YN" ng-disabled="lfn_input_disabled('ds_mst.USE_YN')" ng-change="lfn_input_onChange('ds_mst.USE_YN')" value="Y" type="radio" /><label>사용</label>
									</div>
									<div class="radio radio-inline">
										<input ng-model="ds_mst.USE_YN" ng-disabled="lfn_input_disabled('ds_mst.USE_YN')" ng-change="lfn_input_onChange('ds_mst.USE_YN')" value="N" type="radio" /><label>미사용</label>
									</div>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label" label-mask>내용</label>
								<div class="col-sm-10">
									<textarea ng-model="ds_mst.CN" ng-disabled="lfn_input_disabled('ds_mst.CN')" ng-change="lfn_input_onChange('ds_mst.CN')" kr-cell validTypes="required" validName="내용"  rows="15" class="form-control"></textarea>
								</div>
							</div>
						</div>
					</div>
		       		<!-- //마스터 에디터.공지내용 영역  -->
		       		
		       		<!-- 마스터 에디터.공지첨부 영역  -->
		       		<div class="ibox">
		       			<div class="ibox-title">
		       				<h5><i class="fa fa-list-alt"></i> 첨부파일</h5>
							<div class="ibox-tools">
								<a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
							</div>
		       			</div>
		       			<div class="ibox-content">
							<div attach-list="ds_at" template="normal" style="height:176px; border:1px solid #6A92BD; padding:10px; line-height:120%; overflow-y:auto"></div>
		       			</div>
		       		</div>
		       		<!-- //마스터 에디터.공지첨부 영역  -->

				</div>
	       		<!-- //마스터 에디터 영역  -->

			</div>
       		<!-- //마스터 영역  -->

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
