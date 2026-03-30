package com.fisioterapia.filter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fisioterapia.model.AppUser;
import com.fisioterapia.repository.AppUserRepository;
import com.fisioterapia.security.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RailwayCompatibilityFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public RailwayCompatibilityFilter(
            ObjectMapper objectMapper,
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("/favicon.ico".equals(path)) {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        if (HttpMethod.GET.matches(method) && "/api/settings".equals(path)) {
            writeJson(response, HttpServletResponse.SC_OK, defaultSettings());
            return;
        }

        if (HttpMethod.POST.matches(method) && "/api/auth/login".equals(path)) {
            handleLogin(request, response);
            return;
        }

        if (HttpMethod.GET.matches(method) && "/api/auth/me".equals(path)) {
            handleCurrentUser(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void handleLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> credentials = objectMapper.readValue(request.getInputStream(), new TypeReference<>() {});
        String email = normalize(credentials.get("email"));
        String password = credentials.get("password");

        Optional<AppUser> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty() || password == null) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Credenciales invalidas"));
            return;
        }

        AppUser user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Credenciales invalidas"));
            return;
        }

        if (!user.isEnabled()) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Debes activar tu cuenta antes de iniciar sesion."));
            return;
        }

        writeJson(response, HttpServletResponse.SC_OK, Map.of("token", jwtUtil.generateToken(user.getEmail())));
    }

    private void handleCurrentUser(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "No autenticado"));
            return;
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            writeJson(response, HttpServletResponse.SC_UNAUTHORIZED, Map.of("message", "Token invalido"));
            return;
        }

        String email = normalize(jwtUtil.extractUsername(token));
        AppUser user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            writeJson(response, HttpServletResponse.SC_NOT_FOUND, Map.of("message", "Usuario no encontrado"));
            return;
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("email", safe(user.getEmail()));
        payload.put("role", safe(user.getRole()));
        payload.put("fullName", safe(user.getFullName()));
        payload.put("phone", safe(user.getPhone()));
        payload.put("avatarUrl", "");
        writeJson(response, HttpServletResponse.SC_OK, payload);
    }

    private Map<String, Object> defaultSettings() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", 1);
        payload.put("siteName", "ELFISIO");
        payload.put("logoUrl", "");
        payload.put("companyName", "");
        payload.put("companyEmail", "");
        payload.put("companyPhone", "");
        payload.put("address", "");
        return payload;
    }

    private void writeJson(HttpServletResponse response, int status, Object body) throws IOException {
        response.setStatus(status);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), body);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
