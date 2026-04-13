package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> login(String username) {
        // check username
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            return ResponseEntity.badRequest().body("User found");
        } else {
            User newUser = User.builder()
                            .username(username)
                            .build();
            userRepository.save(newUser);
        }

        return ResponseEntity.ok("Login successful");
    }
}
