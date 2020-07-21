let allUsers = [];
let mutableAllUsers = [];
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let date = new Intl.DateTimeFormat('pt-br', options).format(new Date())
let input = document.getElementById('search');

window.addEventListener('load', () => {
  tabUsers = document.querySelector('#tabUsers');
  countUsers = document.querySelector('#totalUsers');
  textUsers = document.querySelector('#textCountUser');
  message = document.querySelector('#message');
  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();
  allUsers = json.results.map(user => {
    const { login, picture, name, dob, gender } = user;

    return {
      id: login.uuid,
      image: picture.thumbnail,
      name: name.first,
      lastName: name.last,
      age: dob.age,
      gender,
      fullName: `${name.first} ${name.last}`
    };
  });

  mutableAllUsers = allUsers;

  textUsers.textContent = `( ${allUsers.length} ) Usuários encontrados`;


  render_lists(allUsers);
  if (tabUsers.offsetHeight < 300)
    tabUsers.style.overflowY = "hidden";
};

let render_lists = function (allUsers) {

  let userHTML = '';
  let count = 1;
  let male = 0;
  let female = 0;
  let sumAge = 0;
  let totalUserFilt = 0;
  let media = 0;
  let percMale = 0;
  let percFemale = 0;

  for (index in allUsers) {
    const { id, image, fullName, age, gender } = allUsers[index];

    female += gender.startsWith('fem');
    male += gender.startsWith('mal');
    sumAge += age;
    totalUserFilt++;
    media = sumAge / totalUserFilt;
    percMale = male / allUsers.length * 100;
    percFemale = female / allUsers.length * 100;


    userHTML += `
      <a id="${id}" href="#">
        <div class='user'>
        <div class="counter">( ${count++} )</div>
          <div>
            <img src="${image}" alt="${name}">
          </div>
          <div>
            <ul>
              <li>${fullName},</li>
              
              <li>&nbsp${age} anos.</li>
            </ul>
          </div>
        </div>
      </a>
    `;
  }
  tabUsers.innerHTML = userHTML;

  document.querySelector('#percMale').textContent = parseFloat(percMale.toFixed(2));
  document.querySelector('#percFemale').textContent = parseFloat(percFemale.toFixed(2));
  document.querySelector('#date').textContent = date;
  document.querySelector('#male').textContent = male;
  document.querySelector('#female').textContent = female;
  document.querySelector('#sumAge').textContent = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 3 }).format(sumAge);
  document.querySelector('#media').textContent = parseFloat(media.toFixed(2));

}

render_lists(allUsers);

// Search Users
button = document.querySelector('#btnClear');
let filterUsers = function (event) {
  // Check keys and event button
  keyword = input.value.toLowerCase();
  if (keyword.length > 0) {
    button.disabled = false;

  } else {
    button.disabled = true;
  }


  filtered_users = allUsers.filter(function (user) {
    user = user.fullName.toLowerCase();
    return user.indexOf(keyword) > -1;
    // return user.name.toLowerCase().indexOf(keyword) > -1;
  });


  if (filtered_users.length < 1) {
    textUsers.textContent = `Nada por aqui  :(`;
  } else if (filtered_users.length > 1) {
    textUsers.textContent = `( ${filtered_users.length} ) Usuários encontrados`;
    message.textContent = '';
  } else {
    textUsers.textContent = `( ${filtered_users.length} ) Usuário encontrado`;
    message.textContent = '';
  }

  render_lists(filtered_users);

  if (tabUsers.offsetHeight < 507) {
    tabUsers.style.overflowY = "hidden";
  } else {
    tabUsers.style.overflowY = "scroll";
  }
}

let clickBtn = function (event) {
  input.value = "";

  textUsers.textContent = `Nada por aqui  :(`;
  tabUsers.textContent = '';

  document.querySelector('#percMale').textContent = 0;
  document.querySelector('#percFemale').textContent = 0;
  document.querySelector('#male').textContent = 0;
  document.querySelector('#female').textContent = 0;
  document.querySelector('#sumAge').textContent = 0;
  document.querySelector('#media').textContent = 0;
};

button.addEventListener('click', clickBtn);
input.addEventListener('keyup', filterUsers);