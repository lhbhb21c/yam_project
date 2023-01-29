<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: USER_ENV_MNG.jsp
	설명	: 사용자설정
	수정일		 	수정자		수정내용
    2021.11.05	이경수		최초작성
--%> 

<head>
    <title>사용자설정</title>

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
    <script type="text/javascript" src="/WEBSERVER/yam/js/bs/USER_ENV_MNG.js?ver=<%=YamConst.VER_BS_JS %>" charset="utf-8"></script>
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
							<h5><i class="fa fa-list-alt"></i>조회조건</h5>
							<div class="ibox-tools">
								<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	ng-show="lfn_btn_show('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i> 조회</button>
								<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"		ng-show="lfn_btn_show('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check-square-o" aria-hidden="true"></i> 저장</button>
								<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close" aria-hidden="true"></i> 닫기</button>
							</div>
						</div>
						
						<div id="ds_cond" class="ibox-content">
							<div class="row">
							
								<div class="col-sm-12 form-group">
									<label class="col-sm-1 control-label">사용자명</label>
									<div class="col-sm-1">
										<input ng-model="ds_cond.USER_NM" class="form-control text-center" type="text" />
		                        	</div>
		                        	
									<label class="col-sm-1 control-label">사용자구분</label>
									<div class="col-sm-1">
		                        		<select ng-model="ds_cond.USER_GUBUN" ng-change="lfn_input_onChange('ds_cond.USER_GUBUN')" ng-disabled="lfn_input_disabled('ds_cond.USER_GUBUN')"
												validName="사용자구분"  class="form-control">
											<option value="">전체</option>
                        					<option ng-repeat="x in ds_code.USER_GUBUN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>
		                        	
									<label class="col-sm-1 control-label">사용여부</label>
									<div class="col-sm-1">
		                        		<select ng-model="ds_cond.USE_YN" ng-change="lfn_input_onChange('ds_cond.USE_YN')" ng-disabled="lfn_input_disabled('ds_cond.USE_YN')"
												validName="사용자여부"  class="form-control">
											<option value="">전체</option>
                        					<option ng-repeat="x in ds_code.USE_YN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                        				</select>
		                        	</div>
								</div>
								
							</div>
						</div>
						
					</div>
				</div>
			</div>
			<!-- //버튼/조회 영역 -->
			

       		<!-- 그리드 영역  -->
        	<div class="row">
				<div class="col-xs-7">
					<div class="ibox">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>사용자목록</h5>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height:72vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-5">
					<div class="ibox">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>기본사항</h5>
						</div>
						<div class="ibox-content" style="height:75vh;">
							<div class="col-sm-12 form-group">   
	                            <label class="col-sm-2 control-label text-right"> 사용자ID</label>                      
	                            <div class="col-sm-5"> 
	                            	<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="text" ng-model="ds_mst.USER_ID" ng-readonly="true" />
	                            </div>
	                        </div>
							<div class="col-sm-12 form-group">
	                            <label class="col-sm-2 control-label text-right"> 사용자명</label>
	                            <div class="col-sm-5"> 
	                            	<input class="form-control text-left ng-pristine ng-valid ng-empty ng-touched" type="text" kr-input ng-model="ds_mst.USER_NM" ng-readonly="true" />
	                            </div>
	                        </div>
                            <div class="col-sm-12 form-group">  
                                <label class="col-sm-2 control-label text-right"> 사용자권한</label>
                                <div class="col-sm-9">
	                                <div class="checkbox checkbox-inline" ng-repeat="x in ds_code.USER_TYPE">
		                                <input type="checkbox" ng-change="lfn_input_onChange('ds_mst.USER_TYPE')" checklist-model="ds_mst.USER_TYPE" checklist-value="x.CODE_CD" id="{{x.CODE_NM}}" />
		                                <label for="{{x.CODE_NM}}">{{x.CODE_NM}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
		                            </div>
		                        </div>
                            </div>
                            <div class="col-sm-12 form-group">
                            	<label class="col-sm-2 control-label">사용자구분</label>
								<div class="col-sm-3">
	                        		<select ng-model="ds_mst.USER_GUBUN" ng-change="lfn_input_onChange('ds_mst.USER_GUBUN')" ng-disabled="lfn_input_disabled('ds_mst.USER_GUBUN')"
											validName="사용자구분"  class="form-control">
                       					<option ng-repeat="x in ds_code.USER_GUBUN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
                       				</select>
	                        	</div>
                        	</div>
                            <div class="col-sm-12 form-group">
								<label class="col-sm-2 control-label">사용여부</label>
								<div class="col-sm-3">
	                        		<div class="input-group">
										<div class="radio radio-inline">
											<input id="use_yn_y" type="radio" value="Y" class="ng-pristine ng-untouched ng-valid ng-not-empty" ng-model="ds_mst.USE_YN" ng-change="lfn_input_onChange('ds_mst.USE_YN')">
											<label for="use_yn_y">사용</label>
										</div>
										<div class="radio radio-inline">
											<input id="use_yn_n" type="radio" value="N" class="ng-pristine ng-untouched ng-valid ng-not-empty" ng-model="ds_mst.USE_YN" ng-change="lfn_input_onChange('ds_mst.USE_YN')">
											<label for="use_yn_n">미사용</label>
										</div>
									</div>
	                        	</div>  
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
