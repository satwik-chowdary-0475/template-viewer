package com.increff.velocity.template.app.config;

import com.nextscm.commons.spring.server.AbstractWebInitializer;

public class WebAppInitializer extends AbstractWebInitializer {

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

}
