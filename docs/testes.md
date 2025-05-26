| Cenário/Condição                                           | Entradas                                                       | Resultado Esperado                                                         |
| ---------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Cliente preenche todos os campos obrigatórios corretamente | Nome (V), NIF com 9 dígitos (V), Morada (V), Email com '@' (V) | Formulário submetido com sucesso                                           |
| Cliente preenche email em formato inválido                 | Email sem '@' ou domínio (I)                                   | Mensagem de erro de formato inválido                                       |
| Pedido com quantidade inferior a 1                         | Quantidade = 0 (I)                                             | Mensagem de erro: quantidade inválida                                      |
| Promoção com data de início posterior à data de fim        | Data de início: 2025-12-01 (V), Data de fim: 2025-11-01 (I)    | Mensagem de erro: data de fim inválida                                     |
| Transportadora não opera no distrito do cliente            | Distrito (V), Transportadora (I)                               | Mensagem de erro: transportadora incompatível                              |
| Cancelamento de encomenda já entregue                      | Nº de encomenda com estado = "entregue" (I)                    | Mensagem de erro: encomenda não pode ser cancelada                         |
| NIF válido com 9 dígitos                                   | NIF = "123456789" (V)                                          | Formulário aceite, NIF validado com sucesso                                |
| NIF inválido (menos de 9, mais de 9 dígitos ou letras)     | NIF = "12345678" (I), "1234567890" (I), "12345A789" (I)        | Mensagem de erro: NIF inválido. Deve conter exatamente 9 dígitos numéricos |


| Cenário/Condição                                                    | Entradas                                                          | Resultado Esperado                                                  |
| ------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| Cálculo correto do preço final da encomenda com desconto e impostos | Preço unitário: 8.00€, Quantidade: 3, Transporte: 5.00€, IVA: 23% | Preço Final = (8×3) + 5 + (8×3×0.23) = 24.00 + 5.00 + 5.52 = 34.52€ |
| Cálculo do preço promocional com desconto percentual                | Preço Original: 10.00€, Desconto: 20%                             | Preço Promocional = 10.00 - (10.00 × 0.20) = 8.00€                  |
| Cálculo do preço promocional com desconto fixo                      | Preço Original: 12.00€, Desconto Fixo: 2.00€                      | Preço Promocional = 12.00 - 2.00 = 10.00€                           |
| Cálculo do total da encomenda ao fornecedor com IVA                 | Produto A: 5.00€ × 10, Produto B: 3.00€ × 5, IVA = 13%            | Total Sem IVA = 65.00€, IVA = 8.45€, Total = 73.45€                 |
| Cálculo do total da fatura com IVA incluído e desconto pré-aplicado | Preço com desconto: 9.00€, Quantidade: 2, IVA = 23%               | PreçoQ = 18.00€, IVA = 4.14€, Total Fatura = 22.14€                 |
