package com.increff.velocity.template.ui.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;


@Controller
@RequestMapping(value = "/")
class SiteUIController {

    @Value("${app.base.url}")
    private String baseUrl;

    /* SITE PAGES */
    @RequestMapping(value = "ui", method = RequestMethod.GET)
    public ModelAndView website() {
        ModelAndView mav = new ModelAndView("site/index.html");
        mav.addObject("baseUrl",baseUrl);
        return mav;
    }


}