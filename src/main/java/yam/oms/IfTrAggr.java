package yam.oms;

/**
 * 주문집계 작업
 *
 * @author
 * @since
 */
public class IfTrAggr implements Runnable { 
	
	/** 주문일자 */
	final private String trDy;
	/** 주문차수 */
	final private Integer trTm;
	
	
	/** 생성자 */
	public IfTrAggr() {
		this.trDy = null;
		this.trTm = null;
	}

	/**
	 * 생성자
	 * @param trDy - 주문일자
	 * @param trTm - 주문차수
	 */
	public IfTrAggr(String trDy, int trTm) {
		this.trDy = trDy;
		this.trTm = trTm;
	}
	
	
	/** 주문집계 실행 */
	@Override
	public void run() {
		// TODO Auto-generated method stub
	}

}
