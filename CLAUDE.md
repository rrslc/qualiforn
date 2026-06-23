# GEDSUP — Gestão de Qualificação de Fornecedores
## MSB Medical System do Brasil

### Contexto

Sistema web para gestão do ciclo de vida de fornecedores da MSB, baseado no **POP-GQ-012 Rev.00** (Qualificação e Avaliação de Fornecedores). Substitui as planilhas Excel POP-GQ-012-01 a 06.

Normas aplicáveis: RDC 665/2022 (BPF) · ABNT NBR ISO 13485:2016

---

### Stack

- React 18 + Vite
- CSS inline (sem compilador)
- `localStorage` (chave `msb-gedsup-v1`)
- 100% client-side, sem backend

---

### Estrutura de arquivos

```
qualiforne/
├── CLAUDE.md
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx      ← toda a lógica aqui
    └── index.css
```

---

### Lógica de classificação de fornecedores

| Classificação | Tipo | Avaliação semestral |
|---|---|---|
| Não Crítico | — | POP-GQ-012-04 (3 critérios) |
| Crítico | Material Crítico | POP-GQ-012-05 (9 critérios, 4 dimensões) |
| Crítico | Serviço Crítico | POP-GQ-012-06 (4 critérios, 4 dimensões) |

### Status de documentos

| Status | Condição |
|---|---|
| `VIGENTE` | validade > hoje |
| `VENCENDO` | validade ≤ 45 dias |
| `VENCIDO` | validade < hoje |
| `PENDENTE` | não recebido |
| `NA` | não aplicável |

### Níveis de avaliação (nota 0–100)

| Nível | Pontuação | Decisão |
|---|---|---|
| 1 | ≥ 90 | Excelente — mantém fornecimento |
| 2 | 75–89 | Bom — mantém fornecimento |
| 3 | 60–74 | Regular — plano de ação |
| 4 | < 60 | Insuficiente — suspensão |

### Periodicidade de requalificação

- Não críticos: a cada 3 anos
- Críticos: anualmente

---

### Próximos passos sugeridos

1. **Importar dados** das planilhas Excel POP-GQ-012-01
2. **Questionário de Autoavaliação** (POP-GQ-012-03): implementar formulário de 31 itens (SIM/NÃO/PARCIAL/NA) com cálculo do % de conformidade
3. **Exportação PDF**: relatório de avaliação por fornecedor
4. **Backend**: migrar para Node.js + PostgreSQL quando necessário multi-usuário
5. **Deploy Netlify**: seguir mesmo processo do GEDREG
