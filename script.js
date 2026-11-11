
const url = "http://localhost:5084/api";


async function login() {

    const dados = {
        Email: document.getElementById("email").value,
        Senha: document.getElementById("senha").value
    };

    const resposta = await fetch(url + "/Usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        document.getElementById("login").style.display = "none";
        document.getElementById("sistema").style.display = "block";

        listarTutores();
        listarPets();
        listarAgendamentos();
    } else {
        alert("Login incorreto!");
    }
}


function sair() {
    document.getElementById("sistema").style.display = "none";
    document.getElementById("login").style.display = "block";
}


async function cadastrarTutor() {

    const dados = {
        Nome: document.getElementById("nomeTutor").value,
        CPF: btoa(document.getElementById("cpfTutor").value),
        Telefone: document.getElementById("telefoneTutor").value
    };

    const resposta = await fetch(url + "/Tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        alert("Tutor cadastrado!");
        listarTutores();
    } else {
        alert(await resposta.text());
    }
}


async function listarTutores() {

    const busca = document.getElementById("buscaTutor").value;

    const resposta = await fetch(url + "/Tutor?busca=" + busca);
    const tutores = await resposta.json();

    let html = "<table border='1'><tr><th>Nome</th><th>Telefone</th><th>Ação</th></tr>";

    let opcoes = '<option value="">Selecione o tutor</option>';

    tutores.forEach(t => {
        html += `<tr>
            <td>${t.nome}</td>
            <td>${t.telefone}</td>
            <td><button onclick="editarTutor(${t.id})">Editar</button></td>
        </tr>`;

        opcoes += `<option value="${t.id}">${t.nome}</option>`;
    });

    html += "</table>";

    document.getElementById("listaTutores").innerHTML = html;
    document.getElementById("tutorPet").innerHTML = opcoes;
}


async function editarTutor(id) {

    const nome = prompt("Novo nome:");
    const telefone = prompt("Novo telefone:");

    if (!nome || telefone === null) return;

    const resposta = await fetch(url + "/Tutor/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Id: id,
            Nome: nome,
            Telefone: telefone
        })
    });

    if (resposta.ok) {
        alert("Tutor atualizado!");
        listarTutores();
    }
}


async function cadastrarPet() {

    const dados = {
        Nome: document.getElementById("nomePet").value,
        Especie: document.getElementById("especiePet").value,
        Raca: document.getElementById("racaPet").value,
        IdTutor: Number(document.getElementById("tutorPet").value)
    };

    const resposta = await fetch(url + "/Pet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        alert("Pet cadastrado!");
        listarPets();
    } else {
        alert(await resposta.text());
    }
}

async function listarPets() {

    const resposta = await fetch(url + "/Pet");
    const pets = await resposta.json();

    let html = "<table border='1'><tr><th>Nome</th><th>Espécie</th><th>Tutor</th></tr>";

    let opcoes = '<option value="">Selecione o pet</option>';

    pets.forEach(p => {
        html += `<tr>
            <td>${p.nome}</td>
            <td>${p.especie}</td>
            <td>${p.tutor ? p.tutor.nome : ""}</td>
        </tr>`;

        opcoes += `<option value="${p.id}">${p.nome}</option>`;
    });

    html += "</table>";

    document.getElementById("listaPets").innerHTML = html;
    document.getElementById("petAgendamento").innerHTML = opcoes;
}


async function cadastrarAgendamento() {

    const dados = {
        IdPet: Number(document.getElementById("petAgendamento").value),
        DataAgendamento: document.getElementById("dataAgendamento").value,
        Descricao: document.getElementById("descricaoAgendamento").value
    };

    const resposta = await fetch(url + "/Agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        alert("Agendamento cadastrado!");
        listarAgendamentos();
    } else {
        alert(await resposta.text());
    }
}


async function listarAgendamentos() {

    const resposta = await fetch(url + "/Agendamento");
    const agendamentos = await resposta.json();

    let html = "<table border='1'><tr><th>Pet</th><th>Tutor</th><th>Data</th><th>Ação</th></tr>";

    agendamentos.forEach(a => {
        html += `<tr>
            <td>${a.pet ? a.pet.nome : ""}</td>
            <td>${a.pet && a.pet.tutor ? a.pet.tutor.nome : ""}</td>
            <td>${new Date(a.dataAgendamento).toLocaleString("pt-BR")}</td>
            <td><button onclick="editarAgendamento(${a.id})">Alterar data</button></td>
        </tr>`;
    });

    html += "</table>";

    document.getElementById("listaAgendamentos").innerHTML = html;
}

async function editarAgendamento(id) {

    const data = prompt("Digite a nova data (AAAA-MM-DDTHH:MM)");

    if (!data) return;

    const resposta = await fetch(url + "/Agendamento/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Id: id,
            DataAgendamento: data
        })
    });

    if (resposta.ok) {
        alert("Agendamento atualizado!");
        listarAgendamentos();
    }
}
