# Regras de negócio — EHS Admin

> Painel administrativo da plataforma. Regras de autenticação e de plataforma:
> `D:/Projetos/ehs_microservices/regras-negocio.md`.

## Acesso

- Só entra no painel quem tem role `ADMIN`; o login usa `app: ADMIN`.
- O middleware do front checa apenas autenticação — a autorização é aplicada no backend
  (`@OnlyAdmin`). Nunca confiar no front para barrar ações.
- 401 limpa a sessão e volta ao login; 403 mostra "sem permissão" e mantém a sessão.

## Usuários

- O admin pode: listar/buscar/filtrar/ordenar/paginar, exportar CSV, abrir o detalhe,
  editar `username`, `email` e roles, liberar uso, bloquear e reenviar confirmação.
- Editar roles é substituição completa (`PUT /users/{id}`); para adicionar sem remover
  existe `POST /users/{id}/roles`. Role `ADMIN` não pode ser concedida nem removida.
  Toda mudança de role invalida as sessões do usuário.
- "Liberar uso" só faz sentido para `WAITING_CONFIRMATION`/`BLOCKED` → `OK`.
- "Bloquear" (`OK` → `BLOCKED`) derruba as sessões. Não existe desbloqueio instantâneo
  diferente de "Liberar uso".
- Reenvio de confirmação: somente para `WAITING_CONFIRMATION` e com cooldown de 60 s no
  backend (o botão pode ser clicado antes; o erro vem da API).
- A conta não é apagada de fato: exclusão é soft delete e não há exclusão de usuário
  pela UI hoje.
- O admin **não** altera senha de ninguém pela UI; o usuário usa o reset por e-mail.

## Empresas

- Listar/buscar/ordenar/paginar, exportar CSV, renomear e excluir.
- Excluir empresa exclui em cascata (soft delete) todos os usuários vinculados —
  ação destrutiva, sempre com confirmação.

## Sessões

- "Encerrar todas as sessões" (`POST /auth/logout-all`) vale para o próprio usuário
  logado e incrementa o `tokenVersion`.

## E-mails

- A tela de fila mostra mensagens pendentes, consumidores, enviados, erros e o último
  erro, com atualização automática a cada 10 s.
- O endpoint é ADMIN-only e também bloqueado por role na rota do gateway.

## Dashboard

- Mostra totais de usuários/empresas, aguardando confirmação, sem empresa, status,
  recentes e série temporal (7/30/90 dias; diário/semanal/mensal) para os cadastros.

## O que o painel não faz

- Não gerencia dados de negócio dos produtos (orçamentos, finanças, treinos): cada app
  tem o próprio escopo e isolamento por usuário.
