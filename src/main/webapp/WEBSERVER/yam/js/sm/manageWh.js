
(function (){
    // console.log('what?')
    let initialData = [];
    $.ajax({
        type : "GET",
        url	: "/searchAoWhinAll.do",
        contentType: "application/json;charset=utf-8",
        success : function (data){
            const tbody = $('#list_data1');
            for(let i = 0 ; i < data.length ; i++){
                const {A_WHIN_SN, A_WHIN_DT, A_ITM_ID, A_WHIN_QTY, A_WHIN_UN, A_PALETTE_NO, A_CELL_NO, A_IN_ST, A_LOAD_DT, A_LOAD_TM, A_LOAD_ST} = data[i];
                console.log(A_WHIN_DT,'A_WHIN_DT')
                tbody.append(
                    "<tr><td>"+ A_WHIN_SN +"</td>" +
                    "<td>"+ A_WHIN_DT +"</td>" +
                    "<td>"+ "time" +"</td>" +
                    "<td>"+ A_ITM_ID +"</td>" +
                    "<td>"+ A_WHIN_QTY +"</td>" +
                    "<td>"+ A_WHIN_UN +"</td>" +
                    "<td>"+ A_PALETTE_NO +"</td>" +
                    "<td>"+ A_CELL_NO +"</td>" +
                    "<td>"+ A_IN_ST +"</td>" +
                    "<td>"+ A_LOAD_DT + A_LOAD_TM +"</td>" +
                    "<td>"+ A_LOAD_ST +"</td><tr/>"
                )
            }
        },
        error : function (data){
            console.log(data,'error:::')
        }
    })

    $.ajax({
        type : "GET",
        url	: "/searchShOutAll.do",
        contentType: "application/json;charset=utf-8",
        success : function (data){
            const tbody = $('#list_data2');
            for(let i = 0 ; i < data.length ; i++){
                const {A_WHIN_SN, A_WHIN_DT, A_ITM_ID, A_WHIN_QTY, A_WHIN_UN, A_PALETTE_NO, A_CELL_NO, A_IN_ST, A_LOAD_DT, A_LOAD_TM, A_LOAD_ST} = data[i];
                console.log(A_WHIN_DT,'A_WHIN_DT')
                tbody.append(
                    "<tr><td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td>" +
                    "<td>"+ 'nodata' +"</td><tr/>"
                )
            }
        },
        error : function (data){
            console.log(data,'error:::')
        }
    })

    $.ajax({
        type : "GET",
        url	: "/test.do",
        contentType: "application/json;charset=utf-8",
        success : function (data){
            const tbody = $('#list_data3');
            for(let i = 0 ; i < data.length ; i++){
                const {CELL_NO, LOAD_DT, LOAD_ITEM, LOAD_QTY, LOAD_TM, LOAD_UNIT, PALETTE_NO, SEQ_NO, USE_YN, OUT_DT, OUT_TM} = data[i];
                tbody.append(
                    "<tr><td>"+ CELL_NO +"</td>" +
                    "<td>"+ LOAD_DT+"</td>" +
                    "<td>"+ LOAD_TM +"</td>" +
                    "<td>"+ LOAD_ITEM +"</td>" +
                    "<td>"+ LOAD_QTY +"</td>" +
                    "<td>"+ LOAD_UNIT +"</td>" +
                    "<td>"+ PALETTE_NO +"</td>" +

                    "<td>"+ '' +"</td><tr/>"
                )
            }
        },
        error : function (data){
            console.log(data,'error:::')
        }
    })
})();