package com.bugtracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No Bearer token received for {} {}", method, uri);
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        try {
            String email = jwtService.extractEmail(jwt);

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            boolean valid =
                    jwtService.isTokenValid(jwt, userDetails.getUsername());

            logger.info(
                    "JWT validation result for {} {}: {}",
                    method, uri, valid
            );

            if (valid) {
                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                ((UsernamePasswordAuthenticationToken) authentication)
                        .setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

                logger.info(
                        "JWT authentication successful for {} {}",
                        method, uri
                );

            } else {
                logger.warn(
                        "JWT token is invalid for {} {}",
                        method, uri
                );

                SecurityContextHolder.clearContext();
            }

        } catch (Exception e) {

            logger.error(
                    "JWT authentication error for {} {}: {}",
                    method, uri, e.getMessage(),
                    e
            );

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}