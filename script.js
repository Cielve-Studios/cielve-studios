document.addEventListener("DOMContentLoaded", () => {

    // Página cargada
    document.body.classList.add("loaded");


    // Animación al aparecer elementos
    const elements = document.querySelectorAll(
        ".hero-content, .section-heading, .featured-content, .universe-content, .social-preview, .game-showcase, .project-card, .lore-text, .lore-elements article, .social-card"
    );

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }

            });

        },
        {
            threshold: 0.15
        }
    );


    elements.forEach((element) => {
        observer.observe(element);
    });

});
// Aparición progresiva y navegación del archivo de Ciel.
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".wiki-section");
    if (!sections.length || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-ready");
    const links = document.querySelectorAll('.wiki-nav a[href^="#"]');
    const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    sections.forEach(section => reveal.observe(section));
    let scheduled = false;
    const updateSection = () => {
        let current = sections[0];
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= window.innerHeight * .45) current = section;
        });
        links.forEach(link => {
            if (link.getAttribute("href") === "#" + current.id) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
        scheduled = false;
    };
    window.addEventListener("scroll", () => {
        if (!scheduled) { scheduled = true; requestAnimationFrame(updateSection); }
    }, { passive: true });
    updateSection();
});

// Ficha accesible y animaciones originales de Godot (4 fotogramas por dirección).
document.addEventListener("DOMContentLoaded", () => {
    const tabs = [...document.querySelectorAll('.character-tabs [role="tab"]')];
    if (!tabs.length) return;
    const sprite = document.getElementById("animated-ciel");
    const motion = document.getElementById("sprite-motion");
    const direction = document.getElementById("sprite-direction");
    const pause = document.getElementById("sprite-pause");
    const panel = document.getElementById("panel-sprites");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = reduced.matches;
    let frame = 0;
    let timer = null;
    const paint = () => {
        const size = sprite.clientWidth;
        sprite.style.backgroundPosition = `-${(Number(direction.value) * 4 + frame) * size}px 0px`;
    };
    const sync = () => {
        clearInterval(timer);
        timer = null;
        if (!panel.hidden && !paused && !document.hidden) {
            timer = setInterval(() => { frame = (frame + 1) % 4; paint(); }, 1000 / 8.5);
        }
        pause.textContent = paused ? "Reproducir" : "Pausar";
        pause.setAttribute("aria-pressed", String(paused));
        paint();
    };
    const activate = tab => {
        tabs.forEach(item => {
            const selected = item === tab;
            item.setAttribute("aria-selected", String(selected));
            item.tabIndex = selected ? 0 : -1;
            document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
        });
        sync();
    };
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activate(tab));
        tab.addEventListener("keydown", event => {
            let next;
            if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
            if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = tabs.length - 1;
            if (next !== undefined) { event.preventDefault(); tabs[next].focus(); activate(tabs[next]); }
        });
    });
    const update = () => {
        frame = 0;
        sprite.style.backgroundImage = `url("images/characters/ciel/${motion.value}.png")`;
        sprite.setAttribute("aria-label", `Ciel: ${motion.selectedOptions[0].text}, ${direction.selectedOptions[0].text}`);
        sync();
    };
    motion.addEventListener("change", update);
    direction.addEventListener("change", update);
    pause.addEventListener("click", () => { paused = !paused; sync(); });
    reduced.addEventListener("change", event => { paused = event.matches; sync(); });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", paint);
    update();
});
