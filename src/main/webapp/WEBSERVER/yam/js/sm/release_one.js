
(function (){
    console.log('what?')
    let initialData = [];
    $.ajax({
        type : "GET",
        url	: "/releaseWare.do",
        contentType: "application/json;charset=utf-8",
        success : function (data){
            console.log(data,'data:123')
            const tbody = $('#list_data1');
            for(let i = 0 ; i < data.length ; i++){
                const {ITM_ID, DO_QTY, DO_UN, item_name} = data[i];
                console.log(item_name,':::::')
                tbody.append(
                    "<tr><td>"+ ITM_ID +"</td>" +
                    "<td>"+ item_name +"</td>" +
                    "<td>"+ "출고처" +"</td>" +
                    "<td>"+ DO_QTY +"</td>" +
                    "<td>"+ DO_UN +"</td><tr/>"
                )
            }
        },
        error : function (data){
            console.log(data,'error:::')
        }
    })



})();