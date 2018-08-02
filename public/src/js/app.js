if('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('/sw.js')
    .then(function(){
        console.log("Service Worker Registered!");
    });
}
// fetch('http://httpbin.org/ip')
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(data){
//         console.log(data);
//     }).catch(function(err){
//         console.log(err);
//     });


// fetch('http://httpbin.org/post', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     },
//     mode: 'cors',
//     body: JSON.stringify({message: 'Does this Work?'})
// }).then(function(response){
//     return response.json();
// }).then(function(data){
//     console.log(data);
// })