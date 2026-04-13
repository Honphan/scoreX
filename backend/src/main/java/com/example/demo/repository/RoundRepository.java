package com.example.demo.repository;

import com.example.demo.entity.Round;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoundRepository extends MongoRepository<Round, String> {
}
