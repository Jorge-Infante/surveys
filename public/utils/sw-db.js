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
