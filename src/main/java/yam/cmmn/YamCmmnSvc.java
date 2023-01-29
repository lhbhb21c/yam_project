package yam.cmmn;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import we.cmmn.core.AbstractStdSvc;
import we.cmmn.svc.WeQuerySvc;

/**
 * YAM MES 공용 Service
 * 
 * @author rum
 * @since 2021.09.06
 */
@Service
public class YamCmmnSvc extends AbstractStdSvc {

	/** logger */
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	/** 쿼리서비스 */
	@Resource(name = "weQuerySvc")
	protected WeQuerySvc weQuerySvc;

	
	/** 주문집계 실행 */
	public void runTrAggr (final String sectrId, final String trAggrDy, final String trAggrTm, final String workId) throws Exception {
		try {
			System.out.println("##### " + trAggrDy + "일  " + trAggrTm + "차 주문집계 시작");
			LOGGER.info("##### {} 일 {} 차 주문집계 시작", trAggrDy, trAggrTm);
			
			Map<String, Object> param = new HashMap<String, Object>();
			param.put("SECTR_ID", sectrId);
			param.put("TR_AGGR_DY", trAggrDy);
			param.put("TR_AGGR_TM", trAggrTm);
			param.put("WORK_ID", workId);
			
			weQuerySvc.parseQuery("yam.cmmn.YAM_MES.PROC_TR_AGGR_BAT", "sp", param, null);

			String erMsg = (String)param.get("ER_MESSAGE");
			if (erMsg != null && !erMsg.isEmpty()) {
				throw new Exception(erMsg);
			}
			
			System.out.println("##### " + trAggrDy + "일  " + trAggrTm + "차 주문집계 완료");
			LOGGER.info("##### {} 일 {} 차 주문집계 완료", trAggrDy, trAggrTm);
			
		} catch (Exception e) {
			System.out.println("##### " + trAggrDy + "일  " + trAggrTm + "차 주문집계 실패");
			LOGGER.info("##### {} 일 {} 차 주문집계 실패", trAggrDy, trAggrTm, e);
			throw e;
		}
	}
}
