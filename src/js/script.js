const FIRST_COUNT = 50;
const NEXT_COUNT = 10;

let users = [];
let loadedCount = 0;
let currentUser = null;
let sortField = "";
let sortDirection = "asc";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const filtersForm = document.getElementById("filters");

const teachersList = document.getElementById("teachers-list");
const teachersEmpty = document.getElementById("teachers-empty");
const favoritesList = document.getElementById("favorites-list");
const favoritesEmpty = document.getElementById("favorites-empty");

const tableHead = document.querySelector(".table thead");
const statsBody = document.getElementById("stats-body");
const statsCount = document.getElementById("stats-count");
const statusText = document.getElementById("status");
const nextBtn = document.getElementById("next-btn");

const popupAdd = document.getElementById("teach_add_popup");
const popupInfo = document.getElementById("popup-info");
const addForm = document.getElementById("add-form");
const formError = document.getElementById("form-error");

const infoPhoto = document.getElementById("info-photo");
const infoStar = document.querySelector(".info__star");

async function loadUsers(count) {
  nextBtn.disabled = true;
  statusText.textContent = "Loading...";

  try {
    const page = loadedCount / count + 1;
    const newUsers = await getUsersFromApi(count, page);

    for (let i = 0; i < newUsers.length; i++) {
      if (findUser(users, "id", newUsers[i].id) === null) {
        users.push(newUsers[i]);
      }
    }
    loadedCount = loadedCount + count;

    statusText.textContent = "";
    updateCountries();
    updatePage();
  } catch (error) {
    statusText.textContent = "Could not load users. Check your internet connection";
  }

  nextBtn.disabled = false;
}

function updateCountries() {
  const countries = getCountries(users);
  const filterValue = filtersForm.country.value;
  const addValue = addForm.country.value;

  filtersForm.country.innerHTML = '<option value="">All</option>';
  addForm.country.innerHTML = "";
  addOptions(filtersForm.country, countries);
  addOptions(addForm.country, countries);

  filtersForm.country.value = filterValue;
  if (addValue !== "") {
    addForm.country.value = addValue;
  }
  setPhoneHint();
}

function showValue(value) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  return value;
}

function getInitials(fullName) {
  const parts = fullName.split(" ");
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return first + "." + last;
}

function getAge(dateString) {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (hadBirthday === false) {
    age = age - 1;
  }
  return age;
}

function getCountries(list) {
  const result = [];
  for (let i = 0; i < list.length; i++) {
    const country = list[i].country;
    if (country && result.includes(country) === false) {
      result.push(country);
    }
  }
  return result.sort();
}

function addOptions(select, values) {
  for (let i = 0; i < values.length; i++) {
    const option = document.createElement("option");
    option.value = values[i];
    option.textContent = values[i];
    select.append(option);
  }
}

function createCard(user, withSubject) {
  const card = document.createElement("li");
  card.className = "teacher";
  card.dataset.id = user.id;

  if (user.favorite) {
    card.classList.add("star");
  }

  if (user.picture_large) {
    const img = document.createElement("img");
    img.src = user.picture_large;
    img.alt = user.full_name;
    card.append(img);
  } else {
    const initials = document.createElement("div");
    initials.className = "initials";
    initials.textContent = getInitials(user.full_name);
    card.append(initials);
  }

  const name = document.createElement("h3");
  name.textContent = user.full_name;
  card.append(name);

  if (withSubject) {
    const subject = document.createElement("p");
    subject.className = "subject";
    subject.textContent = showValue(user.course);
    card.append(subject);
  }

  const country = document.createElement("p");
  country.className = "country";
  country.textContent = showValue(user.country);
  card.append(country);

  return card;
}

function renderCards(list, container, withSubject) {
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < list.length; i++) {
    fragment.append(createCard(list[i], withSubject));
  }
  container.append(fragment);
}

function renderTable(list) {
  statsBody.innerHTML = "";

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < list.length; i++) {
    const user = list[i];
    const row = document.createElement("tr");

    const values = [user.full_name, user.course, user.age, user.gender, user.country];
    for (let j = 0; j < values.length; j++) {
      const cell = document.createElement("td");
      cell.textContent = showValue(values[j]);
      row.append(cell);
    }

    fragment.append(row);
  }
  statsBody.append(fragment);
}

function updateSortMarks() {
  const headers = document.querySelectorAll(".table th");
  for (let i = 0; i < headers.length; i++) {
    headers[i].removeAttribute("data-dir");
  }

  if (sortField !== "") {
    const th = document.querySelector('.table th[data-field="' + sortField + '"]');
    th.dataset.dir = sortDirection;
  }
}

function getVisibleUsers() {
  const country = filtersForm.country.value || undefined;
  const age = filtersForm.age.value || undefined;
  const gender = filtersForm.gender.value || undefined;
  const favorite = filtersForm.favorite.checked ? true : undefined;

  let result = filterUsers(users, country, age, gender, favorite);
  if (filtersForm.photo.checked) {
    result = result.filter(function (user) {
      return user.picture_large;
    });
  }
  return searchUsers(result, searchInput.value);
}

function updatePage() {
  const visible = getVisibleUsers();

  renderCards(visible, teachersList, true);
  teachersEmpty.hidden = visible.length > 0;

  statsCount.textContent = "Users: " + visible.length;

  if (sortField === "") {
    renderTable(visible);
  } else {
    renderTable(sortUsers(visible, sortField, sortDirection));
  }
  const favorites = filterUsers(users, undefined, undefined, undefined, true);
  renderCards(favorites, favoritesList, false);
  favoritesEmpty.hidden = favorites.length > 0;
}

function openInfo(user) {
  currentUser = user;

  document.getElementById("info-name").textContent = user.full_name;
  document.getElementById("info-subject").textContent = showValue(user.course);
  document.getElementById("info-place").textContent = [user.city, user.country].filter(Boolean).join(", ");
  document.getElementById("info-age").textContent = [user.age, user.gender].filter(Boolean).join(", ");

  const email = document.getElementById("info-email");
  email.textContent = user.email;
  email.href = "mailto:" + user.email;

  document.getElementById("info-phone").textContent = showValue(user.phone);

  if (user.picture_large) {
    infoPhoto.src = user.picture_large;
    infoPhoto.style.display = "block";
  } else {
    infoPhoto.style.display = "none";
  }

  infoStar.textContent = user.favorite ? "\u2605" : "\u2606";
  popupInfo.classList.add("open");
}

function showError(message) {
  formError.textContent = message;
}

function setPhoneHint() {
  const example = phoneExamples[addForm.country.value];
  addForm.phone.placeholder = example ? "Example: " + example : "";
}

async function addTeacher() {
  const fullName = addForm.full_name.value.trim();
  const city = addForm.city.value.trim();
  const state = addForm.state.value.trim();
  const email = addForm.email.value.trim();
  const phone = addForm.phone.value.trim();
  const bDate = addForm.b_date.value;
  const gender = addForm.gender.value;
  const note = addForm.note.value.trim();

  if (fullName === "" || city === "" || state === "" || email === "" || phone === "" || bDate === "" || gender === "") {
    showError("Please fill in all fields and choose sex");
    return;
  }

  const age = getAge(bDate);
  if (age < 0 || age > 120) {
    showError("Date of birth is not correct");
    return;
  }

  if (findUser(users, "full_name", fullName) !== null) {
    showError("Teacher with this name already exists");
    return;
  }

  const newUser = {
    id: "new-" + Date.now(),
    favorite: false,
    course: addForm.course.value,
    bg_color: addForm.bg_color.value,
    note: note === "" ? "No notes yet" : note,
    gender: gender,
    title: gender === "Male" ? "Mr" : "Ms",
    full_name: fullName,
    city: city,
    state: state,
    country: addForm.country.value,
    email: email,
    b_date: bDate,
    age: age,
    phone: phone,
    picture_large: null,
    picture_thumbnail: null,
  };

  if (validateUser(newUser) === false) {
    showError(
      "Name, state, city and notes must start with a capital letter, " +
        "email must contain @, phone must match the country format"
    );
    return;
  }

  users.unshift(newUser);
  addForm.reset();
  setPhoneHint();
  showError("");
  popupAdd.classList.remove("open");
  updatePage();

  try {
    await sendToServer(newUser);
    statusText.textContent = "Teacher saved to json-server";
  } catch (error) {
    statusText.textContent = "json-server is not running, teacher was not saved there";
  }
}

function onCardClick(event) {
  const card = event.target.closest(".teacher");
  if (card === null) {
    return;
  }

  const user = findUser(users, "id", card.dataset.id);
  if (user !== null) {
    openInfo(user);
  }
}
teachersList.addEventListener("click", onCardClick);
favoritesList.addEventListener("click", onCardClick);

infoStar.addEventListener("click", function () {
  currentUser.favorite = !currentUser.favorite;
  infoStar.textContent = currentUser.favorite ? "\u2605" : "\u2606";
  updatePage();
});

filtersForm.addEventListener("change", updatePage);
filtersForm.addEventListener("submit", function (event) {
  event.preventDefault();
});
searchInput.addEventListener("input", updatePage);
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  updatePage();
});

tableHead.addEventListener("click", function (event) {
  const th = event.target.closest("th");
  if (th === null || th.dataset.field === undefined) {
    return;
  }

  const field = th.dataset.field;
  if (sortField === field) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortField = field;
    sortDirection = "asc";
  }

  updateSortMarks();
  updatePage();
});

document.addEventListener("click", function (event) {
  if (event.target.closest(".open-add")) {
    showError("");
    popupAdd.classList.add("open");
  }
  const closeButton = event.target.closest(".close");
  if (closeButton) {
    closeButton.closest(".popup").classList.remove("open");
  }
  if (event.target.classList.contains("popup")) {
    event.target.classList.remove("open");
  }
});

addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTeacher();
});
addForm.country.addEventListener("change", setPhoneHint);

nextBtn.addEventListener("click", function () {
  loadUsers(NEXT_COUNT);
});

addOptions(addForm.course, courses);
loadUsers(FIRST_COUNT);
