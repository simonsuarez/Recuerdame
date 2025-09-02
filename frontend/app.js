import { BASE_URL } from "./config.js";

const listEl = document.getElementById("list");
const formEl = document.getElementById("form");
const toastEl = document.getElementById("toast");

function toast(msg, ok = true) {
  toastEl.textContent = msg;
  toastEl.className =
    "fixed top-4 right-4 px-4 py-2 rounded-lg shadow text-sm " +
    (ok ? "bg-emerald-600 text-white" : "bg-rose-600 text-white");
  toastEl.style.opacity = "1";
  setTimeout(() => (toastEl.style.opacity = "0"), 1800);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchRecordatorios() {
  listEl.innerHTML = `<li class="text-white/80">Cargando...</li>`;
  try {
    const res = await fetch(`${BASE_URL}/api/recordatorios`);
    if (!res.ok) throw new Error("Error al cargar");
    const data = await res.json();
    renderList(data);
  } catch (e) {
    listEl.innerHTML = `<li class="text-rose-200">No se pudo cargar la lista</li>`;
    toast("Error al cargar", false);
    console.error(e);
  }
}

function renderList(items) {
  if (!items.length) {
    listEl.innerHTML = `<li class="text-white/80">Sin recordatorios</li>`;
    return;
  }
  listEl.innerHTML = items.map(r => `
<li class="flex items-start justify-between gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
  <div>
    <h3 class="font-semibold">${escapeHtml(r.titulo)}</h3>
    <p class="text-white/80 text-sm">${escapeHtml(r.descripcion ?? "")}</p>
    <p class="text-white/60 text-xs mt-1">Fecha: ${new Date(r.fecha).toLocaleString()}</p>
  </div>
  <div class="flex items-center gap-2">
    <button data-id="${r.id}" class="btn-del px-3 py-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-sm">Eliminar</button>
  </div>
</li>`).join("");

  document.querySelectorAll(".btn-del").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm("¿Eliminar este recordatorio?")) return;
      try {
        const res = await fetch(`${BASE_URL}/api/recordatorios/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("No se pudo eliminar");
        toast("Eliminado");
        await fetchRecordatorios();
      } catch (err) {
        toast("Error al eliminar", false);
        console.error(err);
      }
    });
  });
}

formEl?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = formEl.titulo.value.trim();
  const descripcion = formEl.descripcion.value.trim();
  const fecha = formEl.fecha.value
    ? new Date(formEl.fecha.value).toISOString()
    : new Date().toISOString();

  if (!titulo) {
    toast("El título es requerido", false);
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/recordatorios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion, fecha, completado: false }),
    });
    if (!res.ok) throw new Error("No se pudo crear");
    formEl.reset();
    toast("Creado");
    await fetchRecordatorios();
  } catch (err) {
    toast("Error al crear", false);
    console.error(err);
  }
});

fetchRecordatorios();