package com.lojalaluz.api.dto;

import com.lojalaluz.api.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String cpf;
    private User.Role role;
    private Boolean active;
    private LocalDateTime createdAt;
}
