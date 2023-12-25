let filterVal = document.querySelector("#dropdown");
let filterdiv = document.querySelector(".filter");
filterVal.value = null;
let filterCheck=0;
let string=``;
filterVal.addEventListener('change', () => {
  if (filterVal.value === 'cat') {
    if(filterdiv.querySelector('.type-box')){
    filterdiv.querySelector('.type-box').remove();
    filterdiv.querySelector('.label-class').remove();
    filterdiv.querySelector('.apply').remove();
    filterdiv.querySelector('.reset').remove();
    }
    filterdiv.insertAdjacentHTML('beforeend', `
      <label for="category-dropdown"class="label-class">Select a category: </label>
      <select id="category-dropdown" style="" name="category">
        <optgroup>
        <option value="Lost">Lost</option>
        <option value="Found">Found</option>
        <option value="Sell">Sell</option>
        <option value="Borrow">Borrow</option>
        </optgroup>
        </select>
      <button class="apply" style="margin-left:5px;">Apply</button>
      <button class="reset" style="margin-left:5px;">Reset</button>
    `);
  } else if (filterVal.value === 'type') {
    if(filterdiv.querySelector('#category-dropdown')){
    filterdiv.querySelector('.label-class').remove();
    filterdiv.querySelector('#category-dropdown').remove();
    filterdiv.querySelector('.apply').remove();
    filterdiv.querySelector('.reset').remove();
    }
    filterdiv.insertAdjacentHTML('beforeend', `
      <label for="type-input"class="label-class">Enter the type of object:</label>
      <input id="type-input" class="type-box" type="text" style=margin-right:5px;width:200px;" placeholder="Type...">
      <button class="apply" style="margin-left:5px;">Apply</button>
      <button class="reset" style="margin-left:5px;">Reset</button>
    `);
  }
  document.querySelector('.apply').addEventListener('click',()=>{
    let Items =document.querySelectorAll('.post');
    let flag=0;
    if(filterdiv.querySelector('.type-box'))
      flag=1;
    Items.forEach(item=>{
        item.style.filter="grayscale(0)";
        item.style.opacity=1;
    });
    if(flag==1 && filterdiv.querySelector('.type-box').value==''){
        alert('Enter some value in the text box!');
    }
    Items.forEach(item=>{
        if(flag==0){
            if(item.querySelector('.post-type').innerText.toLowerCase() != document.querySelector('#category-dropdown').value.toLowerCase()){
              item.style.filter="grayscale(100%)";
              item.style.opacity=0.5;
            }
        }
        if(flag==1 && filterdiv.querySelector('.type-box').value != null){
            if(item.querySelector('.post-category').innerHTML.toLowerCase() != document.querySelector('.type-box').value.toLowerCase()){
                item.style.backgroundColor="grayscale(100%)";
                item.style.opacity=0.5;
            }
        }
    });
});
if(document.querySelector('.reset')){
    document.querySelector('.reset').addEventListener('click',()=>{
        let Items =document.querySelectorAll('.post');
        Items.forEach(item=>{
            item.style.filter="grayscale(0)";
            item.style.opacity=1;
        });
    });
}
});



document.querySelector(".notif-bg").style.display = 'none'
Array.from(document.querySelectorAll(".post-status")).forEach(el => {
  el.addEventListener("click", function(){
  let email = el.parentNode.querySelector(".hidden").innerText
  // console.log(email)
  fetch("/get-user-data/"+email)
  .then(res => res.json())
  .then(data => {
    document.querySelector(".contact-name").innerHTML = `<b>Name:</b> ${data['name']}`
    document.querySelector(".contact-num").innerHTML = `&phone;: ${data['num']}`
    document.querySelector(".contact-batch").innerHTML = `<b>Batch</b>: ${data['batch'].toUpperCase()}`
    document.querySelector(".contact-mail").innerHTML = `<b>Mail:</b> ${data['email']}`

    document.querySelector(".notif-bg").style.display = 'flex'
  })
  .catch(err => console.error(err))
  })
})

document.querySelector(".contact-close").addEventListener('click', function(){
  document.querySelector(".notif-bg").style.display = 'none'
})
