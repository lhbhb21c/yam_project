package yam.web;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class TESTDAOIMPL implements TESTDAO {

    @Resource //DI(의존성 주입): spring container로부터 객체를 주입
    private SqlSessionTemplate template;

    public TESTDAOIMPL(SqlSessionTemplate template) {
        super();
        this.template = template;
    }

    //findCustomerById : id로 회원정보 찾기
    @Override
    public List testList() {

        return template.selectList("TEST_1.testList");

    }

    @Override
    public List inWareL() {
        return template.selectList("TEST_1.inWareL");
    }

    @Override
    public List releaseWare() {
        return template.selectList("TEST_1.releaseWare");
    }

    @Override
    public List searchAoWhin(String param) {
        return template.selectList("TEST_1.searchAoWhin", param);
    }

    @Override
    public List updateBarcode(Map vo) {
        int result = template.update("TEST_1.searchAoWhinUpdate", vo);
        if(result == 1){
            return template.selectList("TEST_1.resultAoWhin", vo.get("code").toString());
        }else{
            System.out.println("fail");
        }
        return null;
    }

    @Override
    public List searchAoWhinAll() {
        return template.selectList("TEST_1.searchAoWhinAll");
    }
    @Override
    public List searchShOutAll() {
        return template.selectList("TEST_1.searchShOutAll");
    }
}
