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
    <script type="text/javascript" src="/WEBSERVER/yam/js/sm/barcode.js" charset="utf-8"></script>
    <!-- ====================================================================================================================================================== -->
    
</head>

<body id="in_frame" class="scroll">

<div style="height : 38px; width : 100%; background-color: white;padding :10px;">
    <h4>
        <i class="fa fa-list-alt"></i>

        입고 바코드
        <div>
            <input type="text" id="searchValue"> <button onclick="search()">바코드</button>
        </div>
        <div class="btn-group pull-right">
            <button class="btn btn-warning btn-tbb" type="button" ><i class="fa fa-refresh" aria-hidden="true" style="padding-right:0"></i></button>
        </div>
    </h4>

</div>

<div style="background-color: white; padding :10px; margin-top: 1px;">
    <table style="width : 100%">
        <thead>
        <tr>
            <th>순번</th>
            <th>입고일자</th>
            <th>시간</th>
            <th>품목</th>
            <th>수량</th>
            <th>단위</th>
            <th>팔렛트NO</th>
            <th>셀NO</th>
            <th>입고지시</th>
            <th>적재일시</th>
            <th>적재구분</th>
        </tr>
        </thead>
        <tbody id="list_data1">

        </tbody>
    </table>
</div>





<div style="height : 38px; width : 100%; background-color: white;padding :10px;">
    <h4>
        <i class="fa fa-list-alt"></i>

        출고 바코드
        <div>
            <input type="text" id="searchValue2"> <button onclick="search2()">바코드</button>
        </div>
    </h4>

</div>

<div style="background-color: white; padding :10px; margin-top: 1px;">
    <table style="width : 100%">
        <thead>
        <tr>
            <th>순번</th>
            <th>입고일자</th>
            <th>시간</th>
            <th>품목</th>
            <th>수량</th>
            <th>단위</th>
            <th>팔렛트NO</th>
            <th>셀NO</th>
            <th>출고지시</th>
            <th>출고일시</th>
            <th>출고구분</th>
        </tr>
        </thead>
        <tbody id="list_data2"/>
    </table>
</div>


<div style="height : 38px; width : 100%; background-color: white;padding :10px;">
    <h4>
        <i class="fa fa-list-alt"></i>
        출고정보 클리어
    </h4>

</div>

<div style="background-color: white; padding :10px; margin-top: 1px;">
    <table style="width : 100%">
        <thead>
        <tr>
            <th>순번</th>
            <th>입고일자</th>
            <th>시간</th>
            <th>품목</th>
            <th>수량</th>
            <th>단위</th>
            <th>팔렛트NO</th>
            <th>셀NO</th>
            <th>출고지시</th>
            <th>출고일시</th>
            <th>출고구분</th>
        </tr>
        </thead>
        <tbody id="list_data3"/>
    </table>
</div>
<!-- ====================================================================================================================================================== -->
<!-- 공통BOTTOM -->
<jsp:include page="/WEB-INF/jsp/inc_bottom.jsp" />
<!-- ====================================================================================================================================================== -->

</body>

<script>

    function search() {
       const inputDom = document.getElementById('searchValue');
       const sendCell = inputDom.value.split(" ");

        $.ajax({
            type : "GET",
            url	: "/updateBarcode.do",
            contentType: "application/json;charset=utf-8",
            data : {cell : sendCell[0], code : sendCell[1]},
            success : function (data){
                if(!data){
                    alert('존재하지 않는 바코드입니다')
                }
                const tbody = $('#list_data1');
                tbody.empty();

                for(let i = 0 ; i < data.length ; i++){

                    const {A_LOAD_ST=1 , A_LOAD_DT=1, A_LOAD_TM=1, A_IN_ST=1, A_CELL_NO=1, A_PALETTE_NO=1, A_WHIN_UN=1, A_WHIN_QTY=1, A_ITM_ID=1, A_WHIN_DT=1, A_WHIN_SN=1} = data[i];

                    if(A_CELL_NO === sendCell[0] && sendCell[1] === A_ITM_ID){
                        tbody.append(
                            `<tr style="background-color: yellow"><td>`+ A_WHIN_SN +"</td>" +
                            "<td>"+ A_WHIN_DT + "</td>" +
                            "<td>"+ "Q&A" + "</td>" +
                            "<td>"+ A_ITM_ID + "</td>" +
                            "<td>"+ A_WHIN_QTY +"</td>" +
                            "<td>"+ A_WHIN_UN +"</td>" +
                            "<td>"+ A_PALETTE_NO +"</td>" +
                            "<td>"+ A_CELL_NO +"</td>" +
                            "<td>"+ A_IN_ST +"</td>" +
                            "<td>"+ A_LOAD_DT + A_LOAD_TM +"</td>" +
                            "<td>"+ A_LOAD_ST +"</td><tr/>"
                        )
                    }else{
                        tbody.append(
                            `<tr><td>`+ A_WHIN_SN +"</td>" +
                            "<td>"+ A_WHIN_DT + "</td>" +
                            "<td>"+ "Q&A" + "</td>" +
                            "<td>"+ A_ITM_ID + "</td>" +
                            "<td>"+ A_WHIN_QTY +"</td>" +
                            "<td>"+ A_WHIN_UN +"</td>" +
                            "<td>"+ A_PALETTE_NO +"</td>" +
                            "<td>"+ A_CELL_NO +"</td>" +
                            "<td>"+ A_IN_ST +"</td>" +
                            "<td>"+ A_LOAD_DT + A_LOAD_TM +"</td>" +
                            "<td>"+ A_LOAD_ST +"</td><tr/>"
                        )
                    }

                }

            },
            error : function (data){
                console.log(data,'error:::')
            }
        })
    }

    // sendCell[0]

</script>