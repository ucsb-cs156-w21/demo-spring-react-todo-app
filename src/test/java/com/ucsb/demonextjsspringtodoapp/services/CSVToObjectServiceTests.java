package com.ucsb.demonextjsspringtodoapp.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

public class CSVToObjectServiceTests {
    @MockBean
    Reader csv;

    @MockBean
    private Logger log;

    private CSVToObjectServiceImpl<String> csvToObjectService = new CSVToObjectServiceImpl<String>() {

        @Override
        public List<String> parse(Reader csv, Class<String> type) {
            return new ArrayList<String>();
        }

        @Override
        public Logger getLogger() {
            return log;
        }
    };

    @Test
    public void test_Parse() throws Exception {
        ArrayList<String> expectedList = new ArrayList<String>();
        assertEquals(expectedList, csvToObjectService.parse(csv, String.class));
    }

    @Test
    public void test_getLogger(){
        assertEquals(log, csvToObjectService.getLogger());
    }
}
