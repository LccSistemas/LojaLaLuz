package com.lojalaluz.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "CEP é obrigatório")
    @Column(nullable = false, length = 9)
    private String zipCode;

    @NotBlank(message = "Rua é obrigatória")
    @Column(nullable = false)
    private String street;

    @NotBlank(message = "Número é obrigatório")
    @Column(nullable = false)
    private String number;

    private String complement;

    @NotBlank(message = "Bairro é obrigatório")
    @Column(nullable = false)
    private String neighborhood;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(nullable = false)
    private String city;

    @NotBlank(message = "Estado é obrigatório")
    @Column(nullable = false, length = 2)
    private String state;

    @Builder.Default
    private Boolean isDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
