package com.increff.velocity.template.ui.config;


/**
 * TOP-MOST level Spring configuration file, that starts the Spring
 * configuration
 */

import com.nextscm.commons.spring.server.WebMvcConfig;
import org.springframework.context.annotation.*;

/**
 * Spring configuration for loading application properties.
 */
@Configuration
@ComponentScan({ "com.increff.velocity.template.ui" })
@PropertySources({ //
		@PropertySource(value = "file:./velocity-template-ui.properties", ignoreResourceNotFound = true)//
})
@Import({ WebMvcConfig.class })
public class SpringConfig {
	

}
