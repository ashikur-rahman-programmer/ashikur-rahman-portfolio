document.addEventListener("DOMContentLoaded", () => {
  // --- Selectors ---
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menu-btn");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTopBtn = document.getElementById("back-to-top");
  const themeToggle = document.getElementById("theme-toggle");
  const professionText = document.getElementById("profession-text");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  // --- Hero Typing Animation ---
  const professions = ["Frontend Developer", "Programmer", "Freelancer"];
  let professionIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentProfession = professions[professionIndex];

    if (isDeleting) {
      professionText.textContent = currentProfession.substring(
        0,
        charIndex - 1,
      );
      charIndex--;
    } else {
      professionText.textContent = currentProfession.substring(
        0,
        charIndex + 1,
      );
      charIndex++;
    }

    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentProfession.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      professionIndex = (professionIndex + 1) % professions.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // --- 1. Theme Toggle & Persistence (Icon Fix) ---
  const applyTheme = (theme) => {
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);

    const icon = themeToggle.querySelector("i");
    // Dark Mode (Default): Moon Icon, Light Mode: Sun Icon
    if (theme === "dark-mode") {
      icon.classList.replace("fa-sun", "fa-moon");
    } else {
      icon.classList.replace("fa-moon", "fa-sun");
    }
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Sets default dark mode
    applyTheme("dark-mode");
  }

  themeToggle.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark-mode")
      ? "light-mode"
      : "dark-mode";
    applyTheme(newTheme);
  });

  // --- 2. Navbar & Scroll Effects ---
  window.onscroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 80);
    backToTopBtn.style.opacity = window.scrollY > 500 ? "1" : "0";
    backToTopBtn.style.pointerEvents = window.scrollY > 500 ? "auto" : "none";

    const sections = document.querySelectorAll("main section");
    sections.forEach((sec) => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 200;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          document
            .querySelector(".navbar a[href*=" + id + "]")
            .classList.add("active");
        });
      }
    });
  };

  // Mobile menu toggle
  menuBtn.onclick = () => {
    navbar.classList.toggle("active");
    menuBtn.classList.toggle("fa-xmark");
  };

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
      menuBtn.classList.remove("fa-xmark");
    });
  });

  // Scroll to top
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // --- 3. Skill Bar Animation (Triggered by Intersection Observer) ---
  function animateSkills(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skillItems = entry.target.querySelectorAll(".skill-item");
        skillItems.forEach((item) => {
          const progressBar = item.querySelector(".progress-bar");
          const dataProgress = progressBar.getAttribute("data-progress");
          progressBar.style.width = dataProgress + "%";
        });
        observer.unobserve(entry.target);
      }
    });
  }

  const skillsObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.5,
  });
  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // --- 4. Project Filter Logic (AOS refresh added) ---
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          card.style.display = "block";
          card.setAttribute("data-aos", "fade-up");
        } else {
          card.style.display = "none";
          card.removeAttribute("data-aos");
        }
      });
      AOS.refreshHard();
    });
  });

  // --- 5. Contact Form Validation ---
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!validateEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    // --- REPLACE THIS WITH YOUR EMAILJS/FORMSPREE INTEGRATION ---

    showMessage("Message sent successfully! I'll be in touch.", "success");
    contactForm.reset();
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  }

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    setTimeout(() => {
      formMessage.textContent = "";
      formMessage.className = "form-message";
    }, 5000);
  }

  // --- 6. Utility Functions & Preloader ---
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  window.onload = () => {
    // Preloader dismissal
    document.getElementById("preloader").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("preloader").style.display = "none";
    }, 500);

    // Start typing animation after preloader is done
    typeEffect();
  };
});
