let filterVal = document.querySelector("#dropdown");
let filterdiv = document.querySelector(".filter");
let items=document.querySelector('.rows').querySelectorAll('.grayout');
items.forEach(item=>{
  if(item.querySelector('.for-cat-filter').innerHTML.toLowerCase()==`category: sell`){
    item.querySelector('.if-sell').innerHTML += `<button class="buy" style="background-color:green;color: white; width:50px;height:50px;border-radius: 30px;margin:10px;" >BUY</button>`;
  }
});
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
      <select id="category-dropdown" style="font-size: 20px;" name="category">
        <option value="Lost">Lost</option>
        <option value="Found">Found</option>
        <option value="Sell">Sell</option>
        <option value="Buy">Buy</option>
      </select>
      <button class="apply" style="font-size:20px;margin-left:5px;background-color:black;color:white;border-color:black;box-shadow:none;outline:none;">Apply</button>
      <button class="reset" style="font-size:20px;margin-left:5px;background-color:black;color:white;border-color:black;box-shadow:none;outline:none;">Reset</button>
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
      <input id="type-input" class="type-box" type="text" style="font-size:20px;margin-right:5px;width:200px;" placeholder="Type...">
      <button class="apply" style="font-size:20px;margin-left:5px;background-color:black;color:white;border-color:black;box-shadow:none;outline:none;">Apply</button>
      <button class="reset" style="font-size:20px;margin-left:5px;background-color:black;color:white;border-color:black;box-shadow:none;outline:none;">Reset</button>
    `);
  }
  document.querySelector('.apply').addEventListener('mouseover',()=>{
    document.querySelector('.apply').style.borderColor="white";
  });
  document.querySelector('.reset').addEventListener('mouseover',()=>{
    document.querySelector('.reset').style.borderColor="white";
  });
  document.querySelector('.apply').addEventListener('mouseout',()=>{
    document.querySelector('.apply').style.borderColor="black";
  });
  document.querySelector('.reset').addEventListener('mouseout',()=>{
    document.querySelector('.reset').style.borderColor="black";
  });
  document.querySelector('.apply').addEventListener('click',()=>{
    let Items =document.querySelector('.rows').querySelectorAll('.grayout');
    let flag=0;
    if(filterdiv.querySelector('.type-box'))
    flag=1;
    Items.forEach(item=>{
        item.style.backgroundColor="black";
        item.style.opacity=1;
    });
    if(flag==1 && filterdiv.querySelector('.type-box').value==''){
        alert('Enter some value in the text box!');
    }
    Items.forEach(item=>{
        if(flag==0){
            if(item.querySelector('.for-cat-filter').innerHTML.toLowerCase()!=`category: ${document.querySelector('#category-dropdown').value.toLowerCase()}`){
            item.style.backgroundColor="gray";
            item.style.opacity=0.5;
            }
        }
        if(flag==1 && filterdiv.querySelector('.type-box').value!=null){
            if(item.querySelector('.for-type-filter').innerHTML.toLowerCase()!=`type of object: ${document.querySelector('.type-box').value.toLowerCase()}`){
                item.style.backgroundColor="gray";
                item.style.opacity=0.5;
            }
        }
    });
});
if(document.querySelector('.reset')){
    document.querySelector('.reset').addEventListener('click',()=>{
        let Items =document.querySelector('.rows').querySelectorAll('.grayout');
        Items.forEach(item=>{
            item.style.backgroundColor="black";
            item.style.opacity=1;
        });
    });
}
});
