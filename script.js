// Fade-in ao rolar a página

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }

    });

},{
    threshold:0.15
});

document.querySelectorAll(".reveal").forEach((el)=>{
    observer.observe(el);
});


// Navbar transparente ao topo

window.addEventListener("scroll", ()=>{

    const header = document.querySelector("header");

    if(window.scrollY > 50){
        header.classList.add("scrolled");
    }else{
        header.classList.remove("scrolled");
    }

});


// Efeito parallax leve

window.addEventListener("scroll", ()=>{

    const hero = document.querySelector(".hero");

    if(hero){
        hero.style.backgroundPositionY =
        window.scrollY * 0.3 + "px";
    }

});