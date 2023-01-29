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
    <link rel="stylesheet" href="/WEBSERVER/yam/css/common/table.css">
    <script type="text/javascript" src="/WEBSERVER/yam/js/sm/stock_one.js" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->
    
</head>

<body id="in_frame" class="scroll">


<div style="height : 38px; width : 100%; background-color: white;padding :10px;">
    <h4>
        <i class="fa fa-list-alt"></i>

        입고자료
        <div class="btn-group pull-right">
            <button onclick="searchList()" ng-disabled="lfn_btn_disabled('SEARCH')" class="btn btn-warning btn-tbb" type="button"><i class="fa fa-search"></i>조회</button>
            <button ng-click="lfn_btn_onClick('CLOSE')" ng-disabled="lfn_btn_disabled('CLOSE')" class="btn btn-warning btn-tbb" type="button"><i class="fa fa-window-close"></i>닫기</button>
        </div>
    </h4>

</div>
<div style="height : 42px; width : 100%; background-color: white;margin : 2px 0px 2px 0px;padding-top: 3px">
<div class="col-sm-12 form-group">
    <label class="col-sm-1 control-label">적재일자</label>
    <div class="col-sm-3">
        <div class="input-group">
            <div moment-picker="ds_cond.DY_FR" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
                <input ng-model="ds_cond.DY_FR" ng-model-options="{ updateOn: 'blur' }" class="form-control text-center ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty" tabindex="0">
                <span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
            </div>
            <span class="input-group-addon dash">-</span>
            <div moment-picker="ds_cond.DY_TO" locale="ko" start-view="month" format="YYYY-MM-DD" class="ng-isolate-scope" style="display:inherit">
                <input ng-model="ds_cond.DY_TO" ng-model-options="{ updateOn: 'blur' }" class="form-control text-center ng-pristine ng-untouched ng-valid ng-scope moment-picker-input ng-not-empty" tabindex="0">
                <span class="input-group-addon ng-scope"><i class="fa fa-calendar"></i></span>
            </div>
        </div>
    </div>
    <label class="col-sm-1 control-label">품목</label>
    <div class="col-sm-2">
        <input ng-model="ds_cond.ITM_CD" class="form-control ng-pristine ng-valid ng-empty ng-touched">
    </div>
</div>
</div>
<div style="background-color: white; padding :10px; margin-top: 1px;">
    <table style="width : 100%; height : 50%">
        <thead>
        <tr>
            <th>순번</th>
            <th>입고일자</th>
            <th>시간</th>
            <th>품목</th>
            <th>품목명</th>
            <th>수량</th>
            <th>단위</th>
            <th>비고</th>
        </tr>
        </thead>
        <tbody id="list_data1"/>
    </table>
</div>

<div style="height : 38px; width : 100%; background-color: white;padding :10px; margin-top: 2px;">
    <h4>
        <i class="fa fa-list-alt"></i>

        입고자료 팔렛트 no 등록
        <div class="btn-group pull-right">
            <button class="btn btn-warning btn-tbb" type="button" ><i class="fa fa-refresh" aria-hidden="true" style="padding-right:0"></i></button>
        </div>
    </h4>

</div>

<div style="background-color: white; padding :10px; margin-top: 1px;">

    <table style="width : 100%; height : 50%">
        <thead>
        <tr>
            <th>순번</th>
            <th>입고일자</th>
            <th>시간</th>
            <th>품목</th>
            <th>품목명</th>
            <th>수량</th>
            <th>단위</th>
            <th>팔렛트</th>
        </tr>
        </thead>
        <tbody id="list_data2"/>
    </table>
</div>
<!-- //application, controller 영역 -->

<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>
<script>

    function checkTable(){

    }

    function selectAo(e) {
       const searchDom = document.getElementById('list_data1')
       const trList = searchDom.querySelectorAll("tr");
        trList.forEach(value =>{
            value.style.backgroundColor = 'white';
        })
        e.style.backgroundColor = 'yellow';
        $.ajax({
            type : "GET",
            url	: "/searchAoWhin.do",
            data : {sn : e.id},
            contentType: "application/json;charset=utf-8",
            success : function (data){
                const tbody = $('#list_data2');
                tbody.empty();
                // tbody.removeChild();
                for(let i = 0 ; i < data.length ; i++){
                    const {item_name, A_ITM_ID, A_WHIN_DT} = data[i];
                    // const {year, monthValue, dayOfMonth, hour, minute, second} =REG_DT;
                    tbody.append(
                        `<tr><td>`+ "Q&A" +"</td>" +
                        "<td>"+ A_WHIN_DT+ "</td>" +
                        "<td>"+ "Q&A"+ "</td>" +
                        "<td>"+ A_ITM_ID +"</td>" +
                        "<td>"+ item_name +"</td>" +
                        "<td>"+ "Q&A" +"</td>" +
                        "<td>"+ "Q&A" +"</td>" +
                        "<td>"+ "Q&A" +"</td><tr/>"
                    )
                }

            },
            error : function (data){
                console.log(data,'error:::')
            }
        })
    }



</script>
