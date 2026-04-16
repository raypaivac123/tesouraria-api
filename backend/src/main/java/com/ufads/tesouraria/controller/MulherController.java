package com.ufads.tesouraria.controller;

import com.ufads.tesouraria.dto.MulherRequestDTO;
import com.ufads.tesouraria.dto.MulherResponseDTO;
import com.ufads.tesouraria.entity.Mulher;
import com.ufads.tesouraria.mapper.MulherMapper;
import com.ufads.tesouraria.service.MulherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/mulheres")
@RequiredArgsConstructor
public class MulherController {

    private final MulherService service;

    @PostMapping
    public MulherResponseDTO criar(@RequestBody @Valid MulherRequestDTO dto) {

        Mulher mulher = service.criar(dto);

        return MulherMapper.toResponseDTO(mulher);
    }

    @GetMapping
    public List<MulherResponseDTO> listar() {

        return service.listarAtivas()
                .stream()
                .map(MulherMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MulherResponseDTO buscarPorId(@PathVariable Long id) {

        return MulherMapper.toResponseDTO(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public MulherResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody @Valid MulherRequestDTO dto
    ) {

        Mulher mulher = service.atualizar(id, dto);

        return MulherMapper.toResponseDTO(mulher);
    }

    @DeleteMapping("/{id}")
    public void desativar(@PathVariable Long id) {

        service.desativar(id);
    }
}
