package we.std.core;

import java.util.Scanner;

import we.cmmn.cipher.WeCipher;

/**
 * 속성 암호화 처리
 * 
 * @author 염국선
 * @since 2021.12.28
 */
public class PropCipher extends WeCipher {
	
	/** 생성자 */
	public PropCipher() {
		this.setMasterKey("std속성마스터키");
	}
	
	/** for test */
	@SuppressWarnings("resource")
	public static void main(String[] args) {
		try {
			final Scanner scan = new Scanner(System.in);
			final PropCipher cipher = new PropCipher();

			System.out.println("----------------- 속성암호화(대칭키) 시작 --------------------");
			
			System.out.println("속성값 입력(엔터):");
			String plainText = scan.nextLine();
			System.out.println("##########속성값:["+plainText+"]\n");
			String cipherText = cipher.encrypt(plainText, null);
			System.out.println("##########암호화:["+cipherText+"]\n");
			plainText = cipher.decrypt(cipherText, null);
			System.out.println("##########복호화:["+plainText+"]\n");
			
			System.out.println("----------------- 속성암호화(대칭키) 종료 --------------------");
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

}
