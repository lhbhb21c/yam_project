package yam.login;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ch.qos.logback.core.net.SyslogOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import we.cmmn.core.AbstractStdCtl;
import we.cmmn.svc.WeQuerySvc;
import we.cmmn.svc.WeSessionSvc;
import we.cmmn.utils.ServletUtils;


/**
 * 얌테이블MES 로그인 Controller
 * 
 * @author rum
 * @since 2021.09.06
 */
@Controller
public class YamLoginCtl extends AbstractStdCtl {

	/** logger */
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	/** 쿼리서비스 */
	@Resource(name = "weQuerySvc")
	private WeQuerySvc weQuerySvc;
	
	
	/** 시작페이지 */
	@RequestMapping(value = "/index.do")
	public ModelAndView index(HttpServletRequest request, HttpServletResponse response) {
		LOGGER.debug("\n### index");
		ModelAndView mav = null;
		
		try {
			weSessionSvc.assertSession();
			//로긴되었으면 기본페이지 호출
			LOGGER.debug("\n### index {}", weSessionSvc.getSessionMemId());
			mav = new ModelAndView("/yam/cmmn/main/Main");

		} catch (Exception e) {
			//로그인 전이면 login 페이지 호출
			mav = new ModelAndView("/yam/cmmn/login/Login");
		}

		return mav;
	}
	
	
	/** 로그인 처리 */
	@RequestMapping(value = "/login.do", method=RequestMethod.POST)
	@ResponseBody
	public void login(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.debug("\n### login");

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("erMsg", "아이디 또는 비밀번호를 다시 확인하세요.");

		System.out.print("::::::");
		try {
			if (this.login(request)) {
				result.remove("erMsg");
				//login log
				try {
					Map<String, Object> queryParam = new HashMap<String, Object>();
					queryParam = new HashMap<String, Object>();
					queryParam.put("CMD", "LOGGING");
					queryParam.put("PGM_ID", "LOGIN");
					queryParam.put("LOG_CN", ServletUtils.getConnectIp(request));
					weQuerySvc.parseQuery("we.std.main.MDI_MAIN.pgmUseLog", "sp", queryParam, null);
				} catch (Exception e) {}
			}
			
		} catch (Exception e) {
			this.setError(result, e);
			
		} finally {
			this.writeJson(response, result);
		}

	}	

	
	/** 재로그인 처리 */
	@RequestMapping(value = "/relogin.do", method=RequestMethod.POST)
	@ResponseBody
	public void relogin(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.debug("\n### relogin");

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("erMsg", "비밀번호를 다시 확인하세요.");

		try {
			if (this.login(request)) {
				result.remove("erMsg");
				//login log
				try {
					Map<String, Object> queryParam = new HashMap<String, Object>();
					queryParam = new HashMap<String, Object>();
					queryParam.put("CMD", "LOGGING");
					queryParam.put("PGM_ID", "RELOGIN");
					queryParam.put("LOG_CN", ServletUtils.getConnectIp(request));
					weQuerySvc.parseQuery("we.std.main.MDI_MAIN.pgmUseLog", "sp", queryParam, null);
				} catch (Exception e) {}
			}

		} catch (Exception e) {
			this.setError(result, e);
			
		} finally {
			this.writeJson(response, result);
		}

	}	
	

	/** 로그인 */
	private boolean login(HttpServletRequest request) throws Exception {
		Map<String, Object> jsonParam = this.getJsonParam(request);
		LOGGER.debug("login.jsonParam: {}", jsonParam);
		
		//암호값 평문 해쉬값으로 변경
		jsonParam.put("USER_PWD", cipher.encryptPassword((String) jsonParam.get("USER_PWD")));
		
		Map<String, Object> usrMap = weQuerySvc.parseQuery("yam.cmmn.login.Login.selLoginUserInfo", "selOne", jsonParam, null);
		LOGGER.debug("login.usrMap: {}", usrMap);
		
		if (usrMap != null) {
			//메뉴목록(권한) 조회
			Map<String, Object> queryParam = new HashMap<String, Object>();
			queryParam.put(WeSessionSvc.SS_USER_INFO, usrMap);
			List<Map<String, Object>> userMenuList = weQuerySvc.parseQuery("we.std.main.MDI_MAIN.selMenuList", "selList", queryParam, null);

			//세션정보 설정
			weSessionSvc.setSession(request, usrMap, userMenuList);

			return true;
		}

		return false;
	}	
	
	
	/** 로그아웃 */
	@RequestMapping(value="/logout.do", method=RequestMethod.GET) 
	public ModelAndView logout(HttpServletRequest request, HttpServletResponse response) {
		LOGGER.debug("\n### logout");

		//세션 불능화 및 단일세션 설정시 관련 처리
		weSessionSvc.handleLogoutSession(request);
		
		ModelAndView mav = new ModelAndView("redirect:/");
		return mav;
	}
	
}
