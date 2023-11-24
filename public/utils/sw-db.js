// Utilidades para grabar PouchDB
const db = new PouchDB("mensajes");

function guardarMensaje(mensaje) {
  mensaje._id = new Date().toISOString();

  return db.put(mensaje).then(() => {
    console.log("VAMOS A GUARDAR MENSAJE: ", mensaje);

    self.registration.sync.register("nuevo-post");

    const newResp = { ok: true, offline: true };

    return new Response(JSON.stringify(newResp));
  });
}

// Postear mensajes a la API
function postearMensajes() {
  const posteos = [];

  return db.allDocs({ include_docs: true }).then((docs) => {
    console.log("-----------------ROWS :", docs.rows);
    docs.rows.forEach((row) => {
      const doc = row.doc;

      const fetchPom = fetch(
        "https://test-apiothras.djsoftwaremakers.com/api/v1/survey/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwNTQzODQ3LCJpYXQiOjE3MDA1NDM1NDcsImp0aSI6ImViNzdjNjI3ZmQ5YTQ0MjVhOTg1NDRhNDczNmMwNWFhIiwidXNlcl9pZCI6Mn0.7smX7krShRxiyMnT4Y-y1QuznT_6Tfy6ScTbFuxm-hA`,
          },
          body: JSON.stringify(doc),
        }
      ).then((res) => {
        return db.remove(doc);
      });

      posteos.push(fetchPom);
    }); // fin del foreach

    return Promise.all(posteos);
  });
}
