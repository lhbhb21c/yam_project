package we.std.core;

import java.util.HashMap;
import java.util.Map;

import we.cmmn.svc.WeSessionSvc;
import we.cmmn.utils.WeUtils;

/**
 * std utilities
 * 
 * @author WEVE
 * @since 2020.01.06
 */
public class StdUtils {

	/** 세션 서비스 */
	public static WeSessionSvc weSessionSvc;
	
	/** 세션 서비스 반환 */
	public static WeSessionSvc getWeSessionSvc() {
		if (weSessionSvc == null) {
			weSessionSvc = WeUtils.getBean("weSessionSvc");
		}
		return weSessionSvc;
	}
	
	/**
	 * 세션사용자 정보
	 */
	public static Map<String, Object> getSessionUserInfo() {
		return getWeSessionSvc().getSessionUserInfo();
	}

	/**
	 *	세션사용자 정보(simple)
	 */
	public static Map<String, Object> getSimpleSessionUserInfo() {
		Map<String, Object> sessionMap = getSessionUserInfo();
		if (sessionMap != null) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("SECTR_ID", sessionMap.get("SECTR_ID"));
			map.put("CO_CD", sessionMap.get("CO_CD"));
			map.put("COMPANY_CD", sessionMap.get("COMPANY_CD"));
			map.put("MEM_TY", sessionMap.get("MEM_TY"));
			map.put("MEM_GB", sessionMap.get("MEM_GB"));
			map.put("MEM_ROLE_CDS", sessionMap.get("MEM_ROLE_CDS"));
			map.put("MEM_REF1", sessionMap.get("MEM_REF1"));
            map.put("MEM_ID", sessionMap.get("MEM_ID"));
			map.put("USER_ID", sessionMap.get("USER_ID"));
			map.put("USER_NM", sessionMap.get("USER_NM"));

			return map;
		}
		return null;
	}

//	/**
//	 * 세션사용자 회사코드
//	 */
//	public static String getSessionCompanyCd() {
//		Map<String, Object> userMap = getSessionUserInfo();
//		return userMap == null ? null : (String)userMap.get("COMPANY_CD");
//	}
	
//	/**
//	 * 세션사용자 ID
//	 */
//	public static String getSessionUserId() {
//		Map<String, Object> userMap = getSessionUserInfo();
//		return userMap == null ? null : (String)userMap.get("USER_ID");
//	}

}