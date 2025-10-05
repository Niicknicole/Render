// Lista de cidades por estado
const cidadesPorEstado = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Feijó"],
  AL: ["Maceió", "Arapiraca", "Rio Largo", "Palmeira dos Índios", "São Miguel dos Campos"],
  AP: ["Macapá", "Santana", "Oiapoque", "Mazagão", "Laranjal do Jari"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
  DF: ["Brasília"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"],
  MA: ["São Luís", "Imperatriz", "Caxias", "Timon", "Codó"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas"],
  PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"],
  PI: ["Teresina", "Parnaíba", "Picos", "Campo Maior", "Floriano"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
  RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Ceará-Mirim"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Cacoal", "Vilhena"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Cantá", "Bonfim"],
  RS: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Criciúma"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão"],
  SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"],
};

// ===================================
// RELATO ANÔNIMO
// ===================================
const form = document.getElementById('relatoForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      estado: form.estado.value,
      cidade: form.cidade.value,
      descricao: form.descricao.value,
      userEmail: null // sempre anônimo
    };

    try {
        const res = await fetch('/api/relatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          alert('Relato enviado anonimamente.');
          form.reset(); 
        } else {
          const err = await res.json();
          alert('Erro ao enviar relato: ' + (err.error || 'Erro desconhecido.'));
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
        console.error('Erro de conexão:', error);
    }
  });
}

// ===================================
// CARREGAR RELATOS
// ===================================
async function carregarRelatos() {
  const container = document.getElementById('relatos-list');
  if (!container) return;

  container.innerHTML = '<h3>Últimos Relatos</h3>';

  try {
      const res = await fetch('/api/relatos');
      const relatos = await res.json();

      if (!relatos.length) {
          container.innerHTML += '<p>Nenhum relato encontrado.</p>';
          return;
      }

      relatos.reverse().forEach(r => {
          const div = document.createElement('div');
          div.className = 'relato card';
          div.innerHTML = `
              <p class="relato-local"><strong>${r.cidade} - ${r.estado}</strong></p>
              <p class="relato-descricao">${r.descricao}</p>
              <small class="relato-data">Enviado anonimamente em: ${new Date(r.data).toLocaleDateString()}</small>
          `;
          container.appendChild(div);
      });
  } catch (error) {
      console.error("Erro ao carregar relatos:", error);
      container.innerHTML = '<p>Erro ao carregar relatos. Tente novamente mais tarde.</p>';
  }
}

// ===================================
// CARROSSEL
// ===================================
function initCarrossel() {
    const slides = document.querySelectorAll(".carrossel .slide");
    const dotsContainer = document.querySelector(".carrossel .dots");
    const next = document.querySelector(".carrossel .next");
    const prev = document.querySelector(".carrossel .prev");
    let slideIndex = 0;

    if (!slides.length) return;

    slides.forEach((_, i) => {
        if (dotsContainer) {
            const dot = document.createElement("span");
            dot.addEventListener("click", () => showSlide(i));
            dotsContainer.appendChild(dot);
        }
    });

    function showSlide(n) {
        slides.forEach((slide, i) => {
          slide.classList.remove("active");
          if (dotsContainer.children[i]) dotsContainer.children[i].classList.remove("active");
        });
        slides[n].classList.add("active");
        if (dotsContainer.children[n]) dotsContainer.children[n].classList.add("active");
        slideIndex = n;
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        showSlide(slideIndex);
    }

    if (next) next.addEventListener("click", nextSlide);
    if (prev) prev.addEventListener("click", prevSlide);

    setInterval(nextSlide, 4000);
    showSlide(slideIndex);
}

// ===================================
// SELECTS DE ESTADO E CIDADE
// ===================================
function initSelects() {
  const selectEstado = document.getElementById('estado');
  const selectCidade = document.getElementById('cidade');

  if (selectEstado) {
      Object.keys(cidadesPorEstado).forEach(estado => {
          const option = document.createElement('option');
          option.value = estado;
          option.textContent = estado;
          selectEstado.appendChild(option);
      });

      selectEstado.addEventListener('change', () => {
          selectCidade.innerHTML = '<option value="">Selecione a cidade</option>';
          const estadoSelecionado = selectEstado.value;

          if (estadoSelecionado && cidadesPorEstado[estadoSelecionado]) {
              cidadesPorEstado[estadoSelecionado].forEach(cidade => {
                  const option = document.createElement('option');
                  option.value = cidade;
                  option.textContent = cidade;
                  selectCidade.appendChild(option);
              });
              selectCidade.disabled = false;
          } else {
              selectCidade.disabled = true;
          }
      });

      selectCidade.disabled = true;
  }
}

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initSelects();
  initCarrossel();
  carregarRelatos();
});
