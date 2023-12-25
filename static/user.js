document.querySelector(".notif-bg").style.display = "none"
document.querySelector(".delete-btn").addEventListener("click", deletePost)

Array.from(document.querySelectorAll('.post-status')).forEach(el => {
    el.addEventListener('click', function(){
        document.querySelector(".notif-bg").style.display = "flex"
        let id = el.parentNode.id.replace("post-", "")
        document.querySelector('.delete-btn').id = "delete-"+id
        document.querySelector(".cancel-btn").addEventListener("click", function(){
            document.querySelector(".notif-bg").style.display = "none"
        })
    })
})

function deletePost(){
    let id = document.querySelector(".delete-btn").id.replace("delete-", "")
    console.log(id)
    fetch("/delete-post/", {
        method: 'POST',
        body: JSON.stringify({id: id}),
        headers: {
            "Content-type": 'application/json; charset=UTF-8'
        }
    })
    .then(res => {
        window.location.href = "/dashboard";
    })
}