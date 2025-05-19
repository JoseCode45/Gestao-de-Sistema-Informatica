# REGRAS DE CÁLCULO

  - Cálculo do preço final da encomenda do cliente: O sistema deve calcular automaticamente o preço final da encomenda, considerando eventuais promoções ou descontos aplicáveis aos vinhos selecionados. O valor total a pagar antes de finalizar a encomenda inclui o custo por vinho, quantidades, valor total de produto, valor total de transporte e valor total de impostos (IVA).

  - Cálculo do preço promocional dos produtos: Quando o gestor de marketing configura uma promoção, o sistema deve calcular automaticamente o preço promocional dos produtos. As fontes fornecem as fórmulas específicas para dois tipos de promoção:

**Para promoções percentuais: Preço Promocional = Preço Original - (Preço Original × Taxa de Desconto / 100)-**

**Para promoções com valor fixo: Preço Promocional = Preço Original - Valor do Desconto.**

  - Cálculo do total da encomenda a fornecedor: A informação da encomenda a fornecedor inclui o total da encomenda e o total de IVA, o que implica regras de cálculo para chegar a estes valores.

**Total Produto = Σ(preço*quantidade)**
**Total Transporte**
**Total Imposto = Σ(ValorIVA)**

valorIVA = preço*IVA

  - Cálculo do total da fatura de fornecedor ou de venda: As faturas, tanto de fornecedor quanto de venda, incluem o total faturado e o total de IVA, indicando a necessidade de regras de cálculo para estes campos.

**Total Faturado = Σ(preço*quantidade)**
**Total IVA = Σ(Valor IVA)**
