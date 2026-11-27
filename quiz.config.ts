import type { QuizConfig } from './tipos'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TODO O CONTEÚDO DO FUNIL FICA AQUI.
 *
 *  Variáveis que você pode usar nos textos (entre chaves):
 *  {nome} {objetivo} {trava} {tempo} {nivel} {nome_nivel} {proximo_nivel}
 *  {acertos} {data_fim} {fortes} {lacunas}
 *
 *  Os links de checkout e o ID do Pixel ficam no arquivo .env (veja .env.example).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const config: QuizConfig = {
  // ── Chaves liga/desliga ────────────────────────────────────────────────────
  /** true = sorteia 50/50 entre a variante A (preço único) e a B (dois planos). ?v=a e ?v=b sempre valem. */
  AB_RANDOM: false,
  /** true = envia o primeiro nome para o checkout (?name=...), para o campo já vir preenchido. */
  CHECKOUT_PASS_NAME: true,
  /** true = mostra o aviso de cookies e só liga o Pixel depois do "Aceitar". */
  CONSENT_BANNER: false,

  marca: {
    nome: 'Rota do Inglês',
    tituloPagina: 'Qual é o seu nível real de inglês? Teste gratuito | Rota do Inglês',
    descricaoPagina:
      'Faça o teste gratuito de 2 minutos e receba um plano para subir de nível em 30 dias.',
  },

  interface: {
    voltar: 'Voltar',
    progresso: 'Progresso do teste',
    perguntaDe: 'Pergunta {atual} de {total}',
    naoSei: 'Não sei',
    voceEsta: 'Você',
    proximo: 'Próximo',
    descricaoRegua: 'Régua de níveis A1, A2, B1, B2 e C1. Seu nível atual é {nivel} e o próximo é {proximo_nivel}.',
    gratis: 'grátis',
    de: 'de',
    naoIncluso: 'não incluso',
    checkoutIndisponivel: 'O link de compra ainda não foi configurado. Tente novamente mais tarde.',
    voltarAoTeste: 'Ir para o teste',
  },

  // ── Tela 1: capa ───────────────────────────────────────────────────────────
  capa: {
    titulo: 'Qual é o seu nível real de inglês?',
    subtitulo: 'Faça o teste gratuito de 2 minutos e receba um plano para subir de nível em 30 dias.',
    selos: ['Gratuito', 'Resultado na hora'],
    // Ligue só quando o número for real. {numero} é formatado sozinho (11000 vira 11.000).
    seloTestes: { ativo: false, numero: 0, texto: '+{numero} testes feitos' },
    botao: 'Começar o teste',
  },

  // ── Telas 2 a 5: perfil ────────────────────────────────────────────────────
  // "texto" aparece no botão; "valor" entra nos textos do resultado.
  perfil: [
    {
      id: 'objetivo',
      titulo: 'Para que você quer o inglês?',
      opcoes: [
        { texto: 'Trabalho e carreira', valor: 'no trabalho' },
        { texto: 'Viajar sem passar aperto', valor: 'nas viagens' },
        { texto: 'Entender séries, filmes e músicas', valor: 'nas séries e filmes' },
        { texto: 'Estudos, concurso ou intercâmbio', valor: 'nos estudos' },
        { texto: 'Conversar com estrangeiros', valor: 'nas conversas' },
      ],
    },
    {
      id: 'historico',
      titulo: 'Há quanto tempo você tenta aprender?',
      opcoes: [
        { texto: 'Nunca estudei de verdade', valor: 'nunca' },
        { texto: 'Menos de 1 ano', valor: 'menos de 1 ano' },
        { texto: 'De 1 a 3 anos', valor: 'de 1 a 3 anos' },
        { texto: 'Mais de 3 anos (já comecei várias vezes)', valor: 'mais de 3 anos' },
      ],
    },
    {
      id: 'trava',
      titulo: 'O que mais te trava hoje?',
      opcoes: [
        { texto: 'Entendo, mas travo na hora de falar', valor: 'travar na hora de falar' },
        { texto: 'Não entendo quando falam rápido', valor: 'não entender quando falam rápido' },
        { texto: 'Me falta vocabulário', valor: 'a falta de vocabulário' },
        { texto: 'Me confundo com a gramática', valor: 'a confusão com a gramática' },
        { texto: 'Falta constância: começo e paro', valor: 'a falta de constância' },
      ],
    },
    {
      id: 'tempo',
      titulo: 'Quanto tempo por dia você consegue dedicar?',
      opcoes: [
        { texto: '5 minutos', valor: '5 minutos' },
        { texto: '10 a 15 minutos', valor: '15 minutos' },
        { texto: '30 minutos', valor: '30 minutos' },
        { texto: '1 hora ou mais', valor: '1 hora' },
      ],
    },
  ],

  // ── Tela 6: transição ──────────────────────────────────────────────────────
  transicao: {
    titulo: 'Agora, o teste rápido',
    texto:
      "São 8 perguntas, do básico ao avançado. Se não souber, toque em 'Não sei'. Isso deixa seu resultado mais preciso.",
    botao: 'Vamos lá',
  },

  // ── Telas 7 a 14: teste de nível ───────────────────────────────────────────
  // Mantenha da mais fácil para a mais difícil. As opções são embaralhadas sozinhas
  // e "Não sei" entra sempre por último.
  perguntas: [
    {
      nivel: 'A1',
      tema: 'Verbo to be',
      enunciado: 'Complete: She ___ a teacher.',
      correta: 'is',
      erradas: ['are', 'am', 'be'],
      idiomaOpcoes: 'en',
    },
    {
      nivel: 'A1',
      tema: 'Vocabulário do dia a dia',
      enunciado: "O que significa 'I'm hungry'?",
      correta: 'Estou com fome',
      erradas: ['Estou cansado', 'Estou atrasado', 'Estou com frio'],
      idiomaOpcoes: 'pt-BR',
    },
    {
      nivel: 'A2',
      tema: 'Passado simples',
      enunciado: 'Complete: Yesterday I ___ to the supermarket.',
      correta: 'went',
      erradas: ['go', 'gone', 'going'],
      idiomaOpcoes: 'en',
    },
    {
      nivel: 'A2',
      tema: 'There is / there are e quantidades',
      enunciado: 'Qual frase está correta?',
      correta: 'There are many people here.',
      erradas: ['There is many people here.', 'There are much people here.', 'There is much peoples here.'],
      idiomaOpcoes: 'en',
    },
    {
      nivel: 'B1',
      tema: "Frases com 'if' (condicionais)",
      enunciado: 'Complete: If it ___ tomorrow, we will stay home.',
      correta: 'rains',
      erradas: ['will rain', 'rained', 'raining'],
      idiomaOpcoes: 'en',
    },
    {
      nivel: 'B1',
      tema: 'Phrasal verbs',
      enunciado: "O que significa 'I ran out of coffee'?",
      correta: 'Meu café acabou',
      erradas: ['Derramei o café', 'Corri para tomar café', 'Saí da cafeteria'],
      idiomaOpcoes: 'pt-BR',
    },
    {
      nivel: 'B2',
      tema: 'Desejos e hipóteses (I wish)',
      enunciado: 'Complete: I wish I ___ more time to study.',
      correta: 'had',
      erradas: ['have', 'would have', 'having'],
      idiomaOpcoes: 'en',
    },
    {
      nivel: 'B2',
      tema: 'Past perfect (sequência de ações)',
      enunciado: 'Complete: By the time we arrived, the movie ___.',
      correta: 'had already started',
      erradas: ['has already started', 'already starts', 'was already start'],
      idiomaOpcoes: 'en',
    },
  ],

  // Aviso rápido no meio do teste (igual para todo mundo).
  incentivo: {
    depoisDaPergunta: 4,
    duracaoMs: 2000,
    texto: 'Você está indo bem! Faltam 4 perguntas.',
  },

  // ── Tela 15: nome ──────────────────────────────────────────────────────────
  nome: {
    titulo: 'Como posso te chamar?',
    texto: 'Vamos colocar seu nome no seu plano.',
    rotulo: 'Seu primeiro nome',
    exemplo: 'Ex.: Ana',
    botao: 'Ver meu resultado',
    erroCurto: 'Digite seu primeiro nome, com pelo menos 2 letras.',
    erroLongo: 'Use no máximo 30 letras.',
    erroInvalido: 'Use apenas letras no seu nome.',
  },

  // ── Tela 16: cálculo ───────────────────────────────────────────────────────
  calculo: {
    titulo: 'Preparando seu resultado',
    duracaoMs: 4500,
    itens: [
      'Corrigindo suas respostas',
      'Identificando seu nível (Quadro Europeu)',
      'Mapeando seus pontos fortes e lacunas',
      'Montando seu plano de 30 dias',
    ],
  },

  // ── Níveis: faixas de pontuação e diagnóstico ──────────────────────────────
  // minAcertos = a partir de quantos acertos (de 8) a pessoa entra no nível.
  niveis: {
    A1: {
      nome: 'Iniciante',
      minAcertos: 0,
      proximo: 'A2',
      diagnostico: [
        '{nome}, você está no começo, e isso é ótimo: dá para construir a base do jeito certo, sem vícios. Hoje o que mais pesa é {trava}, e isso acontece porque falta uma base organizada, com as palavras e estruturas que mais aparecem nas conversas do dia a dia.',
        'A boa notícia: com {tempo} por dia e um plano na ordem certa, você sai do zero e começa a montar frases sozinho para usar {objetivo}.',
      ],
    },
    A2: {
      nome: 'Básico',
      minAcertos: 3,
      proximo: 'B1',
      diagnostico: [
        '{nome}, você já tem uma base, mas está no nível em que a maioria desiste: entende algumas coisas, mas na hora H trava. O que mais te segura é {trava}. Não é falta de capacidade: são lacunas específicas que ninguém te mostrou em ordem.',
        "Com {tempo} por dia focado só nessas lacunas, você sai do 'entendo um pouco' para conseguir se virar {objetivo}.",
      ],
    },
    B1: {
      nome: 'Intermediário',
      minAcertos: 5,
      proximo: 'B2',
      diagnostico: [
        "{nome}, você está acima da média dos brasileiros. Consegue se comunicar, mas sente que o inglês 'não sai natural', e a sua maior trava é {trava}. Esse é o famoso platô do intermediário: estudar mais do mesmo não resolve.",
        'O que destrava é revisar as estruturas que separam o B1 do B2 (condicionais, phrasal verbs e expressões) com {tempo} por dia, aplicando {objetivo}.',
      ],
    },
    B2: {
      nome: 'Intermediário avançado',
      minAcertos: 7,
      proximo: 'C1',
      diagnostico: [
        '{nome}, seu inglês é forte: você acertou {acertos} de 8, incluindo perguntas avançadas. O que falta agora não é gramática, é refinamento: soar natural, ter vocabulário preciso e perder o medo em situações de pressão {objetivo}.',
        'Com {tempo} por dia, você trabalha exatamente o que separa o B2 do C1.',
      ],
    },
  },

  // ── Tela 17: resultado ─────────────────────────────────────────────────────
  resultado: {
    titulo: '{nome}, seu nível de inglês é:',
    tituloNivel: '{nivel} — {nome_nivel}',
    acertos: 'Você acertou {acertos} de 8 perguntas.',
    rotuloFortes: '✅ Pontos fortes:',
    rotuloLacunas: '⚠️ O que está te segurando:',
    /** Aparece quando a pessoa não acertou nenhuma pergunta. */
    semPontosFortes: 'Você já sabe por onde começar',
    /** Aparece quando a pessoa acertou tudo. */
    semLacunas: 'Fluidez na fala e expressões naturais',
    maxFortes: 2,
    maxLacunas: 3,
    separadorTemas: ' · ',
    plano: 'Seu plano: Rota {nivel} → {proximo_nivel}. Conclusão prevista em {data_fim}.',
    diasDoPlano: 30,
    tituloPlano: 'Como vai ser o seu plano de 30 dias',
    semanas: [
      { rotulo: 'Semana 1', texto: 'Base: revisão visual das estruturas do seu nível' },
      { rotulo: 'Semana 2', texto: 'Lacunas: {lacunas}' },
      { rotulo: 'Semana 3', texto: 'Vocabulário para usar {objetivo}' },
      { rotulo: 'Semana 4', texto: 'Frases prontas e revisão final' },
    ],
    rodapePlano: '⏱ {tempo} por dia · 📱 No celular ou impresso',
  },

  // ── Tela 17: oferta ────────────────────────────────────────────────────────
  oferta: {
    cronometro: {
      segundos: 14 * 60 + 59,
      texto: '⏳ Seu plano personalizado fica reservado por',
      textoFim: 'Seu plano continua disponível',
    },
    titulo: '{nome}, sua Rota {nivel} → {proximo_nivel} está pronta',
    subtitulo:
      'O material completo para destravar seu inglês em 30 dias, com {tempo} por dia, no celular ou impresso.',
    tituloEntregas: 'O que você recebe',
    entregas: [
      {
        icone: '📘',
        texto: 'Rota {nivel} → {proximo_nivel}',
        detalhe:
          'Mais de 80 mapas mentais ilustrados com as estruturas, o vocabulário e as frases do seu nível, em ordem de estudo',
      },
      { icone: '🗓️', texto: 'Cronograma de 30 dias', detalhe: 'Em blocos de 15 minutos' },
      { icone: '🎯', texto: 'Guia das suas lacunas', detalhe: '{lacunas}' },
      { icone: '💬', texto: '150 frases prontas', detalhe: 'Para usar {objetivo}' },
    ],
    tituloBonus: 'Bônus de hoje',
    bonus: [
      { nome: '100 Phrasal Verbs Essenciais', precoDe: 27 },
      {
        nome: 'Checklist de Pronúncia',
        detalhe: 'Com os 30 sons que mais confundem brasileiros',
        precoDe: 19,
      },
      { nome: 'Planner de Constância', detalhe: 'Para imprimir', precoDe: 17 },
    ],
    // Variante A: preço único.
    preco: {
      valor: 29.9,
      ancora: 197,
      textoAncora: 'Tudo isso valeria',
      textoHoje: 'Hoje:',
      complemento: 'à vista',
      // Ligue quando souber o valor exato calculado pela plataforma de pagamento.
      parcelado: { ativo: false, texto: 'ou 5x de R$ 8,29' },
      condicoes: 'Pagamento único · Acesso vitalício · Entrega imediata por e-mail',
      botao: 'QUERO MINHA ROTA {nivel} → {proximo_nivel}',
    },
    nomeConteudoPixel: 'Rota {nivel}',
    moeda: 'BRL',
    // Variante B: dois planos. Os preços daqui também vão para o InitiateCheckout.
    varianteB: {
      titulo: 'Escolha o seu plano',
      planos: [
        {
          id: 'essencial',
          nome: 'Plano Essencial',
          preco: 9.9,
          destaque: false,
          itens: [
            { texto: 'Mapas mentais do nível {nivel}', incluso: true },
            { texto: 'Acesso por 90 dias', incluso: true },
            { texto: 'Cronograma de 30 dias', incluso: false },
            { texto: 'Guia das lacunas e frases prontas', incluso: false },
            { texto: '3 bônus', incluso: false },
          ],
          botao: 'QUERO O ESSENCIAL',
        },
        {
          id: 'completo',
          nome: 'Plano Completo',
          preco: 29.9,
          selo: '⭐ Mais escolhido',
          destaque: true,
          itens: [
            { texto: 'Mapas mentais do nível {nivel}', incluso: true },
            { texto: 'Acesso vitalício', incluso: true },
            { texto: 'Cronograma de 30 dias', incluso: true },
            { texto: 'Guia das lacunas e frases prontas', incluso: true },
            { texto: '3 bônus', incluso: true },
          ],
          botao: 'QUERO MINHA ROTA {nivel} → {proximo_nivel}',
        },
      ],
      condicoes: 'Pagamento único · Entrega imediata por e-mail',
    },
    tituloPassos: 'Como funciona',
    passos: [
      'Garanta o seu acesso.',
      'Receba tudo no e-mail em até 5 minutos.',
      'Siga o cronograma: 15 minutos por dia, no celular ou impresso.',
    ],
    // Carrossel com páginas reais dos PDFs (arquivos em public/preview).
    // Cada imagem tem duas versões: "nome.webp" (1200 px, para ampliar) e "nome-p.webp" (600 px).
    // {lacuna_arquivo} abre a página do Guia das Lacunas da primeira lacuna da pessoa.
    previa: {
      titulo: 'Veja por dentro do material',
      subtitulo: 'Páginas reais do seu kit. Toque em uma página para ampliar.',
      trocaMs: 3500,
      alt: '{rotulo}: {legenda}',
      paginas: [
        {
          imagem: 'preview/{nivel}/capa',
          rotulo: 'Sua rota',
          legenda: 'Rota {nivel} → {proximo_nivel}: 94 páginas na ordem certa de estudo',
        },
        {
          imagem: 'preview/{nivel}/cronograma',
          rotulo: 'Cronograma',
          legenda: '30 dias de 15 minutos, com uma caixa para marcar cada dia',
        },
        {
          imagem: 'preview/{nivel}/gramatica',
          rotulo: 'Mapa mental · Gramática',
          legenda: {
            A1: 'Verbo to be: afirmativa',
            A2: 'Verbos regulares: como formar',
            B1: 'Particípios irregulares',
            B2: 'Past perfect: quando usar',
          },
        },
        {
          imagem: 'preview/{nivel}/vocabulario',
          rotulo: 'Mapa mental · Vocabulário',
          legenda: {
            A1: 'Rotina da manhã',
            A2: 'No aeroporto',
            B1: 'E-mail: pedidos e anexos',
            B2: 'Entrevista: perfil',
          },
        },
        {
          imagem: 'preview/{nivel}/frases',
          rotulo: 'Frases prontas',
          legenda: {
            A1: 'Cumprimentar e despedir',
            A2: 'Conhecer pessoas',
            B1: 'Opinar em reuniões',
            B2: 'Abrir uma apresentação',
          },
        },
        {
          imagem: 'preview/{nivel}/mini-teste',
          rotulo: 'Dia 30',
          legenda: 'Mini-teste "Você chegou ao {proximo_nivel}?", com gabarito',
        },
        {
          imagem: 'preview/lacunas/{lacuna_arquivo}',
          rotulo: 'Guia das suas lacunas',
          legenda: '{primeira_lacuna}: explicação, erros comuns e teste rápido',
          legendaSemLacuna: 'Você acertou tudo: o próximo passo é a fluidez na fala',
        },
        { imagem: 'preview/bonus/phrasal-verbs', rotulo: 'Bônus 1', legenda: '100 Phrasal Verbs Essenciais, por situação' },
        { imagem: 'preview/bonus/pronuncia', rotulo: 'Bônus 2', legenda: 'Checklist de Pronúncia: os 30 sons' },
        { imagem: 'preview/bonus/planner', rotulo: 'Bônus 3', legenda: 'Planner de Constância: rastreador de 30 dias' },
      ],
    },
    // Só ligue quando tiver depoimentos reais de compradores. Formato de cada item:
    // { nome: 'Nome', detalhe: 'Rota A2 → B1', texto: 'Depoimento' }
    depoimentos: { ativo: false, titulo: 'Quem já está na rota', itens: [] },
    garantia: {
      icone: '🛡',
      titulo: 'Garantia incondicional de 7 dias.',
      texto: 'Se não gostar do material, devolvemos 100% do valor, sem perguntas.',
    },
    tituloFaq: 'Perguntas frequentes',
    faq: [
      {
        pergunta: 'É um curso com aulas em vídeo?',
        resposta:
          'Não. É um material visual em PDF para revisar e praticar no seu ritmo, com um cronograma diário.',
        respostaVarianteB:
          'Não. É um material visual em PDF para revisar e praticar no seu ritmo. O cronograma diário vem no Plano Completo.',
      },
      {
        pergunta: 'Serve para o meu nível?',
        resposta: 'Sim. Sua rota foi escolhida pelo seu resultado no teste ({nivel}).',
      },
      {
        pergunta: 'Quanto tempo leva?',
        resposta: 'O cronograma tem 30 dias de 15 minutos, mas o acesso é vitalício.',
        respostaVarianteB:
          'O cronograma tem 30 dias de 15 minutos. No Plano Completo o acesso é vitalício; no Essencial, de 90 dias.',
      },
      {
        pergunta: 'Vou ficar fluente em 30 dias?',
        resposta:
          'Não prometemos fluência. Prometemos um plano organizado para você cobrir tudo o que falta no seu nível e ganhar segurança.',
      },
      {
        pergunta: 'Como recebo?',
        resposta: 'Por e-mail e na área de membros, logo após a confirmação do pagamento.',
      },
    ],
  },

  rodape: {
    aviso:
      'Este teste é uma estimativa rápida baseada no Quadro Europeu (CEFR), não uma certificação oficial.',
    privacidade: 'Política de Privacidade',
    termos: 'Termos',
    cookies: 'Cookies',
    copyright: '© {ano} Rota do Inglês',
  },

  cookies: {
    texto: 'Usamos cookies para medir o desempenho dos nossos anúncios.',
    aceitar: 'Aceitar',
    recusar: 'Recusar',
    saibaMais: 'Saiba mais',
  },

  // ── Páginas /privacidade e /termos ─────────────────────────────────────────
  // PLACEHOLDER: troque pelos textos definitivos e apague o "avisoProvisorio" (deixe '').
  legal: {
    privacidade: {
      titulo: 'Política de Privacidade',
      avisoProvisorio: 'Texto provisório. Substitua pela versão definitiva antes de publicar.',
      secoes: [
        {
          titulo: 'Quem somos',
          paragrafos: ['[PREENCHER: nome ou razão social, CPF/CNPJ e e-mail de contato do responsável pelo site.]'],
        },
        {
          titulo: 'Quais dados usamos',
          paragrafos: [
            'O teste pede apenas o seu primeiro nome. Ele e as suas respostas ficam na memória da página e somem quando você a fecha ou recarrega.',
            'Se você for para o pagamento, o seu primeiro nome pode ser enviado à página de checkout para preencher o campo de nome. Os dados da compra são tratados pela plataforma de pagamento, com a política dela.',
          ],
        },
        {
          titulo: 'Cookies e medição',
          paragrafos: [
            'Usamos o Pixel da Meta para medir o desempenho dos anúncios, com eventos como início do teste, nível obtido e clique no botão de compra. O seu nome e as suas respostas não são enviados ao Pixel.',
            'Você pode bloquear ou apagar cookies a qualquer momento nas configurações do seu navegador.',
          ],
        },
        {
          titulo: 'Seus direitos',
          paragrafos: ['[PREENCHER: como a pessoa exerce os direitos previstos na LGPD e em qual canal.]'],
        },
      ],
    },
    termos: {
      titulo: 'Termos de Uso',
      avisoProvisorio: 'Texto provisório. Substitua pela versão definitiva antes de publicar.',
      secoes: [
        {
          titulo: 'Sobre o teste',
          paragrafos: [
            'O teste é uma estimativa rápida baseada no Quadro Europeu (CEFR), não uma certificação oficial.',
          ],
        },
        {
          titulo: 'Sobre o material',
          paragrafos: [
            'O material é digital, em PDF, para uso pessoal. Não prometemos fluência nem mudança de nível em prazo determinado.',
            '[PREENCHER: regras de uso, de compartilhamento e de acesso.]',
          ],
        },
        {
          titulo: 'Pagamento e garantia',
          paragrafos: [
            'Você tem 7 dias de garantia incondicional, com devolução de 100% do valor.',
            '[PREENCHER: como pedir o reembolso e prazo de devolução.]',
          ],
        },
        {
          titulo: 'Contato',
          paragrafos: ['[PREENCHER: e-mail ou WhatsApp de suporte.]'],
        },
      ],
    },
  },
}
