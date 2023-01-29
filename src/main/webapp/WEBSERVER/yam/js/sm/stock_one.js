(function (){
    console.log('what?')
    let initialData = [];
    $.ajax({
        type : "GET",
        url	: "/inWareL.do",
        contentType: "application/json;charset=utf-8",
        success : function (data){

            const tbody = $('#list_data1');
            for(let i = 0 ; i < 10 ; i++){

                const {WHIN_ID, WHIN_SN, REG_DT, ITM_ID, WHIN_QTY, WHIN_UN, item_name} = data[i];
                const {year, monthValue, dayOfMonth, hour, minute, second} =REG_DT;

                tbody.append(
                    `<tr id=${WHIN_ID} class=${WHIN_SN} onclick='selectAo(this)'><td>`+ WHIN_SN +"</td>" +
                    "<td>"+ year + "-"+ monthValue + "-" + dayOfMonth+ "</td>" +
                    "<td>"+ hour + ":"+ minute + ":" + second + "</td>" +
                    "<td>"+ ITM_ID +"</td>" +
                    "<td>"+ item_name +"</td>" +
                    "<td>"+ WHIN_QTY +"</td>" +
                    "<td>"+ WHIN_UN +"</td>" +
                    "<td>"+ "Q&A" +"</td><tr/>"
                )
            }
        },
        error : function (data){
            console.log(data,'error:::')
        }
    })



})();