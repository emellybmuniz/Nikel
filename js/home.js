document.addEventListener("DOMContentLoaded", function () {
  const logout_Button = document.getElementById("logout-button");
  const entriesTable_tbody = document.getElementById("entries-table-body");
  const transactionModal = new bootstrap.Modal(
    document.getElementById("transactionModal")
  );
  const transaction_Form = document.getElementById("transaction-form");
  const transactionId_input = document.getElementById("transaction-id");
  const balance_span = document.getElementById("total-balance");

  let logged = sessionStorage.getItem("logged");
  const session = localStorage.getItem("session");

  if (!session && !logged) {
    window.location.href = "index.html";
  }

  let data = {
    transactions: [],
  };

  const dataUser = localStorage.getItem(logged);

  if (dataUser) {
    data = JSON.parse(dataUser);
    let needsUpdate = false;
    data.transactions.forEach((transaction, index) => {
      if (typeof transaction.id === "undefined") {
        transaction.id = new Date().getTime() + index;
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      localStorage.setItem(logged, JSON.stringify(data));
    }
  }

  updateDashboard();

  if (logout_Button) {
    logout_Button.addEventListener("click", function () {
      localStorage.removeItem("session");
      sessionStorage.removeItem("logged");
      window.location.href = "index.html";
    });
  }

  const deleteAccount_Button = document.getElementById("delete-account-btn");
  if (deleteAccount_Button) {
    deleteAccount_Button.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        localStorage.removeItem(logged);
        localStorage.removeItem("session");
        sessionStorage.removeItem("logged");
        window.location.href = "index.html";
      }
    });
  }

  document
    .getElementById("transactionModal")
    .addEventListener("hidden.bs.modal", function (event) {
      transaction_Form.reset();
      transactionId_input.value = "";
      document.getElementById("transactionModalLabel").textContent =
        "Add Transaction";
      document.getElementById("add-transaction-btn").textContent = "Add";
    });

  entriesTable_tbody.addEventListener("click", function (e) {
    const button = e.target.closest("button");
    if (!button) return;

    const id = button.dataset.id;
    if (button.classList.contains("btn-delete")) {
      if (confirm("Are you sure you want to delete this transaction?")) {
        deleteTransaction(id);
      }
    } else if (button.classList.contains("btn-edit")) {
      editTransaction(id);
    }
  });

  transaction_Form.addEventListener("submit", function (e) {
    e.preventDefault();

    const transactionId = transactionId_input.value;
    const value = parseFloat(
      document.getElementById("transaction-value").value
    );
    const description = document.getElementById(
      "transaction-description"
    ).value;
    const date = document.getElementById("transaction-date").value;
    const type = document.querySelector(
      'input[name="transaction-type"]:checked'
    ).value;

    if (transactionId) {
      const transactionIndex = data.transactions.findIndex(
        (t) => t.id == transactionId
      );
      if (transactionIndex !== -1) {
        data.transactions[transactionIndex].value = value;
        data.transactions[transactionIndex].type = type;
        data.transactions[transactionIndex].description = description;
        data.transactions[transactionIndex].date = date;
        alert("Transaction updated successfully.");
      }
    } else {
      data.transactions.unshift({
        id: new Date().getTime(),
        value: value,
        type: type,
        description: description,
        date: date,
      });
      alert("Transaction added successfully.");
    }

    localStorage.setItem(logged, JSON.stringify(data));
    transaction_Form.reset();
    transactionModal.hide();

    updateDashboard();
  });

  function saveAndRefresh() {
    localStorage.setItem(logged, JSON.stringify(data));
    updateDashboard();
  }

  function deleteTransaction(id) {
    data.transactions = data.transactions.filter((t) => t.id != id);
    saveAndRefresh();
  }

  function editTransaction(id) {
    const transaction = data.transactions.find((t) => t.id == id);
    if (!transaction) return;

    transactionId_input.value = transaction.id;
    document.getElementById("transaction-value").value = transaction.value;
    document.getElementById("transaction-description").value =
      transaction.description;
    document.getElementById("transaction-date").value = transaction.date;
    document.querySelector(
      `input[name="transaction-type"][value="${transaction.type}"]`
    ).checked = true;

    document.getElementById("transactionModalLabel").textContent =
      "Editar Lançamento";
    document.getElementById("add-transaction-btn").textContent = "Salvar";

    transactionModal.show();
  }

  function updateDashboard() {
    displayTransactions();
    getTotal();
  }

  function displayTransactions() {
    const transactions = data.transactions;
    const tbody = document.querySelector(".transactions-table tbody");

    tbody.innerHTML = "";

    const recentCashIn = transactions
      .filter((item) => item.type === "1")
      .slice(0, 5);
    const recentCashOut = transactions
      .filter((item) => item.type === "2")
      .slice(0, 5);

    const maxRows = Math.max(recentCashIn.length, recentCashOut.length);

    for (let i = 0; i < maxRows; i++) {
      const row = document.createElement("tr");

      const incomeCell = document.createElement("td");
      if (recentCashIn[i]) {
        const date = new Date(recentCashIn[i].date).toLocaleDateString(
          "pt-BR",
          {
            timeZone: "UTC",
          }
        );
        incomeCell.innerHTML = `
              <strong>$ ${recentCashIn[i].value.toFixed(2)}</strong>
              <div class="d-flex justify-content-between">
                  <small>${recentCashIn[i].description}</small>
                  <small>${date}</small>
              </div>
              <div class="text-end mt-1">
                  <button class="btn btn-sm btn-outline-warning btn-edit" data-id="${
                    recentCashIn[i].id
                  }"><i class="bi bi-pencil-square"></i></button>
                  <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${
                    recentCashIn[i].id
                  }"><i class="bi bi-trash"></i></button>
              </div>
          `;
      }
      row.appendChild(incomeCell);

      const outcomeCell = document.createElement("td");
      if (recentCashOut[i]) {
        const date = new Date(recentCashOut[i].date).toLocaleDateString(
          "pt-BR",
          {
            timeZone: "UTC",
          }
        );
        outcomeCell.innerHTML = `
              <strong>- $ ${recentCashOut[i].value.toFixed(2)}</strong>
              <div class="d-flex justify-content-between">
                  <small>${recentCashOut[i].description}</small>
                  <small>${date}</small>
              </div>
              <div class="text-end mt-1">
                  <button class="btn btn-sm btn-outline-warning btn-edit" data-id="${
                    recentCashOut[i].id
                  }"><i class="bi bi-pencil-square"></i></button>
                  <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${
                    recentCashOut[i].id
                  }"><i class="bi bi-trash"></i></button>
              </div>
          `;
      }
      row.appendChild(outcomeCell);

      tbody.appendChild(row);
    }
  }

  function getCashIn() {
    const transactions = data.transactions;
    const cashIn = transactions.filter((item) => item.type === "1");
    return cashIn;
  }

  function getCashOut() {
    const transactions = data.transactions;
    const cashOut = transactions.filter((item) => item.type === "2");
    return cashOut;
  }

  function getTotal() {
    const cashIn = getCashIn().reduce((acc, item) => acc + item.value, 0);
    const cashOut = getCashOut().reduce((acc, item) => acc + item.value, 0);
    const total = cashIn - cashOut;
    balance_span.innerHTML = total.toFixed(2);
  }
});
