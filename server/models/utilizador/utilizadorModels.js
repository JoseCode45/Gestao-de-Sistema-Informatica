import pool  from '../../database.js';
import bcrypt from 'bcrypt';

export const Utilizador = {

  // Obtém todos os clientes 
 async getAllCliente() {
  const [rows] = await pool.query(`
    SELECT Utilizador.ID, Utilizador.Nome, Utilizador.Email, Cliente.NIF, Utilizador.morada, Genero.Nome AS Genero, Cliente.NIF, Utilizador.Datacriacao, Utilizador.Dataalteracao, Utilizador.criadorID, Utilizador.alteradorID
    FROM Cliente
     JOIN Utilizador ON Cliente.UtilizadorID = Utilizador.ID
    LEFT JOIN Genero ON Utilizador.GeneroID = Genero.ID
  `);
  return rows;
},

// Obtém todos os empregados 
 async getAllEmpregado() {
  const [rows] = await pool.query(`
    SELECT Utilizador.ID, Utilizador.Nome, Utilizador.Email, Genero.Nome AS Genero, Empregado.DataNascimento, Nacionalidade.Nome AS Nacionalidade, AreaFunc.Nome AS Area_Funcional, CategoriaFunc.Nome AS Categoria_Funcional, Utilizador.Datacriacao, Utilizador.Dataalteracao, Utilizador.criadorID, Utilizador.alteradorID
    FROM Empregado
     JOIN Utilizador ON Empregado.UtilizadorID = Utilizador.ID
    LEFT JOIN CategoriaFunc ON Empregado.CategoriaFuncID = CategoriaFunc.ID
    LEFT JOIN AreaFunc ON CategoriaFunc.AreaFuncID = AreaFunc.ID
    LEFT JOIN Nacionalidade ON Empregado.NacionalidadeID = Nacionalidade.ID
    LEFT JOIN Genero ON Utilizador.GeneroID = Genero.ID

  `);
  return rows;
},

  // Obtém todos os utilizadores 
  async getAll() {
    const [rows] = await pool.query(`SELECT Utilizador.ID, Utilizador.Nome, Utilizador.Email, Utilizador.Morada, Genero.Nome AS Genero, Utilizador.DataCriacao, Utilizador.DataAlteracao, Utilizador.criadorID, Utilizador.alteradorID, Utilizador.Estado FROM Utilizador
      LEFT JOIN Genero ON Utilizador.GeneroID = Genero.ID`);
    return rows;
  },

  // Obtém um utilizador pelo email
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Utilizador WHERE Email = ? AND Estado = "ativo"', [email]);
    return rows[0];
  },

  async findByNome(nome) {
    const [rows] = await pool.query('SELECT * FROM Utilizador WHERE Nome = ? AND Estado = "ativo"', [nome]);
    return rows[0];
  },

  // Obtém um utilizador pelo NIF
  async findByNIF(NIF) {
    const [rows] = await pool.query('SELECT * FROM Cliente WHERE NIF = ? AND Estado = "ativo"', [NIF]);
    return rows[0];
  },



  // Obtém um utilizador pelo ID
 async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Utilizador WHERE ID = ? AND Estado = "ativo"', [id]);
    return rows[0];
  },

  // Cria um novo utilizador, que é também um cliente
  async createCliente(nome, email, passwordHash, morada, generoID, NIF) {
    const [resUser] = await pool.query(
      'INSERT INTO Utilizador (Nome, Email, Password, Morada, GeneroID) VALUES (?, ?, ?, ?, ?)',
      [nome, email, passwordHash, morada, generoID]
    );

    const userID = resUser.insertId;

    // Cria também um cliente vinculado
    await pool.query(
      'INSERT INTO Cliente (NIF, UtilizadorID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?)',
      [NIF, userID, userID, userID]
    );

    return userID;
  },

  // Cria um novo utilizador, que é também um empregado
  async createEmpregado(nome, email, passwordHash, morada, generoID, dataNascimento, nacionalidadeID, categoriaFuncID) {
    const [resUser] = await pool.query(
      'INSERT INTO Utilizador (Nome, Email, Password, Morada, GeneroID, Tipo) VALUES (?, ?, ?, ?, ?, "Empregado")',
      [nome, email, passwordHash, morada, generoID]
    );

    const userID = resUser.insertId;

    // Cria também um empregado vinculado
    await pool.query(
      'INSERT INTO Empregado (DataNascimento, NacionalidadeID, UtilizadorID, CategoriaFuncID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?)',
      [dataNascimento, nacionalidadeID, userID, categoriaFuncID, userID, userID]
    );

    return userID;
  },

  // Atualiza os dados de um utilizador que é também um cliente
  async updateCliente(ID, nome, email, morada, generoID, NIF) {
    const [result] = await pool.query(
      'UPDATE Utilizador SET Nome = ?, Email = ?, Morada = ?, GeneroID = ? WHERE ID = ?',
      [nome, email, morada, generoID, ID]
    );

    await pool.query(
      'UPDATE Cliente SET NIF = ? WHERE UtilizadorID = ?',
      [NIF, ID]
    );

    console.log('Linhas afetadas:', result.affectedRows);
  },

  // Atualiza os dados de um utilizador que é também um empregado
  async updateEmpregado(ID, nome, email, morada, generoID, dataNascimento, NacionalidadeID, categoriaFuncID) {
    await pool.query(
      'UPDATE Utilizador SET Nome = ?, Email = ?, Morada = ?, GeneroID = ? WHERE ID = ?',
      [nome, email, morada, generoID, ID]
    );

    await pool.query(
      'UPDATE Empregado SET DataNascimento = ?, NacionalidadeID = ?, CategoriaFuncID = ? WHERE UtilizadorID = ?',
      [dataNascimento, NacionalidadeID, categoriaFuncID, ID]
    );
  },

  //Desativa um utilizador
  async desativar(id) {
    await pool.query('UPDATE Utilizador SET Estado = "inativo" WHERE ID = ?', [id]);
    await pool.query('UPDATE Cliente SET Estado = "inativo" WHERE utilizadorID = ?', [id]);
    await pool.query('UPDATE Empregado SET Estado = "inativo" WHERE utilizadorID = ?', [id]);
  },

  //Ativa um utilizador
  async ativar(id) {
    await pool.query('UPDATE Utilizador SET Estado = "ativo" WHERE ID = ?', [id]);
    await pool.query('UPDATE Cliente SET Estado = "ativo" WHERE utilizadorID = ?', [id]);
    await pool.query('UPDATE Empregado SET Estado = "ativo" WHERE utilizadorID = ?', [id]);
  },


  //Verifica se o email e a senha correspondem a um utilizador ativo
  async verifyPassword(email, password) {
    const user = await this.getByEmail(email);
    if (!user) return false;
    const match = await bcrypt.compare(password, user.PasswordHash);
    return match ? user : false;
  },

  // Método para obter o cargo do utilizador Empregado
  async getCargo(utilizadorID) {
    const [rows] = await pool.query(`
      SELECT CategoriaFunc.ID AS cargo
      FROM Empregado
      JOIN CategoriaFunc  ON Empregado.CategoriaFuncID = CategoriaFunc.ID
      WHERE Empregado.UtilizadorID = ? AND Empregado.Estado = "ativo"
    `, [utilizadorID]);
    return rows[0]?.cargo || null;
  }
};

