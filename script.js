/* -------- LocalStorage -------- */
const LS_TIERS = "fournisseursArray_v3";
const LS_USERS = "usersArray_v1";
let fournisseursArray = JSON.parse(localStorage.getItem(LS_TIERS) || "[]");
let usersArray = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

/* --- Pagination --- */
const PAGE_SIZE = 5;
let currentPage = 1;

/* -------- Sections & Navbar -------- */
function showSection(name){
  ["loginSection","homeSection","tiersSection","importSectionCard","usersSection"].forEach(s=>{
    document.getElementById(s).classList.add("d-none");
  });
  document.getElementById("btnLogoutMenu")?.classList.add("d-none");

  if(name==="login") renderLogin();
  if(name==="home") { renderHome(); document.getElementById("btnLogoutMenu").classList.remove("d-none"); }
  if(name==="tiers") { renderTiers(); document.getElementById("btnLogoutMenu").classList.remove("d-none"); }
  if(name==="import") { renderImport(); document.getElementById("btnLogoutMenu").classList.remove("d-none"); }
  if(name==="users") { renderUsers(); document.getElementById("btnLogoutMenu").classList.remove("d-none"); }
}

function renderNavbar(){
  document.getElementById("mainHeader").innerHTML=`
<nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center" href="#" onclick="showSection('home')">
      <img src="images/logo.jpeg" alt="Logo DC" width="40" height="40" class="me-2">
      Application DC
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('home')">Accueil</a></li>
        <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('tiers')">Gestion Tiers</a></li>
        <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('import')">Import Grand Livre</a></li>
        <li class="nav-item"><a class="nav-link" href="#" onclick="showSection('users')">Utilisateurs</a></li>
      </ul>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-light" onclick="toggleDarkMode()" title="Mode sombre"><i class="bi bi-moon-stars"></i></button>
        <button id="btnLogoutMenu" class="btn btn-outline-light d-none" onclick="logout()">
          <i class="bi bi-box-arrow-right"></i> Déconnexion
        </button>
      </div>
    </div>
  </div>
</nav>
`;
}

/* -------- Dark mode -------- */
function toggleDarkMode(){ document.body.classList.toggle("dark-mode"); }

/* -------- Login / Logout -------- */
function login(){
  const user=document.getElementById("username").value.trim();
  const pass=document.getElementById("password").value;
  const loginError=document.getElementById("loginError");
  loginError.textContent="";
  
  const found=usersArray.find(u=>u.name===user && u.pass===pass);
  if(found || (user==="admin" && pass==="dc2025")){
    document.getElementById("username").value="";
    document.getElementById("password").value="";
    showSection("home");
  } else loginError.textContent="Identifiants invalides.";
}

function logout(){ showSection("login"); }

/* -------- Tiers -------- */
function saveFournisseursToStorage(){ localStorage.setItem(LS_TIERS, JSON.stringify(fournisseursArray)); }

function handleTiersSubmit(e){
  e.preventDefault();
  const raison=document.getElementById("inputRaison").value.trim();
  const nif=document.getElementById("inputNIF").value.trim();
  const statut=document.getElementById("inputStatut").value.trim();
  const adresse=document.getElementById("inputAdresse").value.trim();
  const editingIndex=document.getElementById("editingIndex").value;

  if(!raison){ alert("Raison sociale obligatoire."); return; }
  if(nif && !/^\d+$/.test(nif)){ alert("NIF doit être numérique."); return; }

  const obj={raisonSociale:raison,nif,statut,adresse};
  if(editingIndex){ fournisseursArray[parseInt(editingIndex,10)]=obj; document.getElementById("editingIndex").value=""; document.getElementById("btnAdd").textContent="Ajouter"; }
  else fournisseursArray.push(obj);

  saveFournisseursToStorage();
  renderTiersTable();
  document.getElementById("formFournisseur").reset();
}

function renderTiersTable(){
  const tbody=document.querySelector("#tableFournisseurs tbody");
  tbody.innerHTML="";
  const q=document.getElementById("searchTiers").value.trim().toLowerCase();
  const filtered=fournisseursArray.filter(f=>{
    const combined=(f.raisonSociale+" "+(f.nif||"")+" "+(f.statut||"")).toLowerCase();
    return !q || combined.includes(q);
  });

  const totalPages=Math.ceil(filtered.length/PAGE_SIZE);
  if(currentPage>totalPages) currentPage=1;
  const start=(currentPage-1)*PAGE_SIZE;
  const pageItems=filtered.slice(start,start+PAGE_SIZE);

  pageItems.forEach((f,idx)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${escapeHtml(f.raisonSociale)}</td><td>${escapeHtml(f.nif||"")}</td><td>${escapeHtml(f.statut||"")}</td><td>${escapeHtml(f.adresse||"")}</td>
    <td class="text-end">
      <div class="btn-group" role="group">
        <button class="btn btn-sm btn-outline-primary" onclick="editFournisseur(${start+idx})"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteFournisseur(${start+idx})"><i class="bi bi-trash"></i></button>
      </div>
    </td>`;
    tbody.appendChild(tr);
  });

  // Pagination
  const pagUl=document.getElementById("tiersPagination");
  pagUl.innerHTML="";
  for(let i=1;i<=totalPages;i++){
    const li=document.createElement("li");
    li.className=`page-item ${i===currentPage?"active":""}`;
    li.innerHTML=`<a class="page-link" href="#" onclick="currentPage=${i}; renderTiersTable(); return false;">${i}</a>`;
    pagUl.appendChild(li);
  }
}

function editFournisseur(idx){
  const f=fournisseursArray[idx];
  document.getElementById("inputRaison").value=f.raisonSociale;
  document.getElementById("inputNIF").value=f.nif||"";
  document.getElementById("inputStatut").value=f.statut||"";
  document.getElementById("inputAdresse").value=f.adresse||"";
  document.getElementById("editingIndex").value=idx;
  document.getElementById("btnAdd").textContent="Enregistrer";
}

function deleteFournisseur(idx){ if(confirm("Confirmer suppression ?")){ fournisseursArray.splice(idx,1); saveFournisseursToStorage(); renderTiersTable(); } }

/* -------- Users -------- */
function saveUsersToStorage(){ localStorage.setItem(LS_USERS, JSON.stringify(usersArray)); }

function handleUserSubmit(e){
  e.preventDefault();
  const name=document.getElementById("inputUserName").value.trim();
  const pass=document.getElementById("inputUserPass").value;
  const role=document.getElementById("inputUserRole").value;
  const editingIndex=document.getElementById("editingUserIndex").value;

  if(editingIndex){
    usersArray[parseInt(editingIndex,10)]={name,pass,role};
    document.getElementById("editingUserIndex").value="";
    document.getElementById("btnAddUser").textContent="Ajouter";
  } else { usersArray.push({name,pass,role}); }

  saveUsersToStorage();
  renderUsersTable();
  document.getElementById("formUser").reset();
}

function renderUsersTable(){
  const tbody=document.querySelector("#tableUsers tbody");
  tbody.innerHTML="";
  usersArray.forEach((u,idx)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.role)}</td>
      <td class="text-end">
        <div class="btn-group" role="group">
          <button class="btn btn-sm btn-outline-primary" onclick="editUser(${idx})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${idx})"><i class="bi bi-trash"></i></button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
}

function editUser(idx){
  const u=usersArray[idx];
  document.getElementById("inputUserName").value=u.name;
  document.getElementById("inputUserPass").value=u.pass;
  document.getElementById("inputUserRole").value=u.role;
  document.getElementById("editingUserIndex").value=idx;
  document.getElementById("btnAddUser").textContent="Enregistrer";
}

/* -------- Utils -------- */
function escapeHtml(s){ if(!s && s!==0) return ""; return s.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

/* -------- Init -------- */
renderNavbar();
showSection("login");
