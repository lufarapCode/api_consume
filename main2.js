
const api_cat = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/'
  });

api_cat.defaults.headers.common['X-API-KEY'] = 'live_RiSDWYZmtyMakLohHef7qUrypESZIoLpJdQTznswaiLXGRicIClPkSkOBjvNrISb';

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_RiSDWYZmtyMakLohHef7qUrypESZIoLpJdQTznswaiLXGRicIClPkSkOBjvNrISb';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites?api_key=live_RiSDWYZmtyMakLohHef7qUrypESZIoLpJdQTznswaiLXGRicIClPkSkOBjvNrISb'; 
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`; 
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'; 

const spanError = document.getElementById('error');

// fetch(API_URL)
//     .then(res => res.json())
//     .then(data => {
//         const img = document.querySelector('img');
//         img.src = data[0].url;
//     });

// const reloadButton = document.getElementById('reloadButton');

// reloadButton.addEventListener('click', function(){
//     location.reload();
// });

// HTTP status codes

// 1XX Respuestas Afirmativas

// 2XX Respuestas satisfactorias

// 3XX Re-direcciones

// 4XX Error del cliente

// 5XX Error de servidor

async function loadRandomMichis(){
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();


    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    } else {
        console.log(data)
        const img = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');

        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');

        img.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavouriteMichi(data[0].id);
        btn2.onclick = () => saveFavouriteMichi(data[1].id);
    }

}

async function loadFavoritesMichis(){
    // const res = await fetch(API_URL_FAVORITES);
    // const data = await res.json();
    const response = await fetch(
        'https://api.thecatapi.com/v1/favourites',{
            headers:{
                "content-type":"application/json",
                'x-api-key': 'live_RiSDWYZmtyMakLohHef7qUrypESZIoLpJdQTznswaiLXGRicIClPkSkOBjvNrISb'
            }
        });
    
    const data = await response.json();


    if (response.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + response.status;
    } else {

        const section = document.getElementById('favoriteMichis')
        section.innerHTML = "";

        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Michis favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);
        
        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Sacar al michi de favoritos');


            btn.appendChild(btnText);
            btn.onclick = () => deleteFavoriteMichis(michi.id);
            img.width = 250;
            img.src = michi.image.url;
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
        });
        
    }
}

async function saveFavouriteMichi(id) {

    const {data, status} = await api_cat.post('/favourites',{
        image_id: id
    });

    // const res = await fetch(API_URL_FAVORITES, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    
    //   },
    //   body: JSON.stringify({
    //     image_id: id
    //   }),
    // });
    
    if (status !== 200) {
        spanError.innerHTML = "Hubo un error: " + status;
    } else {
        console.log("Michi guradado")
        console.log(data)
        loadFavoritesMichis();
    }
}

async function deleteFavoriteMichis(id){
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers:{
            "content-type":"application/json",
            'X-API-KEY': 'live_RiSDWYZmtyMakLohHef7qUrypESZIoLpJdQTznswaiLXGRicIClPkSkOBjvNrISb'
        }
      });
      
  
      if (res.status !== 200) {
          spanError.innerHTML = "Hubo un error: " + res.status;
      } else {
        const data = await res.json();
        console.log("Michi eliminado");
        console.log(data);
        loadFavoritesMichis();
          
      }
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    console.log(formData.get('file'))

    const res = await fetch(API_URL_UPLOAD,{
        method : 'POST',
        headers: {
            // 'Content-Type': 'multipart/formdata',
            'X-API-KEY': 'live_RiSDWYZmtyMakLohHef7qUrypESZIoLpJdQTznswaiLXGRicIClPkSkOBjvNrISb'
        },
        body : formData,
    });


    const data = await res.json();
    console.log(data.url)
    console.log(data.status)
    //saveFavouriteMichi(data.id);




    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status;
        console.log({data})

    } else {

        console.log({data})

        console.log("Michi agregado")
        console.log(data)
        console.log(data.url)
        saveFavouriteMichi(data.id);
        // loadFavoritesMichis();
    }
}

loadRandomMichis();
loadFavoritesMichis();