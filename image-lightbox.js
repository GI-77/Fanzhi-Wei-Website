document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       Create Lightbox
    ========================= */

    const lightbox = document.createElement("div");

    lightbox.className = "image-lightbox";

    lightbox.innerHTML = `
        <img class="lightbox-image" src="" alt="">
    `;

    document.body.appendChild(lightbox);

    const lightboxImage =
        lightbox.querySelector(".lightbox-image");


    /* =========================
       Settings
    ========================= */

    const OPEN_SCALE = 1.0;
    const MIN_SCALE = 1.0;
    const MAX_SCALE = 4.0;

    let scale = OPEN_SCALE;

    let x = 0;
    let y = 0;

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startImageX = 0;
    let startImageY = 0;

    let lastTap = 0;

    let touchMode = null;

    let startDistance = 0;
    let startScale = 1;


    /* =========================
       Update Image
    ========================= */

    function updateImage() {

        lightboxImage.style.transform =
            "translate(" +
            x +
            "px, " +
            y +
            "px) scale(" +
            scale +
            ")";

    }


    /* =========================
       Open
    ========================= */

    function openLightbox(image) {

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || "";

        scale = OPEN_SCALE;

        x = 0;
        y = 0;

        updateImage();

        lightbox.classList.add("active");

        document.body.classList.add(
            "lightbox-open"
        );

    }


    /* =========================
       Close
    ========================= */

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.classList.remove(
            "lightbox-open"
        );

        lightboxImage.src = "";

        scale = OPEN_SCALE;

        x = 0;
        y = 0;

        dragging = false;

    }


    /* =========================
       Desktop Double Click
    ========================= */

    document.addEventListener(
        "dblclick",
        function (event) {

            const image =
                event.target.closest(
                    ".project-image img"
                );

            if (!image) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            openLightbox(image);

        }
    );


    /* =========================
       Desktop Wheel Zoom
    ========================= */

    lightbox.addEventListener(
        "wheel",
        function (event) {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {
                return;
            }

            event.preventDefault();

            if (event.deltaY < 0) {
                scale += 0.15;
            } else {
                scale -= 0.15;
            }

            scale = Math.max(
                MIN_SCALE,
                Math.min(
                    MAX_SCALE,
                    scale
                )
            );

            updateImage();

        },
        {
            passive: false
        }
    );


    /* =========================
       Desktop Drag Start
    ========================= */

    lightboxImage.addEventListener(
        "mousedown",
        function (event) {

            event.preventDefault();

            dragging = true;

            startX = event.clientX;
            startY = event.clientY;

            startImageX = x;
            startImageY = y;

            lightboxImage.classList.add(
                "dragging"
            );

        }
    );


    /* =========================
       Desktop Drag
    ========================= */

    document.addEventListener(
        "mousemove",
        function (event) {

            if (!dragging) {
                return;
            }

            event.preventDefault();

            x =
                startImageX +
                (event.clientX - startX);

            y =
                startImageY +
                (event.clientY - startY);

            updateImage();

        }
    );


    /* =========================
       Desktop Drag End
    ========================= */

    document.addEventListener(
        "mouseup",
        function () {

            dragging = false;

            lightboxImage.classList.remove(
                "dragging"
            );

        }
    );


    /* =========================
       Mobile Touch
    ========================= */

    lightboxImage.addEventListener(
        "touchstart",
        function (event) {

            event.preventDefault();

            if (event.touches.length === 1) {

                touchMode = "drag";

                startX =
                    event.touches[0].clientX;

                startY =
                    event.touches[0].clientY;

                startImageX = x;
                startImageY = y;

            }

            if (event.touches.length === 2) {

                touchMode = "pinch";

                startDistance =
                    getDistance(
                        event.touches[0],
                        event.touches[1]
                    );

                startScale = scale;

            }

        },
        {
            passive: false
        }
    );


    /* =========================
       Mobile Touch Move
    ========================= */

    lightboxImage.addEventListener(
        "touchmove",
        function (event) {

            event.preventDefault();

            if (event.touches.length === 1) {

                if (touchMode !== "drag") {
                    return;
                }

                x =
                    startImageX +
                    (
                        event.touches[0].clientX -
                        startX
                    );

                y =
                    startImageY +
                    (
                        event.touches[0].clientY -
                        startY
                    );

                updateImage();

            }


            if (event.touches.length === 2) {

                touchMode = "pinch";

                const distance =
                    getDistance(
                        event.touches[0],
                        event.touches[1]
                    );

                scale =
                    startScale *
                    (distance / startDistance);

                scale = Math.max(
                    MIN_SCALE,
                    Math.min(
                        MAX_SCALE,
                        scale
                    )
                );

                updateImage();

            }

        },
        {
            passive: false
        }
    );


    /* =========================
       Mobile Touch End
    ========================= */

    lightboxImage.addEventListener(
        "touchend",
        function (event) {

            if (
                event.touches.length === 0
            ) {

                touchMode = null;

            }

        }
    );


    /* =========================
       Calculate Pinch Distance
    ========================= */

    function getDistance(touch1, touch2) {

        const dx =
            touch1.clientX -
            touch2.clientX;

        const dy =
            touch1.clientY -
            touch2.clientY;

        return Math.sqrt(
            dx * dx +
            dy * dy
        );

    }


    /* =========================
       Mobile Single Tap
    ========================= */

    lightbox.addEventListener(
        "click",
        function (event) {

            /*
             Only background tap closes.
            */

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* =========================
       Mobile Tap Detection
    ========================= */

    lightboxImage.addEventListener(
        "touchend",
        function (event) {

            if (event.changedTouches.length !== 1) {
                return;
            }

            const now =
                Date.now();

            const timeSinceLastTap =
                now - lastTap;

            /*
             Double tap closes.
            */

            if (timeSinceLastTap < 300) {

                closeLightbox();

            }

            lastTap = now;

        }
    );


    /* =========================
       ESC
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                lightbox.classList.contains(
                    "active"
                )
            ) {

                closeLightbox();

            }

        }
    );

});
