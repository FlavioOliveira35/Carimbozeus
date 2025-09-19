/**
 * @file script.js
 * @description Contém toda a lógica de interatividade da aplicação Gerador de Etiqueta,
 * incluindo a navegação entre telas, manipulação de formulários e cópia de texto.
 */

// --- Funções de Navegação e UI ---

function iniciarApp() {
    const splash = document.getElementById("telaAbertura");
    const selectionScreen = document.getElementById("selection-screen");

    splash.style.opacity = 1;
    const fade = setInterval(() => {
      if (splash.style.opacity > 0) {
        splash.style.opacity -= 0.03;
      } else {
        clearInterval(fade);
        splash.style.display = "none";
        selectionScreen.style.display = "flex";
      }
    }, 30);
}

function showForm(formType) {
    const selectionScreen = document.getElementById("selection-screen");
    const appContainer = document.getElementById("app");
    const reparoForm = document.getElementById("form-reparo");
    const instalacaoForm = document.getElementById("form-instalacao");

    selectionScreen.style.display = "none";
    appContainer.style.display = "flex";

    if (formType === 'reparo') {
      reparoForm.style.display = "block";
      instalacaoForm.style.display = "none";
    } else if (formType === 'instalacao') {
      instalacaoForm.style.display = "block";
      reparoForm.style.display = "none";
    }
}

function goBack() {
    const selectionScreen = document.getElementById("selection-screen");
    const appContainer = document.getElementById("app");
    const reparoForm = document.getElementById("form-reparo");
    const instalacaoForm = document.getElementById("form-instalacao");

    appContainer.style.display = "none";
    reparoForm.style.display = "none";
    instalacaoForm.style.display = "none";
    selectionScreen.style.display = "flex";
}

// --- Lógica de Modais ---

function showSuccessModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('custom-modal').style.display = 'flex';
}

function hideSuccessModal() {
    document.getElementById('custom-modal').style.display = 'none';
}

function showErrorModal(errors) {
    const errorList = document.getElementById('error-modal-list');
    errorList.innerHTML = '';
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
    });
    document.getElementById('error-modal').style.display = 'flex';
}

function hideErrorModal() {
    document.getElementById('error-modal').style.display = 'none';
}


// --- Lógica de Formulários ---

function copyTextToClipboard(text) {
  const showSuccess = () => {
      showSuccessModal(
          "Conteúdo Copiado!",
          "Lembre-se que a veracidade das informações é de sua responsabilidade."
      );
  };

  const showFailure = () => {
      showSuccessModal(
          "Erro",
          "Não foi possível copiar o conteúdo. Por favor, tente novamente."
      );
  };

  if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(showSuccess, showFailure);
  } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
          const successful = document.execCommand('copy');
          if (successful) showSuccess();
          else showFailure();
      } catch (err) {
          showFailure();
          console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
  }
}

function validateForm(formPrefix) {
    const errors = [];
    const minLengthFirstFields = 5;

    const fieldsToValidate = [
        { id: `${formPrefix}-cliente`, name: `Reclamação do cliente (Reparo) / Todos os produtos funcionando (Instalação)`, minLength: minLengthFirstFields },
        { id: `${formPrefix}-endereco`, name: `O que foi feito para corrigir (Reparo) / Local do modem (Instalação)`, minLength: minLengthFirstFields },
        { id: `${formPrefix}-produto`, name: 'Orientação ao cliente' },
        { id: `${formPrefix}-tecnico`, name: 'Código do Mapa de Calor' },
        { id: `${formPrefix}-test`, name: 'ID do Speed Test', isNumeric: true },
        { id: `${formPrefix}-power`, name: 'Potência Fibra PowerMeter', isNumeric: true },
    ];

    fieldsToValidate.forEach(field => {
        const element = document.getElementById(field.id);
        const value = element.value.trim();

        if (!value) {
            errors.push(`O campo "${field.name}" é obrigatório.`);
        } else if (field.minLength && value.length < field.minLength) {
            errors.push(`O campo "${field.name}" deve ter no mínimo ${field.minLength} caracteres.`);
        } else if (field.isNumeric) {
            const numericValue = value.replace(',', '.');
            if (isNaN(numericValue) || /[^\d.-]/.test(numericValue)) {
                errors.push(`O campo "${field.name}" deve conter apenas números.`);
            }
        }
    });
    return errors;
}

function copiarTextoReparo() {
    const errors = validateForm('reparo');
    if (errors.length > 0) {
        showErrorModal(errors);
        return;
    }
    const getVal = id => document.getElementById(id)?.value.trim() || "N/A";
    const dataHora = new Date().toLocaleString("pt-BR");
    const texto = `RELATÓRIO DE REPARO\n\n;DATA HORA: ${dataHora};\n;Reclamação do cliente: ${getVal("reparo-cliente")};\n;O que foi feito para corrigir: ${getVal("reparo-endereco")};\n;Orientação ao cliente: ${getVal("reparo-produto")};\n;Código do Mapa de Calor: ${getVal("reparo-tecnico")};\n;ID do Speed Test: ${getVal("reparo-test")};\n;Potência Fibra PowerMeter: ${getVal("reparo-power")};\n;OBSERVAÇÕES: ${getVal("reparo-obs")};`;
    copyTextToClipboard(texto);
}

function copiarTextoInstalacao() {
    const errors = validateForm('inst');
    if (errors.length > 0) {
        showErrorModal(errors);
        return;
    }
    const getVal = id => document.getElementById(id)?.value.trim() || "N/A";
    const dataHora = new Date().toLocaleString("pt-BR");
    const texto = `RELATÓRIO DE INSTALAÇÃO\n\n;DATA HORA:; ${dataHora};\n;Todos os produtos funcionando corretamente:: ${getVal("inst-cliente")};\n;Informe o local onde o modem está instalado:: ${getVal("inst-endereco")};\n;Orientação ao cliente: ${getVal("inst-produto")};\n;Código do Mapa de Calor: ${getVal("inst-tecnico")};\n;ID do Speed Test: ${getVal("inst-test")};\n;Potência Fibra PowerMeter: ${getVal("inst-power")};\n;OBSERVAÇÕES: ${getVal("inst-obs")};`;
    copyTextToClipboard(texto);
}

function clearForms() {
    const forms = [document.getElementById('form-reparo'), document.getElementById('form-instalacao')];
    forms.forEach(form => {
        if (form) {
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.value = '';
            });
        }
    });
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica PWA (Service Worker e Instalação) ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('Service Worker registrado com sucesso:', registration))
            .catch(error => console.log('Falha ao registrar Service Worker:', error));
    }

    let deferredPrompt;
    const installBtn = document.getElementById('install-pwa-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'block';
    });

    installBtn.addEventListener('click', () => {
        installBtn.style.display = 'none';
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação');
                } else {
                    console.log('Usuário recusou a instalação');
                }
                deferredPrompt = null;
            });
        }
    });

    // --- Event Listeners dos Modais ---
    document.getElementById('modal-ok-btn').addEventListener('click', () => {
        hideSuccessModal();
        clearForms();
        goBack();
    });
    document.getElementById('error-modal-close-btn').addEventListener('click', hideErrorModal);

    // --- Navegação Principal ---
    document.getElementById('btn-iniciar').addEventListener('click', iniciarApp);
    document.getElementById('btn-select-reparo').addEventListener('click', () => showForm('reparo'));
    document.getElementById('btn-select-instalacao').addEventListener('click', () => showForm('instalacao'));
    document.querySelectorAll('.back-btn').forEach(button => button.addEventListener('click', goBack));

    // --- Botões de Copiar ---
    document.getElementById('btn-reparo-copiar').addEventListener('click', copiarTextoReparo);
    document.getElementById('btn-inst-copiar').addEventListener('click', copiarTextoInstalacao);
});
