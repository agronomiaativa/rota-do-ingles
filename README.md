# Rota do Inglês — funil de quiz

Teste de nível de inglês para celular, com 17 telas, que termina em resultado e oferta. É um site estático (Vite + React + TypeScript + Tailwind), sem servidor e sem banco de dados.

## Rodar no computador

Você precisa do Node 20.19 ou mais novo (ou 22.12+).

```bash
npm i
```

```bash
npm run dev
```

Abra o endereço que aparecer no terminal. Para ver a variante de dois planos, acrescente `?v=b`.

Testes:

```bash
npm test
```

Build (gera a pasta `dist/`):

```bash
npm run build
```

## Editar textos, perguntas e preços

Tudo fica em [`src/config/quiz.config.ts`](src/config/quiz.config.ts). Salve e a página atualiza sozinha.

| O que mudar | Onde |
| --- | --- |
| Chaves liga/desliga (A/B, nome no checkout, cookies) | `AB_RANDOM`, `CHECKOUT_PASS_NAME`, `CONSENT_BANNER` |
| Capa e selos | `capa` |
| Perguntas de perfil | `perfil` (`texto` aparece no botão, `valor` entra nos textos do resultado) |
| Perguntas do teste | `perguntas` (`correta` e `erradas`; a ordem é embaralhada sozinha) |
| Pontuação e diagnóstico de cada nível | `niveis` |
| Textos do resultado | `resultado` |
| Preços, bônus, garantia, FAQ, cronômetro | `oferta` |
| Privacidade e termos | `legal` |

Variáveis que funcionam nos textos: `{nome}` `{objetivo}` `{trava}` `{tempo}` `{nivel}` `{nome_nivel}` `{proximo_nivel}` `{acertos}` `{data_fim}` `{fortes}` `{lacunas}`.

Cuidados:

- **Preço**: mude `oferta.preco.valor` e também o preço do Plano Completo em `oferta.varianteB.planos`. Esses números vão para o Pixel, então precisam bater com o checkout.
- **Número de perguntas**: alguns textos citam "8 perguntas" e "Faltam 4 perguntas" por extenso. Se mudar a quantidade, ajuste esses textos, `minAcertos` em `niveis` e os testes.
- **Selo de testes feitos** (`capa.seloTestes`) e **depoimentos** (`oferta.depoimentos`): desligados. Ligue só com números e pessoas reais.
- **Cor de destaque**: em `tailwind.config.js`, grupo `marca`.

Depois de editar, rode `npm test`: ele confere a pontuação, se cada pergunta tem 4 opções diferentes e se alguma `{variavel}` foi digitada errado.

### Imagens de prévia ("Veja por dentro do material")

É um carrossel com páginas reais dos PDFs de `Entregaveis/PDFs`. As páginas passam sozinhas quando a galeria está na tela, dá para arrastar com o dedo, e tocar amplia em alta resolução. A lista de páginas, os rótulos e as legendas ficam em `oferta.previa.paginas` no `quiz.config.ts`.

Arquivos em `public/preview` (cada página tem `nome.webp`, com 1200 px, e `nome-p.webp`, com 600 px):

| Pasta | Conteúdo |
| --- | --- |
| `A1`, `A2`, `B1`, `B2` | `capa`, `cronograma`, `gramatica`, `vocabulario`, `frases`, `mini-teste` da Rota de cada nível (páginas 1, 4, 8, 51, 74 e 92) |
| `lacunas` | `1` a `8`: página do Guia das Lacunas de cada tema do teste; `nenhuma`: página para quem acertou tudo |
| `bonus` | `phrasal-verbs`, `pronuncia`, `planner` |

A página do Guia das Lacunas muda conforme a primeira lacuna da pessoa no teste. Se você atualizar os PDFs, gere as imagens de novo com o mesmo nome e tamanho (proporção A4 em pé).

A pasta `Entregaveis` está no `.gitignore` e no `.vercelignore`, para os PDFs pagos não serem publicados.

## Configurar o .env

```bash
cp .env.example .env
```

| Variável | Para quê |
| --- | --- |
| `VITE_META_PIXEL_ID` | ID do Pixel da Meta. Vazio = o Pixel não carrega |
| `VITE_CHECKOUT_A1` … `_B2` | Checkout do produto principal / Plano Completo, um por nível |
| `VITE_CHECKOUT_ESSENCIAL_A1` … `_B2` | Checkout do Plano Essencial (só na variante B) |

O nível do link é o do **resultado**: `VITE_CHECKOUT_A2` vende a Rota A2 → B1.

Esses valores entram no site na hora do build: mudou o `.env`, rode o build de novo. O `npm run build` lista as variáveis que faltam. Enquanto um link não é configurado, o botão mostra um aviso em vez de abrir uma página quebrada.

O checkout recebe todos os `utm_*`, `fbclid`, `src` e `sck` da URL de entrada e, com `CHECKOUT_PASS_NAME: true`, também `name`.

## Teste A/B

- `?v=a` e `?v=b` forçam a variante.
- `AB_RANDOM: true` sorteia 50/50 e guarda a escolha no navegador da pessoa.
- O evento `InitiateCheckout` leva `variant`, para comparar os resultados.

## Rastreamento

| Evento | Quando |
| --- | --- |
| `PageView` | Capa |
| `QuizStart` | Clique em "Começar o teste" |
| `QuizProfileDone` | Fim da tela 5 |
| `QuizTestDone` | Fim da pergunta 8 (`level`, `score`) |
| `QuizResultView` | Resultado exibido (`level`) |
| `ViewContent` | A oferta aparece na tela (`content_name`, `value`, `currency`) |
| `InitiateCheckout` | Clique na compra (`value`, `currency`, `level`, `variant`) |

- O Pixel só carrega depois do "Aceitar". O que aconteceu antes fica na fila e é enviado nesse momento; se a pessoa recusar, a fila é apagada.
- Os mesmos eventos vão para `window.dataLayer` sempre, porque ele só existe dentro da página. Se instalar o GTM, dispare as tags **apenas** depois do evento `CookieConsent` com `consent = "aceito"`.
- O nome não vai para o Pixel: a coleta automática está desligada no código. No Gerenciador de Eventos, deixe também a **Correspondência avançada automática** desligada, porque ela pode ler campos de formulário.
- Se o checkout usar o mesmo Pixel, ele também pode disparar `InitiateCheckout`. Desative um dos dois para não contar em dobro.

## Página de upsell (`/upsell`)

Aparece logo depois da compra aprovada, para qualquer nível, e oferece a Coleção Completa A1 → C1 por R$ 49,90 (oferta `kmFuM0B` da Kiwify).

- **Arquivo:** `upsell/index.html`. Os textos ficam nele mesmo, não no `quiz.config.ts`, porque o código da Kiwify precisa estar no HTML desde o carregamento.
- **Código da Kiwify:** é o bloco `kiwify-upsell-kmFuM0B`. Mantenha os ids. Os textos dos dois botões podem mudar.
- **Ligar na Kiwify:** no produto principal, configure o upsell para abrir `https://SEU-DOMINIO/upsell`.
- **Depois do sim ou do não:** `data-upsell-url` e `data-downsell-url` estão vazios, então quem decide o próximo passo é a Kiwify. Confira numa compra de teste. Quando o downsell existir, coloque o endereço dele em `data-downsell-url`.
- **Mudou o preço na Kiwify?** Mude também na página. A frase "por menos do que o preço de duas" só vale enquanto o preço for menor que 2 × R$ 29,90.

## Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub (o `.env` fica de fora).
2. Na Vercel: **Add New > Project** e importe o repositório. Ela reconhece o Vite sozinha (build `npm run build`, saída `dist`).
3. Em **Settings > Environment Variables**, cadastre as variáveis do `.env`.
4. Clique em **Deploy**. Se mudar uma variável depois, faça **Redeploy**.

Hospedagem comum: rode `npm run build` e envie o **conteúdo** de `dist/` para a raiz do domínio (`public_html`). As páginas `/privacidade`, `/termos` e `/upsell` são arquivos próprios e não precisam de regra de redirecionamento. Para publicar em subpasta, defina `base: '/subpasta/'` no `vite.config.ts`.

## Antes de rodar tráfego

Compre o próprio produto em cada nível para conferir checkout, upsell, entrega e e-mails.
