# Teste de Validação de campos
## Inserção de Encomenda ao Fornecedor
- HÁ campos obrigatórios: fornecedor, produtos, quantidades, data de entrega.
- O fornecedor deve existir na base de dados.
- Os produtos devem estar ativos e com códigos válidos.
- O Registo deve ser inserido corretamente na base de dados.
- Apenas o Gestor de Compras pode aceder a esta funcionalidade.
## Atualização de Stock após Receção
- Verificar se as quantidades entregues coincidem com as encomendadas.
- Atualizar corretamente o stock na base de dados.
- Registar o histórico da entrada.
- Apenas o Responsável de Armazém pode aceder a esta funcionalidade.
## Submissão de Encomenda do Cliente
- Verificar os campos obrigatórios: nome, NIF, morada de entrega, produtos.
- Validação do NIF (9 dígitos) e email (@ formato válido).
- Cálculo do valor final com promoções, taxas e transporte.
- Registo único na base de dados com número de encomenda.
- Funcionalidade disponível a todos os clientes autenticados.
## Criação de Campanha Promocional
- As datas válidas tem que ser válidas (início ≤ fim).
- O produto deve estar disponível e não em outra promoção.
- Cálculo correto do preço com desconto percentual ou fixo.
- Promoção registada corretamente na base de dados.
- Apenas o Gestor de Marketing pode aceder a esta funcionalidade.
## Processamento de Entregas
- Os dados obrigatórios: morada, horário, transportadora válida.
- A transportadora deve operar no distrito do cliente.
- Atualização do estado de entrega via API externa.
- O registo de estado de entrega atualizado na base de dados.
- Apenas o Gestor de Logística pode processar entregas.
## Registo de Ocorrência pelo Cliente
- O número de encomenda deve existir.
- A descrição da ocorrência é obrigatória.
- O registo de ocorrência tem que estar associado ao cliente e a encomenda.
- Validação de estado da ocorrência.
- Disponível apenas para clientes autenticados.
