const courses = [
  "Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess",
  "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics",
];

function capitalize(text) {
  if (typeof text !== "string" || text === "") {
    return text;
  }
  return text[0].toUpperCase() + text.slice(1);
}

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

const phoneExamples = {
  "Germany": "0079-8291509",
  "Ireland": "021-123-4567",
  "Australia": "08-1234-5678",
  "United States": "(555)-123-4567",
  "Finland": "02-123-456",
  "Turkey": "(555)-123-4567",
  "Switzerland": "079 123 45 67",
  "New Zealand": "(555)-123-4567",
  "Spain": "912-345-678",
  "Norway": "12345678",
  "Denmark": "12345678",
  "Iran": "021-12345678",
  "Canada": "613-123-4567",
  "France": "01-23-45-67-89",
  "Netherlands": "(010)-123-4567",
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


function ageMatches(userAge, age) {
  if (typeof age === "string") {
    let parts = age.split("-");
    return userAge >= Number(parts[0]) && userAge <= Number(parts[1]);
  }
  return userAge === age;
}

function filterUsers(users, country, age, gender, favorite) {
  let result = [];
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (country !== undefined && user.country !== country) continue;
    if (age !== undefined && ageMatches(user.age, age) === false) continue;
    if (gender !== undefined && user.gender !== gender) continue;
    if (favorite !== undefined && user.favorite !== favorite) continue;
    result.push(user);
  }
  return result;
}


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


function findUser(users, field, value) {
  for (let i = 0; i < users.length; i++) {
    if (users[i][field] === value) {
      return users[i];
    }
  }
  return null;
}

function searchUsers(users, text) {
  text = text.trim().toLowerCase();
  if (text === "") {
    return users;
  }

  let result = [];
  for (let i = 0; i < users.length; i++) {
    let name = String(users[i].full_name).toLowerCase();
    let note = String(users[i].note).toLowerCase();
    if (name.includes(text) || note.includes(text) || String(users[i].age) === text) {
      result.push(users[i]);
    }
  }
  return result;
}


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
