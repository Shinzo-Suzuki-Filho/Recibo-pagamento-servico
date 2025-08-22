function numeroParaExtenso(valor) {
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const especiais = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  if (valor === 0) return "zero";

  let inteiro = Math.floor(valor);
  let centavos = Math.round((valor - inteiro) * 100);

  function extensoNumero(n) {
    if (n === 0) return "";
    if (n < 10) return unidades[n];
    if (n < 20) return especiais[n - 10];
    if (n < 100) {
      let dezena = Math.floor(n / 10);
      let unidade = n % 10;
      return dezenas[dezena] + (unidade > 0 ? " e " + unidades[unidade] : "");
    }
    if (n < 1000) {
      if (n === 100) return "cem";
      let centena = Math.floor(n / 100);
      let resto = n % 100;
      return centenas[centena] + (resto > 0 ? " e " + extensoNumero(resto) : "");
    }
    return "";
  }

  function extensoMilhares(n) {
    if (n === 0) return "";
    if (n < 1000) return extensoNumero(n);
    if (n < 1000000) {
      let milhares = Math.floor(n / 1000);
      let resto = n % 1000;
      let milharesExt = "";
      if (milhares === 1) {
        milharesExt = "mil";
      } else {
        milharesExt = extensoNumero(milhares) + " mil";
      }
      if (resto > 0) {
        if (resto < 100) {
          return milharesExt + " e " + extensoNumero(resto);
        } else {
          return milharesExt + " " + extensoNumero(resto);
        }
      } else {
        return milharesExt;
      }
    }
    if (n < 1000000000) {
      let milhoes = Math.floor(n / 1000000);
      let resto = n % 1000000;
      let milhoesExt = "";
      if (milhoes === 1) {
        milhoesExt = "um milhão";
      } else {
        milhoesExt = extensoMilhares(milhoes) + " milhões";
      }
      if (resto > 0) {
        if (resto < 100) {
          return milhoesExt + " e " + extensoMilhares(resto);
        } else {
          return milhoesExt + " " + extensoMilhares(resto);
        }
      } else {
        return milhoesExt;
      }
    }
    return "";
  }

  let extenso = "";
  if (inteiro > 0) {
    extenso += extensoMilhares(inteiro) + (inteiro === 1 ? " real" : " reais");
  }
  if (centavos > 0) {
    if (extenso.length > 0) extenso += " e ";
    extenso += extensoNumero(centavos) + (centavos === 1 ? " centavo" : " centavos");
  }
  return extenso;
}

document.getElementById("recibo-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const recebemosDe = document.getElementById("recebemosDe").value.trim();
  const cpfCnpj = document.getElementById("cpfCnpj").value.trim();
  const servicos = Array.from(document.querySelectorAll('input[name="servicos"]:checked')).map(el => el.value);
  const valor = parseFloat(document.getElementById("valor").value);

  if (!recebemosDe || !cpfCnpj || servicos.length === 0 || isNaN(valor) || valor < 0) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const total = valor.toFixed(2);
  const valorExtenso = numeroParaExtenso(valor);

  const valorExtensoCapitalizado = valorExtenso.charAt(0).toUpperCase() + valorExtenso.slice(1);
  document.getElementById("total").value = total;
  document.getElementById("valorExtenso").value = valorExtensoCapitalizado;

  // Obter data atual
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Gerar conteúdo do recibo
  const reciboContent = `
    <strong>RECIBO DE PAGAMENTO</strong>
    -----------------------------------
    <strong>Recebemos de:</strong> ${recebemosDe}
    <strong>CPF/CNPJ:</strong> ${cpfCnpj}
    <strong>Serviços Prestados:</strong> ${servicos.join(", ")}
    -----------------------------------
    <strong>VALOR TOTAL: R$ ${total}</strong>
    <em>(${valorExtensoCapitalizado})</em>
    -----------------------------------
    <strong>Data:</strong> ${dataFormatada}
  `;

  document.getElementById("recibo-content").innerHTML = reciboContent;
  document.getElementById("recibo-output").hidden = false;
  this.hidden = true;
});

document.getElementById("btn-novo").addEventListener("click", function () {
  document.getElementById("recibo-form").reset();
  document.getElementById("total").value = "";
  document.getElementById("valorExtenso").value = "";
  document.getElementById("recibo-output").hidden = true;
  document.getElementById("recibo-form").hidden = false;
});

document.getElementById("btn-limpar").addEventListener("click", function () {
  document.getElementById("recibo-form").reset();
  document.getElementById("total").value = "";
  document.getElementById("valorExtenso").value = "";
});
