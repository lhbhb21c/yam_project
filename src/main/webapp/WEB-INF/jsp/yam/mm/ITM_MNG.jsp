<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: ITM_MNG.jsp
	설명	: 품목마스터 등록
	수정일		 	수정자		수정내용
    2021.10.18	정래훈		최초작성
--%> 

<head>
    <title>품목등록</title>

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
    <script type="text/javascript" src="/WEBSERVER/yam/js/mm/ITM_MNG.js?ver=<%=YamConst.VER_MM_JS %>" charset="utf-8"></script>
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
						
						<div class="ibox-content row" style="overflow:visible;">
						
	                        <div class="col-sm-12 form-group">
	                        
                                <label class="col-sm-1 control-label">품목</label>
	                        	<div class="col-sm-1">
		                        	<input ng-model="ds_cond.ITM_CD"	kr-input	class="form-control" type="text" />
	                        	</div>	                         
	                        	
                                <label class="col-sm-1 control-label">품목구분</label>
	                        	<div class="col-sm-1">
	                        		<multicombo multi-combo sel-model="ds_cond.ITM_GBS" list-model="ds_code.ITM_GB"></multicombo>
	                        	</div>	      
	                        	
	                        	<label class="col-sm-1 control-label">품목그룹</label>
	                        	<div class="col-sm-1">
	                        		<multicombo multi-combo sel-model="ds_cond.ITM_GRPS" list-model="ds_code.ITM_GRP"></multicombo>
	                        	</div>	
	                        		
	                        	 <label class="col-sm-1 control-label">사용구분</label>
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
							<h5><i class="fa fa-list-alt"></i>품목 목록</h5>
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
									<h5><i class="fa fa-list-alt"></i>품목등록</h5>
									<div class="ibox-tools">
										<button ng-click="lfn_btn_onClick('SAVE')"			ng-disabled="lfn_btn_disabled('SAVE')"			ng-show="lfn_btn_show('SAVE')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 저장</button>
										<button ng-click="lfn_btn_onClick('edit.CLOSE')"	ng-disabled="false"								ng-show="true"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
									</div>
								</div>
								
				          		<!-- 에디터 영역 -->
								<div id="ds_mst" class="ibox-content">
									<div class="row row-full-height">
										<div class="col-sm-12 form-group">

											<label class="col-sm-2 control-label" label-mask>품목그룹</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_GRP"	ng-disabled="lfn_input_disabled('ds_mst.ITM_GRP')"	ng-change="lfn_input_onChange('ds_mst.ITM_GRP')" validTypes="required"	validName="품목그룹"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_GRP" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" >재고수불</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.SIO_MNG_GB"	ng-disabled="lfn_input_disabled('ds_mst.SIO_MNG_GB')"	ng-change="lfn_input_onChange('ds_mst.SIO_MNG_GB')"  class="form-control">
													<option ng-repeat="x in ds_code.SIO_MNG_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" label-mask>사용구분</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst.USE_YN')"	ng-change="lfn_input_onChange('ds_mst.USE_YN')"	validName="사용구분"	class="form-control">
													<option ng-repeat="x in ds_code.USE_YN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
										</div>

										<div class="col-sm-12 form-group">

											<label class="col-sm-2 control-label" label-mask>대분류</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_LCAT"	ng-disabled="lfn_input_disabled('ds_mst.ITM_LCAT')"	ng-change="lfn_input_onChange('ds_mst.ITM_LCAT')" validTypes="required"	validName="대분류"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_LCAT" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" label-mask>중분류</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_MCAT"	ng-disabled="lfn_input_disabled('ds_mst.ITM_MCAT')"	ng-change="lfn_input_onChange('ds_mst.ITM_MCAT')" validTypes="required"	validName="중분류"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_MCAT_F" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" label-mask>소분류</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_SCAT"	ng-disabled="lfn_input_disabled('ds_mst.ITM_SCAT')"	ng-change="lfn_input_onChange('ds_mst.ITM_SCAT')" validTypes="required"	validName="소분류"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_SCAT_F" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

										</div>

										<div class="col-sm-12 form-group">

											<label class="col-sm-2 control-label" label-mask>상태</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_TY1"	ng-disabled="lfn_input_disabled('ds_mst.ITM_TY1')"	ng-change="lfn_input_onChange('ds_mst.ITM_TY1')" validTypes="required"	validName="상태"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_TY1" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" label-mask>원산지</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_TY2"	ng-disabled="lfn_input_disabled('ds_mst.ITM_TY2')"	ng-change="lfn_input_onChange('ds_mst.ITM_TY2')" validTypes="required"	validName="원산지"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_TY2" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" label-mask>사이즈</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_TY3"	ng-disabled="lfn_input_disabled('ds_mst.ITM_TY3')"	ng-change="lfn_input_onChange('ds_mst.ITM_TY3')" validTypes="required"	validName="사이즈"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_TY3" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

										</div>

										<div class="col-sm-12 form-group">

											<label class="col-sm-2 control-label" label-mask>포장규격</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_TY4"	ng-disabled="lfn_input_disabled('ds_mst.ITM_TY4')"	ng-change="lfn_input_onChange('ds_mst.ITM_TY4')" validTypes="required"	validName="포장규격"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_TY4" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" label-mask>구성</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.ITM_TY5"	ng-disabled="lfn_input_disabled('ds_mst.ITM_TY5')"	ng-change="lfn_input_onChange('ds_mst.ITM_TY5')" validTypes="required"	validName="구성"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_TY5" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label" label-mask>공정</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.PROC_CD"	ng-disabled="lfn_input_disabled('ds_mst.PROC_CD')"	ng-change="lfn_input_onChange('ds_mst.PROC_CD')" validTypes="required"	validName="공정코드"	class="form-control">
													<option ng-repeat="x in ds_code.PROC_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
										</div>

										<!-- 구분선 -->
										<div  class="col-sm-12 form-group" style="margin: 10px 0 "></div>


										<div class="col-sm-12 form-group">

											<label class="col-sm-2 control-label" label-mask>품목코드</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.ITM_CD"	ng-disabled="true"	ng-change="lfn_input_onChange('ds_mst.ITM_CD')"	validTypes="required"	validName="품목코드"	class="form-control" type="text" />
											</div>

											<label class="col-sm-2 control-label" label-mask>품목단위</label>
											<div class="col-sm-4">
												<select ng-model="ds_mst.ITM_UN"	ng-disabled="lfn_input_disabled('ds_mst.ITM_UN')"	ng-change="lfn_input_onChange('ds_mst.ITM_UN')" validTypes="required"	validName="품목단위"	class="form-control">
													<option ng-repeat="x in ds_code.QTY_UN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
										</div>

										<div class="col-sm-12 form-group">
			                            
			                            	<label class="col-sm-2 control-label" label-mask>품목명</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.ITM_NM"	ng-disabled="lfn_input_disabled('ds_mst.ITM_NM')"	ng-change="lfn_input_onChange('ds_mst.ITM_NM')"	validTypes="required"	validName="품목명"	class="form-control" type="text" />
											</div>
											
											<label class="col-sm-2 control-label" label-mask>품목구분</label>
											<div class="col-sm-4">
												<select ng-model="ds_mst.ITM_GB"	ng-disabled="lfn_input_disabled('ds_mst.ITM_GB')"	ng-change="lfn_input_onChange('ds_mst.ITM_GB')" validTypes="required"	validName="품목구분"	class="form-control">
													<option ng-repeat="x in ds_code.ITM_GB" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
			                            </div>
			                            
			                            <div class="col-sm-12 form-group"> 
			                            
			                            	<label class="col-sm-2 control-label" >품목규격</label>
											<div class="col-sm-4">
												<input ng-model="ds_mst.ITM_SPEC"	ng-disabled="lfn_input_disabled('ds_mst.ITM_SPEC')"	ng-change="lfn_input_onChange('ds_mst.ITM_CD')"		validName="품목규격"	class="form-control" type="text" />
											</div>
											
											<label class="col-sm-2 control-label" >품목중량</label>
											<div class="col-sm-4">
												<input number-format model="ds_mst.ITM_WT" digit="3" sign="false" change="lfn_input_onChange('ds_mst.ITM_WT')" ng-disabled="lfn_input_disabled('ds_mst.ITM_WT')"
												class="form-control text-right" type="text" />
											</div>
										</div>
										
										<div class="col-sm-12 form-group"> 
			                            	
			                            	<label class="col-sm-2 control-label" >품목용량</label>
											<div class="col-sm-4">
												<input number-format model="ds_mst.ITM_VOL" digit="3" sign="false" change="lfn_input_onChange('ds_mst.ITM_VOL')" ng-disabled="lfn_input_disabled('ds_mst.ITM_VOL')"
												class="form-control text-right" type="text" />
											</div>	
											
											<label class="col-sm-2 control-label" >유통기한</label>
											<div class="col-sm-2">
												<input number-format  model="ds_mst.EXPRDY" digit="3" sign="false"	change="lfn_input_onChange('ds_mst.EXPRDY')" ng-disabled="lfn_input_disabled('ds_mst.EXPRDY')" validName="유통기한"	class="form-control text-right" type="text" />
											</div>
											<label class="col-sm-1" >일</label>
										</div>
										
										<div class="col-sm-12 form-group">
										
											<label class="col-sm-2 control-label" >안전재고 수량</label>
											<div class="col-sm-4">
												<input number-format model="ds_mst.SAF_STOCK_QTY" digit="3" sign="false" change="lfn_input_onChange('ds_mst.SAF_STOCK_QTY')" ng-disabled="lfn_input_disabled('ds_mst.SAF_STOCK_QTY')"
												class="form-control text-right" type="text" />
											</div>
										</div>

										<div class="col-sm-12 form-group">						
											<label class="col-sm-2 control-label" >비고</label>
											<div class="col-sm-10">
												<textarea ng-model="ds_mst.REMARKS" ng-disabled="lfn_input_disabled('ds_mst.REMARKS')"	ng-change="lfn_input_onChange('ds_mst.REMARKS')"	validName="비고" kr-input rows="2" cols="" class="form-control"></textarea>			
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
