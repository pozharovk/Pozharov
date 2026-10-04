var popupAdd = document.getElementById("popup-add");
var popupInfo = document.getElementById("popup-info");

var addButtons = document.querySelectorAll(".open-add");
for (var i = 0; i < addButtons.length; i++) {
  addButtons[i].onclick = function () {
    popupAdd.classList.add("open");
  };
}

var teachers = document.querySelectorAll("#teachers .teacher");
for (var j = 0; j < teachers.length; j++) {
  teachers[j].onclick = function () {
    var t = this.dataset;

    document.getElementById("info-name").textContent = t.name;
    document.getElementById("info-subject").textContent = t.subject;
    document.getElementById("info-place").textContent = t.place;
    document.getElementById("info-age").textContent = t.age;
    document.getElementById("info-email").textContent = t.email;
    document.getElementById("info-email").href = "mailto:" + t.email;
    document.getElementById("info-phone").textContent = t.phone;

    var photo = document.getElementById("info-photo");
    var cardImg = this.querySelector("img");
    if (cardImg) {
      photo.src = cardImg.src;
      photo.style.display = "block";
    } else {
      photo.style.display = "none";
    }

    popupInfo.classList.add("open");
  };
}

document.querySelector(".info__star").onclick = function () {
  if (this.textContent === "\u2606") {
    this.textContent = "\u2605";
  } else {
    this.textContent = "\u2606";
  }
};

var closeButtons = document.querySelectorAll(".close");
for (var k = 0; k < closeButtons.length; k++) {
  closeButtons[k].onclick = function () {
    this.closest(".popup").classList.remove("open");
  };
}

var popups = document.querySelectorAll(".popup");
for (var m = 0; m < popups.length; m++) {
  popups[m].onclick = function (e) {
    if (e.target === this) {
      this.classList.remove("open");
    }
  };
}
