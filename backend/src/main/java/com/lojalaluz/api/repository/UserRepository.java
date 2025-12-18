package com.lojalaluz.api.repository;

import com.lojalaluz.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<User> findByCpf(String cpf);
    
    Optional<User> findByActivationToken(String token);
}
