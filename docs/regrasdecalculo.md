# REGRAS DE CÁLCULO

  - Cálculo do preço final da encomenda do cliente: O sistema deve calcular automaticamente o preço final da encomenda, considerando eventuais promoções ou descontos aplicáveis aos vinhos selecionados. O valor total a pagar antes de finalizar a encomenda inclui o custo por vinho, quantidades, valor total de produto, valor total de transporte e valor total de impostos (IVA).

Preço Unitário pode conter descontos

**Preço Final = Σ(Total Produto)+ Transporte + Impostos**
**Total Produto = Preço Unitário × Quantidade**
**Total Transporte = (Valor) **
**Total Imposto =  ΣImpostos**


  - Cálculo do preço promocional dos produtos: Quando o gestor de marketing configura uma promoção, o sistema deve calcular automaticamente o preço promocional dos produtos. As fontes fornecem as fórmulas específicas para dois tipos de promoção:

**Para promoções percentuais: Preço Promocional = Preço Original - (Preço Original × Taxa de Desconto / 100)-**

**Para promoções com valor fixo: Preço Promocional = Preço Original - Valor do Desconto.**

  - Cálculo do total da encomenda a fornecedor: A informação da encomenda a fornecedor inclui o total da encomenda e o total de IVA, o que implica regras de cálculo para chegar a estes valores.

**Total Sem IVA = Σ(Preço Unitário × Quantidade)**
**Total IVA = Total Sem IVA × Taxa de IVA**
**Total da Encomenda = Total Sem IVA + Total IVA**


valorIVA = preço*IVA

  - Cálculo do total da fatura de fornecedor ou de venda: As faturas, tanto de fornecedor quanto de venda, incluem o total faturado e o total de IVA, indicando a necessidade de regras de cálculo para estes campos.

**Total da Fatura = Σ(Preço + PrecoIVA)**
**PreçoQ = Preço * Quantidade**
**PrecoIVA = PreçoQ * IVA**


O calculo total implica o cálculo prévio do desconto, caso ele exista

