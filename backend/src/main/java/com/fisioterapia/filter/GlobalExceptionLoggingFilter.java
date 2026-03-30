package com.fisioterapia.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (Throwable ex) {
            log.error("Fallo no controlado procesando {} {}", request.getMethod(), request.getRequestURI(), ex);

            if (!response.isCommitted()) {
                response.resetBuffer();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setCharacterEncoding("UTF-8");

                if (request.getRequestURI().startsWith("/api")) {
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"message\":\"Error interno del servidor\"}");
                } else {
                    response.setContentType(MediaType.TEXT_PLAIN_VALUE);
                    response.getWriter().write("Internal server error");
                }

                response.flushBuffer();
                return;
            }

            if (ex instanceof ServletException servletException) {
                throw servletException;
            }
            if (ex instanceof IOException ioException) {
                throw ioException;
            }

            throw new ServletException(ex);
        }
    }
}
