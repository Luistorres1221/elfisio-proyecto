package com.fisioterapia.filter;

import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class SpaRedirectFilter extends OncePerRequestFilter {
    private final ResourceLoader resourceLoader;

    public SpaRedirectFilter(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        if (shouldForward(path, request.getMethod())) {
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldForward(String path, String method) {
        if (!"GET".equalsIgnoreCase(method)) {
            return false;
        }
        if (path.startsWith("/api") || path.startsWith("/management")) {
            return false;
        }
        if (path.contains(".")) {
            return false;
        }
        if ("/".equals(path) || path.isBlank()) {
            return true;
        }
        return !resourceLoader.getResource("classpath:/static" + path).exists();
    }
}
