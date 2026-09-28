const botaoCadastrar = document.getElementById("register-button");

const campoCPF = document.getElementById("cpf");

const campoEmail = document.getElementById("email");

const imagemInput = document.getElementById("imagemuser");

const previewImagem = document.getElementById("preview-imagem");


// CPF - aceitar somente números
campoCPF.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

});


// Mostrar a imagem escolhida
imagemInput.addEventListener("change", function () {

    const arquivo = this.files[0];

    if (arquivo) {

        const leitor = new FileReader();

        leitor.onload = function (evento) {

            previewImagem.src = evento.target.result;

            previewImagem.style.display = "block";

        };

        leitor.readAsDataURL(arquivo);

    } else {

        previewImagem.src = "";

        previewImagem.style.display = "none";

    }

});


// Botão Cadastrar
botaoCadastrar.addEventListener("click", async function () {

    const nome = document.getElementById("name").value.trim();

    const cpf = document.getElementById("cpf").value.trim();

    const cep = document.querySelector(
        'input[autocomplete="postal-code"]'
    ).value.trim();

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("confirm-password").value;

    const usuario = document.getElementById("nameu").value.trim();

    const imagem = document.getElementById("imagemuser").files[0];


    // Verificar se todos os campos estão preenchidos
    if (
        nome === "" ||
        cpf === "" ||
        cep === "" ||
        email === "" ||
        senha === "" ||
        usuario === "" ||
        !imagem
    ) {

        alert("Por favor, preencha todos os campos antes de cadastrar.");

        return;

    }


    // Verificar CPF
    if (!/^\d+$/.test(cpf)) {

        alert("O CPF deve conter somente números.");

        return;

    }


    // Verificar quantidade de números do CPF
    if (cpf.length !== 11) {

        alert("O CPF deve possuir 11 números.");

        return;

    }


    // Verificar email
    if (!email.includes("@")) {

        alert("Digite um email válido contendo @.");

        return;

    }


    // Criptografar senha com SHA-256
    const dadosSenha = new TextEncoder().encode(senha);

    const hashSenha = await crypto.subtle.digest(
        "SHA-256",
        dadosSenha
    );


    const senhaCriptografada = Array.from(
        new Uint8Array(hashSenha)
    )
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");


    // Criar conteúdo do TXT
    const conteudoTxt = `
CADASTRO DE USUÁRIO
===========================

Nome Completo: ${nome}

CPF: ${cpf}

CEP: ${cep}

Email: ${email}

Nome de Usuário: ${usuario}

Senha Criptografada: ${senhaCriptografada}

Imagem: ${imagem.name}

===========================
`;


    // Criar arquivo TXT
    const arquivo = new Blob(
        [conteudoTxt],
        {
            type: "text/plain;charset=utf-8"
        }
    );


    // Criar link para download
    const link = document.createElement("a");

    link.href = URL.createObjectURL(arquivo);

    link.download = "cadastro_usuario.txt";


    // Fazer download
    link.click();


    // Liberar memória
    URL.revokeObjectURL(link.href);


    alert("Cadastro realizado com sucesso!");

});