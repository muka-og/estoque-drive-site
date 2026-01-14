document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(e.target);

  await fetch("https://SEU_BACKEND/upload", {
    method: "POST",
    body: formData
  });

  alert("Enviado!");
});
