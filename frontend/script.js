const form = document.getElementById("formUpload");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  status.innerText = "Enviando pedido...";

  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:3333/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    console.log("Resposta API:", data);

    status.innerText = `Pedido enviado! Código: ${data.codigo}`;

  } catch (error) {
    console.error("ERRO REAL:", error);
    status.innerText = "❌ Erro: " + error.message;
  }
});
