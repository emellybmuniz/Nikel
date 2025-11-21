document.addEventListener("DOMContentLoaded", function () {
  const logout_Button = document.getElementById("logout-button");
  const transactionModal = new bootstrap.Modal(
    document.getElementById("transactionModal")
  );
  const transaction_Form = document.getElementById("transaction-form");
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
  }

  updateDashboard();

  if (logout_Button) {
    logout_Button.addEventListener("click", function () {
      localStorage.removeItem("session");
      sessionStorage.removeItem("logged");
      window.location.href = "index.html";
    });
  }

  transaction_Form.addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("transaction-value").value);
    const description = document.getElementById("transaction-description").value;
    const date = document.getElementById("transaction-date").value;
    const type = document.querySelector(
      'input[name="transaction-type"]:checked'
    ).value;

    data.transactions.unshift({
      value: value,
      type: type,
      description: description,
      date: date,
    });

    localStorage.setItem(logged, JSON.stringify(data));
    e.target.reset();
    transactionModal.hide();

    updateDashboard();

    alert("Transaction added successfully.");
  });

  function updateDashboard() {
    displayTransactions();
    getTotal();
  }

  function displayTransactions() {
    const transactions = data.transactions;
    const tbody = document.querySelector(".transactions-table tbody");

    tbody.innerHTML = "";

    const recentCashIn = transactions.filter((item) => item.type === "1").slice(0, 5);
    const recentCashOut = transactions.filter((item) => item.type === "2").slice(0, 5);

    const maxRows = Math.max(recentCashIn.length, recentCashOut.length);

    for (let i = 0; i < maxRows; i++) {
      const row = document.createElement("tr");

      const incomeCell = document.createElement("td");
      if (recentCashIn[i]) {
        const date = new Date(recentCashIn[i].date).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        });
        incomeCell.innerHTML = `
              <strong>R$ ${recentCashIn[i].value.toFixed(2)}</strong>
              <div class="d-flex justify-content-between">
                  <small>${recentCashIn[i].description}</small>
                  <small>${date}</small>
              </div>
          `;
      }
      row.appendChild(incomeCell);

      const outcomeCell = document.createElement("td");
      if (recentCashOut[i]) {
        const date = new Date(recentCashOut[i].date).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        });
        outcomeCell.innerHTML = `
              <strong>- R$ ${recentCashOut[i].value.toFixed(2)}</strong>
              <div class="d-flex justify-content-between">
                  <small>${recentCashOut[i].description}</small>
                  <small>${date}</small>
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
