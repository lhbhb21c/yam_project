/**
 * we.std.utils
 * 
 * @author	염국선
 * @since	2022.03.25
 */
const BS_UTL = {};

//-----------------------------------------------------
// 사용자선택 팝업
//	-options
//		multiple: true/false(default),	다중선택 여부
//		noclose:true/false(default),	선택시 화면닫지않기
//		FIX_MEM_TY: 해당 멤버유형만 조회, 콤머로 연결된 코드 혹은 배열 (10:자사, 20:거래처, 30:고객)
//		FIX_USER_GUBUN: 해당 사용자 구분만 조회, 콤머로 연결된 코드 혹은 배열
//-----------------------------------------------------
BS_UTL.popMemSel	= (options, callback) => {
	const opts = Object.assign({}, options);
	return XPOP.popup(
		{
			url:"/forward/we_std/popup/MEM_SEL_POP.do", 
			name:"MEM_SEL_POP", 
			specs:"width=800, height=600, left=100, top=100"
		}, 
		opts,
		callback
	);
}//popMemSel

//-----------------------------------------------------
//파트너선택 팝업
//	-options
//		multiple: true/false(default),	다중선택 여부
//		noclose:true/false(default),	선택시 화면닫지않기
//		FIX_PARTNR_TY: 해당 파트너유형만 조회, 콤머로 연결된 코드 혹은 배열 (10:매입, 20:매출, 30:매입/매출)
//		FIX_PARTNR_GB: 해당 파트너구분만 조회, 콤머로 연결된 코드 혹은 배열 
//-----------------------------------------------------
BS_UTL.popPartnrSel	= (options, callback) => {
	const opts = Object.assign({}, options);
	return XPOP.popup(
		{
			url:"/forward/we_std/popup/PARTNR_SEL_POP.do", 
			name:"PARTNR_SEL_POP", 
			specs:"width=800, height=600, left=100, top=100"
		}, 
		opts,
		callback
	);
}//popPartnrSel

//-----------------------------------------------------
//super administrator 여부
//-----------------------------------------------------
BS_UTL.isSu	= () => {
	if (SS_USER_INFO) {
		const memRoleCds = SS_USER_INFO.MEM_ROLE_CDS||"";
		if (memRoleCds.indexOf("SU") !== -1) {
			return true;
		}
	}
	return false;
}//popPartnrSel
