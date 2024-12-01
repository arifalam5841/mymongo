// const { default: axios } = require("axios");
// const { response } = require("express");

const submitbtn = document.getElementById("submit-btn");

const messagebox = document.getElementById("message");

submitbtn.addEventListener("click", () => {
  const nameinput = document.getElementById("name").value;
  const priceinput = document.getElementById("price").value;
  const qtyinput = document.getElementById("qty").value;
  console.log("working");
  axios
    .post("https://backend-mymongo.onrender.com/adding-product", {
      names: nameinput,
      prices: priceinput,
      qtys: qtyinput,
    })
    .then((response) => {
      if (response.data.status == true) {
        messagebox.textContent = response.data.message;
        messagebox.style.color = "green";
      } else {
        messagebox.textContent = response.data.message;
        messagebox.style.color = "red";
      }
    });
});
