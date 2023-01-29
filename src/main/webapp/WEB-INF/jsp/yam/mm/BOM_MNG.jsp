<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="yam.cmmn.YamConst"%>
<!DOCTYPE html>
<html>

<%--
	파일명	: BOM_MNG.jsp
	설명	: BOM 등록
	수정일		 	수정자		수정내용
    2021.10.23	정래훈		최초작성
--%> 

<head>
    <title>BOM 등록</title>

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
    <script type="text/javascript" src="/WEBSERVER/yam/js/mm/BOM_MNG.js?ver=<%=YamConst.VER_MM_JS %>" charset="utf-8"></script>
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
	                        
                                <label class="col-sm-1 control-label">품목코드</label>
	                        	<div class="col-sm-3">
	                        		<div class="input-group">
	                        			<input ng-model="ds_cond.ITM_CD"	kr-input	class="form-control" type="text" />
									</div>
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
							<h5><i class="fa fa-list-alt"></i>BOM 목록</h5>
							<div class="btn-group pull-right"></div>
						</div>
						<div class="ibox-content">
							<div ui-grid="mstGrid" style="height: 40vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //마스터 그리드 영역  -->
			
			<!-- 서브 그리드 영역  -->
        	<div class="row">
				<div class="col-lg-12">
					<div class="ibox"  style="margin-bottom:0;">
						<div class="ibox-title">
							<h5><i class="fa fa-list-alt"></i>BOM 상세 목록</h5>
						</div>
						<div class="ibox-content">
							<div ui-grid="dtlGrid" style="height: 30vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- //서브 그리드 영역  -->			
			
			<!-- BOM정보 작성 모달영력 --> 
			<div id="editModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-fullsize" role="document" style="width:800px;">
					<div class="modal-content modal-fullsize" >
						<div class="modal-body">

							<div class="ibox">

								<div class="ibox-title">	
									<h5><i class="fa fa-list-alt"></i>BOM 등록 </h5>
									<div class="ibox-tools">
										<button ng-click="lfn_btn_onClick('SAVE')"			ng-disabled="lfn_btn_disabled('SAVE')"			ng-show="lfn_btn_show('SAVE')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 저장</button>
										<button ng-click="lfn_btn_onClick('edit.CLOSE')"	ng-disabled="false"								ng-show="true"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
									</div>
								</div>
								
				          		<!-- 에디터 영역 -->
								<div id="ds_mst" class="ibox-content">
									<div class="row row-full-height">
									
										<div class="col-sm-12 form-group">
										   <label class="col-sm-2 control-label text-right" label-mask>품목코드</label>
											<div class="col-sm-6">
				                        		<div class="input-group">
				                        			<input ng-model="ds_mst.ITM_NM"	readonly class="form-control" type="text" validTypes="required" validName="품목코드" />
					                                <div class="input-group-btn">
														<button ng-click="lfn_btn_onClick('ds_mst.POP_ITM')"	ng-disabled="lfn_input_disabled('ds_mst.POP_ITM')"	class="btn btn-primary m-n" ><i class="fa fa-search"></i></button>
													</div>
												</div>
											</div>
											
											<label class="col-sm-2 control-label text-right" label-mask>사용구분</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.USE_YN"	ng-disabled="lfn_input_disabled('ds_mst.USE_YN')"	ng-change="lfn_input_onChange('ds_mst.USE_YN')"		validTypes="required"	validName="사용구분"	class="form-control">
													<option ng-repeat="x in ds_code.USE_YN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>		
			                            </div>
			                            
										<div class="col-sm-12 form-group"> 	
										
											<label class="col-sm-2 control-label text-right">수량단위</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.QTY_UN"	ng-disabled="lfn_input_disabled('ds_mst.QTY_UN')"	ng-change="lfn_input_onChange('ds_mst.QTY_UN')" validName="수량단위"	class="form-control">
													<option ng-repeat="x in ds_code.QTY_UN" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>

											<label class="col-sm-2 control-label ">품목수량</label>
											<div class="col-sm-2">
												<input ng-model="ds_mst.ITM_QTY" 		ng-disabled="lfn_input_disabled('ds_mst.ITM_QTY')"		ng-change="lfn_input_onChange('ds_mst.ITM_QTY')"	class="form-control text-right" type="number" />
											</div>

											<label class="col-sm-2 control-label" label-mask>공정</label>
											<div class="col-sm-2">
												<select ng-model="ds_mst.PROC_CD"	ng-disabled="lfn_input_disabled('ds_mst.PROC_CD')"	ng-change="lfn_input_onChange('ds_mst.PROC_CD')" validTypes="required"	validName="공정코드"	class="form-control">
													<option ng-repeat="x in ds_code.PROC_CD" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>


										</div>
										
										<div class="col-sm-12 form-group">											
											
											<div class="ibox-title">
												<div class="ibox-tools">
													<button ng-click="lfn_btn_onClick('edit.sub.ADD')"	ng-disabled="lfn_btn_disabled('edit.sub.ADD')"	class="btn btn-warning btn-tbb" type="button">추가</button>
													<button ng-click="lfn_btn_onClick('edit.sub.DEL')"	ng-disabled="lfn_btn_disabled('edit.sub.DEL')"	class="btn btn-warning btn-tbb" type="button">삭제</button>
												</div>
											</div>											
											
											<div class="row row-full-height">
											
												<div ui-grid="subGrid" style="height: 25vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
												</div>
		
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
			<!-- //BOM정보 작성 모달영력 --> 			
			
			
       </div>
       <!-- //block-ui 영역 -->
       
	</div>
	<!-- //application, controller 영역 -->
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->


</body>
