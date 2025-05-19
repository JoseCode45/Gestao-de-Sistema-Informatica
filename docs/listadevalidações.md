# LISTA DE VALIDAÇÕES

# Todos os campos marcados como obrigatórios devem ser preenchidos:
-	Nome do cliente
-	NIF
-	Morada de entrega.
-	Número de encomenda
-	Data de entrega prevista.

# Campos como datas, NIF, códigos postais, emails, etc., devem ter o formato correto.
-	Email do cliente deve conter “@” e domínio válido.
-	NIF deve conter 9 dígitos numéricos.

# Números e datas têm que estar dentro de um intervalo permitido.
-	Quantidade de produto ≥ 1.
-	Datas de início de promoção não podem ser superiores à data de fim.

# Alguns valores devem já existir no sistema.
-	O número de cliente deve existir na base de dados.
-	O código de produto deve estar cadastrado e ativo.

# Ao criar uma encomenda, verificar se há stock suficiente para todos os produtos selecionados.
-	Se não houver, o sistema impede o envio do pedido ou sugere remover o item.

# Operações como edição ou cancelamento só podem ser feitas se o registo estiver num determinado estado.
-	Só é possível cancelar uma encomenda se ainda estiver “pendente”.

# Promoções só são aplicadas se:
-	Estão ativas (dentro da data de validade).
-	Têm stock disponível para os produtos.
-	Não conflitam com outras promoções.


# Certos os campos tem que ser únicos:
-	Número de encomenda.
-	Código do produto.

# Determinados campos devem ser compatíveis entre si:
-	A transportadora selecionada deve operar no distrito do cliente.
-	A morada de entrega não pode ser nula se o cliente selecionar entrega ao domicílio.
