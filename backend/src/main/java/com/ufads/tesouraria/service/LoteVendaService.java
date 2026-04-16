package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.LoteVendaRequestDTO;
import com.ufads.tesouraria.entity.LoteVenda;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.repository.LoteVendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoteVendaService {

    private final LoteVendaRepository repository;

    public LoteVenda criar(LoteVendaRequestDTO dto) {
        LoteVenda entity = LoteVenda.builder()
                .produto(dto.getProduto())
                .categoria(dto.getCategoria())
                .dataVenda(dto.getDataVenda())
                .custoUnitario(dto.getCustoUnitario())
                .valorUnitario(dto.getValorUnitario())
                .observacao(dto.getObservacao())
                .ativo(true)
                .build();

        return repository.save(entity);
    }

    public List<LoteVenda> listar() {
        return repository.findByAtivoTrue();
    }

    public LoteVenda buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lote de venda não encontrado"));
    }

    public void desativar(Long id) {
        LoteVenda entity = buscarPorId(id);
        entity.setAtivo(false);
        repository.save(entity);
    }
}
