package com.titleflow.config;

import com.titleflow.user.Role;
import com.titleflow.user.RoleName;
import com.titleflow.user.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Tells Spring to create an Obj of this class and manage it via Spring Container
@Component
public class DataSeeder implements CommandLineRunner {
    private final RoleRepository roleRepository;

    // Dependency injection
    public DataSeeder(RoleRepository roleRepository){
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args){
        createRoleIfMissing(RoleName.ADMIN);
        createRoleIfMissing(RoleName.DEALER);
        createRoleIfMissing(RoleName.DMV_CLERK);
        createRoleIfMissing(RoleName.LENDER);
        createRoleIfMissing(RoleName.DEVELOPER);
    }

    private void createRoleIfMissing(RoleName roleName){
        if(roleRepository.findByName(roleName).isEmpty()){
            roleRepository.save(new Role(roleName));
        }
    }
}
