/**
 * relogin class(메인화면 relogin 관련)
 *	ex) 
	생성:RELOGIN = new ReloginModal({name:"ReloginModal", allowedRetry:3, PUBLIC_KEY:"????", debug:true});
	호출:top.RELOGIN.relogin();
	
	<!-- 재로그인모달영력 --> 
	<div id="reloginModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog modal-fullsize" role="document" style="width:500px;">
			<div class="modal-content modal-fullsize" >
				<div class="modal-body">

					<div class="row">
						<div class="col-sm-12 form-group">
						</div>
						<div class="col-sm-12 form-group">
							<div class="col-sm-7">
								<input id="RELOGIN_USER_PWD"  placeholder="비밀번호" class="form-control" type="password"/>
							</div>
							<div class="col-sm-5">
								<div class="btn-group pull-right">
									<button id="RELOGIN_SUBMIT" class="btn btn-warning btn-tbb" type="button">로그인</button>
									<button id="RELOGIN_CLOSE" class="btn btn-warning btn-tbb" type="button">닫기</button>
								</div>
							</div>
						</div>
					</div>
     					
     			</div> 
  			</div> 
		</div> 
	</div>			
	<!-- //재로그인 모달영력 --> 		
	
 *
 * @param settings
 * @author	:	염국선
 * @since	:	2021.12.28
 */
class ReloginModal extends BaseUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//relogin retry count
	_retryCnt = 0;
	//event bind등 초기화 작업
	_isInit = false;
	//modal open flag
	_isOpen = false;
	//relogin success
	_onLoginSuccess;
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자 - {name:"ReloginModal", allowedRetry:3, PUBLIC_KEY:"????", debug:true}
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"ReloginModal", allowedRetry:3, debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	///////////////////////////////////////////////////////////////////////////
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	//#####################################################
	//	relogin 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// relogin 모달 호풀
	//-----------------------------------------------------
	relogin = () => {
 		this._debug("relogin:"+this._isOpen);
		if (this._isOpen) {
			return;
		}
		this._open();
		
		return new Promise((resolve) => {
			this._onLoginSuccess = resolve;
		});
	}//end-relogin
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//relogin 관련
	//#####################################################



	
	//#####################################################
	//	기타 관련
	//-----------------------------------------------------
	//-----------------------------------------------------
	//	기타 관련
	//#####################################################
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// modal open
	//-----------------------------------------------------
	_open = () => {
		this._isOpen = true;
		if (!this.isInit) {
	    	//닫기버튼
	    	document.getElementById("RELOGIN_CLOSE").addEventListener("click", (e) => {
				this._close();
	    	});
	    	
			//로긴버튼
	    	document.getElementById("RELOGIN_SUBMIT").addEventListener("click", (e) => {
				this._login();
	    	});
			this.isInit = true;
		}
		this._onLoginSuccess = null;
		document.getElementById("RELOGIN_USER_PWD").value = "";
		//modal은 jquery기반
		$("#reloginModal").modal({backdrop: 'static'});
	}//end-_open
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// modal close
	//-----------------------------------------------------
	_close = () => {
		this._isOpen = false;
		//modal은 jquery기반
		$("#reloginModal").modal('hide');
	}//end-_close
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// retry assert
	//-----------------------------------------------------
	_assertRetry = () => {
		if (this._retryCnt >= this._settings.allowedRetry) {
			this.alert("하용되는 로긴시도 횟수("+this._settings.allowedRetry+")를 초과 하였습니다.");
			window.top.location.href = '/';
		}
	}//end-_assertRetry
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// login
	//-----------------------------------------------------
	_login = () => {
		const pwdEl = document.getElementById("RELOGIN_USER_PWD");
		if (!pwdEl.value) {
			alert("암호를 입력하세요.");
			pwdEl.focus();
			
		} else {
	    	const param = {
	    			COMPANY_CD	: SS_USER_INFO.COMPANY_CD,
	        		USER_ID		: SS_USER_INFO.USER_ID,
	        		USER_PWD	: pwdEl.value
	        	};
	        	
	        let data;
	        if (this._settings.PUBLIC_KEY) {
		        const crypt = new JSEncrypt();
				crypt.setPrivateKey(this._settings.PUBLIC_KEY);
				data = "enc=R&json="+escape(encodeURIComponent(crypt.encrypt(JSON.stringify(param))));
			} else {
				data = "json="+escape(encodeURIComponent(JSON.stringify(param)));
			}
	        
	        this.fetch({url:"/relogin.do", data:data})
	        .then((response) => {
				if (response.erMsg) {
					this.alert(response.erMsg);
					this._retryCnt++;
					this._assertRetry();
				} else {
					this._retryCnt = 0;
					this._close();
					if (this._onLoginSuccess) {
						this._onLoginSuccess(true);
					}
				}
			});
			
		}//} else {
		
	}//end-_login
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================	
		
}//end-class ReloginModal
