package com.increff.velocity.template.app.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.increff.velocity.template.app.dto.PdfDto;
import com.nextscm.commons.spring.common.ApiException;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@RestController
@RequestMapping(value = "/api/render-pdf")
public class PdfController {

    @Autowired
    private PdfDto pdfDto;

    @PostMapping("")
    public String renderPdf(@RequestParam("file") MultipartFile file,
                            @RequestParam("jsonString") String jsonString) throws ApiException, JsonProcessingException {
        byte[] result =  pdfDto.renderPdf(file,jsonString);
        return Base64.getEncoder().encodeToString(result);
    }

}
