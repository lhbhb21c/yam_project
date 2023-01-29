<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<%--
	파일명	: CMMN_CODE_MNG.jsp
	설명	: 공통코드관리
		
	수정일 		수정자		수정내용
	2021.12.20	WEVE	최초작성
--%> 

<!DOCTYPE HTML>
<html>

<head>
    <title>공통코드관리</title>

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
	<script type="text/javascript" src="/WEBSERVER/we_std/js/base/CODE_MNG.js?ver=<%=StdConst.VER_STD_BASE_JS %>" charset="utf-8"></script>
	<!-- ====================================================================================================================================================== -->
    
</head>

<body id="in_frame" class="scroll">

	<!-- application, controller 영역 -->
	<div ng-app="mstApp" ng-controller="mstCtl" ng-init="load();" style="height:100%; background-color:white;">
		
		<!-- block-ui 영역 -->
		<div block-ui="main" class="block-ui-main">
		
			<!-- top버튼 영역 -->
			<div class="row">
				<div class="col-lg-12 btn-box">
					<div class="form-group" style="width:500px;" ng-show="lfn_input_show('ds_cond.SECTR')">
						<label class="col-sm-1 control-label">섹터</label>   
						<div class="col-sm-6">
	                          	<select ng-model="ds_cond.SECTR_ID"	ng-change="lfn_input_onChange('ds_cond.SECTR_ID')"	lass="form-control">
	                          		<option value="">공통</option>
								<option ng-repeat="x in ds_code.SECTR_ID" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
							</select>
						</div>
					</div>
					<div class="btn-group pull-right">
						<p>
							<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i>조회</button>
							<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="lfn_btn_disabled('CLOSE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i>닫기</button>
						</p>
					</div>
				</div>
			</div>
			<!-- //top버튼 영역 -->

			<!-- 데이터 영역 -->
			<div class="row row-full-height">
			
				<!-- 대분류 영역 -->
				<div class="col-xs-4">
				
		    		<div class="ibox-title">
		        		<h5><i class="fa fa-list-alt"></i>대분류</h5>
		        	</div>
		        	
					<!-- 대분류.데이타 영역 -->
		        	<div class="ibox-content">

		        		<div ui-grid="mst1Grid" style="height:300px;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
						
						<div class="btn-group rt">
							<button ng-click="lfn_btn_onClick('ds_mst1.NEW')"	ng-disabled="lfn_btn_disabled('ds_mst1.NEW')"	class="btn btn-primary m-n" type="button">신규</button>
							<button ng-click="lfn_btn_onClick('ds_mst1.SAVE')"	ng-disabled="lfn_btn_disabled('ds_mst1.SAVE')"	class="btn btn-primary m-n" type="button">저장</button>
							<button ng-click="lfn_btn_onClick('ds_mst1.DEL')"	ng-disabled="lfn_btn_disabled('ds_mst1.DEL')"	class="btn btn-primary m-n" type="button">삭제</button>
						</div>
						
						<!-- 대분류.에디터 영역 -->
						<div id="ds_mst1" class="row">
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label" label-mask>공통코드</label>
								<div class="col-sm-7">
									<input ng-model="ds_mst1.CD_KEY"	ng-disabled="lfn_input_disabled('ds_mst1.CD_KEY')"	ng-change="lfn_input_onChange('ds_mst1.CD_KEY')"	validTypes="required"	validName="공통코드"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
								<div class="col-sm-2">
									<input ng-model="ds_mst1.CD_SN"		ng-disabled="lfn_input_disabled('ds_mst1.CD_SN')"		ng-change="lfn_input_onChange('ds_mst1.CD_SN')"		class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label" label-mask>공통코드명</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst1.CD_NM"	ng-disabled="lfn_input_disabled('ds_mst1.CD_NM')"	ng-change="lfn_input_onChange('ds_mst1.CD_NM')"	kr-input	validTypes="required"	validName="공통코드명"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
	
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용여부</label>
								<div class="col-sm-4">
									<div class="input-group">
										<div class="radio radio-inline">
											<input ng-model="ds_mst1.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst1.USE_YN')"	ng-change="lfn_input_onChange('ds_mst1.USE_YN')"	value="Y" type="radio" >
											<label>사용</label>
										</div>
										<div class="radio radio-inline">
											<input ng-model="ds_mst1.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst1.USE_YN')"	ng-change="lfn_input_onChange('ds_mst1.USE_YN')"	value="N" type="radio" >
											<label>미사용</label>
										</div>
									</div>
								</div>
								<label class="col-sm-2 control-label">코드유형</label>
								<div class="col-sm-3">
									<select ng-model="ds_mst1.CD_TY"	ng-disabled="lfn_input_disabled('ds_mst1.CD_TY')"	ng-change="lfn_input_onChange('ds_mst1.CD_TY')"	class="form-control">
										<option ng-repeat="x in ds_code.CD_TY" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
									</select>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">설명</label>
								<div class="col-sm-9">
									<textarea ng-model="ds_mst1.CD_EXPL"	ng-disabled="lfn_input_disabled('ds_mst1.CD_EXPL')"	ng-change="lfn_input_onChange('ds_mst1.CD_EXPL')"	kr-input	rows="3"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" ></textarea>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 1</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst1.USRDF1"	ng-disabled="lfn_input_disabled('ds_mst1.USRDF1')"	ng-change="lfn_input_onChange('ds_mst1.USRDF1')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 2</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst1.USRDF2"	ng-disabled="lfn_input_disabled('ds_mst1.USRDF2')"	ng-change="lfn_input_onChange('ds_mst1.USRDF2')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 3</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst1.USRDF3"	ng-disabled="lfn_input_disabled('ds_mst1.USRDF3')"	ng-change="lfn_input_onChange('ds_mst1.USRDF3')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 4</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst1.USRDF4"	ng-disabled="lfn_input_disabled('ds_mst1.USRDF4')"	ng-change="lfn_input_onChange('ds_mst1.USRDF4')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 5</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst1.USRDF5"	ng-disabled="lfn_input_disabled('ds_mst1.USRDF5')"	ng-change="lfn_input_onChange('ds_mst1.USRDF5')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
						</div>
						<!-- //대분류.에디터 영역 -->

		        	</div>
					<!-- //대분류.데이타 영역 -->
		        	
				</div>
				<!-- //대분류 영역 -->
				
				
				<!-- 중분류 영역 -->
				<div class="col-xs-4">
				
		    		<div class="ibox-title">
		        		<h5><i class="fa fa-list-alt"></i>중분류</h5>
		        	</div>
		        	
					<!-- 중분류.데이타 영역 -->
		        	<div class="ibox-content">

		        		<div ui-grid="mst2Grid" style="height:300px;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
						
						<div class="btn-group rt">
							<button ng-click="lfn_btn_onClick('ds_mst2.NEW')"	ng-disabled="lfn_btn_disabled('ds_mst2.NEW')"	class="btn btn-primary m-n" type="button">신규</button>
							<button ng-click="lfn_btn_onClick('ds_mst2.SAVE')"	ng-disabled="lfn_btn_disabled('ds_mst2.SAVE')"	class="btn btn-primary m-n" type="button">저장</button>
							<button ng-click="lfn_btn_onClick('ds_mst2.DEL')"	ng-disabled="lfn_btn_disabled('ds_mst2.DEL')"	class="btn btn-primary m-n" type="button">삭제</button>
						</div>
						
						<!-- 중분류.에디터 영역 -->
						<div id="ds_mst2" class="row">
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label" label-mask>공통코드</label>
								<div class="col-sm-7">
									<input ng-model="ds_mst2.CD_KEY"	ng-disabled="lfn_input_disabled('ds_mst2.CD_KEY')"	ng-change="lfn_input_onChange('ds_mst2.CD_KEY')"	validTypes="required"	validName="공통코드"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
								<div class="col-sm-2">
									<input ng-model="ds_mst2.CD_SN"		ng-disabled="lfn_input_disabled('ds_mst2.CD_SN')"		ng-change="lfn_input_onChange('ds_mst2.CD_SN')"		class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label" label-mask>공통코드명</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst2.CD_NM"	ng-disabled="lfn_input_disabled('ds_mst2.CD_NM')"	ng-change="lfn_input_onChange('ds_mst2.CD_NM')"	kr-input	validTypes="required"	validName="공통코드명"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
	
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용여부</label>
								<div class="col-sm-9">
									<div class="input-group">
										<div class="radio radio-inline">
											<input ng-model="ds_mst2.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst2.USE_YN')"	ng-change="lfn_input_onChange('ds_mst2.USE_YN')"	value="Y" type="radio" >
											<label>사용</label>
										</div>
										<div class="radio radio-inline">
											<input ng-model="ds_mst2.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst2.USE_YN')"	ng-change="lfn_input_onChange('ds_mst2.USE_YN')"	value="N" type="radio" >
											<label>미사용</label>
										</div>
									</div>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">설명</label>
								<div class="col-sm-9">
									<textarea ng-model="ds_mst2.CD_EXPL"	ng-disabled="lfn_input_disabled('ds_mst2.CD_EXPL')"	ng-change="lfn_input_onChange('ds_mst2.CD_EXPL')"	kr-input	rows="3"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" ></textarea>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 1</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst2.USRDF1"	ng-disabled="lfn_input_disabled('ds_mst2.USRDF1')"	ng-change="lfn_input_onChange('ds_mst2.USRDF1')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 2</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst2.USRDF2"	ng-disabled="lfn_input_disabled('ds_mst2.USRDF2')"	ng-change="lfn_input_onChange('ds_mst2.USRDF2')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 3</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst2.USRDF3"	ng-disabled="lfn_input_disabled('ds_mst2.USRDF3')"	ng-change="lfn_input_onChange('ds_mst2.USRDF3')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 4</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst2.USRDF4"	ng-disabled="lfn_input_disabled('ds_mst2.USRDF4')"	ng-change="lfn_input_onChange('ds_mst2.USRDF4')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 5</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst2.USRDF5"	ng-disabled="lfn_input_disabled('ds_mst2.USRDF5')"	ng-change="lfn_input_onChange('ds_mst2.USRDF5')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
						</div>
						<!-- //중분류.에디터 영역 -->

		        	</div>
					<!-- //중분류.데이타 영역 -->
				
				</div>
				<!-- //중분류 영역 -->
				
				
				<!-- 소분류 영역 -->
				<div class="col-xs-4">
				
		    		<div class="ibox-title">
		        		<h5><i class="fa fa-list-alt"></i>소분류</h5>
		        	</div>
		        	
					<!-- 소분류.데이타 영역 -->
		        	<div class="ibox-content">

		        		<div ui-grid="mst3Grid" style="height:300px;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
						</div>
						
						<div class="btn-group rt">
							<button ng-click="lfn_btn_onClick('ds_mst3.NEW')"	ng-disabled="lfn_btn_disabled('ds_mst3.NEW')"	class="btn btn-primary m-n" type="button">신규</button>
							<button ng-click="lfn_btn_onClick('ds_mst3.SAVE')"	ng-disabled="lfn_btn_disabled('ds_mst3.SAVE')"	class="btn btn-primary m-n" type="button">저장</button>
							<button ng-click="lfn_btn_onClick('ds_mst3.DEL')"	ng-disabled="lfn_btn_disabled('ds_mst3.DEL')"	class="btn btn-primary m-n" type="button">삭제</button>
						</div>
						
						<!-- 소분류.에디터 영역 -->
						<div id="ds_mst3" class="row">
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label" label-mask>공통코드</label>
								<div class="col-sm-7">
									<input ng-model="ds_mst3.CD_KEY"	ng-disabled="lfn_input_disabled('ds_mst3.CD_KEY')"	ng-change="lfn_input_onChange('ds_mst3.CD_KEY')"	validTypes="required"	validName="공통코드"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
								<div class="col-sm-2">
									<input ng-model="ds_mst3.CD_SN"		ng-disabled="lfn_input_disabled('ds_mst3.CD_SN')"		ng-change="lfn_input_onChange('ds_mst3.CD_SN')"		class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label" label-mask>공통코드명</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst3.CD_NM"	ng-disabled="lfn_input_disabled('ds_mst3.CD_NM')"	ng-change="lfn_input_onChange('ds_mst3.CD_NM')"	kr-input	validTypes="required"	validName="공통코드명"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
	
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용여부</label>
								<div class="col-sm-9">
									<div class="input-group">
										<div class="radio radio-inline">
											<input ng-model="ds_mst3.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst3.USE_YN')"	ng-change="lfn_input_onChange('ds_mst3.USE_YN')"	value="Y" type="radio" >
											<label>사용</label>
										</div>
										<div class="radio radio-inline">
											<input ng-model="ds_mst3.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst3.USE_YN')"	ng-change="lfn_input_onChange('ds_mst3.USE_YN')"	value="N" type="radio" >
											<label>미사용</label>
										</div>
									</div>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">설명</label>
								<div class="col-sm-9">
									<textarea ng-model="ds_mst3.CD_EXPL"	ng-disabled="lfn_input_disabled('ds_mst3.CD_EXPL')"	ng-change="lfn_input_onChange('ds_mst3.CD_EXPL')"	kr-input	rows="3"	class="form-control ng-pristine ng-untouched ng-valid ng-empty" ></textarea>
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 1</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst3.USRDF1"	ng-disabled="lfn_input_disabled('ds_mst3.USRDF1')"	ng-change="lfn_input_onChange('ds_mst3.USRDF1')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 2</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst3.USRDF2"	ng-disabled="lfn_input_disabled('ds_mst3.USRDF2')"	ng-change="lfn_input_onChange('ds_mst3.USRDF2')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 3</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst3.USRDF3"	ng-disabled="lfn_input_disabled('ds_mst3.USRDF3')"	ng-change="lfn_input_onChange('ds_mst3.USRDF3')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 4</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst3.USRDF4"	ng-disabled="lfn_input_disabled('ds_mst3.USRDF4')"	ng-change="lfn_input_onChange('ds_mst3.USRDF4')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
							
							<div class="col-sm-12 form-group">
								<label class="col-sm-3 control-label">사용자정의 5</label>
								<div class="col-sm-9">
									<input ng-model="ds_mst3.USRDF5"	ng-disabled="lfn_input_disabled('ds_mst3.USRDF5')"	ng-change="lfn_input_onChange('ds_mst3.USRDF5')"	kr-input	class="form-control ng-pristine ng-untouched ng-valid ng-empty" type="text" />
								</div>
							</div>
						</div>
						<!-- //소분류.에디터 영역 -->

		        	</div>
					<!-- //소분류.데이타 영역 -->				
				</div>
				<!-- //소분류 영역 -->
				
			</div>
			<!-- //데이터 영역 -->

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
