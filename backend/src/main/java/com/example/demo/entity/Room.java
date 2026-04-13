package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @Builder.Default
    private String id = java.util.UUID.randomUUID().toString();

    @Indexed(unique = true)
    private String roomCode;

    private String ownerId; // Username của người tạo bàn

    private List<Player> players;

    private RoomSettings settings;

    @CreatedDate
    private Instant createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Player {
        private String name;
        private int totalScore = 0;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomSettings {
        private String gameType;
        private int expectedTotal; // Tổng điểm của 1 ván
        private boolean isValidationEnabled = true;
    }
}