package yam.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import we.cmmn.core.AbstractStdCtl;
import we.cmmn.svc.WeQuerySvc;
import yam.cmmn.YamCmmnSvc;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * YAM MES 공용 Controller
 * 
 * @author rum
 * @since 2021.09.06
 */
@Controller
public class YamCmmnCtl extends AbstractStdCtl {

    /** logger */
    @SuppressWarnings("unused")
    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	
	/** 얌테이블MES 공통 서비스 */
	@Resource(name = "yamCmmnSvc")
	protected YamCmmnSvc yamCmmnSvc;

	/** 쿼리서비스 */
	@Resource(name = "weQuerySvc")
	private WeQuerySvc weQuerySvc;


	/**
	 * 사용자 추가/수정
	 * @param request req
	 * @param response res
	 * @throws Exception ex
	 */
    @SuppressWarnings({"rawtypes", "unchecked"})
    @RequestMapping(value = "/user_mng/save.do", method = RequestMethod.POST)
	@ResponseBody
	public void userMng(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.debug("\n### userMng");
		// 로그인 확인
		weSessionSvc.assertSession();

		// json
		Map<String, Object> jsonParam = this.getJsonParam(request);
		LOGGER.debug("userMng.jsonParam: {}", jsonParam);


		Map<String, Object> result = new HashMap<>();
		if (jsonParam != null) {
			try {
				String cmd = (String) jsonParam.get("CMD");
				String xmlText = (String) jsonParam.get("XML_TEXT");
				String userId = (String) jsonParam.get("USER_ID");

				// XML String To Map
				Map xmlMap = this.xmlToMap(xmlText);
				Map dataMap = (Map) xmlMap.get("data");
				Map userMap = (Map) dataMap.get("mst");
				// 비밀번호 암호화
				String userPassword = (String) userMap.get("USER_PWD");

				if (userPassword != null && !userPassword.isEmpty()) {
					userPassword = cipher.encryptPassword(userPassword);
					userMap.put("USER_PWD", userPassword);
					dataMap.put("mst", userMap);
					xmlMap.put("data", dataMap);
					String xmlString = this.mapToXml(xmlMap);
					jsonParam.put("XML_TEXT", xmlString);
				}

				// 디비 작업
				result = weQuerySvc.parseQuery("we.std.base.USER_MNG.save", "sp", jsonParam, null);
				//로그
				try {
					Map<String, Object> queryParam = new HashMap<String, Object>();
					queryParam = new HashMap<String, Object>();
					queryParam.put("CMD", jsonParam.get("CMD"));
					queryParam.put("PGM_ID", "USER_MNG");
					weQuerySvc.parseQuery("we.std.main.MDI_MAIN.pgmUseLog", "sp", queryParam, null);
				} catch (Exception ignored) {
				}
			} catch (Exception e) {
				this.setError(result, e);

			} finally {
				this.writeJson(response, result);
			}
		} else {
			this.setError(result, new Exception("전송데이터가 없습니다."));
			this.writeJson(response, result);
		}
	}

	/**
	 * 아이디 중복 체크
	 */
	@RequestMapping(value = "/user_mng/id_dup_check.do", method = RequestMethod.POST)
	@ResponseBody
	public void idDupCheck(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.debug("\n### id_dup_check");
		// 로그인 확인
		weSessionSvc.assertSession();
		String userId = URLDecoder.decode(request.getParameter("userId"), StandardCharsets.UTF_8.name());

		//
		Map<String, Object> resultMap = new HashMap<>();
		try {
			Map<String, Object> queryParam = new HashMap<String, Object>();
			queryParam = new HashMap<String, Object>();
			queryParam.put("USER_ID", userId);
			resultMap = weQuerySvc.parseQuery("we.std.base.USER_MNG.selIdDupCheck", "selOne", queryParam, null);
			System.out.println(resultMap);
		} catch (Exception ignored) {}

		Map<String, Object> result = new HashMap<>();
		result.put("DUP_CNT", resultMap.get("DUP_CNT"));

		if (resultMap.get("DUP_CNT") != null && ((Long)resultMap.get("DUP_CNT")>0)) {
			result.put("erMsg", userId  + " 은(는) 사용중인 아이디입니다.");
		}

		this.writeJson(response, result);
	}

	/**
	 * 평문암호를 암호화된 문자열로 변환
	 * 		request : userPassword=abcd#45 (encodeURIComponent)
	 * 		response : json { userPassword:..., encPassword:...}
	 * 		error: { erMsg: ..., userPassword: ... }
	 * @param request req
	 * @param response res
	 * @throws Exception er
	 */
	@Deprecated
	@RequestMapping(value = "/user_mng/generate_password.do", method = RequestMethod.POST)
	@ResponseBody
	public void generatePassword(HttpServletRequest request, HttpServletResponse response) throws Exception {
		LOGGER.debug("\n### generate_password");
		// 로그인 확인
		weSessionSvc.assertSession();
		// json
		Map<String, Object> jsonParam = this.getJsonParam(request);
		LOGGER.debug("login.jsonParam: {}", jsonParam);

		//
		String userPassword = (String)jsonParam.get("userPassword");// URLDecoder.decode(request.getParameter("userPassword"), StandardCharsets.UTF_8.name());

//		if ("R".equals(request.getParameter("enc"))) {	//RSA암호화 이면 복호화 처리
//			userPassword = cipher.decryptWithPrivateKey(userPassword);
//		}

		Map<String, Object> result = new HashMap<>();
		result.put("userPassword", userPassword);

		if (userPassword == null || userPassword.trim().equals("")) {
			result.put("erMsg", "password 가 없습니다.");
			this.writeJson(response, result);
			return;
		}
//		// 규칙 점검
//		// 길이 : 6자이상
		if (userPassword.length() < 6) {
			result.put("erMsg", "password 는 6자 이상입니다.");
			this.writeJson(response, result);
			return;
		}

		// 영문자와 숫자, 특수문자 하나 이상
		Pattern letter = Pattern.compile("[a-zA-z]");
		Pattern digit = Pattern.compile("[0-9]");
		Pattern special = Pattern.compile ("[`!@#$%^&*?~]");

		Matcher hasLetter = letter.matcher(userPassword);
		Matcher hasDigit = digit.matcher(userPassword);
		Matcher hasSpecial = special.matcher(userPassword);

		if (!hasLetter.find()) {
			result.put("erMsg", "영문자가 1자이상 포함되어야 합니다.");
			this.writeJson(response, result);
			return;
		}
		else if (!hasDigit.find()) {
			result.put("erMsg", "숫자가 1자이상 포함되어야 합니다.");
			this.writeJson(response, result);
			return;
		}
		else if (!hasSpecial.find()) {
			result.put( "erMsg", "특수문자가 1자이상 포함되어야 합니다.");
			this.writeJson(response, result);
			return;
		}
		//hasLetter.find() && hasDigit.find() && hasSpecial.find()
		// 암호화
		String encPassword = cipher.encryptPassword(userPassword);
		result.put("ENC_PASSWORD", encPassword);

		this.writeJson(response, result);
	}
	
}
