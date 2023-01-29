package yam.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface TESTDAO {


    List testList();
    List inWareL();
    List releaseWare();
    List searchAoWhin(String param);
    List updateBarcode(Map vo);
    List searchAoWhinAll();
    List searchShOutAll();

}