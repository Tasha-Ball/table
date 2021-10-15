// шапка таблицы
const headers = [
    { title: "Название", field: "name" },
    { title: "Гравитация", field: "gravity" },
    { title: "Численность населения", field: "population" },
    { title: "Местность", field: "terrain" },
    { title: "Диаметр", field: "diameter" }
]
let ind = 1; // индекс для сортировки таблицы
let page = 1; // страница таблицы
const info = document.getElementById('info');
const noInfo = document.getElementById('no-info');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const preloader = document.getElementById('preloader');
const control = document.getElementById('control');

// рендеринг таблицы
function render(data) {
    document.getElementById('page').innerHTML = data[0].results.length*page + " из " + data[0].count
    sessionStorage.setItem('data', JSON.stringify(data))
    info.innerHTML = ""

    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    
    // шапка таблицы
    let tr = document.createElement('tr');
    headers.forEach((head) => {
        let th = document.createElement('th');
        th.onclick = () => ( sort(head.field, data));
        th.innerHTML = head.title;

        // роллер вертикальный (для ресайза)
        let rollerVertical = document.createElement('span');
        rollerVertical.classList.add('roller-vertical');
        th.appendChild(rollerVertical);

        tr.appendChild(th);
    })
    // роллер горизонтальный (для ресайза)
    let rollerHorizontal = document.createElement('span');
    rollerHorizontal.classList.add('roller-horizontal');
    tr.appendChild(rollerHorizontal);

    thead.appendChild(tr);

    // тело таблицы
    data[0].results.forEach((item) => {
        let tr = document.createElement('tr');
        headers.forEach((el) => {
            let td = document.createElement('td');
            td.innerHTML = item[el.field];

            // роллер вертикальный (для ресайза)
            let rollerVertical = document.createElement('span');
            rollerVertical.classList.add('roller-vertical');
            td.appendChild(rollerVertical);

            tr.appendChild(td);
        })
        // роллер горизонтальный (для ресайза)
        let rollerHorizontal = document.createElement('span');
        rollerHorizontal.classList.add('roller-horizontal');
        tr.appendChild(rollerHorizontal);

        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    
    noInfo.style.display = 'none';
    info.appendChild(table);
    control.style.display = 'flex';
    // resizeTable();
};

// запрос на сервер
async function getData(side) {
    preloader.classList.add('preloader')
    side ? page++ : page--

    let data = []
    await fetch(`https://swapi.dev/api/planets/?page=${page}`)
        .then((res) => res.json())
        .then(res => data = Array(res).map(object => ({ ...object })))
        .catch((err) => console.log(err))
        
    changePage(data);
    sessionStorage.setItem('page', page)
    preloader.classList.remove('preloader')
    data ? render(data) : false
};

// заполнить или очистить таблицу
function changeContent(flag) {
    if (flag) {
        noInfo.style.display = 'none';
        page = 2;
        getData();
    } else {
        noInfo.style.display = 'block';
        control.style.display = 'none';
        info.innerHTML = ''
        sessionStorage.clear()
    }
};

// сортировка таблицы
function sort(field, data) {
    ind = -ind
    data[0].results.sort((a,b) => {
        if (a[field] > b[field]) return ind;
        if (a[field] < b[field]) return -ind;
        return 0;
    });
    render(data);
}

// проверка на наличие следующей или предыдущей страницы
function changePage(data) {
    if (!data[0].next) {
        next.classList.remove('page')
        next.setAttribute('disabled', true)
    } else {
        next.classList.add('page')
        next.removeAttribute('disabled')
    }

    if (!data[0].previous) {
        prev.classList.remove('page')
        prev.setAttribute('disabled', true)
    } else {
        prev.classList.add('page')
        prev.removeAttribute('disabled')
    }
}

// механизм отображения данных при перезагрузке страницы
window.onload = function() {
    const data = JSON.parse(sessionStorage.getItem('data'));
    page = +sessionStorage.getItem('page')
    if (data) {
        changePage(data);
        render(data)
    }
}

