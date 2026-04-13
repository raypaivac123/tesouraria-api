package com.ufads.tesouraria.service;

import com.ufads.tesouraria.dto.CongregacaoRequestDTO;
import com.ufads.tesouraria.dto.CongregacaoResponseDTO;
import com.ufads.tesouraria.entity.Congregacao;
import com.ufads.tesouraria.exception.ResourceNotFoundException;
import com.ufads.tesouraria.mapper.CongregacaoMapper;
import com.ufads.tesouraria.repository.CongregacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CongregacaoService {

    private final CongregacaoRepository repository;


    public CongregacaoResponseDTO criar(CongregacaoRequestDTO dto){

        Congregacao congregacao = CongregacaoMapper.toEntity(dto);

        return CongregacaoMapper.toDTO(
                repository.save(congregacao)
        );

    }


    public List<CongregacaoResponseDTO> listar(){

        return repository.findAll()
                .stream()
                .map(CongregacaoMapper::toDTO)
                .toList();

    }


    public CongregacaoResponseDTO buscarPorId(Long id){

        Congregacao congregacao = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Congregação não encontrada")
                );

        return CongregacaoMapper.toDTO(congregacao);

    }


    public CongregacaoResponseDTO atualizar(Long id, CongregacaoRequestDTO dto){

        Congregacao congregacao = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Congregação não encontrada")
                );

        congregacao.setNome(dto.getNome());
        congregacao.setCidade(dto.getCidade());
        congregacao.setPastor(dto.getPastor());

        return CongregacaoMapper.toDTO(
                repository.save(congregacao)
        );

    }


    public void deletar(Long id){

        Congregacao congregacao = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Congregação não encontrada")
                );

        congregacao.setAtivo(false);

        repository.save(congregacao);

    }

}