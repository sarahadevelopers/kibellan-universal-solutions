 // Mobile nav toggle
      const hamburger = document.getElementById("hamburger");
      const navLinks = document.getElementById("nav-links");

      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });

      // Smooth scroll for "Request a Quote" button
      document
        .getElementById("quote-btn")
        .addEventListener("click", function () {
          location.href = "contacts.html";
        });

        // Partnership form submit
      const form = document.getElementById("partnership-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert(
          "Thank you for submitting your partnership inquiry! We will get back to you shortly."
        );
        form.reset();
      });

      // Newsletter subscribe button
      document
        .getElementById("subscribe-btn")
        .addEventListener("click", function () {
          const email = document.getElementById("newsletter-email").value;
          if (email.trim() === "") {
            alert("Please enter your email address.");
          } else {
            alert("Thank you for subscribing, " + email + "!");
            document.getElementById("newsletter-email").value = "";
          }
        });
        // testimonials
        const testimonials = document.querySelectorAll(".testimonial");
      let currentTestimonial = 0;

      setInterval(() => {
        testimonials[currentTestimonial].classList.remove("active");
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add("active");
      }, 4000); // change every 4 seconds