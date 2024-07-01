package com.increff.velocity.template.app.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.increff.commons.template.Resources;
import com.increff.commons.template.util.FopUtil;
import com.increff.commons.template.util.Utils;
import com.increff.commons.template.util.VelocityUtil;
import com.nextscm.commons.spring.common.ApiException;
import com.nextscm.commons.spring.common.ApiStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import org.apache.fop.configuration.ConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.apache.velocity.runtime.parser.ParseException;

@Service
public class PdfDto {

    @Autowired
    private ObjectMapper objectMapper;

    public byte[] renderPdf(MultipartFile file, String jsonString) throws ApiException, JsonProcessingException {
        Object form = convertToObject(jsonString);
        convertDateFields(form);
        String timeZoneStr = "Asia/Kolkata";
        String templateResource = null;
        try {
            templateResource = new String(file.getBytes());
        } catch (IOException e) {
            throw new ApiException(ApiStatus.UNKNOWN_ERROR, "Error while reading the file, message: " + e.getMessage());
        }
        try {
            return getPdfFromVm(form, templateResource, timeZoneStr);
        } catch (ApiException e) {
            throw new ApiException(ApiStatus.UNKNOWN_ERROR, "Error while generating the PDF, message: " + e.getMessage());
        }
    }

    public byte[] getPdfFromVm(Object form, String templateResource, String timeZoneStr) throws ApiException {
        VelocityUtil.setTimezone(timeZoneStr);
        String fopTemplate = null;
        try {
            fopTemplate = VelocityUtil.processString(form, templateResource);
        }
        catch (ParseException e) {
            throw new ApiException(ApiStatus.UNKNOWN_ERROR,"Error while processing template, message: " + e.getMessage());
        }
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try{
            FopUtil.convertToPDF(Resources.getResource(Resources.FOP_DATA_RESOURCE), Utils.toStream(fopTemplate), byteArrayOutputStream);
        } catch (TransformerException | SAXException | IOException | ConfigurationException e ) {
            throw new ApiException(ApiStatus.UNKNOWN_ERROR,"Error while creating pdf. "+e.getMessage());
        }
        return byteArrayOutputStream.toByteArray();
    }

    private Object convertToObject(String jsonString) throws JsonProcessingException {
        return objectMapper.readValue(jsonString, Object.class);
    }

    public static void convertDateFields(Object jsonObject) {
        convertDateFieldsRecursive(jsonObject);
    }

    private static void convertDateFieldsRecursive(Object obj) {
        if (obj instanceof Map<?, ?>) {
            Map<Object, Object> originalMap = (Map<Object, Object>) obj;
            Map<Object, Object> updatedMap = new LinkedHashMap<>();

            originalMap.forEach((key, value) -> {
                if (value instanceof String && isDateString((String) value)) {
                    Date date = parseDateString((String) value);
                    if (date != null) {
                        updatedMap.put(key, date);
                    } else {
                        updatedMap.put(key, value);
                    }
                } else {
                    convertDateFieldsRecursive(value);
                    updatedMap.put(key, value);
                }
            });

            originalMap.clear();
            originalMap.putAll(updatedMap);
        } else if (obj instanceof List<?>) {
            List<Object> list = (List<Object>) obj;
            List<Object> updatedList = new ArrayList<>();

            list.forEach(item -> {
                if (item instanceof Map<?, ?> || item instanceof List<?>) {
                    convertDateFieldsRecursive(item);
                    updatedList.add(item);
                } else {
                    updatedList.add(item);
                }
            });

            list.clear();
            list.addAll(updatedList);
        }
    }


    private static boolean isDateString(String value) {
        String datePattern = "\\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s\\d{1,2}\\s\\d{2}:\\d{2}:\\d{2}\\s\\w{3}\\s\\d{4}\\b";
        return value.matches(datePattern);
    }

    private static Date parseDateString(String dateString) {
        try {
            return new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy", Locale.ENGLISH).parse(dateString);
        } catch (java.text.ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}
