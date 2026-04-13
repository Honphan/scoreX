package com.example.demo;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class AuthTests {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeAll
    public static void init(){
        System.out.println("Begin tests");
    }

    @Test
    public void shouldReturnBadRequestWhenUserExists() {
        // Arrange
        String id = "123";
        String username = "hon";
        User user = User.builder()
                .id(id)
                .username(username).build();


        Mockito.when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

       // Act
        ResponseEntity<?> response = authService.login(username);

        // Assert
        assertEquals(HttpStatusCode.valueOf(400), response.getStatusCode());
        assertEquals("User found", response.getBody());

    }

    @Test
    public void shouldReturnSuccessWhenUserDoesNotExist() {
        // Arrange
        String username = "hon1";
        Mockito.when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<?> response = authService.login(username);

        // Assert
        assertEquals(HttpStatusCode.valueOf(200), response.getStatusCode());
        assertEquals("Login successful", response.getBody());
    }
}
