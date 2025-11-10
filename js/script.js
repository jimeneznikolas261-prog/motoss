

// Datos iniciales de modelos
const MODELOS = [
  {id:1, marca:"Yamaha", modelo:"R1", tipo:"deportiva", img:"img/r1_negra.jpg", descripcion:"Deportiva con alto rendimiento y tecnología."},
  {id:2, marca:"Ducati", modelo:"Panigale V4", tipo:"deportiva", img:"img/ducati v4.jpeg", descripcion:"Máxima agresividad y motor potente."},
  {id:3, marca:"Kawasaki", modelo:"Ninja   ZX-10R", tipo:"deportiva", img:"img/zx-10R.jpeg", descripcion:"Precisión en curvas y aceleración."},
  {id:4, marca:"Harley", modelo:"Iron 883", tipo:"clasica", img:"img/harley iron 883.jpeg", descripcion:"Estilo clásico y sonido único."},
  {id:5, marca:"BMW", modelo:"R1250 GS", tipo:"aventura", img:"img/BMW R1250.jpeg", descripcion:"Perfecta para largas travesías."},
  {id:6, marca:"Triumph", modelo:"Street Triple", tipo:"deportiva", img:"img/Triumph triple.jpeg", descripcion:"Agilidad urbana y potencia."},
  {id:7, marca:"Honda", modelo:"CBR600RR", tipo:"deportiva", img:"img/CBR 600 RR.jpeg", descripcion:"Balance entre potencia y maniobrabilidad."},
  {id:8, marca:"Royal Enfield", modelo:"Classic 350", tipo:"clasica", img:"img/ROYAL ENFIELD.jpeg", descripcion:"Estética retro y manejo suave."}
];

// Generar catálogo inicial 
let modelosMostrados = 0;
const POR_PAGINA = 6;

function crearTarjeta(modelo){
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <img src="${modelo.img}" alt="${modelo.marca} ${modelo.modelo}">
    <div>
      <h4>${modelo.marca} ${modelo.modelo}</h4>
      <p>${modelo.descripcion}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
        <span class="badge">${modelo.tipo}</span>
        <a class="btn" href="contacto.html?interes=${encodeURIComponent(modelo.marca+' '+modelo.modelo)}">Interesado</a>
      </div>
    </div>
  `;
  return div;
}

function cargarMas(){
  const catalog = document.getElementById('catalog');
  const desde = modelosMostrados;
  const hasta = Math.min(modelosMostrados + POR_PAGINA, MODELOS.length);
  for(let i=desde;i<hasta;i++){
    catalog.appendChild(crearTarjeta(MODELOS[i]));
  }
  modelosMostrados = hasta;
  if(modelosMostrados >= MODELOS.length){
    document.getElementById('load-more').style.display = 'none';
  }
}

function filtrarCatalogo(){
  const q = document.getElementById('search-input').value.toLowerCase();
  const tipo = document.getElementById('filter-type').value;
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = '';
  const filtrados = MODELOS.filter(m=>{
    const matchQ = (m.marca+' '+m.modelo+' '+m.descripcion).toLowerCase().includes(q);
    const matchTipo = tipo==='all' ? true : m.tipo===tipo;
    return matchQ && matchTipo;
  });
  if(filtrados.length===0){
    catalog.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted)">No se encontraron modelos.</p>';
    document.getElementById('load-more').style.display='none';
    return;
  }
  filtrados.slice(0, POR_PAGINA).forEach(m=>catalog.appendChild(crearTarjeta(m)));
  modelosMostrados = Math.min(POR_PAGINA, filtrados.length);
  // show load more only if there are more results than shown and no active filter by q (simple behavior)
  document.getElementById('load-more').style.display = (filtrados.length > modelosMostrados) ? 'inline-block' : 'none';
}

// DOM events y utilidades
document.addEventListener('DOMContentLoaded', ()=>{
  // Si estamos en la página modelos
  if(document.getElementById('catalog')){
    // cargar primeros
    cargarMas();
    document.getElementById('load-more').addEventListener('click', cargarMas);
    // search & filter
    document.getElementById('search-input').addEventListener('input', filtrarCatalogo);
    document.getElementById('filter-type').addEventListener('change', filtrarCatalogo);
  }

  // Menu toggle responsive
  document.querySelectorAll('.menu-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = btn.nextElementSibling || document.querySelector('.nav');
      if(nav.style.display === 'flex' || nav.style.display === 'block') nav.style.display = 'none';
      else nav.style.display = 'flex';
    });
  });

  // Theme toggle (light/dark simple switch)
  function toggleTheme(){
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
  }
  ['toggle-theme','toggle-theme-2','toggle-theme-3'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('click', (e)=>{ e.preventDefault(); toggleTheme(); });
  });

  // Contact form validation
  const form = document.getElementById('contact-form');
  if(form){
    // if URL contains ?interes=..., prefills model
    const params = new URLSearchParams(location.search);
    if(params.get('interes')){
      const field = document.getElementById('model');
      if(field) field.value = params.get('interes');
    }

    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      // name validation
      const errorName = document.getElementById('error-name');
      if(!name.value || name.value.trim().length < 2){
        errorName.textContent = 'Ingresa un nombre válido (2+ caracteres).';
        valid = false;
      } else { errorName.textContent = ''; }

      // email validation simple
      const errorEmail = document.getElementById('error-email');
      const reEmail = /^\S+@\S+\.\S+$/;
      if(!reEmail.test(email.value)){
        errorEmail.textContent = 'Ingresa un correo válido.';
        valid = false;
      } else { errorEmail.textContent = ''; }

      // message validation
      const errorMessage = document.getElementById('error-message');
      if(!message.value || message.value.trim().length < 10){
        errorMessage.textContent = 'Escribe un mensaje más detallado (10+ caracteres).';
        valid = false;
      } else { errorMessage.textContent = ''; }

      if(!valid) return;

      // Simular envío
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      setTimeout(()=>{
        alert('Mensaje enviado. ¡Gracias por contactarnos!');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
        form.reset();
      }, 900);
    });
  }
});
