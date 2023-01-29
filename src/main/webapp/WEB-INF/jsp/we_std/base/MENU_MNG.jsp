<%@page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@page import="we.std.core.StdConst"%>
<%--
	파일명	: MENU_MNG.jsp
	설명	: 메뉴관리
		
	수정일 		수정자		수정내용
	2022.03.02	염국선		최초작성
--%> 

<!DOCTYPE HTML>
<html>

<head>
    <title>메뉴관리</title>

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
	<script type="text/javascript" src="/WEBSERVER/we_std/js/base/MENU_MNG.js?ver=20220302" charset="utf-8"></script>
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
					<div class="form-group" style="width:500px;">
						<label class="col-sm-1 control-label">메뉴</label>   
						<div class="col-sm-6">
                           	<select ng-model="ds_cond.ROOT_MENU_ID"	class="form-control">
                           		<option value="">선택</option>
								<option ng-repeat="x in ds_code.ROOT_MENU_ID" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
							</select>
						</div>
						<div class="col-sm-5">
							<button ng-click="lfn_btn_onClick('root.NEW')"	ng-disabled="lfn_btn_disabled('root.NEW')"	class="btn btn-warning btn-tbb" type="button">등록</button>
							<button ng-click="lfn_btn_onClick('root.EDIT')"	ng-disabled="lfn_btn_disabled('root.EDIT')"	class="btn btn-warning btn-tbb" type="button">수정</button>
						</div>
					</div>      
					<div class="btn-group pull-right">
						<button ng-click="lfn_btn_onClick('SEARCH')"	ng-disabled="lfn_btn_disabled('SEARCH')"										class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i>조회</button>
						<button ng-click="lfn_btn_onClick('SAVE')"		ng-disabled="lfn_btn_disabled('SAVE')"		ng-show="lfn_btn_show('SAVE')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i>저장</button>
						<button ng-click="lfn_btn_onClick('DEL')"		ng-disabled="lfn_btn_disabled('DEL')"		ng-show="lfn_btn_show('DEL')"		class="btn btn-warning btn-tbb" type="button"><i class="fa fa-trash"></i> 삭제</button>
						<button ng-click="lfn_btn_onClick('CLOSE')"		ng-disabled="lfn_btn_disabled('CLOSE')"											class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i>닫기</button>
					</div>
				</div>
			</div>
			<!-- //top버튼 영역 -->
			

			<!-- 그래드 영역 -->
			<div class="row">
				<div class="col-xs-6">
					<div class="ibox">
					
			    		<div class="ibox-title">
			        		<h5><i class="fa fa-list-alt"></i>대분류 목록 {{ds_base.ROOT_MENU_ID ? "(" + ds_base.ROOT_MENU_NM + ")" : ""}}</h5>
							<div class="btn-group pull-right">
								<p>
									<button ng-click="lfn_btn_onClick('mst.ADD')"	ng-disabled="lfn_btn_disabled('mst.ADD')"	ng-show="lfn_btn_show('mst.ADD')"	class="btn btn-warning btn-tbb" type="button">행추가</button>
								</p>
							</div>
			        	</div>
			        	
			        	<div class="ibox-content">
			        		<div ui-grid="mstGrid" style="height:85vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
			        	</div>
			        	
					</div>

				</div>
				
				<div class="col-xs-6">
					<div class="ibox">
					
			    		<div class="ibox-title">
			        		<h5><i class="fa fa-list-alt"></i>프로그램 목록</h5>
							<div class="btn-group pull-right">
								<button ng-click="lfn_btn_onClick('sub.ADD')"	ng-disabled="lfn_btn_disabled('sub.ADD')"	ng-show="lfn_btn_show('sub.ADD')"	class="btn btn-warning btn-tbb" type="button">행추가</button>
								<button ng-click="lfn_btn_onClick('sub.DEL')"	ng-disabled="lfn_btn_disabled('sub.DEL')"	ng-show="lfn_btn_show('sub.DEL')"	class="btn btn-warning btn-tbb" type="button">행삭제</button>
							</div>
			        	</div>
			        	
			        	<div class="ibox-content">
			        		<div ui-grid="subGrid" style="height:85vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
							</div>
			        	</div>
			        	
					</div>
				</div>


			</div>
			<!-- //그래드 영역 -->


			<!-- ROOT메뉴 작성 모달영력 --> 
			<div id="rootEditModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-fullsize" role="document" style="width:600px;">
					<div class="modal-content modal-fullsize" >
						<div class="modal-body">

							<div class="ibox">

								<div class="ibox-title">
									<h5><i class="fa fa-list-alt"></i>루트메뉴 등록 </h5>
									<div class="ibox-tools">
										<button ng-click="lfn_btn_onClick('root.SAVE')"		ng-disabled="lfn_btn_disabled('root.SAVE')"		ng-show="lfn_btn_show('root.SAVE')"			class="btn btn-warning btn-tbb" type="button"><i class="fa fa-save"></i> 저장</button>
										<button ng-click="lfn_btn_onClick('root.CLOSE')"	ng-disabled="false"								ng-show="true"							class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
									</div>
								</div>
								
				          		<!-- 에디터 영역 -->
								<div id="ds_root" class="ibox-content">
									<div class="row row-full-height">
									
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">루트메뉴ID</label>
											<div class="col-sm-4">
			                        			<input ng-model="ds_root.ROOT_MENU_ID"	ng-disabled="true" class="form-control text-center" type="text" />
											</div>
			                            </div>
			                            
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label" label-mask>루트메뉴명</label>
											<div class="col-sm-10">
			                        			<input ng-model="ds_root.ROOT_MENU_NM"	ng-disabled="lfn_input_disabled('ds_root.ROOT_MENU_NM')" ng-change="lfn_input_onChange('ds_root.ROOT_MENU_NM')"	validTypes="required" validName="루트메뉴명" class="form-control" type="text" />
											</div>
			                            </div>
			                            
										<div class="col-sm-12 form-group" ng-show="lfn_input_show('ds_root.SECTR')">
											<label class="col-sm-2 control-label">섹터별적용</label>
											<div class="col-sm-4">
				                                <div class="checkbox checkbox-inline">
													<input ng-model="ds_root.SECTR_APLY_YN" ng-disabled="lfn_input_disabled('ds_root.SECTR_APLY_YN')" ng-change="lfn_input_onChange('ds_root.SECTR_APLY_YN')" ng-true-value="'Y'" ng-false-value="'N'" type="checkbox" />
					                                <label></label>
												</div>
											</div>
											<label class="col-sm-2 control-label">섹터</label>
											<div class="col-sm-4">
												<select ng-model="ds_root.SECTR_ID"	ng-disabled="lfn_input_disabled('ds_root.SECTR_ID')"	ng-change="lfn_input_onChange('ds_root.SECTR_ID')"	class="form-control">
													<option ng-repeat="x in ds_code.SECTR_ID" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option>
												</select>
											</div>
			                            </div>
										
										<div class="col-sm-12 form-group">
											<label class="col-sm-2 control-label">사용여부</label>
											<div class="col-sm-4">
				                                <div class="checkbox checkbox-inline">
													<input ng-model="ds_root.USE_YN" ng-disabled="lfn_input_disabled('ds_root.USE_YN')" ng-change="lfn_input_onChange('ds_root.USE_YN')" ng-true-value="'Y'" ng-false-value="'N'" type="checkbox" />
					                                <label></label>
												</div>
											</div>
											<label class="col-sm-2 control-label">삭제여부</label>
											<div class="col-sm-4">
				                                <div class="checkbox checkbox-inline">
													<input ng-model="ds_root.DEL_YN" ng-disabled="lfn_input_disabled('ds_root.DEL_YN')" ng-change="lfn_input_onChange('ds_root.DEL_YN')" ng-true-value="'Y'" ng-false-value="'N'" type="checkbox" />
					                                <label></label>
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
			<!-- //ROOT메뉴 작성 모달영력 -->
			
			
			<!-- 프로그램 선택 모달영력 --> 
			<div id="selPgmModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-fullsize" role="document" style="width:800px;">
					<div class="modal-content modal-fullsize" >
						<div class="modal-body">

							<div class="ibox">

								<div class="ibox-title">	
									<h5><i class="fa fa-list-alt"></i>프로그램 선택</h5>
									<div class="ibox-tools">
										<button ng-click="lfn_btn_onClick('pgm.SEL')"	ng-disabled="lfn_btn_disabled('pgm.SEL')"	ng-show="lfn_btn_show('pgm.SEL')"	class="btn btn-warning btn-tbb" type="button"><i class="fa fa-check"></i> 선택</button>
										<button ng-click="lfn_btn_onClick('pgm.CLOSE')"	ng-disabled="false"							ng-show="true"						class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i> 닫기</button>
									</div>
								</div>
								
				          		<!-- 선택 그리드 영역 -->
								<div id="ds_mst" class="ibox-content">
									<div class="row row-full-height">
									
										<div ui-grid="pgmGrid" style="height: 80vh;" ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize>
										</div>

			                        </div>
								</div>
	    		          		<!-- //선택 그리드 영역 -->
								
							</div>
       					
       					</div> 
    				</div> 
				</div> 
			</div>			
			<!-- //프로그램 선택 모달영력 -->			


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
