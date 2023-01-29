/**
 * utility class 최상위
 * 
 * @author	염국선
 * @since	2021.12.30
 */
class BaseUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//configuration
	_settings = {name:"BaseUtil", debug:true};
	//암복호화 모듈
	_cipher = null;
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		this._settings = this.extend(this._settings, settings);
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	//#####################################################
	//	판단/여부 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// 입력여부 확인
	//-----------------------------------------------------
	isEmpty = (val) => {
		return !val && val !== 0 && val !== false;
	}//end-isEmpty
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 문자/숫자에 상관없이 같은 값인지 여부
	//	- 둘다 비어있어도(undefined,NaN,Nan,space) 같음
	//-----------------------------------------------------
	isEq = (val1, val2) => {
		if (this.isEmpty(val1) && this.isEmpty(val2)) {
			return true;
		} else if (typeof(val1) === "number" && typeof(val2) === "string") {
			return val1 + "" === val2;
		} else if (typeof(val1) === "string" && typeof(val2) === "number") {
			return val1 === val2 + "";
		}
		
		return val1 === val2;
	}//end-isEq
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 해당값이 비교항목들중에 일치 하는것이 있는지 여부
	//	- 비교항목이 배열일 경우 배열 내용으로 비교
	//-----------------------------------------------------
	isIn = (val, ...compares) => {
		let exist = false;
		for (let i=0; i<compares.length; i++) {
			if (typeof(compares[i]) === "string") {
				if (val === compares[i]) {
					exist = true;
					break;
				}
				
			} else if (Array.isArray(compares[i])) {
				for (let j=0; j<compares[i].length; j++) {
					if (val === compares[i][j]) {
						exist = true;
						break;
					}
				}
				if (exist) {
					break;
				}
			}
		}//end-for
		
		return exist;
	}//end-isIn
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 해당값이 비교항목들중에 포함된값이 하는것이 있는지 여부
	//-----------------------------------------------------
	isContain = (val, ...compares) => {
		let exist = false;
		if (typeof(val) === "string") {
			for (let i=0; i<compares.length; i++) {
				if (val.indexOf(compares[i]) !== -1) {
					exist = true;
					break;
				}
			}
		}
		
		return exist;
	}//end-isContain
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 숫자 여부
	//-----------------------------------------------------
	isNum = (val) => {
		return (typeof(val) === "number" && isFinite(val)) || (typeof(val) === "string" && /^[0-9|\.]+$/.test(val));
	}//end-isNum
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// PC 여부
	//-----------------------------------------------------
	isPc = () => {
		try {
			return this.isContain(window.navigator.platform.toLowerCase(), 'win16', 'win32', 'win64', 'mac', 'macintel');
		} catch (e) {
			console.log(e);
		}

		return false;
	}//end-isPc
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// mobile 여부
	//-----------------------------------------------------
	isMobile = () => {
		try {
			return this.isContain(window.navigator.platform.toLowerCase(), 'iphone', 'ipod', 'ipad', 'android', 'blackberry', 
					'windows ce', 'nokia', 'webos', 'opera mini', 'sonyericsson', 'opera mobi', 'iemobile', 'mot');
		} catch (e) {
			console.log(e);
		}

		return false;
	}//end-isMobile
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//판단/여부 관련
	//#####################################################
	
	
	//#####################################################
	//	숫자 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// 정수변환, 오류시 0
	//-----------------------------------------------------
	toInt = (val) => {
		try {
			const intVal = parseInt(typeof(val) === "string" ? val.replace(/[,]/g, '') : val);	//숫자포맷인 콤머 제거
			if (intVal) {
				return intVal;
			}
		} catch (e) {
			console.log(e);
		}
		
		return 0;
	}//end-toInt
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 숫자변환, 오류시 0
	//-----------------------------------------------------
	toNum = (val) => {
		try {
			const numVal = Number(typeof(val) === "string" ? val.replace(/[,]/g, '') : val);	//숫자포맷인 콤머 제거
			if (numVal) {
				return numVal;
			}
		} catch (e) {
			console.log(e);
		}
		
		return 0;
	}//end-toNum
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 실수변환, 오류시 0
	//-----------------------------------------------------
	toFloat = (val) => {
		try {
			const floatVal = parseFloat(typeof(val) === "string" ? val.replace(/[,]/g, '') : val);	//숫자포맷인 콤머 제거
			if (floatVal) {
				return floatVal;
			}
		} catch (e) {
			console.log(e);
		}
		
		return 0;
	}//end-toFloat
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 반올림
	//-----------------------------------------------------
	round = (val, dec = 0) => {
		try {
			const d = this.toNum(val);
			return Math.round(d * Math.pow(10, dec)) / Math.pow(10, dec);
		} catch (e) {
			console.log(e);
		}
		
		return 0;
	}//end-round
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 올림
	//-----------------------------------------------------
	ceil = (val, dec = 0) => {
		try {
			const d = this.toNum(val);
			return Math.ceil(d * Math.pow(10, dec)) / Math.pow(10, dec);
		} catch (e) {
			console.log(e);
		}
		
		return 0;
	}//end-ceil
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 내림
	//-----------------------------------------------------
	floor = (val, dec = 0) => {
		try {
			const d = this.toNum(val);
			return Math.floor(d * Math.pow(10, dec)) / Math.pow(10, dec);
		} catch (e) {
			console.log(e);
		}
		
		return 0;
	}//end-floor
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 소숫점 자릿수 반환, 숫자가 아닐경우 -1
	//-----------------------------------------------------
	digit = (val) => {
		if(this.isNum(val)) {
			const str = this.toNum(val) + "";
			const idx = str.indexOf(".");
			if (idx >= 0) {
				return str.length - idx - 1;
			}
			return 0;
		}
		
		return -1;
	}//end-digit
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 가장작은 숫자 반환
	//-----------------------------------------------------
	minNum = (...nums) => {
		let minVal = 0;
		try {
			if (nums.length > 0) {
				minVal = this.toNum(nums[0]);
			}
			for (let i=0; i<nums.length; i++) {
				if (Array.isArray(nums[i])) {
					for (let j=0; j<nums[i].length; j++) {
						const num = this.toNum(nums[i][j]);
						if (num < minVal) {
							minVal = num;
						}
					}
				} else {
					const num = this.toNum(nums[i]);
					if (num < minVal) {
						minVal = num;
					}
				}
			}
			
		} catch (e) {
			console.log(e);
		}
		
		return minVal;
	}//end-minNum
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 가장큰 숫자 반환
	//-----------------------------------------------------
	maxNum = (...nums) => {
		let maxVal = 0;
		try {
			for (let i=0; i<nums.length; i++) {
				if (Array.isArray(nums[i])) {
					for (let j=0; j<nums[i].length; j++) {
						const num = this.toNum(nums[i][j]);
						if (num > maxVal) {
							maxVal = num;
						}
					}
				} else {
					const num = this.toNum(nums[i]);
					if (num > maxVal) {
						maxVal = num;
					}
				}
			}
			
		} catch (e) {
			console.log(e);
		}
		
		return maxVal;
	}//end-maxNum
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// number format
	//-----------------------------------------------------
	formatNum = (val, digit) => {
		let ret = val;
		try {
			if (val) {
				const src = val.toString().replace(/[^\d\.]/g, '').split("\.");
				const regexp = /\B(?=(\d{3})+(?!\d))/g;
				src[0] = src[0].replace(regexp, ',');
				
				ret = src[0];
				if (this.isEmpty(digit)) {
					if (src.length > 1 && src[1].length > 0) {
						ret += "." + src[1];
					}

				} else {
					if (src.length > 1) {
						ret += "." + this.rpad(src[1], "0", digit);
					} else {
						ret += "." + this.fill("0", digit);
					}
				}

			}
		} catch (e) {
			console.log(e);
		}
		
		return ret;
	}//end-formatNum
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 한글 숫자 변환
	//-----------------------------------------------------
	toKorNum = (val) => {
		try {
			if (val) {
				const ar1 = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
				const ar2 = ['', '십', '백', '천'];
				const ar3 = ['', '만', '억', '조', '경', '해', '자', '양', '구', '간', '정', '재', '극'];
				
				let ret = "";
				//src[0]: 정수부, src[1]:소숫점아래
				const src = val.toString().replace(/[^\d\.]/g, '').split("\.");
				
				//정수부 처리
				let cnt = 0; //단위당(4) 영이 아닌 건수
				for (let i=0; i<src[0].length; i++) {
					const idx1 = parseInt(src[0][i]);
					const idx2 = (src[0].length-i-1)%4;
					const idx3 = parseInt((src[0].length-i)/4);
					
					cnt += idx1 ? 1 : 0;
					
					const han1 = ar1[idx1];
					const han2 = idx1 ? ar2[idx2] : "";
					const han3 = (cnt && !idx2) ? ar3[idx3] : "";
					
					ret	+= han1 + han2 + han3;
					
					if (!idx2) {
						cnt = 0;
					}
				}//end-for (let i=0; i<src[0].length; i++) {
				
				//소수부 처리
				if (src.length > 1) {
					ret += "."
					ar1[0] = "영";
					for (let i=0; i<src[1].length; i++) {
						const idx1 = parseInt(src[1][i]);
						const han1 = ar1[idx1];
						ret += han1;
					}
				}//end-if (src.length > 1) {
				
				return ret;
			}//end-if (val) {
		} catch (e) {
			console.log(e);
		}
		
		return val;
	}//end-toKorNum
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//숫자 관련
	//#####################################################


	//#####################################################
	//	문자 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// 문자열 반복하여 해당 길이만큼 반환
	//-----------------------------------------------------
	fill = (chr, len) => {
		let ret = "";
		if (typeof(chr) === "string" && chr) {
			while (ret.length < len) {
				ret += chr;
			}
			ret = ret.substring(0, len);
		}
		
		return ret;
	}//end-fill
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 원본문자열 오른쪽에 반복하여 문자열을 붙여 길이만큼 반환
	//-----------------------------------------------------
	rpad = (val, chr, len) => {
		let ret = val;
		if (this.isEmpty(val)) {
			ret = "";
		}
		
		if (ret.length < len) {
			ret += this.fill(chr, len - ret.length);
		}
		
		return ret;
	}//end-rpad
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// trim
	//-----------------------------------------------------
	trim = (val) => {
		if (!this.isEmpty(val)) {
			const type = typeof(val);
			if (type === "string") {
				return val.trim();
			} else if (type === "number") {
				return val.toString();
			}
		}

		return "";
	}//end-trim
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//문자 관련
	//#####################################################


	//#####################################################
	//	객체 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// dot 로 이어진 객체속성명경로에 따른 값 반환 
	//	- tgt	: target map
	//	- path	: dot로 이어진 속성 경로명
	//	- val	: 설정할 값
	//-----------------------------------------------------
	getWithPath = (tgt, path) => {
		const nodes = path.split("\.");
		let map = tgt;
		
		for (let i=0; i<nodes.length; i++) {
			if (i === nodes.length - 1) {
				return map[nodes[i]];
			} else {
				if (map[nodes[i]]) {
					map = map[nodes[i]]
				} else {
					break;
				}
			}
		}
	}//end-getWithPath
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// dot 로 이어진 객체속성명경로에 따른 값 설정 
	//	- tgt	: target map
	//	- path	: dot로 이어진 속성 경로명
	//	- val	: 설정할 값
	//-----------------------------------------------------
	setWithPath = (tgt, path, val) => {
		const nodes = path.split("\.");
		let map = tgt;
		
		for (let i=0; i<nodes.length; i++) {
			if (i === nodes.length - 1) {
				map[nodes[i]] = val;
			} else {
				if (map[nodes[i]]) {
					map = map[nodes[i]]
				} else {
					break;
				}
			}
		}
	}//end-setWithPath
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 객체의 특정 속성항목들을 복사 
	//	- tgt	: target map
	//	- src	: source map
	//	- name	: 속성명/배열
	//-----------------------------------------------------
	copyMap = (tgt, src, name) => {
		if (!Array.isArray(name)) {
			name = [name];
		}

		for (let i=0; i<name.length; i++) {
			tgt[name[i]] = src[name[i]];
		}

		return tgt;
	}//end-copyMap
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 객체에 다른 객체들의 속성값 복사
	//	- tgt	: target object
	//	- src	: source objects
	//-----------------------------------------------------
 	extend = (tgt, ...src) => {
 		for (let i=0; i<src.length; i++) {
			if (typeof(src[i]) === "object") {
	 			Object.keys(src[i]).forEach((key) => {
	 				tgt[key] = src[i][key]; 
	 			});
			}
 		}

 		return tgt;
 	}//end-extend
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 객체에 다른 객체들의 데이터값 복사
	//	- tgt	: target object
	//	- src	: source objects
	//-----------------------------------------------------
 	cloneData = (tgt, ...src) => {
 		for (let i=0; i<src.length; i++) {
 			src[i] = JSON.parse(JSON.stringify(src[i]));
 		}
 		Object.assign(tgt, ...src);

 		return tgt;
 	}//end-cloneData
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// object 내용 clear
	//		- valueOnly: true 일 경우 object의 속성값이 object인 경우에는 object(not array)만 clear 이외에는 속성 삭제
	//-----------------------------------------------------
	empty = (obj, valueOnly) => {
		try {
			if (Array.isArray(obj)) {
				obj.splice(0)
			} else if (typeof(obj) === "object") {
				if (valueOnly) {
					Object.keys(obj).forEach((key) => {
						const val = obj[key];
						if (typeof(val) === "object") {
							this.empty(val);
						} else {
							delete obj[key];
						}
					});
				} else {
					Object.keys(obj).forEach((key) => {
						delete obj[key];
					});
				}
			}
		} catch (e) {
			console.log(e);
		}

		return obj;
	}//end-empty
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// object print
	//-----------------------------------------------------
	printObj = (obj, lvl = 3, prefix = "R-") => {
		if (lvl !== 0) {
			Object.keys(obj).forEach((key) => {
				const val = obj[key];
				console.log(prefix + key + ":" + val);
				if (typeof(val) === "object") {
					this.printObj(val, (lvl - 1), prefix+" -");
				}
			});
		}
	}//end-printObj
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//객체 관련
	//#####################################################


	//#####################################################
	//	배열 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// 목록의 해당 컬럼값이 일치 하는 데이터 검색
	//	- name/value는 이름/검색값, 배열/배열, 배열/배열-배열 로 검색 가능
	//	- single 이면 첫번째 발견시 바로 반환
	//-----------------------------------------------------
	findRows = (list, name, value, single = false) => {
		const find = [];
		//비교값이 배열일 경우 배열항목을 타입에 관계없이 비교한다
		const equals = (val1, val2) => {
			if (val1 && Array.isArray(val2)) {
				for (let i=0; i<val2.length; i++) {
					if (this.isEq(val1, val2[i])) {
						return true;
					}
				}
				return false;
			}
			return this.isEq(val1, val2);
		}
		
		if (!Array.isArray(name)) {
			name = [name];
			value = [value];
		}
		
		for (let i=0; i<list.length; i++) {
			for (let j=0; j<name.length; j++) {
				if (equals(list[i][name[j]], value[j])) {
					find.push(list[i]);
					break;
				}
			}
			if (single && find.length > 0) {
				break;
			}
		}

		return find;
	}//end-findRows
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록의 해당 컬럼값 변경
	//	- name/value는 이름/값, 배열/배열 로 적용 가능
	//-----------------------------------------------------
	applyRows = (list, name, value) => {
		if (!Array.isArray(name)) {
			name = [name];
			value = [value];
		}
		
		for (let i=0; i<list.length; i++) {
			for (let j=0; j<name.length; j++) {
				list[i][name[j]] = value[j];
			}
		}

		return list;
	}//end-applyRows
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록의 해당 row 추가
	//	- row는 row/row배열
	//	- idx는 추가할 위치, 지정 안하면 마지막에 추가
	//	- cnt는 추가할 최대 갯수
	//-----------------------------------------------------
	addRows = (list, row, idx, cnt) => {
		if (!Array.isArray(row)) {
			row = [row];
		}

		let start = list.length;
		if (typeof(idx) === "number") {
			start = idx;
		}
		
		if (start < 0) {
			start = 0;
		} else if (start > list.length) {
			start = list.length;
		}
		
		for (let i=0; i<row.length&&(!cnt||i<cnt); i++) {
			list.splice(start+i, 0, row[i]);
		}

		return list;
	}//end-addRows
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록의 해당 컬럼값 변경
	//	- row는 row/row배열
	//-----------------------------------------------------
	removeRows = (list, row) => {
		if (!Array.isArray(row)) {
			row = [row];
		}

		for (let i=0; i<row.length; i++) {
			const idx = list.indexOf(row[i]);
			if (idx !== -1) {
				list.splice(idx, 1);
			}
		}

		return list;
	}//end-removeRows
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록의 해당 row 이동
	//	- row는 row/row배열
	//	- cmd: 'up'/'down'/index
	//-----------------------------------------------------
	moveRows = (list, row, cmd) => {
		if (!Array.isArray(row)) {
			row = [row];
		}

		if (list.length === 0 || row.length === 0) {
			return;
		}
		
		if (typeof (cmd) === "number") {
			this.removeRows(list, row);
			this.addRows(list, row, cmd);
			
		} else if (cmd === "up") {
			for (let i=0; i<row.length; i++) {
				const idx = list.indexOf(row[i]);
				if (idx > 0) {
					list.splice(idx, 1);
					list.splice(idx - 1, 0, row[i]);
				}
			}
		} else if (cmd === "down") {
			for (let i = row.length - 1; i >= 0; i--) {
				const idx = list.indexOf(row[i]);
				if (idx >= 0 && idx < list.length - 1) {
					list.splice(idx, 1);
					this.addRows(list, row[i], idx + 1);
				}
			}
			
		}
		
		return list;
	}//end-moveRows
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록의 각 entity의 대상함목을 복사하여 목록 반환
	//	- name	: entity의 속성명/배열
	//-----------------------------------------------------
	copyRows = (list, name) => {
		if (!Array.isArray(name)) {
			name = [name];
		}

		const ret = [];

		for (let i=0; i<list.length; i++) {
			const entity = this.copyMap({}, list[i], name);
			ret.push(entity);	
		}
		
		return ret;
	}//end-copyRows
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록의 각 entity의 대상함목을 합산
	//	- name	: entity의 속성명/배열
	//-----------------------------------------------------
	sumRows = (list, ...name) => {
		let ret = 0;
		for (let i=0; i<list.length; i++) {
			for (let j=0; j<name.length; j++) {
				ret += this.toNum(list[i][name[j]]);
			}
		}
		
		return ret;
	}//end-sumRows
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록의 항목값을 2차원 배열로 반환
	//-----------------------------------------------------
	getValueMatrix = (list, ...name) => {
		let ret = [];
		for (let i=0; i<name.length; i++) {
			const vals = [];
			for (let j=0; j<list.length; j++) {
				vals.push(list[j][name[i]]);
			}
			ret.push(vals);
		}
		
		return ret;
	}//end-getValueMatrix
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//배열 관련
	//#####################################################
	
	
	//#####################################################
	//	wrapping 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// alert wrapping (추가메세지 허용않함 체크박스 제거)
	//-----------------------------------------------------
	alert = (msg) => {
		alert(msg + "\n[" + new Date().getTime() + "]");
	}//end-alert
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// confirm wrapping (추가메세지 허용않함 체크박스 제거)
	//-----------------------------------------------------
	confirm = (msg) => {
		return confirm(msg + "\n[" + new Date().getTime() + "]");
	}//end-confirm
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// fetch wrapping -> 결과값 json
	//	options:
	//		url: url
	//		data:
	//		body:
	//		custom.NO_RESPONSE_HANDLE	- 응답에 대해 메제지 등 처리하지 않고 넘김
	//-----------------------------------------------------
	fetch = (opts) => {
		//기본옵션
		const options = 
			{
    			method: "POST",
        	    cache: "no-cache",
        		headers: {
        	        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"	//application/json, multipart/form-data
        	    }
    		};
		
		//요청옵션 override
		Object.keys(opts).forEach((key) => {
			if (!this.isIn(key, "url", "data", "body", "settings", "enc")) {
				options[key] = opts[key];
			}
		});
		
		const contentType = options.headers["Content-Type"].toLowerCase();
		const data = opts.body||opts.data;	//body가 우선

		if (data instanceof FormData) {	//multipart/form-data
			//browse에서 bounday와 함계생성하게 비운다
			delete options.headers;
			options.body = data;
			
		} else if (contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
			if (typeof(data) === "object") {
				const search = new URLSearchParams();
				
				if (opts.body) {
					Object.keys(data).forEach((key) => {
						const val = data[key];
						if (typeof(val) === "object") {
							search.append(key, JSON.stringify(val));
						} else {
							search.append(key, val);
						}
					});
					
				} else if (opts.data) {
					//data항목일 경우 object일 경우 json이름으로 object를 json문자열로 변환하여 url encoding 2번처리
					const json = JSON.stringify(data);
					if (opts.enc === true) {
						//암볼호화 모듈
						if (!this._cipher) {
							this._cipher = new EncUtil({debug:this._settings.debug});
						}
						const encData = this._cipher.xaes.encrypt(json);
						search.append("enc", "json");
						search.append("key", encData.key);	//{pwd:"xxx", salt:"yyy"} -> RSA암호화
						search.append("json", encodeURIComponent(encData.result));
						
					} else {
						search.append("json", encodeURIComponent(json));
					}
				}
				options.body = search.toString();
				
			} else {
				options.body = data;
			}
			 
 		} else if (contentType.indexOf("application/json") !== -1) {
			if (typeof(val) === "object") {
				options.body = JSON.stringify(data);
			} else {
				options.body = data;
			}
			
		} else {
			throw ("처리불가능한 Content-Type:"+contentType);
		}

		//fetch에서 반환된 Promise를 재가공처리하여 에러메세지 처리 및 json변환하여 반환
		return new Promise((resolve, reject) => {
			const settings = opts.settings||{};
			this._debug("fetch:"+opts.url+", settings:"+JSON.stringify(opts.settings));
			
			fetch(opts.url, options)
			.then(response => {
				if (response.status === 200) {
    				return response.json();
				} else {
					throw "status-" + response.status;
				}
			})
			.then(response => {
				if (settings.NO_RESPONSE_HANDLE) {
	        		resolve(response);
				} else {
					if (response.rsltCd == "hasNotSession") {
		        		this.alert(response.rsltMsg||"연결시간이 종료 되었습니다.");
		        		if (top.RELOGIN) {
							top.RELOGIN.relogin();	
						}
	    				reject(response);
	    				
		        	} else if (response.rsltCd == "hasError") {
		        		this.alert(response.rsltMsg||"작업 중 통신에러가 발생 하였습니다.");
	    				reject(response);
	    				
		        	} else {
		        		resolve(response);
		        	}
				}
			
			})//.then(response => {
			.catch(error => {
				if (!settings.NO_RESPONSE_HANDLE) {
					this.alert("통신오류["+error+"]");
				}
				reject(error);
			})
		
		});//new Promise((resolve, reject) => {
	
	}//end-fetch
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//wrapping 관련
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
	// console log
	//-----------------------------------------------------
	_debug = (msg) => {
		if (this._settings.debug) {
	 		console.log(this._settings.name + "-" + msg);
		} 
	}//end-_debug
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class BaseUtil




/**
 * data utility class
 * 
 * @author	염국선
 * @since	2022.01.03
 */
class DataUtil extends BaseUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//공통코드 객체
	_codeFactory = {};
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"DataUtil", session_cmmn_cd: "G_CMMN_CODE_LIST", debug:true});
		this._settings = this.extend(this._settings, settings);
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	//#####################################################
	//	공통코드 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// sessionStorage에 저장된 공통코드 객체 정보 반환
	//-----------------------------------------------------
	getCodeFactory = (name) => {
		name = name||this._settings.session_cmmn_cd;
		
		if (!this._codeFactory[name]) {
			this._codeFactory[name] = JSON.parse(sessionStorage.getItem(name));
			this._debug("getCodeFactory:"+name);
		}
		return this._codeFactory[name];
	}//end-getCodeFactory
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 목록에서 해당코드의 이름 반환
	//	- 코드명/코드이름 정의 하지 않으면 CODE_CD/CODE_NM 사용
	//-----------------------------------------------------
	getCodeName = (codeList, codeVal, codeField, nameField) => {
		codeField = codeField||"CODE_CD";
		nameField = nameField||"CODE_NM";
		
		if (codeList) {
			const find = this.findRows(codeList, codeField, codeVal, true);
			if (find.length === 1) {
				return find[0][nameField];
			}
		}
		
		return codeVal;
	}//end-getCodeName
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 객체/목록에서 코드목록을 사용하여 코드필드에 대응하는 코드이름 필드 추가
	//-----------------------------------------------------
	addCodeNameCol = (dest, codeField, nameField, codeList) => {
		if (Array.isArray(dest)) {
			for (let i=0; i<dest.length; i++) {
				this.addCodeNameCol(dest[i], codeField, nameField, codeList);
			}
		} else {
			if (Array.isArray(codeField)) {
				for (let i=0; i<codeField.length; i++) {
					this.addCodeNameCol(dest, codeField[i], nameField[i], codeList[i]);
				}
			} else {
				dest[nameField] = this.getCodeName(codeList, dest[codeField]);
			}
		}
		
		return dest;
	}//end-addCodeNameCol
	
	//-----------------------------------------------------
	//	//공통코드 관련
	//#####################################################


	//#####################################################
	//	통신 관련
	//-----------------------------------------------------
//	///////////////////////////////////////////////////////
//	// $.ajax wrapping
//	//-----------------------------------------------------
//	//	.ajax({
//	//		url				: "url",
//	//		data			: "parameters",
//	//		customSuccess	: (response) => {
//	//				....
//	//			}
//	//	}).always(() => {
//	//		....
//	//	})
//	//-----------------------------------------------------
//	ajax = (opts) => {
//		//기본 ajax 설정
//		const settings = {
//			async : true,
//			type : 'POST',
//			success : (response) => {
//	        	if(response.rsltCd == 'hasNotSession') {
//	        		alert('연결시간이 종료 되었습니다.');
//	        		if (top.RELOGIN) {
//						top.RELOGIN.relogin();	
//					}
//	        	} else if(response.rsltCd == 'hasError') {
//	        		alert(response.rsltMsg||'작업 중 통신에러가 발생 하였습니다.');
//	        	} else {
//	        		if (opts.customSuccess) {
//	        			try {
//		        			opts.customSuccess(response);
//	        			} catch (e) {
//	        				console.log(e);
//	        			}
//	        		}
//	        	}
//
//			},
//			error : (xhr) => {
//				alert('통신오류[' + xhr.status + ']');
//			}
//		};
//		
//		//요청옵션 override
//		Object.keys(opts).forEach((key) => {
//			if (key !== "customSuccess") {
//				settings[key] = opts[key];
//			}
//		});
//		
//		return $.ajax(settings);
//	}//end-ajax
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// window open 시 request를 post 방식으로 전달
	//-----------------------------------------------------
	openWithPost = (url, param, name, specs) => {
		//name/specs 존재시 새로운탭 혹은 팝업처리임
		if (name || specs) {
			specs = specs||"";
			name = name||"_blank";
			if (name === "_blank") {
				name = "WIN_" + new Date().getTime();
			}
			window.open("", name, specs);
		}
		
		const $form = $("<form></form>");
		$form.attr("method", "post");
		$form.attr("action", url);
		if (name) {
			$form.attr("target", name);
		}
		
		Object.keys(param).forEach((key) => {
			const val = param[key];
			const $input = $("<input name='" + key + "' type:'hidden'></input>");
			$input.val(encodeURIComponent(typeof(val) === "object" ? JSON.stringify(val) : val));
			$form.append($input);
		});
		
		$form.appendTo("body").submit().remove();
	}//end-openWithPost
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// request parameter를 map으로 변환 하여 반환
	//-----------------------------------------------------
	getRequestParamSet = () => {
		const paramSet = {}; 
		const pageUrl = window.location.search.substring(1);
		const pairs = pageUrl.split("&");
		Object.keys(pairs).forEach((key) => {
			const nameAndVal = pairs[key].split("=");
			if (nameAndVal.length === 2) {
				paramSet[nameAndVal[0]] = nameAndVal[1];
			}
		});
		paramSet.OPTIONS = paramSet.OPTIONS||encodeURIComponent(JSON.stringify({multiple:false}));
		
		return paramSet;
	}//end-getRequestParamSet

	///////////////////////////////////////////////////////
	// host URL 반한
	//-----------------------------------------------------
	getHostURL = () => {
		let url = window.location.href;
		const pos = url.indexOf("/", url.indexOf(window.location.hostname) + window.location.hostname.length);
		if (pos !== -1) {
			url = url.substring(0, pos);
		}
		
		return url;
	}//end-getHostURL
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	통신 관련
	//#####################################################
	
	
	//#####################################################
	//	form data 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// validate input field
	//-----------------------------------------------------
	validateInput = (container, opts) => {
		//컨테이너가 없을 경우 전체로
		container = container||"body";
		//옵션이 없을 경우 기본옵션 설정
		opts = opts||{alert:true, focus:true};
		//validation 결과 처리
		const assertValid = (validation, opts) => {
			if (!validation.isValid) {
				if (opts.alert) {
					this.alert(validation.invalid.erMsg);
				}
				if (opts.focus) {
					validation.invalid.input.focus();
				}
			}
			return validation;
		};
		//반환될 데이터검증 결과
		const validation = {
			isValid		: true,
			validInputs	: null,
			invalid		: {
				validType	: null,
				input		: null,
				erMsg		: null
			}
		}
		//검증해당 컬럼 검색
		validation.validInputs = $("input[validTypes], select[validTypes], textarea[validTypes]", container);
		//입력데이터 검증
		for (let i=0; i<validation.validInputs.length; i++) {
			const $input = validation.validInputs.eq(i);
			const validTypes = ($input.attr("validTypes")||"required").split(",");
			for (let j=0; j<validTypes.length; j++) {
				const validType = validTypes[j];
				if (validType === "required") {
					if (!$input.val() || $input.val() === "? undefined:undefined ?" || $input.val() === "? string: ?") {
						validation.isValid = false;
						validation.invalid.validType = validType;
						validation.invalid.input = $input;
						validation.invalid.erMsg = $input.attr("validName") + " 항목은 필수 입력 입니다.";
						return assertValid(validation, opts);
					}
				}
			}//end-for (let j=0; j<validTypes.length; j++) {
		}//end-for (let i=0; i<$inputs.length; i++) {

		return validation;
	}//end-validateInput
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// validate hour-minute
	//-----------------------------------------------------
	validHM = (val) => {
		try {
			if (typeof(val) === "number") {
				val = val + "";
			}
			if (val === "2400") {
				return true;
			}
			if (val.length === 4 && /^[0-9]*$/.test(val)) {
				hour = parseInt(val.substring(0,2));
				if (hour < 0 || hour > 23) {
					return false;
				}
				minute = parseInt(val.substring(2,4));
				if (minute < 0 || minute > 59) {
					return false;
				}
				return true;
			}
		} catch (e) {
			console.log(e);
		}
		
		return false;
	}//end-validHM
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// hour:minute format
	//-----------------------------------------------------
	formatHM = (val) => {
		try {
			if (val) {
				val = val.substring(0,2) + ":" + val.substring(2,4);
			}
		} catch (e) {
			console.log(e);
		}
		
		return val;
	}//end-formatHM
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//form data 관련
	//#####################################################
	
	
	//#####################################################
	//	기타 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// top window message handler - create
	//-----------------------------------------------------
	_getOrCeateTopMessageHandler = (name) => {
		const handlerName	= "_topMsgHandler_"+name;
		if (window.top.document[handlerName]) {
			try {
				window.top.document[handlerName].alive();
			} catch(e) {
				this._debug("삭제된 TopMessageHandler 재생성...");
				window.top.document[handlerName] = null;
			}
		}
		if (!window.top.document[handlerName]) {
			this._debug("create top window message handler:"+name);
			//TODO:복잡도가 심해지면 외부로 추출예정
			const handler = () => {
 				const _listeners = [];
				const _listen = (id, listener) => {
					if (listener) {
						const find = this.findRows(_listeners, "id", id, true);
						if (find.length > 0) {
 							find[0].listener = listener;
 							this._debug("top window message handler->listen:"+name+", listeners:"+_listeners.length+", update:"+id);
						} else {
							_listeners.push({id:id, listener:listener});
							this._debug("top window message handler->listen:"+name+", listeners:"+_listeners.length+", add:"+id);
						}
					}
				};
				const _send = (data) => {
					const _deadListeners = [];
					for (let i=0; i<_listeners.length; i++) {
						try {
							_listeners[i].listener(data);
							this._debug("listen:"+_listeners[i].id);
						} catch(e) {
							_deadListeners.push(_listeners[i]);
						}
					}
					if (_deadListeners.length > 0) {
						this.removeRows(_listeners, _deadListeners);
					}
					//console.log("top window message handler->send:"+name+", listeners:"+_listeners.length)
				};
				const _method = {
					listen	: _listen,
					send	: _send,
					alive	: () => {}
				};
				
				return _method;
 			};//end-handler
			
			window.top.document[handlerName] = handler();
		}

		return window.top.document[handlerName];
	}//end-_getOrCeateTopMessageHandler
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// top window listener - listen
	//-----------------------------------------------------
	// ex) .listenTopMessage("ITM_CHANGE", "/std/ITM_MNG", (data) => { ... }
	//-----------------------------------------------------
	listenTopMessage = (name, id, listener) => {
		this._getOrCeateTopMessageHandler(name).listen(id, listener);
	}//end-listenTopMessage
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// top window listener - trigger
	//-----------------------------------------------------
	//	ex) .sendTopMessage("ITM_CHANGE", { name:"SAVE", ITM_CD:$"XXX" })
	//-----------------------------------------------------
	sendTopMessage = (name, data) => {
		this._getOrCeateTopMessageHandler(name).send(data);
		this._debug("sendTopMessage:"+JSON.stringify(data));
	}//end-sendTopMessage
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	기타 관련
	//#####################################################
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================	
		
}//end-class DataUtil




/**
 * 공통 utility class
 * 
 * @author	염국선
 * @since	2022.01.03
 */
class CmmnUtil extends DataUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"CommUtil", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================	
		
}//end-class CmmnUtil




/**
 * popup utility class
 * 
 * @author	염국선
 * @since	2022.01.10
 */
class PopUtil extends DataUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//현재 작업 ID
	_popId = 0;
	//popup call list
	_listeners = [];
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"PopUtil", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// 팝업 윈도우 호출
	//	type:	팝업유형(EMP/CLIENT)
	//	options: 팝엄호출 옵션
	//		공통 - 
	//			multiple - true/false,
	//			listenerNone - true/false, 리스너 존재않함
	//			listenerKeep - 리스너 유지는 callback일때만
	//	callback: setResult를 여러번 처리 할 경우, 이외는 promise 반환
	//-----------------------------------------------------
	popup = (win, options, callback) => {
		win.name = win.name||"_BLANK";
		win.specs = "toolbar=0, scrollbars=1, location=0, status=0, menubar=0, resizable=1, width=800, height=640 , left=200, top=100, " + (win.specs||"");
		const popData = {
				id		:	++this._popId,
				win		:	win,
				options	:	options
			};
		
		if (win.method && win.method.toUpperCase("POST")) {
			this.openWithPost(win.url+(win.url.indexOf("?") === -1 ? "?" : "&")+"ID="+popData.id, {OPTIONS:options}, win.name, win.specs);
		} else {
	    	window.open(win.url+(win.url.indexOf("?") === -1 ? "?" : "&")+"ID="+popData.id+"&OPTIONS="+encodeURIComponent(JSON.stringify(options)), win.name, win.specs);
		}
		
		if (popData.options.listenerNone) {
			this._debug("listenerNone");
		} else {
			this._listeners.push(popData);
			this._debug("popup listener:"+popData.id+","+win.url);
			if (callback) {
				popData.callback = callback;
				popData.options.listenerKeep = true;
			} else {
				popData.options.listenerKeep = false;
				return new Promise((resolve) => {
					popData.callback = resolve;
				});
			}
		}
	}//end-popup
 	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 팝업 윈도우 호출
	//	id:	팝업ID
	//	resultSet: 전송데이터
	//	callbackKeep: 전송 후 리스터 유지
	//-----------------------------------------------------
	setResult = (id, resultSet, listenerKeep) => {
		const listeners = this.findRows(this._listeners, "id", id, true);
		
		if (listeners.length > 0) {
			const listener = listeners[0];
			
			if (listener.callback) {
				const list = this._parseResultData(resultSet);
				const data = listener.options.multiple ? list : (list.length === 0 ? null : list[0]);
				listener.callback(data);
				this._debug("setResult:"+JSON.stringify(data));
			}

			if (!listener.options.listenerKeep || !listenerKeep) {
				this._listeners.splice(this._listeners.indexOf(listener), 1);
				this._debug("listener remove:"+id);
			}
		}

	}//end-setResult
 	///////////////////////////////////////////////////////
 	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// 전송할 결과 데이터의 속성은 숫자/영문으로 시작하는 항목만
	//-----------------------------------------------------
	_parseResultData = (resultSet) => {
		const list = [];
		if (!Array.isArray(resultSet)) {
			if (resultSet) {
				resultSet = [resultSet];
			}
		}

		//숫자/영문으로 시작되는 컬럼만
		for (let i=0; i<resultSet.length; i++) {
			const data = {}
			Object.keys(resultSet[i]).forEach((key) => {
				if (/^[0-9a-zA-Z]/.test(key)) {
					data[key] = resultSet[i][key];
				}
			});
			list.push(data);
		}

		return list;
	}//end-_parseResultData
 	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================	
		
}//end-class PopUtil




/**
 * 파일 관련
 * 
 * @author	염국선
 * @since	2022.01.11
 */
class FileUtil extends DataUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"FileUtil", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// 파일 업로드 : 파일을 선택하여 파라메터와 함께 url 호출하여 결과 JSON 전달
	//-----------------------------------------------------
	//	blockUI.start();
	//	XFILE.upload({
    //		url			: "/std/cmmn/upload.do",
    //		data		: {FILE_BINDER_GB : "NOTICE"}, //기존데이터 추가일 경우 {FILE_BINDER_ID : "NOTICE-0000000001"},	 ID지정시 FILE_BINDER_VALID : "N"
	//		accept		: ".xlsx, .docx, .pptx, .html, image",	//[optional]
	//		multiple	: false,	//true 시 다중선택, 	[optional] default false
	//		limit_cnt	: 10,		//다중선택시 선택최대수,	[optional] 
	//		before		: (opts) => {
	//			blockUI.start();
	//		}
    //	})
    //	.then(response => {alert("성공:"+JSON.stringify(result));})
    //	.finally(() => {
    //		blockUI.stop();
    //	});
	//-----------------------------------------------------
	upload = (opts) => {
		this._debug("upload - "+JSON.stringify(opts));
    	return new Promise((resolve, reject) => {
    		opts.accept = opts.accept||".xlsx, .docx, .pptx, .pdf, .html, image"; 
        	const $file = $('<input type="file" accept="' + opts.accept + '"/>');
        	if (opts.multiple) {	//다중선택
            	$file.attr("multiple", "multiple");
        	}
        	$file.change((e) => {
        		const limit = opts.multiple ? opts.limit_cnt||3 : 1;
        		if ($file[0].files.length > limit) {
        			alert("첨부 가능한 파일 수는 " + limit + "개 입니다.");
        			reject("첨부 가능한 파일 수는 " + limit + "개 입니다.");
        			
        		} else if ($file[0].files.length > 0) {
                 	const formData = new FormData();
                 	if (opts.data) {
                 		Object.keys(opts.data).forEach((key) => {
                 			formData.append(key, opts.data[key]);
                 		});
                 	}
                	for (let i=0; i<$file[0].files.length; i++) {
                    	formData.append("file"+i, $file[0].files[i]);
                	}

            		//전송전처리
            		if (opts.before) {
            			opts.before(opts);
            		}
            		
                	this.fetch({
						url: opts.url||"/std/cmmn/fl/upload.do",
						data: formData
                	})
                	.then((response) => {
                		resolve(response);
                	})
                	.catch((error) => {
                		reject(error);
                	});
        		}//end-if ($file[0].files.length === 1) {
        	});
        	$file.trigger("click"); //파일선택 이벤트 발생시킴
    		
    	});
	}//end-upload
 	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// file download as post request
	//-----------------------------------------------------
	download = (url, param) => {
		this._debug("download - navigator.userAgent:\n"+navigator.userAgent);
		if (/Edg/.test(navigator.userAgent)) {
			if (window.opener) {
// 				this.openWithPost(url, param, "WIN_" + new Date().getTime());
				this.openWithPost(url, param);
			} else {
				this.openWithPost(url, param);
			}
		} else {
			this.openWithPost(url, param);
		}
	}//end-download
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	//get extension
	//-----------------------------------------------------
	getExtentsion = (name) => {
		const pos = name.lastIndexOf(".");
		if (pos > 0) {
			return name.substring(pos+1);
		}
		return "";
	}//end-getExtentsion 	
	///////////////////////////////////////////////////////
 	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================	
		
}//end-class FileUtil




/**
 * 엑셀처리 관련
 *	- XLSX 관련 import -/WEBSERVER/we_std/js/lib/js-xlsx/xlsx.full.min.js
 *
 * @author	염국선
 * @since	2022.01.20
 */
class ExcelUtil extends DataUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"ExcelUtil", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// workbook 작성
	//-----------------------------------------------------
	// 	const wb = {
	// 			SheetNames	: [],
	// 			Sheets		: {}
	// 		};
	//-----------------------------------------------------
	instanceWorkbook = () => {
		this._debug("instanceWorkbook");
		const wb = XLSX.utils.book_new();
		return wb;
	}//end-instanceWorkbook
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// sheet작성 후 추가
	//	config {
	//		type: "normal",	//normal,simple
	//		sheetName: "sheet 1",
	//		showHeader: true,
	//		title	: "제목",
	//		columns : [{name:"A", label:"항목A"}],
	//		data	: [],
	//		styles	: 
	//					{ 
	//						titleStyle: {}, 
	//						headerStyle: {}, 
	//						dataStyle:{}
	//					}
	//	}
	//-----------------------------------------------------
	buildWorksheet = (wb, config) => {
		config	= config||{};
		this._debug("buildWorksheet - name:"+config.sheetName+", showHeader:"+config.showHeader+", columns:\n"+JSON.stringify(config.columns));

		config.sheetName	= config.sheetName||"sheet 1";
		config.columns		= config.columns||[];
		config.data			= config.data||[];
		config.styles		= config.styles||{};
		
		if (!this.isIn(config.type, "normal", "simple")) {
 			throw "정의되지 않은 시트유형 - config.type:"+config.type;
		}
		
 		const ws		= {};
		const colWiths	= [];	//컬럼너비
		const merges	= [];	//merge 정보 목록
		
 		//title cell style
 		const titleStyle = config.styles.titleStyle || this._getDefaultCellStyle("titleStyle"); 
 		//header cell style
 		const headerStyle = config.styles.headerStyle || this._getDefaultCellStyle("headerStyle"); 
 		//data cell style
 		const dataStyle = config.styles.dataStyle || this._getDefaultCellStyle("dataStyle");

 		let ln	= 0;	//line 번호

 		//타이틀 작성
 		if (config.showTitle) {
 			this._addCell(ws, ln, 0, config.title, {s:titleStyle});
 	 		merges.push({s:{r:ln, c:0}, e:{r:ln+2, c:config.columns.length-1}});
 			ln += 3;
 		}
 		
 		//헤더부 작성
 		if (config.showHeader) {
 			for (let i=0; i<config.columns.length; i++) {
 				let colW = this.toInt(config.columns[i].width);
 				colW = colW === 0 ? 300 : colW; 
 				colWiths.push({wpx:colW});
 				this._addCell(ws, ln, i, config.columns[i].label, {s:headerStyle});
 			}
 			ln++;
 		}
		this._debug("buildWorksheet - cols with:"+JSON.stringify(colWiths));
 		
		//유형별 데이터부 작성
		for (let i=0; i<config.data.length; i++) {
			for (let j=0; j<config.columns.length; j++) {
 				this._addCell(ws, i+ln, j, config.data[i][config.columns[j].name], {s:dataStyle});
			}
		}
		ln += config.data.length;
 		
		//sheet range 설정
		const range = {
				s: {c: 0, r: 0},
				e: {c: config.columns.length-1, r: ln}
			};
		const sheetRef = XLSX.utils.encode_range(range);
		
		ws["!ref"]		= sheetRef;
		ws["!cols"]		= colWiths;
		ws["!merges"]	= merges;

		//sheet 설정 - wb.SheetNames.push(config.sheetName); wb.Sheets[config.sheetName] = ws;
 		XLSX.utils.book_append_sheet(wb, ws, config.sheetName);

 		this._debug("buildWorksheet done:"+sheetRef);
	}//end-buildWorksheet
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// workbook을 엑셀파일로 저장
	//-----------------------------------------------------
	//	XLSX.writeFile(wb, filename);
	//-----------------------------------------------------
	saveWorkbook = (wb, filename) => {
		this._debug("saveWorkbook:"+filename);

		//엑셀작성 문자열 작성
 		const wbout = XLSX.write(wb, {
 			bookType: 'xlsx',
 			bookSST: true,
 			type: 'binary'
 		});
 		
 		//작성한 엑셀을 Uint8Array 로 변환
 		const arrBuf = new ArrayBuffer(wbout.length);
 		const unit8Arr = new Uint8Array(arrBuf);
 		for (let i=0; i<wbout.length; ++i) {
 			unit8Arr[i] = wbout.charCodeAt(i) & 0xFF;
 		}
 		
 		//엑셀저장
 		saveAs(new Blob([arrBuf], {type: "application/octet-stream"}), filename);
		
	}//end-saveWorkbook
 	
	///////////////////////////////////////////////////////
	// 엑셀(.xlsx)파일은 선택하여 해당 쉬트 정보를 json 형식으로 반환
	//	options:
	//		sheets: [0, 2], 	//시트번호 혹은 이름 배열
	//		before: function	//엑셀선택 후 분석전 실행
	//-----------------------------------------------------
	// 	XFILE.excelToJson({
	// 		before	: (opts) => {
	// 			blockUI.start();
	// 		}
	// 	})
	// 	.then((response) => {
	// 		alert(JSON.stringify(response));
	// 	})
	// 	.finally(() => {
	// 		blockUI.stop();
	// 	});
	//-----------------------------------------------------
	excelToJson = (opts, callback) => {
		return new Promise((resolve, reject) => {
			opts = opts||{};
		 	const $file = $('<input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>');	//application/vnd.ms-excel
	    	$file.change((e) => {
	    		if ($file[0].files.length === 1) {
	    			if (opts.before) {
	    				opts.before();
	    			}
	        		const file = $file[0].files[0];
	    	        const reader = new FileReader();
	    	        reader.onload = (e) => {
	        			const ret = this._parseExcel(e.target.result, {type:"json", sheets:opts.sheets||[0], parseOptions:opts.parseOptions||[null]});
	        	        ret.filename = file.name;
	        	        resolve(ret);
	    	        }
	    	        reader.readAsArrayBuffer(file);
	    		}
	    	});
	    	$file.trigger("click"); //파일선택 이벤트 발생시킴
		});
	}//end-excelToJson
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

		

		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// cell 작성 후 추가
	//-----------------------------------------------------
	_addCell = (sheet, row, col, value, opts) => {
		//셀 정보 작성
		const cell = {t:"s", v: value};
		if (cell.v instanceof Date) {
			cell.t = 'n';
			cell.z = XLSX.SSF._table[14];
			cell.v = (Date.parse(v) - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);

		} else {
			const ty = typeof(cell.v);
			if (ty === "number") {
				cell.t = 'n';
			} else if (ty === "boolean") {
				cell.t = 'b';
			}
		}

		//cell값 미정의시 style.border 표현을 위해 space로 대치
		if (cell.v === undefined || cell.v === null) {
			cell.v = "";
		}
		
		//style설정
		if (opts && opts.s) {
			cell.s = opts.s;	
		}

		//셀 주소
		const addr = XLSX.utils.encode_cell({c: col, r: row});
		sheet[addr] = cell;
		if (row === 1) {
			this._debug("_addCell - "+addr+"- row:"+row+", col:"+col+", val:"+cell.v);
		}

	}//end-_addCell
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 유형별 기본 cell style 반환
	//-----------------------------------------------------
	_getDefaultCellStyle = (name) => {
		if (name === "titleStyle") {
			return {
 	 			font	: {
 	 				sz			: 16,
 	 				bold		: true,
 	 				underline	: true
 	 			},
 	 			alignment	: {
 	 				vertical	: "center",
 	 				horizontal	: "center"
 	 			}
 	 		};
			
		} else if (name === "headerStyle") {
			return {
 	 			font	: {
 	 				sz	: 14,
 	 				bold: true,
 	 				//color: {rgb: "FFFFAA00"}
 	 			},
 	 			fill	: {
 	 				//patternType	: "solid",
 	 				fgColor		: {rgb: "50E6E6E6"}	//KML color
 	 			},
 	 			border	: {
 	 				top		: {style:"thin", color:{auto: 1}},
 	 				right	: {style:"thin", color:{auto: 1}},
 	 				bottom	: {style:"thin", color:{auto: 1}},
 	 				left	: {style:"thin", color:{auto: 1}}
 	 			},
 	 			alignment	: {
 	 				horizontal : "center"
 	 			}
 	 		};
 	 		
		} else if (name === "dataStyle") {
			return {
 	 			border	: {
 	 				top		: {style:"thin", color:{auto: 1}},
 	 				right	: {style:"thin", color:{auto: 1}},
 	 				bottom	: {style:"thin", color:{auto: 1}},
 	 				left	: {style:"thin", color:{auto: 1}}
 	 			}
 	 		};
 	 		
		} else {
			throw "미정의된 기본 셀 스타일:"+name;			
		}
		
	}//end-_getDefaultCellStyle
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 엑셀 파일 객체를 읽어서 json으로 반환
	//-----------------------------------------------------
	_parseExcel = (arrBuf, opts) => {
		const ret = { success:[] };
		if (opts.type !== "json") {
			ret.ermsg = "unknown type:"+opts.type;
			this._debug("_parseExcel:"+ret.ermsg);
			return ret;
		}
		
		//var workbook = XLSX.read(data, { type: 'binary' });
        const str = this._readArrayBuffer(arrBuf);
        const workbook = XLSX.read(btoa(str), {type: 'base64'});
            
        for (let i=0; i<opts.sheets.length; i++) {
        	let sheetName = opts.sheets[i];
        	if (typeof(sheetName) === "number") {
        		const sheetIdx = sheetName;
        		if (sheetIdx < 0 || workbook.SheetNames.length < sheetIdx + 1) {
        			ret.ermsg = "invalid sheet index:"+sheetIdx;
        			this._debug("_parseExcel:"+ret.ermsg);
        			return ret;
        		}

        		sheetName = workbook.SheetNames[sheetIdx];
        	}
        	
    		const sheetData = {};
    		sheetData.sheetName = sheetName;
    		const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], opts.parseOptions[i]);
    		sheetData.data = data;
    		ret.success.push(sheetData);
        }
    	
		return ret;
	}//end-_parseExcel
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// read ArrayBuffer
	//-----------------------------------------------------
	_readArrayBuffer = (buf) => {
		const size = 10240;
		let result = "", idx = 0;
		
		for(let idx=0; idx<buf.byteLength/size; ++idx) {
			result += String.fromCharCode.apply(null, new Uint8Array(buf.slice(idx*size, idx*size+size)));
		}
		result += String.fromCharCode.apply(null, new Uint8Array(buf.slice(idx*size)));
		return result;
	}//end-_readArrayBuffer
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class ExcelUtil
