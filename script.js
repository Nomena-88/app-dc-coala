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
// Les fonctions handleTiersSubmit, renderTiersTable, editFournisseur, deleteFournisseur
// avec pagination comme dans ton code précédent

/* -------- Users -------- */
// Les fonctions handleUserSubmit, renderUsersTable, editUser, deleteUser
// exactement comme dans ton code précédent

/* -------- Utils -------- */
function escapeHtml(s){ if(!s && s!==0) return ""; return s.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

/* -------- Init -------- */
renderNavbar();
showSection("login");

