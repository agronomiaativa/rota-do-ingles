// Formato do quiz.config.ts. Você não precisa editar este arquivo.

export type Nivel = 'A1' | 'A2' | 'B1' | 'B2'
export type NivelRegua = Nivel | 'C1'

export interface PerguntaPerfil {
  /** "objetivo", "trava" e "tempo" viram variáveis dos textos. "historico" não é usada nos textos. */
  id: 'objetivo' | 'historico' | 'trava' | 'tempo'
  titulo: string
  opcoes: { texto: string; valor: string }[]
}

export interface PerguntaTeste {
  nivel: Nivel
  tema: string
  enunciado: string
  correta: string
  erradas: string[]
  /** "en" quando as opções estão em inglês (ajuda os leitores de tela). */
  idiomaOpcoes: 'en' | 'pt-BR'
}

export interface DadosNivel {
  nome: string
  minAcertos: number
  proximo: NivelRegua
  diagnostico: string[]
}

export interface Plano {
  id: 'essencial' | 'completo'
  nome: string
  preco: number
  selo?: string
  destaque: boolean
  itens: { texto: string; incluso: boolean }[]
  botao: string
}

export interface PaginaPrevia {
  /** Caminho em /public, sem a extensão. Precisa existir "nome.webp" (grande) e "nome-p.webp" (pequena). */
  imagem: string
  rotulo: string
  /** Um texto para todos os níveis ou um por nível. */
  legenda: string | Record<Nivel, string>
  /** Legenda para quem acertou todas as perguntas (só na página do Guia das Lacunas). */
  legendaSemLacuna?: string
}

export interface Depoimento {
  nome: string
  detalhe: string
  texto: string
}

export interface SecaoLegal {
  titulo: string
  paragrafos: string[]
}

export interface PaginaLegal {
  titulo: string
  avisoProvisorio: string
  secoes: SecaoLegal[]
}

export interface QuizConfig {
  AB_RANDOM: boolean
  CHECKOUT_PASS_NAME: boolean
  CONSENT_BANNER: boolean
  marca: { nome: string; tituloPagina: string; descricaoPagina: string }
  interface: Record<
    | 'voltar'
    | 'progresso'
    | 'perguntaDe'
    | 'naoSei'
    | 'voceEsta'
    | 'proximo'
    | 'descricaoRegua'
    | 'gratis'
    | 'de'
    | 'naoIncluso'
    | 'checkoutIndisponivel'
    | 'voltarAoTeste',
    string
  >
  capa: {
    titulo: string
    subtitulo: string
    selos: string[]
    seloTestes: { ativo: boolean; numero: number; texto: string }
    botao: string
  }
  perfil: PerguntaPerfil[]
  transicao: { titulo: string; texto: string; botao: string }
  perguntas: PerguntaTeste[]
  incentivo: { depoisDaPergunta: number; duracaoMs: number; texto: string }
  nome: {
    titulo: string
    texto: string
    rotulo: string
    exemplo: string
    botao: string
    erroCurto: string
    erroLongo: string
    erroInvalido: string
  }
  calculo: { titulo: string; duracaoMs: number; itens: string[] }
  niveis: Record<Nivel, DadosNivel>
  resultado: {
    titulo: string
    tituloNivel: string
    acertos: string
    rotuloFortes: string
    rotuloLacunas: string
    semPontosFortes: string
    semLacunas: string
    maxFortes: number
    maxLacunas: number
    separadorTemas: string
    plano: string
    diasDoPlano: number
    tituloPlano: string
    semanas: { rotulo: string; texto: string }[]
    rodapePlano: string
  }
  oferta: {
    cronometro: { segundos: number; texto: string; textoFim: string }
    titulo: string
    subtitulo: string
    tituloEntregas: string
    entregas: { icone: string; texto: string; detalhe: string }[]
    tituloBonus: string
    bonus: { nome: string; detalhe?: string; precoDe: number }[]
    preco: {
      valor: number
      ancora: number
      textoAncora: string
      textoHoje: string
      complemento: string
      parcelado: { ativo: boolean; texto: string }
      condicoes: string
      botao: string
    }
    nomeConteudoPixel: string
    moeda: string
    varianteB: { titulo: string; planos: Plano[]; condicoes: string }
    tituloPassos: string
    passos: string[]
    previa: {
      titulo: string
      subtitulo: string
      trocaMs: number
      alt: string
      paginas: PaginaPrevia[]
    }
    depoimentos: { ativo: boolean; titulo: string; itens: Depoimento[] }
    garantia: { icone: string; titulo: string; texto: string }
    tituloFaq: string
    faq: { pergunta: string; resposta: string; respostaVarianteB?: string }[]
  }
  rodape: {
    aviso: string
    privacidade: string
    termos: string
    cookies: string
    copyright: string
  }
  cookies: { texto: string; aceitar: string; recusar: string; saibaMais: string }
  legal: { privacidade: PaginaLegal; termos: PaginaLegal }
}
