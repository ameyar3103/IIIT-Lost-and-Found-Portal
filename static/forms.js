let email = document.querySelector(".hidden-email").value
console.log(email)
fetch("/get-user-data/"+email)
  .then(res => res.json())
  .then(data => {
    document.querySelector("#contacts").value = data['num']
  })
  .catch(err => console.error(err))