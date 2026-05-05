package com.titleflow.user;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

// Jakarta Persistance API and Hibernate are tools for managing
// relational data in Java applications

@Entity
@Table(name="roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private RoleName name;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Role(){
        // I need an empty non-accessed constructor for JPA to create Entity Objects in DB
        // properly using Role(RoleName name) constructor | clean domain design
    }

    public Role(RoleName name){
        this.name = name;
    }

    @PrePersist
    protected void onCreate(){
        // PrePersost annotation says to Hibernate to call onCreate before Inserting data into DB
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return this.id;
    }

    public RoleName getName(){
        return this.name;
    }

    public LocalDateTime getCreatedAt(){
        return this.createdAt;
    }

    @Override
    public boolean equals(Object o){
        if(this == o) return true;
        if(!(o instanceof Role role)) return false;
        return name == role.name;
    }

    @Override
    public int hashCode(){
        return Objects.hash(this.name);
    }
}