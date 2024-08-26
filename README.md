# frontend-utils

Pacote simples com alguns utilitários para **frontend**, se algum deles ficar grande demais, é possível que ele ganhe um pacote **npm** próprio

## Keybinds / Commands

Nós haviamos criado no `singularity` um modelo da qual se usava `scope` (escopo) para usar as `keys`

No `new-singularity` nós criamos o modelo similar ao `vscode`, aonde todos os comandos são únicos, mas eles são ativados ou desativados de acordo com o contexto, essa aplicação seguirá esse modelo

No `new-singularity` ele sempre validava todos comandos no inicio da aplicação, para ver duplicados, ou `keybinds` inválidas, aqui é necessário usar o método `validateCommands` em um ambiente de testes
