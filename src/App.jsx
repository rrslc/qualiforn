import { useState, useEffect, useMemo } from 'react'

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

const TIPOS_SERVICO = [
  { id: 'residuos', label: 'Gerenciamento de Resíduos', classificacao: 'NAO_CRITICO' },
  { id: 'consultorias', label: 'Consultorias', classificacao: 'NAO_CRITICO' },
  { id: 'incendio', label: 'Dispositivos de Prevenção de Incêndio', classificacao: 'NAO_CRITICO' },
  { id: 'embalagem_rotulos', label: 'Material de Embalagem (Rótulos e Etiquetas)', classificacao: 'NAO_CRITICO' },
  { id: 'embalagem_secundaria', label: 'Material de Embalagem (Secundária / Caixa / Isopor)', classificacao: 'NAO_CRITICO' },
  { id: 'reagentes', label: 'Reagentes de Laboratório', classificacao: 'NAO_CRITICO' },
  { id: 'materias_primas', label: 'Fabricante de Matérias-Primas', classificacao: 'CRITICO', tipoFornecimento: 'MATERIAL_CRITICO' },
  { id: 'embalagem_primaria', label: 'Material de Embalagem Primária', classificacao: 'CRITICO', tipoFornecimento: 'MATERIAL_CRITICO' },
  { id: 'manutencao_sala_limpa', label: 'Manutenção Predial Sala Limpa', classificacao: 'CRITICO', tipoFornecimento: 'SERVICO_CRITICO' },
  { id: 'limpeza_sanitizacao', label: 'Agentes de Limpeza e Sanitização (Sala Limpa)', classificacao: 'CRITICO', tipoFornecimento: 'MATERIAL_CRITICO' },
  { id: 'qualificacao_validacao', label: 'Qualificação / Validação / Certificação / Esterilização / Ensaios', classificacao: 'CRITICO', tipoFornecimento: 'SERVICO_CRITICO' },
  { id: 'calibracao', label: 'Calibração', classificacao: 'CRITICO', tipoFornecimento: 'SERVICO_CRITICO' },
  { id: 'equipamentos', label: 'Equipamentos, Utilidades e Sistemas', classificacao: 'CRITICO', tipoFornecimento: 'MATERIAL_CRITICO' },
  { id: 'manutencao_equipamentos', label: 'Manutenção de Equipamentos', classificacao: 'CRITICO', tipoFornecimento: 'SERVICO_CRITICO' },
  { id: 'controle_pragas', label: 'Controle de Pragas', classificacao: 'CRITICO', tipoFornecimento: 'SERVICO_CRITICO' },
  { id: 'vestimenta_sala_limpa', label: 'Vestimentas de Sala Limpa', classificacao: 'CRITICO', tipoFornecimento: 'MATERIAL_CRITICO' },
  { id: 'terceiros_analiticos', label: 'Terceiros Analíticos', classificacao: 'CRITICO', tipoFornecimento: 'SERVICO_CRITICO' },
  { id: 'transportadoras', label: 'Transportadoras', classificacao: 'CRITICO', tipoFornecimento: 'SERVICO_CRITICO' },
]

const DOCS_NAO_CRITICO = [
  { id: 'contrato_social', label: 'Ato Constitutivo / Contrato Social', obrigatorio: true },
  { id: 'alvara_prefeitura', label: 'Autorização de Funcionamento (Alvará Prefeitura)', obrigatorio: true },
  { id: 'cnpj', label: 'Comprovante de Inscrição CNPJ', obrigatorio: true },
  { id: 'alvara_sanitario', label: 'Alvará Sanitário / Licença de Funcionamento (VISA)', obrigatorio: false },
  { id: 'crt', label: 'Certificado de Responsabilidade Técnica (Conselho de Classe)', obrigatorio: false },
  { id: 'licenca_produtos_controlados', label: 'Licença para Produtos Controlados (Exército/Polícia)', obrigatorio: false },
  { id: 'atestado_capacidade', label: 'Atestados de Capacidade Técnica', obrigatorio: false },
  { id: 'licenca_ambiental', label: 'Licença Ambiental', obrigatorio: false },
  { id: 'avcb', label: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)', obrigatorio: false },
  { id: 'controle_pragas_cert', label: 'Certificado de Controle de Pragas', obrigatorio: false },
  { id: 'rbc', label: 'Credenciamento RBC (Rede Brasileira de Calibração)', obrigatorio: false },
  { id: 'catalogo', label: 'Catálogo / Material Técnico', obrigatorio: false },
  { id: 'iso_cert', label: 'Certificação ISO (opcional)', obrigatorio: false },
]

const DOCS_CRITICO = [
  { id: 'contrato_social', label: 'Ato Constitutivo / Contrato Social', obrigatorio: true },
  { id: 'alvara_prefeitura', label: 'Autorização de Funcionamento (Alvará Prefeitura)', obrigatorio: true },
  { id: 'cnpj', label: 'Comprovante de Inscrição CNPJ', obrigatorio: true },
  { id: 'alvara_sanitario', label: 'Alvará Sanitário / Licença de Funcionamento (VISA)', obrigatorio: false },
  { id: 'afe_anvisa', label: 'Autorização de Funcionamento ANVISA (AFE/AE)', obrigatorio: false },
  { id: 'bpf', label: 'Certificado de Boas Práticas (BPF/BPDA/BPL)', obrigatorio: false },
  { id: 'crt', label: 'Certificado de Responsabilidade Técnica (Conselho de Classe)', obrigatorio: false },
  { id: 'licenca_produtos_controlados', label: 'Licença para Produtos Controlados (Exército/Polícia)', obrigatorio: false },
  { id: 'licenca_ambiental', label: 'Licença Ambiental', obrigatorio: false },
  { id: 'ibama', label: 'Autorização de Transporte de Produtos Perigosos (IBAMA)', obrigatorio: false },
  { id: 'avcb', label: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)', obrigatorio: false },
  { id: 'controle_pragas_cert', label: 'Certificado de Controle de Pragas', obrigatorio: false },
  { id: 'residuos_cert', label: 'Certificado de Movimentação de Resíduos (CONAMA)', obrigatorio: false },
  { id: 'atestado_capacidade', label: 'Atestados de Capacidade Técnica', obrigatorio: false },
  { id: 'catalogo', label: 'Catálogo / Material Técnico', obrigatorio: false },
  { id: 'iso_cert', label: 'Certificação ISO (opcional)', obrigatorio: false },
]

// Critérios de avaliação por tipo
const CRITERIOS_NAO_CRITICO = [
  { id: 'conformidade_recebimento', label: 'Conformidade do Recebimento', dimensao: 'Controle de Qualidade', peso: 25, hint: 'Defeitos, não conformidades no recebimento' },
  { id: 'gestao_raf', label: 'Gestão de Reclamações (RAF)', dimensao: 'Controle de Qualidade', peso: 25, hint: 'Tempo de resposta e eficácia de ações corretivas' },
  { id: 'conformidade_docs', label: 'Atualização e Conformidade de Documentos', dimensao: 'Garantia da Qualidade', peso: 40, hint: 'Status dos documentos legais' },
  { id: 'transparencia', label: 'Transparência e Comunicação', dimensao: 'Comercial', peso: 10, hint: 'Clareza em propostas, disponibilidade, suporte' },
]

const CRITERIOS_MATERIAL_CRITICO = [
  { id: 'conformidade_lotes', label: 'Conformidade de Lotes Recebidos', dimensao: 'Controle de Qualidade', peso: 25, tipo: 'defeitos_por_milhao', hint: 'Defeitos por milhão no recebimento' },
  { id: 'gestao_raf', label: 'Gestão de Reclamações (RAF)', dimensao: 'Controle de Qualidade', peso: 15, tipo: 'meses_demora', hint: 'Meses de demora na resposta de RAF' },
  { id: 'historico_devolucoes', label: 'Histórico de Devoluções / Rejeições', dimensao: 'Controle de Qualidade', peso: 5, tipo: 'reclamacoes_24m', hint: 'Quantidade de reclamações nos últimos 24 meses' },
  { id: 'cumprimento_prazos', label: 'Cumprimento de Prazos', dimensao: 'Logística', peso: 10, tipo: 'select', opcoes: [{ v: 'sim', l: 'Sim', pts: 10 }, { v: 'nao_acordado', l: 'Não, mas acordado', pts: 6 }, { v: 'nao', l: 'Não', pts: 0 }] },
  { id: 'condicoes_transporte', label: 'Condições de Transporte e Embalagem', dimensao: 'Logística', peso: 10, tipo: 'select', opcoes: [{ v: 'bom', l: 'Bom', pts: 10 }, { v: 'ok', l: 'OK', pts: 6 }, { v: 'ruim', l: 'Ruim', pts: 2 }] },
  { id: 'conformidade_docs', label: 'Atualização e Conformidade de Documentos', dimensao: 'Garantia da Qualidade', peso: 20, tipo: 'select', opcoes: [{ v: 'sim', l: 'Sim', pts: 10 }, { v: 'em_atualizacao', l: 'Em atualização', pts: 6 }, { v: 'nao', l: 'Não', pts: 0 }] },
  { id: 'estabilidade_precos', label: 'Estabilidade de Preços', dimensao: 'Compras', peso: 5, tipo: 'select', opcoes: [{ v: 'nao', l: 'Não houve aumento', pts: 10 }, { v: 'sim_acordado', l: 'Sim, mas acordado', pts: 6 }, { v: 'sim', l: 'Sim, houve aumento', pts: 3 }] },
  { id: 'cumprimento_contratual', label: 'Cumprimento Contratual', dimensao: 'Compras', peso: 5, tipo: 'select', opcoes: [{ v: 'sim', l: 'Sim', pts: 10 }, { v: 'nao', l: 'Não', pts: 3 }, { v: 'nao_existe', l: 'Não existe contrato', pts: 0 }] },
  { id: 'transparencia', label: 'Transparência e Comunicação', dimensao: 'Compras', peso: 5, tipo: 'select', opcoes: [{ v: 'boa', l: 'Boa', pts: 10 }, { v: 'pontos_melhorar', l: 'Pontos a melhorar', pts: 6 }, { v: 'ruim', l: 'Ruim', pts: 2 }] },
]

const CRITERIOS_SERVICO_CRITICO = [
  { id: 'confiabilidade', label: 'Confiabilidade e Rastreabilidade', dimensao: 'Qualidade do Serviço', peso: 45, tipo: 'select', opcoes: [{ v: 'excede', l: 'Excede Expectativa', pts: 10 }, { v: 'satisfeito', l: 'Satisfeito', pts: 8 }, { v: 'parcial', l: 'Parcialmente Satisfeito', pts: 5 }, { v: 'insatisfeito', l: 'Insatisfeito', pts: 0 }] },
  { id: 'conformidade_docs', label: 'Atualização e Conformidade de Documentos', dimensao: 'Garantia da Qualidade', peso: 25, tipo: 'select', opcoes: [{ v: 'completa', l: 'Documentação Completa', pts: 10 }, { v: 'parcial', l: 'Documentação Parcial', pts: 5 }, { v: 'nao', l: 'Não possui', pts: 0 }] },
  { id: 'cumprimento_prazos', label: 'Cumprimento de Prazos', dimensao: 'Logística', peso: 15, tipo: 'select', opcoes: [{ v: 'no_prazo', l: 'No prazo', pts: 10 }, { v: 'atraso_acordado', l: 'Atraso acordado', pts: 6 }, { v: 'em_atraso', l: 'Em atraso', pts: 2 }] },
  { id: 'suporte_tecnico', label: 'Suporte Técnico e Tratativas de NC', dimensao: 'Atendimento', peso: 15, tipo: 'select', opcoes: [{ v: 'boa', l: 'Boa Comunicação', pts: 10 }, { v: 'ok', l: 'OK', pts: 6 }, { v: 'ruim', l: 'Comunicação Ruim', pts: 2 }] },
]

// ─── FUNÇÕES AUXILIARES ───────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10)

const hoje = () => new Date().toISOString().slice(0, 10)

const fmt = (iso) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const diffDias = (iso) => {
  if (!iso) return null
  const diff = new Date(iso + 'T00:00:00') - new Date(hoje() + 'T00:00:00')
  return Math.round(diff / 86400000)
}

const calcStatusDoc = (doc) => {
  if (doc.situacao === 'NAO_APLICAVEL') return 'NA'
  if (doc.situacao === 'PENDENTE' || !doc.dataValidade) return 'PENDENTE'
  const dias = diffDias(doc.dataValidade)
  if (dias < 0) return 'VENCIDO'
  if (dias <= 45) return 'VENCENDO'
  return 'VIGENTE'
}

const statusDocLabel = { VIGENTE: 'Vigente', VENCENDO: 'Vencendo', VENCIDO: 'Vencido', PENDENTE: 'Pendente', NA: 'N/A' }
const statusDocColor = { VIGENTE: '#22c55e', VENCENDO: '#f97316', VENCIDO: '#ef4444', PENDENTE: '#9da3b4', NA: '#6b7280' }

const calcStatusFornecedor = (fornecedor) => {
  if (fornecedor.statusQualificacao === 'SUSPENSO') return 'SUSPENSO'
  if (fornecedor.statusQualificacao === 'NAO_QUALIFICADO') return 'NAO_QUALIFICADO'
  if (fornecedor.statusQualificacao === 'EM_QUALIFICACAO') return 'EM_QUALIFICACAO'
  return 'QUALIFICADO'
}

const statusFornLabel = { QUALIFICADO: 'Qualificado', NAO_QUALIFICADO: 'Não Qualificado', EM_QUALIFICACAO: 'Em Qualificação', SUSPENSO: 'Suspenso' }
const statusFornColor = { QUALIFICADO: '#22c55e', NAO_QUALIFICADO: '#ef4444', EM_QUALIFICACAO: '#eab308', SUSPENSO: '#f97316' }

const calcNivelAvaliacao = (nota) => {
  if (nota >= 90) return { nivel: 1, label: 'Nível 1 — Excelente', color: '#22c55e' }
  if (nota >= 75) return { nivel: 2, label: 'Nível 2 — Bom', color: '#4f7ef8' }
  if (nota >= 60) return { nivel: 3, label: 'Nível 3 — Regular', color: '#eab308' }
  return { nivel: 4, label: 'Nível 4 — Insuficiente', color: '#ef4444' }
}

const calcNotaAvaliacao = (criterios, valores) => {
  let total = 0
  for (const c of criterios) {
    const v = valores[c.id]
    if (v === undefined || v === '') continue
    let pts = 0
    if (c.tipo === 'select') {
      const op = c.opcoes?.find(o => o.v === v)
      pts = op ? op.pts : 0
    } else if (c.tipo === 'defeitos_por_milhao') {
      const n = Number(v)
      if (n === 0) pts = 10
      else if (n <= 100) pts = 8
      else if (n <= 500) pts = 6
      else if (n <= 1000) pts = 4
      else if (n <= 5000) pts = 2
      else pts = 0
    } else if (c.tipo === 'meses_demora') {
      const n = Number(v)
      if (n <= 1) pts = 10
      else if (n <= 2) pts = 7
      else if (n <= 3) pts = 5
      else if (n <= 6) pts = 3
      else pts = 0
    } else if (c.tipo === 'reclamacoes_24m') {
      const n = Number(v)
      if (n === 0) pts = 10
      else if (n === 1) pts = 8
      else if (n <= 3) pts = 6
      else if (n <= 5) pts = 3
      else pts = 0
    } else {
      pts = Math.max(0, Math.min(10, Number(v) || 0))
    }
    total += pts * (c.peso / 100)
  }
  return Math.round(total * 10)
}

const proximaRequalificacao = (dataCadastro, classificacao) => {
  if (!dataCadastro) return null
  const d = new Date(dataCadastro + 'T00:00:00')
  d.setFullYear(d.getFullYear() + (classificacao === 'CRITICO' ? 1 : 3))
  return d.toISOString().slice(0, 10)
}

const getCriteriosPorTipo = (tipo) => {
  if (tipo === 'MATERIAL_CRITICO') return CRITERIOS_MATERIAL_CRITICO
  if (tipo === 'SERVICO_CRITICO') return CRITERIOS_SERVICO_CRITICO
  return CRITERIOS_NAO_CRITICO
}

const getDocsPorClassificacao = (classificacao) =>
  classificacao === 'CRITICO' ? DOCS_CRITICO : DOCS_NAO_CRITICO


// ─── ESTILOS INLINE ───────────────────────────────────────────────────────────

const S = {
  app: { display: 'flex', height: '100vh', overflow: 'hidden' },
  sidebar: {
    width: 230, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden',
  },
  sidebarLogo: {
    padding: '20px 16px 16px', borderBottom: '1px solid var(--border)',
  },
  logoTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: .5 },
  logoSub: { fontSize: 11, color: 'var(--text3)', marginTop: 2 },
  nav: { flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
    borderRadius: 7, cursor: 'pointer', fontSize: 13, color: active ? 'var(--text)' : 'var(--text2)',
    background: active ? 'var(--surface3)' : 'transparent',
    transition: 'all .15s',
    border: 'none', width: '100%', textAlign: 'left',
  }),
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' },
  topbar: {
    padding: '16px 24px', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'var(--surface)', flexShrink: 0,
  },
  pageTitle: { fontSize: 17, fontWeight: 600, color: 'var(--text)' },
  content: { flex: 1, overflowY: 'auto', padding: 24 },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, padding: 20,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  statCard: (color) => ({
    background: 'var(--surface)', border: `1px solid var(--border)`,
    borderRadius: 10, padding: '18px 20px',
    borderLeft: `3px solid ${color}`,
  }),
  statNum: { fontSize: 28, fontWeight: 700 },
  statLabel: { fontSize: 12, color: 'var(--text2)', marginTop: 4 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600,
    color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: .5,
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '10px 12px', borderBottom: '1px solid var(--border)',
    fontSize: 13, color: 'var(--text)',
  },
  badge: (color, bg) => ({
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
    color: color, background: bg || color + '20',
  }),
  btn: (variant = 'primary') => ({
    background: variant === 'primary' ? 'var(--accent)' : variant === 'danger' ? '#ef444420' : 'var(--surface3)',
    color: variant === 'primary' ? '#fff' : variant === 'danger' ? '#ef4444' : 'var(--text)',
    border: variant === 'ghost' ? '1px solid var(--border)' : 'none',
    padding: '8px 16px', borderRadius: 7, fontWeight: 500,
    cursor: 'pointer', fontSize: 13, transition: 'all .15s',
  }),
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: .5 },
  input: { width: '100%', padding: '8px 12px' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  alertItem: (color) => ({
    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
    background: color + '10', border: `1px solid ${color}30`,
    borderRadius: 8, marginBottom: 8,
  }),
  tabs: { display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 20 },
  tab: (active) => ({
    padding: '8px 16px', cursor: 'pointer', fontSize: 13,
    color: active ? 'var(--text)' : 'var(--text3)',
    background: 'none', border: 'none',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    transition: 'all .15s',
  }),
}

// ─── COMPONENTES ─────────────────────────────────────────────────────────────

function Badge({ cor, texto }) {
  return <span style={S.badge(cor)}>{texto}</span>
}

function StatusBadge({ status, tipo = 'forn' }) {
  const labels = tipo === 'doc' ? statusDocLabel : statusFornLabel
  const colors = tipo === 'doc' ? statusDocColor : statusFornColor
  return <Badge cor={colors[status] || '#9da3b4'} texto={labels[status] || status} />
}

function BtnPrimary({ children, onClick, disabled, style }) {
  return (
    <button style={{ ...S.btn('primary'), ...style }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function BtnGhost({ children, onClick, style }) {
  return (
    <button style={{ ...S.btn('ghost'), ...style }} onClick={onClick}>
      {children}
    </button>
  )
}

function BtnDanger({ children, onClick }) {
  return (
    <button style={S.btn('danger')} onClick={onClick}>
      {children}
    </button>
  )
}

// ─── VIEW: DASHBOARD ─────────────────────────────────────────────────────────

function Dashboard({ data, onNavTo }) {
  const { fornecedores, documentos, avaliacoes } = data

  const stats = useMemo(() => {
    const total = fornecedores.length
    const qualificados = fornecedores.filter(f => f.statusQualificacao === 'QUALIFICADO').length
    const naoQualificados = fornecedores.filter(f => f.statusQualificacao === 'NAO_QUALIFICADO').length
    const emQualificacao = fornecedores.filter(f => f.statusQualificacao === 'EM_QUALIFICACAO').length
    const suspensos = fornecedores.filter(f => f.statusQualificacao === 'SUSPENSO').length
    const criticos = fornecedores.filter(f => f.classificacao === 'CRITICO').length
    return { total, qualificados, naoQualificados, emQualificacao, suspensos, criticos }
  }, [fornecedores])

  const alertas = useMemo(() => {
    const list = []
    // Documentos vencidos / vencendo
    documentos.forEach(doc => {
      const st = calcStatusDoc(doc)
      const forn = fornecedores.find(f => f.id === doc.fornecedorId)
      if (!forn) return
      if (st === 'VENCIDO') {
        list.push({ tipo: 'VENCIDO', color: '#ef4444', msg: `${forn.razaoSocial} — ${doc.label}: documento VENCIDO em ${fmt(doc.dataValidade)}`, fornId: forn.id })
      } else if (st === 'VENCENDO') {
        const dias = diffDias(doc.dataValidade)
        list.push({ tipo: 'VENCENDO', color: '#f97316', msg: `${forn.razaoSocial} — ${doc.label}: vence em ${dias} dia(s) (${fmt(doc.dataValidade)})`, fornId: forn.id })
      }
    })
    // Requalificação vencida/próxima
    fornecedores.forEach(forn => {
      if (!forn.dataProximaRequalificacao) return
      const dias = diffDias(forn.dataProximaRequalificacao)
      if (dias < 0) {
        list.push({ tipo: 'REQUALIFICACAO', color: '#ef4444', msg: `${forn.razaoSocial}: requalificação VENCIDA (${fmt(forn.dataProximaRequalificacao)})`, fornId: forn.id })
      } else if (dias <= 60) {
        list.push({ tipo: 'REQUALIFICACAO', color: '#eab308', msg: `${forn.razaoSocial}: requalificação em ${dias} dia(s) (${fmt(forn.dataProximaRequalificacao)})`, fornId: forn.id })
      }
    })
    return list.sort((a, b) => (a.tipo === 'VENCIDO' ? -1 : 1))
  }, [fornecedores, documentos])

  const recentes = useMemo(() =>
    [...fornecedores].sort((a, b) => b.dataCadastro?.localeCompare(a.dataCadastro)).slice(0, 5),
    [fornecedores])

  return (
    <div>
      {/* Estatísticas */}
      <div style={S.grid4}>
        <div style={S.statCard('#22c55e')}>
          <div style={{ ...S.statNum, color: '#22c55e' }}>{stats.qualificados}</div>
          <div style={S.statLabel}>Qualificados</div>
        </div>
        <div style={S.statCard('#eab308')}>
          <div style={{ ...S.statNum, color: '#eab308' }}>{stats.emQualificacao}</div>
          <div style={S.statLabel}>Em Qualificação</div>
        </div>
        <div style={S.statCard('#ef4444')}>
          <div style={{ ...S.statNum, color: '#ef4444' }}>{stats.naoQualificados}</div>
          <div style={S.statLabel}>Não Qualificados</div>
        </div>
        <div style={S.statCard('#4f7ef8')}>
          <div style={{ ...S.statNum, color: '#4f7ef8' }}>{stats.total}</div>
          <div style={S.statLabel}>Total de Fornecedores</div>
        </div>
      </div>

      <div style={{ ...S.grid2, marginTop: 20 }}>
        {/* Alertas */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Alertas Ativos</div>
            <Badge cor="#ef4444" texto={`${alertas.length}`} />
          </div>
          {alertas.length === 0 && (
            <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
              Nenhum alerta ativo
            </div>
          )}
          {alertas.slice(0, 8).map((a, i) => (
            <div key={i} style={S.alertItem(a.color)} onClick={() => onNavTo('detalhe', a.fornId)} className="alert-row">
              <span style={{ fontSize: 16, marginTop: 1 }}>
                {a.tipo === 'VENCIDO' || a.tipo === 'REQUALIFICACAO' ? '🔴' : '🟠'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text)', cursor: 'pointer', lineHeight: 1.4 }}>{a.msg}</span>
            </div>
          ))}
        </div>

        {/* Fornecedores recentes */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Fornecedores Recentes</div>
          {recentes.length === 0 && (
            <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
              Nenhum fornecedor cadastrado
            </div>
          )}
          {recentes.map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              onClick={() => onNavTo('detalhe', f.id)}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.razaoSocial}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{f.tipoServico}</div>
              </div>
              <StatusBadge status={f.statusQualificacao} />
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição por tipo */}
      <div style={{ ...S.card, marginTop: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Distribuição por Classificação</div>
        <div style={S.grid3}>
          {[
            { label: 'Críticos (Total)', val: stats.criticos, color: '#ef4444' },
            { label: 'Não Críticos', val: stats.total - stats.criticos, color: '#22c55e' },
            { label: 'Suspensos', val: stats.suspensos, color: '#f97316' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: item.color }}>{item.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── VIEW: LISTA DE FORNECEDORES ──────────────────────────────────────────────

function ListaFornecedores({ data, onNavTo, onNovo }) {
  const { fornecedores, documentos } = data
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroClass, setFiltroClass] = useState('')
  const [busca, setBusca] = useState('')

  const lista = useMemo(() => {
    return fornecedores.filter(f => {
      if (filtroStatus && f.statusQualificacao !== filtroStatus) return false
      if (filtroClass && f.classificacao !== filtroClass) return false
      if (busca && !f.razaoSocial.toLowerCase().includes(busca.toLowerCase()) &&
          !f.cnpj?.includes(busca)) return false
      return true
    })
  }, [fornecedores, filtroStatus, filtroClass, busca])

  const getAlertaDoc = (fornId) => {
    const docs = documentos.filter(d => d.fornecedorId === fornId)
    if (docs.some(d => calcStatusDoc(d) === 'VENCIDO')) return { cor: '#ef4444', label: 'Doc. Vencido' }
    if (docs.some(d => calcStatusDoc(d) === 'VENCENDO')) return { cor: '#f97316', label: 'Doc. Vencendo' }
    if (docs.some(d => calcStatusDoc(d) === 'PENDENTE')) return { cor: '#9da3b4', label: 'Pendente' }
    if (docs.length > 0) return { cor: '#22c55e', label: 'Docs OK' }
    return { cor: '#6b7280', label: 'Sem docs' }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <input placeholder="Buscar por razão social ou CNPJ..." style={{ ...S.input, flex: 1, minWidth: 200 }}
          value={busca} onChange={e => setBusca(e.target.value)} />
        <select style={{ padding: '8px 12px' }} value={filtroClass} onChange={e => setFiltroClass(e.target.value)}>
          <option value="">Todas as classificações</option>
          <option value="CRITICO">Crítico</option>
          <option value="NAO_CRITICO">Não Crítico</option>
        </select>
        <select style={{ padding: '8px 12px' }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="QUALIFICADO">Qualificado</option>
          <option value="EM_QUALIFICACAO">Em Qualificação</option>
          <option value="NAO_QUALIFICADO">Não Qualificado</option>
          <option value="SUSPENSO">Suspenso</option>
        </select>
        <BtnPrimary onClick={onNovo}>+ Novo Fornecedor</BtnPrimary>
      </div>

      <div style={S.card}>
        {lista.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px 0' }}>
            {fornecedores.length === 0
              ? 'Nenhum fornecedor cadastrado. Clique em "+ Novo Fornecedor" para começar.'
              : 'Nenhum resultado para os filtros selecionados.'}
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                {['Fornecedor', 'CNPJ', 'Classificação', 'Tipo de Serviço', 'Qualificação', 'Documentos', 'Próx. Requalificação', 'Responsável'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
                <th style={S.th} />
              </tr>
            </thead>
            <tbody>
              {lista.map(f => {
                const alertaDoc = getAlertaDoc(f.id)
                const diasReq = diffDias(f.dataProximaRequalificacao)
                return (
                  <tr key={f.id} style={{ cursor: 'pointer' }} onClick={() => onNavTo('detalhe', f.id)}>
                    <td style={S.td}>
                      <div style={{ fontWeight: 500 }}>{f.razaoSocial}</div>
                      {f.nomeFantasia && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{f.nomeFantasia}</div>}
                    </td>
                    <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 12 }}>{f.cnpj || '—'}</td>
                    <td style={S.td}>
                      <Badge cor={f.classificacao === 'CRITICO' ? '#ef4444' : '#22c55e'}
                        texto={f.classificacao === 'CRITICO' ? 'Crítico' : 'Não Crítico'} />
                    </td>
                    <td style={{ ...S.td, maxWidth: 160 }}>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>{f.tipoServico || '—'}</div>
                    </td>
                    <td style={S.td}><StatusBadge status={f.statusQualificacao} /></td>
                    <td style={S.td}><Badge cor={alertaDoc.cor} texto={alertaDoc.label} /></td>
                    <td style={S.td}>
                      {f.dataProximaRequalificacao ? (
                        <span style={{ color: diasReq !== null && diasReq < 0 ? '#ef4444' : diasReq !== null && diasReq <= 60 ? '#eab308' : 'var(--text)' }}>
                          {fmt(f.dataProximaRequalificacao)}
                          {diasReq !== null && diasReq <= 60 && <span style={{ fontSize: 11, marginLeft: 4 }}>({diasReq}d)</span>}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ ...S.td, color: 'var(--text2)' }}>{f.responsavel || '—'}</td>
                    <td style={S.td}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13 }}
                        onClick={e => { e.stopPropagation(); onNavTo('detalhe', f.id) }}>
                        Ver →
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── VIEW: FORMULÁRIO DE FORNECEDOR ──────────────────────────────────────────

function FormFornecedor({ fornecedor, onSalvar, onCancelar }) {
  const isEdicao = !!fornecedor
  const tipoInfo = TIPOS_SERVICO.find(t => t.label === fornecedor?.tipoServico) || TIPOS_SERVICO[0]

  const tipoServicoIdInicial = fornecedor
    ? (TIPOS_SERVICO.find(t => t.label === fornecedor.tipoServico)?.id || TIPOS_SERVICO[0].id)
    : (tipoInfo?.id || TIPOS_SERVICO[0].id)

  const [form, setForm] = useState({
    razaoSocial: '', nomeFantasia: '', cnpj: '', inscricaoMunicipal: '', inscricaoEstadual: '',
    endereco: '', cidade: '', estado: '', cep: '', telefone: '', email: '',
    nomeContato: '', cargoContato: '',
    statusQualificacao: 'EM_QUALIFICACAO',
    responsavel: '', observacoes: '',
    dataCadastro: hoje(),
    ...fornecedor,
    tipoServicoId: tipoServicoIdInicial,
  })

  const tipoSelecionado = TIPOS_SERVICO.find(t => t.id === form.tipoServicoId)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = () => {
    if (!form.razaoSocial.trim()) return alert('Razão Social é obrigatória.')
    const tipo = TIPOS_SERVICO.find(t => t.id === form.tipoServicoId)
    onSalvar({
      ...form,
      id: fornecedor?.id || uid(),
      classificacao: tipo?.classificacao || 'NAO_CRITICO',
      tipoFornecimento: tipo?.tipoFornecimento || 'NAO_CRITICO',
      tipoServico: tipo?.label || '',
      dataProximaRequalificacao: proximaRequalificacao(form.dataCadastro, tipo?.classificacao || 'NAO_CRITICO'),
    })
  }

  const F = ({ label, k, type = 'text', opts, span }) => (
    <div style={{ ...S.formGroup, gridColumn: span ? `span ${span}` : undefined }}>
      <label style={S.label}>{label}</label>
      {opts ? (
        <select style={S.input} value={form[k]} onChange={e => set(k, e.target.value)}>
          {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea style={{ ...S.input, height: 72, resize: 'vertical' }} value={form[k]}
          onChange={e => set(k, e.target.value)} />
      ) : (
        <input type={type} style={S.input} value={form[k]} onChange={e => set(k, e.target.value)} />
      )}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{isEdicao ? 'Editar Fornecedor' : 'Novo Fornecedor'}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>POP-GQ-012-02 Cadastro e Qualificação de Fornecedores</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <BtnGhost onClick={onCancelar}>Cancelar</BtnGhost>
          <BtnPrimary onClick={salvar}>Salvar Fornecedor</BtnPrimary>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={S.card}>
          <div style={S.sectionTitle}>1. Dados Cadastrais</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <F label="Razão Social *" k="razaoSocial" span={2} />
            <F label="Nome Fantasia" k="nomeFantasia" />
            <F label="CNPJ" k="cnpj" />
            <F label="Inscrição Municipal" k="inscricaoMunicipal" />
            <F label="Inscrição Estadual" k="inscricaoEstadual" />
            <F label="Endereço" k="endereco" span={2} />
            <F label="Cidade" k="cidade" />
            <F label="Estado" k="estado" />
            <F label="CEP" k="cep" />
            <F label="Telefone" k="telefone" />
            <F label="E-mail" k="email" type="email" />
            <F label="Nome do Contato (Qualidade)" k="nomeContato" />
            <F label="Cargo do Contato" k="cargoContato" />
            <F label="Data de Cadastro" k="dataCadastro" type="date" />
          </div>
        </div>

        <div style={S.card}>
          <div style={S.sectionTitle}>2. Tipo de Fornecimento</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ ...S.formGroup, gridColumn: 'span 2' }}>
              <label style={S.label}>Tipo de Serviço / Material</label>
              <select style={S.input} value={form.tipoServicoId} onChange={e => set('tipoServicoId', e.target.value)}>
                <optgroup label="Não Críticos">
                  {TIPOS_SERVICO.filter(t => t.classificacao === 'NAO_CRITICO').map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Críticos — Material">
                  {TIPOS_SERVICO.filter(t => t.tipoFornecimento === 'MATERIAL_CRITICO').map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Críticos — Serviço">
                  {TIPOS_SERVICO.filter(t => t.tipoFornecimento === 'SERVICO_CRITICO').map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Classificação (automático)</label>
              <div style={{ padding: '8px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge cor={tipoSelecionado?.classificacao === 'CRITICO' ? '#ef4444' : '#22c55e'}
                  texto={tipoSelecionado?.classificacao === 'CRITICO' ? 'Crítico' : 'Não Crítico'} />
                {tipoSelecionado?.tipoFornecimento && (
                  <Badge cor="#4f7ef8"
                    texto={tipoSelecionado.tipoFornecimento === 'MATERIAL_CRITICO' ? 'Material Crítico' : 'Serviço Crítico'} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.sectionTitle}>3. Status e Responsável</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <F label="Status de Qualificação" k="statusQualificacao" opts={[
              { v: 'EM_QUALIFICACAO', l: 'Em Qualificação' },
              { v: 'QUALIFICADO', l: 'Qualificado' },
              { v: 'NAO_QUALIFICADO', l: 'Não Qualificado' },
              { v: 'SUSPENSO', l: 'Suspenso' },
            ]} />
            <F label="Responsável (GQ)" k="responsavel" />
            <F label="Observações" k="observacoes" type="textarea" span={3} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── VIEW: DETALHE DO FORNECEDOR ──────────────────────────────────────────────

function DetalheFornecedor({ fornecedor, data, onEditar, onExcluir, onSalvarDoc, onExcluirDoc, onSalvarAvaliacao, onVoltar }) {
  const [tab, setTab] = useState('docs')
  const [novoDoc, setNovoDoc] = useState(null)
  const [formAvaliacao, setFormAvaliacao] = useState(null)
  const [formDoc, setFormDoc] = useState(null)

  const docs = data.documentos.filter(d => d.fornecedorId === fornecedor.id)
  const avaliacoes = data.avaliacoes.filter(a => a.fornecedorId === fornecedor.id)

  const tipoAval = fornecedor.tipoFornecimento || 'NAO_CRITICO'
  const criterios = getCriteriosPorTipo(tipoAval)
  const docsTipo = getDocsPorClassificacao(fornecedor.classificacao)

  // Docs já cadastrados indexados por id
  const docsById = {}
  docs.forEach(d => { docsById[d.docTipoId] = d })

  const iniciarNovoDoc = (docTipo) => {
    const existente = docsById[docTipo.id]
    setFormDoc(existente ? { ...existente } : {
      id: uid(), fornecedorId: fornecedor.id, docTipoId: docTipo.id,
      label: docTipo.label, situacao: 'RECEBIDO', dataValidade: '', observacoes: ''
    })
  }

  const salvarDoc = () => {
    onSalvarDoc(formDoc)
    setFormDoc(null)
  }

  const iniciarAvaliacao = () => {
    const vals = {}
    criterios.forEach(c => { vals[c.id] = c.tipo === 'select' ? '' : '' })
    setFormAvaliacao({ valores: vals, periodo: '', dataAvaliacao: hoje(), responsavel: '', observacoes: '' })
  }

  const salvarAvaliacao = () => {
    const nota = calcNotaAvaliacao(criterios, formAvaliacao.valores)
    const nivel = calcNivelAvaliacao(nota)
    onSalvarAvaliacao({
      id: uid(),
      fornecedorId: fornecedor.id,
      tipoAvaliacao: tipoAval,
      periodo: formAvaliacao.periodo,
      dataAvaliacao: formAvaliacao.dataAvaliacao,
      responsavel: formAvaliacao.responsavel,
      observacoes: formAvaliacao.observacoes,
      valores: formAvaliacao.valores,
      notaFinal: nota,
      nivel: nivel.nivel,
    })
    setFormAvaliacao(null)
  }

  const ultimaAvaliacao = avaliacoes.length > 0
    ? [...avaliacoes].sort((a, b) => b.dataAvaliacao.localeCompare(a.dataAvaliacao))[0]
    : null

  return (
    <div>
      {/* Header do fornecedor */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{fornecedor.razaoSocial}</div>
            <StatusBadge status={fornecedor.statusQualificacao} />
            <Badge cor={fornecedor.classificacao === 'CRITICO' ? '#ef4444' : '#22c55e'}
              texto={fornecedor.classificacao === 'CRITICO' ? 'Crítico' : 'Não Crítico'} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
            {fornecedor.cnpj && <span>CNPJ: {fornecedor.cnpj} · </span>}
            {fornecedor.tipoServico && <span>{fornecedor.tipoServico}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <BtnGhost onClick={onVoltar}>← Voltar</BtnGhost>
          <BtnGhost onClick={onEditar}>Editar</BtnGhost>
          <BtnDanger onClick={onExcluir}>Excluir</BtnDanger>
        </div>
      </div>

      {/* Resumo */}
      <div style={{ ...S.grid4, marginBottom: 20 }}>
        {[
          { label: 'Cadastro', val: fmt(fornecedor.dataCadastro) },
          { label: 'Próx. Requalificação', val: fmt(fornecedor.dataProximaRequalificacao), alert: diffDias(fornecedor.dataProximaRequalificacao) },
          { label: 'Última Avaliação', val: ultimaAvaliacao ? fmt(ultimaAvaliacao.dataAvaliacao) : '—' },
          { label: 'Nota Última Aval.', val: ultimaAvaliacao ? `${ultimaAvaliacao.notaFinal}/100` : '—', color: ultimaAvaliacao ? calcNivelAvaliacao(ultimaAvaliacao.notaFinal).color : undefined },
        ].map(item => (
          <div key={item.label} style={S.statCard(item.color || 'var(--border)')}>
            <div style={{ fontSize: 18, fontWeight: 700, color: item.color || 'var(--text)' }}>{item.val}</div>
            <div style={S.statLabel}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {[
          { k: 'docs', label: `Documentos (${docs.length}/${docsTipo.length})` },
          { k: 'avaliacoes', label: `Avaliações (${avaliacoes.length})` },
          { k: 'info', label: 'Dados Cadastrais' },
        ].map(t => (
          <button key={t.k} style={S.tab(tab === t.k)} onClick={() => setTab(t.k)}>{t.label}</button>
        ))}
      </div>

      {/* Tab: Documentos */}
      {tab === 'docs' && (
        <div>
          <table style={S.table}>
            <thead>
              <tr>
                {['Documento', 'Obrigatório', 'Situação', 'Validade', 'Status', 'Obs.', ''].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docsTipo.map(dt => {
                const doc = docsById[dt.id]
                const st = doc ? calcStatusDoc(doc) : 'PENDENTE'
                return (
                  <tr key={dt.id}>
                    <td style={S.td}>{dt.label}</td>
                    <td style={S.td}>
                      <Badge cor={dt.obrigatorio ? '#ef4444' : '#6b7280'} texto={dt.obrigatorio ? 'Sim' : 'Opcional'} />
                    </td>
                    <td style={S.td}>
                      {doc ? (
                        <Badge cor={doc.situacao === 'RECEBIDO' ? '#22c55e' : doc.situacao === 'NAO_APLICAVEL' ? '#6b7280' : '#9da3b4'}
                          texto={doc.situacao === 'RECEBIDO' ? 'Recebido' : doc.situacao === 'NAO_APLICAVEL' ? 'N/A' : 'Pendente'} />
                      ) : (
                        <Badge cor="#9da3b4" texto="Pendente" />
                      )}
                    </td>
                    <td style={S.td}>{doc?.dataValidade ? fmt(doc.dataValidade) : '—'}</td>
                    <td style={S.td}><StatusBadge status={st} tipo="doc" /></td>
                    <td style={{ ...S.td, color: 'var(--text3)', fontSize: 12, maxWidth: 140 }}>{doc?.observacoes || '—'}</td>
                    <td style={S.td}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12 }}
                        onClick={() => iniciarNovoDoc(dt)}>
                        {doc ? 'Editar' : '+ Registrar'}
                      </button>
                      {doc && (
                        <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, marginLeft: 8 }}
                          onClick={() => onExcluirDoc(doc.id)}>
                          Remover
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Modal de doc */}
          {formDoc && (
            <div style={{ position: 'fixed', inset: 0, background: '#00000080', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ ...S.card, width: 480, maxWidth: '95vw' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Registrar Documento</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>{formDoc.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={S.formGroup}>
                    <label style={S.label}>Situação</label>
                    <select style={S.input} value={formDoc.situacao}
                      onChange={e => setFormDoc(f => ({ ...f, situacao: e.target.value }))}>
                      <option value="RECEBIDO">Recebido</option>
                      <option value="PENDENTE">Pendente (solicitado)</option>
                      <option value="NAO_APLICAVEL">Não Aplicável (N/A)</option>
                    </select>
                  </div>
                  {formDoc.situacao !== 'NAO_APLICAVEL' && (
                    <div style={S.formGroup}>
                      <label style={S.label}>Data de Validade</label>
                      <input type="date" style={S.input} value={formDoc.dataValidade}
                        onChange={e => setFormDoc(f => ({ ...f, dataValidade: e.target.value }))} />
                    </div>
                  )}
                  <div style={S.formGroup}>
                    <label style={S.label}>Observações</label>
                    <textarea style={{ ...S.input, height: 60, resize: 'vertical' }} value={formDoc.observacoes}
                      onChange={e => setFormDoc(f => ({ ...f, observacoes: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <BtnGhost onClick={() => setFormDoc(null)}>Cancelar</BtnGhost>
                    <BtnPrimary onClick={salvarDoc}>Salvar</BtnPrimary>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Avaliações */}
      {tab === 'avaliacoes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <BtnPrimary onClick={iniciarAvaliacao}>+ Nova Avaliação</BtnPrimary>
          </div>

          {formAvaliacao && (
            <div style={{ ...S.card, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Nova Avaliação de Desempenho</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
                {tipoAval === 'MATERIAL_CRITICO' ? 'POP-GQ-012-05' : tipoAval === 'SERVICO_CRITICO' ? 'POP-GQ-012-06' : 'POP-GQ-012-04'}
                {' — '}
                {tipoAval === 'NAO_CRITICO' ? 'Não Crítico' : tipoAval === 'MATERIAL_CRITICO' ? 'Material Crítico' : 'Serviço Crítico'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={S.formGroup}>
                  <label style={S.label}>Período (ex: 2026-S1)</label>
                  <input style={S.input} placeholder="2026-S1" value={formAvaliacao.periodo}
                    onChange={e => setFormAvaliacao(f => ({ ...f, periodo: e.target.value }))} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Data da Avaliação</label>
                  <input type="date" style={S.input} value={formAvaliacao.dataAvaliacao}
                    onChange={e => setFormAvaliacao(f => ({ ...f, dataAvaliacao: e.target.value }))} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Responsável</label>
                  <input style={S.input} value={formAvaliacao.responsavel}
                    onChange={e => setFormAvaliacao(f => ({ ...f, responsavel: e.target.value }))} />
                </div>
              </div>

              {/* Critérios por dimensão */}
              {(() => {
                const dimensoes = [...new Set(criterios.map(c => c.dimensao))]
                return dimensoes.map(dim => (
                  <div key={dim} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>{dim}</div>
                    {criterios.filter(c => c.dimensao === dim).map(c => (
                      <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 13 }}>{c.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.hint || ''} · Peso: {c.peso}%</div>
                        </div>
                        {c.tipo === 'select' ? (
                          <select style={S.input} value={formAvaliacao.valores[c.id]}
                            onChange={e => setFormAvaliacao(f => ({ ...f, valores: { ...f.valores, [c.id]: e.target.value } }))}>
                            <option value="">Selecione...</option>
                            {c.opcoes.map(o => <option key={o.v} value={o.v}>{o.l} ({o.pts} pts)</option>)}
                          </select>
                        ) : (
                          <input type="number" min="0" style={S.input} placeholder={c.tipo === 'defeitos_por_milhao' ? 'Defeitos/mi' : c.tipo === 'meses_demora' ? 'Meses' : '0-10'}
                            value={formAvaliacao.valores[c.id]}
                            onChange={e => setFormAvaliacao(f => ({ ...f, valores: { ...f.valores, [c.id]: e.target.value } }))} />
                        )}
                        <div style={{ fontSize: 12, color: 'var(--text2)', minWidth: 60, textAlign: 'right' }}>
                          Peso {c.peso}%
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              })()}

              {/* Nota preview */}
              {(() => {
                const nota = calcNotaAvaliacao(criterios, formAvaliacao.valores)
                const nivel = calcNivelAvaliacao(nota)
                return (
                  <div style={{ background: nivel.color + '15', border: `1px solid ${nivel.color}40`, borderRadius: 8, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>Nota Final Calculada</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: nivel.color }}>{nota}<span style={{ fontSize: 14 }}>/100</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: nivel.color }}>{nivel.label}</div>
                    </div>
                  </div>
                )
              })()}

              <div style={S.formGroup}>
                <label style={S.label}>Observações</label>
                <textarea style={{ ...S.input, height: 60, resize: 'vertical' }} value={formAvaliacao.observacoes}
                  onChange={e => setFormAvaliacao(f => ({ ...f, observacoes: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                <BtnGhost onClick={() => setFormAvaliacao(null)}>Cancelar</BtnGhost>
                <BtnPrimary onClick={salvarAvaliacao}>Salvar Avaliação</BtnPrimary>
              </div>
            </div>
          )}

          {/* Histórico */}
          {avaliacoes.length === 0 && !formAvaliacao && (
            <div style={{ ...S.card, textAlign: 'center', color: 'var(--text3)', padding: '40px 0' }}>
              Nenhuma avaliação registrada. As avaliações devem ser realizadas semestralmente.
            </div>
          )}
          {[...avaliacoes].sort((a, b) => b.dataAvaliacao.localeCompare(a.dataAvaliacao)).map(av => {
            const nivel = calcNivelAvaliacao(av.notaFinal)
            return (
              <div key={av.id} style={{ ...S.card, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Período: {av.periodo || '—'}</div>
                      <Badge cor={nivel.color} texto={nivel.label} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                      Avaliado em {fmt(av.dataAvaliacao)} · Por: {av.responsavel || '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: nivel.color }}>{av.notaFinal}<span style={{ fontSize: 14 }}>/100</span></div>
                </div>
                {av.observacoes && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>{av.observacoes}</div>}
              </div>
            )
          })}
        </div>
      )}

      {/* Tab: Dados Cadastrais */}
      {tab === 'info' && (
        <div style={S.card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['Razão Social', fornecedor.razaoSocial],
              ['Nome Fantasia', fornecedor.nomeFantasia],
              ['CNPJ', fornecedor.cnpj],
              ['Insc. Municipal', fornecedor.inscricaoMunicipal],
              ['Insc. Estadual', fornecedor.inscricaoEstadual],
              ['Endereço', [fornecedor.endereco, fornecedor.cidade, fornecedor.estado, fornecedor.cep].filter(Boolean).join(', ')],
              ['Telefone', fornecedor.telefone],
              ['E-mail', fornecedor.email],
              ['Contato (Qualidade)', fornecedor.nomeContato ? `${fornecedor.nomeContato} — ${fornecedor.cargoContato || ''}` : null],
              ['Responsável GQ', fornecedor.responsavel],
              ['Observações', fornecedor.observacoes],
            ].map(([k, v]) => v ? (
              <div key={k}>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5 }}>{k}</div>
                <div style={{ fontSize: 13, marginTop: 3 }}>{v}</div>
              </div>
            ) : null)}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'lista', icon: '📋', label: 'Fornecedores' },
]

export default function App() {
  const [view, setView] = useState('dashboard')
  const [selectedId, setSelectedId] = useState(null)
  const [editando, setEditando] = useState(null)
  const [data, setData] = useState({ fornecedores: [], documentos: [], avaliacoes: [] })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/fornecedores').then(r => r.json()),
      fetch('/api/documentos').then(r => r.json()),
      fetch('/api/avaliacoes').then(r => r.json()),
    ]).then(([fornecedores, documentos, avaliacoes]) => {
      setData({ fornecedores, documentos, avaliacoes })
      setLoading(false)
    }).catch(() => {
      setLoadError('Erro ao conectar com o servidor.')
      setLoading(false)
    })
  }, [])

  const navTo = (v, id) => {
    setView(v)
    if (id) setSelectedId(id)
  }

  const call = (url, method = 'GET', body) =>
    fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    }).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })

  // CRUD Fornecedor
  const salvarFornecedor = async (forn) => {
    const isNew = !data.fornecedores.find(f => f.id === forn.id)
    await call(isNew ? '/api/fornecedores' : `/api/fornecedores?id=${forn.id}`, isNew ? 'POST' : 'PUT', forn)
    setData(d => ({
      ...d,
      fornecedores: isNew
        ? [...d.fornecedores, forn]
        : d.fornecedores.map(f => f.id === forn.id ? forn : f)
    }))
    setEditando(null)
    navTo('detalhe', forn.id)
  }

  const excluirFornecedor = async (id) => {
    if (!window.confirm('Excluir este fornecedor e todos os seus dados? Esta ação não pode ser desfeita.')) return
    await call(`/api/fornecedores?id=${id}`, 'DELETE')
    setData(d => ({
      ...d,
      fornecedores: d.fornecedores.filter(f => f.id !== id),
      documentos: d.documentos.filter(doc => doc.fornecedorId !== id),
      avaliacoes: d.avaliacoes.filter(a => a.fornecedorId !== id),
    }))
    navTo('lista')
  }

  // CRUD Documentos
  const salvarDoc = async (doc) => {
    await call('/api/documentos', 'POST', doc)
    setData(d => {
      const existing = d.documentos.find(x => x.id === doc.id)
      return {
        ...d,
        documentos: existing
          ? d.documentos.map(x => x.id === doc.id ? doc : x)
          : [...d.documentos, doc]
      }
    })
  }

  const excluirDoc = async (docId) => {
    await call(`/api/documentos?id=${docId}`, 'DELETE')
    setData(d => ({ ...d, documentos: d.documentos.filter(x => x.id !== docId) }))
  }

  // CRUD Avaliações
  const salvarAvaliacao = async (av) => {
    await call('/api/avaliacoes', 'POST', av)
    setData(d => ({ ...d, avaliacoes: [...d.avaliacoes, av] }))
  }

  const selectedForn = data.fornecedores.find(f => f.id === selectedId)

  const pageTitle = {
    dashboard: 'Dashboard',
    lista: 'Fornecedores',
    novo: 'Novo Fornecedor',
    detalhe: selectedForn?.razaoSocial || 'Detalhe',
    editar: 'Editar Fornecedor',
  }[view] || ''

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>Carregando GEDSUP...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (loadError) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 15, color: '#ef4444' }}>{loadError}</div>
      <button onClick={() => window.location.reload()} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer' }}>
        Tentar novamente
      </button>
    </div>
  )

  const alertCount = useMemo(() => {
    let n = 0
    data.documentos.forEach(d => { const s = calcStatusDoc(d); if (s === 'VENCIDO' || s === 'VENCENDO') n++ })
    data.fornecedores.forEach(f => {
      if (!f.dataProximaRequalificacao) return
      if (diffDias(f.dataProximaRequalificacao) <= 60) n++
    })
    return n
  }, [data])

  return (
    <div style={S.app}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>MSB Medical</div>
          <div style={S.logoTitle}>GEDSUP</div>
          <div style={S.logoSub}>Gestão de Fornecedores</div>
        </div>
        <nav style={S.nav}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} style={S.navItem(view === item.id || (item.id === 'lista' && (view === 'detalhe' || view === 'editar')))}
              onClick={() => setView(item.id)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'dashboard' && alertCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>
                  {alertCount}
                </span>
              )}
            </button>
          ))}

          <div style={{ marginTop: 'auto', padding: '8px 4px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', padding: '4px 6px' }}>POP-GQ-012 Rev.00</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', padding: '2px 6px' }}>RDC 665/2022 · ISO 13485</div>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main style={S.main}>
        <header style={S.topbar}>
          <div>
            <div style={S.pageTitle}>{pageTitle}</div>
            {view === 'dashboard' && (
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                {data.fornecedores.length} fornecedor(es) cadastrado(s)
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </header>

        <div style={S.content}>
          {view === 'dashboard' && (
            <Dashboard data={data} onNavTo={navTo} />
          )}
          {view === 'lista' && (
            <ListaFornecedores data={data} onNavTo={navTo} onNovo={() => setView('novo')} />
          )}
          {view === 'novo' && (
            <FormFornecedor
              onSalvar={salvarFornecedor}
              onCancelar={() => setView('lista')}
            />
          )}
          {view === 'editar' && editando && (
            <FormFornecedor
              fornecedor={editando}
              onSalvar={salvarFornecedor}
              onCancelar={() => navTo('detalhe', editando.id)}
            />
          )}
          {view === 'detalhe' && selectedForn && (
            <DetalheFornecedor
              fornecedor={selectedForn}
              data={data}
              onEditar={() => { setEditando(selectedForn); setView('editar') }}
              onExcluir={() => excluirFornecedor(selectedForn.id)}
              onSalvarDoc={salvarDoc}
              onExcluirDoc={excluirDoc}
              onSalvarAvaliacao={salvarAvaliacao}
              onVoltar={() => setView('lista')}
            />
          )}
        </div>
      </main>
    </div>
  )
}
