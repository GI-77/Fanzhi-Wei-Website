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

    /* =========================
       Mobile Touch State
    ========================= */

    let touchMode = null;

    let startDistance = 0;
    let startScale = 1;

    /*
       Prevent pinch gestures from
       being interpreted as double taps.
    */
    let isPinching = false;

    /*
       Used to distinguish a real tap
       from a drag / pinch gesture.
    */
    let touchMoved = false;


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

        touchMode = null;

        isPinching = false;

        touchMoved = false;

    }


    /* =========================
       Desktop Double Click
       DO NOT CHANGE
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
       DO NOT CHANGE
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
       DO NOT CHANGE
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
       DO NOT CHANGE
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
       DO NOT CHANGE
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
       Mobile / iPad Touch Start
    ========================= */

    lightboxImage.addEventListener(
        "touchstart",
        function (event) {

            event.preventDefault();

            touchMoved = false;


            /* =========================
               One Finger
            ========================= */

            if (event.touches.length === 1) {

                /*
                   Do not start a normal drag
                   while a pinch is active.
                */

                if (isPinching) {
                    return;
                }

                touchMode = "drag";

                startX =
                    event.touches[0].clientX;

                startY =
                    event.touches[0].clientY;

                startImageX = x;
                startImageY = y;

                return;
            }


            /* =========================
               Two Fingers
            ========================= */

            if (event.touches.length === 2) {

                /*
                   Enter pinch mode immediately.
                */

                touchMode = "pinch";

                isPinching = true;

                touchMoved = true;

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
       Mobile / iPad Touch Move
    ========================= */

    lightboxImage.addEventListener(
        "touchmove",
        function (event) {

            event.preventDefault();


            /* =========================
               One Finger Drag
            ========================= */

            if (event.touches.length === 1) {

                if (
                    touchMode !== "drag" ||
                    isPinching
                ) {
                    return;
                }

                const currentX =
                    event.touches[0].clientX;

                const currentY =
                    event.touches[0].clientY;


                /*
                   Detect actual movement.
                */

                if (
                    Math.abs(currentX - startX) > 5 ||
                    Math.abs(currentY - startY) > 5
                ) {

                    touchMoved = true;

                }


                x =
                    startImageX +
                    (
                        currentX -
                        startX
                    );

                y =
                    startImageY +
                    (
                        currentY -
                        startY
                    );

                updateImage();

                return;
            }


            /* =========================
               Two Finger Pinch
            ========================= */

            if (event.touches.length === 2) {

                touchMode = "pinch";

                isPinching = true;

                touchMoved = true;

                const distance =
                    getDistance(
                        event.touches[0],
                        event.touches[1]
                    );

                if (startDistance === 0) {
                    return;
                }

                scale =
                    startScale *
                    (
                        distance /
                        startDistance
                    );

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
       Mobile / iPad Touch End
    ========================= */

    lightboxImage.addEventListener(
        "touchend",
        function (event) {

            /*
               IMPORTANT:
               If this was a pinch gesture,
               do NOT run double-tap detection.
            */

            if (isPinching) {

                /*
                   Wait until ALL fingers
                   have left the screen.
                */

                if (
                    event.touches.length === 0
                ) {

                    isPinching = false;

                    touchMode = null;

                    touchMoved = false;

                    /*
                       Reset tap timer so the
                       pinch cannot become a
                       false double tap.
                    */

                    lastTap = 0;

                }

                return;

            }


            /* =========================
               Normal One Finger Touch End
            ========================= */

            if (
                event.changedTouches.length !== 1
            ) {
                return;
            }

            /*
               If the finger moved,
               this was a drag, not a tap.
            */

            if (touchMoved) {

                touchMode = null;

                touchMoved = false;

                return;

            }


            /*
               Double tap closes Lightbox.
            */

            const now =
                Date.now();

            const timeSinceLastTap =
                now - lastTap;


            if (
                timeSinceLastTap < 300
            ) {

                closeLightbox();

                lastTap = 0;

                return;

            }


            lastTap = now;

            touchMode = null;

        },
        {
            passive: false
        }
    );


    /* =========================
       Calculate Pinch Distance
    ========================= */

    function getDistance(
        touch1,
        touch2
    ) {

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
       Background Tap
    ========================= */

    lightbox.addEventListener(
        "click",
        function (event) {

            /*
               Only background click closes.
            */

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* =========================
       ESC
       DO NOT CHANGE
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
