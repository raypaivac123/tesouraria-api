package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.DashboardResponseDTO;
import com.ufads.tesouraria.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @Operation(summary = "Obter resumo financeiro do dashboard")
    @GetMapping
    public DashboardResponseDTO obterResumo() {
        return service.obterResumo();
    }
}
