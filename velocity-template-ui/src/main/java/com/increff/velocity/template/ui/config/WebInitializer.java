package com.increff.velocity.template.ui.config;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.request.RequestContextListener;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import javax.servlet.*;

/**
 * This class is a hook for <b>Servlet 3.0</b> specification, to initialize
 * Spring configuration without any <code>web.xml</code> configuration. Note
 * that {@link #getServletConfigClasses} method returns {@link SpringConfig},
 * which is the starting point for Spring configuration <br>
 * <b>Note:</b> You can also implement the {@link WebApplicationInitializer }
 * interface for more control
 */

public class WebInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	private static final int ONE_MB = 1000000;

	// Temporary location where files will be stored
	private static final String LOCATION = System.getProperty("java.io.tmpdir");
	// 5MB : Max file size.Beyond that size Spring will throw exception.
	private static final long MAX_FILE_SIZE = 25 * ONE_MB;
	// 20MB : Total request size containing Multipart.
	private static final long MAX_REQUEST_SIZE = 25 * ONE_MB;
	// Size threshold after which files will be written to disk
	private static final int FILE_SIZE_THRESHOLD = 1 * ONE_MB;

	protected Class<?>[] getRootConfigClasses() {
		return new Class[] {};
	}

	protected Class<?>[] getServletConfigClasses() {
		return new Class[] { SpringConfig.class };
	}

	protected String[] getServletMappings() {
		return new String[] { "/" };
	}

	@Override
	protected void customizeRegistration(ServletRegistration.Dynamic registration) {
		MultipartConfigElement multipartConfigElement = new MultipartConfigElement(LOCATION, MAX_FILE_SIZE,
				MAX_REQUEST_SIZE, FILE_SIZE_THRESHOLD);
		registration.setMultipartConfig(multipartConfigElement);
	}

	@Override
	protected Filter[] getServletFilters() {
		return new Filter[0];
//		CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
//		characterEncodingFilter.setEncoding("UTF-8");
//		characterEncodingFilter.setForceEncoding(true);
//		return new Filter[] { new DelegatingFilterProxy("springSecurityFilterChain"), //
//				new DelegatingFilterProxy("oauth2ClientContextFilter"), //
//				characterEncodingFilter //
//		};
	}

	@Override
	public void onStartup(ServletContext container) throws ServletException {
		super.onStartup(container);
		container.addListener(new RequestContextListener());
	}
}