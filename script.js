// Bit to make Finsweet's CMS Nest work with CMS Tabs
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsnest",
  (listInstances) => {
    window.fsAttributes.cmstabs.init();
  },
]);

// ------------------------------------------------------- //
// All code will happen after DOM content is loaded
window.addEventListener("DOMContentLoaded", (event) => {
  // Timothy Ricks' SCROLL FLIP POWER-UP
  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }
  gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);
  ScrollTrigger.normalizeScroll(true);

  // ------------------------------------------------------- //
  // Globally useful functions and settings
  // ------------------------------------------------------- //

  // Variable to check whether this is the home page
  const homeHeroSection = document.querySelector(".home-hero_section");

  // Get the current URL to check for page-specific code later
  const currentUrl = window.location.href;

  // Declare resizeTimer for event listeners later
  let resizeTimer;

  gsap.defaults({ duration: 0.8, ease: "power2.out" });

  // Randomly rotate given elements (i.e. the cards) by between -6 and +6 degrees
  function rotateElement(element) {
    // Generate a random rotation angle between -6 and 6 degrees
    const rotationAngle = Math.round(Math.random() * 12 - 6);

    // Apply the rotation to the given element
    element.style.transform = `rotate(${rotationAngle}deg)`;
  }

  // Function to check whether an element is taller than its container (Not currently used)
  function isOverflown(element) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }

  // GSAP Media query - initialise
  let mm = gsap.matchMedia();

  // ------------------------------------------------------- //
  // Global animation to fade and scale elements on scrolling into and out of screen
  // Only run on desktop

  mm.add("(min-width: 768px)", () => {
    $(".animate_scroll-in-out").each(function (index) {
      let tlIn = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          scrub: 1,
          ease: "power2.out",
          start: "top bottom",
          end: "bottom 80%",
        },
      });
      let tlOut = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          scrub: 1,
          ease: "power2.out",
          start: "top 20%",
          end: "bottom top",
        },
      });
      tlOut.to($(this), { opacity: 0, scale: 0.95, y: "-4rem" });
      tlIn.from($(this), { opacity: 0, scale: 0.95, y: "4rem" });
    });
  });

  // ------------------------------------------------------- //
  // Nav panel and overlay related functions
  // ------------------------------------------------------- //

  // ------------------------------------------------------- //
  // Nav Bar - Animate pips on hover
  var $navLinks = $(".nav_link");

  $navLinks.on("mouseenter", function () {
    var $pip = $(this).find(".nav_link-pip");

    // Check if the link is not currently active
    if (!$(this).hasClass("w--current")) {
      gsap.to($pip, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(4)",
      });
    }
  });

  $navLinks.on("mouseleave", function () {
    var $pip = $(this).find(".nav_link-pip");

    // Check if the link is not currently active
    if (!$(this).hasClass("w--current")) {
      gsap.to($pip, {
        scale: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  });

  // Set initial scale for currently active link
  gsap.set($(".nav_link.w--current").find(".nav_link-pip"), {
    scale: 1,
  });

  // ------------------------------------------------------- //
  // Pulse the accent icon on the "Try AI Guru" nav CTA

  var $navAiCta = $(".nav_cta-ai");
  var $navAccent = null; // Initialize $navAccent to null
  var isMouseOver = false; // Flag to track mouse hover state

  let tlAccentPulse = gsap.timeline({ repeat: -1 });

  // Function to check if the current page is named "iggy"

  function isAIPage() {
    return window.location.href.indexOf("ai") !== -1; // Check if "ai" is present in the URL
  }

  // Function to pulse the navAccent element ON MOUSE LEAVE THIS GIVES NO TIME TO RETURN
  function pulseNavAccent() {
    if (isAIPage() && !isMouseOver) {
      tlAccentPulse
        .to(
          $navAccent,
          {
            scale: 1.5,
            duration: 0.2,
            ease: "back.in(4)",
          },
          4
        )
        .to($navAccent, {
          scale: 1,
          duration: 0.2,
          ease: "back.out(4)",
        });
    }
  }

  // Function to stop the pulsing animation
  function stopPulseNavAccent() {
    if (isAIPage()) {
      gsap.killTweensOf($navAccent);
    }
  }

  $navAiCta.on("mouseenter", function () {
    $navAccent = $(this).find(".is-nav-accent");
    isMouseOver = true;
    stopPulseNavAccent(); // Stop pulsing animation
    gsap.to($navAccent, {
      scale: 1.5,
      duration: 0.2,
      ease: "back.out(4)",
    });
  });

  $navAiCta.on("mouseleave", function () {
    $navAccent = $(this).find(".is-nav-accent");
    isMouseOver = false;
    gsap.to($navAccent, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
    pulseNavAccent(); // Start pulsing animation if not currently hovering
  });

  // Set initial scale for the accent icon
  gsap.set($(".nav_cta-ai").find(".is-nav-accent"), {
    scale: 1,
  });

  // Initial pulse check
  pulseNavAccent();

  // ------------------------------------------------------- //
  // Animate the book preorder modal background "scribble"

  // Get all the preorder modal open buttons by class name
  var preorderOpenButtons = document.querySelectorAll(".preorder_button");

  // Get the preorder modal close button by class name (there is only one on any page, inside the modal)
  var modalCloseButton = document.querySelector(".modal_close-button");

  // Get the preorder modal element by class name
  var preorderModal = document.querySelector(".preorder_modal");

  const tlModalOpen = anime.timeline({
    autoplay: false,
    easing: "easeInOutCubic",
    update: function (anim) {
      if (anim.currentTime > 0) {
        preorderModal.style.display = "block";
      } else if (anim.currentTime === 0) {
        preorderModal.style.display = "none";
      }
    },
  });
  // Create an Anime.JS timeline for the modal opening including SVG animate
  tlModalOpen
    .add({
      targets: ".modal_background-svg-path",
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 2000,
    })
    .add(
      {
        targets: ".modal_scroll-container",
        opacity: [0, 1],
        translateY: ["6rem", "0rem"],
        duration: 800,
      },
      "-=800"
    )
    .add(
      {
        targets: ".modal_close-button",
        opacity: [0, 1],
        duration: 200,
      },
      "-=100"
    )
    .add(
      {
        targets: ".modal_image-bg",
        opacity: [0, 1],
        duration: 200,
      },
      "-=100"
    );

  // Add a click event listener to each open button
  preorderOpenButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Prevent screen scrolling
      //$(body).css("overflow", "hidden");

      if (tlModalOpen.direction === "reverse") {
        tlModalOpen.reverse();
        //anim.completed = false;
      }
      tlModalOpen.play();
    });
  });

  // Listen for the close button click
  modalCloseButton.addEventListener("click", function () {
    // Animate the svg drawing out
    tlModalOpen.reverse();
    tlModalOpen.play();

    // Re-enable page scrolling
    //$(body).css("overflow", "auto");
  });

  // ------------------------------------------------------- //
  // Scale the preorder links, tabs, buttons, and anything with animate_hover-pop class on hover

  // Scale up on hover in
  // Using event delegation because these elements are positioned dynamically by FS CMS-Nest

  // Function to handle button hover animation
  function addButtonHoverAnimation(container, targetSelector) {
    container.on("mouseenter", targetSelector, function () {
      gsap.to($(this), {
        scale: 1.1,
        duration: 0.2,
        ease: "back.out(4)",
      });
    });

    container.on("mouseleave", targetSelector, function () {
      gsap.to($(this), {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  }

  // Apply animation to modal buttons using event delegation
  addButtonHoverAnimation(
    $(".modal_layout-container"),
    ".preorder_tab, .fs_cmsnest_item, .modal_close-button"
  );

  // Apply animation to other buttons outside the modal using event delegation
  addButtonHoverAnimation($(document), ".animate_hover-pop");

  // ------------------------------------------------------- //
  // Card stacking
  // Function to check whether cards can be stacked
  // (Used on Book and AI pages)

  // Get all elements with the class name "card-stack_wrap"
  const cardStackWraps = document.querySelectorAll(".card-stack_wrap");

  // Function to check if any item is taller than the test element, which is hidden in the footer
  const checkCardStackItems = () => {
    // Get safe height (this is inside function to recalculate on resize)
    const cardTestElement = document.querySelector(".card-stack_test-height");
    const cardSafeHeight = cardTestElement.clientHeight;

    //console.log("Card safe height is ", cardSafeHeight);

    // Loop through each card-stack_wrap
    cardStackWraps.forEach((cardStackWrap) => {
      // Get all elements with the class name "card-stack_item" within the current card stack wrap
      const cardStackItems = cardStackWrap.querySelectorAll(".card-stack_item");

      // Create a flag to check if any item is taller than the viewport
      let isAnyItemTaller = false;

      // Loop through each card item to see if it's too tall
      cardStackItems.forEach((cardStackItem) => {
        // First, we need to reset the heights for the check (in case of resize)
        cardStackItem.style.position = "";
        cardStackItem.style.top = "";
        cardStackItem.style.paddingTop = "";
        cardStackItem.style.height = "";

        const cardElement = cardStackItem.firstChild;
        const cardHeight = cardElement.clientHeight;

        if (cardHeight > cardSafeHeight) {
          isAnyItemTaller = true;
        }
      });

      // If none of the items overflow the container, we can apply the stacking effect
      if (!isAnyItemTaller) {
        // Apply sticky styles
        cardStackItems.forEach((cardStackItem) => {
          cardStackItem.style.top = 0;
          cardStackItem.style.position = "sticky";
          cardStackItem.style.paddingTop = "8rem";
          cardStackItem.style.height = "100svh";
        });
      }
    });
  };

  // Initial check - Run when all images have loaded
  window.addEventListener("load", function () {
    checkCardStackItems();
  });

  // ------------------------------------------------------- //
  // HOME PAGE
  // ------------------------------------------------------- //

  // Only run this code if this is the home page (if homeHeroSection element is found)
  if (homeHeroSection) {
    // Function to calculate and set bottom padding
    function setBottomPadding() {
      // Get the elements
      var contentContainer = document.querySelector(".home_content-container");
      var scrollableContentWrap = document.querySelector(
        ".home-scrollable_content-wrap"
      );

      // Check if the content container exists
      if (contentContainer) {
        // Get the height of the content container
        var contentContainerHeight = contentContainer.offsetHeight;

        // Check if the height is greater than 100vh
        if (contentContainerHeight > window.innerHeight) {
          // Calculate the difference
          const difference = contentContainerHeight - window.innerHeight;

          // Set the bottom padding of the scrollable content wrap
          scrollableContentWrap.style.paddingBottom = difference + "px";
        } else {
          // If the height is not greater than 100vh, reset the padding
          scrollableContentWrap.style.paddingBottom = "0";
        }
      }
    }

    // Run the function on load
    window.addEventListener("load", setBottomPadding);

    // Run the function on resize
    window.addEventListener("resize", setBottomPadding);

    // ------------------------------------------------------- //
    // Move the homepage accent scribbles into their correct text spans
    $(".home-hero_span-wrap").each(function (index) {
      let relatedEl = $(".home-hero_span-element").eq(index);
      relatedEl.appendTo($(this));
    });

    // Animate the scribbles on load
    anime({
      targets: ".scribble-path",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 400,
      delay: anime.stagger(500),
    });
  }

  // ------------------------------------------------------- //
  // BOOK PAGE
  // ------------------------------------------------------- //

  // Only run this code if we are on the book page
  // Check if the URL includes the string "book"
  if (currentUrl.includes("book")) {
    // Only run this code at desktop sizes
    mm.add("(min-width: 768px)", () => {
      // ------------------------------------------------------- //
      // Slide the reviews in a circular x direction on scroll
      $(".reviews_list-item").each(function (index) {
        let tlXIn = gsap.timeline({
          scrollTrigger: {
            trigger: $(this),
            scrub: true,
            ease: "circ.out",
            start: "top bottom",
            end: "center 60%",
          },
        });
        let tlXOut = gsap.timeline({
          scrollTrigger: {
            trigger: $(this),
            scrub: true,
            start: "center 40%",
            end: "bottom top",
          },
        });
        tlXOut.fromTo($(this), { x: 0 }, { x: "30%", ease: "circ.in" });
        tlXIn.fromTo($(this), { x: "30%" }, { x: 0, ease: "circ.out" });
      });

      // ------------------------------------------------------- //
      // Book page - Slide the book horizontally and reveal the long-form reviews carousel at end of section

      const horizontalContainer = document.querySelector(
        ".reviews_horizontal-container"
      );
      const parentScrollContainer = document.querySelector(
        ".book-reviews_container"
      );

      // Calculate how far to move the container to position the right edge against container right edge
      function getHorizontalScrollDistance() {
        let horizontalContainerWidth = horizontalContainer.offsetWidth;
        return -(horizontalContainerWidth - parentScrollContainer.offsetWidth);
      }

      // Pin the horizontal section as you scroll this page section
      ScrollTrigger.create({
        trigger: ".book-reviews_container",
        start: "top top",
        end: "bottom top",
        pin: ".reviews_horizontal-container",
        pinSpacing: false,
      });

      // Move the horizontal section leftwards
      gsap.to(".reviews_horizontal-container", {
        x: getHorizontalScrollDistance,
        duration: 8,
        scrollTrigger: {
          trigger: ".book-reviews_container",
          start: "bottom bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // ------------------------------------------------------- //
      // TED Speaker images - position and move them from behind Chris

      function positionSecondaryImages() {
        const centerImage = document.querySelector(
          ".book-chris_image-wrap.is-chris"
        );
        const secondaryImages = document.querySelectorAll(
          ".book-chris_image-wrap.is-secondary"
        );

        // Calculate the center coordinates of the Chris image
        const centerX = centerImage.offsetLeft + centerImage.offsetWidth / 2;
        const centerY = centerImage.offsetTop + centerImage.offsetHeight / 2;

        // Adjust this multiplier to control how far out the speaker images are moved
        const radiusMultiplier = 1.75;

        const radius = (centerImage.offsetWidth * radiusMultiplier) / 2;

        // Divide the circle between number of images
        const angleStep = (2 * Math.PI) / secondaryImages.length;

        // Initial setting of the speaker images behind Chris
        secondaryImages.forEach((image, index) => {
          gsap.set(image, { x: 0, y: 0, scale: 0.8 });
        });

        // GSAP animation for all steps
        let tlChrisImages = gsap.timeline({
          scrollTrigger: {
            trigger: ".book-chris_text-wrap.is-second",
            toggleActions: "play none none reverse",
            start: "top bottom",
            end: "bottom center",
            scrub: 1.5,
          },
        });
        tlChrisImages
          .fromTo(".book-chris_images", { scale: 1 }, { scale: 0.4 })
          .to(secondaryImages, {
            x: (index) => {
              const angle = angleStep * index;
              return (
                centerX +
                radius * Math.cos(angle) -
                secondaryImages[index].offsetWidth / 2
              );
            },
            y: (index) => {
              const angle = angleStep * index;
              return (
                centerY +
                radius * Math.sin(angle) -
                secondaryImages[index].offsetHeight / 2
              );
            },
            scale: 0.4,
            duration: 0.5,
            ease: "power2.out",
            stagger: { amount: 0.5, from: "random" },
          })
          .to(".book-chris_image-wrap", {
            y: "-200vh",
            duration: 1,
            ease: "power2.in",
            stagger: { amount: 0.5, from: "random" },
          });
      }

      window.addEventListener("load", positionSecondaryImages);

      // End of media query - content below runs on all screens
    });

    // ------------------------------------------------------- //
    // Discover cards - apply rotation function

    // Get all elements with the class name "discover_card"
    const discoverCards = document.getElementsByClassName("book-discover_card");

    // Loop through each element and apply the rotateElement function
    for (var i = 0; i < discoverCards.length; i++) {
      rotateElement(discoverCards[i]);
    }

    // ------------------------------------------------------- //
    // Fade the second layer of the Amy picture as it scrolls

    let tlImageFade = gsap.timeline({
      scrollTrigger: {
        trigger: ".stories_layout.is-first",
        start: "top top",
        endTrigger: ".stories_layout.is-second",
        end: "bottom bottom",
        //scrub: 1,
        toggleActions: "play none none reverse",
      },
    });

    tlImageFade.fromTo(
      ".stories_amy-image.is-second",
      { opacity: 0 },
      { opacity: 1 }
    );

    // First parallax section - remove excess top space if animation can run
    document.querySelector(".parallax_container").style.marginTop = "-200px";

    // ------------------------------------------------------- //
    // Distribute story examples for the parallax section

    // If Javascript is able to run, set the parallax container height:
    // Only useful if using random (+ absolute) positioning for Y
    //document.querySelector(".story_examples-wrapper").style.height = "150rem";

    // Function to create parallax transform parameters
    function createParallaxParameters() {
      // These constants control how much we can jiggle the parallax items around
      const minRotate = -10;
      const maxRotate = 10;
      const minScalePercent = 80;
      const maxScalePercent = 120;
      const scale =
        Math.round(
          Math.random() * (maxScalePercent - minScalePercent) + minScalePercent
        ) / 100;
      const speedVariance = 400;

      // Generate some random values to transform the given element by as it scrolls
      return {
        xRatio: Math.round(Math.random() * 100) / 100,
        yRatio: Math.round(Math.random() * 100) / 100,
        rotateFrom:
          Math.round(
            10 * (Math.random() * (maxRotate - minRotate) + minRotate)
          ) / 10,
        rotateTo:
          Math.round(
            10 * (Math.random() * (maxRotate - minRotate) + minRotate)
          ) / 10,
        scale: scale,
        yFrom: Math.round(10 * (scale - 1) * speedVariance) / 10,
        yTo: Math.round(-10 * (scale - 1) * speedVariance) / 10,
      };
    }

    // Function to calculate and store random ratios for each element
    function setParallaxParameters(elements) {
      // Run through each parallax element and generate its transform parameters
      elements.forEach((element) => {
        const parallaxParameters = createParallaxParameters();
        // Store the parameters against each element so they can be recalled later
        // This is important so that the screen can be resized and the element positions can be calculated
        // as a constant proportion of the screen width, instead of being repositioned at random on each pixel of resize
        element.dataset.parallaxParameters = JSON.stringify(parallaxParameters);
      });
    }

    // Function to calculate actual x and y positions based on the stored ratios
    function calculatePositions(elements) {
      const parentContainer = document.querySelector(".story_examples-list");
      const containerWidth = parentContainer.offsetWidth;
      // Currently, we only position elements randomly in X. We can set position:absolute and then transform randomly in Y too,
      // but this can result in elements overlapping, particularly on mobile, so instead we allow them to just stack vertically
      // and only apply a small random Y transform for improved readability
      const containerHeight = parentContainer.offsetHeight;

      // Parse and sort the elements in order of the scale property
      const sortedElements = Array.from(elements).sort((a, b) => {
        const scaleA = JSON.parse(a.dataset.parallaxParameters).scale;
        const scaleB = JSON.parse(b.dataset.parallaxParameters).scale;
        return scaleA - scaleB;
      });

      // Loop through each sorted element
      sortedElements.forEach((element, index) => {
        // Read the paramaters we generated earlier
        const parallaxParameters = JSON.parse(
          element.dataset.parallaxParameters
        );

        // Assign z-index based on the elements' sorted-by-scale order
        element.style.zIndex = index;

        // Get the item inside the wrap element to use as scrolltrigger
        let triggerElement = element.firstChild;

        // Create GSAP timelines for each parallax animation
        gsap.fromTo(
          element,
          {
            x: `${
              parallaxParameters.xRatio * (containerWidth - element.offsetWidth)
            }px`,
            /*
          // Don't use random Y positioning
          y: `${
            parallaxParameters.yRatio *
              (containerHeight - element.offsetWidth) +
            parallaxParameters.yFrom
          }px`, */
            y: `${parallaxParameters.yFrom}px`,
            rotate: parallaxParameters.rotateFrom,
            scale: parallaxParameters.scale,
          },

          {
            /*
          // Don't use random Y positioning
          y: `${
            parallaxParameters.yRatio *
              (containerHeight - element.offsetWidth) +
            parallaxParameters.yTo
          }px`, */
            y: `${parallaxParameters.yTo}px`,
            rotate: parallaxParameters.rotateTo,
            scrollTrigger: {
              trigger: triggerElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });
      ScrollTrigger.refresh();
    }

    // Get all elements with the class name "story_example-item"
    const parallaxElements = document.querySelectorAll(
      ".story_example-item-wrap"
    );

    // Calculate and store parameters for each element
    setParallaxParameters(parallaxElements);

    // Initial application of positions
    calculatePositions(parallaxElements);

    // Recalculate the parallax item positions if the window is resized
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        calculatePositions(parallaxElements);
      }, 250);
    });

    // Refresh the scroll trigger locations after load plus a short delay
    window.addEventListener("load", function () {
      setTimeout(function () {
        ScrollTrigger.refresh();
      }, 1000); // 1000 milliseconds = 1 second
    });
  }

  // ------------------------------------------------------- //
  // AI PAGE
  // ------------------------------------------------------- //

  // Apply functions below only on AI page
  if (currentUrl.includes("ai")) {
    // ------------------------------------------------------- //
    // Hover effect to de-rotate the "Build your profile" tags

    function addTagHoverAnimation(element) {
      element.on("mouseenter", function () {
        gsap.to($(this), {
          rotate: 0,
          duration: 0.2,
          ease: "back.out(4)",
        });
      });

      element.on("mouseleave", function () {
        gsap.to($(this), {
          rotate: "",
          duration: 0.2,
          ease: "power2.out",
        });
      });
    }

    // Apply animation to the tags
    addTagHoverAnimation($(".ai-try_tag-fg"));

    // ------------------------------------------------------- //
    // Over-write the text in the Tigg chat bubbles

    const tlChatBrainstorm = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power2.inOut " },
    });

    const tlChatInspire = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power2.inOut " },
    });

    tlChatBrainstorm
      .to(".iggy_chat-text.is-brainstorm", { duration: 0.5, text: "" }, "2")
      .to(".iggy_chat-text.is-brainstorm", {
        duration: 1,
        text: "It's time to brainstorm...",
      })
      .to(".iggy_chat-text.is-brainstorm", { duration: 0.5, text: "" }, ">2")
      .to(".iggy_chat-text.is-brainstorm", {
        duration: 1,
        text: "What causes do you care about?",
      })
      .to(".iggy_chat-text.is-brainstorm", { duration: 0.5, text: "" }, ">2")
      .to(".iggy_chat-text.is-brainstorm", {
        duration: 1,
        text: "Let's consider your values",
      })
      .to(".iggy_chat-text.is-brainstorm", { duration: 0.5, text: "" }, ">2")
      .to(".iggy_chat-text.is-brainstorm", {
        duration: 1,
        text: "Your skills are a gift in waiting",
      });

    tlChatInspire
      .to(".iggy_chat-text.is-inspire", { duration: 0.5, text: "" }, "2")
      .to(".iggy_chat-text.is-inspire", {
        duration: 1,
        text: "How can I help with your next step?",
      })
      .to(".iggy_chat-text.is-inspire", { duration: 0.5, text: "" }, ">2")
      .to(".iggy_chat-text.is-inspire", {
        duration: 1,
        text: "What challenges are you facing?",
      })
      .to(".iggy_chat-text.is-inspire", { duration: 0.5, text: "" }, ">2")
      .to(".iggy_chat-text.is-inspire", {
        duration: 1,
        text: "Shall we make a plan?",
      });

    // ------------------------------------------------------- //
    // Iggy page - rotate the Brainstorm and Inspire cards

    // Select all elements with the classes .tigg_inspire_card and .tigg_brainstorm_card
    const elementsToRotate = document.querySelectorAll(
      ".tigg_inspire_card, .tigg_brainstorm_card"
    );

    // Apply rotateElement function to each selected element
    elementsToRotate.forEach((element) => {
      rotateElement(element);
    });
  }

  // ------------------------------------------------------- //
  // scrollflip component
  // This is currently just used to move the Amy picture on scroll
  $("[tr-scrollflip-element='component']").each(function (index) {
    let componentEl = $(this),
      originEl = componentEl.find("[tr-scrollflip-element='origin']"),
      targetEl = componentEl.find("[tr-scrollflip-element='target']"),
      scrubStartEl = componentEl.find("[tr-scrollflip-scrubstart]"),
      scrubEndEl = componentEl.find("[tr-scrollflip-scrubend]");
    let startSetting = attr(
        "top top",
        scrubStartEl.attr("tr-scrollflip-scrubstart")
      ),
      endSetting = attr(
        "bottom bottom",
        scrubEndEl.attr("tr-scrollflip-scrubend")
      ),
      staggerSpeedSetting = attr(
        0,
        componentEl.attr("tr-scrollflip-staggerspeed")
      ),
      staggerDirectionSetting = attr(
        "start",
        componentEl.attr("tr-scrollflip-staggerdirection")
      ),
      scaleSetting = attr(false, componentEl.attr("tr-scrollflip-scale")),
      breakpointSetting = attr(0, componentEl.attr("tr-scrollflip-breakpoint"));
    let componentIndex = index,
      timeline;
    // asign matching data flip ids
    originEl.each(function (index) {
      let flipId = `${componentIndex}-${index}`;
      $(this).attr("data-flip-id", flipId);
      targetEl.eq(index).attr("data-flip-id", flipId);
    });
    // create timeline
    function createTimeline() {
      if (timeline) {
        timeline.kill();
        gsap.set(targetEl, { clearProps: "all" });
      }
      $("body").addClass("scrollflip-relative");
      gsap.matchMedia().add(`(min-width: ${breakpointSetting}px)`, () => {
        const state = Flip.getState(originEl);
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scrubStartEl,
            endTrigger: scrubEndEl,
            start: startSetting,
            end: endSetting,
            scrub: 1,
          },
        });
        timeline.add(
          Flip.from(state, {
            targets: targetEl,
            scale: scaleSetting,
            stagger: {
              amount: staggerSpeedSetting,
              from: staggerDirectionSetting,
            },
          })
        );
      });
      $("body").removeClass("scrollflip-relative");
    }
    createTimeline();

    // ------------------------------------------------------- //
    // Update on window resize
    // This includes a debounce to prevent excessive recalculation on fast resizing
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        checkCardStackItems();
        createTimeline();
      }, 250);
    });
  });
});
