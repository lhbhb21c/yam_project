(function (){
    console.log('what?')
    let initialData = [];
    $.ajax({
        type : "GET",
        url	: "/test.do",
        contentType: "application/json;charset=utf-8",
        success : function (data){
            console.log(data,'data:')
            const tbody = $('#list_data');
            for(let i = 0 ; i < data.length ; i++){
                console.log(data[i],'data[i]::')
                const {CELL_NO, LOAD_DT, LOAD_ITEM, LOAD_QTY, LOAD_TM, LOAD_UNIT, PALETTE_NO, SEQ_NO, USE_YN, OUT_DT, OUT_TM} = data[i];
                tbody.append(
                    "<tr><td>"+ CELL_NO +"</td>" +
                    "<td>"+ SEQ_NO +"</td>" +
                    "<td>"+ LOAD_DT+"</td>" +
                    "<td>"+ LOAD_TM +"</td>" +
                    "<td>"+ LOAD_ITEM +"</td>" +
                    "<td>"+ LOAD_QTY +"</td>" +
                    "<td>"+ LOAD_UNIT +"</td>" +
                    "<td>"+ PALETTE_NO +"</td>" +
                    "<td>"+ OUT_DT +"</td>" +
                    "<td>"+ OUT_TM +"</td>" +
                    "<td>"+ USE_YN +"</td><tr/>"
                )
            }
            // console.log(data,'data:')
            // data.forEach(value =>{
            //     console.log(value,':::')
            //     tbody.appendChild("<tr><td>Adrian</td><td>Flyterp</td></tr>")
            // })
            // initialData = data;
        },
        error : function (data){
            console.log(data,'error:::')
        }
    })



})();