package yam.cmmn;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.Resource;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 얌테이블 배치작업 관련
 * 	- 주문집계
 * 
 * @author 염국선
 * @since 2021.11.25
 */
@Component
public class YamBatch {

	/** 회사코드 */
	private static final String SECTR_ID = "SEC-00001";
	/** 작업자ID */
	private static final String WORK_ID = "_batch";

	/** 얌테이블MES 공통서비스 */
	@Resource(name = "yamCmmnSvc")
	private YamCmmnSvc yamCmmnSvc;
	
//
//    /** 1차 주문집계 */
////	@Scheduled(cron = "0 * * * * ?")
//	@Scheduled(cron = "0 0 9 * * ?")
//    public void batchTrAggr1 () {
//		try {
//			yamCmmnSvc.runTrAggr(SECTR_ID, getNowDy(), "1", WORK_ID);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//    }
//
//    /** 2차 주문집계 */
//	@Scheduled(cron = "0 0 11 * * ?")
//    public void batchTrAggr2 () {
//		try {
//			yamCmmnSvc.runTrAggr(SECTR_ID, getNowDy(), "2", WORK_ID);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//    }
//
//    /** 3차 주문집계 */
//	@Scheduled(cron = "0 0 13 * * ?")
//    public void batchTrAggr3 () {
//		try {
//			yamCmmnSvc.runTrAggr(SECTR_ID, getNowDy(), "3", WORK_ID);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//    }
//
//    /** 4차 주문집계 */
//	@Scheduled(cron = "0 0 15 * * ?")
//    public void batchTrAggr4 () {
//		try {
//			yamCmmnSvc.runTrAggr(SECTR_ID, getNowDy(), "4", WORK_ID);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//    }

 
    /** 현재 일자(YYYY-MM-DD) */
    private String getNowDy() {
    	return new SimpleDateFormat("yyyy-MM-dd").format(new Date(System.currentTimeMillis()));
    }
}
