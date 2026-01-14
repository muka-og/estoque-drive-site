const form = document.getElementById("formUpload");
const status = document.getElementById("status");

// Coloque aqui a URL pública do seu backend
const API_URL = "https://railway.com/project/cba879f1-eaf7-4607-8d5a-f21a34b15494?environmentId=f0ac7dc9-6ad0-4152-963d-238e8946ace2"; // substitua pela sua URL

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  status.textContent = "Enviando pedido...";

  const formData = new FormData(form);

  try {
    const response = await fetch(`${API_URL}/pedido`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro do servidor: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      status.textContent = `Pedido enviado! Código: ${data.codigoPedido}`;
      form.reset();
    } else {
      status.textContent = "Falha ao enviar pedido.";
    }

  } catch (error) {
    console.error(error);
    status.textContent = "Erro ao conectar com o servidor.";
  }
});
