<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: PARTNR_MNG.jsp
	설명	: 거래처관리 - 거래처등록
	수정일		 	수정자		수정내용
   2022.02.27		zno
--%> 

<head>
    <title>거래처관리</title>

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
	<script type="text/javascript" src="/WEBSERVER/we_std/js/base/PARTNR_MNG.js?ver=<%=StdConst.VER_STD_BASE_JS %>" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->

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
								<button ng-click="lfn_btn_onClick('REG')"			ng-disabled="lfn_btn_disabled('REG')"			ng-show="lfn_btn_show('REG')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-file-text-o"></i> 등록</button>
								<button ng-click="lfn_btn_onClick('UPD')"			ng-disabled="lfn_btn_disabled('UPD')"			ng-show="lfn_btn_show('UPD')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-edit"></i> 수정</button>
		                        <button ng-click="lfn_btn_onClick('CLOSE')"			ng-disabled="false"								ng-show="true"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
							</div>
						</div>
						
						<div id="ds_data" class="ibox-content">
						
	                        <div class="col-sm-12 form-group"> 

                                <label class="col-sm-1 control-label">업체명</label>
	                        	<div class="col-sm-3">
	                        		<input ng-model="ds_cond.PARTNR_NM"	kr-input	class="form-control" type="text" />
	                        	</div>

                                <label class="col-sm-1 control-label">업체구분</label>
	                        	<div class="col-sm-1">
	                        		<select ng-model="ds_cond.PARTNR_GB"	class="form-control">
	                        			<option value="">전체</option>
	                        			<option ng-repeat="x in ds_code.PARTNR_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
	                        		</select>
	                        	</div>

                                <label class="col-sm-1 control-label">사용가능</label>
	                        	<div class="col-sm-1">
	                        		<select ng-model="ds_cond.USE_YN"	class="form-control">
	                        			<option value="">전체</option>
	                        			<option ng-repeat="x in ds_code.USE_YN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
	                        		</select>
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
							<h5><i class="fa fa-list-alt"></i>업체 목록</h5>
							<div class="btn-group pull-right"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height: 80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //마스터 그리드 영역  -->
			
			
			<!-- 업체정보 작성 모달영력 --> 
			<div id="editModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-fullsize" role="document" style="width:800px;">
					<div class="modal-content modal-fullsize" >
						<div class="modal-body">

							<div class="ibox">

								<div class="ibox-title">
									<h5><i class="fa fa-list-alt"></i>&nbsp;업체정보</h5>
									<div class="ibox-tools">
										<button ng-click="lfn_btn_onClick('SAVE')"				ng-disabled="lfn_btn_disabled('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 저장</button>
				                        <button ng-click="lfn_btn_onClick('edit.CLOSE')"		ng-disabled="false"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
									</div>
								</div>
								
				          		<!-- 에디터 영역 -->
								<div id="ds_mst" class="ibox-content">
									<div class="row row-full-height">

										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">파트너ID</label>
											<div class="col-sm-2">
												<input ng-model="ds_mst.PARTNR_ID"	ng-disabled="lfn_input_disabled('ds_mst.PARTNR_ID')"	ng-change="lfn_input_onChange('ds_mst.PARTNR_ID')" readonly class="form-control text-center" type="text"/>
											</div>
											<label class="col-sm-4 control-label">소속</label>
											<div class="col-sm-4">
												<select ng-model="ds_mst.SECTR_ID" ng-change="lfn_input_onChange('ds_mst.SECTR_ID')" ng-disabled="lfn_input_disabled('ds_mst.SECTR_ID')"
														validTypes="required" 	validName="소속"  class="form-control">
													<option ng-repeat="x in ds_code.SECTR_ID" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
										</div>

										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label" label-mask>업체명</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.PARTNR_NM"	ng-disabled="lfn_input_disabled('ds_mst.PARTNR_NM')"	ng-change="lfn_input_onChange('ds_mst.PARTNR_NM')"	kr-input	validTypes="required"	validName="업체명"		class="form-control" type="text"/>
											</div>
											<label class="col-sm-2 control-label">업체약어</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.PARTNR_ABBR_NM"	ng-disabled="lfn_input_disabled('ds_mst.PARTNR_ABBR_NM')"	ng-change="lfn_input_onChange('ds_mst.PARTNR_ABBR_NM')"	kr-input	validName="업체약어명"		class="form-control" type="text"/>
											</div>
			                            </div>

										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label" label-mask>대표자명</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.CEO" 		ng-disabled="lfn_input_disabled('ds_mst.CEO')"		ng-change="lfn_input_onChange('ds_mst.CEO')"	kr-input	validTypes="required"	validName="대표자"		class="form-control text-center" type="text"/>
											</div>
			                            </div>
									
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label" label-mask>사업자번호</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.BLNO" 		ng-disabled="lfn_input_disabled('ds_mst.BLNO')"		ng-change="lfn_input_onChange('ds_mst.BLNO')"		validTypes="required"	validName="사업자번호"	class="form-control text-center" type="text"/>
											</div>
											<label class="col-sm-2 control-label">거래처코드</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.PARTNR_CD" 	ng-disabled="lfn_input_disabled('ds_mst.PARTNR_CD')"	ng-change="lfn_input_onChange('ds_mst.PARTNR_CD')"	class="form-control text-center" type="text"/>
											</div>
										</div>

										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label" label-mask>구분</label>
											<div class="col-sm-4">
												<select ng-model="ds_mst.PARTNR_GB"		ng-disabled="lfn_input_disabled('ds_mst.PARTNR_GB')"		ng-change="lfn_input_onChange('ds_mst.PARTNR_GB')"		validTypes="required"	validName="구분"		class="form-control text-center">
													<option ng-repeat="x in ds_code.PARTNR_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
											<label class="col-sm-2 control-label">유형</label>
											<div class="col-sm-4">
												<select ng-model="ds_mst.PARTNR_TY"		ng-disabled="lfn_input_disabled('ds_mst.PARTNR_TY')"		ng-change="lfn_input_onChange('ds_mst.PARTNR_TY')"		validName="업형"		class="form-control text-center">
													<option ng-repeat="x in ds_code.PARTNR_TY" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
										</div>
			                            
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">업태</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.BIZTY" 		ng-disabled="lfn_input_disabled('ds_mst.BIZTY')"		ng-change="lfn_input_onChange('ds_mst.BIZTY')"		kr-input	class="form-control" type="text"/>
											</div>
											<label class="col-sm-2 control-label">업종</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.BIZGB" 		ng-disabled="lfn_input_disabled('ds_mst.BIZGB')"		ng-change="lfn_input_onChange('ds_mst.BIZGB')"		kr-input	class="form-control" type="text"/>
											</div>
			                            </div>

										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">전화번호</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.TEL" 		ng-disabled="lfn_input_disabled('ds_mst.TEL')"		ng-change="lfn_input_onChange('ds_mst.TEL')"		class="form-control" type="text"/>
											</div>
											<label class="col-sm-2 control-label">팩스번호</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.FAX" 		ng-disabled="lfn_input_disabled('ds_mst.FAX')"		ng-change="lfn_input_onChange('ds_mst.FAX')"		class="form-control" type="text"/>
											</div>
										</div>

										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">주소</label>
											<div class="col-sm-10">
												<input ng-model="ds_mst.ADDR1" 		ng-disabled="lfn_input_disabled('ds_mst.ADDR1')"		ng-change="lfn_input_onChange('ds_mst.ADDR1')"		kr-input	class="form-control" type="text"/>
											</div>
										</div>

										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">상세주소</label>
											<div class="col-sm-10">
												<input ng-model="ds_mst.ADDR2" 		ng-disabled="lfn_input_disabled('ds_mst.ADDR2')"		ng-change="lfn_input_onChange('ds_mst.ADDR2')"		kr-input	class="form-control" type="text"/>
											</div>
										</div>


										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">담당자</label>
											<div class="col-sm-2">
												<input ng-model="ds_mst.CP_NM" 		ng-disabled="lfn_input_disabled('ds_mst.CP_NM')"		ng-change="lfn_input_onChange('ds_mst.CP_NM')"		readonly	class="form-control" type="text"/>
											</div>
											<div class="col-sm-2">
												<div class="btn-group">
							                        <button ng-click="lfn_btn_onClick('ds_mst.POP_CP')"		ng-disabled="lfn_btn_disabled('ds_mst.POP_CP')"		ng-show="lfn_btn_show('ds_mst.POP_CP')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i></button>
							                        <button ng-click="lfn_btn_onClick('ds_mst.CLR_CP')"		ng-disabled="lfn_btn_disabled('ds_mst.CLR_CP')"		ng-show="lfn_btn_show('ds_mst.CLR_CP')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-close"></i></button>
												</div>											
											</div>
											<label class="col-sm-2 control-label">사용여부</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.USE_YN" ng-change="lfn_input_onChange('ds_mst.USE_YN')" ng-disabled="lfn_input_disabled('ds_mst.USE_YN')"
														validName="사용자여부"  class="form-control">
													<option value="">전체</option>
													<option ng-repeat="x in ds_code.USE_YN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
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
			<!-- //업체정보 작성 모달영력 --> 

			
       </div>
       <!-- //block-ui 영역 -->
       
	</div>
	<!-- //application, controller 영역 -->
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->


</body>
