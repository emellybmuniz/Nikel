document.addEventListener("DOMContentLoaded", function () {
  const logout_Button = document.getElementById("logout-button");

  const logged = sessionStorage.getItem("logged");
  const session = localStorage.getItem("session");

  if (!session && !logged) {
    window.location.href = "index.html";
    return;
  }

  const dataUser = localStorage.getItem(logged);

  if (dataUser) {
    data = JSON.parse(dataUser);
  }

  if (logout_Button) {
    logout_Button.addEventListener("click", function () {
      localStorage.removeItem("session");
      sessionStorage.removeItem("logged");
      window.location.href = "index.html";
    });
  }

  displayAllTransactions();

  function displayAllTransactions() {
    const transactions = data.transactions;
    const tbody = document.querySelector(".transactions-table tbody");

    tbody.innerHTML = "";

    if (transactions.length) {
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      transactions.forEach((item) => {
        const row = document.createElement("tr");
        const type = item.type === "1" ? "Income" : "Outcome";
        const value = item.value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        const date = new Date(item.date).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        });

        row.innerHTML = `
            <td>${date}</td>
            <td>${value}</td>
            <td>${type}</td>
            <td>${item.description}</td>
        `;

        tbody.appendChild(row);
      });
    }
  }
});
