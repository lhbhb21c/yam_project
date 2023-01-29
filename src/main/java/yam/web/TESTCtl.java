package yam.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import we.cmmn.core.AbstractStdCtl;
import we.cmmn.svc.WeQuerySvc;
import we.cmmn.svc.WeSessionSvc;
import we.cmmn.utils.ServletUtils;
import yam.cmmn.YamCmmnSvc;

import javax.annotation.Resource;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DateFormat;
import java.util.*;

@RestController
//@RequestMapping("/")
public class TESTCtl {




    @Resource
    private TESTDAO testdao;

    @RequestMapping(value = "/test", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody List test() throws Exception {
        List map =testdao.testList();
        return map;
    }



    @RequestMapping(value = "/inWareL", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody List inWareL() throws Exception {
        List map =testdao.inWareL();
        return map;
    }

    @RequestMapping(value = "/releaseWare", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody List releaseWare() throws Exception {
        List map =testdao.releaseWare();
        return map;
    }
    @RequestMapping(value = "/searchAoWhin", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody List searchAoWhin(@RequestParam Map vo) throws Exception {
        System.out.println(vo.get("sn") + ":");
        List map =testdao.searchAoWhin(vo.get("sn").toString());
        return map;
    }
  @RequestMapping(value = "/searchAoWhinAll", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody List searchAoWhinAll() throws Exception {

        List map =testdao.searchAoWhinAll();
        return map;
    }

    @RequestMapping(value = "/updateBarcode", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody List updateBarcode(@RequestParam Map vo) throws Exception {
        List map =testdao.updateBarcode(vo);
        return map;
    }

    @RequestMapping(value = "/searchShOutAll", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody List searchShOutAll() throws Exception {
        List map =testdao.searchShOutAll();
        return map;
    }

//    /** 시작페이지 */
//    @RequestMapping(value="/tester.do", method=RequestMethod.GET)
//    public String index(HttpServletRequest request, HttpServletResponse response) {
//
//        return "tester123";
//    }

}
