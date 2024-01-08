const Transacao = require('../models/transaction')
const Categoria = require('../models/transactionCategory')
const MetodoPagamento = require('../models/paymentMethod')
const { Op } = require('sequelize');

// Função para obter o mês e ano atual
const obterMesEAnoAtual = () => {
  const agora = new Date();
  return {
    anoAtual: agora.getFullYear(),
    mesAtual: agora.getMonth() + 1, // Meses em JavaScript começam do zero
  };
};

// Função para calcular o primeiro e o último dia do mês
const calcularPrimeiroEUltimoDiaDoMes = (ano, mes) => {
  return {
    primeiroDiaMes: new Date(ano, mes - 1, 1),
    ultimoDiaMes: new Date(ano, mes, 0),
  };
};

// Função para consultar transações do mês atual
const consultarTransacoesDoMes = async (primeiroDiaMes, ultimoDiaMes) => {
  return await Transacao.findAll({
    where: {
      dataTransacao: {
        [Op.between]: [primeiroDiaMes, ultimoDiaMes],
      },
    },
    include: [{ model: Categoria, attributes: ['nome'] }, { model: MetodoPagamento, attributes: ['nome'] }],
  });
};

// Função para calcular o balanço mensal
const calcularBalançoMensal = transacoesDoMes => {
    let resultado = transacoesDoMes.reduce((saldo, transacao) => {
      if (transacao.valor > 0) {
        saldo.totalReceitas += transacao.valor;
      } else {
        saldo.totalDespesas += Math.abs(transacao.valor);
      }
  
      return saldo;
    }, { totalReceitas: 0, totalDespesas: 0 });
  
    resultado.balanco = resultado.totalReceitas - resultado.totalDespesas

    return resultado;
  };

const agruparTransacoesPorCategoria = transacoesDoMes => {
    const agrupado = {
      receitas: {},
      despesas: {},
    };
  
    transacoesDoMes.forEach(transacao => {
        console.log()
        const nomeCategoria = transacao.dataValues.CategoriaTransacao ? transacao.dataValues.CategoriaTransacao.nome : 'Sem Categoria';
        const tipoTransacao = transacao.valor > 0 ? 'receitas' : 'despesas';
  
        if (!agrupado[tipoTransacao][nomeCategoria]) {
            agrupado[tipoTransacao][nomeCategoria] = 0;
        }
  
        agrupado[tipoTransacao][nomeCategoria] += Math.abs(transacao.valor);
    });
  
    return agrupado;
};

// Função para consultar variações diárias de despesas e receitas no mês
const consultarVariacoesDiarias = async (primeiroDiaMes, ultimoDiaMes) => {
  return await sequelize.query(`
    SELECT
      DATE(dataTransacao) as data,
      SUM(CASE WHEN valor > 0 THEN valor ELSE 0 END) as receitas,
      SUM(CASE WHEN valor < 0 THEN valor ELSE 0 END) as despesas
    FROM
      Transacoes
    WHERE
      dataTransacao BETWEEN :primeiroDiaMes AND :ultimoDiaMes
    GROUP BY
      data
    ORDER BY
      data;
  `, {
    replacements: {
      primeiroDiaMes,
      ultimoDiaMes,
    },
    type: sequelize.QueryTypes.SELECT,
  });
};

const relatorioMensal = async (req, res) => {
  try {
    // Obter o mês e ano atual
    const { anoAtual, mesAtual } = obterMesEAnoAtual();

    // Calcular o primeiro e o último dia do mês
    const { primeiroDiaMes, ultimoDiaMes } = calcularPrimeiroEUltimoDiaDoMes(anoAtual, mesAtual);

    // Consultar todas as transações do mês atual
    const transacoesDoMes = await consultarTransacoesDoMes(primeiroDiaMes, ultimoDiaMes);

    // Calcular o balanço do mês considerando a inversão de valores para despesas
    const balancoMensal = calcularBalançoMensal(transacoesDoMes);

     // Agrupar transações por categoria
     const transacoesPorCategoria = agruparTransacoesPorCategoria(transacoesDoMes);

    return res.status(200).json({
        balancoMensal,
        transacoesPorCategoria
    })

   
/* 
    // Consultar variações diárias de despesas e receitas no mês
    const variacoesDiarias = await consultarVariacoesDiarias(primeiroDiaMes, ultimoDiaMes);

    // Se precisar, você pode enviar esses dados para o frontend ou fazer qualquer outra coisa com eles
    res.json({
      balancoMensal,
      transacoesPorCategoria,
      variacoesDiarias,
    }); */
  } catch (error) {
    console.error('Erro ao gerar relatório mensal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
    relatorioMensal
}