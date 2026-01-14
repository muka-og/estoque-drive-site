const form = document.getElementById("formUpload");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  status.innerText = "Enviando...";

  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:3333/upload", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.sucesso) {
      status.innerText = "Pedido enviado com sucesso ✅";
      form.reset();
    } else {
      status.innerText = "Erro ao enviar ❌";
    }

  } catch (err) {
    status.innerText = "Erro de conexão com a API ❌";
  }
});
