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

import static tools.jackson.databind.jsonFormatVisitors.JsonValueFormat.UUID;

@Document(collection = "rounds")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Round {
    @Id
    @Builder.Default
    private String id = java.util.UUID.randomUUID().toString();

    @Indexed
    private String roomId;

    private int roundNumber; // Số thứ tự ván bài trong bàn đó

    private List<ScoreDetail> details;

    @CreatedDate
    private Instant createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreDetail {
        private String playerName;
        private int scoreChange;
    }
}
