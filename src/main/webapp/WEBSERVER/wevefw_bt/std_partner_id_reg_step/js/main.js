
// http://www.jquery-steps.com/Examples

$(function(){
    $("#form-total").steps({
        headerTag				: "h2",
        bodyTag					: "section",
        transitionEffect		: "fade",      // fade   slideLeft
        transitionEffectSpeed	: 150,
        enableAllSteps			: true,
        stepsOrientation		: "vertical",
        autoFocus				: true, 
        titleTemplate : '<div class="title">#title#</div>',
        labels: {
            previous 	: 'Back Step',
            next 		: 'Next11111',
            finish 		: 'Submit',
            current 	: ''
        },
        onStepChanging: function (event, currentIndex, newIndex)
        { 
        	 
        	alert(" onStepChanging : "+ $("#BIZAREA_NO").val() );
        	
        	
//            // Allways allow previous action even if the current form is not valid!
//            if (currentIndex > newIndex)
//            {
//                return true;
//            }
//            // Forbid next action on "Warning" step if the user is to young
//            if (newIndex === 3 && Number($("#age-2").val()) < 18)
//            {
//                return false;
//            }
//            // Needed in some cases if the user went back (clean up)
//            if (currentIndex < newIndex)
//            {
//                // To remove error styles
//                form.find(".body:eq(" + newIndex + ") label.error").remove();
//                form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
//            }
            form.validate().settings.ignore = ":disabled,:hidden";
            return form.valid();
        	
        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {
        	
        	alert(" onStepChanged : "+ $("#BIZAREA_NO").val() );
        	 
//            // Used to skip the "Warning" step if the user is old enough.
//            if (currentIndex === 2 && Number($("#age-2").val()) >= 18)
//            {
//                form.steps("next");
//            }
//            // Used to skip the "Warning" step if the user is old enough and wants to the previous step.
//            if (currentIndex === 2 && priorIndex === 3)
//            {
//                form.steps("previous");
//            }
        },
        onFinishing: function (event, currentIndex)
        {
        
        	alert("onFinishing!: 이벤트 main.js 에 정의");
//            form.validate().settings.ignore = ":disabled";
//            return form.valid();
        },
        onFinished: function (event, currentIndex)
        {
        	
         	alert("onFinished!: 이벤트 main.js 에 정의");
         	
         	//	DB에 insert
        	insertDb();
            
        }
        
        
    }).validate({
        errorPlacement: function errorPlacement(error, element) { element.before(error); },
        rules: {
            confirm: {
                equalTo: "#password-2"
            }
        }
        
        
    }) 
});
