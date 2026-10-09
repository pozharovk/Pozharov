import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";

const courses = [
  "Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess",
  "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics",
];

// "male" -> "Male"
function capitalize(text) {
  if (typeof text !== "string" || text === "") {
    return text;S
  }
  return text[0].toUpperCase() + text.slice(1);
}

// № 1

function getRandomCourse() {
  let index = Math.floor(Math.random() * courses.length);
  return courses[index];
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function formatRandomUser(user) {
  return {
    id: user.login.uuid,
    favorite: false,
    course: getRandomCourse(),
    bg_color: getRandomColor(),
    note: "No notes yet",
    gender: capitalize(user.gender),
    title: user.name.title,
    full_name: user.name.first + " " + user.name.last,
    city: user.location.city,
    state: user.location.state,
    country: user.location.country,
    postcode: user.location.postcode,
    coordinates: user.location.coordinates,
    timezone: user.location.timezone,
    email: user.email,
    b_date: user.dob.date,
    age: user.dob.age,
    phone: user.phone,
    picture_large: user.picture.large,
    picture_thumbnail: user.picture.thumbnail,
  };
}

function formatAdditionalUser(user) {
  let newUser = {
    id: user.id,
    favorite: user.favorite,
    course: user.course,
    bg_color: user.bg_color,
    note: user.note,
    gender: capitalize(user.gender),
    title: user.title,
    full_name: user.full_name,
    city: user.city,
    state: user.state,
    country: user.country,
    postcode: user.postcode,
    coordinates: user.coordinates,
    timezone: user.timezone,
    email: user.email,
    b_date: user.b_day,
    phone: user.phone,
    picture_large: user.picture_large,
    picture_thumbnail: user.picture_thumbnail,
  };

  if (user.b_day) {
    newUser.age = new Date().getFullYear() - new Date(user.b_day).getFullYear();
  }
  if (newUser.favorite === null) {
    newUser.favorite = false;
  }
  if (newUser.bg_color === null) {
    newUser.bg_color = getRandomColor();
  }
  if (newUser.course === null) {
    newUser.course = getRandomCourse();
  }
  if (newUser.note === null) {
    newUser.note = "No notes yet";
  }
  newUser.course = capitalize(newUser.course);
  newUser.note = capitalize(newUser.note);
  return newUser;
}

function getFormattedUsers() {
  let result = [];

  for (let i = 0; i < randomUserMock.length; i++) {
    result.push(formatRandomUser(randomUserMock[i]));
  }

  for (let i = 0; i < additionalUsers.length; i++) {
    let user = formatAdditionalUser(additionalUsers[i]);
    let found = false;
    for (let j = 0; j < result.length; j++) {
      if (result[j].full_name === user.full_name) {
        found = true;
      }
    }
    if (found === false) {
      result.push(user);
    }
  }

  return result;
}

// № 2

const phoneFormats = {
  "Germany": /^\d{4}-\d{7}$/,
  "Ireland": /^\d{3}-\d{3}-\d{4}$/,
  "Australia": /^\d{2}-\d{4}-\d{4}$/,
  "United States": /^\(\d{3}\)-\d{3}-\d{4}$/,
  "Finland": /^\d{2}-\d{3}-\d{3}$/,
  "Turkey": /^\(\d{3}\)-\d{3}-\d{4}$/,
  "Switzerland": /^\d{3} \d{3} \d{2} \d{2}$/,
  "New Zealand": /^\(\d{3}\)-\d{3}-\d{4}$/,
  "Spain": /^\d{3}-\d{3}-\d{3}$/,
  "Norway": /^\d{8}$/,
  "Denmark": /^\d{8}$/,
  "Iran": /^\d{3}-\d{8}$/,
  "Canada": /^\d{3}-\d{3}-\d{4}$/,
  "France": /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/,
  "Netherlands": /^\(\d{3}\)-\d{3}-\d{4}$/,
};

function isCapital(text) {
  return typeof text === "string" && text !== "" && text[0] === text[0].toUpperCase();
}

function validateUser(user) {
  let fields = ["full_name", "gender", "note", "state", "city", "country"];
  for (let i = 0; i < fields.length; i++) {
    if (isCapital(user[fields[i]]) === false) {
      return false;
    }
  }

  if (typeof user.age !== "number") {
    return false;
  }

  let format = phoneFormats[user.country];
  if (format === undefined || format.test(user.phone) === false) {
    return false;
  }

  if (typeof user.email !== "string" || user.email.includes("@") === false) {
    return false;
  }

  return true;
}

// № 3

function filterUsers(users, country, age, gender, favorite) {
  let result = [];
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (country !== undefined && user.country !== country) continue;
    if (age !== undefined && user.age !== age) continue;
    if (gender !== undefined && user.gender !== gender) continue;
    if (favorite !== undefined && user.favorite !== favorite) continue;
    result.push(user);
  }
  return result;
}

// № 4

function sortUsers(users, field, direction) {
  let sorted = users.slice();

  sorted.sort(function (a, b) {
    let result;
    if (field === "age") {
      result = (a.age || 0) - (b.age || 0);
    } else {
      result = String(a[field]).localeCompare(String(b[field]));
    }
    if (direction === "desc") {
      result = -result;
    }
    return result;
  });

  return sorted;
}

// № 5

function findUser(users, field, value) {
  for (let i = 0; i < users.length; i++) {
    if (users[i][field] === value) {
      return users[i];
    }
  }
  return null;
}

// № 6

function getPercent(users, field, sign, value) {
  if (users.length === 0) {
    return 0;
  }

  let count = 0;

  for (let i = 0; i < users.length; i++) {
    let current = users[i][field];
    if (sign === ">" && current > value) count++;
    if (sign === "<" && current < value) count++;
    if (sign === "=" && current === value) count++;
  }

  return (count / users.length) * 100;
}





const users = getFormattedUsers();
console.log("1. Користувачів після об'єднання:", users.length);
console.log(users[0]);

const validUsers = [];
for (let i = 0; i < users.length; i++) {
  if (validateUser(users[i])) {
    validUsers.push(users[i]);
  }
}
console.log("2. Валідних:", validUsers.length);

console.log("3. Germany + Male:", filterUsers(users, "Germany", undefined, "Male", undefined));

const sorted = sortUsers(users, "age", "desc");
console.log("4. Найстарший:", sorted[0].full_name, sorted[0].age);

console.log("5. Пошук:", findUser(users, "full_name", "Norbert Weishaupt"));

console.log("6. Відсоток старших за 30:", getPercent(users, "age", ">", 30) + "%");
