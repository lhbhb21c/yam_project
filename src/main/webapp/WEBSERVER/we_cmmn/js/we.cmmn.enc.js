/**
 * 암복호화 class
 * 
 * @author	장은석
 * @since	2022.04.07
 */
class EncUtil extends BaseUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//private 통신에 사용 될 key
	_crossKey;
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"EncUtil", debug:true});
		//CryptoJS assign...
		Object.assign(this, CryptoJS);
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
	//=========================================================================
	// 데이터 포멧
	//-------------------------------------------------------------------------
	//private default format : JSON
	_defaultFormat = {
		//encrypt object stringify format
		stringify : (cipherParams) => {
			//send data default format => {pwd :"???", salt :"???"}
			const jsonObj = {
				//this.xrsa.encrypt(sendKeyData) => key와 salt값 rsa로 encrypt하여 formatting
				key		: this.xrsa.encrypt({
					//encrypt할 때 사용된 key와 생성된 salt 정의
					pwd	 : this._crossKey, 
					salt : cipherParams.salt.toString()
				}),
				//result encode/decode default type Base64
				result	: cipherParams.ciphertext.toString(this.enc.Base64),
			};
			return JSON.stringify(jsonObj);
		},//end-stringify : (cipherParams) => {
		
		//encrypt object parse format
		parse : (encObj) => {
			return JSON.parse(encObj.toString());
		}//end-parse : (encObj) => {
	}//end-_defaultFormat
	//-------------------------------------------------------------------------
	// //데이터 포멧
	//=========================================================================

	
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------

	///////////	////////////////////////////////////////////
	// AES 데이터 암호화
	//-----------------------------------------------------
	xaes = {
//		AES encrypt -> return type JSON string
//-----------------------------------------------------
//			const data = {
//				id : "id",
//				pw : "pw"
//			};
//			const encData = XENC.xaes.encrypt(data,{
//				mode		: false,
//				padding		: false,
//				format		: {
//					stringify : (cipherParams) => {
//						return JSON.stringify(cipherParams);
//					},
//					parse : (encObj) => {
//						return JSON.parse(encObj);
//					}
//				}
//			});
//-----------------------------------------------------
		encrypt : (data, opts) => {
			opts = opts||{};
			opts.format	= opts.format||this._defaultFormat;
			data = (typeof data !== "string")?JSON.stringify(data):data;
			this._debug("aes encrypt start-"+JSON.stringify(data));
			//신규 키 초기화
			const _key = this._crossKey = this._getRandomKey();
//			data : 암호화 대상 데이터
//			_key : 암/복호화에 필요한 키(이후에 rsa로 암호화되어 전송됨)
//			aes 암호화에 개입가능한 옵션 :
//				mode 	: 암호블록방식 || default CBC
//				padding : 블록패딩방식 || default Pkcs7
//				format	: 암호화객체 반환포멧 || default this._defaultFormat;
			const encrypted = this.AES.encrypt(data,_key,{
				mode	: opts.mode||this.mode.CBC,
				padding	: opts.padding||this.pad.Pkcs7,
				format	: opts.format
			});
			this._debug("aes encrypt done-"+JSON.stringify(_key));
			//항상 정의된 format으로 파싱해서 반환
			return opts.format.parse(encrypted);
		},//end xaes encrypt
		
//		AES decrypt -> return type JSON object
//-----------------------------------------------------
//			const decData = XENC.xaes.decrypt(encryptedObject,{
//			format	: {
//		 		parse : (data) => {
//		 			return JSON.parse(data);
//		 		}
//	 		},
//	});
//-----------------------------------------------------
		decrypt	: (encryptObj, key, opts) => {
			opts = opts||{};
			this._debug("aes decrypt start-"+JSON.stringify(opts));
			//CryptoJS aes encrypt되어 반환된 object가 복호화 대상
			const decrypted = this.AES.decrypt(encryptObj, key, {
				format	: opts.format||this._defaultFormat
			});
			this._debug("aes decrypt done-"+JSON.stringify(opts));
			return decrypted;
		}//end xaes decrypt
	}
	
	xrsa = {
//		RSA encrypt
//-----------------------------------------------------
//			const decData = XENC.xaes.decrypt(encryptedObject,{
//				format	: {
//			 		parse : (data) => {
//			 			return JSON.parse(data);
//			 		}
//		 		},
//			});
//-----------------------------------------------------
		encrypt : (data, opts) => {
			opts = opts||{};
			this._debug("rsa encrypt start-"+JSON.stringify(opts));
			const crypt = new JSEncrypt();
			//rsa 공개키 set
			crypt.setPrivateKey(ENV.PUBLIC_KEY);
			if (opts.format) {
				data = opts.format(data)
			} else {
				data = JSON.stringify(data)
			}
			this._debug("rsa encrypt done-"+JSON.stringify(opts));
			return crypt.encrypt(data);
		},
//		RSA decrypt
//-----------------------------------------------------
//			const decData = XENC.xaes.decrypt(encryptedObject,{
//				format	: {
//			 		parse : (data) => {
//			 			return JSON.parse(data);
//			 		}
//				},
//			});
//-----------------------------------------------------
		decrypt : () => {
			//TODO
			//rsa.js
		}
	}
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================
	
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	//get new random key
	_getRandomKey = (encStr) => {
		//TODO
		//... 난수표 ... =>
		
		this._debug("_getRandomKey start-"+JSON.stringify(encStr));
		encStr = encStr||"zy1ql03kOE8Y0JiUXOqvaCROLsyacWRxB4m1Btx/s6w=";
		this._debug("_getRandomKey done-"+JSON.stringify(encStr));
		//AES로 임의의 문자 encrypt하여 떨어진 ct값 문자 변환하여 사용
		return this.AES.encrypt(encStr,"/JBintBojOv/JjebELwR+qN8xf/9N05ekdkKPBl7wUs=").ciphertext.toString(this.enc.Base64);
	}
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================	
		
}//end-class EncUtil
