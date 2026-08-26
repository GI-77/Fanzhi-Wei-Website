document.addEventListener("DOMContentLoaded", function () {

    /*
    =========================
    Create Lightbox
    =========================
    */

    const lightbox = document.createElement("div");

    lightbox.className = "image-lightbox";

    lightbox.innerHTML = `
        <img class="lightbox-image" src="" alt="">
    `;

    document.body.appendChild(lightbox);


    const lightboxImage =
        lightbox.querySelector(".lightbox-image");


    /*
    =========================
    Variables
    =========================
    */

    let scale = 2.5;

    const OPEN_SCALE = 2.5;

    const MIN_SCALE = 1.0;

    const MAX_SCALE = 4.0;


    let x = 0;

    let y = 0;


    let dragging = false;

    let dragStartX = 0;

    let dragStartY = 0;

    let startImageX = 0;

    let startImageY = 0;


    /*
    =========================
    Update image
    =========================
    */

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


    /*
    =========================
    Open Lightbox
    =========================
    */

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
    );


    /*
    =========================
    Double Click
    Image → Close
    =========================
    */

    lightboxImage.addEventListener(
        "dblclick",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            closeLightbox();

        }
    );


    /*
    =========================
    Mouse Wheel Zoom
    =========================
    */

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

            event.stopPropagation();


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


    /*
    =========================
    Start Drag
    =========================
    */

    lightboxImage.addEventListener(
        "mousedown",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            dragging = true;


            dragStartX =
                event.clientX;

            dragStartY =
                event.clientY;


            startImageX = x;

            startImageY = y;


            lightboxImage.classList.add(
                "dragging"
            );

        }
    );


    /*
    =========================
    Drag
    =========================
    */

    document.addEventListener(
        "mousemove",
        function (event) {

            if (!dragging) {
                return;
            }


            event.preventDefault();


            x =
                startImageX +
                (
                    event.clientX -
                    dragStartX
                );


            y =
                startImageY +
                (
                    event.clientY -
                    dragStartY
                );


            updateImage();

        }
    );


    /*
    =========================
    End Drag
    =========================
    */

    document.addEventListener(
        "mouseup",
        function () {

            if (!dragging) {
                return;
            }


            dragging = false;


            lightboxImage.classList.remove(
                "dragging"
            );

        }
    );


    /*
    =========================
    Close Background
    =========================
    */

    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /*
    =========================
    ESC
    =========================
    */

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


    /*
    =========================
    Close Function
    =========================
    */

    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "lightbox-open"
        );


        lightboxImage.src = "";


        scale = OPEN_SCALE;

        x = 0;

        y = 0;

    }

});
