let currentClass = '';
let students = [];
let attendance = {};
let ftf = {};

const months = ['جنوری','فروری','مارچ','اپریل','مئی','جون','جولائی','اگست','ستمبر','اکتوبر','نومبر','دسمبر'];

// Load month dropdown
months.forEach((m,i)=>{
  let opt = document.createElement('option');
  opt.value = i; opt.textContent = m;
  monthSelect.appendChild(opt);
});
monthSelect.value = new Date().getMonth();
dateSelect.value = new Date().toISOString().split('T')[0];

classSelect.onchange = () => {
  currentClass = classSelect.value;
  className.textContent = currentClass;
  attIncharge.textContent = localStorage.getItem('incharge_'+currentClass) || 'نام لکھیں';
  inchargeName.innerText = localStorage.getItem('incharge_'+currentClass) || 'نام لکھیں';
  loadStudents();
}

function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.style.display='none');
  document.getElementById(id).style.display='block';
  if(id=='attendance') loadAttendanceTable();
  if(id=='goshwara') gTitle.textContent = `Attendance Goshwara - ${months[monthSelect.value]} | Incharge: ${inchargeName.innerText}`;
  if(id=='ftf') fTitle.textContent = `FTF Goshwara 20Rs - ${months[monthSelect.value]} | Incharge: ${inchargeName.innerText}`;
}

function loadStudents(){
  students = JSON.parse(localStorage.getItem('students_'+currentClass) || '[]');
  studentTable.innerHTML = '<tr><th>Roll</th><th>Reg No</th><th>Name</th><th>Father</th><th>Action</th></tr>';
  students.forEach((s,i)=>{
    if(s.active!== false){
      studentTable.innerHTML += `<tr>
        <td>${s.roll}</td><td>${s.reg}</td><td>${s.name}</td><td>${s.father}</td>
        <td><button onclick="struckOff(${i})">Struck Off</button></td>
      </tr>`;
    }
  });
}

function addStudent(){
  let roll = prompt('Roll No:');
  let reg = prompt('Reg No:');
  let name = prompt('Student Name:');
  let father = prompt('Father Name:');
  if(name){
    students.push({roll, reg, name, father, active:true});
    localStorage.setItem('students_'+currentClass, JSON.stringify(students));
    loadStudents();
  }
}

function struckOff(i){
  students[i].active = false;
  localStorage.setItem('students_'+currentClass, JSON.stringify(students));
  loadStudents();
}

function loadAttendanceTable(){
  attDate.textContent = dateSelect.value;
  attIncharge.textContent = inchargeName.innerText;
  let activeStudents = students.filter(s=>s.active!== false);
  attTable.innerHTML = '<tr><th>Roll</th><th>Name</th><th>P1</th><th>P2</th></tr>';
  activeStudents.forEach((s,i)=>{
    let key = currentClass+'_'+dateSelect.value+'_'+i;
    let d = attendance[key] || {p1:'P', p2:'P'};
    attTable.innerHTML += `<tr>
      <td>${s.roll}</td><td>${s.name}</td>
      <td><button class="p-btn ${d.p1=='P'?'present':'absent'}" onclick="toggleAtt(this,'p1','${
